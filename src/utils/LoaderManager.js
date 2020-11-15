import progressPromise from '../utils/progressPromise'
import {TextureTypeEnum} from '../configs/config'

export default class LoaderManager {

    constructor( isMobile ) {

        this.isMobile = isMobile
        this.assets = {
            textures: {},
            fonts: {},
            // data:{},
        }
        this.assetList = {}
        this.gridTextures = [];
        this.renderer = null
        this.bar = document.getElementById("bar");        
        this.videosToLoad = 0
    }

    load( assetList, renderer ) {

        this.assetList = assetList
        this.renderer = renderer
        let assetLoadPromises = []

        let imageLoader = new THREE.TextureLoader()
        imageLoader.crossOrigin = ''

        let preload = true

        for( let step in this.assetList ) {
            this.assetList[step].forEach( (textureData,index) => {
                    if(textureData.type !== TextureTypeEnum.grid){
                            this.initItem(assetLoadPromises, imageLoader, preload, step, textureData, textureData.name , index)
                    }
                    else{
                        this.gridTextures=[];
                        textureData.textures.forEach(semiTextureData =>{
                            this.initItem(assetLoadPromises, imageLoader, preload, step, semiTextureData, `${textureData.name}/${semiTextureData.name}`, index)
                        });
                        if( !this.assets.textures[ step ] ) this.assets.textures[ step ] = {}
                        this.assets.textures[ step ][ textureData.name ] = {
                            textures: this.gridTextures,
                            type: textureData.type,
                            orderId:index,
                        };
                    }
            })
        }
        // public\fonts\HelveticaNeue_Medium.json
        // Load Fonts
        let fontLoader = new THREE.FontLoader()
        let fonts = [
            //'fonts/suisse.json',
            'fonts/HelveticaNeue_Medium.json',
            'fonts/TimesNewRomanPSMT.json',
            // 'fonts/HelveticaNeue.json',
        ]

        for( let i = 0; i < fonts.length; i++ ) {
            assetLoadPromises.push( new Promise( resolve => fontLoader.load( fonts[i], font => {
                this.assets.fonts[ font.data.familyName ] = font
                resolve() 
            } ) ) )
        }

        return new Promise( resolve => {
            progressPromise( assetLoadPromises, this.update.bind(this) ).then( () => {
                resolve( this.assets )
            });
        })

    }
    update( completed, total ) {
        let progress = Math.round( completed / total * 100 )
        this.bar.style.width = progress + '%';
    }

    videoSync( video, textureData, index, step, filename, resolve, retry ) {
        if( retry ) video.load()
        if( !this.isMobile) video.oncanplaythrough = () => this.initVideoTexture( video, textureData, index, step, filename, resolve )
        else {
            video.onloadeddata = () => {
                console.log( 'onloaded', video.src, video.error )
                video.onerror = null
                this.initVideoTexture( video, textureData, index, step, filename, resolve )
            }
            video.onerror = () => {
                console.log( 'onerror', video.src, video.error )
                video.onloadeddata = null
                this.videoSync( video, textureData, index, step, filename, resolve, true )
            }
        }
    }
    initImageTexure( texture, textureData, index, step, filename, resolve ) {
        
        // if preloaded
        if( resolve ) {

            texture.size = new THREE.Vector2( texture.image.width / 2, texture.image.height / 2 )
            texture.needsUpdate = true
            this.renderer.setTexture2D( texture, 0 )

            texture.name = `${step}/${filename}`
            texture.mediaType = 'image'
            texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()

            if( !this.assets.textures[ step ] ) this.assets.textures[ step ] = {}
                let resultObj = {
                    texture: texture,
                    position: textureData.position,
                    type: textureData.type,
                    orderId:index,
                };
                if(textureData.type)
                    this.assets.textures[ step ][ filename ] = resultObj
                else{
                    resultObj.name = textureData.name;
                    this.gridTextures.push(resultObj);
                }

        
            resolve( texture )

        } else {

            let texture = new THREE.TextureLoader().load( `assets/${step}/${filename}`, texture => {

                texture.size = new THREE.Vector2( texture.image.width / 2, texture.image.height / 2 )
                texture.needsUpdate = true
                this.renderer.setTexture2D( texture, 0 )

            } )
            texture.size = new THREE.Vector2( 10, 10 )

            texture.name = `${step}/${filename}`
            texture.mediaType = 'image'
            texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()

            if( !this.assets.textures[ step ] ) this.assets.textures[ step ] = {}
            let resultObj = {
                texture: texture,
                position: textureData.position,
                type: textureData.type,
                orderId:index,
            };
            if(textureData.type)
                this.assets.textures[ step ][ filename ] = resultObj
            else
                this.gridTextures.push(resultObj);

            
        }

    }
    initVideoTexture( video, textrueData, index, step, filename, resolve, reject ) {

        let texture = new THREE.VideoTexture( video )
        texture.minFilter = texture.magFilter = THREE.LinearFilter
        texture.name = `${step}/${filename}`
        texture.mediaType = 'video'
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()

        // if preloaded
        if( resolve ) {

            texture.size = new THREE.Vector2( texture.image.videoWidth / 2, texture.image.videoHeight / 2 )
            this.renderer.setTexture2D( texture, 0 )

            if( !this.isMobile) {
                video.oncanplaythrough = null
            } else {
                video.src = ''
                video.load()
                video.onloadeddata = null
            }

            resolve( texture )

        } else {

            texture.size = new THREE.Vector2( 1, 1 )

            video.oncanplaythrough = () => {
                texture.size = new THREE.Vector2( texture.image.videoWidth / 2, texture.image.videoHeight / 2 )
                texture.needsUpdate = true
                video.oncanplaythrough = null
            }

        }

        if( !this.assets.textures[ step ] ) this.assets.textures[ step ] = {}
        this.assets.textures[ step ][ filename ] = {
            texture: texture,
            position: textrueData.position,
            type: textrueData.type,
            orderId:index,
        }; 

    }
    initItem (assetLoadPromises, imageLoader, preload, step, textureData, name, index) {
        if( ~textureData.name.indexOf( '.mp4' ) ) {
            let video = document.createElement( 'video' );
            video.style = 'position:absolute;height:0'
            video.muted = true
            video.autoplay = false
            video.loop = true
            video.crossOrigin = 'anonymous'
            video.setAttribute('muted', true)
            video.setAttribute('webkit-playsinline', true)
            video.preload = 'metadata'
            video.src = `assets/${step}/${name}`
            document.body.appendChild( video )
            video.load() 
            if( preload ) {
                assetLoadPromises.push( new Promise( (resolve, reject) => {
                    this.videoSync( video, textureData, index, step, name, resolve )
                } ) )
            }

        } else {
            if( preload ) {
                assetLoadPromises.push( new Promise( resolve => {
                    imageLoader.load( `assets/${step}/${name}`, texture => this.initImageTexure( texture, textureData, index, step, name, resolve ) )
                }))
            } 
        }
    }
}