// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/kontra/kontra.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animation = animationFactory;
exports.setImagePath = setImagePath;
exports.setAudioPath = setAudioPath;
exports.setDataPath = setDataPath;
exports.loadImage = loadImage;
exports.loadAudio = loadAudio;
exports.loadData = loadData;
exports.load = load;
exports.init = init;
exports.getCanvas = getCanvas;
exports.getContext = getContext;
exports.on = on;
exports.off = off;
exports.emit = emit;
exports.GameLoop = GameLoop;
exports.initKeys = initKeys;
exports.bindKeys = bindKeys;
exports.unbindKeys = unbindKeys;
exports.keyPressed = keyPressed;
exports.registerPlugin = registerPlugin;
exports.unregisterPlugin = unregisterPlugin;
exports.extendObject = extendObject;
exports.initPointer = initPointer;
exports.track = track;
exports.untrack = untrack;
exports.pointerOver = pointerOver;
exports.onPointerDown = onPointerDown;
exports.onPointerUp = onPointerUp;
exports.pointerPressed = pointerPressed;
exports.Pool = poolFactory;
exports.Quadtree = quadtreeFactory;
exports.Sprite = spriteFactory;
exports.SpriteSheet = spriteSheetFactory;
exports.setStoreItem = setStoreItem;
exports.getStoreItem = getStoreItem;
exports.TileEngine = TileEngine;
exports.Vector = vectorFactory;
exports.default = exports.pointer = exports.keyMap = exports.dataAssets = exports.audioAssets = exports.imageAssets = void 0;

/**
 * A simple event system. Allows you to hook into Kontra lifecycle events or create your own, such as for [Plugins](api/plugin).
 *
 * ```js
 * import { on, off, emit } from 'kontra';
 *
 * function callback(a, b, c) {
 *   console.log({a, b, c});
 * });
 *
 * on('myEvent', callback);
 * emit('myEvent', 1, 2, 3);  //=> {a: 1, b: 2, c: 3}
 * off('myEvent', callback);
 * ```
 * @sectionName Events
 */
// expose for testing
let callbacks = {};
/**
 * There are currently only three lifecycle events:
 * - `init` - Emitted after `konta.init()` is called.
 * - `tick` - Emitted every frame of kontra.GameLoop before the loops `update()` and `render()` functions are called.
 * - `assetLoaded` - Emitted after an asset has fully loaded using the asset loader. The callback function is passed the asset and the url of the asset as parameters.
 * @sectionName Lifecycle Events
 */

/**
 * Register a callback for an event to be called whenever the event is emitted. The callback will be passed all arguments used in the `emit` call.
 * @function on
 *
 * @param {String} event - Name of the event.
 * @param {Function} callback - Function that will be called when the event is emitted.
 */

function on(event, callback) {
  callbacks[event] = callbacks[event] || [];
  callbacks[event].push(callback);
}
/**
 * Remove a callback for an event.
 * @function off
 *
 * @param {String} event - Name of the event.
 * @param {Function} callback - The function that was passed during registration.
 */


function off(event, callback) {
  let index;
  if (!callbacks[event] || (index = callbacks[event].indexOf(callback)) < 0) return;
  callbacks[event].splice(index, 1);
}
/**
 * Call all callback functions for the event. All arguments will be passed to the callback functions.
 * @function emit
 *
 * @param {String} event - Name of the event.
 * @param {*} [args] - Arguments passed to all callbacks.
 */


function emit(event, ...args) {
  if (!callbacks[event]) return;
  callbacks[event].map(fn => fn(...args));
}
/**
 * Functions for initializing the Kontra library and getting the canvas and context
 * objects.
 *
 * ```js
 * import { getCanvas, getContext, init } from 'kontra';
 *
 * let { canvas, context } = init();
 *
 * // or can get canvas and context through functions
 * canvas = getCanvas();
 * context = getContext();
 * ```
 * @sectionName Core
 */


let canvasEl;
let context;
/**
 * Return the canvas element.
 * @function getCanvas
 *
 * @returns {HTMLCanvasElement} The canvas element for the game.
 */

function getCanvas() {
  return canvasEl;
}
/**
 * Return the context object.
 * @function getContext
 *
 * @returns {CanvasRenderingContext2D} The context object the game draws to.
 */


function getContext() {
  return context;
}
/**
 * Initialize the library and set up the canvas. Typically you will call `init()` as the first thing and give it the canvas to use. This will allow all Kontra objects to reference the canvas when created.
 *
 * ```js
 * import { init } from 'kontra';
 *
 * let { canvas, context } = init('game');
 * ```
 * @function init
 *
 * @param {String|HTMLCanvasElement} [canvas] - The canvas for Kontra to use. Can either be the ID of the canvas element or the canvas element itself. Defaults to using the first canvas element on the page.
 *
 * @returns {Object} An object with properties `canvas` and `context`. `canvas` it the canvas element for the game and `context` is the context object the game draws to.
 */


function init(canvas) {
  // check if canvas is a string first, an element next, or default to getting
  // first canvas on page
  canvasEl = document.getElementById(canvas) || canvas || document.querySelector('canvas'); // @if DEBUG

  if (!canvasEl) {
    throw Error('You must provide a canvas element for the game');
  } // @endif


  context = canvasEl.getContext('2d');
  context.imageSmoothingEnabled = false;
  emit('init');
  return {
    canvas: canvasEl,
    context
  };
}
/**
 * An object for drawing sprite sheet animations.
 *
 * An animation defines the sequence of frames to use from a sprite sheet. It also defines at what speed the animation should run using `frameRate`.
 *
 * Typically you don't create an kontra.Animation directly, but rather you would create them from kontra.SpriteSheet by passing the `animations` argument.
 *
 * ```js
 * import { SpriteSheet, Animation } from 'kontra';
 *
 * let image = new Image();
 * image.src = 'assets/imgs/character_walk_sheet.png';
 * image.onload = function() {
 *   let spriteSheet = SpriteSheet({
 *     image: image,
 *     frameWidth: 72,
 *     frameHeight: 97
 *   });
 *
 *   // you typically wouldn't create an Animation this way
 *   let animation = Animation({
 *     spriteSheet: spriteSheet,
 *     frames: [1,2,3,6],
 *     frameRate: 30
 *   });
 * };
 * ```
 * @class Animation
 *
 * @param {Object} properties - Properties of the animation.
 * @param {kontra.SpriteSheet} properties.spriteSheet - Sprite sheet for the animation.
 * @param {Number[]} properties.frames - List of frames of the animation.
 * @param {Number}  properties.frameRate - Number of frames to display in one second.
 * @param {Boolean} [properties.loop=true] - If the animation should loop.
 */


class Animation {
  constructor({
    spriteSheet,
    frames,
    frameRate,
    loop = true
  } = {}) {
    /**
     * The sprite sheet to use for the animation.
     * @memberof Animation
     * @property {kontra.SpriteSheet} spriteSheet
     */
    this.spriteSheet = spriteSheet;
    /**
     * Sequence of frames to use from the sprite sheet.
     * @memberof Animation
     * @property {Number[]} frames
     */

    this.frames = frames;
    /**
     * Number of frames to display per second. Adjusting this value will change the speed of the animation.
     * @memberof Animation
     * @property {Number} frameRate
     */

    this.frameRate = frameRate;
    /**
     * If the animation should loop back to the beginning once completed.
     * @memberof Animation
     * @property {Boolean} loop
     */

    this.loop = loop;
    let {
      width,
      height,
      margin = 0
    } = spriteSheet.frame;
    /**
     * The width of an individual frame. Taken from the property of the same name in the [spriteSheet](api/animation/#spriteSheet).
     * @memberof Animation
     * @property {Number} width
     */

    this.width = width;
    /**
     * The height of an individual frame. Taken from the property of the same name in the [spriteSheet](api/animation/#spriteSheet).
     * @memberof Animation
     * @property {Number} height
     */

    this.height = height;
    /**
     * The space between each frame. Taken from the property of the same name in the [spriteSheet](api/animation/#spriteSheet).
     * @memberof Animation
     * @property {Number} margin
     */

    this.margin = margin; // f = frame, a = accumulator

    this._f = 0;
    this._a = 0;
  }
  /**
   * Clone an animation so it can be used more than once. By default animations passed to kontra.Sprite will be cloned so no two sprites update the same animation. Otherwise two sprites who shared the same animation would make it update twice as fast.
   * @memberof Animation
   * @function clone
   *
   * @returns {kontra.Animation} A new kontra.Animation instance.
   */


  clone() {
    return animationFactory(this);
  }
  /**
   * Reset an animation to the first frame.
   * @memberof Animation
   * @function reset
   */


  reset() {
    this._f = 0;
    this._a = 0;
  }
  /**
   * Update the animation.
   * @memberof Animation
   * @function update
   *
   * @param {Number} [dt=1/60] - Time since last update.
   */


  update(dt = 1 / 60) {
    // if the animation doesn't loop we stop at the last frame
    if (!this.loop && this._f == this.frames.length - 1) return;
    this._a += dt; // update to the next frame if it's time

    while (this._a * this.frameRate >= 1) {
      this._f = ++this._f % this.frames.length;
      this._a -= 1 / this.frameRate;
    }
  }
  /**
   * Draw the current frame of the animation.
   * @memberof Animation
   * @function render
   *
   * @param {Object} properties - Properties to draw the animation.
   * @param {Number} properties.x - X position to draw the animation.
   * @param {Number} properties.y - Y position to draw the animation.
   * @param {Number} [properties.width] - width of the sprite. Defaults to [Animation.width](api/animation#width).
   * @param {Number} [properties.height] - height of the sprite. Defaults to [Animation.height](api/animation#height).
   * @param {Canvas​Rendering​Context2D} [properties.context] - The context the animation should draw to. Defaults to [core.getContext()](api/core#getContext).
   */


  render({
    x,
    y,
    width = this.width,
    height = this.height,
    context = getContext()
  } = {}) {
    // get the row and col of the frame
    let row = this.frames[this._f] / this.spriteSheet._f | 0;
    let col = this.frames[this._f] % this.spriteSheet._f | 0;
    context.drawImage(this.spriteSheet.image, col * this.width + (col * 2 + 1) * this.margin, row * this.height + (row * 2 + 1) * this.margin, this.width, this.height, x, y, width, height);
  }

}

function animationFactory(properties) {
  return new Animation(properties);
}

animationFactory.prototype = Animation.prototype;
animationFactory.class = Animation;
/**
 * A promise based asset loader for loading images, audio, and data files. An `assetLoaded` event is emitted after each asset is fully loaded. The callback for the event is passed the asset and the url to the asset as parameters.
 *
 * ```js
 * import { load, on } from 'kontra';
 *
 * let numAssets = 3;
 * let assetsLoaded = 0;
 * on('assetLoaded', (asset, url) => {
 *   assetsLoaded++;
 *
 *   // inform user or update progress bar
 * });
 *
 * load(
 *   'assets/imgs/character.png',
 *   'assets/data/tile_engine_basic.json',
 *   ['/audio/music.ogg', '/audio/music.mp3']
 * ).then(function(assets) {
 *   // all assets have loaded
 * }).catch(function(err) {
 *   // error loading an asset
 * });
 * ```
 * @sectionName Assets
 */

let imageRegex = /(jpeg|jpg|gif|png)$/;
let audioRegex = /(wav|mp3|ogg|aac)$/;
let leadingSlash = /^\//;
let trailingSlash = /\/$/;
let dataMap = new WeakMap();
let imagePath = '';
let audioPath = '';
let dataPath = '';
/**
 * Get the full URL from the base.
 *
 * @param {String} url - The URL to the asset.
 * @param {String} base - Base URL.
 *
 * @returns {String}
 */

function getUrl(url, base) {
  return new URL(url, base).href;
}
/**
 * Join a base path and asset path.
 *
 * @param {String} base - The asset base path.
 * @param {String} url - The URL to the asset.
 *
 * @returns {String}
 */


function joinPath(base, url) {
  return [base.replace(trailingSlash, ''), base ? url.replace(leadingSlash, '') : url].filter(s => s).join('/');
}
/**
 * Get the extension of an asset.
 *
 * @param {String} url - The URL to the asset.
 *
 * @returns {String}
 */


function getExtension(url) {
  return url.split('.').pop();
}
/**
 * Get the name of an asset.
 *
 * @param {String} url - The URL to the asset.
 *
 * @returns {String}
 */


function getName(url) {
  let name = url.replace('.' + getExtension(url), ''); // remove leading slash if there is no folder in the path
  // @see https://stackoverflow.com/a/50592629/2124254

  return name.split('/').length == 2 ? name.replace(leadingSlash, '') : name;
}
/**
 * Get browser audio playability.
 * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
 *
 * @param {HTMLMediaElement} audio - Audio element.
 *
 * @returns {object}
 */


function getCanPlay(audio) {
  return {
    wav: '',
    mp3: audio.canPlayType('audio/mpeg;'),
    ogg: audio.canPlayType('audio/ogg; codecs="vorbis"'),
    aac: audio.canPlayType('audio/aac;')
  };
}
/**
 * Object of all loaded image assets by both file name and path. If the base [image path](api/assets/#setImagePath) was set before the image was loaded, the file name and path will not include the base image path.
 *
 * ```js
 * import { load, setImagePath, imageAssets } from 'kontra';
 *
 * load('assets/imgs/character.png').then(function() {
 *   // Image asset can be accessed by both
 *   // name: imageAssets['assets/imgs/character']
 *   // path: imageAssets['assets/imgs/character.png']
 * });
 *
 * setImagePath('assets/imgs');
 * load('character_walk_sheet.png').then(function() {
 *   // Image asset can be accessed by both
 *   // name: imageAssets['character_walk_sheet']
 *   // path: imageAssets['character_walk_sheet.png']
 * });
 * ```
 * @property {Object} imageAssets
 */


let imageAssets = {};
/**
 * Object of all loaded audio assets by both file name and path. If the base [audio path](api/assets/#setAudioPath) was set before the audio was loaded, the file name and path will not include the base audio path.
 *
 * ```js
 * import { load, setAudioPath, audioAssets } from 'kontra';
 *
 * load('/audio/music.ogg').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: audioAssets['/audio/music']
 *   // path: audioAssets['/audio/music.ogg']
 * });
 *
 * setAudioPath('/audio');
 * load('sound.ogg').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: audioAssets['sound']
 *   // path: audioAssets['sound.ogg']
 * });
 * ```
 * @property {Object} audioAssets
 */

exports.imageAssets = imageAssets;
let audioAssets = {};
/**
 * Object of all loaded data assets by both file name and path. If the base [data path](api/assets/#setDataPath) was set before the data was loaded, the file name and path will not include the base data path.
 *
 * ```js
 * import { load, setDataPath, dataAssets } from 'kontra';
 *
 * load('assets/data/file.txt').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: dataAssets['assets/data/file']
 *   // path: dataAssets['assets/data/file.txt']
 * });
 *
 * setDataPath('assets/data');
 * load('info.json').then(function() {
 *   // Audio asset can be accessed by both
 *   // name: dataAssets['info']
 *   // path: dataAssets['info.json']
 * });
 * ```
 * @property {Object} dataAssets
 */

exports.audioAssets = audioAssets;
let dataAssets = {};
/**
 * Add a global kontra object so TileEngine can access information about the
 * loaded assets when kontra is loaded in parts rather than as a whole (e.g.
 * `import { load, TileEngine } from 'kontra';`)
 */

exports.dataAssets = dataAssets;

function addGlobal() {
  if (!window.__k) {
    window.__k = {
      dm: dataMap,
      u: getUrl,
      d: dataAssets,
      i: imageAssets
    };
  }
}
/**
 * Sets the base path for all image assets. If a base path is set, all load calls for image assets will prepend the base path to the URL.
 *
 * ```js
 * import { setImagePath, load } from 'kontra';
 *
 * setImagePath('/imgs');
 * load('character.png');  // loads '/imgs/character.png'
 * ```
 * @function setImagePath
 *
 * @param {String} path - Base image path.
 */


function setImagePath(path) {
  imagePath = path;
}
/**
 * Sets the base path for all audio assets. If a base path is set, all load calls for audio assets will prepend the base path to the URL.
 *
 * ```js
 * import { setAudioPath, load } from 'kontra';
 *
 * setAudioPath('/audio');
 * load('music.ogg');  // loads '/audio/music.ogg'
 * ```
 * @function setAudioPath
 *
 * @param {String} path - Base audio path.
 */


function setAudioPath(path) {
  audioPath = path;
}
/**
 * Sets the base path for all data assets. If a base path is set, all load calls for data assets will prepend the base path to the URL.
 *
 * ```js
 * import { setDataPath, load } from 'kontra';
 *
 * setDataPath('/data');
 * load('file.json');  // loads '/data/file.json'
 * ```
 * @function setDataPath
 *
 * @param {String} path - Base data path.
 */


function setDataPath(path) {
  dataPath = path;
}
/**
 * Load a single Image asset. Uses the base [image path](api/assets/#setImagePath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [imageAssets](api/assets/#imageAssets) property.
 *
 * ```js
 * import { loadImage } from 'kontra';
 *
 * loadImage('car.png').then(function(image) {
 *   console.log(image.src);  //=> 'car.png'
 * })
 * ```
 * @function loadImage
 *
 * @param {String} url - The URL to the Image file.
 *
 * @returns {Promise} A deferred promise. Promise resolves with the Image.
 */


function loadImage(url) {
  addGlobal();
  return new Promise((resolve, reject) => {
    let resolvedUrl, image, fullUrl;
    resolvedUrl = joinPath(imagePath, url);
    if (imageAssets[resolvedUrl]) return resolve(imageAssets[resolvedUrl]);
    image = new Image();

    image.onload = function loadImageOnLoad() {
      fullUrl = getUrl(resolvedUrl, window.location.href);
      imageAssets[getName(url)] = imageAssets[resolvedUrl] = imageAssets[fullUrl] = this;
      emit('assetLoaded', this, url);
      resolve(this);
    };

    image.onerror = function loadImageOnError() {
      reject(
      /* @if DEBUG */
      'Unable to load image ' +
      /* @endif */
      resolvedUrl);
    };

    image.src = resolvedUrl;
  });
}
/**
 * Load a single Audio asset. Supports loading multiple audio formats which the loader will use to load the first audio format supported by the browser in the order listed. Uses the base [audio path](api/assets/#setAudioPath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [audioAssets](api/assets/#audioAssets) property. Since the loader determines which audio asset to load based on browser support, you should only reference the audio by its name and not by its file path since there's no guarantee which asset was loaded.
 *
 * ```js
 * import { loadAudio, audioAssets } from 'kontra';
 *
 * loadAudio([
 *   '/audio/music.mp3',
 *   '/audio/music.ogg'
 * ]).then(function(audio) {
 *
 *   // access audio by its name only (not by its .mp3 or .ogg path)
 *   audioAssets['/audio/music'].play();
 * })
 * ```
 * @function loadAudio
 *
 * @param {String} url - The URL to the Audio file.
 *
 * @returns {Promise} A deferred promise. Promise resolves with the Audio.
 */


function loadAudio(url) {
  return new Promise((resolve, reject) => {
    let audioEl, canPlay, resolvedUrl, fullUrl;
    audioEl = new Audio();
    canPlay = getCanPlay(audioEl); // determine the first audio format the browser can play

    url = [].concat(url).reduce((playableSource, source) => playableSource ? playableSource : canPlay[getExtension(source)] ? source : null, 0); // 0 is the shortest falsy value

    if (!url) {
      return reject(
      /* @if DEBUG */
      'cannot play any of the audio formats provided' +
      /* @endif */
      url);
    }

    resolvedUrl = joinPath(audioPath, url);
    if (audioAssets[resolvedUrl]) return resolve(audioAssets[resolvedUrl]);
    audioEl.addEventListener('canplay', function loadAudioOnLoad() {
      fullUrl = getUrl(resolvedUrl, window.location.href);
      audioAssets[getName(url)] = audioAssets[resolvedUrl] = audioAssets[fullUrl] = this;
      emit('assetLoaded', this, url);
      resolve(this);
    });

    audioEl.onerror = function loadAudioOnError() {
      reject(
      /* @if DEBUG */
      'Unable to load audio ' +
      /* @endif */
      resolvedUrl);
    };

    audioEl.src = resolvedUrl;
    audioEl.load();
  });
}
/**
 * Load a single Data asset. Uses the base [data path](api/assets/#setDataPath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [dataAssets](api/assets/#dataAssets) property.
 *
 * ```js
 * import { loadData } from 'kontra';
 *
 * loadData('assets/data/tile_engine_basic.json').then(function(data) {
 *   // data contains the parsed JSON data
 * })
 * ```
 * @function loadData
 *
 * @param {String} url - The URL to the Data file.
 *
 * @returns {Promise} A deferred promise. Promise resolves with the contents of the file. If the file is a JSON file, the contents will be parsed as JSON.
 */


