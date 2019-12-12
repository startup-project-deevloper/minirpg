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
},{}],"node_modules/mithril/render/vnode.js":[function(require,module,exports) {
"use strict"

function Vnode(tag, key, attrs, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs, children: children, text: text, dom: dom, domSize: undefined, state: undefined, events: undefined, instance: undefined}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node == null || typeof node === "boolean") return null
	if (typeof node === "object") return node
	return Vnode("#", undefined, undefined, String(node), undefined, undefined)
}
Vnode.normalizeChildren = function(input) {
	var children = []
	if (input.length) {
		var isKeyed = input[0] != null && input[0].key != null
		// Note: this is a *very* perf-sensitive check.
		// Fun fact: merging the loop like this is somehow faster than splitting
		// it, noticeably so.
		for (var i = 1; i < input.length; i++) {
			if ((input[i] != null && input[i].key != null) !== isKeyed) {
				throw new TypeError("Vnodes must either always have keys or never have keys!")
			}
		}
		for (var i = 0; i < input.length; i++) {
			children[i] = Vnode.normalize(input[i])
		}
	}
	return children
}

module.exports = Vnode

},{}],"node_modules/mithril/render/hyperscriptVnode.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

// Call via `hyperscriptVnode.apply(startOffset, arguments)`
//
// The reason I do it this way, forwarding the arguments and passing the start
// offset in `this`, is so I don't have to create a temporary array in a
// performance-critical path.
//
// In native ES6, I'd instead add a final `...args` parameter to the
// `hyperscript` and `fragment` factories and define this as
// `hyperscriptVnode(...args)`, since modern engines do optimize that away. But
// ES5 (what Mithril requires thanks to IE support) doesn't give me that luxury,
// and engines aren't nearly intelligent enough to do either of these:
//
// 1. Elide the allocation for `[].slice.call(arguments, 1)` when it's passed to
//    another function only to be indexed.
// 2. Elide an `arguments` allocation when it's passed to any function other
//    than `Function.prototype.apply` or `Reflect.apply`.
//
// In ES6, it'd probably look closer to this (I'd need to profile it, though):
// module.exports = function(attrs, ...children) {
//     if (attrs == null || typeof attrs === "object" && attrs.tag == null && !Array.isArray(attrs)) {
//         if (children.length === 1 && Array.isArray(children[0])) children = children[0]
//     } else {
//         children = children.length === 0 && Array.isArray(attrs) ? attrs : [attrs, ...children]
//         attrs = undefined
//     }
//
//     if (attrs == null) attrs = {}
//     return Vnode("", attrs.key, attrs, children)
// }
module.exports = function() {
	var attrs = arguments[this], start = this + 1, children

	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = this
	}

	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}

	return Vnode("", attrs.key, attrs, children)
}

},{"../render/vnode":"node_modules/mithril/render/vnode.js"}],"node_modules/mithril/render/hyperscript.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")
var hyperscriptVnode = require("./hyperscriptVnode")

var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty

function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}

function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}

function execSelector(state, vnode) {
	var attrs = vnode.attrs
	var children = Vnode.normalizeChildren(vnode.children)
	var hasClass = hasOwn.call(attrs, "class")
	var className = hasClass ? attrs.class : attrs.className

	vnode.tag = state.tag
	vnode.attrs = null
	vnode.children = undefined

	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}

		for (var key in attrs) {
			if (hasOwn.call(attrs, key)) newAttrs[key] = attrs[key]
		}

		attrs = newAttrs
	}

	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key) && key !== "className" && !hasOwn.call(attrs, key)){
			attrs[key] = state.attrs[key]
		}
	}
	if (className != null || state.attrs.className != null) attrs.className =
		className != null
			? state.attrs.className != null
				? String(state.attrs.className) + " " + String(className)
				: className
			: state.attrs.className != null
				? state.attrs.className
				: null

	if (hasClass) attrs.class = null

	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			vnode.attrs = attrs
			break
		}
	}

	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		vnode.text = children[0].children
	} else {
		vnode.children = children
	}

	return vnode
}

function hyperscript(selector) {
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}

	var vnode = hyperscriptVnode.apply(1, arguments)

	if (typeof selector === "string") {
		vnode.children = Vnode.normalizeChildren(vnode.children)
		if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode)
	}

	vnode.tag = selector
	return vnode
}

module.exports = hyperscript

},{"../render/vnode":"node_modules/mithril/render/vnode.js","./hyperscriptVnode":"node_modules/mithril/render/hyperscriptVnode.js"}],"node_modules/mithril/render/trust.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

module.exports = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}

},{"../render/vnode":"node_modules/mithril/render/vnode.js"}],"node_modules/mithril/render/fragment.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")
var hyperscriptVnode = require("./hyperscriptVnode")

module.exports = function() {
	var vnode = hyperscriptVnode.apply(0, arguments)

	vnode.tag = "["
	vnode.children = Vnode.normalizeChildren(vnode.children)
	return vnode
}

},{"../render/vnode":"node_modules/mithril/render/vnode.js","./hyperscriptVnode":"node_modules/mithril/render/hyperscriptVnode.js"}],"node_modules/mithril/hyperscript.js":[function(require,module,exports) {
"use strict"

var hyperscript = require("./render/hyperscript")

hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

module.exports = hyperscript

},{"./render/hyperscript":"node_modules/mithril/render/hyperscript.js","./render/trust":"node_modules/mithril/render/trust.js","./render/fragment":"node_modules/mithril/render/fragment.js"}],"node_modules/mithril/promise/polyfill.js":[function(require,module,exports) {
"use strict"
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")

	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}

	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.prototype.finally = function(callback) {
	return this.then(
		function(value) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return value
			})
		},
		function(reason) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return PromisePolyfill.reject(reason);
			})
		}
	)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}

module.exports = PromisePolyfill

},{}],"node_modules/mithril/promise/promise.js":[function(require,module,exports) {
var global = arguments[3];
"use strict"

var PromisePolyfill = require("./polyfill")

if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") {
		window.Promise = PromisePolyfill
	} else if (!window.Promise.prototype.finally) {
		window.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") {
		global.Promise = PromisePolyfill
	} else if (!global.Promise.prototype.finally) {
		global.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	module.exports = global.Promise
} else {
	module.exports = PromisePolyfill
}

},{"./polyfill":"node_modules/mithril/promise/polyfill.js"}],"node_modules/mithril/render/render.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

