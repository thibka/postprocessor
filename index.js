import { WebGLRenderer } from 'three';
import { BlurPass, BloomEffect, BokehEffect, PixelationEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect } from "postprocessing";

var PP = {
    renderedPasses: {},
    renderedPassesOrder: []
};

PP.init = (scene, camera) => {
    PP.renderer = new WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    PP.renderer.setSize(window.innerWidth, window.innerHeight);
    PP.renderer.setPixelRatio(window.devicePixelRatio);
    PP.composer = new EffectComposer(PP.renderer);

    var pass = new RenderPass(scene, camera);
    pass.renderToScreen = true;
    pass.antialias = false;
    PP.renderedPasses.render = pass;
    PP.renderedPassesOrder.push('render');
    PP.composer.addPass(pass);

    PP.camera = camera;
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
    PP.renderedPassesOrder.splice(index, 1);

    var lastPass = PP.renderedPassesOrder[PP.renderedPassesOrder.length - 1];
    PP.renderedPasses[lastPass].renderToScreen = true;
}

PP._passes = {
    bloom: (options) => {
        var options = options == undefined ? {} : options;
        return new EffectPass(
            PP.camera,
            new BloomEffect({
                resolutionScale: options.resolutionScale || .1, // 0 - 1
                kernelSize: options.kernelSize || 2, // 0 - 5, the lower the bigger the lines
                intensity: options.intensity || 3, // min 0
                distinction: options.distinction || 1, // min 0.000001, The luminance distinction factor. Raise this value to bring out the brighter elements in the scene.
                screenMode: options.screenMode || true
            }));
    },

    blur: () => {
        return new BlurPass({
            resolutionScale: .5, // 0 - 1
            kernelSize: 2 // 0 - 5 
        });
    },

    bokeh: (options) => {
        return new EffectPass(PP.camera, new BokehEffect({
            focus: (options != undefined && options.focus != undefined) ? options.focus : .5, // 0 - 1, 0 = close focus, 1 = far focus
            dof: (options != undefined && options.dof != undefined) ? options.dof : 0, // 0 - 1, 0 = out of focus is blurry, 1 = everything is sharp
            aperture: (options != undefined && options.aperture != undefined) ? options.aperture : .05, // 0 - 0.05, amplifie la dof (depth of field)
            maxBlur: (options != undefined && options.maxBlur != undefined) ? options.maxBlur : .1
        }));
    },

    pixelation: (granularity) => {
        return new EffectPass(PP.camera, new PixelationEffect(granularity));
    },

    /*
    glitch: (noiseMapSize) => {
        return new GlitchPass({
            dtSize: noiseMapSize
        });
    },
    
    film: () => {
        return new EffectPass(PP.camera, new FilmEffect({
            noiseIntensity: 1, // 0 - 1
            scanlineDensity: 1, // 0 - 2, the lower the bigger the lines
            gridLineWidth: 1, // min 0
            gridScale: .01 // min 0.000001
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
    */

    bloom: (options) => {
        var options = options == undefined ? {} : options;
        return new EffectPass(
            PP.camera,
            new BloomEffect({
                resolutionScale: options.resolutionScale || .1, // 0 - 1
                kernelSize: options.kernelSize || 2, // 0 - 5, the lower the bigger the lines
                intensity: options.intensity || 3, // min 0
                distinction: options.distinction || 1, // min 0.000001, The luminance distinction factor. Raise this value to bring out the brighter elements in the scene.
                screenMode: options.screenMode || true
            }));
    },

    smaa: (params) => {
        return new EffectPass(
            PP.camera,
            new SMAAEffect(
                params.imgSearch,
                params.imgArea));
    }
}

export default PP;