function loadData(url) {
  addGlobal();
  let resolvedUrl, fullUrl;
  resolvedUrl = joinPath(dataPath, url);
  if (dataAssets[resolvedUrl]) return Promise.resolve(dataAssets[resolvedUrl]);
  return fetch(resolvedUrl).then(response => {
    if (!response.ok) throw response;
    return response.clone().json().catch(() => response.text());
  }).then(response => {
    fullUrl = getUrl(resolvedUrl, window.location.href);

    if (typeof response === 'object') {
      dataMap.set(response, fullUrl);
    }

    dataAssets[getName(url)] = dataAssets[resolvedUrl] = dataAssets[fullUrl] = response;
    emit('assetLoaded', response, url);
    return response;
  });
}
/**
 * Load Image, Audio, or data files. Uses the [loadImage](api/assets/#loadImage), [loadAudio](api/assets/#loadAudio), and [loadData](api/assets/#loadData) functions to load each asset type.
 *
 * ```js
 * import { load } from 'kontra';
 *
 * load(
 *   'assets/imgs/character.png',
 *   'assets/data/tile_engine_basic.json',
 *   ['/audio/music.ogg', '/audio/music.mp3']
 * ).then(function(assets) {
 *   // all assets have loaded
 * }).catch(function(err) {
 *   // error loading an asset
 * });
 * ```
 * @function load
 *
 * @param {String|String[]} urls - Comma separated list of asset urls to load.
 *
 * @returns {Promise} A deferred promise. Resolves with all the loaded assets.
 */


function load(...urls) {
  addGlobal();
  return Promise.all(urls.map(asset => {
    // account for a string or an array for the url
    let extension = getExtension([].concat(asset)[0]);
    return extension.match(imageRegex) ? loadImage(asset) : extension.match(audioRegex) ? loadAudio(asset) : loadData(asset);
  }));
} // expose for testing
// Override the getCanPlay function to provide a specific return type for tests

/**
 * Noop function
 */


const noop = () => {};
/**
 * Clear the canvas.
 */


function clear() {
  let canvas = getCanvas();
  getContext().clearRect(0, 0, canvas.width, canvas.height);
}
/**
 * The game loop updates and renders the game every frame. The game loop is stopped by default and will not start until the loops `start()` function is called.
 *
 * The game loop uses a time-based animation with a fixed `dt` to [avoid frame rate issues](http://blog.sklambert.com/using-time-based-animation-implement/). Each update call is guaranteed to equal 1/60 of a second.
 *
 * This means that you can avoid having to do time based calculations in your update functions  and instead do fixed updates.
 *
 * ```js
 * import { Sprite, GameLoop } from 'kontra';
 *
 * let sprite = Sprite({
 *   x: 100,
 *   y: 200,
 *   width: 20,
 *   height: 40,
 *   color: 'red'
 * });
 *
 * let loop = GameLoop({
 *   update: function(dt) {
 *     // no need to determine how many pixels you want to
 *     // move every second and multiple by dt
 *     // sprite.x += 180 * dt;
 *
 *     // instead just update by how many pixels you want
 *     // to move every frame and the loop will ensure 60FPS
 *     sprite.x += 3;
 *   },
 *   render: function() {
 *     sprite.render();
 *   }
 * });
 *
 * loop.start();
 * ```
 * @sectionName GameLoop
 *
 * @param {Object}   properties - Properties of the game loop.
 * @param {Function} properties.update - Function called every frame to update the game. Is passed the fixed `dt` as a parameter.
 * @param {Function} properties.render - Function called every frame to render the game.
 * @param {Number}   [properties.fps=60] - Desired frame rate.
 * @param {Boolean}  [properties.clearCanvas=true] - Clear the canvas every frame before the `render()` function is called.
 */


function GameLoop({
  fps = 60,
  clearCanvas = true,
  update,
  render
} = {}) {
  // check for required functions
  // @if DEBUG
  if (!(update && render)) {
    throw Error('You must provide update() and render() functions');
  } // @endif
  // animation variables


  let accumulator = 0;
  let delta = 1E3 / fps; // delta between performance.now timings (in ms)

  let step = 1 / fps;
  let clearFn = clearCanvas ? clear : noop;
  let last, rAF, now, dt, loop;
  /**
   * Called every frame of the game loop.
   */

  function frame() {
    rAF = requestAnimationFrame(frame);
    now = performance.now();
    dt = now - last;
    last = now; // prevent updating the game with a very large dt if the game were to lose focus
    // and then regain focus later

    if (dt > 1E3) {
      return;
    }

    emit('tick');
    accumulator += dt;

    while (accumulator >= delta) {
      loop.update(step);
      accumulator -= delta;
    }

    clearFn();
    loop.render();
  } // game loop object


  loop = {
    /**
     * Called every frame to update the game. Put all of your games update logic here.
     * @memberof GameLoop
     * @function update
     *
     * @param {Number} dt - The fixed dt time of 1/60 of a frame.
     */
    update,

    /**
     * Called every frame to render the game. Put all of your games render logic here.
     * @memberof GameLoop
     * @function render
     */
    render,

    /**
     * If the game loop is currently stopped.
     *
     * ```js
     * import { GameLoop } from 'kontra';
     *
     * let loop = GameLoop({
     *   // ...
     * });
     * console.log(loop.isStopped);  //=> true
     *
     * loop.start();
     * console.log(loop.isStopped);  //=> false
     *
     * loop.stop();
     * console.log(loop.isStopped);  //=> true
     * ```
     * @memberof GameLoop
     * @property {Boolean} isStopped
     */
    isStopped: true,

    /**
     * Start the game loop.
     * @memberof GameLoop
     * @function start
     */
    start() {
      last = performance.now();
      this.isStopped = false;
      requestAnimationFrame(frame);
    },

    /**
     * Stop the game loop.
     * @memberof GameLoop
     * @function stop
     */
    stop() {
      this.isStopped = true;
      cancelAnimationFrame(rAF);
    },

    // expose properties for testing
    // @if DEBUG
    _frame: frame,

    set _last(value) {
      last = value;
    } // @endif


  };
  return loop;
}
/**
 * A minimalistic keyboard API. You can use it move the main sprite or respond to a key press.
 *
 * ```js
 * import { initKeys, keyPressed } from 'kontra';
 *
 * // this function must be called first before keyboard
 * // functions will work
 * initKeys();
 *
 * function update() {
 *   if (keyPressed('left')) {
 *     // move left
 *   }
 * }
 * ```
 * @sectionName Keyboard
 */

/**
 * Below is a list of keys that are provided by default. If you need to extend this list, you can use the [keyMap](api/keyboard/#keyMap) property.
 *
 * - a-z
 * - 0-9
 * - enter, esc, space, left, up, right, down
 * @sectionName Available Keys
 */


let callbacks$1 = {};
let pressedKeys = {};
/**
 * A map of keycodes to key names. Add to this object to expand the list of [available keys](api/keyboard/#available-keys).
 *
 * ```js
 * import { keyMap, bindKeys } from 'kontra';
 *
 * keyMap[34] = 'pageDown';
 *
 * bindKeys('pageDown', function(e) {
 *   // handle pageDown key
 * });
 * ```
 * @property {Object} keyMap
 */

let keyMap = {
  // named keys
  13: 'enter',
  27: 'esc',
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};
/**
 * Execute a function that corresponds to a keyboard key.
 *
 * @param {KeyboardEvent} evt
 */

exports.keyMap = keyMap;

function keydownEventHandler(evt) {
  let key = keyMap[evt.which];
  pressedKeys[key] = true;

  if (callbacks$1[key]) {
    callbacks$1[key](evt);
  }
}
/**
 * Set the released key to not being pressed.
 *
 * @param {KeyboardEvent} evt
 */


function keyupEventHandler(evt) {
  pressedKeys[keyMap[evt.which]] = false;
}
/**
 * Reset pressed keys.
 */


function blurEventHandler() {
  pressedKeys = {};
}
/**
 * Initialize keyboard event listeners. This function must be called before using other keyboard functions.
 * @function initKeys
 */


function initKeys() {
  let i; // alpha keys
  // @see https://stackoverflow.com/a/43095772/2124254

  for (i = 0; i < 26; i++) {
    // rollupjs considers this a side-effect (for now), so we'll do it in the
    // initKeys function
    // @see https://twitter.com/lukastaegert/status/1107011988515893249?s=20
    keyMap[65 + i] = (10 + i).toString(36);
  } // numeric keys


  for (i = 0; i < 10; i++) {
    keyMap[48 + i] = '' + i;
  }

  window.addEventListener('keydown', keydownEventHandler);
  window.addEventListener('keyup', keyupEventHandler);
  window.addEventListener('blur', blurEventHandler);
}
/**
 * Bind a set of keys that will call the callback function when they are pressed. Takes a single key or an array of keys. Is passed the original KeyboardEvent as a parameter.
 *
 * ```js
 * import { initKeys, bindKeys } from 'kontra';
 *
 * initKeys();
 *
 * bindKeys('p', function(e) {
 *   // pause the game
 * });
 * bindKeys(['enter', 'space'], function(e) {
 *   e.preventDefault();
 *   // fire gun
 * });
 * ```
 * @function bindKeys
 *
 * @param {String|String[]} keys - Key or keys to bind.
 */


function bindKeys(keys, callback) {
  // smaller than doing `Array.isArray(keys) ? keys : [keys]`
  [].concat(keys).map(key => callbacks$1[key] = callback);
}
/**
 * Remove the callback function for a bound set of keys. Takes a single key or an array of keys.
 *
 * ```js
 * import { unbindKeys } from 'kontra';
 *
 * unbindKeys('left');
 * unbindKeys(['enter', 'space']);
 * ```
 * @function unbindKeys
 *
 * @param {String|String[]} keys - Key or keys to unbind.
 */


function unbindKeys(keys) {
  // 0 is the smallest falsy value
  [].concat(keys).map(key => callbacks$1[key] = 0);
}
/**
 * Check if a key is currently pressed. Use during an `update()` function to perform actions each frame.
 *
 * ```js
 * import { Sprite, initKeys, keyPressed } from 'kontra';
 *
 * initKeys();
 *
 * let sprite = Sprite({
 *   update: function() {
 *     if (keyPressed('left')){
 *       // left arrow pressed
 *     }
 *     else if (keyPressed('right')) {
 *       // right arrow pressed
 *     }
 *
 *     if (keyPressed('up')) {
 *       // up arrow pressed
 *     }
 *     else if (keyPressed('down')) {
 *       // down arrow pressed
 *     }
 *   }
 * });
 * ```
 * @function keyPressed
 *
 * @param {String} key - Key to check for pressed state.
 *
 * @returns {Boolean} `true` if the key is pressed, `false` otherwise.
 */


function keyPressed(key) {
  return !!pressedKeys[key];
}
/**
 * A plugin system based on the [interceptor pattern](https://en.wikipedia.org/wiki/Interceptor_pattern), designed to share reusable code such as more advance collision detection or a 2D physics engine.
 *
 * ```js
 * import { registerPlugin, Sprite } from 'kontra';
 * import loggingPlugin from 'path/to/plugin/code.js'
 *
 * // register a plugin that adds logging to all Sprites
 * registerPlugin(Sprite, loggingPlugin);
 * ```
 * @sectionName Plugin
 */

/**
 * @docs docs/api_docs/plugin.js
 */

/**
 * Get the kontra object method name from the plugin.
 *
 * @param {String} methodName - Before/After function name
 *
 * @returns {String}
 */


function getMethod(methodName) {
  let methodTitle = methodName.substr(methodName.search(/[A-Z]/));
  return methodTitle[0].toLowerCase() + methodTitle.substr(1);
}
/**
 * Remove an interceptor.
 *
 * @param {function[]} interceptors - Before/After interceptor list
 * @param {function} fn - Interceptor function
 */


function removeInterceptor(interceptors, fn) {
  let index = interceptors.indexOf(fn);

  if (index !== -1) {
    interceptors.splice(index, 1);
  }
}
/**
 * Register a plugin to run a set of functions before or after the Kontra object functions.
 * @function registerPlugin
 *
 * @param {Object} kontraObj - Kontra object to attach the plugin to.
 * @param {Object} pluginObj - Plugin object with before and after intercept functions.
 */


function registerPlugin(kontraObj, pluginObj) {
  let objectProto = kontraObj.prototype;
  if (!objectProto) return; // create interceptor list and functions

  if (!objectProto._inc) {
    objectProto._inc = {};

    objectProto._bInc = function beforePlugins(context, method, ...args) {
      return this._inc[method].before.reduce((acc, fn) => {
        let newArgs = fn(context, ...acc);
        return newArgs ? newArgs : acc;
      }, args);
    };

    objectProto._aInc = function afterPlugins(context, method, result, ...args) {
      return this._inc[method].after.reduce((acc, fn) => {
        let newResult = fn(context, acc, ...args);
        return newResult ? newResult : acc;
      }, result);
    };
  } // add plugin to interceptors


  Object.getOwnPropertyNames(pluginObj).forEach(methodName => {
    let method = getMethod(methodName);
    if (!objectProto[method]) return; // override original method

    if (!objectProto['_o' + method]) {
      objectProto['_o' + method] = objectProto[method];

      objectProto[method] = function interceptedFn(...args) {
        // call before interceptors
        let alteredArgs = this._bInc(this, method, ...args);

        let result = objectProto['_o' + method].call(this, ...alteredArgs); // call after interceptors

        return this._aInc(this, method, result, ...args);
      };
    } // create interceptors for the method


    if (!objectProto._inc[method]) {
      objectProto._inc[method] = {
        before: [],
        after: []
      };
    }

    if (methodName.startsWith('before')) {
      objectProto._inc[method].before.push(pluginObj[methodName]);
    } else if (methodName.startsWith('after')) {
      objectProto._inc[method].after.push(pluginObj[methodName]);
    }
  });
}
/**
 * Unregister a plugin from a Kontra object.
 * @function unregisterPlugin
 *
 * @param {Object} kontraObj - Kontra object to detach plugin from.
 * @param {Object} pluginObj - The plugin object that was passed during registration.
 */


function unregisterPlugin(kontraObj, pluginObj) {
  let objectProto = kontraObj.prototype;
  if (!objectProto || !objectProto._inc) return; // remove plugin from interceptors

  Object.getOwnPropertyNames(pluginObj).forEach(methodName => {
    let method = getMethod(methodName);

    if (methodName.startsWith('before')) {
      removeInterceptor(objectProto._inc[method].before, pluginObj[methodName]);
    } else if (methodName.startsWith('after')) {
      removeInterceptor(objectProto._inc[method].after, pluginObj[methodName]);
    }
  });
}
/**
 * Safely extend the functionality of a Kontra object. Any properties that already exist on the Kontra object will not be added.
 *
 * ```js
 * import { extendObject, Vector } from 'kontra';
 *
 * // add a subtract function to all Vectors
 * extendObject(Vector, {
 *   subtract(vec) {
 *     return Vector(this.x - vec.x, this.y - vec.y);
 *   }
 * });
 * ```
 * @function extendObject
 *
 * @param {Object} kontraObj - Kontra object to extend
 * @param {Object} properties - Properties to add.
 */


function extendObject(kontraObj, properties) {
  let objectProto = kontraObj.prototype;
  if (!objectProto) return;
  Object.getOwnPropertyNames(properties).forEach(prop => {
    if (!objectProto[prop]) {
      objectProto[prop] = properties[prop];
    }
  });
}
/**
 * A simple pointer API. You can use it move the main sprite or respond to a pointer event. Works with both mouse and touch events.
 *
 * Pointer events can be added on a global level or on individual sprites or objects. Before an object can receive pointer events, you must tell the pointer which objects to track and the object must haven been rendered to the canvas using `object.render()`.
 *
 * After an object is tracked and rendered, you can assign it an `onDown()`, `onUp()`, or `onOver()` functions which will be called whenever a pointer down, up, or over event happens on the object.
 *
 * ```js
 * import { initPointer, track, Sprite } from 'kontra';
 *
 * // this function must be called first before pointer
 * // functions will work
 * initPointer();
 *
 * let sprite = Sprite({
 *   onDown: function() {
 *     // handle on down events on the sprite
 *   },
 *   onUp: function() {
 *     // handle on up events on the sprite
 *   },
 *   onOver: function() {
 *     // handle on over events on the sprite
 *   }
 * });
 *
 * track(sprite);
 * sprite.render();
 * ```
 *
 * By default, the pointer is treated as a circle and will check for collisions against objects assuming they are rectangular (have a width and height property).
 *
 * If you need to perform a different type of collision detection, assign the object a `collidesWithPointer()` function and it will be called instead. The function is passed the pointer object. Use this function to determine how the pointer circle should collide with the object.
 *
 * ```js
 * import { Sprite } from 'kontra';

 * let sprite = Srite({
 *   x: 10,
 *   y: 10,
 *   radius: 10
 *   collidesWithPointer: function(pointer) {
 *     // perform a circle v circle collision test
 *     let dx = pointer.x - this.x;
 *     let dy = pointer.y - this.y;
 *     return Math.sqrt(dx * dx + dy * dy) < this.radius;
 *   }
 * });
 * ```
 * @sectionName Pointer
 */
// save each object as they are rendered to determine which object
// is on top when multiple objects are the target of an event.
// we'll always use the last frame's object order so we know
// the finalized order of all objects, otherwise an object could ask
// if it's being hovered when it's rendered first even if other objects
// would block it later in the render order


let thisFrameRenderOrder = [];
let lastFrameRenderOrder = [];
let callbacks$2 = {};
let trackedObjects = [];
let pressedButtons = {};
/**
 * Below is a list of buttons that you can use.
 *
 * - left, middle, right
 * @sectionName Available Buttons
 */

let buttonMap = {
  0: 'left',
  1: 'middle',
  2: 'right'
};
/**
 * Object containing the `radius` and current `x` and `y` position of the pointer relative to the top-left corner of the canvas.
 *
 * ```js
 * import { initPointer, pointer } from 'kontra';
 *
 * initPointer();
 *
 * console.log(pointer);  //=> { x: 100, y: 200, radius: 5 };
 * ```
 * @property {Object} pointer
 */

let pointer = {
  x: 0,
  y: 0,
  radius: 5 // arbitrary size

};
/**
 * Detection collision between a rectangle and a circlevt.
 * @see https://yal.cc/rectangle-circle-intersection-test/
 *
 * @param {Object} object - Object to check collision against.
 */

exports.pointer = pointer;

function circleRectCollision(object) {
  let x = object.x;
  let y = object.y;

  if (object.anchor) {
    x -= object.width * object.anchor.x;
    y -= object.height * object.anchor.y;
  }

  let dx = pointer.x - Math.max(x, Math.min(pointer.x, x + object.width));
  let dy = pointer.y - Math.max(y, Math.min(pointer.y, y + object.height));
  return dx * dx + dy * dy < pointer.radius * pointer.radius;
}
/**
 * Get the first on top object that the pointer collides with.
 *
 * @returns {Object} First object to collide with the pointer.
 */


function getCurrentObject() {
  // if pointer events are required on the very first frame or without a game
  // loop, use the current frame order array
  let frameOrder = lastFrameRenderOrder.length ? lastFrameRenderOrder : thisFrameRenderOrder;
  let length = frameOrder.length - 1;
  let object, collides;

  for (let i = length; i >= 0; i--) {
    object = frameOrder[i];

    if (object.collidesWithPointer) {
      collides = object.collidesWithPointer(pointer);
    } else {
      collides = circleRectCollision(object);
    }

    if (collides) {
      return object;
    }
  }
}
/**
 * Execute the onDown callback for an object.
 *
 * @param {MouseEvent|TouchEvent} evt
 */