module.exports = function($window) {
	var $doc = $window && $window.document
	var currentRedraw

	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}

	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}

	//sanity check to discourage people from doing `vnode.state = ...`
	function checkState(vnode, original) {
		if (vnode.state !== original) throw new Error("`vnode.state` must not be modified")
	}

	//Note: the hook is passed as the `this` argument to allow proxying the
	//arguments without requiring a full array allocation to do so. It also
	//takes advantage of the fact the current `vnode` is the first argument in
	//all lifecycle methods.
	function callHook(vnode) {
		var original = vnode.state
		try {
			return this.apply(original, arguments)
		} finally {
			checkState(vnode, original)
		}
	}

	// IE11 (at least) throws an UnspecifiedError when accessing document.activeElement when
	// inside an iframe. Catch and swallow this error, and heavy-handidly return null.
	function activeElement() {
		try {
			return $doc.activeElement
		} catch (e) {
			return null
		}
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": createText(parent, vnode, nextSibling); break
				case "<": createHTML(parent, vnode, ns, nextSibling); break
				case "[": createFragment(parent, vnode, hooks, ns, nextSibling); break
				default: createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
	}
	var possibleParents = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}
	function createHTML(parent, vnode, ns, nextSibling) {
		var match = vnode.children.match(/^\s*?<(\w+)/im) || []
		// not using the proper parent makes the child element(s) vanish.
		//     var div = document.createElement("div")
		//     div.innerHTML = "<td>i</td><td>j</td>"
		//     console.log(div.innerHTML)
		// --> "ij", no <td> in sight.
		var temp = $doc.createElement(possibleParents[match[1]] || "div")
		if (ns === "http://www.w3.org/2000/svg") {
			temp.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + vnode.children + "</svg>"
			temp = temp.firstChild
		} else {
			temp.innerHTML = vnode.children
		}
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		// Capture nodes to remove, so we don't confuse them.
		vnode.instance = []
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			vnode.instance.push(child)
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs = vnode.attrs
		var is = attrs && attrs.is

		ns = getNameSpace(vnode) || ns

		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element

		if (attrs != null) {
			setAttrs(vnode, attrs, ns)
		}

		insertNode(parent, element, nextSibling)

		if (!maybeSetContentEditable(vnode)) {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				if (vnode.tag === "select" && attrs != null) setLateSelectAttrs(vnode, attrs)
			}
		}
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		initLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
		}
		else {
			vnode.domSize = 0
		}
	}

	//update
	/**
	 * @param {Element|Fragment} parent - the parent element
	 * @param {Vnode[] | null} old - the list of vnodes of the last `render()` call for
	 *                               this part of the tree
	 * @param {Vnode[] | null} vnodes - as above, but for the current `render()` call.
	 * @param {Function[]} hooks - an accumulator of post-render hooks (oncreate/onupdate)
	 * @param {Element | null} nextSibling - the next DOM node if we're dealing with a
	 *                                       fragment that is not the last item in its
	 *                                       parent
	 * @param {'svg' | 'math' | String | null} ns) - the current XML namespace, if any
	 * @returns void
	 */
	// This function diffs and patches lists of vnodes, both keyed and unkeyed.
	//
	// We will:
	//
	// 1. describe its general structure
	// 2. focus on the diff algorithm optimizations
	// 3. discuss DOM node operations.

	// ## Overview:
	//
	// The updateNodes() function:
	// - deals with trivial cases
	// - determines whether the lists are keyed or unkeyed based on the first non-null node
	//   of each list.
	// - diffs them and patches the DOM if needed (that's the brunt of the code)
	// - manages the leftovers: after diffing, are there:
	//   - old nodes left to remove?
	// 	 - new nodes to insert?
	// 	 deal with them!
	//
	// The lists are only iterated over once, with an exception for the nodes in `old` that
	// are visited in the fourth part of the diff and in the `removeNodes` loop.

	// ## Diffing
	//
	// Reading https://github.com/localvoid/ivi/blob/ddc09d06abaef45248e6133f7040d00d3c6be853/packages/ivi/src/vdom/implementation.ts#L617-L837
	// may be good for context on longest increasing subsequence-based logic for moving nodes.
	//
	// In order to diff keyed lists, one has to
	//
	// 1) match nodes in both lists, per key, and update them accordingly
	// 2) create the nodes present in the new list, but absent in the old one
	// 3) remove the nodes present in the old list, but absent in the new one
	// 4) figure out what nodes in 1) to move in order to minimize the DOM operations.
	//
	// To achieve 1) one can create a dictionary of keys => index (for the old list), then iterate
	// over the new list and for each new vnode, find the corresponding vnode in the old list using
	// the map.
	// 2) is achieved in the same step: if a new node has no corresponding entry in the map, it is new
	// and must be created.
	// For the removals, we actually remove the nodes that have been updated from the old list.
	// The nodes that remain in that list after 1) and 2) have been performed can be safely removed.
	// The fourth step is a bit more complex and relies on the longest increasing subsequence (LIS)
	// algorithm.
	//
	// the longest increasing subsequence is the list of nodes that can remain in place. Imagine going
	// from `1,2,3,4,5` to `4,5,1,2,3` where the numbers are not necessarily the keys, but the indices
	// corresponding to the keyed nodes in the old list (keyed nodes `e,d,c,b,a` => `b,a,e,d,c` would
	//  match the above lists, for example).
	//
	// In there are two increasing subsequences: `4,5` and `1,2,3`, the latter being the longest. We
	// can update those nodes without moving them, and only call `insertNode` on `4` and `5`.
	//
	// @localvoid adapted the algo to also support node deletions and insertions (the `lis` is actually
	// the longest increasing subsequence *of old nodes still present in the new list*).
	//
	// It is a general algorithm that is fireproof in all circumstances, but it requires the allocation
	// and the construction of a `key => oldIndex` map, and three arrays (one with `newIndex => oldIndex`,
	// the `LIS` and a temporary one to create the LIS).
	//
	// So we cheat where we can: if the tails of the lists are identical, they are guaranteed to be part of
	// the LIS and can be updated without moving them.
	//
	// If two nodes are swapped, they are guaranteed not to be part of the LIS, and must be moved (with
	// the exception of the last node if the list is fully reversed).
	//
	// ## Finding the next sibling.
	//
	// `updateNode()` and `createNode()` expect a nextSibling parameter to perform DOM operations.
	// When the list is being traversed top-down, at any index, the DOM nodes up to the previous
	// vnode reflect the content of the new list, whereas the rest of the DOM nodes reflect the old
	// list. The next sibling must be looked for in the old list using `getNextSibling(... oldStart + 1 ...)`.
	//
	// In the other scenarios (swaps, upwards traversal, map-based diff),
	// the new vnodes list is traversed upwards. The DOM nodes at the bottom of the list reflect the
	// bottom part of the new vnodes list, and we can use the `v.dom`  value of the previous node
	// as the next sibling (cached in the `nextSibling` variable).


	// ## DOM node moves
	//
	// In most scenarios `updateNode()` and `createNode()` perform the DOM operations. However,
	// this is not the case if the node moved (second and fourth part of the diff algo). We move
	// the old DOM nodes before updateNode runs because it enables us to use the cached `nextSibling`
	// variable rather than fetching it using `getNextSibling()`.
	//
	// The fourth part of the diff currently inserts nodes unconditionally, leading to issues
	// like #1791 and #1999. We need to be smarter about those situations where adjascent old
	// nodes remain together in the new list in a way that isn't covered by parts one and
	// three of the diff algo.

	function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length)
		else {
			var isOldKeyed = old[0] != null && old[0].key != null
			var isKeyed = vnodes[0] != null && vnodes[0].key != null
			var start = 0, oldStart = 0
			if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++
			if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++
			if (isKeyed === null && isOldKeyed == null) return // both lists are full of nulls
			if (isOldKeyed !== isKeyed) {
				removeNodes(parent, old, oldStart, old.length)
				createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else if (!isKeyed) {
				// Don't index past the end of either list (causes deopts).
				var commonLength = old.length < vnodes.length ? old.length : vnodes.length
				// Rewind if necessary to the first non-null index on either side.
				// We could alternatively either explicitly create or remove nodes when `start !== oldStart`
				// but that would be optimizing for sparse lists which are more rare than dense ones.
				start = start < oldStart ? start : oldStart
				for (; start < commonLength; start++) {
					o = old[start]
					v = vnodes[start]
					if (o === v || o == null && v == null) continue
					else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling))
					else if (v == null) removeNode(parent, o)
					else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns)
				}
				if (old.length > commonLength) removeNodes(parent, old, start, old.length)
				if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else {
				// keyed diff
				var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling

				// bottom-up
				while (oldEnd >= oldStart && end >= start) {
					oe = old[oldEnd]
					ve = vnodes[end]
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
				}
				// top-down
				while (oldEnd >= oldStart && end >= start) {
					o = old[oldStart]
					v = vnodes[start]
					if (o.key !== v.key) break
					oldStart++, start++
					if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns)
				}
				// swaps and list reversals
				while (oldEnd >= oldStart && end >= start) {
					if (start === end) break
					if (o.key !== ve.key || oe.key !== v.key) break
					topSibling = getNextSibling(old, oldStart, nextSibling)
					moveNodes(parent, oe, topSibling)
					if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns)
					if (++start <= --end) moveNodes(parent, o, nextSibling)
					if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldStart++; oldEnd--
					oe = old[oldEnd]
					ve = vnodes[end]
					o = old[oldStart]
					v = vnodes[start]
				}
				// bottom up once again
				while (oldEnd >= oldStart && end >= start) {
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
					oe = old[oldEnd]
					ve = vnodes[end]
				}
				if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1)
				else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
				else {
					// inspired by ivi https://github.com/ivijs/ivi/ by Boris Kaul
					var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li=0, i=0, pos = 2147483647, matched = 0, map, lisIndices
					for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1
					for (i = end; i >= start; i--) {
						if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1)
						ve = vnodes[i]
						var oldIndex = map[ve.key]
						if (oldIndex != null) {
							pos = (oldIndex < pos) ? oldIndex : -1 // becomes -1 if nodes were re-ordered
							oldIndices[i-start] = oldIndex
							oe = old[oldIndex]
							old[oldIndex] = null
							if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
							if (ve.dom != null) nextSibling = ve.dom
							matched++
						}
					}
					nextSibling = originalNextSibling
					if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1)
					if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
					else {
						if (pos === -1) {
							// the indices of the indices of the items that are part of the
							// longest increasing subsequence in the oldIndices list
							lisIndices = makeLisIndices(oldIndices)
							li = lisIndices.length - 1
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								else {
									if (lisIndices[li] === i - start) li--
									else moveNodes(parent, v, nextSibling)
								}
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						} else {
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						}
					}
				}
			}
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode.events = old.events
			if (shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, ns, nextSibling); break
					case "[": updateFragment(parent, old, vnode, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, ns)
		}
		else {
			removeNode(parent, old)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, ns, nextSibling) {
		if (old.children !== vnode.children) {
			removeHTML(parent, old)
			createHTML(parent, vnode, ns, nextSibling)
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
		}
	}
	function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns

		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (!maybeSetContentEditable(vnode)) {
			if (old.text != null && vnode.text != null && vnode.text !== "") {
				if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
			}
			else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
				if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
				updateNodes(element, old.children, vnode.children, hooks, null, ns)
			}
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
		vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		updateLifecycle(vnode.state, vnode, hooks)
		if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(parent, old.instance)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function getKeyMap(vnodes, start, end) {
		var map = Object.create(null)
		for (; start < end; start++) {
			var vnode = vnodes[start]
			if (vnode != null) {
				var key = vnode.key
				if (key != null) map[key] = start
			}
		}
		return map
	}
	// Lifted from ivi https://github.com/ivijs/ivi/
	// takes a list of unique numbers (-1 is special and can
	// occur multiple times) and returns an array with the indices
	// of the items that are part of the longest increasing
	// subsequece
	var lisTemp = []
	function makeLisIndices(a) {
		var result = [0]
		var u = 0, v = 0, i = 0
		var il = lisTemp.length = a.length
		for (var i = 0; i < il; i++) lisTemp[i] = a[i]
		for (var i = 0; i < il; ++i) {
			if (a[i] === -1) continue
			var j = result[result.length - 1]
			if (a[j] < a[i]) {
				lisTemp[i] = j
				result.push(i)
				continue
			}
			u = 0
			v = result.length - 1
			while (u < v) {
				// Fast integer average without overflow.
				// eslint-disable-next-line no-bitwise
				var c = (u >>> 1) + (v >>> 1) + (u & v & 1)
				if (a[result[c]] < a[i]) {
					u = c + 1
				}
				else {
					v = c
				}
			}
			if (a[i] < a[result[u]]) {
				if (u > 0) lisTemp[i] = result[u - 1]
				result[u] = i
			}
		}
		u = result.length
		v = result[u - 1]
		while (u-- > 0) {
			result[u] = v
			v = lisTemp[v]
		}
		lisTemp.length = 0
		return result
	}

	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}

	// This covers a really specific edge case:
	// - Parent node is keyed and contains child
	// - Child is removed, returns unresolved promise in `onbeforeremove`
	// - Parent node is moved in keyed diff
	// - Remaining children still need moved appropriately
	//
	// Ideally, I'd track removed nodes as well, but that introduces a lot more
	// complexity and I'm not exactly interested in doing that.
	function moveNodes(parent, vnode, nextSibling) {
		var frag = $doc.createDocumentFragment()
		moveChildToFrag(parent, frag, vnode)
		insertNode(parent, frag, nextSibling)
	}
	function moveChildToFrag(parent, frag, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				for (var i = 0; i < vnode.instance.length; i++) {
					frag.appendChild(vnode.instance[i])
				}
			} else if (vnode.tag !== "[") {
				// Don't recurse for text nodes *or* elements, just fragments
				frag.appendChild(vnode.dom)
			} else if (vnode.children.length === 1) {
				vnode = vnode.children[0]
				if (vnode != null) continue
			} else {
				for (var i = 0; i < vnode.children.length; i++) {
					var child = vnode.children[i]
					if (child != null) moveChildToFrag(parent, frag, child)
				}
			}
			break
		}
	}

	function insertNode(parent, dom, nextSibling) {
		if (nextSibling != null) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}

	function maybeSetContentEditable(vnode) {
		if (vnode.attrs == null || (
			vnode.attrs.contenteditable == null && // attribute
			vnode.attrs.contentEditable == null // property
		)) return false
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
		return true
	}

	//remove
	function removeNodes(parent, vnodes, start, end) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) removeNode(parent, vnode)
		}
	}
	function removeNode(parent, vnode) {
		var mask = 0
		var original = vnode.state
		var stateResult, attrsResult
		if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") {
			var result = callHook.call(vnode.state.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				mask = 1
				stateResult = result
			}
		}
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = callHook.call(vnode.attrs.onbeforeremove, vnode)
			if (result != null && typeof result.then === "function") {
				// eslint-disable-next-line no-bitwise
				mask |= 2
				attrsResult = result
			}
		}
		checkState(vnode, original)

		// If we can, try to fast-path it and avoid all the overhead of awaiting
		if (!mask) {
			onremove(vnode)
			removeChild(parent, vnode)
		} else {
			if (stateResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 1) { mask &= 2; if (!mask) reallyRemove() }
				}
				stateResult.then(next, next)
			}
			if (attrsResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 2) { mask &= 1; if (!mask) reallyRemove() }
				}
				attrsResult.then(next, next)
			}
		}

		function reallyRemove() {
			checkState(vnode, original)
			onremove(vnode)
			removeChild(parent, vnode)
		}
	}
	function removeHTML(parent, vnode) {
		for (var i = 0; i < vnode.instance.length; i++) {
			parent.removeChild(vnode.instance[i])
		}
	}
	function removeChild(parent, vnode) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode.dom != null && vnode.dom.parentNode === parent) {
			if (typeof vnode.tag !== "string") {
				vnode = vnode.instance
				if (vnode != null) continue
			} else if (vnode.tag === "<") {
				removeHTML(parent, vnode)
			} else {
				if (vnode.tag !== "[") {
					parent.removeChild(vnode.dom)
					if (!Array.isArray(vnode.children)) break
				}
				if (vnode.children.length === 1) {
					vnode = vnode.children[0]
					if (vnode != null) continue
				} else {
					for (var i = 0; i < vnode.children.length; i++) {
						var child = vnode.children[i]
						if (child != null) removeChild(parent, child)
					}
				}
			}
			break
		}
	}
	function onremove(vnode) {
		if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function") callHook.call(vnode.state.onremove, vnode)
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") callHook.call(vnode.attrs.onremove, vnode)
		if (typeof vnode.tag !== "string") {
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}

	//attrs
	function setAttrs(vnode, attrs, ns) {
		for (var key in attrs) {
			setAttr(vnode, key, null, attrs[key], ns)
		}
	}
	function setAttr(vnode, key, old, value, ns) {
		if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || (old === value && !isFormAttribute(vnode, key)) && typeof value !== "object") return
		if (key[0] === "o" && key[1] === "n") return updateEvent(vnode, key, value)
		if (key.slice(0, 6) === "xlink:") vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value)
		else if (key === "style") updateStyle(vnode.dom, old, value)
		else if (hasPropertyKey(vnode, key, ns)) {
			if (key === "value") {
				// Only do the coercion if we're actually going to check the value.
				/* eslint-disable no-implicit-coercion */
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value && vnode.dom === activeElement()) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value) return
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value) return
				/* eslint-enable no-implicit-coercion */
			}
			// If you assign an input type that is not supported by IE 11 with an assignment expression, an error will occur.
			if (vnode.tag === "input" && key === "type") vnode.dom.setAttribute(key, value)
			else vnode.dom[key] = value
		} else {
			if (typeof value === "boolean") {
				if (value) vnode.dom.setAttribute(key, "")
				else vnode.dom.removeAttribute(key)
			}
			else vnode.dom.setAttribute(key === "className" ? "class" : key, value)
		}
	}
	function removeAttr(vnode, key, old, ns) {
		if (key === "key" || key === "is" || old == null || isLifecycleMethod(key)) return
		if (key[0] === "o" && key[1] === "n" && !isLifecycleMethod(key)) updateEvent(vnode, key, undefined)
		else if (key === "style") updateStyle(vnode.dom, old, null)
		else if (
			hasPropertyKey(vnode, key, ns)
			&& key !== "className"
			&& !(key === "value" && (
				vnode.tag === "option"
				|| vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement()
			))
			&& !(vnode.tag === "input" && key === "type")
		) {
			vnode.dom[key] = null
		} else {
			var nsLastIndex = key.indexOf(":")
			if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1)
			if (old !== false) vnode.dom.removeAttribute(key === "className" ? "class" : key)
		}
	}
	function setLateSelectAttrs(vnode, attrs) {
		if ("value" in attrs) {
			if(attrs.value === null) {
				if (vnode.dom.selectedIndex !== -1) vnode.dom.value = null
			} else {
				var normalized = "" + attrs.value // eslint-disable-line no-implicit-coercion
				if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
					vnode.dom.value = normalized
				}
			}
		}
		if ("selectedIndex" in attrs) setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, undefined)
	}
	function updateAttrs(vnode, old, attrs, ns) {
		if (attrs != null) {
			for (var key in attrs) {
				setAttr(vnode, key, old && old[key], attrs[key], ns)
			}
		}
		var val
		if (old != null) {
			for (var key in old) {
				if (((val = old[key]) != null) && (attrs == null || attrs[key] == null)) {
					removeAttr(vnode, key, val, ns)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === activeElement() || vnode.tag === "option" && vnode.dom.parentNode === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function hasPropertyKey(vnode, key, ns) {
		// Filter out namespaced keys
		return ns === undefined && (
			// If it's a custom element, just keep it.
			vnode.tag.indexOf("-") > -1 || vnode.attrs != null && vnode.attrs.is ||
			// If it's a normal element, let's try to avoid a few browser bugs.
			key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height"// && key !== "type"
			// Defer the property check until *after* we check everything.
		) && key in vnode.dom
	}

	//style
	var uppercaseRegex = /[A-Z]/g
	function toLowerCase(capital) { return "-" + capital.toLowerCase() }
	function normalizeKey(key) {
		return key[0] === "-" && key[1] === "-" ? key :
			key === "cssFloat" ? "float" :
				key.replace(uppercaseRegex, toLowerCase)
	}
	function updateStyle(element, old, style) {
		if (old === style) {
			// Styles are equivalent, do nothing.
		} else if (style == null) {
			// New style is missing, just clear it.
			element.style.cssText = ""
		} else if (typeof style !== "object") {
			// New style is a string, let engine deal with patching.
			element.style.cssText = style
		} else if (old == null || typeof old !== "object") {
			// `old` is missing or a string, `style` is an object.
			element.style.cssText = ""
			// Add new style properties
			for (var key in style) {
				var value = style[key]
				if (value != null) element.style.setProperty(normalizeKey(key), String(value))
			}
		} else {
			// Both old & new are (different) objects.
			// Update style properties that have changed
			for (var key in style) {
				var value = style[key]
				if (value != null && (value = String(value)) !== String(old[key])) {
					element.style.setProperty(normalizeKey(key), value)
				}
			}
			// Remove style properties that no longer exist
			for (var key in old) {
				if (old[key] != null && style[key] == null) {
					element.style.removeProperty(normalizeKey(key))
				}
			}
		}
	}

	// Here's an explanation of how this works:
	// 1. The event names are always (by design) prefixed by `on`.
	// 2. The EventListener interface accepts either a function or an object
	//    with a `handleEvent` method.
	// 3. The object does not inherit from `Object.prototype`, to avoid
	//    any potential interference with that (e.g. setters).
	// 4. The event name is remapped to the handler before calling it.
	// 5. In function-based event handlers, `ev.target === this`. We replicate
	//    that below.
	// 6. In function-based event handlers, `return false` prevents the default
	//    action and stops event propagation. We replicate that below.
	function EventDict() {
		// Save this, so the current redraw is correctly tracked.
		this._ = currentRedraw
	}
	EventDict.prototype = Object.create(null)
	EventDict.prototype.handleEvent = function (ev) {
		var handler = this["on" + ev.type]
		var result
		if (typeof handler === "function") result = handler.call(ev.currentTarget, ev)
		else if (typeof handler.handleEvent === "function") handler.handleEvent(ev)
		if (this._ && ev.redraw !== false) (0, this._)()
		if (result === false) {
			ev.preventDefault()
			ev.stopPropagation()
		}
	}

	//event
	function updateEvent(vnode, key, value) {
		if (vnode.events != null) {
			if (vnode.events[key] === value) return
			if (value != null && (typeof value === "function" || typeof value === "object")) {
				if (vnode.events[key] == null) vnode.dom.addEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = value
			} else {
				if (vnode.events[key] != null) vnode.dom.removeEventListener(key.slice(2), vnode.events, false)
				vnode.events[key] = undefined
			}
		} else if (value != null && (typeof value === "function" || typeof value === "object")) {
			vnode.events = new EventDict()
			vnode.dom.addEventListener(key.slice(2), vnode.events, false)
			vnode.events[key] = value
		}
	}

	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") callHook.call(source.oninit, vnode)
		if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		do {
			if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
				var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
				var force = callHook.call(vnode.state.onbeforeupdate, vnode, old)
				if (force !== undefined && !force) break
			}
			return false
		} while (false); // eslint-disable-line no-constant-condition
		vnode.dom = old.dom
		vnode.domSize = old.domSize
		vnode.instance = old.instance
		// One would think having the actual latest attributes would be ideal,
		// but it doesn't let us properly diff based on our current internal
		// representation. We have to save not only the old DOM info, but also
		// the attributes used to create it, as we diff *that*, not against the
		// DOM directly (with a few exceptions in `setAttr`). And, of course, we
		// need to save the children and text as they are conceptually not
		// unlike special "attributes" internally.
		vnode.attrs = old.attrs
		vnode.children = old.children
		vnode.text = old.text
		return true
	}

	return function(dom, vnodes, redraw) {
		if (!dom) throw new TypeError("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = activeElement()
		var namespace = dom.namespaceURI

		// First time rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""

		vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes])
		var prevRedraw = currentRedraw
		try {
			currentRedraw = typeof redraw === "function" ? redraw : undefined
			updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		} finally {
			currentRedraw = prevRedraw
		}
		dom.vnodes = vnodes
		// `document.activeElement` can return null: https://html.spec.whatwg.org/multipage/interaction.html#dom-document-activeelement
		if (active != null && activeElement() !== active && typeof active.focus === "function") active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
}

},{"../render/vnode":"node_modules/mithril/render/vnode.js"}],"node_modules/mithril/render.js":[function(require,module,exports) {
"use strict"

module.exports = require("./render/render")(window)

},{"./render/render":"node_modules/mithril/render/render.js"}],"node_modules/mithril/api/mount-redraw.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")

