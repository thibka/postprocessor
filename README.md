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

## Glitch
```javascript 
PostProcessor.add('glitch', 1); // 1 is the default noiseMapSize parameter
PostProcessor.remove('glitch');
```

## Scanlines
```javascript 
PostProcessor.add('film');
PostProcessor.remove('film');
```

## SMAA Antialiasing

The SMAA Effect needs these [two images](smaa.zip) to work.

### Simple call
```javascript
// First you must load the two "search" and "area" png images. Then use them this way:
PostProcessor.add('smaa', {
    imgSearch: smaaSearchImage,
    imgArea: smaaAreaImage
});
```

### Using [@thibka/multiloader](https://www.npmjs.com/package/@thibka/multiloader)
You can also use the multiloader to easily load the two images before using them.
```javascript
MultiLoader.load({
    files: {
        // ...
        smaaSearch: { 
            type: 'image', 
            path: require('./img/smaa/smaa-search.png')
        },
        smaaArea: { 
            type: 'image',
            path: require('./img/smaa/smaa-area.png')
        }
    },
    onFinish: init
});

// ...

function init() {
    PostProcessor.add('smaa', {
        imgSearch: MultiLoader.files.smaaSearch.image,
        imgArea: MultiLoader.files.smaaArea.image
    });
}
```