function pointerDownHandler(evt) {
  // touchstart should be treated like a left mouse button
  let button = evt.button !== undefined ? buttonMap[evt.button] : 'left';
  pressedButtons[button] = true;
  pointerHandler(evt, 'onDown');
}
/**
 * Execute the onUp callback for an object.
 *
 * @param {MouseEvent|TouchEvent} evt
 */


function pointerUpHandler(evt) {
  let button = evt.button !== undefined ? buttonMap[evt.button] : 'left';
  pressedButtons[button] = false;
  pointerHandler(evt, 'onUp');
}
/**
 * Track the position of the mousevt.
 *
 * @param {MouseEvent|TouchEvent} evt
 */


function mouseMoveHandler(evt) {
  pointerHandler(evt, 'onOver');
}
/**
 * Reset pressed buttons.
 */


function blurEventHandler$1() {
  pressedButtons = {};
}
/**
 * Find the first object for the event and execute it's callback function
 *
 * @param {MouseEvent|TouchEvent} evt
 * @param {string} eventName - Which event was called.
 */


function pointerHandler(evt, eventName) {
  let canvas = getCanvas();
  if (!canvas) return;
  let clientX, clientY;

  if (['touchstart', 'touchmove', 'touchend'].indexOf(evt.type) !== -1) {
    clientX = (evt.touches[0] || evt.changedTouches[0]).clientX;
    clientY = (evt.touches[0] || evt.changedTouches[0]).clientY;
  } else {
    clientX = evt.clientX;
    clientY = evt.clientY;
  }

  let ratio = canvas.height / canvas.offsetHeight;
  let rect = canvas.getBoundingClientRect();
  let x = (clientX - rect.left) * ratio;
  let y = (clientY - rect.top) * ratio;
  pointer.x = x;
  pointer.y = y;
  evt.preventDefault();
  let object = getCurrentObject();

  if (object && object[eventName]) {
    object[eventName](evt);
  }

  if (callbacks$2[eventName]) {
    callbacks$2[eventName](evt, object);
  }
}
/**
 * Initialize pointer event listeners. This function must be called before using other pointer functions.
 * @function initPointer
 */


function initPointer() {
  let canvas = getCanvas();
  canvas.addEventListener('mousedown', pointerDownHandler);
  canvas.addEventListener('touchstart', pointerDownHandler);
  canvas.addEventListener('mouseup', pointerUpHandler);
  canvas.addEventListener('touchend', pointerUpHandler);
  canvas.addEventListener('blur', blurEventHandler$1);
  canvas.addEventListener('mousemove', mouseMoveHandler);
  canvas.addEventListener('touchmove', mouseMoveHandler); // reset object render order on every new frame

  on('tick', () => {
    lastFrameRenderOrder.length = 0;
    thisFrameRenderOrder.map(object => {
      lastFrameRenderOrder.push(object);
    });
    thisFrameRenderOrder.length = 0;
  });
}
/**
 * Begin tracking pointer events for a set of objects. Takes a single object or an array of objects.
 *
 * ```js
 * import { initPointer, track } from 'kontra';
 *
 * initPointer();
 *
 * track(obj);
 * track([obj1, obj2]);
 * ```
 * @function track
 *
 * @param {Object|Object[]} objects - Objects to track.
 */


function track(objects) {
  [].concat(objects).map(object => {
    // override the objects render function to keep track of render order
    if (!object._r) {
      object._r = object.render;

      object.render = function () {
        thisFrameRenderOrder.push(this);

        this._r();
      };

      trackedObjects.push(object);
    }
  });
}
/**
* Remove the callback function for a bound set of objects.
 *
 * ```js
 * import { untrack } from 'kontra';
 *
 * untrack(obj);
 * untrack([obj1, obj2]);
 * ```
 * @function untrack
 *
 * @param {Object|Object[]} objects - Object or objects to stop tracking.
 */


function untrack(objects) {
  [].concat(objects).map(object => {
    // restore original render function to no longer track render order
    object.render = object._r;
    object._r = 0; // 0 is the shortest falsy value

    let index = trackedObjects.indexOf(object);

    if (index !== -1) {
      trackedObjects.splice(index, 1);
    }
  });
}
/**
 * Check to see if the pointer is currently over the object. Since multiple objects may be rendered on top of one another, only the top most object under the pointer will return true.
 *
 * ```js
 * import { initPointer, track, pointer, pointerOver, Sprite } from 'kontra';
 *
 * initPointer();
 *
 * let sprite1 = Sprite({
 *   x: 10,
 *   y: 10,
 *   width: 10,
 *   height: 10
 * });
 * let sprite2 = Sprite({
 *   x: 15,
 *   y: 10,
 *   width: 10,
 *   height: 10
 * });
 *
 * track([sprite1, sprite2]);
 *
 * sprite1.render();
 * sprite2.render();
 *
 * pointer.x = 14;
 * pointer.y = 15;
 *
 * console.log(pointerOver(sprite1));  //=> false
 * console.log(pointerOver(sprite2));  //=> true
 * ```
 * @function pointerOver
 *
 * @param {Object} object - The object to check if the pointer is over.
 *
 * @returns {Boolean} `true` if the pointer is currently over the object, `false` otherwise.
 */


function pointerOver(object) {
  if (!trackedObjects.includes(object)) return false;
  return getCurrentObject() === object;
}
/**
 * Register a function to be called on all pointer down events. Is passed the original Event and the target object (if there is one).
 *
 * ```js
 * import { initPointer, onPointerDown } from 'kontra';
 *
 * initPointer();
 *
 * onPointerDown(function(e, object) {
 *   // handle pointer down
 * })
 * ```
 * @function onPointerDown
 *
 * @param {Function} callback - Function to call on pointer down.
 */


function onPointerDown(callback) {
  callbacks$2.onDown = callback;
}
/**
* Register a function to be called on all pointer up events. Is passed the original Event and the target object (if there is one).
 *
 * ```js
 * import { initPointer, onPointerUp } from 'kontra';
 *
 * initPointer();
 *
 * onPointerUp(function(e, object) {
 *   // handle pointer up
 * })
 * ```
 * @function onPointerUp
 *
 * @param {Function} callback - Function to call on pointer up.
 */


function onPointerUp(callback) {
  callbacks$2.onUp = callback;
}
/**
 * Check if a button is currently pressed. Use during an `update()` function to perform actions each frame.
 *
 * ```js
 * import { initPointer, pointerPressed } from 'kontra';
 *
 * initPointer();
 *
 * Sprite({
 *   update: function() {
 *     if (pointerPressed('left')){
 *       // left mouse button pressed
 *     }
 *     else if (pointerPressed('right')) {
 *       // right mouse button pressed
 *     }
 *   }
 * });
 * ```
 * @function pointerPressed
 *
 * @param {String} button - Button to check for pressed state.
 *
 * @returns {Boolean} `true` if the button is pressed, `false` otherwise.
 */


function pointerPressed(button) {
  return !!pressedButtons[button];
}
/**
 * A fast and memory efficient [object pool](https://gameprogrammingpatterns.com/object-pool.html) for sprite reuse. Perfect for particle systems or SHUMPs. The pool starts out with just one object, but will grow in size to accommodate as many objects as are needed.
 *
 * <canvas width="600" height="200" id="pool-example"></canvas>
 * <script src="assets/js/pool.js"></script>
 * @class Pool
 *
 * @param {Object} properties - Properties of the pool.
 * @param {Function} properties.create - Function that returns a new object to be added to the pool when there are no more alive objects.
 * @param {Number} [properties.maxSize=1024] - The maximum number of objects allowed in the pool. The pool will never grow beyond this size.
 */


class Pool {
  /**
   * @docs docs/api_docs/pool.js
   */
  constructor({
    create,
    maxSize = 1024
  } = {}) {
    // check for the correct structure of the objects added to pools so we know that the
    // rest of the pool code will work without errors
    // @if DEBUG
    let obj;

    if (!create || !(obj = create()) || !(obj.update && obj.init && obj.isAlive)) {
      throw Error('Must provide create() function which returns an object with init(), update(), and isAlive() functions');
    } // @endif
    // c = create, i = inUse


    this._c = create;
    this._i = 0;
    /**
     * All objects currently in the pool, both alive and not alive.
     * @memberof Pool
     * @property {Object[]} objects
     */

    this.objects = [create()]; // start the pool with an object

    /**
     * The number of alive objects.
     * @memberof Pool
     * @property {Number} size
     */

    this.size = 1;
    /**
     * The maximum number of objects allowed in the pool. The pool will never grow beyond this size.
     * @memberof Pool
     * @property {Number} maxSize
     */

    this.maxSize = maxSize;
  }
  /**
   * Get and return an object from the pool. The properties parameter will be passed directly to the objects `init()` function. If you're using a kontra.Sprite, you should also pass the `ttl` property to designate how many frames you want the object to be alive for.
   *
   * If you want to control when the sprite is ready for reuse, pass `Infinity` for `ttl`. You'll need to set the sprites `ttl` to `0` when you're ready for the sprite to be reused.
   *
   * ```js
   * // exclude-tablist
   * let sprite = pool.get({
   *   // the object will get these properties and values
   *   x: 100,
   *   y: 200,
   *   width: 20,
   *   height: 40,
   *   color: 'red',
   *
   *   // pass Infinity for ttl to prevent the object from being reused
   *   // until you set it back to 0
   *   ttl: Infinity
   * });
   * ```
   * @memberof Pool
   * @function get
   *
   * @param {Object} properties - Properties to pass to the objects `init()` function.
   *
   * @returns {Object} The newly initialized object.
   */


  get(properties = {}) {
    // the pool is out of objects if the first object is in use and it can't grow
    if (this.objects.length == this._i) {
      if (this.size === this.maxSize) {
        return;
      } // double the size of the array by filling it with twice as many objects
      else {
          for (let x = 0; x < this.size && this.objects.length < this.maxSize; x++) {
            this.objects.unshift(this._c());
          }

          this.size = this.objects.length;
        }
    } // save off first object in pool to reassign to last object after unshift


    let obj = this.objects.shift();
    obj.init(properties);
    this.objects.push(obj);
    this._i++;
    return obj;
  }
  /**
   * Returns an array of all alive objects. Useful if you need to do special processing on all alive objects outside of the pool, such as add all alive objects to a kontra.Quadtree.
   * @memberof Pool
   * @function getAliveObjects
   *
   * @returns {Object[]} An Array of all alive objects.
   */


  getAliveObjects() {
    return this.objects.slice(this.objects.length - this._i);
  }
  /**
   * Clear the object pool. Removes all objects from the pool and resets its [size](api/pool/#size) to 1.
   * @memberof Pool
   * @function clear
   */


  clear() {
    this._i = this.objects.length = 0;
    this.size = 1;
    this.objects.push(this._c());
  }
  /**
   * Update all alive objects in the pool by calling the objects `update()` function. This function also manages when each object should be recycled, so it is recommended that you do not call the objects `update()` function outside of this function.
   * @memberof Pool
   * @function update
   *
   * @param {Number} [dt] - Time since last update.
   */


  update(dt) {
    let i = this.size - 1;
    let obj; // If the user kills an object outside of the update cycle, the pool won't know of
    // the change until the next update and this._i won't be decremented. If the user then
    // gets an object when this._i is the same size as objects.length, this._i will increment
    // and this statement will evaluate to -1.
    //
    // I don't like having to go through the pool to kill an object as it forces you to
    // know which object came from which pool. Instead, we'll just prevent the index from
    // going below 0 and accept the fact that this._i may be out of sync for a frame.

    let index = Math.max(this.objects.length - this._i, 0); // only iterate over the objects that are alive

    while (i >= index) {
      obj = this.objects[i];
      obj.update(dt); // if the object is dead, move it to the front of the pool

      if (!obj.isAlive()) {
        this.objects = this.objects.splice(i, 1).concat(this.objects);
        this._i--;
        index++;
      } else {
        i--;
      }
    }
  }
  /**
   * Render all alive objects in the pool by calling the objects `render()` function.
   * @memberof Pool
   * @function render
   */


  render() {
    let index = Math.max(this.objects.length - this._i, 0);

    for (let i = this.size - 1; i >= index; i--) {
      this.objects[i].render();
    }
  }

}

function poolFactory(properties) {
  return new Pool(properties);
}

poolFactory.prototype = Pool.prototype;
poolFactory.class = Pool;
/**
 * Determine which subnodes the object intersects with
 *
 * @param {Object} object - Object to check.
 * @param {Object} bounds - Bounds of the quadtree.
 *
 * @returns {Number[]} List of all subnodes object intersects.
 */

function getIndices(object, bounds) {
  let indices = [];
  let verticalMidpoint = bounds.x + bounds.width / 2;
  let horizontalMidpoint = bounds.y + bounds.height / 2; // save off quadrant checks for reuse

  let intersectsTopQuadrants = object.y < horizontalMidpoint && object.y + object.height >= bounds.y;
  let intersectsBottomQuadrants = object.y + object.height >= horizontalMidpoint && object.y < bounds.y + bounds.height; // object intersects with the left quadrants

  if (object.x < verticalMidpoint && object.x + object.width >= bounds.x) {
    if (intersectsTopQuadrants) {
      // top left
      indices.push(0);
    }

    if (intersectsBottomQuadrants) {
      // bottom left
      indices.push(2);
    }
  } // object intersects with the right quadrants


  if (object.x + object.width >= verticalMidpoint && object.x < bounds.x + bounds.width) {
    // top right
    if (intersectsTopQuadrants) {
      indices.push(1);
    }

    if (intersectsBottomQuadrants) {
      // bottom right
      indices.push(3);
    }
  }

  return indices;
}
/*
The quadtree acts like an object pool in that it will create subnodes as objects are needed but it won't clean up the subnodes when it collapses to avoid garbage collection.

The quadrant indices are numbered as follows (following a z-order curve):
     |
  0  |  1
 ----+----
  2  |  3
     |
*/

/**
 * A 2D [spatial partitioning](https://gameprogrammingpatterns.com/spatial-partition.html) data structure. Use it to quickly group objects by their position for faster access and collision checking.
 *
 * <canvas width="600" height="200" id="quadtree-example"></canvas>
 * <script src="assets/js/quadtree.js"></script>
 * @class Quadtree
 *
 * @param {Object} properties - Properties of the quadtree.
 * @param {Number} [properties.maxDepth=3] - Maximum node depth of the quadtree.
 * @param {Number} [properties.maxObjects=25] - Maximum number of objects a node can have before splitting.
 * @param {Object} [properties.bounds] - The 2D space (x, y, width, height) the quadtree occupies. Defaults to the entire canvas width and height.
 */


class Quadtree {
  /**
   * @docs docs/api_docs/quadtree.js
   */
  constructor({
    maxDepth = 3,
    maxObjects = 25,
    bounds
  } = {}) {
    /**
     * Maximum node depth of the quadtree.
     * @memberof Quadtree
     * @property {Number} maxDepth
     */
    this.maxDepth = maxDepth;
    /**
     * Maximum number of objects a node can have before splitting.
     * @memberof Quadtree
     * @property {Number} maxObjects
     */

    this.maxObjects = maxObjects;
    /**
     * The 2D space (x, y, width, height) the quadtree occupies.
     * @memberof Quadtree
     * @property {Object} bounds
     */

    let canvas = getCanvas();
    this.bounds = bounds || {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    }; // since we won't clean up any subnodes, we need to keep track of which nodes are
    // currently the leaf node so we know which nodes to add objects to
    // b = branch, d = depth, o = objects, s = subnodes, p = parent

    this._b = false;
    this._d = 0;
    this._o = [];
    this._s = [];
    this._p = null;
  }
  /**
   * Removes all objects from the quadtree. You should clear the quadtree every frame before adding all objects back into it.
   * @memberof Quadtree
   * @function clear
   */


  clear() {
    this._s.map(function (subnode) {
      subnode.clear();
    });

    this._b = false;
    this._o.length = 0;
  }
  /**
   * Get an array of all objects that belong to the same node as the passed in object.
   *
   * **Note:** if the passed in object is also part of the quadtree, it will not be returned in the results.
   *
   * ```js
   * import { Sprite, Quadtree } from 'kontra';
   *
   * let quadtree = Quadtree();
   * let player = Sprite({
   *   // ...
   * });
   * let enemy1 = Sprite({
   *   // ...
   * });
   * let enemy2 = Sprite({
   *   // ...
   * });
   *
   * quadtree.add(player, enemy1, enemy2);
   * quadtree.get(player);  //=> [enemy1]
   * ```
   * @memberof Quadtree
   * @function get
   *
   * @param {Object} object - Object to use for finding other objects. The object must have the properties `x`, `y`, `width`, and `height` so that its position in the quadtree can be calculated.
   *
   * @returns {Object[]} A list of objects in the same node as the object, not including the object itself.
   */


  get(object) {
    // since an object can belong to multiple nodes we should not add it multiple times
    let objects = new Set();
    let indices, i; // traverse the tree until we get to a leaf node

    while (this._s.length && this._b) {
      indices = getIndices(object, this.bounds);

      for (i = 0; i < indices.length; i++) {
        this._s[indices[i]].get(object).forEach(obj => objects.add(obj));
      }

      return Array.from(objects);
    } // don't add the object to the return list


    return this._o.filter(obj => obj !== object);
  }
  /**
   * Add objects to the quadtree and group them by their position. Can take a single object, a list of objects, and an array of objects.
   *
   * ```js
   * import { Quadtree, Sprite, Pool, GameLoop } from 'kontra';
   *
   * let quadtree = Quadtree();
   * let bulletPool = Pool({
   *   create: Sprite
   * });
   *
   * let player = Sprite({
   *   // ...
   * });
   * let enemy = Sprite({
   *   // ...
   * });
   *
   * // create some bullets
   * for (let i = 0; i < 100; i++) {
   *   bulletPool.get({
   *     // ...
   *   });
   * }
   *
   * let loop = GameLoop({
   *   update: function() {
   *     quadtree.clear();
   *     quadtree.add(player, enemy, bulletPool.getAliveObjects());
   *   }
   * });
   * ```
   * @memberof Quadtree
   * @function add
   *
   * @param {Object|Object[]} objectsN - Objects to add to the quadtree.
   */


  add() {
    let i, j, object, obj;

    for (j = 0; j < arguments.length; j++) {
      object = arguments[j]; // add a group of objects separately

      if (Array.isArray(object)) {
        this.add.apply(this, object);
        continue;
      } // current node has subnodes, so we need to add this object into a subnode


      if (this._b) {
        this._a(object);

        continue;
      } // this node is a leaf node so add the object to it


      this._o.push(object); // split the node if there are too many objects


      if (this._o.length > this.maxObjects && this._d < this.maxDepth) {
        this._sp(); // move all objects to their corresponding subnodes


        for (i = 0; obj = this._o[i]; i++) {
          this._a(obj);
        }

        this._o.length = 0;
      }
    }
  }
  /**
   * Add an object to a subnode.
   *
   * @param {Object} object - Object to add into a subnode
   */
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var


  _a(object, indices, i) {
    indices = getIndices(object, this.bounds); // add the object to all subnodes it intersects

    for (i = 0; i < indices.length; i++) {
      this._s[indices[i]].add(object);
    }
  }
  /**
   * Split the node into four subnodes.
   */
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var


  _sp(subWidth, subHeight, i) {
    this._b = true; // only split if we haven't split before

    if (this._s.length) {
      return;
    }

    subWidth = this.bounds.width / 2 | 0;
    subHeight = this.bounds.height / 2 | 0;

    for (i = 0; i < 4; i++) {
      this._s[i] = quadtreeFactory({
        bounds: {
          x: this.bounds.x + (i % 2 === 1 ? subWidth : 0),
          // nodes 1 and 3
          y: this.bounds.y + (i >= 2 ? subHeight : 0),
          // nodes 2 and 3
          width: subWidth,
          height: subHeight
        },
        maxDepth: this.maxDepth,
        maxObjects: this.maxObjects
      }); // d = depth, p = parent

      this._s[i]._d = this._d + 1;
      /* @if VISUAL_DEBUG */

      this._s[i]._p = this;
      /* @endif */
    }
  }
  /**
   * Draw the quadtree. Useful for visual debugging.
   */