module.exports = function(render, schedule, console) {
	var subscriptions = []
	var rendering = false
	var pending = false

	function sync() {
		if (rendering) throw new Error("Nested m.redraw.sync() call")
		rendering = true
		for (var i = 0; i < subscriptions.length; i += 2) {
			try { render(subscriptions[i], Vnode(subscriptions[i + 1]), redraw) }
			catch (e) { console.error(e) }
		}
		rendering = false
	}

	function redraw() {
		if (!pending) {
			pending = true
			schedule(function() {
				pending = false
				sync()
			})
		}
	}

	redraw.sync = sync

	function mount(root, component) {
		if (component != null && component.view == null && typeof component !== "function") {
			throw new TypeError("m.mount(element, component) expects a component, not a vnode")
		}

		var index = subscriptions.indexOf(root)
		if (index >= 0) {
			subscriptions.splice(index, 2)
			render(root, [], redraw)
		}

		if (component != null) {
			subscriptions.push(root, component)
			render(root, Vnode(component), redraw)
		}
	}

	return {mount: mount, redraw: redraw}
}

},{"../render/vnode":"node_modules/mithril/render/vnode.js"}],"node_modules/mithril/mount-redraw.js":[function(require,module,exports) {
"use strict"

var render = require("./render")

module.exports = require("./api/mount-redraw")(render, requestAnimationFrame, console)

},{"./render":"node_modules/mithril/render.js","./api/mount-redraw":"node_modules/mithril/api/mount-redraw.js"}],"node_modules/mithril/querystring/build.js":[function(require,module,exports) {
"use strict"

module.exports = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""

	var args = []
	for (var key in object) {
		destructure(key, object[key])
	}

	return args.join("&")

	function destructure(key, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}

},{}],"node_modules/mithril/pathname/assign.js":[function(require,module,exports) {
"use strict"

module.exports = Object.assign || function(target, source) {
	if(source) Object.keys(source).forEach(function(key) { target[key] = source[key] })
}

},{}],"node_modules/mithril/pathname/build.js":[function(require,module,exports) {
"use strict"

var buildQueryString = require("../querystring/build")
var assign = require("./assign")

// Returns `path` from `template` + `params`
module.exports = function(template, params) {
	if ((/:([^\/\.-]+)(\.{3})?:/).test(template)) {
		throw new SyntaxError("Template parameter names *must* be separated")
	}
	if (params == null) return template
	var queryIndex = template.indexOf("?")
	var hashIndex = template.indexOf("#")
	var queryEnd = hashIndex < 0 ? template.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = template.slice(0, pathEnd)
	var query = {}

	assign(query, params)

	var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m, key, variadic) {
		delete query[key]
		// If no such parameter exists, don't interpolate it.
		if (params[key] == null) return m
		// Escape normal parameters, but not variadic ones.
		return variadic ? params[key] : encodeURIComponent(String(params[key]))
	})

	// In case the template substitution adds new query/hash parameters.
	var newQueryIndex = resolved.indexOf("?")
	var newHashIndex = resolved.indexOf("#")
	var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex
	var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex
	var result = resolved.slice(0, newPathEnd)

	if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd)
	if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd)
	var querystring = buildQueryString(query)
	if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring
	if (hashIndex >= 0) result += template.slice(hashIndex)
	if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex)
	return result
}

},{"../querystring/build":"node_modules/mithril/querystring/build.js","./assign":"node_modules/mithril/pathname/assign.js"}],"node_modules/mithril/request/request.js":[function(require,module,exports) {
"use strict"

var buildPathname = require("../pathname/build")

module.exports = function($window, Promise, oncompletion) {
	var callbackCount = 0

	function PromiseProxy(executor) {
		return new Promise(executor)
	}

	// In case the global Promise is some userland library's where they rely on
	// `foo instanceof this.constructor`, `this.constructor.resolve(value)`, or
	// similar. Let's *not* break them.
	PromiseProxy.prototype = Promise.prototype
	PromiseProxy.__proto__ = Promise // eslint-disable-line no-proto

	function makeRequest(factory) {
		return function(url, args) {
			if (typeof url !== "string") { args = url; url = url.url }
			else if (args == null) args = {}
			var promise = new Promise(function(resolve, reject) {
				factory(buildPathname(url, args.params), args, function (data) {
					if (typeof args.type === "function") {
						if (Array.isArray(data)) {
							for (var i = 0; i < data.length; i++) {
								data[i] = new args.type(data[i])
							}
						}
						else data = new args.type(data)
					}
					resolve(data)
				}, reject)
			})
			if (args.background === true) return promise
			var count = 0
			function complete() {
				if (--count === 0 && typeof oncompletion === "function") oncompletion()
			}

			return wrap(promise)

			function wrap(promise) {
				var then = promise.then
				// Set the constructor, so engines know to not await or resolve
				// this as a native promise. At the time of writing, this is
				// only necessary for V8, but their behavior is the correct
				// behavior per spec. See this spec issue for more details:
				// https://github.com/tc39/ecma262/issues/1577. Also, see the
				// corresponding comment in `request/tests/test-request.js` for
				// a bit more background on the issue at hand.
				promise.constructor = PromiseProxy
				promise.then = function() {
					count++
					var next = then.apply(promise, arguments)
					next.then(complete, function(e) {
						complete()
						if (count === 0) throw e
					})
					return wrap(next)
				}
				return promise
			}
		}
	}

	function hasHeader(args, name) {
		for (var key in args.headers) {
			if ({}.hasOwnProperty.call(args.headers, key) && name.test(key)) return true
		}
		return false
	}

	return {
		request: makeRequest(function(url, args, resolve, reject) {
			var method = args.method != null ? args.method.toUpperCase() : "GET"
			var body = args.body
			var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData)
			var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json")

			var xhr = new $window.XMLHttpRequest(), aborted = false
			var original = xhr, replacedAbort
			var abort = xhr.abort

			xhr.abort = function() {
				aborted = true
				abort.call(this)
			}

			xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)

			if (assumeJSON && body != null && !hasHeader(args, /^content-type$/i)) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (typeof args.deserialize !== "function" && !hasHeader(args, /^accept$/i)) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			if (args.timeout) xhr.timeout = args.timeout
			xhr.responseType = responseType

			for (var key in args.headers) {
				if ({}.hasOwnProperty.call(args.headers, key)) {
					xhr.setRequestHeader(key, args.headers[key])
				}
			}

			xhr.onreadystatechange = function(ev) {
				// Don't throw errors on xhr.abort().
				if (aborted) return

				if (ev.target.readyState === 4) {
					try {
						var success = (ev.target.status >= 200 && ev.target.status < 300) || ev.target.status === 304 || (/^file:\/\//i).test(url)
						// When the response type isn't "" or "text",
						// `xhr.responseText` is the wrong thing to use.
						// Browsers do the right thing and throw here, and we
						// should honor that and do the right thing by
						// preferring `xhr.response` where possible/practical.
						var response = ev.target.response, message

						if (responseType === "json") {
							// For IE and Edge, which don't implement
							// `responseType: "json"`.
							if (!ev.target.responseType && typeof args.extract !== "function") response = JSON.parse(ev.target.responseText)
						} else if (!responseType || responseType === "text") {
							// Only use this default if it's text. If a parsed
							// document is needed on old IE and friends (all
							// unsupported), the user should use a custom
							// `config` instead. They're already using this at
							// their own risk.
							if (response == null) response = ev.target.responseText
						}

						if (typeof args.extract === "function") {
							response = args.extract(ev.target, args)
							success = true
						} else if (typeof args.deserialize === "function") {
							response = args.deserialize(response)
						}
						if (success) resolve(response)
						else {
							try { message = ev.target.responseText }
							catch (e) { message = response }
							var error = new Error(message)
							error.code = ev.target.status
							error.response = response
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}

			if (typeof args.config === "function") {
				xhr = args.config(xhr, args, url) || xhr

				// Propagate the `abort` to any replacement XHR as well.
				if (xhr !== original) {
					replacedAbort = xhr.abort
					xhr.abort = function() {
						aborted = true
						replacedAbort.call(this)
					}
				}
			}

			if (body == null) xhr.send()
			else if (typeof args.serialize === "function") xhr.send(args.serialize(body))
			else if (body instanceof $window.FormData) xhr.send(body)
			else xhr.send(JSON.stringify(body))
		}),
		jsonp: makeRequest(function(url, args, resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				resolve(data)
			}
			script.onerror = function() {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
			}
			script.src = url + (url.indexOf("?") < 0 ? "?" : "&") +
				encodeURIComponent(args.callbackKey || "callback") + "=" +
				encodeURIComponent(callbackName)
			$window.document.documentElement.appendChild(script)
		}),
	}
}

},{"../pathname/build":"node_modules/mithril/pathname/build.js"}],"node_modules/mithril/request.js":[function(require,module,exports) {
"use strict"

var PromisePolyfill = require("./promise/promise")
var mountRedraw = require("./mount-redraw")

module.exports = require("./request/request")(window, PromisePolyfill, mountRedraw.redraw)

},{"./promise/promise":"node_modules/mithril/promise/promise.js","./mount-redraw":"node_modules/mithril/mount-redraw.js","./request/request":"node_modules/mithril/request/request.js"}],"node_modules/mithril/querystring/parse.js":[function(require,module,exports) {
"use strict"

module.exports = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)

	var entries = string.split("&"), counters = {}, data = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""

		if (value === "true") value = true
		else if (value === "false") value = false

		var levels = key.split(/\]\[?|\[/)
		var cursor = data
		if (key.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			if (level === "") {
				var key = levels.slice(0, j).join()
				if (counters[key] == null) {
					counters[key] = Array.isArray(cursor) ? cursor.length : 0
				}
				level = counters[key]++
			}
			// Disallow direct prototype pollution
			else if (level === "__proto__") break
			if (j === levels.length - 1) cursor[level] = value
			else {
				// Read own properties exclusively to disallow indirect
				// prototype pollution
				var desc = Object.getOwnPropertyDescriptor(cursor, level)
				if (desc != null) desc = desc.value
				if (desc == null) cursor[level] = desc = isNumber ? [] : {}
				cursor = desc
			}
		}
	}
	return data
}

},{}],"node_modules/mithril/pathname/parse.js":[function(require,module,exports) {
"use strict"

var parseQueryString = require("../querystring/parse")

// Returns `{path, params}` from `url`
module.exports = function(url) {
	var queryIndex = url.indexOf("?")
	var hashIndex = url.indexOf("#")
	var queryEnd = hashIndex < 0 ? url.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/")

	if (!path) path = "/"
	else {
		if (path[0] !== "/") path = "/" + path
		if (path.length > 1 && path[path.length - 1] === "/") path = path.slice(0, -1)
	}
	return {
		path: path,
		params: queryIndex < 0
			? {}
			: parseQueryString(url.slice(queryIndex + 1, queryEnd)),
	}
}

},{"../querystring/parse":"node_modules/mithril/querystring/parse.js"}],"node_modules/mithril/pathname/compileTemplate.js":[function(require,module,exports) {
"use strict"

var parsePathname = require("./parse")

// Compiles a template into a function that takes a resolved path (without query
// strings) and returns an object containing the template parameters with their
// parsed values. This expects the input of the compiled template to be the
// output of `parsePathname`. Note that it does *not* remove query parameters
// specified in the template.
module.exports = function(template) {
	var templateData = parsePathname(template)
	var templateKeys = Object.keys(templateData.params)
	var keys = []
	var regexp = new RegExp("^" + templateData.path.replace(
		// I escape literal text so people can use things like `:file.:ext` or
		// `:lang-:locale` in routes. This is all merged into one pass so I
		// don't also accidentally escape `-` and make it harder to detect it to
		// ban it from template parameters.
		/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
		function(m, key, extra) {
			if (key == null) return "\\" + m
			keys.push({k: key, r: extra === "..."})
			if (extra === "...") return "(.*)"
			if (extra === ".") return "([^/]+)\\."
			return "([^/]+)" + (extra || "")
		}
	) + "$")
	return function(data) {
		// First, check the params. Usually, there isn't any, and it's just
		// checking a static set.
		for (var i = 0; i < templateKeys.length; i++) {
			if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false
		}
		// If no interpolations exist, let's skip all the ceremony
		if (!keys.length) return regexp.test(data.path)
		var values = regexp.exec(data.path)
		if (values == null) return false
		for (var i = 0; i < keys.length; i++) {
			data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1])
		}
		return true
	}
}

},{"./parse":"node_modules/mithril/pathname/parse.js"}],"node_modules/mithril/api/router.js":[function(require,module,exports) {
"use strict"

var Vnode = require("../render/vnode")
var m = require("../render/hyperscript")
var Promise = require("../promise/promise")

var buildPathname = require("../pathname/build")
var parsePathname = require("../pathname/parse")
var compileTemplate = require("../pathname/compileTemplate")
var assign = require("../pathname/assign")

var sentinel = {}

module.exports = function($window, mountRedraw) {
	var fireAsync

	function setPath(path, data, options) {
		path = buildPathname(path, data)
		if (fireAsync != null) {
			fireAsync()
			var state = options ? options.state : null
			var title = options ? options.title : null
			if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path)
			else $window.history.pushState(state, title, route.prefix + path)
		}
		else {
			$window.location.href = route.prefix + path
		}
	}

	var currentResolver = sentinel, component, attrs, currentPath, lastUpdate

	var SKIP = route.SKIP = {}

	function route(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		// 0 = start
		// 1 = init
		// 2 = ready
		var state = 0

		var compiled = Object.keys(routes).map(function(route) {
			if (route[0] !== "/") throw new SyntaxError("Routes must start with a `/`")
			if ((/:([^\/\.-]+)(\.{3})?:/).test(route)) {
				throw new SyntaxError("Route parameter names must be separated with either `/`, `.`, or `-`")
			}
			return {
				route: route,
				component: routes[route],
				check: compileTemplate(route),
			}
		})
		var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
		var p = Promise.resolve()
		var scheduled = false
		var onremove

		fireAsync = null

		if (defaultRoute != null) {
			var defaultData = parsePathname(defaultRoute)

			if (!compiled.some(function (i) { return i.check(defaultData) })) {
				throw new ReferenceError("Default route doesn't match any known routes")
			}
		}

		function resolveRoute() {
			scheduled = false
			// Consider the pathname holistically. The prefix might even be invalid,
			// but that's not our problem.
			var prefix = $window.location.hash
			if (route.prefix[0] !== "#") {
				prefix = $window.location.search + prefix
				if (route.prefix[0] !== "?") {
					prefix = $window.location.pathname + prefix
					if (prefix[0] !== "/") prefix = "/" + prefix
				}
			}
			// This seemingly useless `.concat()` speeds up the tests quite a bit,
			// since the representation is consistently a relatively poorly
			// optimized cons string.
			var path = prefix.concat()
				.replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
				.slice(route.prefix.length)
			var data = parsePathname(path)

			assign(data.params, $window.history.state)

			function fail() {
				if (path === defaultRoute) throw new Error("Could not resolve default route " + defaultRoute)
				setPath(defaultRoute, null, {replace: true})
			}

			loop(0)
			function loop(i) {
				// 0 = init
				// 1 = scheduled
				// 2 = done
				for (; i < compiled.length; i++) {
					if (compiled[i].check(data)) {
						var payload = compiled[i].component
						var matchedRoute = compiled[i].route
						var localComp = payload
						var update = lastUpdate = function(comp) {
							if (update !== lastUpdate) return
							if (comp === SKIP) return loop(i + 1)
							component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
							attrs = data.params, currentPath = path, lastUpdate = null
							currentResolver = payload.render ? payload : null
							if (state === 2) mountRedraw.redraw()
							else {
								state = 2
								mountRedraw.redraw.sync()
							}
						}
						// There's no understating how much I *wish* I could
						// use `async`/`await` here...
						if (payload.view || typeof payload === "function") {
							payload = {}
							update(localComp)
						}
						else if (payload.onmatch) {
							p.then(function () {
								return payload.onmatch(data.params, path, matchedRoute)
							}).then(update, fail)
						}
						else update("div")
						return
					}
				}
				fail()
			}
		}

		// Set it unconditionally so `m.route.set` and `m.route.Link` both work,
		// even if neither `pushState` nor `hashchange` are supported. It's
		// cleared if `hashchange` is used, since that makes it automatically
		// async.
		fireAsync = function() {
			if (!scheduled) {
				scheduled = true
				callAsync(resolveRoute)
			}
		}

		if (typeof $window.history.pushState === "function") {
			onremove = function() {
				$window.removeEventListener("popstate", fireAsync, false)
			}
			$window.addEventListener("popstate", fireAsync, false)
		} else if (route.prefix[0] === "#") {
			fireAsync = null
			onremove = function() {
				$window.removeEventListener("hashchange", resolveRoute, false)
			}
			$window.addEventListener("hashchange", resolveRoute, false)
		}

		return mountRedraw.mount(root, {
			onbeforeupdate: function() {
				state = state ? 2 : 1
				return !(!state || sentinel === currentResolver)
			},
			oncreate: resolveRoute,
			onremove: onremove,
			view: function() {
				if (!state || sentinel === currentResolver) return
				// Wrap in a fragment to preserve existing key semantics
				var vnode = [Vnode(component, attrs.key, attrs)]
				if (currentResolver) vnode = currentResolver.render(vnode[0])
				return vnode
			},
		})
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = "#!"
	route.Link = {
		view: function(vnode) {
			var options = vnode.attrs.options
			// Remove these so they don't get overwritten
			var attrs = {}, onclick, href
			assign(attrs, vnode.attrs)
			// The first two are internal, but the rest are magic attributes
			// that need censored to not screw up rendering.
			attrs.selector = attrs.options = attrs.key = attrs.oninit =
			attrs.oncreate = attrs.onbeforeupdate = attrs.onupdate =
			attrs.onbeforeremove = attrs.onremove = null

			// Do this now so we can get the most current `href` and `disabled`.
			// Those attributes may also be specified in the selector, and we
			// should honor that.
			var child = m(vnode.attrs.selector || "a", attrs, vnode.children)

			// Let's provide a *right* way to disable a route link, rather than
			// letting people screw up accessibility on accident.
			//
			// The attribute is coerced so users don't get surprised over
			// `disabled: 0` resulting in a button that's somehow routable
			// despite being visibly disabled.
			if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
				child.attrs.href = null
				child.attrs["aria-disabled"] = "true"
				// If you *really* do want to do this on a disabled link, use
				// an `oncreate` hook to add it.
				child.attrs.onclick = null
			} else {
				onclick = child.attrs.onclick
				href = child.attrs.href
				child.attrs.href = route.prefix + href
				child.attrs.onclick = function(e) {
					var result
					if (typeof onclick === "function") {
						result = onclick.call(e.currentTarget, e)
					} else if (onclick == null || typeof onclick !== "object") {
						// do nothing
					} else if (typeof onclick.handleEvent === "function") {
						onclick.handleEvent(e)
					}

					// Adapted from React Router's implementation:
					// https://github.com/ReactTraining/react-router/blob/520a0acd48ae1b066eb0b07d6d4d1790a1d02482/packages/react-router-dom/modules/Link.js
					//
					// Try to be flexible and intuitive in how we handle links.
					// Fun fact: links aren't as obvious to get right as you
					// would expect. There's a lot more valid ways to click a
					// link than this, and one might want to not simply click a
					// link, but right click or command-click it to copy the
					// link target, etc. Nope, this isn't just for blind people.
					if (
						// Skip if `onclick` prevented default
						result !== false && !e.defaultPrevented &&
						// Ignore everything but left clicks
						(e.button === 0 || e.which === 0 || e.which === 1) &&
						// Let the browser handle `target=_blank`, etc.
						(!e.currentTarget.target || e.currentTarget.target === "_self") &&
						// No modifier keys
						!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
					) {
						e.preventDefault()
						e.redraw = false
						route.set(href, null, options)
					}
				}
			}
			return child
		},
	}
	route.param = function(key) {
		return attrs && key != null ? attrs[key] : attrs
	}

	return route
}

},{"../render/vnode":"node_modules/mithril/render/vnode.js","../render/hyperscript":"node_modules/mithril/render/hyperscript.js","../promise/promise":"node_modules/mithril/promise/promise.js","../pathname/build":"node_modules/mithril/pathname/build.js","../pathname/parse":"node_modules/mithril/pathname/parse.js","../pathname/compileTemplate":"node_modules/mithril/pathname/compileTemplate.js","../pathname/assign":"node_modules/mithril/pathname/assign.js"}],"node_modules/mithril/route.js":[function(require,module,exports) {
"use strict"

var mountRedraw = require("./mount-redraw")

module.exports = require("./api/router")(window, mountRedraw)

},{"./mount-redraw":"node_modules/mithril/mount-redraw.js","./api/router":"node_modules/mithril/api/router.js"}],"node_modules/mithril/index.js":[function(require,module,exports) {
"use strict"

var hyperscript = require("./hyperscript")
var request = require("./request")
var mountRedraw = require("./mount-redraw")

var m = function m() { return hyperscript.apply(this, arguments) }
m.m = hyperscript
m.trust = hyperscript.trust
m.fragment = hyperscript.fragment
m.mount = mountRedraw.mount
m.route = require("./route")
m.render = require("./render")
m.redraw = mountRedraw.redraw
m.request = request.request
m.jsonp = request.jsonp
m.parseQueryString = require("./querystring/parse")
m.buildQueryString = require("./querystring/build")
m.parsePathname = require("./pathname/parse")
m.buildPathname = require("./pathname/build")
m.vnode = require("./render/vnode")
m.PromisePolyfill = require("./promise/polyfill")

module.exports = m

},{"./hyperscript":"node_modules/mithril/hyperscript.js","./request":"node_modules/mithril/request.js","./mount-redraw":"node_modules/mithril/mount-redraw.js","./route":"node_modules/mithril/route.js","./render":"node_modules/mithril/render.js","./querystring/parse":"node_modules/mithril/querystring/parse.js","./querystring/build":"node_modules/mithril/querystring/build.js","./pathname/parse":"node_modules/mithril/pathname/parse.js","./pathname/build":"node_modules/mithril/pathname/build.js","./render/vnode":"node_modules/mithril/render/vnode.js","./promise/polyfill":"node_modules/mithril/promise/polyfill.js"}],"src/common/events.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emit = exports.allOff = exports.off = exports.on = exports.EV_DEBUGLOG = exports.EV_INTERACTION = exports.EV_SCENECHANGE = exports.EV_CONVOCHOICE = exports.EV_CONVONEXT = exports.EV_CONVOEND = exports.EV_CONVOSTART = void 0;

