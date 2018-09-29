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
    PostProcessor.composer.render(); // here
};

// resize function
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    PostProcessor.composer.setSize(canvas.width, canvas.height); // and here
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
}
```

Then, the PostProcessor can be used this way

```javascript

// Initialization.
// If no pass is added, the PostProcessor will simply render the scene with no effect.
PostProcessor.init(renderer, scene, camera);

// Then, any pass can be dynamiccaly added or removed
PostProcessor.add('godrays', {
    scene: scene,
    camera: camera,
    lightSource: sun,
    options: {
        screenMode: true,
        samples: godRaysSamples,
    }
});
PostProcessor.remove('godrays');

// Default parameters will be used if none is provided
PostProcessor.add('pixelation');
```