  /* @if VISUAL_DEBUG **
  render() {
    // don't draw empty leaf nodes, always draw branch nodes and the first node
    if (this._o.length || this._d === 0 ||
        (this._p && this._p._b)) {
       context.strokeStyle = 'red';
      context.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
       if (this._s.length) {
        for (let i = 0; i < 4; i++) {
          this._s[i].render();
        }
      }
    }
  }
  /* @endif */


}

function quadtreeFactory(properties) {
  return new Quadtree(properties);
}

quadtreeFactory.prototype = Quadtree.prototype;
quadtreeFactory.class = Quadtree;
/**
 * A simple 2d vector object.
 *
 * ```js
 * import { Vector } from 'kontra';
 *
 * let vector = Vector(100, 200);
 * ```
 * @class Vector
 *
 * @param {Number} [x=0] - X coordinate of the vector.
 * @param {Number} [y=0] - Y coordinate of the vector.
 */

class Vector {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }
  /**
   * Return a new Vector whose value is the addition of the current Vector and the passed in Vector. If `dt` is provided, the result is multiplied by the value.
   * @memberof Vector
   * @function add
   *
   * @param {kontra.Vector} vector - Vector to add to the current Vector.
   * @param {Number} [dt=1] - Time since last update.
   *
   * @returns {kontra.Vector} A new kontra.Vector instance.
   */


  add(vec, dt = 1) {
    return vectorFactory(this.x + (vec.x || 0) * dt, this.y + (vec.y || 0) * dt, this);
  }
  /**
   * Clamp the Vector between two points, preventing `x` and `y` from going below or above the minimum and maximum values. Perfect for keeping a sprite from going outside the game boundaries.
   *
   * ```js
   * import { Vector } from 'kontra';
   *
   * let vector = Vector(100, 200);
   * vector.clamp(0, 0, 200, 300);
   *
   * vector.x += 200;
   * console.log(vector.x);  //=> 200
   *
   * vector.y -= 300;
   * console.log(vector.y);  //=> 0
   *
   * vector.add({x: -500, y: 500});
   * console.log(vector);    //=> {x: 0, y: 300}
   * ```
   * @memberof Vector
   * @function clamp
   *
   * @param {Number} xMin - Minimum x value.
   * @param {Number} yMin - Minimum y value.
   * @param {Number} xMax - Maximum x value.
   * @param {Number} yMax - Maximum y value.
   */


  clamp(xMin, yMin, xMax, yMax) {
    this._c = true;
    this._a = xMin;
    this._b = yMin;
    this._d = xMax;
    this._e = yMax;
  }
  /**
   * X coordinate of the vector.
   * @memberof Vector
   * @property {Number} x
   */


  get x() {
    return this._x;
  }
  /**
   * Y coordinate of the vector.
   * @memberof Vector
   * @property {Number} y
   */


  get y() {
    return this._y;
  }

  set x(value) {
    this._x = this._c ? Math.min(Math.max(this._a, value), this._d) : value;
  }

  set y(value) {
    this._y = this._c ? Math.min(Math.max(this._b, value), this._e) : value;
  }

}

function vectorFactory(x, y, vec = {}) {
  let vector = new Vector(x, y); // preserve vector clamping when creating new vectors

  if (vec._c) {
    vector.clamp(vec._a, vec._b, vec._d, vec._e); // reset x and y so clamping takes effect

    vector.x = x;
    vector.y = y;
  }

  return vector;
}

vectorFactory.prototype = Vector.prototype;
vectorFactory.class = Vector;
/**
 * A versatile way to update and draw your game objects. It can handle simple rectangles, images, and sprite sheet animations. It can be used for your main player object as well as tiny particles in a particle engine.
 * @class Sprite
 *
 * @param {Object} properties - Properties of the sprite.
 * @param {Number} properties.x - X coordinate of the position vector.
 * @param {Number} properties.y - Y coordinate of the position vector.
 * @param {Number} [properties.dx] - X coordinate of the velocity vector.
 * @param {Number} [properties.dy] - Y coordinate of the velocity vector.
 * @param {Number} [properties.ddx] - X coordinate of the acceleration vector.
 * @param {Number} [properties.ddy] - Y coordinate of the acceleration vector.
 *
 * @param {String} [properties.color] - Fill color for the sprite if no image or animation is provided.
 * @param {Number} [properties.width] - Width of the sprite.
 * @param {Number} [properties.height] - Height of the sprite.
 *
 * @param {Number} [properties.ttl=Infinity] - How many frames the sprite should be alive. Used by kontra.Pool.
 * @param {Number} [properties.rotation=0] - Sprites rotation around the origin in radians.
 * @param {Number} [properties.anchor={x:0,y:0}] - The x and y origin of the sprite. {x:0, y:0} is the top left corner of the sprite, {x:1, y:1} is the bottom right corner.
 *
 * @param {Canvas​Rendering​Context2D} [properties.context] - The context the sprite should draw to. Defaults to [core.getContext()](api/core#getContext).
 *
 * @param {Image|HTMLCanvasElement} [properties.image] - Use an image to draw the sprite.
 * @param {Object} [properties.animations] - An object of [Animations](api/animation) from a kontra.Spritesheet to animate the sprite.
 *
 * @param {Function} [properties.update] - Function called every frame to update the sprite.
 * @param {Function} [properties.render] - Function called every frame to render the sprite.
 * @param {*} [properties.*] - Any additional properties you need added to the sprite. For example, if you pass `Sprite({type: 'player'})` then the sprite will also have a property of the same name and value. You can pass as many additional properties as you want.
 */

class Sprite {
  /**
   * @docs docs/api_docs/sprite.js
   */
  constructor(properties) {
    this.init(properties);
  }
  /**
   * Use this function to reinitialize a sprite. It takes the same properties object as the constructor. Useful it you want to repurpose a sprite.
   * @memberof Sprite
   * @function init
   *
   * @param {Object} properties - Properties of the sprite.
   */


  init(properties = {}) {
    let {
      x,
      y,
      dx,
      dy,
      ddx,
      ddy,
      width,
      height,
      image
    } = properties;
    /**
     * The sprites position vector. The sprites position is its position in the world, as opposed to the position in the [viewport](api/sprite#viewX). Typically the position in the world and the viewport are the same value. If the sprite has been [added to a tileEngine](/api/tileEngine#addObject), the position vector represents where in the tile world the sprite is while the viewport represents where to draw the sprite in relation to the top-left corner of the canvas.
     * @memberof Sprite
     * @property {kontra.Vector} position
     */

    this.position = vectorFactory(x, y);
    /**
     * The sprites velocity vector.
     * @memberof Sprite
     * @property {kontra.Vector} velocity
     */

    this.velocity = vectorFactory(dx, dy);
    /**
     * The sprites acceleration vector.
     * @memberof Sprite
     * @property {kontra.Vector} acceleration
     */

    this.acceleration = vectorFactory(ddx, ddy); // defaults
    // sx = flipX, sy = flipY

    this._fx = this._fy = 1;
    /**
     * The rotation of the sprite around the origin in radians.
     * @memberof Sprite
     * @property {Number} rotation
     */

    this.width = this.height = this.rotation = 0;
    /**
     * How may frames the sprite should be alive. Primarily used by kontra.Pool to know when to recycle an object.
     * @memberof Sprite
     * @property {Number} ttl
     */

    this.ttl = Infinity;
    /**
     * The x and y origin of the sprite. {x:0, y:0} is the top left corner of the sprite, {x:1, y:1} is the bottom right corner.
     * @memberof Sprite
     * @property {Object} anchor
     *
     * @example
     * // exclude-code:start
     * let { Sprite } = kontra;
     * // exclude-code:end
     * // exclude-script:start
     * import { Sprite } from 'kontra';
     * // exclude-script:end
     *
     * let sprite = Sprite({
     *   x: 150,
     *   y: 100,
     *   color: 'red',
     *   width: 50,
     *   height: 50,
     *   // exclude-code:start
     *   context: context,
     *   // exclude-code:end
     *   render: function() {
     *     this.draw();
     *
     *     // draw origin
     *     this.context.fillStyle = 'yellow';
     *     this.context.beginPath();
     *     this.context.arc(this.x, this.y, 3, 0, 2*Math.PI);
     *     this.context.fill();
     *   }
     * });
     * sprite.render();
     *
     * sprite.anchor = {x: 0.5, y: 0.5};
     * sprite.x = 300;
     * sprite.render();
     *
     * sprite.anchor = {x: 1, y: 1};
     * sprite.x = 450;
     * sprite.render();
     */

    this.anchor = {
      x: 0,
      y: 0
    };
    /**
     * The context the sprite will draw to.
     * @memberof Sprite
     * @property {Canvas​Rendering​Context2D} context
     */

    this.context = getContext();
    /**
     * The color of the sprite if it was passed as an argument.
     * @memberof Sprite
     * @property {String} color
     */

    /**
    * The image the sprite will use when drawn if passed as an argument.
    * @memberof Sprite
    * @property {Image|HTMLCanvasElement} image
    */
    // add all properties to the sprite, overriding any defaults

    for (let prop in properties) {
      this[prop] = properties[prop];
    } // image sprite


    if (image) {
      this.width = width !== undefined ? width : image.width;
      this.height = height !== undefined ? height : image.height;
    }
    /**
     * The X coordinate of the camera. Used to determine [viewX](api/sprite#viewX).
     * @memberof Sprite
     * @property {Number} sx
     */


    this.sx = 0;
    /**
     * The Y coordinate of the camera. Used to determine [viewY](api/sprite#viewY).
     * @memberof Sprite
     * @property {Number} sy
     */

    this.sy = 0;
  } // define getter and setter shortcut functions to make it easier to work with the
  // position, velocity, and acceleration vectors.

  /**
   * X coordinate of the position vector.
   * @memberof Sprite
   * @property {Number} x
   */


  get x() {
    return this.position.x;
  }
  /**
   * Y coordinate of the position vector.
   * @memberof Sprite
   * @property {Number} y
   */


  get y() {
    return this.position.y;
  }
  /**
   * X coordinate of the velocity vector.
   * @memberof Sprite
   * @property {Number} dx
   */


  get dx() {
    return this.velocity.x;
  }
  /**
   * Y coordinate of the velocity vector.
   * @memberof Sprite
   * @property {Number} dy
   */


  get dy() {
    return this.velocity.y;
  }
  /**
   * X coordinate of the acceleration vector.
   * @memberof Sprite
   * @property {Number} ddx
   */


  get ddx() {
    return this.acceleration.x;
  }
  /**
   * Y coordinate of the acceleration vector.
   * @memberof Sprite
   * @property {Number} ddy
   */


  get ddy() {
    return this.acceleration.y;
  }
  /**
   * An object of [Animations](api/animation) from a kontra.SpriteSheet to animate the sprite. Each animation is named so that it can can be used by name for the sprites [playAnimation()](api/sprite/#playAnimation) function.
   *
   * ```js
   * import { Sprite, SpriteSheet } from 'kontra';
   *
   * let spriteSheet = SpriteSheet({
   *   // ...
   *   animations: {
   *     idle: {
   *       frames: 1,
   *       loop: false,
   *     },
   *     walk: {
   *       frames: [1,2,3]
   *     }
   *   }
   * });
   *
   * let sprite = Sprite({
   *   x: 100,
   *   y: 200,
   *   animations: spriteSheet.animations
   * });
   *
   * sprite.playAnimation('idle');
   * ```
   * @memberof Sprite
   * @property {Object} animations
   */


  get animations() {
    return this._a;
  }
  /**
   * Readonly. X coordinate of where to draw the sprite. Typically the same value as the [position vector](api/sprite#position) unless the sprite has been [added to a tileEngine](api/tileEngine#addObject).
   * @memberof Sprite
   * @property {Number} viewX
   */


  get viewX() {
    return this.x - this.sx;
  }
  /**
   * Readonly. Y coordinate of where to draw the sprite. Typically the same value as the [position vector](api/sprite#position) unless the sprite has been [added to a tileEngine](api/tileEngine#addObject).
   * @memberof Sprite
   * @property {Number} viewY
   */


  get viewY() {
    return this.y - this.sy;
  }
  /**
   * The width of the sprite. If the sprite is a [rectangle sprite](api/sprite/#rectangle-sprite), it uses the passed in value. For an [image sprite](api/sprite/#image-sprite) it is the width of the image. And for an [animation sprite](api/sprite/#animation-sprite) it is the width of a single frame of the animation.
   *
   * Setting the value to a negative number will result in the sprite being flipped across the vertical axis while the width will remain a positive value.
   * @memberof Sprite
   * @property {Number} width
   */


  get width() {
    return this._w;
  }
  /**
   * The height of the sprite. If the sprite is a [rectangle sprite](api/sprite/#rectangle-sprite), it uses the passed in value. For an [image sprite](api/sprite/#image-sprite) it is the height of the image. And for an [animation sprite](api/sprite/#animation-sprite) it is the height of a single frame of the animation.
   *
   * Setting the value to a negative number will result in the sprite being flipped across the horizontal axis while the height will remain a positive value.
   * @memberof Sprite
   * @property {Number} height
   */


  get height() {
    return this._h;
  }

  set x(value) {
    this.position.x = value;
  }

  set y(value) {
    this.position.y = value;
  }

  set dx(value) {
    this.velocity.x = value;
  }

  set dy(value) {
    this.velocity.y = value;
  }

  set ddx(value) {
    this.acceleration.x = value;
  }

  set ddy(value) {
    this.acceleration.y = value;
  }

  set animations(value) {
    let prop, firstAnimation; // a = animations

    this._a = {}; // clone each animation so no sprite shares an animation

    for (prop in value) {
      this._a[prop] = value[prop].clone(); // default the current animation to the first one in the list

      firstAnimation = firstAnimation || this._a[prop];
    }
    /**
     * The currently playing Animation object if `animations` was passed as an argument.
     * @memberof Sprite
     * @property {kontra.Animation} currentAnimation
     */


    this.currentAnimation = firstAnimation;
    this.width = this.width || firstAnimation.width;
    this.height = this.height || firstAnimation.height;
  } // readonly


  set viewX(value) {
    return;
  }

  set viewY(value) {
    return;
  }

  set width(value) {
    let sign = value < 0 ? -1 : 1;
    this._fx = sign;
    this._w = value * sign;
  }

  set height(value) {
    let sign = value < 0 ? -1 : 1;
    this._fy = sign;
    this._h = value * sign;
  }
  /**
   * Check if the sprite is alive. Primarily used by kontra.Pool to know when to recycle an object.
   * @memberof Sprite
   * @function isAlive
   *
   * @returns {Boolean} `true` if the sprites [ttl](api/sprite/#ttl) property is above `0`, `false` otherwise.
   */


  isAlive() {
    return this.ttl > 0;
  }
  /**
   * Check if the sprite collide with the object. Uses a simple [Axis-Aligned Bounding Box (AABB) collision check](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Axis-Aligned_Bounding_Box). Takes into account the sprites [anchor](api/sprite/#anchor).
   *
   * **NOTE:** Does not take into account sprite rotation. If you need collision detection between rotated sprites you will need to implement your own `collidesWith()` function. I suggest looking at the Separate Axis Theorem.
   *
   * ```js
   * import { Sprite } from 'kontra';
   *
   * let sprite = Sprite({
   *   x: 100,
   *   y: 200,
   *   width: 20,
   *   height: 40
   * });
   *
   * let sprite2 = Sprite({
   *   x: 150,
   *   y: 200,
   *   width: 20,
   *   height: 20
   * });
   *
   * sprite.collidesWith(sprite2);  //=> false
   *
   * sprite2.x = 115;
   *
   * sprite.collidesWith(sprite2);  //=> true
   * ```
   *
   * If you need a different type of collision check, you can override this function by passing an argument by the same name.
   *
   * ```js
   * // circle collision
   * function collidesWith(object) {
   *   let dx = this.x - object.x;
   *   let dy = this.y - object.y;
   *   let distance = Math.sqrt(dx * dx + dy * dy);
   *
   *   return distance < this.radius + object.radius;
   * }
   *
   * let sprite = Sprite({
   *   x: 100,
   *   y: 200,
   *   radius: 25,
   *   collidesWith: collidesWith
   * });
   *
   * let sprite2 = Sprite({
   *   x: 150,
   *   y: 200,
   *   radius: 30,
   *   collidesWith: collidesWith
   * });
   *
   * sprite.collidesWith(sprite2);  //=> true
   * ```
   * @memberof Sprite
   * @function collidesWith
   *
   * @param {Object} object - Object to check collision against.
   *
   * @returns {Boolean|null} `true` if the objects collide, `false` otherwise. Will return `null` if the either of the two objects are rotated.
   */


  collidesWith(object) {
    if (this.rotation || object.rotation) return null; // take into account sprite anchors

    let x = this.x - this.width * this.anchor.x;
    let y = this.y - this.height * this.anchor.y;
    let objX = object.x;
    let objY = object.y;

    if (object.anchor) {
      objX -= object.width * object.anchor.x;
      objY -= object.height * object.anchor.y;
    }

    return x < objX + object.width && x + this.width > objX && y < objY + object.height && y + this.height > objY;
  }
  /**
   * Update the sprites position based on its velocity and acceleration. Calls the sprites [advance()](api/sprite/#advance) function.
   * @memberof Sprite
   * @function update
   *
   * @param {Number} [dt] - Time since last update.
   */


  update(dt) {
    this.advance(dt);
  }
  /**
   * Render the sprite. Calls the sprites [draw()](api/sprite/#draw) function.
   * @memberof Sprite
   * @function render
   */


  render() {
    this.draw();
  }
  /**
   * Set the currently playing animation of an animation sprite.
   *
   * ```js
   * import { Sprite, SpriteSheet } from 'kontra';
   *
   * let spriteSheet = SpriteSheet({
   *   // ...
   *   animations: {
   *     idle: {
   *       frames: 1
   *     },
   *     walk: {
   *       frames: [1,2,3]
   *     }
   *   }
   * });
   *
   * let sprite = Sprite({
   *   x: 100,
   *   y: 200,
   *   animations: spriteSheet.animations
   * });
   *
   * sprite.playAnimation('idle');
   * ```
   * @memberof Sprite
   * @function playAnimation
   *
   * @param {String} name - Name of the animation to play.
   */


  playAnimation(name) {
    this.currentAnimation = this.animations[name];

    if (!this.currentAnimation.loop) {
      this.currentAnimation.reset();
    }
  }
  /**
   * Move the sprite by its acceleration and velocity. If the sprite is an [animation sprite](api/sprite/#animation-sprite), it also advances the animation every frame.
   *
   * If you override the sprites [update()](api/sprite/#update) function with your own update function, you can call this function to move the sprite normally.
   *
   * ```js
   * import { Sprite } from 'kontra';
   *
   * let sprite = Sprite({
   *   x: 100,
   *   y: 200,
   *   width: 20,
   *   height: 40,
   *   dx: 5,
   *   dy: 2,
   *   update: function() {
   *     // move the sprite normally
   *     sprite.advance();
   *
   *     // change the velocity at the edges of the canvas
   *     if (this.x < 0 ||
   *         this.x + this.width > this.context.canvas.width) {
   *       this.dx = -this.dx;
   *     }
   *     if (this.y < 0 ||
   *         this.y + this.height > this.context.canvas.height) {
   *       this.dy = -this.dy;
   *     }
   *   }
   * });
   * ```
   * @memberof Sprite
   * @function advance
   *
   * @param {Number} [dt] - Time since last update.
   *
   */