var _kontra = require("kontra");

var EV_CONVOSTART = "ev.convoStart";
exports.EV_CONVOSTART = EV_CONVOSTART;
var EV_CONVOEND = "ev.convoEnd";
exports.EV_CONVOEND = EV_CONVOEND;
var EV_CONVONEXT = "ev.convoNext";
exports.EV_CONVONEXT = EV_CONVONEXT;
var EV_CONVOCHOICE = "ev.convoChoice";
exports.EV_CONVOCHOICE = EV_CONVOCHOICE;
var EV_SCENECHANGE = "ev.sceneChange";
exports.EV_SCENECHANGE = EV_SCENECHANGE;
var EV_INTERACTION = "ev.onInteraction";
exports.EV_INTERACTION = EV_INTERACTION;
var EV_DEBUGLOG = "ev.debugLog";
exports.EV_DEBUGLOG = EV_DEBUGLOG;
var registry = {};

var on = function on(e, fn) {
  registry[e] = fn;
  (0, _kontra.on)(e, registry[e]);
};

exports.on = on;

var off = function off(e, fn) {
  return (0, _kontra.off)(e, fn);
};

exports.off = off;

var allOff = function allOff() {
  var ignoreList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return Object.keys(registry).map(function (k) {
    return !ignoreList.some(function (str) {
      return str === k;
    }) && off(k, registry[k]);
  });
};

