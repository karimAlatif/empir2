import * as THREE from 'three'
import TinyGesture from 'tinygesture'
import LoaderManager from '../utils/LoaderManager'
import Item from './Item'
import Step from './Step'

import {TextureTypeEnum, gridOptions, sceneOptions, animatedOptions} from '../configs/config'
import steps, { main } from '../configs/steps'
import assetOrder from '../configs/assetOrder'
import assetData from '../configs/assetData'

import { TweenMax } from 'gsap'

export default class MainSpace {

    constructor() {
        this.initConfig()
        this.init()
        if( !window.assets ) {
            this.loadAssets()
        } else {
            this.assets = window.assets
            this.initMainSpace()
        }
    }

    initConfig() {
        this.activeStep = 'intro'
        this.c = {
            dpr: window.devicePixelRatio >= 2 ? 2 : 1,
            startTime: Date.now(),
            size: {
                w: window.innerWidth,
                h: window.innerHeight
            },
            scrollPos: 0,
            scrolling: true,
            allowScrolling: true,
            autoMoveSpeed: 0,
            isMobile: this.isMobile(),
            holdingMouseDown: false,
            touchEnabled: ('ontouchstart' in window)
        }

        this.dom = {
            cursor: document.querySelector('.cursor'),
        }

        if( this.c.touchEnabled ) document.documentElement.classList.add('touch-enabled')

        this.activeIndex= 0;
        this.isPlayedBefore = false;

        this.steps = steps
        this.stepLocations = {}
        this.remainingSteps = []
        this.loaderEnabled = true
        this.isGyro = false

        this.isAnim =false;
        this.roadBlocks = [];
        this.grids = [];
        this.animsNum = [];

        this.roadBlockIndex = 0;
        this.activeRoadBlock = null;


        this.assetList = assetOrder
        console.log("Sds",  this.assetList)
        this.assetList.intro = main.into.textuers;
        this.assetList.end = main.end.textuers;
        this.assetData = assetData

        if( !this.loaderEnabled ){
            document.querySelector('.loading').style.display = 'none'
        } 
    }

