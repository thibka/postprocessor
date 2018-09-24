# Disclaimer

This is a WIP!

# Description

Makes Three.js post processing easy.

# Usage

```javascript
function render() {
    requestAnimationFrame(render);
    PostProcessor.composer.render();
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    PostProcessor.composer.setSize(canvas.width, canvas.height);
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
}

PostProcessor.init(renderer, scene, camera);

PostProcessor.add('godrays', {
    scene: scene,
    camera: camera,
    lightSource: sun,
    options: {
        screenMode: true,
        samples: godRaysSamples,
    }
});

PostProcessor.add('pixelation');
```