exports.allOff = allOff;

var emit = function emit(e) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return (0, _kontra.emit)(e, args);
};

exports.emit = emit;
},{"kontra":"node_modules/kontra/kontra.mjs"}],"src/ui/ui.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mithril = _interopRequireDefault(require("mithril"));

var _events = require("../common/events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var typeWriter = function typeWriter(_ref) {
  var text = _ref.text,
      _ref$onTyped = _ref.onTyped,
      onTyped = _ref$onTyped === void 0 ? function (str) {} : _ref$onTyped,
      _ref$onFinished = _ref.onFinished,
      onFinished = _ref$onFinished === void 0 ? function () {} : _ref$onFinished;
  var animId = "";
  var str = "";

  var t = function t() {
    var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (i > text.length) {
      cancelAnimationFrame(animId);
      onFinished();
      return;
    }

    str = s + text.charAt(i);
    i += 1;
    onTyped(str);
    requestAnimationFrame(function () {
      return t(str, i);
    });
  };

  return {
    start: function start() {
      return animId = requestAnimationFrame(function () {
        return t();
      });
    }
  };
};

var Shell = function Shell(_ref2) {
  var attrs = _ref2.attrs;
  var debugText = [];
  var isTyping = false;
  var name = "";
  var text = "";
  var choices = [];
  var actors = [];

  var onConvoStart = function onConvoStart(_ref3) {
    var startId = _ref3.startId,
        currentActors = _ref3.currentActors;
    if (isTyping) return;
    isTyping = true;
    actors = currentActors;
    var props = attrs.conversationManager.start(startId);
    if (!props) return;
    var actorName = props.actor ? actors.find(function (x) {
      return props.actor === x.id;
    }).name : null;
    name = actorName;
    text = "";
    choices = []; // Apparently this needs to be forced (will double check)

    _mithril.default.redraw(); // Start typewriter effect


    typeWriter({
      text: props.text,
      onTyped: function onTyped(str) {
        text = str;

        _mithril.default.redraw();
      },
      onFinished: function onFinished() {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];

        _mithril.default.redraw();
      }
    }).start();
  };

  var onConvoNext = function onConvoNext() {
    if (isTyping) return;
    isTyping = true;
    var props = attrs.conversationManager.goToNext();
    if (!props) return;
    var actorName = props.actor ? actors.find(function (x) {
      return props.actor === x.id;
    }).name : null;
    name = actorName;
    text = "";
    choices = []; // Apparently this needs to be forced (will double check)

    _mithril.default.redraw(); // Start typewriter effect


    typeWriter({
      text: props.text,
      onTyped: function onTyped(str) {
        text = str;

        _mithril.default.redraw();
      },
      onFinished: function onFinished() {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];

        _mithril.default.redraw();
      }
    }).start();
  };

  var onChoiceSelected = function onChoiceSelected(choice) {
    if (isTyping) return;
    isTyping = true;
    var props = attrs.conversationManager.goToExact(choice.to);
    if (!props) return;
    var actorName = props.actor ? actors.find(function (x) {
      return props.actor === x.id;
    }).name : null;
    name = actorName;
    text = "";
    choices = []; // Apparently this needs to be forced (will double check)

    _mithril.default.redraw(); // Start typewriter effect


    typeWriter({
      text: props.text,
      onTyped: function onTyped(str) {
        text = str;

        _mithril.default.redraw();
      },
      onFinished: function onFinished() {
        isTyping = false;
        choices = props.choices.length ? props.choices : [];

        _mithril.default.redraw();
      }
    }).start();
  };

  var onConvoEnd = function onConvoEnd() {
    isTyping = false;
    name = "";
    text = "";
    choices = [];
    actors = [];

    _mithril.default.redraw();
  };

  var onDebugLog = function onDebugLog(output) {
    var clearPrevious = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    debugText = clearPrevious ? [output] : [].concat(_toConsumableArray(debugText), [output]);

    _mithril.default.redraw();
  };

  return {
    oninit: function oninit() {
      console.log("UI initialized.");
      (0, _events.on)(_events.EV_CONVOSTART, onConvoStart);
      (0, _events.on)(_events.EV_CONVONEXT, onConvoNext);
      (0, _events.on)(_events.EV_CONVOEND, onConvoEnd);
      (0, _events.on)(_events.EV_DEBUGLOG, onDebugLog);
    },
    view: function view() {
      return (0, _mithril.default)("div", {
        class: "uiShell"
      }, [text && (0, _mithril.default)("div", {
        class: "dialogueBoxOuter"
      }, [(0, _mithril.default)("div", {
        class: "dialogue"
      }, [(0, _mithril.default)("span", name ? "".concat(name, ":") : ""), (0, _mithril.default)("span", name ? "\"".concat(text, "\"") : text), (0, _mithril.default)("div", {
        class: "choiceWindow"
      }, choices.map(function (choice) {
        return (0, _mithril.default)("button", {
          class: "choiceBox",
          onclick: function onclick() {
            return onChoiceSelected(choice);
          }
        }, choice.text);
      })), isTyping ? "" : (0, _mithril.default)("span", {
        class: "arrow"
      })])]), (0, _mithril.default)("div", {
        class: "debugWindow"
      }, [debugText.map(function (s) {
        return (0, _mithril.default)("span", s);
      }), (0, _mithril.default)("span", {
        class: "cursor4"
      }, "_")])]);
    }
  };
};