  advance(dt) {
    this.velocity = this.velocity.add(this.acceleration, dt);
    this.position = this.position.add(this.velocity, dt);
    this.ttl--;

    if (this.currentAnimation) {
      this.currentAnimation.update(dt);
    }
  }
  /**
   * Draw the sprite at its X and Y position. This function changes based on the type of the sprite. For a [rectangle sprite](api/sprite/#rectangle-sprite), it uses `context.fillRect()`, for an [image sprite](api/sprite/#image-sprite) it uses `context.drawImage()`, and for an [animation sprite](api/sprite/#animation-sprite) it uses the [currentAnimation](api/sprite/#currentAnimation) `render()` function.
   *
   * If you override the sprites `render()` function with your own render function, you can call this function to draw the sprite normally.
   *
   * ```js
   * import { Sprite } from 'kontra';
   *
   * let sprite = Sprite({
   *  x: 290,
   *  y: 80,
   *  color: 'red',
   *  width: 20,
   *  height: 40,
   *
   *  render: function() {
   *    // draw the rectangle sprite normally
   *    this.draw();
   *
   *    // outline the sprite
   *    this.context.strokeStyle = 'yellow';
   *    this.context.lineWidth = 2;
   *    this.context.strokeRect(this.x, this.y, this.width, this.height);
   *  }
   * });
   *
   * sprite.render();
   * ```
   * @memberof Sprite
   * @function draw
   */


  draw() {
    let anchorWidth = -this.width * this.anchor.x;
    let anchorHeight = -this.height * this.anchor.y;
    this.context.save();
    this.context.translate(this.viewX, this.viewY); // rotate around the anchor

    if (this.rotation) {
      this.context.rotate(this.rotation);
    } // flip sprite around the center so the x/y position does not change


    if (this._fx == -1 || this._fy == -1) {
      let x = this.width / 2 + anchorWidth;
      let y = this.height / 2 + anchorHeight;
      this.context.translate(x, y);
      this.context.scale(this._fx, this._fy);
      this.context.translate(-x, -y);
    }

    if (this.image) {
      this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, anchorWidth, anchorHeight, this.width, this.height);
    } else if (this.currentAnimation) {
      this.currentAnimation.render({
        x: anchorWidth,
        y: anchorHeight,
        width: this.width,
        height: this.height,
        context: this.context
      });
    } else {
      this.context.fillStyle = this.color;
      this.context.fillRect(anchorWidth, anchorHeight, this.width, this.height);
    }

    this.context.restore();
  }

}

function spriteFactory(properties) {
  return new Sprite(properties);
}

spriteFactory.prototype = Sprite.prototype;
spriteFactory.class = Sprite;
/**
 * Parse a string of consecutive frames.
 *
 * @param {Number|String} frames - Start and end frame.
 *
 * @returns {Number|Number[]} List of frames.
 */

function parseFrames(consecutiveFrames) {
  // return a single number frame
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types
  if (+consecutiveFrames === consecutiveFrames) {
    return consecutiveFrames;
  }

  let sequence = [];
  let frames = consecutiveFrames.split('..'); // coerce string to number
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types

  let start = +frames[0];
  let end = +frames[1];
  let i = start; // ascending frame order

  if (start < end) {
    for (; i <= end; i++) {
      sequence.push(i);
    }
  } // descending order
  else {
      for (; i >= end; i--) {
        sequence.push(i);
      }
    }

  return sequence;
}
/**
 * A sprite sheet to animate a sequence of images. Used to create [animation sprites](api/sprite/#animation-sprite).
 *
 * <figure>
 *   <a href="assets/imgs/character_walk_sheet.png">
 *     <img src="assets/imgs/character_walk_sheet.png" alt="11 frames of a walking pill-like alien wearing a space helmet.">
 *   </a>
 *   <figcaption>Sprite sheet image courtesy of <a href="https://kenney.nl/assets">Kenney</a>.</figcaption>
 * </figure>
 *
 * Typically you create a sprite sheet just to create animations and then use the animations for your sprite.
 *
 * ```js
 * import { Sprite, SpriteSheet } from 'kontra';
 *
 * let image = new Image();
 * image.src = 'assets/imgs/character_walk_sheet.png';
 * image.onload = function() {
 *   let spriteSheet = SpriteSheet({
 *     image: image,
 *     frameWidth: 72,
 *     frameHeight: 97,
 *     animations: {
 *       // create a named animation: walk
 *       walk: {
 *         frames: '0..9',  // frames 0 through 9
 *         frameRate: 30
 *       }
 *     }
 *   });
 *
 *   let sprite = Sprite({
 *     x: 200,
 *     y: 100,
 *
 *     // use the sprite sheet animations for the sprite
 *     animations: spriteSheet.animations
 *   });
 * };
 * ```
 * @class SpriteSheet
 *
 * @param {Object} properties - Properties of the sprite sheet.
 * @param {Image|HTMLCanvasElement} properties.image - The sprite sheet image.
 * @param {Number} properties.frameWidth - The width of a single frame.
 * @param {Number} properties.frameHeight - The height of a single frame.
 * @param {Number} [properties.frameMargin=0] - The amount of whitespace between each frame.
 * @param {Object} [properties.animations] - Animations to create from the sprite sheet using kontra.Animation. Passed directly into the sprite sheets [createAnimations()](api/spriteSheet/#createAnimations) function.
 */


class SpriteSheet {
  constructor({
    image,
    frameWidth,
    frameHeight,
    frameMargin,
    animations
  } = {}) {
    // @if DEBUG
    if (!image) {
      throw Error('You must provide an Image for the SpriteSheet');
    } // @endif

    /**
     * An object of named kontra.Animation objects. Typically you pass this object into kontra.Sprite to create an [animation sprites](api/spriteSheet/#animation-sprite).
     * @memberof SpriteSheet
     * @property {Object} animations
     */


    this.animations = {};
    /**
     * The sprite sheet image.
     * @memberof SpriteSheet
     * @property {Image|HTMLCanvasElement} image
     */

    this.image = image;
    /**
     * An object that defines properties of a single frame in the sprite sheet. It has properties of `width`, `height`, and `margin`.
     *
     * `width` and `height` are the width of a single frame, while `margin` defines the amount of whitespace between each frame.
     * @memberof SpriteSheet
     * @property {Object} frame
     */

    this.frame = {
      width: frameWidth,
      height: frameHeight,
      margin: frameMargin
    }; // f = framesPerRow

    this._f = image.width / frameWidth | 0;
    this.createAnimations(animations);
  }
  /**
   * Create named animations from the sprite sheet. Called from the constructor if the `animations` argument is passed.
   *
   * This function populates the sprite sheets `animations` property with kontra.Animation objects. Each animation is accessible by its name.
   *
   * ```js
   * import { Sprite, SpriteSheet } from 'kontra';
   *
   * let image = new Image();
   * image.src = 'assets/imgs/character_walk_sheet.png';
   * image.onload = function() {
   *
   *   let spriteSheet = SpriteSheet({
   *     image: image,
   *     frameWidth: 72,
   *     frameHeight: 97,
   *
   *     // this will also call createAnimations()
   *     animations: {
   *       // create 1 animation: idle
   *       idle: {
   *         // a single frame
   *         frames: 1
   *       }
   *     }
   *   });
   *
   *   spriteSheet.createAnimations({
   *     // create 4 animations: jump, walk, moonWalk, attack
   *     jump: {
   *       // sequence of frames (can be non-consecutive)
   *       frames: [1, 10, 1],
   *       frameRate: 10,
   *       loop: false,
   *     },
   *     walk: {
   *       // ascending consecutive frame animation (frames 2-6, inclusive)
   *       frames: '2..6',
   *       frameRate: 20
   *     },
   *     moonWalk: {
   *       // descending consecutive frame animation (frames 6-2, inclusive)
   *       frames: '6..2',
   *       frameRate: 20
   *     },
   *     attack: {
   *       // you can also mix and match, in this case frames [8,9,10,13,10,9,8]
   *       frames: ['8..10', 13, '10..8'],
   *       frameRate: 10,
   *       loop: false,
   *     }
   *   });
   * };
   * ```
   * @memberof SpriteSheet
   * @function createAnimations
   *
   * @param {Object} animations - Object of named animations to create from the sprite sheet.
   * @param {Number|String|Number[]|String[]} animations.<name>.frames - The sequence of frames to use from the sprite sheet. It can either be a single frame (`1`), a sequence of frames (`[1,2,3,4]`), or a consecutive frame notation (`'1..4'`). Sprite sheet frames are `0` indexed.
   * @param {Number} animations.<name>.frameRate - The number frames to display per second.
   * @param {Boolean} [animations.<name>.loop=true] - If the animation should loop back to the beginning once completed.
   */


  createAnimations(animations) {
    let sequence, name;

    for (name in animations) {
      let {
        frames,
        frameRate,
        loop
      } = animations[name]; // array that holds the order of the animation

      sequence = []; // @if DEBUG

      if (frames === undefined) {
        throw Error('Animation ' + name + ' must provide a frames property');
      } // @endif
      // add new frames to the end of the array


      [].concat(frames).map(frame => {
        sequence = sequence.concat(parseFrames(frame));
      });
      this.animations[name] = animationFactory({
        spriteSheet: this,
        frames: sequence,
        frameRate,
        loop
      });
    }
  }

}

function spriteSheetFactory(properties) {
  return new SpriteSheet(properties);
}

spriteSheetFactory.prototype = SpriteSheet.prototype;
spriteSheetFactory.class = SpriteSheet;
/**
 * A simple interface to LocalStorage based on [store.js](https://github.com/marcuswestin/store.js), whose sole purpose is to ensure that any keys you save to LocalStorage come out the same type as when they went in.
 *
 * Normally when you save something to LocalStorage, it converts it into a string. So if you were to save a number, it would be saved as `"12"` instead of `12`. This means when you retrieved the number, it would now be a string.
 *
 * ```js
 * import { setStoreItem, getStoreItem } from 'kontra';
 *
 * setStoreItem('highScore', 100);
 * getStoreItem('highScore');  //=> 100
 * ```
 * @sectionName Store
 */

/**
 * Save an item to localStorage.
 * @function setStoreItem
 *
 * @param {String} key - The name of the key.
 * @param {*} value - The value to store.
 */

function setStoreItem(key, value) {
  if (value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
/**
 * Retrieve an item from localStorage and convert it back to its original type.
 * @function getStoreItem
 *
 * @param {String} key - Name of the key of the item to retrieve.
 *
 * @returns {*} The retrieved item.
 */


function getStoreItem(key) {
  let value = localStorage.getItem(key);

  try {
    value = JSON.parse(value);
  } catch (e) {}

  return value;
}
/**
 * A tile engine for managing and drawing tilesets.
 *
 * <figure>
 *   <a href="assets/imgs/mapPack_tilesheet.png">
 *     <img src="assets/imgs/mapPack_tilesheet.png" alt="Tileset to create an overworld map in various seasons.">
 *   </a>
 *   <figcaption>Tileset image courtesy of <a href="https://kenney.nl/assets">Kenney</a>.</figcaption>
 * </figure>
 * @sectionName TileEngine
 *
 * @param {Object} properties - Properties of the tile engine.
 * @param {Number} properties.width - Width of the tile map (in number of tiles).
 * @param {Number} properties.height - Height of the tile map (in number of tiles).
 * @param {Number} properties.tilewidth - Width of a single tile (in pixels).
 * @param {Number} properties.tileheight - Height of a single tile (in pixels).
 * @param {Canvas​Rendering​Context2D} [properties.context] - The context the tile engine should draw to. Defaults to [core.getContext()](api/core#getContext)
 *
 * @param {Object[]} properties.tilesets - Array of tileset objects.
 * @param {Number} properties.tilesetN.firstgid - First tile index of the tileset. The first tileset will have a firstgid of 1 as 0 represents an empty tile.
 * @param {String|HTMLImageElement} properties.tilesetN.image - Relative path to the HTMLImageElement or an HTMLImageElement. If passing a relative path, the image file must have been [loaded](api/assets/#load) first.
 * @param {Number} [properties.tilesetN.margin=0] - The amount of whitespace between each tile (in pixels).
 * @param {Number} [properties.tilesetN.tilewidth] - Width of the tileset (in pixels). Defaults to properties.tilewidth.
 * @param {Number} [properties.tilesetN.tileheight] - Height of the tileset (in pixels). Defaults to properties.tileheight.
 * @param {String} [properties.tilesetN.source] - Relative path to the source JSON file. The source JSON file must have been [loaded](api/assets/#load) first.
 * @param {Number} [properties.tilesetN.columns] - Number of columns in the tileset image.
 *
 * @param {Object[]} properties.layers - Array of layer objects.
 * @param {String} properties.layerN.name - Unique name of the layer.
 * @param {Number[]} properties.layerN.data - 1D array of tile indices.
 * @param {Boolean} [properties.layerN.visible=true] - If the layer should be drawn or not.
 * @param {Number} [properties.layerN.opacity=1] - Percent opacity of the layer.
 */

/**
 * @docs docs/api_docs/tileEngine.js
 */


function TileEngine(properties = {}) {
  let {
    width,
    height,
    tilewidth,
    tileheight,
    context = getContext(),
    tilesets,
    layers
  } = properties;
  let mapwidth = width * tilewidth;
  let mapheight = height * tileheight; // create an off-screen canvas for pre-rendering the map
  // @see http://jsperf.com/render-vs-prerender

  let offscreenCanvas = document.createElement('canvas');
  let offscreenContext = offscreenCanvas.getContext('2d');
  offscreenCanvas.width = mapwidth;
  offscreenCanvas.height = mapheight; // map layer names to data

  let layerMap = {};
  let layerCanvases = {}; // objects added to tile engine to sync with the camera

  let objects = [];
  /**
   * The width of tile map (in tiles).
   * @memberof TileEngine
   * @property {Number} width
   */

  /**
   * The height of tile map (in tiles).
   * @memberof TileEngine
   * @property {Number} height
   */

  /**
   * The width a tile (in pixels).
   * @memberof TileEngine
   * @property {Number} tilewidth
   */

  /**
   * The height of a tile (in pixels).
   * @memberof TileEngine
   * @property {Number} tileheight
   */

  /**
   * Array of all layers of the tile engine.
   * @memberof TileEngine
   * @property {Object[]} layers
   */

  /**
   * Array of all tilesets of the tile engine.
   * @memberof TileEngine
   * @property {Object[]} tilesets
   */

  let tileEngine = Object.assign({
    /**
     * The context the tile engine will draw to.
     * @memberof TileEngine
     * @property {CanvasRenderingContext2D} context
     */
    context: context,

    /**
     * The width of the tile map (in pixels).
     * @memberof TileEngine
     * @property {Number} mapwidth
     */
    mapwidth: mapwidth,

    /**
     * The height of the tile map (in pixels).
     * @memberof TileEngine
     * @property {Number} mapheight
     */
    mapheight: mapheight,
    _sx: 0,
    _sy: 0,
    // d = dirty
    _d: false,

    /**
     * X coordinate of the tile map camera.
     * @memberof TileEngine
     * @property {Number} sx
     */
    get sx() {
      return this._sx;
    },

    /**
     * Y coordinate of the tile map camera.
     * @memberof TileEngine
     * @property {Number} sy
     */
    get sy() {
      return this._sy;
    },

    // when clipping an image, sx and sy must within the image region, otherwise
    // Firefox and Safari won't draw it.
    // @see http://stackoverflow.com/questions/19338032/canvas-indexsizeerror-index-or-size-is-negative-or-greater-than-the-allowed-a
    set sx(value) {
      this._sx = Math.min(Math.max(0, value), mapwidth - getCanvas().width);
      objects.forEach(obj => obj.sx = this._sx);
    },

    set sy(value) {
      this._sy = Math.min(Math.max(0, value), mapheight - getCanvas().height);
      objects.forEach(obj => obj.sy = this._sy);
    },

    /**
     * Render all visible layers.
     * @memberof TileEngine
     * @function render
     */
    render() {
      if (this._d) {
        this._d = false;

        this._p();
      }

      render(offscreenCanvas);
    },

    /**
     * Render a specific layer by name.
     * @memberof TileEngine
     * @function renderLayer
     *
     * @param {String} name - Name of the layer to render.
     */
    renderLayer(name) {
      let canvas = layerCanvases[name];
      let layer = layerMap[name];

      if (!canvas) {
        // cache the rendered layer so we can render it again without redrawing
        // all tiles
        canvas = document.createElement('canvas');
        canvas.width = mapwidth;
        canvas.height = mapheight;
        layerCanvases[name] = canvas;

        tileEngine._r(layer, canvas.getContext('2d'));
      }

      render(canvas);
    },

    /**
     * Check if the object collides with the layer (shares a gird coordinate with any positive tile index in layers data). The object being checked must have the properties `x`, `y`, `width`, and `height` so that its position in the grid can be calculated. kontra.Sprite defines these properties for you.
     *
     * ```js
     * import { TileEngine, Sprite } from 'kontra';
     *
     * let tileEngine = TileEngine({
     *   tilewidth: 32,
     *   tileheight: 32,
     *   width: 4,
     *   height: 4,
     *   tilesets: [{
     *     // ...
     *   }],
     *   layers: [{
     *     name: 'collision',
     *     data: [ 0,0,0,0,
     *             0,1,4,0,
     *             0,2,5,0,
     *             0,0,0,0 ]
     *   }]
     * });
     *
     * let sprite = Sprite({
     *   x: 50,
     *   y: 20,
     *   width: 5,
     *   height: 5
     * });
     *
     * tileEngine.layerCollidesWith('collision', sprite);  //=> false
     *
     * sprite.y = 28;
     *
     * tileEngine.layerCollidesWith('collision', sprite);  //=> true
     * ```
     * @memberof TileEngine
     * @function layerCollidesWith
     *
     * @param {String} name - The name of the layer to check for collision.
     * @param {Object} object - Object to check collision against.
     *
     * @returns {boolean} `true` if the object collides with a tile, `false` otherwise.
     */
    layerCollidesWith(name, object) {
      let x = object.x;
      let y = object.y;

      if (object.anchor) {
        x -= object.width * object.anchor.x;
        y -= object.height * object.anchor.y;
      }

      let row = getRow(y);
      let col = getCol(x);
      let endRow = getRow(y + object.height);
      let endCol = getCol(x + object.width);
      let layer = layerMap[name]; // check all tiles

      for (let r = row; r <= endRow; r++) {
        for (let c = col; c <= endCol; c++) {
          if (layer.data[c + r * this.width]) {
            return true;
          }
        }
      }

      return false;
    },

    /**
     * Get the tile at the specified layer using either x and y coordinates or row and column coordinates.
     *
     * ```js
     * import { TileEngine } from 'kontra';
     *
     * let tileEngine = TileEngine({
     *   tilewidth: 32,
     *   tileheight: 32,
     *   width: 4,
     *   height: 4,
     *   tilesets: [{
     *     // ...
     *   }],
     *   layers: [{
     *     name: 'collision',
     *     data: [ 0,0,0,0,
     *             0,1,4,0,
     *             0,2,5,0,
     *             0,0,0,0 ]
     *   }]
     * });
     *
     * tileEngine.tileAtLayer('collision', {x: 50, y: 50});  //=> 1
     * tileEngine.tileAtLayer('collision', {row: 2, col: 1});  //=> 2
     * ```
     * @memberof TileEngine
     * @function tileAtLayer
     *
     * @param {String} name - Name of the layer.
     * @param {Object} position - Position of the tile in either {x, y} or {row, col} coordinates.
     *
     * @returns {Number} The tile index. Will return `-1` if no layer exists by the provided name.
     */
    tileAtLayer(name, position) {
      let row = position.row || getRow(position.y);
      let col = position.col || getCol(position.x);

      if (layerMap[name]) {
        return layerMap[name].data[col + row * tileEngine.width];
      }

      return -1;
    },

    /**
     * Set the tile at the specified layer using either x and y coordinates or row and column coordinates.
     *
     * ```js
     * import { TileEngine } from 'kontra';
     *
     * let tileEngine = TileEngine({
     *   tilewidth: 32,
     *   tileheight: 32,
     *   width: 4,
     *   height: 4,
     *   tilesets: [{
     *     // ...
     *   }],
     *   layers: [{
     *     name: 'collision',
     *     data: [ 0,0,0,0,
     *             0,1,4,0,
     *             0,2,5,0,
     *             0,0,0,0 ]
     *   }]
     * });
     *
     * tileEngine.setTileAtLayer('collision', {row: 2, col: 1}, 10);
     * tileEngine.tileAtLayer('collision', {row: 2, col: 1});  //=> 10
     * ```
     * @memberof TileEngine
     * @function setTileAtLayer
     *
     * @param {String} name - Name of the layer.
     * @param {Object} position - Position of the tile in either {x, y} or {row, col} coordinates.
     * @param {Number} tile - Tile index to set.
     */
    setTileAtLayer(name, position, tile) {
      let row = position.row || getRow(position.y);
      let col = position.col || getCol(position.x);

      if (layerMap[name]) {
        this._d = true;
        layerMap[name].data[col + row * tileEngine.width] = tile;
      }
    },

    /**
    * Set the data at the specified layer.
    * 
    * ```js
    * import { TileEngine } from 'kontra';
    *
    * let tileEngine = TileEngine({
    *   tilewidth: 32,
    *   tileheight: 32,
    *   width: 2,
    *   height: 2,
    *   tilesets: [{
    *     // ...
    *   }],
    *   layers: [{
    *     name: 'collision',
    *     data: [ 0,1,
    *             2,3 ]
    *   }]
    * });
    *
    * tileEngine.setLayer('collision', [ 4,5,6,7]);
    * tileEngine.tileAtLayer('collision', {row: 0, col: 0});  //=> 4
    * tileEngine.tileAtLayer('collision', {row: 0, col: 1});  //=> 5
    * tileEngine.tileAtLayer('collision', {row: 1, col: 0});  //=> 6
    * tileEngine.tileAtLayer('collision', {row: 1, col: 1});  //=> 7
    * ```
    * 
    * @memberof TileEngine
    * @function setLayer
    * 
    * @param {String} name - Name of the layer.
    * @param {Number[]} data - 1D array of tile indices.
    */
    setLayer(name, data) {
      if (layerMap[name]) {
        this._d = true;
        layerMap[name].data = data;
      }
    },

    /**
     * Add an object to the tile engine. The tile engine will set the objects camera position (`sx`, `sy`) to be in sync with the tile engine camera. kontra.Sprite uses this information to draw the sprite to the correct position on the canvas.
     * @memberof TileEngine
     * @function addObject
     *
     * @param {Object} object - Object to add to the tile engine.
     */
    addObject(object) {
      objects.push(object);
      object.sx = this._sx;
      object.sy = this._sy;
    },

    /**
     * Remove an object from the tile engine.
     * @memberof TileEngine
     * @function removeObject
     *
     * @param {Object} object - Object to remove from the tile engine.
     */
    removeObject(object) {
      let index = objects.indexOf(object);

      if (index !== -1) {
        objects.splice(index, 1);
        object.sx = object.sy = 0;
      }
    },

    // expose for testing
    _r: renderLayer,
    _p: prerender,
    // @if DEBUG
    layerCanvases: layerCanvases // @endif

  }, properties); // resolve linked files (source, image)

  tileEngine.tilesets.map(tileset => {
    // get the url of the Tiled JSON object (in this case, the properties object)
    let url = (window.__k ? window.__k.dm.get(properties) : '') || window.location.href;

    if (tileset.source) {
      // @if DEBUG
      if (!window.__k) {
        throw Error(`You must use "load" or "loadData" to resolve tileset.source`);
      } // @endif


      let source = window.__k.d[window.__k.u(tileset.source, url)]; // @if DEBUG


      if (!source) {
        throw Error(`You must load the tileset source "${tileset.source}" before loading the tileset`);
      } // @endif


      Object.keys(source).map(key => {
        tileset[key] = source[key];
      });
    }

    if ('' + tileset.image === tileset.image) {
      // @if DEBUG
      if (!window.__k) {
        throw Error(`You must use "load" or "loadImage" to resolve tileset.image`);
      } // @endif


      let image = window.__k.i[window.__k.u(tileset.image, url)]; // @if DEBUG


      if (!image) {
        throw Error(`You must load the image "${tileset.image}" before loading the tileset`);
      } // @endif


      tileset.image = image;
    }
  });
  /**
   * Get the row from the y coordinate.
   * @private
   *
   * @param {Number} y - Y coordinate.
   *
   * @return {Number}
   */

  function getRow(y) {
    return y / tileEngine.tileheight | 0;
  }
  /**
   * Get the col from the x coordinate.
   * @private
   *
   * @param {Number} x - X coordinate.
   *
   * @return {Number}
   */


  function getCol(x) {
    return x / tileEngine.tilewidth | 0;
  }
  /**
   * Render a layer.
   * @private
   *
   * @param {Object} layer - Layer data.
   * @param {Context} context - Context to draw layer to.
   */


  function renderLayer(layer, context) {
    context.save();
    context.globalAlpha = layer.opacity;
    layer.data.map((tile, index) => {
      // skip empty tiles (0)
      if (!tile) return; // find the tileset the tile belongs to
      // assume tilesets are ordered by firstgid

      let tileset;

      for (let i = tileEngine.tilesets.length - 1; i >= 0; i--) {
        tileset = tileEngine.tilesets[i];

        if (tile / tileset.firstgid >= 1) {
          break;
        }
      }

      let tilewidth = tileset.tilewidth || tileEngine.tilewidth;
      let tileheight = tileset.tileheight || tileEngine.tileheight;
      let margin = tileset.margin || 0;
      let image = tileset.image;
      let offset = tile - tileset.firstgid;
      let cols = tileset.columns || image.width / (tilewidth + margin) | 0;
      let x = index % tileEngine.width * tilewidth;
      let y = (index / tileEngine.width | 0) * tileheight;
      let sx = offset % cols * (tilewidth + margin);
      let sy = (offset / cols | 0) * (tileheight + margin);
      context.drawImage(image, sx, sy, tilewidth, tileheight, x, y, tilewidth, tileheight);
    });
    context.restore();
  }
  /**
   * Pre-render the tiles to make drawing fast.
   * @private
   */


  function prerender() {
    if (tileEngine.layers) {
      tileEngine.layers.map(layer => {
        layerMap[layer.name] = layer;

        if (layer.visible !== false) {
          tileEngine._r(layer, offscreenContext);
        }
      });
    }
  }
  /**
   * Render a tile engine canvas.
   * @private
   *
   * @param {HTMLCanvasElement} canvas - Tile engine canvas to draw.
   */


  function render(canvas) {
    const {
      width,
      height
    } = getCanvas();
    const sWidth = Math.min(canvas.width, width);
    const sHeight = Math.min(canvas.height, height);
    tileEngine.context.drawImage(canvas, tileEngine.sx, tileEngine.sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
  }

  prerender();
  return tileEngine;
}

let kontra = {
  Animation: animationFactory,
  imageAssets,
  audioAssets,
  dataAssets,
  setImagePath,
  setAudioPath,
  setDataPath,
  loadImage,
  loadAudio,
  loadData,
  load,
  init,
  getCanvas,
  getContext,
  on,
  off,
  emit,
  GameLoop,
  keyMap,
  initKeys,
  bindKeys,
  unbindKeys,
  keyPressed,
  registerPlugin,
  unregisterPlugin,
  extendObject,
  initPointer,
  pointer,
  track,
  untrack,
  pointerOver,
  onPointerDown,
  onPointerUp,
  pointerPressed,
  Pool: poolFactory,
  Quadtree: quadtreeFactory,
  Sprite: spriteFactory,
  SpriteSheet: spriteSheetFactory,
  setStoreItem,
  getStoreItem,
  TileEngine,
  Vector: vectorFactory
};
var _default = kontra;
exports.default = _default;
},{}],"node_modules/preact/dist/preact.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = I;
exports.hydrate = L;
exports.h = exports.createElement = h;
exports.Fragment = y;
exports.createRef = p;
exports.Component = m;
exports.cloneElement = M;
exports.createContext = O;
exports.toChildArray = x;
exports._unmount = D;
exports.options = exports.isValidElement = void 0;
var n,
    l,
    u,
    t,
    i,
    r,
    o,
    f = {},
    e = [],
    c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;
exports.isValidElement = l;
exports.options = n;

function s(n, l) {
  for (var u in l) n[u] = l[u];

  return n;
}

function a(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}

function h(n, l, u) {
  var t,
      i,
      r,
      o,
      f = arguments;
  if (l = s({}, l), arguments.length > 3) for (u = [u], t = 3; t < arguments.length; t++) u.push(f[t]);
  if (null != u && (l.children = u), null != n && null != n.defaultProps) for (i in n.defaultProps) void 0 === l[i] && (l[i] = n.defaultProps[i]);
  return o = l.key, null != (r = l.ref) && delete l.ref, null != o && delete l.key, v(n, l, o, r);
}

function v(l, u, t, i) {
  var r = {
    type: l,
    props: u,
    key: t,
    ref: i,
    __k: null,
    __p: null,
    __b: 0,
    __e: null,
    l: null,
    __c: null,
    constructor: void 0
  };
  return n.vnode && n.vnode(r), r;
}

function p() {
  return {};
}

function y(n) {
  return n.children;
}

function d(n) {
  if (null == n || "boolean" == typeof n) return null;
  if ("string" == typeof n || "number" == typeof n) return v(null, n, null, null);

  if (null != n.__e || null != n.__c) {
    var l = v(n.type, n.props, n.key, null);
    return l.__e = n.__e, l;
  }

  return n;
}

function m(n, l) {
  this.props = n, this.context = l;
}

function w(n, l) {
  if (null == l) return n.__p ? w(n.__p, n.__p.__k.indexOf(n) + 1) : null;

  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;

  return "function" == typeof n.type ? w(n) : null;
}

function g(n) {
  var l, u;

  if (null != (n = n.__p) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
      n.__e = n.__c.base = u.__e;
      break;
    }

    return g(n);
  }
}

