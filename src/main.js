import './scss/style.scss'
import MainSpace from './components/MainSpace'

// Initial HMR Setup
if (module.hot) {
    module.hot.accept()

    module.hot.dispose(() => {
        window.assets = mainSpace.assets
        mainSpace.renderer.domElement.removeEventListener('wheel', mainSpace.scroll)
        mainSpace.renderer.domElement.removeEventListener('resize', mainSpace.resize)
        mainSpace.renderer.domElement.removeEventListener('mousedown', mainSpace.mouseDown)
        mainSpace.renderer.domElement.removeEventListener('mouseup', mainSpace.mouseUp)
        removeEventListener('mousemove', mainSpace.mouseMove)
        document.querySelector('canvas').remove()
        mainSpace.renderer.forceContextLoss()
        mainSpace.renderer.context = null
        mainSpace.renderer.domElement = null
        mainSpace.renderer = null
        cancelAnimationFrame(mainSpace.animationId)

        mainSpace.tinyGesture.destroy()
    })
}

setTimeout(function () {

    const mainSpace = new MainSpace()
    window.mainSpace = mainSpace

}, 2000)