var _default = function _default() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    conversationManager: conversationManager,
    sprites: sprites,
    onConversationChoice: function onConversationChoice() {}
  };
  return {
    start: function start() {
      return _mithril.default.mount(document.getElementById("ui"), {
        view: function view() {
          return (0, _mithril.default)(Shell, props);
        }
      });
    }
  };
};

exports.default = _default;
},{"mithril":"node_modules/mithril/index.js","../common/events":"src/common/events.js"}],"src/sprites/spriteFunctions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flipSprite = exports.moveSprite = void 0;

var moveSprite = function moveSprite(_ref) {
  var dir = _ref.dir,
      sprite = _ref.sprite,
      _ref$checkCollision = _ref.checkCollision,
      checkCollision = _ref$checkCollision === void 0 ? function () {
    return false;
  } : _ref$checkCollision;

  /* Normalise so you don't go super fast diagonally */
  var dirLength = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
  var directionNormal = {
    x: dir.x !== 0 ? dir.x / dirLength : 0,
    y: dir.y !== 0 ? dir.y / dirLength : 0
  }; /// For collisions with tiles

  var oldPos = {
    x: sprite.x,
    y: sprite.y
  }; // Move X then check X (careful editing directly, might lead to issues with camera)

  sprite.x += directionNormal.x; // Collider check (const layer names please)

  var collidedWithX = checkCollision(sprite);

  if (sprite.collidesWithTiles && collidedWithX) {
    sprite.x = oldPos.x;
    sprite.y = oldPos.y;
  } // Update old pos ref


  oldPos = {
    x: sprite.x,
    y: sprite.y
  }; // Move Y then check Y (careful editing directly, might lead to issues with camera)

  sprite.y += directionNormal.y; // Collider check against tiles

  var collidedWithY = checkCollision(sprite);

  if (sprite.collidesWithTiles && collidedWithY) {
    sprite.x = oldPos.x;
    sprite.y = oldPos.y;
  }

  return {
    directionNormal: directionNormal
  };
};

exports.moveSprite = moveSprite;

var flipSprite = function flipSprite(_ref2) {
  var direction = _ref2.direction,
      sprite = _ref2.sprite;

  if (direction.x < 0) {
    sprite.width = -sprite.width;
  } else if (direction.x > 0) {
    sprite.width = sprite.width;
  }
};

exports.flipSprite = flipSprite;
},{}],"src/sprites/entity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _spriteFunctions = require("./spriteFunctions");

var _default = function _default(_ref) {
  var id = _ref.id,
      assetId = _ref.assetId,
      x = _ref.x,
      y = _ref.y,
      _ref$z = _ref.z,
      z = _ref$z === void 0 ? 1 : _ref$z,
      name = _ref.name,
      tileEngine = _ref.tileEngine,
      _ref$movementDisabled = _ref.movementDisabled,
      movementDisabled = _ref$movementDisabled === void 0 ? false : _ref$movementDisabled,
      _ref$controlledByUser = _ref.controlledByUser,
      controlledByUser = _ref$controlledByUser === void 0 ? false : _ref$controlledByUser,
      _ref$collidesWithTile = _ref.collidesWithTiles,
      collidesWithTiles = _ref$collidesWithTile === void 0 ? true : _ref$collidesWithTile,
      _ref$customProperties = _ref.customProperties,
      customProperties = _ref$customProperties === void 0 ? {} : _ref$customProperties,
      _ref$dataKey = _ref.dataKey,
      dataKey = _ref$dataKey === void 0 ? "assets/gameData/entityData.json" : _ref$dataKey;

  if (!id || !assetId) {
    throw new Error("Entity is fairly useless without an id, you should add one.");
  }

  var entityData = _kontra.dataAssets[dataKey];

  var _entityData$find = entityData.find(function (ent) {
    return ent.id === assetId;
  }),
      animations = _entityData$find.animations,
      type = _entityData$find.type,
      frameWidth = _entityData$find.frameWidth,
      frameHeight = _entityData$find.frameHeight,
      sheet = _entityData$find.sheet,
      _entityData$find$coll = _entityData$find.collisionBodyOptions,
      collisionBodyOptions = _entityData$find$coll === void 0 ? null : _entityData$find$coll,
      _entityData$find$manu = _entityData$find.manualAnimation,
      manualAnimation = _entityData$find$manu === void 0 ? false : _entityData$find$manu;

  var spriteSheet = (0, _kontra.SpriteSheet)({
    image: _kontra.imageAssets[sheet],
    frameWidth: frameWidth,
    frameHeight: frameHeight,
    animations: animations
  });
  var sprite = (0, _kontra.Sprite)({
    type: type,
    id: id,
    name: name,
    x: x,
    y: y,
    z: z,
    customProperties: customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles: collidesWithTiles,
    controlledByUser: controlledByUser,
    collisionBodyOptions: collisionBodyOptions,
    manualAnimation: manualAnimation,
    movementDisabled: movementDisabled,
    update: function update() {
      /* Attacking */
      if ((0, _kontra.keyPressed)("q")) {}
      /*
      For attacking, going full throttle with a turn-based system is quite a lot
      to handle. For now it'd be easier to settle for arcade sort of attacks and
      being clever with patterns / interaction such as seen on Zelda.
        So that said, what general idea is this:
      - Hitbox appears, probably with an animation in sync with it
      - Collision picked up when hitbox hits whatever the thing is
      - The thing that's hit get informed of the hit, and as to what actually
      hit it. If the thing is hostile (no friendly-fire), we search for the item in
      question and run against its stats.
      - It's a lot to calculate on the hit, but it has to be done at some point. After
      that the damage animation plays on the target, and so on. Let the entity handle
      what happens to it under circumstances such as if it's locked in animation, etc.
      - The attacker can just worry about its self and what it's doing with attack and
      animations.
      */

      /* Movement */


      var dir = controlledByUser ? {
        x: (0, _kontra.keyPressed)("a") ? -1 : (0, _kontra.keyPressed)("d") ? 1 : 0,
        y: (0, _kontra.keyPressed)("w") ? -1 : (0, _kontra.keyPressed)("s") ? 1 : 0
      } : {
        x: 0,
        y: 0
      }; // AI (to add later)

      var _moveSprite = (0, _spriteFunctions.moveSprite)({
        dir: sprite.movementDisabled ? {
          x: 0,
          y: 0
        } : dir,
        sprite: sprite,
        checkCollision: function checkCollision(sprite) {
          return tileEngine.layerCollidesWith("Collision", sprite);
        }
      }),
          directionNormal = _moveSprite.directionNormal; // Flip the sprite on movement


      (0, _spriteFunctions.flipSprite)({
        direction: directionNormal,
        sprite: sprite
      }); // Do some animations

      var isMoving = directionNormal.x !== 0 || directionNormal.y !== 0;

      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      } // Call this to ensure animations are player


      sprite.advance();
    }
  });
  console.log("=> Sprite generated:", sprite.name, sprite.id);
  console.log(sprite);
  return sprite;
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","./spriteFunctions":"src/sprites/spriteFunctions.js"}],"src/common/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = exports.circleCollision = exports.vmulti = exports.between = exports.uniqueId = void 0;