function k(l) {
  (!l.__d && (l.__d = !0) && 1 === u.push(l) || i !== n.debounceRendering) && (i = n.debounceRendering, (n.debounceRendering || t)(_));
}

function _() {
  var n;

  for (u.sort(function (n, l) {
    return l.__v.__b - n.__v.__b;
  }); n = u.pop();) n.__d && n.forceUpdate(!1);
}

function b(n, l, u, t, i, r, o, c, s) {
  var h,
      v,
      p,
      y,
      d,
      m,
      g,
      k = u && u.__k || e,
      _ = k.length;
  if (c == f && (c = null != r ? r[0] : _ ? w(u, 0) : null), h = 0, l.__k = x(l.__k, function (u) {
    if (null != u) {
      if (u.__p = l, u.__b = l.__b + 1, null === (p = k[h]) || p && u.key == p.key && u.type === p.type) k[h] = void 0;else for (v = 0; v < _; v++) {
        if ((p = k[v]) && u.key == p.key && u.type === p.type) {
          k[v] = void 0;
          break;
        }

        p = null;
      }

      if (y = $(n, u, p = p || f, t, i, r, o, null, c, s), (v = u.ref) && p.ref != v && (g || (g = [])).push(v, u.__c || y, u), null != y) {
        if (null == m && (m = y), null != u.l) y = u.l, u.l = null;else if (r == p || y != c || null == y.parentNode) {
          n: if (null == c || c.parentNode !== n) n.appendChild(y);else {
            for (d = c, v = 0; (d = d.nextSibling) && v < _; v += 2) if (d == y) break n;

            n.insertBefore(y, c);
          }

          "option" == l.type && (n.value = "");
        }
        c = y.nextSibling, "function" == typeof l.type && (l.l = y);
      }
    }

    return h++, u;
  }), l.__e = m, null != r && "function" != typeof l.type) for (h = r.length; h--;) null != r[h] && a(r[h]);

  for (h = _; h--;) null != k[h] && D(k[h], k[h]);

  if (g) for (h = 0; h < g.length; h++) A(g[h], g[++h], g[++h]);
}

function x(n, l, u) {
  if (null == u && (u = []), null == n || "boolean" == typeof n) l && u.push(l(null));else if (Array.isArray(n)) for (var t = 0; t < n.length; t++) x(n[t], l, u);else u.push(l ? l(d(n)) : n);
  return u;
}

function C(n, l, u, t, i) {
  var r;

  for (r in u) r in l || N(n, r, null, u[r], t);

  for (r in l) i && "function" != typeof l[r] || "value" === r || "checked" === r || u[r] === l[r] || N(n, r, l[r], u[r], t);
}

function P(n, l, u) {
  "-" === l[0] ? n.setProperty(l, u) : n[l] = "number" == typeof u && !1 === c.test(l) ? u + "px" : u || "";
}

function N(n, l, u, t, i) {
  var r, o, f, e, c;
  if ("key" === (l = i ? "className" === l ? "class" : l : "class" === l ? "className" : l) || "children" === l) ;else if ("style" === l) {
    if (r = n.style, "string" == typeof u) r.cssText = u;else {
      if ("string" == typeof t && (r.cssText = "", t = null), t) for (o in t) u && o in u || P(r, o, "");
      if (u) for (f in u) t && u[f] === t[f] || P(r, f, u[f]);
    }
  } else "o" === l[0] && "n" === l[1] ? (e = l !== (l = l.replace(/Capture$/, "")), c = l.toLowerCase(), l = (c in n ? c : l).slice(2), u ? (t || n.addEventListener(l, T, e), (n.u || (n.u = {}))[l] = u) : n.removeEventListener(l, T, e)) : "list" !== l && "tagName" !== l && "form" !== l && !i && l in n ? n[l] = null == u ? "" : u : "function" != typeof u && "dangerouslySetInnerHTML" !== l && (l !== (l = l.replace(/^xlink:?/, "")) ? null == u || !1 === u ? n.removeAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase(), u) : null == u || !1 === u ? n.removeAttribute(l) : n.setAttribute(l, u));
}

function T(l) {
  return this.u[l.type](n.event ? n.event(l) : l);
}

function $(l, u, t, i, r, o, f, e, c, a) {
  var h,
      v,
      p,
      d,
      w,
      g,
      k,
      _,
      x,
      C,
      P = u.type;

  if (void 0 !== u.constructor) return null;
  (h = n.__b) && h(u);

  try {
    n: if ("function" == typeof P) {
      if (_ = u.props, x = (h = P.contextType) && i[h.__c], C = h ? x ? x.props.value : h.__p : i, t.__c ? k = (v = u.__c = t.__c).__p = v.__E : ("prototype" in P && P.prototype.render ? u.__c = v = new P(_, C) : (u.__c = v = new m(_, C), v.constructor = P, v.render = H), x && x.sub(v), v.props = _, v.state || (v.state = {}), v.context = C, v.__n = i, p = v.__d = !0, v.__h = []), null == v.__s && (v.__s = v.state), null != P.getDerivedStateFromProps && s(v.__s == v.state ? v.__s = s({}, v.__s) : v.__s, P.getDerivedStateFromProps(_, v.__s)), p) null == P.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && f.push(v);else {
        if (null == P.getDerivedStateFromProps && null == e && null != v.componentWillReceiveProps && v.componentWillReceiveProps(_, C), !e && null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(_, v.__s, C)) {
          for (v.props = _, v.state = v.__s, v.__d = !1, v.__v = u, u.__e = null != c ? c !== t.__e ? c : t.__e : null, u.__k = t.__k, h = 0; h < u.__k.length; h++) u.__k[h] && (u.__k[h].__p = u);

          break n;
        }

        null != v.componentWillUpdate && v.componentWillUpdate(_, v.__s, C);
      }

      for (d = v.props, w = v.state, v.context = C, v.props = _, v.state = v.__s, (h = n.__r) && h(u), v.__d = !1, v.__v = u, v.__P = l, h = v.render(v.props, v.state, v.context), u.__k = null != h && h.type == y && null == h.key ? h.props.children : h, null != v.getChildContext && (i = s(s({}, i), v.getChildContext())), p || null == v.getSnapshotBeforeUpdate || (g = v.getSnapshotBeforeUpdate(d, w)), b(l, u, t, i, r, o, f, c, a), v.base = u.__e; h = v.__h.pop();) v.__s && (v.state = v.__s), h.call(v);

      p || null == d || null == v.componentDidUpdate || v.componentDidUpdate(d, w, g), k && (v.__E = v.__p = null);
    } else u.__e = z(t.__e, u, t, i, r, o, f, a);

    (h = n.diffed) && h(u);
  } catch (l) {
    n.__e(l, u, t);
  }

  return u.__e;
}

function j(l, u) {
  for (var t; t = l.pop();) try {
    t.componentDidMount();
  } catch (l) {
    n.__e(l, t.__v);
  }

  n.__c && n.__c(u);
}

function z(n, l, u, t, i, r, o, c) {
  var s,
      a,
      h,
      v,
      p = u.props,
      y = l.props;
  if (i = "svg" === l.type || i, null == n && null != r) for (s = 0; s < r.length; s++) if (null != (a = r[s]) && (null === l.type ? 3 === a.nodeType : a.localName === l.type)) {
    n = a, r[s] = null;
    break;
  }

  if (null == n) {
    if (null === l.type) return document.createTextNode(y);
    n = i ? document.createElementNS("http://www.w3.org/2000/svg", l.type) : document.createElement(l.type), r = null;
  }

  return null === l.type ? p !== y && (null != r && (r[r.indexOf(n)] = null), n.data = y) : l !== u && (null != r && (r = e.slice.call(n.childNodes)), h = (p = u.props || f).dangerouslySetInnerHTML, v = y.dangerouslySetInnerHTML, c || (v || h) && (v && h && v.__html == h.__html || (n.innerHTML = v && v.__html || "")), C(n, y, p, i, c), l.__k = l.props.children, v || b(n, l, u, t, "foreignObject" !== l.type && i, r, o, f, c), c || ("value" in y && void 0 !== y.value && y.value !== n.value && (n.value = null == y.value ? "" : y.value), "checked" in y && void 0 !== y.checked && y.checked !== n.checked && (n.checked = y.checked))), n;
}

function A(l, u, t) {
  try {
    "function" == typeof l ? l(u) : l.current = u;
  } catch (l) {
    n.__e(l, t);
  }
}

function D(l, u, t) {
  var i, r, o;

  if (n.unmount && n.unmount(l), (i = l.ref) && A(i, null, u), t || "function" == typeof l.type || (t = null != (r = l.__e)), l.__e = l.l = null, null != (i = l.__c)) {
    if (i.componentWillUnmount) try {
      i.componentWillUnmount();
    } catch (l) {
      n.__e(l, u);
    }
    i.base = i.__P = null;
  }

  if (i = l.__k) for (o = 0; o < i.length; o++) i[o] && D(i[o], u, t);
  null != r && a(r);
}

function H(n, l, u) {
  return this.constructor(n, u);
}

function I(l, u, t) {
  var i, o, c;
  n.__p && n.__p(l, u), o = (i = t === r) ? null : t && t.__k || u.__k, l = h(y, null, [l]), c = [], $(u, i ? u.__k = l : (t || u).__k = l, o || f, f, void 0 !== u.ownerSVGElement, t && !i ? [t] : o ? null : e.slice.call(u.childNodes), c, !1, t || f, i), j(c, l);
}

function L(n, l) {
  I(n, l, r);
}

function M(n, l) {
  return l = s(s({}, n.props), l), arguments.length > 2 && (l.children = e.slice.call(arguments, 2)), v(n.type, l, l.key || n.key, l.ref || n.ref);
}

function O(n) {
  var l = {},
      u = {
    __c: "__cC" + o++,
    __p: n,
    Consumer: function (n, l) {
      return this.shouldComponentUpdate = function (n, u, t) {
        return t !== l;
      }, n.children(l);
    },
    Provider: function (n) {
      var t,
          i = this;
      return this.getChildContext || (t = [], this.getChildContext = function () {
        return l[u.__c] = i, l;
      }, this.shouldComponentUpdate = function (n) {
        t.some(function (l) {
          l.__P && (l.context = n.value, k(l));
        });
      }, this.sub = function (n) {
        t.push(n);
        var l = n.componentWillUnmount;

        n.componentWillUnmount = function () {
          t.splice(t.indexOf(n), 1), l && l.call(n);
        };
      }), n.children;
    }
  };
  return u.Consumer.contextType = u, u;
}

