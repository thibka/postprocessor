import { 
    EffectComposer, 
    GlitchPass, 
    RenderPass, 
    FilmPass, 
    BloomPass, 
    GodRaysPass,
    BlurPass,
    BokehPass,
    ToneMappingPass,
    PixelationPass,
    ShockWavePass,
    SMAAPass
} from 'postprocessing';

// PostProcessor
var PP = {
    renderedPasses: {},
    renderedPassesOrder: []
};

PP.init = (renderer, scene, camera) => {
    PP.composer = new EffectComposer(renderer);
    var pass = new RenderPass(scene, camera);
    pass.renderToScreen = true;
    pass.antialias = false;
    PP.renderedPasses.render = pass;
    PP.renderedPassesOrder.push('render');
    PP.composer.addPass(pass);
}

PP.add = (passName, params) => {
    for (let i in PP.renderedPasses) {
        PP.renderedPasses[i].renderToScreen = false;
    }
    var newPass = PP._passes[passName](params);
    newPass.renderToScreen = true;
    PP.composer.addPass(newPass);
    PP.renderedPasses[passName] = newPass;
    PP.renderedPassesOrder.push(passName);
}

PP.remove = (passName) => {
    PP.composer.removePass(PP.renderedPasses[passName]);
    
    delete PP.renderedPasses[passName];
    var index = PP.renderedPassesOrder.indexOf(passName);
    PP.renderedPassesOrder.splice(index,1);

    var lastPass = PP.renderedPassesOrder[PP.renderedPassesOrder.length-1];
    PP.renderedPasses[lastPass].renderToScreen = true;
}

PP._passes = {
    glitch: (noiseMapSize) => {
        return new GlitchPass({
            dtSize: noiseMapSize
        });
    },
    
    pixelation: (granularity) => {
        return new PixelationPass(granularity);
    },
    
    film: () => {
        return new FilmPass({
            noiseIntensity: 1, // 0 - 1
            scanlineDensity: 1, // 0 - 2, the lower the bigger the lines
            gridLineWidth: 1, // min 0
            gridScale: .01 // min 0.000001
        });
    },
    
    bloom: (options) => {
        var options = options == undefined ? {} : options;
        return new BloomPass({
            resolutionScale: options.resolutionScale || .1, // 0 - 1
            kernelSize: options.kernelSize || 2, // 0 - 5, the lower the bigger the lines
            intensity: options.intensity || 3, // min 0
            distinction: options.distinction || 1, // min 0.000001, The luminance distinction factor. Raise this value to bring out the brighter elements in the scene.
            screenMode: options.screenMode || true
        });
    },
    
    blur: () => {
        return new BlurPass({
            resolutionScale: .5, // 0 - 1
            kernelSize: 2 // 0 - 5 
        });
    },
    
    godrays: (params) => { // scene, camera, lightSource, options
        return new GodRaysPass(
            params.scene, 
            params.camera, 
            params.lightSource,
            params.options
        );
    },
    
    bokeh: (params) => {
        return new BokehPass(params.camera, {
            focus: params.focus || .5, // 0 - 1, 0 = close focus, 1 = far focus
            dof: params.dof || 0, // 0 - 1, 0 = out of focus is blurry, 1 = everything is sharp
            aperture: params.aperture || .05, // 0 - 0.05, amplifie la dof (depth of field)
            maxBlur: params.maxBlur ||  .1
        });
    },

    tonemapping: (params) => {
        return new ToneMappingPass({
            resolution: params.resolution || 256,
            distinction: params.distinction || 1
        });
    },

    shockwave: (params) => {
        return new ShockWavePass(
            params.camera,
            params.epicenter
        );
    },

    smaa: (params) => {
        return new SMAAPass(
            params.imgSearch,
            params.imgArea
        );
    }
}

export default PP;
