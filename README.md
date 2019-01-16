# PostProcessor

Makes Three.js post-processing easy.
Depends on postprocessing 5.0.0 and above.
This is a WIP.

# Install
```bash
npm i three postprocessing
npm i @thibka/postprocessor
```

# Usage

The PostProcessor composer must be used instead of the classic Three.js renderer.

```javascript
import PostProcessor from './js/PostProcessor.js';

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

// Initialization.
// If no pass is added, the PostProcessor will simply render the scene with no effect.
PostProcessor.init(scene, camera);
```

Then, post-processing passes can be added or removed dynamically

```javascript    
PostProcessor.add('bokeh', 
    {   focus: .9, 
        dof: 0, 
        aperture: 0.1, 
        maxBlur: 1  });

PostProcessor.remove('bokeh');

// Default parameters will be used if none is provided
PostProcessor.add('pixelation');
```