exports.options = n = {}, exports.isValidElement = l = function (n) {
  return null != n && void 0 === n.constructor;
}, m.prototype.setState = function (n, l) {
  var u = this.__s !== this.state && this.__s || (this.__s = s({}, this.state));
  ("function" != typeof n || (n = n(u, this.props))) && s(u, n), null != n && this.__v && (l && this.__h.push(l), k(this));
}, m.prototype.forceUpdate = function (n) {
  var l,
      u,
      t,
      i = this.__v,
      r = this.__v.__e,
      o = this.__P;
  o && (l = !1 !== n, u = [], t = $(o, i, s({}, i), this.__n, void 0 !== o.ownerSVGElement, null, u, l, null == r ? w(i) : r), j(u, i), t != r && g(i)), n && n();
}, m.prototype.render = y, u = [], t = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, i = n.debounceRendering, n.__e = function (n, l, u) {
  for (var t; l = l.__p;) if ((t = l.__c) && !t.__p) try {
    if (t.constructor && null != t.constructor.getDerivedStateFromError) t.setState(t.constructor.getDerivedStateFromError(n));else {
      if (null == t.componentDidCatch) continue;
      t.componentDidCatch(n);
    }
    return k(t.__E = t);
  } catch (l) {
    n = l;
  }

  throw n;
}, r = f, o = 0;
},{}],"node_modules/preact/hooks/dist/hooks.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = c;
exports.useReducer = a;
exports.useEffect = v;
exports.useLayoutEffect = l;
exports.useRef = m;
exports.useImperativeHandle = p;
exports.useMemo = d;
exports.useCallback = s;
exports.useContext = y;
exports.useDebugValue = _;

var _preact = require("preact");

var t,
    r,
    u = [],
    i = _preact.options.__r;

_preact.options.__r = function (n) {
  i && i(n), t = 0, (r = n.__c).__H && (r.__H.t = A(r.__H.t));
};

var f = _preact.options.diffed;

_preact.options.diffed = function (n) {
  f && f(n);
  var t = n.__c;

  if (t) {
    var r = t.__H;
    r && (r.u = (r.u.some(function (n) {
      n.ref && (n.ref.current = n.createHandle());
    }), []), r.i = A(r.i));
  }
};

var o = _preact.options.unmount;

function e(t) {
  _preact.options.__h && _preact.options.__h(r);
  var u = r.__H || (r.__H = {
    o: [],
    t: [],
    i: [],
    u: []
  });
  return t >= u.o.length && u.o.push({}), u.o[t];
}

function c(n) {
  return a(q, n);
}

function a(n, u, i) {
  var f = e(t++);
  return f.__c || (f.__c = r, f.v = [i ? i(u) : q(null, u), function (t) {
    var r = n(f.v[0], t);
    f.v[0] !== r && (f.v[0] = r, f.__c.setState({}));
  }]), f.v;
}

function v(n, u) {
  var i = e(t++);
  h(i.l, u) && (i.v = n, i.l = u, r.__H.t.push(i), T(r));
}

function l(n, u) {
  var i = e(t++);
  h(i.l, u) && (i.v = n, i.l = u, r.__H.i.push(i));
}

function m(n) {
  return d(function () {
    return {
      current: n
    };
  }, []);
}

function p(n, u, i) {
  var f = e(t++);
  h(f.l, i) && (f.l = i, r.__H.u.push({
    ref: n,
    createHandle: u
  }));
}

function d(n, r) {
  var u = e(t++);
  return h(u.l, r) ? (u.l = r, u.m = n, u.v = n()) : u.v;
}

function s(n, t) {
  return d(function () {
    return n;
  }, t);
}

function y(n) {
  var u = r.context[n.__c];
  if (!u) return n.__p;
  var i = e(t++);
  return null == i.v && (i.v = !0, u.sub(r)), u.props.value;
}

function _(t, r) {
  _preact.options.useDebugValue && _preact.options.useDebugValue(r ? r(t) : t);
}

_preact.options.unmount = function (n) {
  o && o(n);
  var t = n.__c;

  if (t) {
    var r = t.__H;
    r && r.o.forEach(function (n) {
      return n.p && n.p();
    });
  }
};

var T = function () {};

function g() {
  u.some(function (n) {
    n.s = !1, n.__P && (n.__H.t = A(n.__H.t));
  }), u = [];
}

if ("undefined" != typeof window) {
  var w = _preact.options.requestAnimationFrame;

  T = function (t) {
    (!t.s && (t.s = !0) && 1 === u.push(t) || w !== _preact.options.requestAnimationFrame) && (w = _preact.options.requestAnimationFrame, (_preact.options.requestAnimationFrame || function (n) {
      var t = function () {
        clearTimeout(r), cancelAnimationFrame(u), setTimeout(n);
      },
          r = setTimeout(t, 100),
          u = requestAnimationFrame(t);
    })(g));
  };
}

function A(n) {
  return n.forEach(E), n.forEach(F), [];
}

function E(n) {
  n.p && n.p();
}

function F(n) {
  var t = n.v();
  "function" == typeof t && (n.p = t);
}

function h(n, t) {
  return !n || t.some(function (t, r) {
    return t !== n[r];
  });
}

function q(n, t) {
  return "function" == typeof t ? t(n) : t;
}
},{"preact":"node_modules/preact/dist/preact.module.js"}],"node_modules/preact/compat/dist/compat.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  version: true,
  Children: true,
  render: true,
  hydrate: true,
  unmountComponentAtNode: true,
  createPortal: true,
  createElement: true,
  createFactory: true,
  cloneElement: true,
  isValidElement: true,
  findDOMNode: true,
  PureComponent: true,
  memo: true,
  forwardRef: true,
  unstable_batchedUpdates: true,
  Suspense: true,
  lazy: true,
  createContext: true,
  createRef: true,
  Fragment: true,
  Component: true
};
exports.hydrate = exports.render = k;
exports.unmountComponentAtNode = z;
exports.createPortal = F;
exports.createElement = S;
exports.createFactory = w;
exports.cloneElement = _;
exports.isValidElement = j;
exports.findDOMNode = U;
exports.memo = Z;
exports.forwardRef = L;
exports.Suspense = m;
exports.lazy = y;
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _preact.createContext;
  }
});
Object.defineProperty(exports, "createRef", {
  enumerable: true,
  get: function () {
    return _preact.createRef;
  }
});
Object.defineProperty(exports, "Fragment", {
  enumerable: true,
  get: function () {
    return _preact.Fragment;
  }
});
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function () {
    return _preact.Component;
  }
});
exports.unstable_batchedUpdates = exports.PureComponent = exports.Children = exports.version = exports.default = void 0;

var n = _interopRequireWildcard(require("preact/hooks"));

Object.keys(n).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return n[key];
    }
  });
});

var _preact = require("preact");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function d(n, t) {
  for (var r in t) n[r] = t[r];

  return n;
}

function p(n) {
  var t = n.parentNode;
  t && t.removeChild(n);
}

var h = _preact.options.__e;

function m() {
  this.t = [];
}

function y(n) {
  var t, e, o;

  function i(i) {
    if (t || (t = n()).then(function (n) {
      e = n.default;
    }, function (n) {
      o = n;
    }), o) throw o;
    if (!e) throw t;
    return (0, _preact.createElement)(e, i);
  }

  return i.displayName = "Lazy", i.o = !0, i;
}

_preact.options.__e = function (n, t, r) {
  if (n.then && r) for (var e, o = t; o = o.__p;) if ((e = o.__c) && e.i) return r && (t.__e = r.__e, t.__k = r.__k), void e.i(n);
  h(n, t, r);
}, (m.prototype = new _preact.Component()).i = function (n) {
  var t = this;
  t.t.push(n);

  var r = function () {
    t.t[t.t.indexOf(n)] = t.t[t.t.length - 1], t.t.pop(), 0 == t.t.length && ((0, _preact._unmount)(t.props.fallback), t.__v.__e = null, t.__v.__k = t.state.u, t.setState({
      u: null
    }));
  };

  null == t.state.u && (t.setState({
    u: t.__v.__k
  }), function n(t) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r];
      null != e && ("function" != typeof e.type && e.__e ? p(e.__e) : e.__k && n(e.__k));
    }
  }(t.__v.__k), t.__v.__k = []), n.then(r, r);
}, m.prototype.render = function (n, t) {
  return t.u ? n.fallback : n.children;
};
var b = "16.8.0",
    g = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103,
    x = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/,
    C = _preact.options.event;
exports.version = b;

function w(n) {
  return S.bind(null, n);
}

function k(n, t, r) {
  if (null == t.__k) for (; t.firstChild;) p(t.firstChild);
  return (0, _preact.render)(n, t), "function" == typeof r && r(), n ? n.__c : null;
}

_preact.options.event = function (n) {
  return C && (n = C(n)), n.persist = function () {}, n.nativeEvent = n;
};

var E = function () {};

function A(n) {
  var t = this,
      r = n.container,
      o = (0, _preact.h)(E, {
    context: t.context
  }, n.vnode);
  return t.l && t.l !== r && (t.s.parentNode && t.l.removeChild(t.s), (0, _preact._unmount)(t.v), t.p = !1), n.vnode ? t.p ? (r.__k = t.__k, (0, _preact.render)(o, r), t.__k = r.__k) : (t.s = document.createTextNode(""), (0, _preact.hydrate)("", r), r.insertBefore(t.s, r.firstChild), t.p = !0, t.l = r, (0, _preact.render)(o, r, t.s), t.__k = this.s.__k) : t.p && (t.s.parentNode && t.l.removeChild(t.s), (0, _preact._unmount)(t.v)), t.v = o, t.componentWillUnmount = function () {
    t.s.parentNode && t.l.removeChild(t.s), (0, _preact._unmount)(t.v);
  }, null;
}

function F(n, t) {
  return (0, _preact.h)(A, {
    vnode: n,
    container: t
  });
}

E.prototype.getChildContext = function () {
  return this.props.context;
}, E.prototype.render = function (n) {
  return n.children;
};

var N = function (n, t) {
  return n ? (0, _preact.toChildArray)(n).map(t) : null;
},
    R = {
  map: N,
  forEach: N,
  count: function (n) {
    return n ? (0, _preact.toChildArray)(n).length : 0;
  },
  only: function (n) {
    if (1 !== (n = (0, _preact.toChildArray)(n)).length) throw new Error("Children.only() expects only one child.");
    return n[0];
  },
  toArray: _preact.toChildArray
};

exports.Children = R;

function S() {
  for (var n = [], t = arguments.length; t--;) n[t] = arguments[t];

  var r = _preact.h.apply(void 0, n),
      e = r.type,
      o = r.props;

  return "function" != typeof e && (o.defaultValue && (o.value || 0 === o.value || (o.value = o.defaultValue), delete o.defaultValue), Array.isArray(o.value) && o.multiple && "select" === e && ((0, _preact.toChildArray)(o.children).forEach(function (n) {
    -1 != o.value.indexOf(n.props.value) && (n.props.selected = !0);
  }), delete o.value), function (n, t) {
    var r, e, o;

    for (o in t) if (r = x.test(o)) break;

    if (r) for (o in e = n.props = {}, t) e[x.test(o) ? o.replace(/([A-Z0-9])/, "-$1").toLowerCase() : o] = t[o];
  }(r, o)), r.preactCompatNormalized = !1, O(r);
}

function O(n) {
  return n.preactCompatNormalized = !0, function (n) {
    var t = n.props;
    (t.class || t.className) && (M.enumerable = "className" in t, t.className && (t.class = t.className), Object.defineProperty(t, "className", M));
  }(n), n;
}

function _(n) {
  return j(n) ? O(_preact.cloneElement.apply(null, arguments)) : n;
}

function j(n) {
  return !!n && n.$$typeof === g;
}

function z(n) {
  return !!n.__k && ((0, _preact.render)(null, n), !0);
}

var M = {
  configurable: !0,
  get: function () {
    return this.class;
  }
};

function P(n, t) {
  for (var r in n) if (!(r in t)) return !0;

  for (var e in t) if (n[e] !== t[e]) return !0;

  return !1;
}

function U(n) {
  return n && (n.base || 1 === n.nodeType && n) || null;
}

var W = function (n) {
  function t(t) {
    n.call(this, t), this.isPureReactComponent = !0;
  }

  return n && (t.__proto__ = n), (t.prototype = Object.create(n && n.prototype)).constructor = t, t.prototype.shouldComponentUpdate = function (n, t) {
    return P(this.props, n) || P(this.state, t);
  }, t;
}(_preact.Component);

exports.PureComponent = W;

function Z(n, t) {
  function r(n) {
    var r = this.props.ref,
        e = r == n.ref;
    return !e && r && (r.call ? r(null) : r.current = null), (t ? !t(this.props, n) : P(this.props, n)) || !e;
  }

  function e(t) {
    return this.shouldComponentUpdate = r, (0, _preact.h)(n, d({}, t));
  }

  return e.prototype.isReactComponent = !0, e.displayName = "Memo(" + (n.displayName || n.name) + ")", e.o = !0, e;
}

function D(n, t) {
  Object.defineProperty(n.prototype, "UNSAFE_" + t, {
    configurable: !0,
    get: function () {
      return this[t];
    },
    set: function (n) {
      this[t] = n;
    }
  });
}

function L(n) {
  function t(t) {
    var r = t.ref;
    return delete t.ref, n(t, r);
  }

  return t.prototype.isReactComponent = !0, t.o = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
}

_preact.Component.prototype.isReactComponent = {}, D(_preact.Component, "componentWillMount"), D(_preact.Component, "componentWillReceiveProps"), D(_preact.Component, "componentWillUpdate");
var T = _preact.options.vnode;

_preact.options.vnode = function (n) {
  n.$$typeof = g, function (t) {
    var r = n.type,
        e = n.props;

    if (e && "string" == typeof r) {
      var o = {};

      for (var i in e) /^on(Ani|Tra)/.test(i) && (e[i.toLowerCase()] = e[i], delete e[i]), o[i.toLowerCase()] = i;

      if (o.ondoubleclick && (e.ondblclick = e[o.ondoubleclick], delete e[o.ondoubleclick]), o.onbeforeinput && (e.onbeforeinput = e[o.onbeforeinput], delete e[o.onbeforeinput]), o.onchange && ("textarea" === r || "input" === r.toLowerCase() && !/^fil|che|ra/i.test(e.type))) {
        var u = o.oninput || "oninput";
        e[u] || (e[u] = e[o.onchange], delete e[o.onchange]);
      }
    }
  }();
  var t = n.type;
  t && t.o && n.ref && (n.props.ref = n.ref, n.ref = null), T && T(n);
};

var V = function (n, t) {
  return n(t);
};

exports.unstable_batchedUpdates = V;

var _default = d({
  version: "16.8.0",
  Children: R,
  render: k,
  hydrate: k,
  unmountComponentAtNode: z,
  createPortal: F,
  createElement: S,
  createContext: _preact.createContext,
  createFactory: w,
  cloneElement: _,
  createRef: _preact.createRef,
  Fragment: _preact.Fragment,
  isValidElement: j,
  findDOMNode: U,
  Component: _preact.Component,
  PureComponent: W,
  memo: Z,
  forwardRef: L,
  unstable_batchedUpdates: V,
  Suspense: m,
  lazy: y
}, n);

exports.default = _default;
},{"preact/hooks":"node_modules/preact/hooks/dist/hooks.module.js","preact":"node_modules/preact/dist/preact.module.js"}],"node_modules/nanoevents/index.js":[function(require,module,exports) {
(
/**
 * Interface for event subscription.
 *
 * @example
 * var NanoEvents = require('nanoevents')
 *
 * class Ticker {
 *   constructor() {
 *     this.emitter = new NanoEvents()
 *   }
 *   on() {
 *     return this.emitter.on.apply(this.events, arguments)
 *   }
 *   tick() {
 *     this.emitter.emit('tick')
 *   }
 * }
 *
 * @alias NanoEvents
 * @class
 */
module.exports = function NanoEvents() {
  /**
   * Event names in keys and arrays with listeners in values.
   * @type {object}
   *
   * @example
   * Object.keys(ee.events)
   *
   * @alias NanoEvents#events
   */
  this.events = {};
}).prototype = {
  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments for listeners.
   *
   * @return {undefined}
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   *
   * @alias NanoEvents#emit
   * @method
   */
  emit: function emit(event) {
    var args = [].slice.call(arguments, 1) // Array.prototype.call() returns empty array if context is not array-like
    ;
    [].slice.call(this.events[event] || []).filter(function (i) {
      i.apply(null, args);
    });
  },

  /**
   * Add a listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event.
   *
   * @example
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   *
   * @alias NanoEvents#on
   * @method
   */
  on: function on(event, cb) {
    if ("development" !== 'production' && typeof cb !== 'function') {
      throw new Error('Listener must be a function');
    }

    (this.events[event] = this.events[event] || []).push(cb);
    return function () {
      this.events[event] = this.events[event].filter(function (i) {
        return i !== cb;
      });
    }.bind(this);
  }
};
},{}],"src/events.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emit = exports.on = exports.EVENTS = exports.EV_CONVOCHOICE = exports.EV_CONVONEXT = exports.EV_CONVOSTART = void 0;

var _nanoevents = _interopRequireDefault(require("nanoevents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/ai/nanoevents
var emitter = new _nanoevents.default();
var EV_CONVOSTART = 'ev.convoStart';
exports.EV_CONVOSTART = EV_CONVOSTART;
var EV_CONVONEXT = 'ev.convoNext';
exports.EV_CONVONEXT = EV_CONVONEXT;
var EV_CONVOCHOICE = 'ev.convoChoice';
exports.EV_CONVOCHOICE = EV_CONVOCHOICE;
var EVENTS = [EV_CONVOSTART, EV_CONVONEXT, EV_CONVOCHOICE];
exports.EVENTS = EVENTS;

var hasEvent = function hasEvent(e) {
  return EVENTS.some(function (s) {
    return s === e;
  });
};

var on = function on(e, fn) {
  return hasEvent(e) && emitter.on(e, fn);
};

exports.on = on;

var emit = function emit(e) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return hasEvent(e) && emitter.emit(e, args);
};

exports.emit = emit;
},{"nanoevents":"node_modules/nanoevents/index.js"}],"src/ui.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _compat = require("preact/compat");

var _events = require("./events");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var typeWriter = function typeWriter(_ref) {
  var text = _ref.text,
      _ref$speed = _ref.speed,
      speed = _ref$speed === void 0 ? 100 : _ref$speed,
      _ref$onNext = _ref.onNext,
      onNext = _ref$onNext === void 0 ? function () {} : _ref$onNext,
      _ref$onComplete = _ref.onComplete,
      onComplete = _ref$onComplete === void 0 ? function () {} : _ref$onComplete;

  var nextText = function nextText() {
    var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    if (i < text.length) {
      str = str + text.charAt(i);
      i++;
      onNext(str);
      setTimeout(function () {
        nextText(i, str);
      }, speed);
    } else {
      onComplete();
    }
  };

  return {
    start: function start() {
      return nextText();
    }
  };
};

var DialogueBox = function DialogueBox(_ref2) {
  var title = _ref2.title,
      text = _ref2.text,
      children = _ref2.children,
      _ref2$onTextStarted = _ref2.onTextStarted,
      onTextStarted = _ref2$onTextStarted === void 0 ? function () {} : _ref2$onTextStarted,
      _ref2$onTextComplete = _ref2.onTextComplete,
      onTextComplete = _ref2$onTextComplete === void 0 ? function () {} : _ref2$onTextComplete;

  var _useState = (0, _compat.useState)(""),
      _useState2 = _slicedToArray(_useState, 2),
      textStep = _useState2[0],
      setTextStep = _useState2[1];

  (0, _compat.useEffect)(function () {
    onTextStarted();
    typeWriter({
      speed: 50,
      text: text,
      onNext: function onNext(text) {
        return setTextStep(text);
      },
      onComplete: function onComplete() {
        return onTextComplete();
      }
    }).start();
  }, []);
  return (0, _preact.h)("div", {
    class: "dialogueBoxOuter"
  }, (0, _preact.h)("div", {
    class: "dialogue"
  }, (0, _preact.h)("p", null, title, ":"), (0, _preact.h)("p", null, textStep), (0, _preact.h)("div", {
    class: "arrow"
  }), (0, _preact.h)("div", {
    class: "children"
  }, children)));
};

var ChoiceWindow = function ChoiceWindow(_ref3) {
  var _ref3$choices = _ref3.choices,
      choices = _ref3$choices === void 0 ? [] : _ref3$choices,
      _ref3$onChoiceSelecte = _ref3.onChoiceSelected,
      onChoiceSelected = _ref3$onChoiceSelecte === void 0 ? function () {} : _ref3$onChoiceSelecte;
  return (0, _preact.h)("div", {
    class: "choiceWindow"
  }, choices.map(function (choice) {
    return (0, _preact.h)("div", {
      class: "choiceBox",
      onClick: function onClick() {
        onChoiceSelected(choice);
      }
    }, choice.text);
  }));
};

