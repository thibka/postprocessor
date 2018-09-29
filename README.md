# Disclaimer

This is a WIP!

# Description

Makes Three.js post processing easy.

# Usage

First, the PostProcessor composer must be used instead of the classic Three.js renderer.

```javascript
// render loop
function render() {
    requestAnimationFrame(render);
    PostProcessor.composer.render();
};

// resize function
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    PostProcessor.composer.setSize(canvas.width, canvas.height);
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
}
```

Then, the PostProcessor can be used this way

```javascript

PostProcessor.init(renderer, scene, camera);

// if no pass is added, the PostProcessor will simply render the scene with no effect

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