var _events = require("../common/events");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var uniqueId = function uniqueId() {
  var pre = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return "".concat(pre).concat(pre.length ? "_" : "") + (Number(String(Math.random()).slice(2)) + Date.now() + Math.round(performance.now())).toString(36);
};

exports.uniqueId = uniqueId;

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
  var destroyOnHit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!collider.radius) {
    console.error("Cannot detect collisions without radius property.");
  }

  return targets.filter(function (target) {
    var offsets = target.collisionBodyOptions ? {
      x: target.collisionBodyOptions.offsetX ? target.x + target.collisionBodyOptions.offsetX : target.x,
      y: target.collisionBodyOptions.offsetY ? target.y + target.collisionBodyOptions.offsetY : target.y
    } : {
      x: target.x,
      y: target.y
    };
    var dx = offsets.x - collider.x;
    var dy = offsets.y - collider.y; // You might be seeing results from two perspectives. I'd ensure that it only comes from one in the case of
    // a door.

    console.log(Math.sqrt(dx * dx + dy * dy));

    if (Math.sqrt(dx * dx + dy * dy) < target.radius + collider.width) {
      target.ttl = destroyOnHit ? 0 : target.ttl;
      return target;
    }
  });
};

exports.circleCollision = circleCollision;

var debug = function debug(o) {
  console.info(o);
  (0, _events.emit)(_events.EV_DEBUGLOG, o);
};

exports.debug = debug;
},{"../common/events":"src/common/events.js"}],"src/common/consts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENTITY_TYPE = void 0;
var ENTITY_TYPE = {
  PICKUP: 0,
  NPC: 1,
  ENEMY: 2,
  SWITCH: 3,
  DOOR: 4,
  CONTAINER: 5,
  ENTRANCE: 6,
  PLAYER: 99
};
exports.ENTITY_TYPE = ENTITY_TYPE;
},{}],"src/input/onPush.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _default = function _default(key) {
  var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var pushed = false;
  return function (props) {
    if (!pushed && (0, _kontra.keyPressed)(key)) {
      cb(props);
      pushed = true;
    } else if (pushed && !(0, _kontra.keyPressed)("e")) {
      pushed = false;
    }
  };
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs"}],"src/states/startConvo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _onPush = _interopRequireDefault(require("../input/onPush"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var id = _ref.id,
      _ref$onEntry = _ref.onEntry,
      onEntry = _ref$onEntry === void 0 ? function () {} : _ref$onEntry,
      _ref$onExit = _ref.onExit,
      onExit = _ref$onExit === void 0 ? function () {} : _ref$onExit,
      _ref$onNext = _ref.onNext,
      onNext = _ref$onNext === void 0 ? function () {} : _ref$onNext;
  var _isComplete = false;
  var onInteractionPushed = (0, _onPush.default)("e", function () {
    return onNext();
  });
  return {
    id: id,
    isComplete: function isComplete() {
      return _isComplete;
    },
    enter: function enter(props) {
      return onEntry();
    },
    update: function update() {
      return onInteractionPushed();
    },
    exit: function exit() {
      return onExit();
    }
  };
};

exports.default = _default;
},{"../input/onPush":"src/input/onPush.js"}],"src/states/fieldState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _onPush = _interopRequireDefault(require("../input/onPush"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var id = _ref.id,
      sprites = _ref.sprites,
      reactionManager = _ref.reactionManager,
      _ref$onEntry = _ref.onEntry,
      onEntry = _ref$onEntry === void 0 ? function () {} : _ref$onEntry,
      _ref$onExit = _ref.onExit,
      onExit = _ref$onExit === void 0 ? function () {} : _ref$onExit;
  var _isComplete = false;
  var interactionCooldown = false;
  /* TODO: Use consts on keys also */

  var onInteractionPushed = (0, _onPush.default)("e", function (_ref2) {
    var origin = _ref2.origin,
        _ref2$collisions = _ref2.collisions,
        collisions = _ref2$collisions === void 0 ? [] : _ref2$collisions;

    if (collisions.length && origin.controlledByUser) {
      if (!interactionCooldown) {
        var firstAvailable = collisions[0];
        var reactionData = reactionManager.get(firstAvailable.type);
        /* Not all things will have a reaction set, plus they might expect
        different properties to be passed in future. */

        if (reactionData) {
          reactionData.reactionEvent(firstAvailable, sprites);
        }
      } else {
        interactionCooldown = false;
      }
    }
  });
  return {
    id: id,
    isComplete: function isComplete() {
      return _isComplete;
    },
    enter: function enter(props) {
      return onEntry();
    },
    update: function update(props) {
      return onInteractionPushed(props);
    },
    exit: function exit() {
      return onExit();
    }
  };
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","../input/onPush":"src/input/onPush.js"}],"src/states/curtainState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_ref) {
  var id = _ref.id,
      ctx = _ref.ctx,
      _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 1 : _ref$direction,
      _ref$onFadeComplete = _ref.onFadeComplete,
      onFadeComplete = _ref$onFadeComplete === void 0 ? function () {} : _ref$onFadeComplete;
  // https://stackoverflow.com/questions/19258169/fadein-fadeout-in-html5-canvas
  var _isComplete = false;
  var alpha = direction < 0 ? 1 : 0,
      delta = 0.05;
  ctx.globalAlpha = direction < 0 ? 1 : 0;
  return {
    id: id,
    isComplete: function isComplete() {
      return _isComplete;
    },
    enter: function enter(props) {},
    update: function update() {
      _isComplete = direction > 0 && alpha >= 1 || direction < 0 && alpha <= -1;
      alpha = direction < 0 ? alpha - delta : alpha + delta;
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      ctx.globalAlpha = _isComplete ? Math.round(alpha) : alpha;
    },
    exit: function exit() {
      ctx.globalAlpha = direction < 0 ? 0 : 1;
      onFadeComplete();
    }
  };
};

exports.default = _default;
},{}],"src/managers/sceneManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_ref) {
  var Scene = _ref.sceneObject;
  var currentScene = null;
  return {
    loadScene: function loadScene(props) {
      if (currentScene) currentScene.stop();
      currentScene = Scene(props);
      currentScene.start();
    }
  };
};

exports.default = _default;
},{}],"src/managers/worldManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _entity = _interopRequireDefault(require("../sprites/entity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    dataKey: "assets/gameData/worldData.json"
  };
  var dataKey = options.dataKey;
  var worldData = _kontra.dataAssets[dataKey];
  var entitiesInStore = (0, _kontra.getStoreItem)("entities");

  var getEntityFromStore = function getEntityFromStore(id) {
    return entitiesInStore ? entitiesInStore.find(function (e) {
      return e.id === id;
    }) : null;
  };

  return {
    resetEntityStates: function resetEntityStates() {
      return (0, _kontra.setStoreItem)("entities", []);
    },
    saveEntityState: function saveEntityState(entityData) {
      var id = entityData.id,
          ttl = entityData.ttl;
      var existingEntities = (0, _kontra.getStoreItem)("entities");
      (0, _kontra.setStoreItem)("entities", existingEntities ? existingEntities.filter(function (ent) {
        return ent.id !== id;
      }).concat([{
        id: id,
        ttl: ttl
      }]) : [{
        id: id,
        ttl: ttl
      }]);
    },
    createWorld: function createWorld(_ref) {
      var areaId = _ref.areaId;

      var _worldData$find = worldData.find(function (x) {
        return x.id === areaId;
      }),
          entities = _worldData$find.entities,
          mapKey = _worldData$find.mapKey;

      var map = _kontra.dataAssets[mapKey];
      var tileEngine = (0, _kontra.TileEngine)(map);
      return {
        mapKey: mapKey,
        tileEngine: tileEngine,
        loadedEntities: entities.map(function (entity) {
          var id = entity.id;
          var exists = getEntityFromStore(id);
          return !exists || exists && exists.ttl > 0 ? (0, _entity.default)(_objectSpread({}, entity, {
            tileEngine: tileEngine
          })) : null;
        }).filter(function (e) {
          return e;
        })
      };
    }
  };
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","../sprites/entity":"src/sprites/entity.js"}],"src/common/conversationIterator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(_ref) {
  var conversationData = _ref.conversationData,
      _ref$onChatStarted = _ref.onChatStarted,
      onChatStarted = _ref$onChatStarted === void 0 ? function (node, props) {} : _ref$onChatStarted,
      _ref$onChatNext = _ref.onChatNext,
      onChatNext = _ref$onChatNext === void 0 ? function (node, props) {} : _ref$onChatNext,
      _ref$onChatComplete = _ref.onChatComplete,
      onChatComplete = _ref$onChatComplete === void 0 ? function (lastPositionSaved) {} : _ref$onChatComplete,
      _ref$onChainProgress = _ref.onChainProgress,
      onChainProgress = _ref$onChainProgress === void 0 ? function (lastNodeId) {} : _ref$onChainProgress,
      _ref$onChatCancelled = _ref.onChatCancelled,
      onChatCancelled = _ref$onChatCancelled === void 0 ? function () {} : _ref$onChatCancelled;
  var index = 0;
  var currentNode = conversationData[index];
  var isRunning = false;
  var _isComplete = false;

  var displayNode = function displayNode(queriedNode) {
    if (queriedNode) {
      currentNode = queriedNode;
      index = queriedNode.index;
      return queriedNode;
    } else {
      throw "No node match.";
    }
  };

  var queryNode = function queryNode(query) {
    var queriedNode = conversationData.length ? conversationData.filter(function (node) {
      return query === node.id;
    })[0] : null;
    return displayNode(queriedNode);
  };

  var start = function start(query) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var queriedNode = queryNode(query);
    isRunning = true;
    _isComplete = false;
    onChatStarted(queriedNode, props);
    return displayNode(queriedNode);
  };

  var goToExact = function goToExact(query) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var queriedNode = queryNode(query);
    onChatNext(queriedNode, props);
    return displayNode(queriedNode);
  };

  var goToNext = function goToNext() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // We need to run this 'after' the finish so it avoids chained exec on exit.
    if (!isRunning) return;

    if (_isComplete) {
      isRunning = false;
      return;
    } // TODO: Beware, if you're not checking for existent choices, this will error out,
    // or do something a little funky. May want to check for choices here instead?


    var _currentNode = currentNode,
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
        onChainProgress(id);
      }

      if (actions.some(function (action) {
        return action === "cancel";
      })) {
        onChatCancelled();
      }

      _isComplete = true;
      onChatComplete(id);
      console.log("End reached, close the convo.");
      return;
    }

    return goToExact(to, props);
  };

  return {
    isComplete: function isComplete() {
      return _isComplete;
    },
    currentIndex: function currentIndex() {
      return index;
    },
    start: start,
    goToExact: goToExact,
    goToNext: goToNext
  };
};

