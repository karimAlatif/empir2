import * as THREE from 'three'
import { main } from '../configs/steps'
import frag from './shaders/standard.frag'
import vert from './shaders/varying.vert'

export default class Step extends THREE.Group {

    constructor( opts = { mainSpace, section } ) {

        super()
        Object.assign( this, opts )
        if( this.section === 'intro' ) this.createIntroSection()
        else if( this.section === 'end' ) this.createEndSection()
        else if( this.section === 'contact' ) this.createPopSection()
        else this.init()
    }

    init() {

        let nameArr = this.name = this.mainSpace.steps[ this.section ].name;

        let startY= nameArr.length * 29;
        for (let i = 0; i < nameArr.length; i++) {
            let text = nameArr[i];

            let textGeom = new THREE.TextGeometry( text, {
                font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
                size: 130,
                height: 0,
                curveSegments: 10
            } ).center()


            let stepNameMesh = new THREE.Mesh( textGeom, this.mainSpace.textMat )
            stepNameMesh.position.set( 0, startY, 0 )
            this.add( stepNameMesh )
            startY -= 180; //test height
        }
    }

    createIntroSection() {

        let startY= 75;

        for (let i = 0; i < main.into.title.length; i++) {
            let text = main.into.title[i];

            let textGeom = new THREE.TextGeometry( text, {
                font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
                size: 28,
                height: 0,
                curveSegments: 4
            } ).center()

            let textMesh = new THREE.Mesh( textGeom, this.mainSpace.textMat )
            textMesh.position.set(0,startY,0)
            this.add( textMesh )
            startY -= 60; //test height
        }

    }


    createEndSection() {

        console.log("create end ")
        let startY= 30;
        for (let i = 0; i < main.end.title.length; i++) {
            let text = main.end.title[i];

            let textGeom = new THREE.TextGeometry( text, {
                font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
                size: 34,
                height: 0,
                curveSegments: 4
            } ).center()

            let textMesh = new THREE.Mesh( textGeom, this.mainSpace.textMat )
            textMesh.position.set(0,startY,0)
            this.add( textMesh )
            startY -= 60; //test height
        }
        for (let i = 0; i < Object.keys(this.mainSpace.assets.textures['end']).length; i++) {
            let key = Object.keys(this.mainSpace.assets.textures['end'])[i];

            const {texture, position} = this.mainSpace.assets.textures['end'][key];
            let scale = main.end.textuers[i].scale;
            let material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } )
            let geom = new THREE.PlaneGeometry( 1, 1 )
            let tmpImg = new THREE.Mesh( geom, material);
            tmpImg.scale.set( scale.x, scale.y, 1 )
            tmpImg.position.set( position.x, position.y, position.z )
            this.add( tmpImg )        
            // this.mainSpace.itemMeshes.push( tmpImg );
        }
        this.addEndButton();
    }

    createPopSection() {

        this.position.set( 0, 2000 / this.mainSpace.scene.scale.y , 0 )
        this.visible = false

        let sansTextGeom = new THREE.TextGeometry( 'SEE YOU NEXT TIME', {
            font: this.mainSpace.assets.fonts['HelveticaNeue'],
            size: 10,
            height: 0,
            curveSegments: 4
        } ).center()

        let sansText = new THREE.Mesh( sansTextGeom, this.mainSpace.textMat )
        sansText.position.set( 0, 60, 0 )
        this.add( sansText )

        let lineOneGeom = new THREE.TextGeometry( "We're looking for new talents and exciting projects", {
            font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
            size: 30,
            height: 0,
            curveSegments: 6
        } ).center()

        let lineOne = new THREE.Mesh( lineOneGeom, this.mainSpace.contactTextMat )
        lineOne.position.set( 0, 0, 0 )
        this.add( lineOne )

        let lineTwoGeom = new THREE.TextGeometry( "to make 2019 a memorable one.", {
            font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
            size: 30,
            height: 0,
            curveSegments: 6
        } ).center()

        let lineTwo = new THREE.Mesh( lineTwoGeom, this.mainSpace.contactTextMat )
        lineTwo.position.set( 0, -45, 0 )
        this.add( lineTwo )

        let emailGeom = new THREE.TextGeometry( "hello@craftedbygc.com", {
            font: this.mainSpace.assets.fonts['TimesNewRomanPSMT'],
            size: 36,
            height: 0,
            curveSegments: 6
        } ).center()

        let email = new THREE.Mesh( emailGeom, this.mainSpace.textMat )
        email.position.set( 0, -140, 0 )
        this.add( email )

        let emailUnderline = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 467, 1 ),
            this.mainSpace.linkUnderlineMat
        )
        emailUnderline.position.set( 0, -172, 0 )
        this.add( emailUnderline )

        // for raycasting so it doesn't just pick up on letters
        this.linkBox = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 490, 60 ),
            new THREE.MeshBasicMaterial( { alphaTest: 0, visible: false } )
        )
        this.linkBox.position.set( 0, -140, 1 )
        this.linkBox.onClick = () => {
            window.open( 'mailto:hello@craftedbygc.com', '_blank' )
        }
        this.add( this.linkBox )

    }
    getShaderedMat (texture){
        let uniforms = {
            time: { type: 'f', value: 1.0 },
            fogColor: { type: "c", value: this.mainSpace.scene.fog.color },
            fogNear: { type: "f", value: this.mainSpace.scene.fog.near },
            fogFar: { type: "f", value: this.mainSpace.scene.fog.far },
            texture: { type: 't', value: texture },
            opacity: { type: 'f', value: 1.0 },
            progress: { type: 'f', value: 1 },
            gradientColor: { type: 'vec3', value: new THREE.Color(0xffffff) }
        }

        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: frag,
            vertexShader: vert,
            fog: true,
            transparent: true
        })
        return material;
    }
    addEndButton() {

        ///
        let linkGroup = new THREE.Group()
        this.linkBox = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 200, 50 ),
            new THREE.MeshBasicMaterial( { alphaTest: 0, visible: false } )
        )
        this.linkBox.onClick = () => {
            window.open( "/procuratie-vecchie", '_blank' )
        }
        linkGroup.position.set( -15, -0, 0 )

        linkGroup.add( this.linkBox )
        this.add( linkGroup )

        this.endButton = new THREE.Group()
        let borderTexture = new THREE.TextureLoader().load( 'assets/end.png' )
            borderTexture.magFilter = borderTexture.minFilter = THREE.LinearFilter
        let borderMaterial = new THREE.MeshBasicMaterial( { map: borderTexture, transparent: true, depthWrite: false } )
        let borderGeom = new THREE.PlaneGeometry( 1, 1 )
        this.border = new THREE.Mesh( borderGeom, borderMaterial )
        this.border.scale.set( 1664/8, 393/8, 1 )
        this.endButton.add( this.border )

        this.endButton.position.set( 0, -200, 50 )
        this.endButton.add( linkGroup )

        this.add( this.endButton )

    }

}