var DebugWindow = function DebugWindow(_ref4) {
  var props = Object.assign({}, _ref4);
  return (0, _preact.h)("div", {
    class: "debugWindow"
  }, (0, _preact.h)("p", null, "Game Debug:"), (0, _preact.h)("div", null, "..."));
};

var Shell = function Shell(_ref5) {
  var convoIterator = _ref5.convoIterator;

  var _useState3 = (0, _compat.useState)({}),
      _useState4 = _slicedToArray(_useState3, 1),
      debugData = _useState4[0];

  var _useState5 = (0, _compat.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      currentDialogue = _useState6[0],
      setCurrentDialogue = _useState6[1];

  var _useState7 = (0, _compat.useState)(null),
      _useState8 = _slicedToArray(_useState7, 2),
      currentChoices = _useState8[0],
      setCurrentChoices = _useState8[1];

  var _useState9 = (0, _compat.useState)(true),
      _useState10 = _slicedToArray(_useState9, 2),
      canProceed = _useState10[0],
      setCanProceed = _useState10[1];

  var onConvoStarted = function onConvoStarted(data) {
    if (!canProceed) return;
    console.log("Conversation started:");
    console.log(data.conversationProps);
    setCanProceed(false);
    setCurrentDialogue({
      title: data.actorProps.name,
      text: data.conversationProps.actor ? "\"".concat(data.conversationProps.text, "\"") : data.conversationProps.text
    });
    setCurrentChoices(data.conversationProps.choices);
  };

  var onConvoNext = function onConvoNext(data) {
    if (canProceed && !currentChoices) {
      console.log("Conversation next:");
      setCurrentDialogue(data); // convoIterator.goToExact(choice.to); ????
    }
  };

  var onChoiceSelected = function onChoiceSelected(choice) {
    console.log(choice);
    setCurrentChoices(null);
    convoIterator.goToExact(choice.to);
  };

  var onTextStarted = function onTextStarted() {
    return setCanProceed(false);
  };

  var onTextComplete = function onTextComplete() {
    return setCanProceed(true);
  };

  (0, _compat.useEffect)(function () {
    (0, _events.on)(_events.EV_CONVOSTART, onConvoStarted);
    (0, _events.on)(_events.EV_CONVONEXT, onConvoNext);
  }, []);
  return (0, _preact.h)("div", {
    class: "uiShell"
  }, debugData && (0, _preact.h)(DebugWindow, debugData), currentDialogue && (0, _preact.h)(DialogueBox, _extends({}, currentDialogue, {
    onTextStarted: onTextStarted,
    onTextComplete: onTextComplete
  }), currentChoices && canProceed && (0, _preact.h)(ChoiceWindow, {
    choices: currentChoices,
    onChoiceSelected: onChoiceSelected
  })));
};

var _default = function _default(props) {
  return {
    start: function start() {
      (0, _preact.render)((0, _preact.h)(Shell, props), document.getElementById("ui"));
    }
  };
};

exports.default = _default;
},{"preact":"node_modules/preact/dist/preact.module.js","preact/compat":"node_modules/preact/compat/dist/compat.module.js","./events":"src/events.js"}],"src/cache.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  create: function create() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (Number(String(Math.random()).slice(2)) + Date.now() + Math.round(performance.now())).toString(36);
    var a = [];

    var t = function t() {
      return a.map(function (e) {
        return e;
      });
    },
        r = function r() {
      return a.map(function (_ref) {
        var e = _ref.value;
        return e;
      });
    };

    return {
      id: e,
      items: t,
      keys: function keys() {
        return a.map(function (_ref2) {
          var e = _ref2.key;
          return e;
        });
      },
      values: r,
      get: function get(e) {
        return function (e) {
          return void 0 !== e ? _objectSpread({}, e) : null;
        }(a.filter(function (a) {
          return a.key === e;
        })[0]);
      },
      query: function query() {
        var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return e.map(function (e) {
          return e(r());
        });
      },
      add: function add(e, t) {
        return !a.some(function (a) {
          return a.key === e;
        }) && a.push({
          key: e,
          value: t
        });
      },
      remove: function remove(e) {
        return a = a.filter(function (_ref3) {
          var a = _ref3.key;
          return e !== a;
        });
      },
      flush: function flush() {
        return a.splice(0, a.length);
      },
      update: function update(e, t, r) {
        a = a.map(function (a) {
          return a.key === e ? _objectSpread({}, a, {
            value: _objectSpread({}, a.value, _defineProperty({}, t, r))
          }) : _objectSpread({}, a);
        });
      },
      export: function _export() {
        return JSON.stringify(t());
      },
      import: function _import(e) {
        return a = JSON.parse(e).map(function (e) {
          return e;
        });
      }
    };
  }
};
exports.default = _default;
},{}],"src/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleCollision = exports.vmulti = exports.between = exports.useState = exports.uniqueId = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var uniqueId = function uniqueId() {
  var pre = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return "".concat(pre).concat(pre.length ? "_" : "") + (Number(String(Math.random()).slice(2)) + Date.now() + Math.round(performance.now())).toString(36);
};

exports.uniqueId = uniqueId;

var useState = function useState(state) {
  var setter = function setter(modifiedState) {
    return state = modifiedState;
  };

  var getter = function getter() {
    return state;
  };

  return [getter, setter];
};

exports.useState = useState;

var between = function between(v, a, b) {
  return v > a && v < b;
};

exports.between = between;

var vmulti = function vmulti(vec, v) {
  var x = 0;
  var y = 0;

  if (_typeof(v) === "object") {
    x = vec.x * v.x;
    y = vec.y * v.y;
  } else {
    x = vec.x * v;
    y = vec.y * v;
  }

  return Vector(x, y);
};

exports.vmulti = vmulti;

var circleCollision = function circleCollision(collider, targets) {
  if (!collider.radius) {
    console.error("Cannot detect collisions without radious property.");
  }

  return targets.filter(function (target) {
    var dx = target.x - collider.x;
    var dy = target.y - collider.y;

    if (Math.sqrt(dx * dx + dy * dy) < target.radius + collider.width) {
      target.ttl = 0;
      collider.ttl = 0;
      return target;
    }
  });
};

exports.circleCollision = circleCollision;
},{}],"src/entity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _helpers = require("./helpers");

var _default = function _default(_ref) {
  var _ref$id = _ref.id,
      id = _ref$id === void 0 ? (0, _helpers.uniqueId)("ent_") : _ref$id,
      x = _ref.x,
      y = _ref.y,
      sheet = _ref.sheet,
      name = _ref.name,
      _ref$controlledByUser = _ref.controlledByUser,
      controlledByUser = _ref$controlledByUser === void 0 ? false : _ref$controlledByUser,
      _ref$collidesWithTile = _ref.collidesWithTiles,
      collidesWithTiles = _ref$collidesWithTile === void 0 ? true : _ref$collidesWithTile;
  var spriteSheet = (0, _kontra.SpriteSheet)({
    image: _kontra.imageAssets[sheet],
    frameWidth: 16,
    frameHeight: 16,
    animations: {
      idle: {
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      walk: {
        frames: [3, 4, 5, 6, 7],
        frameRate: 16
      }
    }
  });
  return (0, _kontra.Sprite)({
    id: id,
    name: name,
    x: x,
    y: y,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles: collidesWithTiles,
    controlledByUser: controlledByUser
  });
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","./helpers":"src/helpers.js"}],"src/conversationIterator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("./helpers");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = function _default(_ref) {
  var collection = _ref.collection,
      _ref$onChatComplete = _ref.onChatComplete,
      onChatComplete = _ref$onChatComplete === void 0 ? function (lastPositionSaved) {} : _ref$onChatComplete,
      _ref$onChainProgress = _ref.onChainProgress,
      onChainProgress = _ref$onChainProgress === void 0 ? function (lastNodeId) {} : _ref$onChainProgress;

  var _useState = (0, _helpers.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      index = _useState2[0],
      setIndex = _useState2[1];

  var _useState3 = (0, _helpers.useState)(collection[index()]),
      _useState4 = _slicedToArray(_useState3, 2),
      currentNode = _useState4[0],
      setCurrentNode = _useState4[1];

  var _displayNode = function _displayNode(queriedNode) {
    if (queriedNode) {
      setCurrentNode(queriedNode);
      setIndex(queriedNode.index);
      return queriedNode;
    } else {
      throw "No node match.";
    }
  };

  var _queryNode = function _queryNode(query) {
    var queriedNode = collection.length ? collection.filter(function (node, index) {
      return query === node.id ? {
        node: node,
        index: index
      } : null;
    })[0] : null;
    return _displayNode(queriedNode);
  };

  return {
    currentIndex: function currentIndex() {
      return index();
    },
    goToExact: function goToExact(query) {
      var queriedNode = _queryNode(query);

      setIndex(queriedNode.index);
      setCurrentNode(queriedNode);
      return _displayNode(queriedNode);
    },
    goToNext: function goToNext() {
      // TODO: Beware, if you're not checking for existent choices, this will error out,
      // or do something a little funky. May want to check for choices here instead?
      var _currentNode = currentNode(),
          id = _currentNode.id,
          to = _currentNode.to,
          choices = _currentNode.choices,
          actions = _currentNode.actions; // Wait if choices are presented.


      if (choices.length) return; // TODO: Consts please.

      if (actions.some(function (action) {
        return action === "endConversation";
      }) || choices.length === 0 && !to) {
        if (actions.some(function (action) {
          return action === "save";
        })) {
          // ... onSave, etc
          onChainProgress(id);
          console.log("Saved chain position to:", id);
        }

        if (actions.some(function (action) {
          return action === "cancel";
        })) {
          // ... onCancel, etc
          console.log("Cancelled, nothing was saved.");
        }

        onChatComplete(id);
        console.log("End reached, close the convo.");
        return;
      }

      var queriedNode = _queryNode(to);

      setIndex(queriedNode.index);
      setCurrentNode(queriedNode);
      return _displayNode(queriedNode);
    }
  };
};

exports.default = _default;
},{"./helpers":"src/helpers.js"}],"src/fsm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_ref) {
  var _ref$states = _ref.states,
      states = _ref$states === void 0 ? [] : _ref$states,
      _ref$startIndex = _ref.startIndex,
      startIndex = _ref$startIndex === void 0 ? 0 : _ref$startIndex;
  var currentState = states[startIndex];
  return {
    setState: function setState(stateId) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (currentState.id === stateId) return;
      currentState = states.find(function (st) {
        return st.id === stateId;
      });
      currentState.enter(props);
    },
    update: function update() {
      currentState.update();

      if (currentState.isComplete) {
        currentState.exit();
        currentState = states[0];
      }
    }
  };
};

exports.default = _default;
},{}],"src/states/blankState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_ref) {
  var id = _ref.id,
      cache = _ref.cache,
      _ref$onEntry = _ref.onEntry,
      onEntry = _ref$onEntry === void 0 ? function () {} : _ref$onEntry,
      _ref$onExit = _ref.onExit,
      onExit = _ref$onExit === void 0 ? function () {} : _ref$onExit;
  var isComplete = false;
  return {
    id: id,
    isComplete: isComplete,
    enter: function enter(props) {
      onEntry();
    },
    update: function update() {},
    exit: function exit() {
      onExit();
    }
  };
};

exports.default = _default;
},{}],"src/states/startConvo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = require("../events");

var _kontra = require("kontra");

var _default = function _default(_ref) {
  var id = _ref.id,
      convoIterator = _ref.convoIterator,
      _ref$onEntry = _ref.onEntry,
      onEntry = _ref$onEntry === void 0 ? function () {} : _ref$onEntry,
      _ref$onExit = _ref.onExit,
      onExit = _ref$onExit === void 0 ? function () {} : _ref$onExit;
  var currentActors = [];
  var isComplete = false;
  return {
    id: id,
    isComplete: isComplete,
    enter: function enter(props) {
      currentActors.push(props);
      console.log("Player entered a conversational state:");
      console.log(props); // Example starter convo (I'd put the convo id somewhere else)

      var val = convoIterator.goToExact("m1");
      console.log("FIRE EVENT ==>", _events.EV_CONVOSTART);
      (0, _events.emit)(_events.EV_CONVOSTART, {
        actorProps: currentActors[0],
        conversationProps: val
      });
      onEntry(props);
    },
    update: function update() {
      if ((0, _kontra.keyPressed)("e")) {
        console.log("FIRE EVENT ==>", _events.EV_CONVONEXT);
        (0, _events.emit)(_events.EV_CONVONEXT, {
          actorProps: currentActors[0],
          conversationProps: convoIterator.goToNext()
        });
      }
    },
    exit: function exit() {
      return onExit();
    }
  };
};

exports.default = _default;
},{"../events":"src/events.js","kontra":"node_modules/kontra/kontra.mjs"}],"src/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainFlow = void 0;
var mainFlow = [{
  id: "m1",
  actor: "daryl",
  from: null,
  to: null,
  text: "This is the first message, what will you choose?",
  choices: [{
    id: "m1a",
    actor: "player",
    from: "m1",
    to: "m2",
    text: "I will select A.",
    choices: [],
    actions: []
  }, {
    id: "m1b",
    actor: "player",
    from: "m1",
    to: "m3",
    text: "I will select B.",
    choices: [],
    actions: []
  }],
  actions: []
}, {
  id: "m2",
  actor: "daryl",
  from: "m1a",
  to: "m4",
  text: "This is if you select A.",
  choices: [],
  actions: []
}, {
  id: "m3",
  actor: "daryl",
  from: "m1b",
  to: null,
  text: "This is if you select B.",
  choices: [],
  actions: ["cancel"]
}, {
  id: "m4",
  actor: "daryl",
  from: "m2",
  to: null,
  text: "This should be the last in the chain for A.",
  choices: [],
  actions: ["endConversation", "save"]
}];
exports.mainFlow = mainFlow;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _kontra = require("kontra");

var _ui = _interopRequireDefault(require("./ui"));

var _cache = _interopRequireDefault(require("./cache"));

var _helpers = require("./helpers");

var _entity = _interopRequireDefault(require("./entity"));

var _conversationIterator = _interopRequireDefault(require("./conversationIterator"));

var _fsm = _interopRequireDefault(require("./fsm"));

var _blankState = _interopRequireDefault(require("./states/blankState"));

var _startConvo = _interopRequireDefault(require("./states/startConvo"));

var _data = require("./data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gameCache = _cache.default.create("gameCache");

gameCache.add("progress", {
  storyProgress: null
});

var _init = (0, _kontra.init)(),
    canvas = _init.canvas;

var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
ctx.scale(3, 3);
var convoIterator = (0, _conversationIterator.default)({
  collection: _data.mainFlow,
  onChatComplete: function onChatComplete(lastPositionSaved) {
    console.log("Exited:", lastPositionSaved);
  },
  onChainProgress: function onChainProgress(lastNodeId) {
    gameCache.set("progress", {
      storyProgress: lastNodeId
    });
  }
});

var Scene = function Scene() {
  (0, _kontra.initKeys)();
  var mapKey = "assets/tiledata/test";
  var map = _kontra.dataAssets[mapKey];
  var tileEngine = (0, _kontra.TileEngine)(map);
  var player = (0, _entity.default)({
    x: 120,
    y: 120,
    sheet: "assets/entityimages/little_devil.png",
    name: "Player",
    id: "player",
    controlledByUser: true
  });
  var npc = (0, _entity.default)({
    x: 120,
    y: 160,
    name: "Daryl",
    id: "daryl",
    sheet: "assets/entityimages/little_orc.png"
  });
  var sprites = [player, npc];
  var appMode = 0;
  var sceneStateMachine = (0, _fsm.default)({
    states: [(0, _blankState.default)({
      id: "field",
      cache: gameCache,
      onEntry: function onEntry() {
        return appMode = 0;
      }
    }), (0, _startConvo.default)({
      id: "conversation",
      sprites: sprites,
      convoIterator: convoIterator,
      onEntry: function onEntry() {
        return appMode = 1;
      }
    })]
  });
  return (0, _kontra.GameLoop)({
    update: function update() {
      sceneStateMachine.update();

      if (appMode === 1) {
        sprites.map(function (sprite) {
          sprite.playAnimation("idle");
          sprite.update();
        });
        return;
      }

      sprites.map(function (sprite) {
        // sprite is beyond the left edge
        if (sprite.x < 0) {
          sprite.x = canvas.width;
        } else if (sprite.x > canvas.width) {
          // sprite is beyond the right edge
          sprite.x = 0;
        } // sprite is beyond the top edge


        if (sprite.y < 0) {
          sprite.y = canvas.height;
        } else if (sprite.y > canvas.height) {
          // sprite is beyond the bottom edge
          sprite.y = 0;
        }
        /* To move later on */


        var dir = sprite.controlledByUser ? {
          x: (0, _kontra.keyPressed)("a") ? -1 : (0, _kontra.keyPressed)("d") ? 1 : 0,
          y: (0, _kontra.keyPressed)("w") ? -1 : (0, _kontra.keyPressed)("s") ? 1 : 0
        } : {
          x: 0,
          y: 0
        }; // AI

        /* Normalise so you don't go super fast diagonally */

        var dirLength = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
        var dirNormal = {
          x: dir.x !== 0 ? dir.x / dirLength : 0,
          y: dir.y !== 0 ? dir.y / dirLength : 0
        }; /// For collisions with tiles

        var oldPos = {
          x: sprite.x,
          y: sprite.y
        }; // Move X then check X (careful editing directly, might lead to issues with camera)

        sprite.x += dirNormal.x; // Collider check

        var collidedWithX = tileEngine.layerCollidesWith("Collision", sprite);

        if (sprite.collidesWithTiles && collidedWithX) {
          sprite.x = oldPos.x;
          sprite.y = oldPos.y;
        } // Update old pos ref


        oldPos = {
          x: sprite.x,
          y: sprite.y
        }; // Move Y then check Y (careful editing directly, might lead to issues with camera)

        sprite.y += dirNormal.y; // Collider check

        var collidedWithY = tileEngine.layerCollidesWith("Collision", sprite);

        if (sprite.collidesWithTiles && collidedWithY) {
          sprite.x = oldPos.x;
          sprite.y = oldPos.y;
        } /// For collisions with other sprites (you could optimise further with distance too)


        if (sprite.controlledByUser && (0, _kontra.keyPressed)("e")) {
          var collidingWith = (0, _helpers.circleCollision)(sprite, sprites.filter(function (s) {
            return s.id !== sprite.id;
          }));
          sprite.isColliding = collidingWith.length > 0;

          if (sprite.isColliding) {
            sceneStateMachine.setState("conversation", _objectSpread({}, collidingWith[0]));
          }
        } // Flip the sprite


        if (dirNormal.x < 0) {
          sprite.width = -sprite.width;
        } else if (dirNormal.x > 0) {
          sprite.width = sprite.width;
        } // Do some animations


        var isMoving = dirNormal.x !== 0 || dirNormal.y !== 0;
        sprite.playAnimation(isMoving ? "walk" : "idle"); // Don't update until you've calcs positions

        sprite.update();
      });
    },
    render: function render() {
      tileEngine.render();
      sprites.map(function (sprite) {
        return sprite.render();
      });
    }
  });
};
/* Make sure to embed your tilesets or it'll run in to problems */


(0, _kontra.load)("assets/tileimages/test.png", "assets/tiledata/test.json", "assets/entityimages/little_devil.png", "assets/entityimages/little_orc.png").then(function (assets) {
  Scene().start();
  (0, _ui.default)({
    convoIterator: convoIterator
  }).start();
});
},{"kontra":"node_modules/kontra/kontra.mjs","./ui":"src/ui.js","./cache":"src/cache.js","./helpers":"src/helpers.js","./entity":"src/entity.js","./conversationIterator":"src/conversationIterator.js","./fsm":"src/fsm.js","./states/blankState":"src/states/blankState.js","./states/startConvo":"src/states/startConvo.js","./data":"src/data.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62539" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map