exports.default = _default;
},{}],"src/managers/conversationManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _events = require("../common/events");

var _conversationIterator = _interopRequireDefault(require("../common/conversationIterator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    dataKey: "assets/gameData/conversationData.json"
  };
  var dataKey = options.dataKey;
  var conversationData = _kontra.dataAssets[dataKey]; // TODO: Make sure this is working as a singleton pattern

  return (0, _conversationIterator.default)({
    conversationData: conversationData,
    onChatStarted: function onChatStarted(node) {
      var passedProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return (0, _events.emit)(_events.EV_CONVOSTART, {
        node: node,
        passedProps: passedProps
      });
    },
    onChatNext: function onChatNext(node) {
      var passedProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return (0, _events.emit)(_events.EV_CONVONEXT, {
        node: node,
        passedProps: passedProps
      });
    },
    onChatComplete: function onChatComplete(exitId) {
      return (0, _events.emit)(_events.EV_CONVOEND, {
        exitId: exitId
      });
    },
    onChainProgress: function onChainProgress(lastNodeId) {
      (0, _kontra.setStoreItem)("progress", {
        storyProgress: lastNodeId
      });
    }
  });
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","../common/events":"src/common/events.js","../common/conversationIterator":"src/common/conversationIterator.js"}],"src/managers/reactionManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  var reactions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return {
    get: function get(type) {
      return reactions.find(function (reaction) {
        return reaction.type === type;
      });
    }
  };
};

exports.default = _default;
},{}],"src/managers/stateManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  var states = [];

  var top = function top(arr) {
    return arr[arr.length - 1];
  };

  return {
    push: function push(state, props) {
      if (!states.some(function (s) {
        return s.id === state.id;
      })) {
        states.push(state);
        top(states).enter(props);
      }
    },
    update: function update(props) {
      var currentState = top(states);
      if (!currentState) return;
      currentState.update(props);

      if (currentState.isComplete()) {
        currentState.exit();
        states.pop();
      }
    },
    pop: function pop() {
      var currentState = top(states);
      currentState.exit();
      states.pop();
    }
  };
};

exports.default = _default;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _kontra = require("kontra");

var _ui = _interopRequireDefault(require("./ui/ui"));

var _entity = _interopRequireDefault(require("./sprites/entity"));

var _helpers = require("./common/helpers");

var _consts = require("./common/consts");

var _events = require("./common/events");

var _startConvo = _interopRequireDefault(require("./states/startConvo"));

var _fieldState = _interopRequireDefault(require("./states/fieldState"));

var _curtainState = _interopRequireDefault(require("./states/curtainState"));

var _sceneManager = _interopRequireDefault(require("./managers/sceneManager"));

var _worldManager = _interopRequireDefault(require("./managers/worldManager"));

var _conversationManager = _interopRequireDefault(require("./managers/conversationManager"));

var _reactionManager = _interopRequireDefault(require("./managers/reactionManager"));

var _stateManager = _interopRequireDefault(require("./managers/stateManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* Canvas initialization */
var _init = (0, _kontra.init)(),
    canvas = _init.canvas;

var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
ctx.scale(3, 3);
/* Primary field scene */

var FieldScene = function FieldScene(_ref) {
  var areaId = _ref.areaId;

  /* World creation */
  var _WorldManager = (0, _worldManager.default)(),
      createWorld = _WorldManager.createWorld,
      saveEntityState = _WorldManager.saveEntityState;

  var _createWorld = createWorld({
    areaId: areaId
  }),
      loadedEntities = _createWorld.loadedEntities,
      tileEngine = _createWorld.tileEngine;
  /* Dialogue creation */


  var conversationManager = (0, _conversationManager.default)();
  /* Main states creation */

  var sceneStateMachine = (0, _stateManager.default)();
  var screenEffectsStateMachine = (0, _stateManager.default)();
  /* All but the player are generated here */

  var playerStart = loadedEntities.find(function (x) {
    return x.id === "entranceMarker";
  });
  var player = (0, _entity.default)({
    x: playerStart ? playerStart.x : 128,
    y: playerStart ? playerStart.y : 128,
    name: "Player",
    id: "player",
    assetId: "player",
    controlledByUser: true,
    tileEngine: tileEngine
  });
  /* Sprites collection for easier render / updates */

  var sprites = [player].concat(_toConsumableArray(loadedEntities));
  /* Decide what happens on different player interaction events (was separated, seemed pointless at this stage) */

  var reactionManager = (0, _reactionManager.default)([{
    type: _consts.ENTITY_TYPE.DOOR,
    reactionEvent: function reactionEvent(firstAvailable) {
      // TODO: Entities should manage their own animations (same problem seen elsewhere)
      firstAvailable.playAnimation("open");
      screenEffectsStateMachine.push((0, _curtainState.default)({
        id: "curtain",
        ctx: ctx,
        direction: -1,
        onFadeComplete: function onFadeComplete() {
          (0, _events.allOff)([_events.EV_SCENECHANGE]);
          (0, _events.emit)(_events.EV_SCENECHANGE, {
            areaId: firstAvailable.customProperties.goesTo
          });
        }
      }));
    }
  }, {
    type: _consts.ENTITY_TYPE.PICKUP,
    reactionEvent: function reactionEvent(firstAvailable) {
      firstAvailable.ttl = 0;
      saveEntityState(firstAvailable);
    }
  }, {
    type: _consts.ENTITY_TYPE.NPC,
    reactionEvent: function reactionEvent(firstAvailable, sprites) {
      return sceneStateMachine.push((0, _startConvo.default)({
        id: "conversation",
        onNext: function onNext(props) {
          return (0, _events.emit)(_events.EV_CONVONEXT);
        },
        // Note: should only effect current actors, not all sprites!
        onExit: function onExit() {
          return sprites.map(function (spr) {
            return spr.movementDisabled = false;
          });
        },
        onEntry: function onEntry(props) {
          (0, _events.emit)(_events.EV_CONVOSTART, {
            startId: "m1",
            currentActors: sprites
          });
          sprites.map(function (spr) {
            return spr.movementDisabled = true;
          });
        }
      }), {
        currentActors: sprites.find(function (spr) {
          return spr.id === firstAvailable.id;
        })
      });
    }
  }]);
  /* Bootstrap some states for when the scene loads */

  sceneStateMachine.push((0, _fieldState.default)({
    id: "field",
    sprites: sprites,
    tileEngine: tileEngine,
    reactionManager: reactionManager
  }));
  screenEffectsStateMachine.push((0, _curtainState.default)({
    id: "curtain",
    ctx: ctx,
    direction: 1
  }));
  /* Scene events */

  (0, _events.on)(_events.EV_CONVOEND, function () {
    return sceneStateMachine.pop();
  });
  /* Finally, enable the UI (TODO: Double check this is clearing properly) */

  (0, _ui.default)({
    conversationManager: conversationManager,
    sprites: sprites
  }).start();
  /* Primary loop */

  return (0, _kontra.GameLoop)({
    update: function update() {
      var collisions = [];
      /* Check for anything dead (GC does the rest) */

      sprites = sprites.filter(function (spr) {
        return spr.isAlive();
      });
      /* Add a flag to sprite to enable/disable collision checks */

      sprites.map(function (sprite) {
        sprite.update();
        /* This is a bit flawed as we check for collision events on every sprite when in reality we only need it
        for say the player. Or, more to the point, only certain collisions apply in certain contexts. If a player walks to
        a door, we only need for the player to detect the collision and trigger an action. The door can just be a prop. */

        var collidingWith = (0, _helpers.circleCollision)(sprite, sprites.filter(function (s) {
          return s.id !== sprite.id;
        }));
        sprite.isColliding = collidingWith.length > 0;

        if (sprite.isColliding) {
          collisions.push(sprite);
        }
      });
      /* This would be a great place to sort by distance also (todo later). */

      sceneStateMachine.update({
        origin: player,
        collisions: collisions.filter(function (c) {
          return c.id !== player.id;
        })
      });
    },
    render: function render() {
      tileEngine.render();
      /* Edit z-order based on 'y' then change render order */

      sprites.sort(function (a, b) {
        return Math.round(a.y - a.z) - Math.round(b.y - b.z);
      }).forEach(function (sprite) {
        return sprite.render();
      });
      screenEffectsStateMachine.update();
    }
  });
};
/* Make sure to embed your tilesets or it'll run in to problems,
TODO: Can we also const the dataKeys across the board plz. */


(0, _kontra.load)("assets/tileimages/test.png", "assets/tiledata/test.json", "assets/entityimages/little_devil.png", "assets/entityimages/little_orc.png", "assets/gameData/conversationData.json", "assets/gameData/entityData.json", "assets/gameData/worldData.json").then(function (assets) {
  (0, _kontra.initKeys)();
  var sceneManager = (0, _sceneManager.default)({
    sceneObject: FieldScene
  });
  sceneManager.loadScene({
    areaId: "area3"
  });
  (0, _events.on)(_events.EV_SCENECHANGE, function (props) {
    return sceneManager.loadScene(_objectSpread({}, props));
  });
});
},{"kontra":"node_modules/kontra/kontra.mjs","./ui/ui":"src/ui/ui.js","./sprites/entity":"src/sprites/entity.js","./common/helpers":"src/common/helpers.js","./common/consts":"src/common/consts.js","./common/events":"src/common/events.js","./states/startConvo":"src/states/startConvo.js","./states/fieldState":"src/states/fieldState.js","./states/curtainState":"src/states/curtainState.js","./managers/sceneManager":"src/managers/sceneManager.js","./managers/worldManager":"src/managers/worldManager.js","./managers/conversationManager":"src/managers/conversationManager.js","./managers/reactionManager":"src/managers/reactionManager.js","./managers/stateManager":"src/managers/stateManager.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65482" + '/');

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