    isMobile() {
        let a = navigator.userAgent||navigator.vendor||window.opera
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))
    }

    loadAssets() {
        let assetLoader = new LoaderManager( this.c.isMobile )
        if( this.loaderEnabled ) {
            setTimeout( () => {
                assetLoader.load( this.assetList, this.renderer ).then( assets => {
                    this.assets = assets
                    console.log('ASSETS LOADED', assets);
                    this.initMainSpace()
                    console.log("roadss !", this.roadBlocks)
                })
            }, 2000 )
        } else {
            assetLoader.load( this.assetList, this.renderer ).then( assets => {
                this.assets = assets
                this.initMainSpace()
            })
        }
    }
    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setPixelRatio( this.c.dpr )
        this.renderer.setSize( this.c.size.w, this.c.size.h )
        document.body.appendChild( this.renderer.domElement )
        this.PreventRefreshing()

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( steps.intro.bgColor)
        this.scene.fog = new THREE.Fog( steps.intro.bgColor, 1400, 2000 )
        if( this.c.size.w < 600 ) this.scene.scale.set( 0.4, 0.4, 1 )

        let cameraPosition = 800;

        const fov = 180 * ( 2 * Math.atan( this.c.size.h / 2 / cameraPosition ) ) / Math.PI // TODO: fix mobile scaling
        this.camera = new THREE.PerspectiveCamera( fov, this.c.size.w / this.c.size.h, 1, 2000 )
        this.camera.position.set( 0, this.loaderEnabled ? 2000 : 0, cameraPosition )

        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = this.camera.near
        this.raycaster.far = this.camera.far
        this.intersects = []
        this.linkIntersect = []
        this.frustum = new THREE.Frustum()
        this.cameraViewProjectionMatrix = new THREE.Matrix4()
        this.mouse = new THREE.Vector2()
        this.mousePerspective = new THREE.Vector2()

        window.addEventListener( 'devicemotion', event => {
            if( event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma ) {
                this.isGyro = true
            }
        })

    }

    getTargetObjByIndex(targetIndex, step){
        let targetObjIndex = Object.values(this.assets.textures[ step ]).findIndex((x)=> x.orderId === targetIndex);
        let objKey =  Object.keys(this.assets.textures[ step ])[targetObjIndex];
        if(objKey){
            return objKey;
        }
        else
            throw new Error("not obj ffffffffffffff")
    }   
    initMainSpace() {

        this.mainSpace = new THREE.Group()
        this.scene.add( this.mainSpace )
            
        this.textMat = new THREE.MeshBasicMaterial( { color: steps.intro.textColor, transparent: true } )
        this.captionTextMat = new THREE.MeshBasicMaterial( { color: 0x1b42d8, transparent: true, opacity: 0, visible: false } )
        this.alphaTextMat = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: .5, visible: false } )
        this.linkUnderlineMat = new THREE.MeshBasicMaterial( { color: 0x1b42d8, transparent: true, opacity: 0, visible: false } )
        this.textOutlineMat = new THREE.MeshBasicMaterial( { color: steps.intro.outlineTextColor, transparent: true } )
        this.contactTextMat = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } )

        this.sections = {}; 
        this.items = {}; 
        this.itemMeshes = [];            
        this.videoItems = [];

        let nextStepLocation = 0;

        for( let step in this.steps ) {

            this.sections[ step ] = new Step({
                mainSpace: mainSpace,
                section: step
            })
            if( step !== 'intro' && step !== 'end' ) {

                let zPosition = (this.sections[ step ].name.length < 1) ? 400 : 800, id
                let targetIndex = 0;
                for (let i = 0; i < Object.keys(this.assets.textures[ step ]).length; i++) {
                    let filename = this.getTargetObjByIndex(targetIndex, step);
                    let targetTextureData = this.assets.textures[ step ][filename];
                    id = `${step}/${filename}`
                    if(targetTextureData.type !== TextureTypeEnum.grid){
                        this.items[id] = new Item({
                            mainSpace: this,
                            texture: targetTextureData.texture,
                            positionId: targetTextureData.position,
                            type: targetTextureData.type,
                            data: this.assetData[ step ][ filename ],
                            step: step,
                            zPosition: zPosition,
                            isCenter:false,
                            overridePos:false,
                            nextStepLocation,
                        });
                        if(this.items[id].type === TextureTypeEnum.roadBlock && i === 0) //if it's roadBlockItem
                            this.mainVideoData = this.assetData[ step ][ filename ];

                        if(this.items[id].type === TextureTypeEnum.animatedNumber) //if it's roadBlockItem
                            this.animsNum.push({
                                texts: this.items[id].texts,
                                txtGeoms : this.items[id].txtGeoms,
                                orgTxtGeoms: this.items[id].orgTxtGeoms,
                                numGeoms: this.items[id].numGeoms, 
                                stops: [
                                    (this.items[id].position.z + nextStepLocation - animatedOptions.offset) * -1,
                                    (this.items[id].position.z + nextStepLocation - animatedOptions.offset - animatedOptions.endOffset ) * -1,
                                ]

                            });

                        this.sections[ step ].add( this.items[id] )
                    } else {

                        let stop0 = (this.items[Object.keys(this.items)[i-1]].position.z + nextStepLocation - gridOptions.startgridOffset) * -1;
                        this.grids.push({
                            items: [],
                            stops: [stop0],
                        });
                        zPosition+= gridOptions.gridOffset; //offset

                        //
                        let x = (sceneOptions.xPovit + gridOptions.xOffset) * -1;
                        let y = sceneOptions.yPovit;
                        targetTextureData.textures.forEach((semiTextureData,index) => {
                            id = `${step}/${filename}/${semiTextureData.name}`
                            this.items[id] = new Item({
                                mainSpace: this,
                                texture: semiTextureData.texture,
                                positionId: semiTextureData.position || Math.random() * 6,
                                type: TextureTypeEnum.standard,
                                data: this.assetData[ step ][ filename ][semiTextureData.name],
                                step: step,
                                zPosition: zPosition,
                                overridePos: new THREE.Vector2(x, y),
                            });
                            this.grids[this.grids.length-1].items.push( this.items[id]);
                            this.sections[ step ].add( this.items[id] );

                            if((index+1) % gridOptions.gridSize === 0){
                                x = (sceneOptions.xPovit + gridOptions.xOffset) * -1;
                                y -= gridOptions.itemSize
                            }
                            else{
                                x += gridOptions.itemSize;
                            }
                        });
                        this.grids[this.grids.length-1].stops.push( (this.items[id].position.z + nextStepLocation - gridOptions.gridOffset) * -1);
                    }
                    zPosition = this.items[id].zPosition + 450;
                    targetIndex++;
                }
            }
            let bbox = new THREE.Box3().setFromObject( this.sections[ step ] );
            this.sections[step].position.z = nextStepLocation
            this.stepLocations[step] = nextStepLocation + 900 ;
            let posOffset = 1500; // TODO: get from camera?
            if( step === 'intro' ) posOffset = 500
            if( step === 'step4' ) posOffset = 1500
            nextStepLocation += bbox.min.z - posOffset 

            this.mainSpace.add( this.sections[step] )

            if( step === 'end' ) this.stopScrollPos = this.sections[step].position.z
        }

        this.videoCount = this.videoItems.length - 1

        this.contactSection = new Step({
            mainSpace: mainSpace,
            section: 'contact'
        })
        this.contactSection.visible = false
        this.scene.add( this.contactSection )

        this.animate()
        this.initListeners()
        document.body.classList.add('ready')
        setTimeout(function () {
            document.getElementById('bar').style.display = 'none'
            animation.play()
        },1000)

    }
    
    backTo2D () {
        this.started = false;
        this.isAnim = true;
        document.querySelector('.loading').style.display = 'flex';

        var complete = () => {
            this.isAnim = false;
        };

        TweenMax.to( this.camera.position, 2, {
            y: 2000,
            ease: 'Expo.easeInOut'
        })

        TweenMax.to('.loading', 2, {
            y: '0%',
            ease: 'Expo.easeInOut',
            onComplete: complete
        })
    }
    startMoving() {

        this.isAnim = true;   
        const complete = () =>{
            document.querySelector('.loading').style.display = 'none';
            this.isAnim = false;   
            if(!this.isPlayedBefore){
                openModal(this.mainVideoData.videoData,()=>{this.open3D()});
                this.c.scrollPos = 2500;
            }
            else{
                this.open3D();
            }
        }

        TweenMax.to( '.loading', 2, {
            y: '-100%',
            ease: 'Expo.easeInOut',
            onComplete : complete
        })
    }
    open3D(){
        this.started = true;
        this.isPlayedBefore = true;
       TweenMax.to( this.camera.position, 2, {
            y: 0,
            ease: 'Expo.easeInOut'
        })
    }

    openTag( item ) {

        this.itemAnimating = true
        this.itemOpen = item
        this.origTimelinePos = this.mainSpace.position.z
        this.c.allowScrolling = false

        if( this.c.isMobile ) {
            let texture = item.mesh.material.uniforms.texture.value
            if( texture.mediaType === 'video' ) {
                texture.image.src = 'assets/' + texture.name
                texture.image.play()
            }
        }

        let posOffset = this.sections[ this.activeStep ].position.z;

        if( item.step !== this.activeStep ) {
            posOffset = this.sections[ this.remainingSteps[ this.remainingSteps.length - 2 ] ].position.z
        }

        TweenMax.to( item.position, 1.5, {
            x: 0,
            y: 0,
            ease: 'Expo.easeInOut',
            onComplete: () => {
                this.itemAnimating = false
                this.dom.cursor.dataset.cursor = 'cross'
            }
        })

        TweenMax.to( item.uniforms.progress, 1.5, {
            value: 1,
            ease: 'Expo.easeInOut'
        })

        TweenMax.to( this.mainSpace.position, 1.5, {
            z: -(posOffset - -item.position.z + 150),
            ease: 'Expo.easeInOut'
        })

        TweenMax.to( this.textMat, 1, {
            opacity: 0, 
            ease: 'Expo.easeInOut',
            onComplete: () => {
                this.textMat.visible = false
            }
        })

        TweenMax.to( this.captionTextMat, 2, {
            opacity: 1,
            ease: 'Expo.easeInOut',
            delay: 0.3,
            onStart: () => {
                this.captionTextMat.visible = true
            }
        })

        TweenMax.to( this.linkUnderlineMat, 2, {
            opacity: 0.4,
            ease: 'Expo.easeInOut',
            delay: 0.3,
            onStart: () => {
                this.linkUnderlineMat.visible = true
            }
        })

        TweenMax.to( this.alphaTextMat, 2, {
            opacity: .5,
            ease: 'Expo.easeInOut',
            delay: 0.3,
            onStart: () => {
                this.alphaTextMat.visible = true
            }
        })
        if( item.caption ) {

            TweenMax.fromTo( item.caption.position, 2, {
                z: -100
            }, {
                z: 0,
                delay: 0.2,
                ease: 'Expo.easeInOut',
                onStart: () => {
                    item.caption.visible = true
                }
            })

        }

        if( item.copyRight ) {

            TweenMax.fromTo( item.copyRight.position, 2, {
                z: -100
            }, {
                z: 0,
                delay: 0.2,
                ease: 'Expo.easeInOut',
                onStart: () => {
                    item.copyRight.visible = true
                }
            })

        }

        if( item.linkGroup ) {

            TweenMax.fromTo( item.linkGroup.position, 2, {
                z: -100
            }, {
                z: 0,
                delay: 0.3,
                ease: 'Expo.easeInOut',
                onStart: () => {
                    item.linkGroup.visible = true
                }
            })

        }
        
        let pos = new THREE.Vector2()

        for( let x in this.items ) {

            if( this.items[x].align === 0 ) pos.set( -700, 700 ) // bottom left
            if( this.items[x].align === 1 ) pos.set( 700, 700 ) // bottom right
            if( this.items[x].align === 2 ) pos.set( 700, -700 ) // top right
            if( this.items[x].align === 3 ) pos.set( -700, -700 ) // top left

            if( this.items[x] === item ) continue

            TweenMax.to( this.items[x].material.uniforms.opacity, 1.3, {
                value: 0,
                ease: 'Expo.easeInOut'
            })

            TweenMax.to( this.items[x].position, 1.3, {
                x: pos.x,
                y: pos.y,
                ease: 'Expo.easeInOut'
            })

        }

    }

    closeTag() {

        if( !this.itemAnimating && this.itemOpen ) {

            this.itemAnimating = true
            this.dom.cursor.dataset.cursor = 'pointer'

            if( this.c.isMobile ) {
                let texture = this.itemOpen.mesh.material.uniforms.texture.value
                if( texture.mediaType === 'video' ) {
                    texture.image.pause()
                    texture.image.src = ''
                    texture.image.load()
                }
            }

            TweenMax.to( this.itemOpen.position, 1.5, {
                x: this.itemOpen.origPos.x,
                y: this.itemOpen.origPos.y,
                ease: 'Expo.easeInOut'
            })

            TweenMax.to( this.mainSpace.position, 1.5, {
                z: this.origTimelinePos,
                ease: 'Expo.easeInOut',
                onComplete: () => {
                    this.c.allowScrolling = true
                    this.itemOpen = false
                    this.itemAnimating = false
                }
            })

            TweenMax.to( this.itemOpen.uniforms.progress, 1.5, {
                value: 0,
                ease: 'Expo.easeInOut'
            })

            TweenMax.to( this.textMat, 1.5, {
                opacity: 1,
                ease: 'Expo.easeInOut',
                onStart: () => {
                    this.textMat.visible = true
                }
            })

            TweenMax.to( [ this.captionTextMat, this.linkUnderlineMat, this.alphaTextMat ], 1, {
                opacity: 0, 
                ease: 'Expo.easeInOut',
                onComplete: () => {
                    this.captionTextMat.visible = false
                    this.alphaTextMat.visible = false
                    this.linkUnderlineMat.visible = false
                    if( this.itemOpen.caption ) this.itemOpen.caption.visible = false
                    if( this.itemOpen.linkGroup ) this.itemOpen.linkGroup.visible = false
                    if( this.itemOpen.copyRight ) this.itemOpen.copyRight.visible = false

                }
            })

            for( let x in this.items ) {

                if( this.items[x].active ) continue

                TweenMax.to( this.items[x].material.uniforms.opacity, 1.5, {
                    value: 1,
                    ease: 'Expo.easeInOut'
                })

                TweenMax.to( this.items[x].position, 1.5, {
                    x: this.items[x].origPos.x,
                    y: this.items[x].origPos.y,
                    ease: 'Expo.easeInOut',
                })

            }

        }
    
    }

    openCard( e ) {

        e.preventDefault()

        if( this.contactSection.isOpen ) return this.closeContact()

        this.dom.cursor.dataset.cursor = 'cross'

        this.contactSection.visible = true
        this.contactSection.isOpen = true
        this.c.allowScrolling = false
        this.linkUnderlineMat.visible = true
        this.linkUnderlineMat.opacity = 0.3

        TweenMax.to( this.camera.position, 2, {
            y: this.contactSection.position.y * this.scene.scale.y,
            ease: 'Expo.easeInOut',
            onComplete: () => {
                this.mainSpace.visible = false
            }
        })

    }

    closeContact() {

        this.mainSpace.visible = true
        this.contactSection.isOpen = false

        TweenMax.to( this.camera.position, 2, {
            y: 0,
            ease: 'Expo.easeInOut',
            onComplete: () => {
                this.contactSection.visible = false
                this.c.allowScrolling = true
                this.linkUnderlineMat.visible = false
                this.linkUnderlineMat.opacity = 0
            }
        })

    }

    scroll( e ) {
        let delta = normalizeWheelDelta(e)

        this.c.scrollPos += -delta * 60
        this.c.scrolling = true;        
        
        function normalizeWheelDelta( e ) {
            if(e.detail && e.wheelDelta)
                return e.wheelDelta/e.detail/40 * (e.detail>0 ? 1 : -1) // Opera
            else if( e.deltaY )
                return -e.deltaY / 60 // Firefox
            else
                return e.wheelDelta/120 // IE,Safari,Chrome
        }

    }

    mouseDown( e ) {
        e.preventDefault();

        this.c.holdingMouseDown = true;

        if( this.contactSection.isOpen ) {

            if( this.linkIntersect.length > 0 ) {
                if( this.linkIntersect[0].object.onClick )
                this.linkIntersect[0].object.onClick()
            } else {
                this.closeContact()
            }

        } else if( this.itemOpen  ) { //|| this.activeRoadBlock

            if( this.linkIntersect.length > 0 ) {
                if( this.linkIntersect[0].object.onClick )
                this.linkIntersect[0].object.onClick()
            } else {
                this.closeTag()
            }

        }else {
            if ( this.intersects.length > 0 ) {
                console.log("going to open ")
                if(this.intersects[0].object.parent.type === TextureTypeEnum.standard ){
                    this.openTag( this.intersects[0].object.parent )
                    this.dom.cursor.dataset.cursor = 'cross'
                }else if( this.intersects[0].object.parent.type === TextureTypeEnum.video ){
                        this.intersects[0].object.parent.showVideo();
                        this.c.holdingMouseDown = false;
                }else if( this.intersects[0].object.parent.parent) {
                    if( this.intersects[0].object.parent.parent.type === TextureTypeEnum.roadBlock){
                        this.intersects[0].object.parent.parent.videoBox.onClick();
                        this.c.holdingMouseDown = false;
                    } 
                }
            } else {
                    if(this.activeStep==="end" &&  this.linkIntersect.length > 0 && this.linkIntersect[0].object.onClick ){
                        this.dom.cursor.dataset.cursor = 'pointer';
                        this.linkIntersect[0].object.onClick()
                        return;
                    }

                this.dom.cursor.dataset.cursor = 'move'
                TweenMax.to( this.c, 0.5, {
                    delay: 0.7,
                    autoMoveSpeed: 20
                } )

            }

        }

    }

    mouseUp() {
        if( !this.itemOpen ) this.dom.cursor.dataset.cursor = 'pointer'
        this.c.holdingMouseDown = false
        TweenMax.killTweensOf( this.c, { autoMoveSpeed: true } )
        this.c.autoMoveSpeed = 0
    }

    mouseMove( e ) {
        if( !this.contactSection.isOpen && !this.itemOpen && !this.c.holdingMouseDown ) {
            this.mouse.x = ( e.clientX / this.renderer.domElement.clientWidth ) * 2 - 1
            this.mouse.y = - ( e.clientY / this.renderer.domElement.clientHeight ) * 2 + 1

            this.raycaster.setFromCamera( this.mouse, this.camera )

            this.intersects = this.raycaster.intersectObjects( this.itemMeshes )

            // if( this.intersects[0].object.parent.parent && this.intersects[0].object.parent.parent.type === TextureTypeEnum.roadBlock){
            //     this.intersects[0].object.parent.parent.videoBox.onClick();
            //     this.c.holdingMouseDown = false;
            // }else{
            //     this.openTag( this.intersects[0].object.parent )
            //     this.dom.cursor.dataset.cursor = 'cross'
            // }
            // item.uniforms.progress
            if ( this.intersects.length > 0 ) {
                if(this.intersects[0].object.parent.uniforms){
                    if(this.selectedItem && this.selectedItem.uuid !== this.intersects[0].object.parent.uuid){
                        this.hoverAnim(this.selectedItem, 0);
                        this.selectedItem =  this.intersects[0].object.parent;
                    }else{
                        this.selectedItem =  this.intersects[0].object.parent;
                    }
                    if(!this.colorInAction){
                        this.hoverAnim(this.selectedItem, 0.8);
                    }
                    // if(this.selectedItem.type === TextureTypeEnum.standard)
                }
                this.dom.cursor.dataset.cursor = 'eye'
            } else if ( this.dom.cursor.dataset.cursor !== 'pointer' ) {
                this.dom.cursor.dataset.cursor = 'pointer'
                if(this.selectedItem){
                    this.hoverAnim(this.selectedItem, 0.0);
                    this.selectedItem = null;
                }
            }
        }
        
        if( (!this.contactSection.isOpen && this.itemOpen && this.itemOpen.linkBox) || 
              this.activeStep==="end" ) {
                
            this.linkIntersect = null;
            this.mouse.x = ( e.clientX / this.renderer.domElement.clientWidth ) * 2 - 1
            this.mouse.y = - ( e.clientY / this.renderer.domElement.clientHeight ) * 2 + 1
            this.raycaster.setFromCamera( this.mouse, this.camera )

            if(this.activeStep==="end"){
                this.linkIntersect = this.raycaster.intersectObject( this.sections["end"].linkBox )
                if ( this.linkIntersect.length > 0 ) {
                    this.dom.cursor.dataset.cursor = 'eye'
                } 
            }else{
                this.linkIntersect = this.raycaster.intersectObject( this.itemOpen.linkBox )
           
                if ( this.linkIntersect.length > 0 ) {
                    this.dom.cursor.dataset.cursor = 'eye'
                } else if ( this.dom.cursor.dataset.cursor !== 'cross' ) {
                    this.dom.cursor.dataset.cursor = 'cross'
                }
            }
        }

        if( this.contactSection.isOpen ) {

            this.mouse.x = ( e.clientX / this.renderer.domElement.clientWidth ) * 2 - 1
            this.mouse.y = - ( e.clientY / this.renderer.domElement.clientHeight ) * 2 + 1

            this.raycaster.setFromCamera( this.mouse, this.camera )
            this.linkIntersect = this.raycaster.intersectObject( this.contactSection.linkBox )
            
            if ( this.linkIntersect.length > 0 ) {
                this.dom.cursor.dataset.cursor = 'eye'
            } else if ( this.dom.cursor.dataset.cursor !== 'cross' ) {
                this.dom.cursor.dataset.cursor = 'cross'
            }
        }

        this.mousePerspective.x = e.clientX / window.innerWidth - 0.5
        this.mousePerspective.y = e.clientY / window.innerHeight - 0.5
        this.updatingPerspective = true

        if( !this.c.touchEnabled ) {
            TweenMax.to( '.cursor', .5, {
                x: e.clientX,
                y: e.clientY,
                ease: 'Power4.easeOut'
            })
        }
    }

    updatePerspective() {

        TweenMax.to( this.camera.rotation, 4, {
            x: -this.mousePerspective.y * 0.1,
            y: -this.mousePerspective.x * 0.1,
            ease: 'Power4.easeOut',
        })
        this.updatingPerspective = false
    }

    updateOrientation( e ) {

        if( !this.initialOrientation ) {
            this.initialOrientation = { gamma: e.gamma, beta: e.beta }
        }
        TweenMax.to( this.camera.rotation, 2, {
            x: e.beta ? (e.beta - this.initialOrientation.beta) * (Math.PI / 300) : 0,
            y: e.gamma ? (e.gamma - this.initialOrientation.gamma) * (Math.PI / 300) : 0,
            ease: 'Power4.easeOut',
        })
    }

    changeColours( override = false ) {

        this.remainingSteps = Object.keys( this.stepLocations ).filter( key => {
            return this.mainSpace.position.z > -this.stepLocations[key] // TODO: look into detecting if exists in camera
        } )
        if( override || ( this.remainingSteps[ this.remainingSteps.length - 1 ] && this.activeStep !== this.remainingSteps[ this.remainingSteps.length - 1 ] ) ) {
            if( override ) {
                this.activeStep = override
            } else {
                this.activeStep = this.remainingSteps[ this.remainingSteps.length - 1 ]
            }

            document.getElementById('fp-nav').children[0].children[this.activeIndex].children[0].className="";
            if(this.activeStep==="end"){
                this.activeIndex = Object.keys( this.steps ).length-1;
            }else{
                this.activeIndex = Number(this.activeStep[this.activeStep.length-1])
            }
            this.activeIndex--;
            document.getElementById('fp-nav').children[0].children[this.activeIndex].children[0].className="active";

            let bgColor = new THREE.Color( this.steps[ this.activeStep ].bgColor )
            let textColor = new THREE.Color( this.steps[ this.activeStep ].textColor )
            let tintColor = new THREE.Color( this.steps[ this.activeStep ].tintColor )
            let interfaceColor

            TweenMax.to( this.scene.fog.color, 1, {
                r: bgColor.r,
                g: bgColor.g,
                b: bgColor.b,
                ease: 'Power4.easeOut'
            })

            TweenMax.to( this.scene.background, 1, {
                r: bgColor.r,
                g: bgColor.g,
                b: bgColor.b,
                ease: 'Power4.easeOut'
            })

            TweenMax.to( this.textMat.color, 1, {
                r: textColor.r,
                g: textColor.g,
                b: textColor.b,
                ease: 'Power4.easeOut'
            })

            TweenMax.set( [ this.captionTextMat.color, this.linkUnderlineMat.color ], {
                r: textColor.r,
                g: textColor.g,
                b: textColor.b
            })

            for( let id in this.items ) {

                TweenMax.to( this.items[id].uniforms.gradientColor.value, 1, {
                    r: tintColor.r,
                    g: tintColor.g,
                    b: tintColor.b,
                    ease: 'Power4.easeOut'
                })

            }

            if( this.steps[ this.activeStep ].outlineTextColor ) {

                let outlineTextColor = new THREE.Color( this.steps[ this.activeStep ].outlineTextColor )
                interfaceColor = outlineTextColor

                TweenMax.to( [ this.textOutlineMat.color ], 1, {
                    r: outlineTextColor.r,
                    g: outlineTextColor.g,
                    b: outlineTextColor.b,
                    ease: 'Power4.easeOut'
                })
                
            } else {

                interfaceColor = textColor
    
            }

            if( this.steps[ this.activeStep ].contactColor ) 
                this.contactTextMat.color.set( this.steps[ this.activeStep ].contactColor )
            else
                this.contactTextMat.color.set( 0xFFFFFF )

        }

    }

    handleVideos() {

        this.camera.updateMatrixWorld();
        this.camera.matrixWorldInverse.getInverse( this.camera.matrixWorld );
        this.cameraViewProjectionMatrix.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse );
        this.frustum.setFromMatrix( this.cameraViewProjectionMatrix );

        for( let i = 0; i < this.videoCount; i++ ) {

            if( this.frustum.intersectsObject( this.videoItems[ i ] ) && this.videoItems[ i ].material.uniforms.texture.value.image.paused ) {
                this.videoItems[ i ].material.uniforms.texture.value.image.play()
                continue
            }
            
            if ( !this.frustum.intersectsObject( this.videoItems[ i ] ) && !this.videoItems[ i ].material.uniforms.texture.value.image.paused ) {
                this.videoItems[ i ].material.uniforms.texture.value.image.pause()
            }

        }

    }
    refresh(){
        this.c.scrolling = true
        let delta = ( this.c.scrollPos - this.mainSpace.position.z ) / 12
        this.mainSpace.position.z += delta
    }

    animate() {

        this.animationId = requestAnimationFrame( this.animate.bind(this) )

        if( !this.c.touchEnabled && this.updatingPerspective ) {
            this.updatePerspective()
            this.updatingPerspective = false
        }

        if( this.c.autoMoveSpeed > 0 ) {
            this.c.scrolling = true
            this.c.scrollPos += this.c.autoMoveSpeed
        }
        // smooth scrolling
        if( this.c.allowScrolling && this.c.scrolling && this.started ) {
            if( this.c.scrollPos <= -5 ) {
                this.backTo2D();
                this.c.scrollPos = 0
            }
            if( this.c.scrollPos >= -this.stopScrollPos ) this.c.scrollPos = -this.stopScrollPos
            if( this.roadBlockIndex < this.roadBlocks.length && this.c.scrollPos >= this.roadBlocks[this.roadBlockIndex].zPos ) {
                this.activeRoadBlock = this.roadBlocks[this.roadBlockIndex];
                this.c.scrollPos = this.roadBlocks[this.roadBlockIndex].zPos;
            }else {
                this.activeRoadBlock = null;
            }
            //
            let delta = ( this.c.scrollPos - this.mainSpace.position.z ) / 12
            if( this.c.scrollPos >= this.animsNum[0].stops[0] && this.c.scrollPos <= this.animsNum[0].stops[1] ){ 
                if(this.c.scrollPos >= this.animsNum[0].stops[1] -animatedOptions.stopOffset){ //end
                    for (let k = 1; k < this.animsNum[0].texts.length; k++) {
                        this.animsNum[0].texts[0].geometry = this.animsNum[0].numGeoms[0];
                        this.animsNum[0].texts[k].geometry = this.animsNum[0].txtGeoms[k-1];                        
                    }
                }else{ //progresss
                    let dif = (this.animsNum[0].stops[1] - animatedOptions.stopOffset) - this.animsNum[0].stops[0];
                    dif/= this.animsNum[0].numGeoms.length;
                    for (let l = 0; l < this.animsNum[0].numGeoms.length - 1; l++) {
                        if( this.c.scrollPos >= this.animsNum[0].stops[0] + (dif*l)){
                            this.animsNum[0].texts[0].geometry = this.animsNum[0].numGeoms[ (this.animsNum[0].numGeoms.length-1) - l];
                        }
                    }
                    //forTexts
                    for (let k = 1; k < this.animsNum[0].texts.length; k++) {
                        this.animsNum[0].texts[k].geometry = this.animsNum[0].orgTxtGeoms[k-1];                        
                    }
                }    
                
            }

            // if( this.c.scrollPos >= this.grids[0].stops[0] && this.c.scrollPos <= this.grids[0].stops[1] ){                
            //     if( this.c.scrollPos <= this.grids[0].stops[0] + gridOptions.startgridStep){//fristpart
            //         this.grids[0].items.forEach((item)=>{
            //             item.position.z = item.startZ = (item.zPosition + Math.random() * 1500) * -1;
            //         });
            //         this.grids[0].isActive = false;
            //     }else{
            //         this.grids[0].isActive = true;
            //         // this.scene.fog.far=3500;
            //     }

            //     if(this.grids[0].isActive){
            //         this.grids[0].items.forEach((item)=>{
            //             if(delta > 0 && item.position.z < (item.zPosition * -1) ){
            //                 item.position.z += delta * 1.5;
            //             }else if( delta <= 0  && item.position.z > (item.startZ) ){
            //                 item.position.z += delta * Math.random() * (2 - (1)) + (1);

            //             }
            //         });
            //     }

            // }else{
            //     // this.scene.fog.far=2000;
            //     //exsit
            // }

            this.mainSpace.position.z += delta

            if( !this.c.isMobile && Math.abs( delta ) < 10 ) this.handleVideos()
            this.changeColours()


            if( Math.abs( delta ) > 0.1 ) {
                this.c.scrolling = true
            } else {
                this.c.scrolling = false
            }
        }

        if( this.controls ) this.controls.update()

        this.renderer.render(this.scene, this.camera)

    }

    resize() {
        this.c.size = {
            w: window.innerWidth,
            h: window.innerHeight
        }
        this.camera.fov = 180 * ( 2 * Math.atan( this.c.size.h / 2 / this.camera.position.z ) ) / Math.PI
        this.camera.aspect = this.c.size.w / this.c.size.h
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( this.c.size.w, this.c.size.h )
    }

    initListeners() {

        this.resize = this.resize.bind( this )
        this.mouseMove = this.mouseMove.bind( this )
        this.scroll = this.scroll.bind( this )
        this.mouseDown = this.mouseDown.bind( this )
        this.mouseUp = this.mouseUp.bind( this )
        this.openCard = this.openCard.bind( this )
        this.startMoving = this.startMoving.bind( this )

        this.renderer.domElement.addEventListener( 'resize', this.resize, false )
        window.addEventListener( 'mousemove', this.mouseMove, false )
        this.renderer.domElement.addEventListener( 'mousedown', this.mouseDown, false )
        this.renderer.domElement.addEventListener( 'mouseup', this.mouseUp, false )
        this.renderer.domElement.addEventListener( 'wheel', this.scroll, false )

        if( this.isGyro ) {
            this.updateOrientation = this.updateOrientation.bind( this )
            window.addEventListener( 'deviceorientation', this.updateOrientation )
        }

        if( this.loaderEnabled ) document.getElementById("barTitle").innerHTML= 'Scroll to explore, <br>click to play video and expand images.';

        window.addEventListener('resize', this.resize);

        window.addEventListener('wheel', () => {   
            if(this.loaderEnabled && !this.started && !this.isAnim )
                this.startMoving();
        });

        window.addEventListener("touchmove",  () => {    
            if(this.loaderEnabled && !this.started && !this.isAnim)
                this.startMoving();
        }, false);

        this.tinyGesture = new TinyGesture( this.renderer.domElement, { mouseSupport: false } )
        this.tinyGesture.on( 'panmove', e => {
            this.c.scrollPos += -this.tinyGesture.velocityY * 6
            this.c.scrolling = true;

        })
        this.tinyGesture.on( 'panend', e => this.c.autoMoveSpeed = 0 )
        this.tinyGesture.on( 'longpress', e => this.c.autoMoveSpeed = 10 )

        if( !this.c.touchEnabled ) {
            this.dom.cursor.dataset.cursor = 'pointer'
        }
    }

    PreventRefreshing() { //need to adjust animations
        var prevent = false;
    
        this.renderer.domElement.addEventListener('touchstart', function(e){
          if (e.touches.length !== 1) { return; }
    
          var scrollY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
          prevent = (scrollY === 0);
        });
    
        this.renderer.domElement.addEventListener('touchmove', function(e){
          if (prevent) {
            prevent = false;
            e.preventDefault();
          }
        });
    }

    adjustNextRoadBlock () {
        console.log("S roadBlocks d", this.roadBlocks)
        // this.roadBlocks.splice(this.roadBlockIndex,1);
        this.roadBlockIndex++;
        this.activeRoadBlock= null;
    }

    hoverAnim(item, value){
        const complete = () =>{
            if(value === 0){
                item.uniforms.progress.value=value;
            }
        }

        if(value !== 0){
            this.colorInAction = true;
            if(this.selectedItem)
                this.selectedItem.uniforms.progress.value = 0;
        }
        else
            this.colorInAction = false;


        TweenMax.to( item.uniforms.progress, .65, {
            value: value,
            ease: 'Expo.easeInOut',
            onComplete: complete,
        })
    }

    //Temp Open 
    // openCard( e ) {

    //     e.preventDefault()

    //     if( this.contactSection.isOpen ) return this.closeContact()

    //     this.dom.cursor.dataset.cursor = 'cross'

    //     // this.linkUnderlineMat.visible = true
    //     // this.linkUnderlineMat.opacity = 0.3

    //     TweenMax.to( this.camera.position, 2, {
    //         y: this.contactSection.position.y * this.scene.scale.y,
    //         ease: 'Expo.easeInOut',
    //         onComplete: () => {
    //             this.mainSpace.visible = false
    //         }
    //     })

    // }


}

