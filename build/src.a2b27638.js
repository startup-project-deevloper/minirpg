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
exports.Animation = factory;
exports.setImagePath = setImagePath;
exports.setAudioPath = setAudioPath;
exports.setDataPath = setDataPath;
exports.loadImage = loadImage;
exports.loadAudio = loadAudio;
exports.loadData = loadData;
exports.load = load;
exports.Button = factory$5;
exports.init = init;
exports.getCanvas = getCanvas;
exports.getContext = getContext;
exports.on = on;
exports.off = off;
exports.emit = emit;
exports.GameLoop = GameLoop;
exports.GameObject = factory$2;
exports.Grid = factory$6;
exports.degToRad = degToRad;
exports.radToDeg = radToDeg;
exports.angleToTarget = angleToTarget;
exports.rotatePoint = rotatePoint;
exports.randInt = randInt;
exports.seedRand = seedRand;
exports.lerp = lerp;
exports.inverseLerp = inverseLerp;
exports.clamp = clamp;
exports.setStoreItem = setStoreItem;
exports.getStoreItem = getStoreItem;
exports.collides = collides;
exports.getWorldRect = getWorldRect;
exports.initKeys = initKeys;
exports.bindKeys = bindKeys;
exports.unbindKeys = unbindKeys;
exports.keyPressed = keyPressed;
exports.registerPlugin = registerPlugin;
exports.unregisterPlugin = unregisterPlugin;
exports.extendObject = extendObject;
exports.initPointer = initPointer;
exports.getPointer = getPointer;
exports.track = track;
exports.untrack = untrack;
exports.pointerOver = pointerOver;
exports.onPointerDown = onPointerDown;
exports.onPointerUp = onPointerUp;
exports.pointerPressed = pointerPressed;
exports.Pool = factory$7;
exports.Quadtree = factory$8;
exports.Scene = factory$9;
exports.Sprite = factory$3;
exports.SpriteSheet = factory$a;
exports.Text = factory$4;
exports.TileEngine = TileEngine;
exports.Vector = factory$1;
exports.keyMap = exports.dataAssets = exports.audioAssets = exports.imageAssets = exports.default = void 0;

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
 * - `tick` - Emitted every frame of [GameLoop](api/gameLoop) before the loops `update()` and `render()` functions are called.
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
  callbacks[event] = (callbacks[event] || []).filter(fn => fn != callback);
}
/**
 * Call all callback functions for the event. All arguments will be passed to the callback functions.
 * @function emit
 *
 * @param {String} event - Name of the event.
 * @param {...*} args - Comma separated list of arguments passed to all callbacks.
 */


function emit(event, ...args) {
  (callbacks[event] || []).map(fn => fn(...args));
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


let canvasEl, context;
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
 * @returns {{canvas: HTMLCanvasElement, context: CanvasRenderingContext2D}} An object with properties `canvas` and `context`. `canvas` it the canvas element for the game and `context` is the context object the game draws to.
 */


function init(canvas) {
  // check if canvas is a string first, an element next, or default to getting
  // first canvas on page
  canvasEl = document.getElementById(canvas) || canvas || document.querySelector('canvas'); // @ifdef DEBUG

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
 * Typically you don't create an Animation directly, but rather you would create them from a [SpriteSheet](api/spriteSheet) by passing the `animations` argument.
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
 * @param {SpriteSheet} properties.spriteSheet - Sprite sheet for the animation.
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
  }) {
    /**
     * The sprite sheet to use for the animation.
     * @memberof Animation
     * @property {SpriteSheet} spriteSheet
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
     * The width of an individual frame. Taken from the [frame width value](api/spriteSheet#frame) of the sprite sheet.
     * @memberof Animation
     * @property {Number} width
     */

    this.width = width;
    /**
     * The height of an individual frame. Taken from the [frame height value](api/spriteSheet#frame) of the sprite sheet.
     * @memberof Animation
     * @property {Number} height
     */

    this.height = height;
    /**
     * The space between each frame. Taken from the [frame margin value](api/spriteSheet#frame) of the sprite sheet.
     * @memberof Animation
     * @property {Number} margin
     */

    this.margin = margin; // f = frame, a = accumulator

    this._f = 0;
    this._a = 0;
  }
  /**
   * Clone an animation so it can be used more than once. By default animations passed to [Sprite](api/sprite) will be cloned so no two sprites update the same animation. Otherwise two sprites who shared the same animation would make it update twice as fast.
   * @memberof Animation
   * @function clone
   *
   * @returns {Animation} A new Animation instance.
   */


  clone() {
    return new Animation(this);
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
   * @param {CanvasRenderingContext2D} [properties.context] - The context the animation should draw to. Defaults to [core.getContext()](api/core#getContext).
   */


  render({
    x,
    y,
    width = this.width,
    height = this.height,
    context = getContext()
  }) {
    // get the row and col of the frame
    let row = this.frames[this._f] / this.spriteSheet._f | 0;
    let col = this.frames[this._f] % this.spriteSheet._f | 0;
    context.drawImage(this.spriteSheet.image, col * this.width + (col * 2 + 1) * this.margin, row * this.height + (row * 2 + 1) * this.margin, this.width, this.height, x, y, width, height);
  }

}

function factory() {
  return new Animation(...arguments);
}

factory.prototype = Animation.prototype;
factory.class = Animation;
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
    wav: audio.canPlayType('audio/wav; codecs="1"'),
    mp3: audio.canPlayType('audio/mpeg;'),
    ogg: audio.canPlayType('audio/ogg; codecs="vorbis"'),
    aac: audio.canPlayType('audio/aac;')
  };
}
/**
 * Object of all loaded image assets by both file name and path. If the base [image path](api/assets#setImagePath) was set before the image was loaded, the file name and path will not include the base image path.
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
 * @property {{[name: String]: HTMLImageElement}} imageAssets
 */


let imageAssets = {};
/**
 * Object of all loaded audio assets by both file name and path. If the base [audio path](api/assets#setAudioPath) was set before the audio was loaded, the file name and path will not include the base audio path.
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
 * @property {{[name: String]: HTMLAudioElement}} audioAssets
 */

exports.imageAssets = imageAssets;
let audioAssets = {};
/**
 * Object of all loaded data assets by both file name and path. If the base [data path](api/assets#setDataPath) was set before the data was loaded, the file name and path will not include the base data path.
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
 * @property {{[name: String]: any}} dataAssets
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
 * Load a single Image asset. Uses the base [image path](api/assets#setImagePath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [imageAssets](api/assets#imageAssets) property.
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
 * @returns {Promise<HTMLImageElement>} A deferred promise. Promise resolves with the Image.
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
      /* @ifdef DEBUG */
      'Unable to load image ' +
      /* @endif */
      resolvedUrl);
    };

    image.src = resolvedUrl;
  });
}
/**
 * Load a single Audio asset. Supports loading multiple audio formats which the loader will use to load the first audio format supported by the browser in the order listed. Uses the base [audio path](api/assets#setAudioPath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [audioAssets](api/assets#audioAssets) property. Since the loader determines which audio asset to load based on browser support, you should only reference the audio by its name and not by its file path since there's no guarantee which asset was loaded.
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
 * @returns {Promise<HTMLAudioElement>} A deferred promise. Promise resolves with the Audio.
 */


function loadAudio(url) {
  return new Promise((resolve, reject) => {
    let _url = url,
        audioEl,
        canPlay,
        resolvedUrl,
        fullUrl;
    audioEl = new Audio();
    canPlay = getCanPlay(audioEl); // determine the first audio format the browser can play

    url = [].concat(url).reduce((playableSource, source) => playableSource ? playableSource : canPlay[getExtension(source)] ? source : null, 0); // 0 is the shortest falsy value

    if (!url) {
      return reject(
      /* @ifdef DEBUG */
      'cannot play any of the audio formats provided ' +
      /* @endif */
      _url);
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
      /* @ifdef DEBUG */
      'Unable to load audio ' +
      /* @endif */
      resolvedUrl);
    };

    audioEl.src = resolvedUrl;
    audioEl.load();
  });
}
/**
 * Load a single Data asset. Uses the base [data path](api/assets#setDataPath) to resolve the URL.
 *
 * Once loaded, the asset will be accessible on the the [dataAssets](api/assets#dataAssets) property.
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
 * Load Image, Audio, or data files. Uses the [loadImage](api/assets#loadImage), [loadAudio](api/assets#loadAudio), and [loadData](api/assets#loadData) functions to load each asset type.
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
 * @param {...String[]} urls - Comma separated list of asset urls to load.
 *
 * @returns {Promise<any[]>} A deferred promise. Resolves with all the loaded assets.
 */


function load(...urls) {
  addGlobal();
  return Promise.all(urls.map(asset => {
    // account for a string or an array for the url
    let extension = getExtension([].concat(asset)[0]);
    return extension.match(imageRegex) ? loadImage(asset) : extension.match(audioRegex) ? loadAudio(asset) : loadData(asset);
  }));
}
/**
 * A group of helpful functions that are commonly used for game development. Includes things such as converting between radians and degrees and getting random integers.
 *
 * ```js
 * import { degToRad } from 'kontra';
 *
 * let radians = degToRad(180);  // => 3.14
 * ```
 * @sectionName Helpers
 */

/**
 * Convert degrees to radians.
 * @function degToRad
 *
 * @param {Number} deg - Degrees to convert.
 *
 * @returns {Number} The value in radians.
 */


function degToRad(deg) {
  return deg * Math.PI / 180;
}
/**
 * Convert radians to degrees.
 * @function radToDeg
 *
 * @param {Number} rad - Radians to convert.
 *
 * @returns {Number} The value in degrees.
 */


function radToDeg(rad) {
  return rad * 180 / Math.PI;
}
/**
 * Return the angle in radians from one point to another point.
 *
 * ```js
 * import { angleToTarget, Sprite } from 'kontra';
 *
 * let sprite = Sprite({
 *   x: 10,
 *   y: 10,
 *   width: 20,
 *   height: 40,
 *   color: 'blue'
 * });
 *
 * sprite.rotation = angleToTarget(sprite, {x: 100, y: 30});
 *
 * let sprite2 = Sprite({
 *   x: 100,
 *   y: 30,
 *   width: 20,
 *   height: 40,
 *   color: 'red',
 * });
 *
 * sprite2.rotation = angleToTarget(sprite2, sprite);
 * ```
 * @function angleToTarget
 *
 * @param {{x: Number, y: Number}} source - The source point.
 * @param {{x: Number, y: Number}} target - The target point.
 *
 * @returns {Number} Angle (in radians) from the source point to the target point.
 */


function angleToTarget(source, target) {
  // atan2 returns the counter-clockwise angle in respect to the x-axis, but
  // the canvas rotation system is based on the y-axis (rotation of 0 = up).
  // so we need to add a quarter rotation to return a counter-clockwise
  // rotation in respect to the y-axis
  return Math.atan2(target.y - source.y, target.x - source.x) + Math.PI / 2;
}
/**
 * Rotate a point by an angle.
 * @function rotatePoint
 *
 * @param {{x: Number, y: Number}} point - The point to rotate.
 * @param {Number} angle - Angle (in radians) to rotate.
 *
 * @returns {{x: Number, y: Number}} The new x and y coordinates after rotation.
 */


function rotatePoint(point, angle) {
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);
  let x = point.x * cos - point.y * sin;
  let y = point.x * sin + point.y * cos;
  return {
    x,
    y
  };
}
/**
 * Return a random integer between a minimum (inclusive) and maximum (inclusive) integer.
 * @see https://stackoverflow.com/a/1527820/2124254
 * @function randInt
 *
 * @param {Number} min - Min integer.
 * @param {Number} max - Max integer.
 *
 * @returns {Number} Random integer between min and max values.
 */


function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Create a seeded random number generator.
 *
 * ```js
 * import { seedRand } from 'kontra';
 *
 * let rand = seedRand('kontra');
 * console.log(rand());  // => always 0.33761959057301283
 * ```
 * @see https://stackoverflow.com/a/47593316/2124254
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 *
 * @function seedRand
 *
 * @param {String} str - String to seed the random number generator.
 *
 * @returns {() => Number} Seeded random number generator function.
 */


function seedRand(str) {
  // based on the above references, this was the smallest code yet decent
  // quality seed random function
  // first create a suitable hash of the seed string using xfnv1a
  // @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
  for (var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }

  h += h << 13;
  h ^= h >>> 7;
  h += h << 3;
  h ^= h >>> 17;
  let seed = (h += h << 5) >>> 0; // then return the seed function and discard the first result
  // @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#lcg-lehmer-rng

  let rand = () => (2 ** 31 - 1 & (seed = Math.imul(48271, seed))) / 2 ** 31;

  rand();
  return rand;
}
/**
 * Linearly interpolate between two values. The function calculates the number between two values based on a percent. Great for smooth transitions.
 *
 * ```js
 * import { lerp } from 'kontra';
 *
 * console.log( lerp(10, 20, 0.5) );  // => 15
 * console.log( lerp(10, 20, 2) );  // => 30
 * ```
 * @function lerp
 *
 * @param {Number} start - Start value.
 * @param {Number} end - End value.
 * @param {Number} percent - Percent to interpolate.
 *
 * @returns {Number} Interpolated number between the start and end values
 */


function lerp(start, end, percent) {
  return start * (1 - percent) + end * percent;
}
/**
 * Return the linear interpolation percent between two values. The function calculates the percent between two values of a given value.
 *
 * ```js
 * import { inverseLerp } from 'kontra';
 *
 * console.log( inverseLerp(10, 20, 15) );  // => 0.5
 * console.log( inverseLerp(10, 20, 30) );  // => 2
 * ```
 * @function inverseLerp
 *
 * @param {Number} start - Start value.
 * @param {Number} end - End value.
 * @param {Number} value - Value between start and end.
 *
 * @returns {Number} Percent difference between the start and end values.
 */


function inverseLerp(start, end, value) {
  return (value - start) / (end - start);
}
/**
 * Clamp a number between two values, preventing it from going below or above the minimum and maximum values.
 * @function clamp
 *
 * @param {Number} min - Min value.
 * @param {Number} max - Max value.
 * @param {Number} value - Value to clamp.
 *
 * @returns {Number} Value clamped between min and max.
 */


function clamp(min, max, value) {
  return Math.min(Math.max(min, value), max);
}
/**
 * Save an item to localStorage. A value of `undefined` will remove the item from localStorage.
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
 *
 * Normally when you save a value to LocalStorage it converts it into a string. So if you were to save a number, it would be saved as `"12"` instead of `12`. This function enables the value to be returned as `12`.
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
 * Check if a two objects collide. Uses a simple [Axis-Aligned Bounding Box (AABB) collision check](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Axis-Aligned_Bounding_Box). Takes into account the sprites [anchor](api/gameObject#anchor) and [scale](api/gameObject#scale).
 *
 * **NOTE:** Does not take into account object rotation. If you need collision detection between rotated objects you will need to implement your own `collides()` function. I suggest looking at the Separate Axis Theorem.
 *
 *
 * ```js
 * import { Sprite, collides } from 'kontra';
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
 * collides(sprite, sprite2);  //=> false
 *
 * sprite2.x = 115;
 *
 * collides(sprite, sprite2);  //=> true
 * ```
 * @function collides
 *
 * @param {Object} obj1 - Object reference.
 * @param {Object} obj2 - Object to check collision against.
 *
 * @returns {Boolean|null} `true` if the objects collide, `false` otherwise. Will return `null` if the either of the two objects are rotated.
 */


function collides(obj1, obj2) {
  if (obj1.rotation || obj2.rotation) return null; // @ifdef GAMEOBJECT_SCALE||GAMEOBJECT_ANCHOR
  // destructure results to obj1 and obj2

  [obj1, obj2] = [obj1, obj2].map(obj => getWorldRect(obj)); // @endif

  return obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y;
}
/**
 * Return the world rect of an object. The rect is the world position of the top-left corner of the object and its size. Takes into account the objects anchor and scale.
 * @function getWorldRect
 *
 * @param {Object} obj - Object to get world rect of.
 *
 * @returns {{x: number, y: number, width: number, height: number}} The world `x`, `y`, `width`, and `height` of the object.
 */


function getWorldRect(obj) {
  let {
    x,
    y,
    width,
    height
  } = obj.world || obj; // @ifdef GAMEOBJECT_ANCHOR
  // account for anchor

  if (obj.anchor) {
    x -= width * obj.anchor.x;
    y -= height * obj.anchor.y;
  } // @endif
  // @ifdef GAMEOBJECT_SCALE
  // account for negative scales


  if (width < 0) {
    x += width;
    width *= -1;
  }

  if (height < 0) {
    y += height;
    height *= -1;
  } // @endif


  return {
    x,
    y,
    width,
    height
  };
}
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
  constructor(x = 0, y = 0, vec = {}) {
    this.x = x;
    this.y = y; // @ifdef VECTOR_CLAMP
    // preserve vector clamping when creating new vectors

    if (vec._c) {
      this.clamp(vec._a, vec._b, vec._d, vec._e); // reset x and y so clamping takes effect

      this.x = x;
      this.y = y;
    } // @endif

  }
  /**
   * Calculate the addition of the current vector with the given vector.
   * @memberof Vector
   * @function add
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to add to the current Vector.
   *
   * @returns {Vector} A new Vector instance whose value is the addition of the two vectors.
   */


  add(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y, this);
  } // @ifdef VECTOR_SUBTRACT

  /**
   * Calculate the subtraction of the current vector with the given vector.
   * @memberof Vector
   * @function subtract
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to subtract from the current Vector.
   *
   * @returns {Vector} A new Vector instance whose value is the subtraction of the two vectors.
   */


  subtract(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y, this);
  } // @endif
  // @ifdef VECTOR_SCALE

  /**
   * Calculate the multiple of the current vector by a value.
   * @memberof Vector
   * @function scale
   *
   * @param {Number} value - Value to scale the current Vector.
   *
   * @returns {Vector} A new Vector instance whose value is multiplied by the scalar.
   */


  scale(value) {
    return new Vector(this.x * value, this.y * value);
  } // @endif
  // @ifdef VECTOR_NORMALIZE

  /**
   * Calculate the normalized value of the current vector. Requires the Vector [length](api/vector#length) function.
   * @memberof Vector
   * @function normalize
   *
   * @returns {Vector} A new Vector instance whose value is the normalized vector.
   */
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#use-placeholder-arguments-instead-of-var


  normalize(length = this.length()) {
    return new Vector(this.x / length, this.y / length);
  } // @endif
  // @ifdef VECTOR_DOT||VECTOR_ANGLE

  /**
   * Calculate the dot product of the current vector with the given vector.
   * @memberof Vector
   * @function dot
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to dot product against.
   *
   * @returns {Number} The dot product of the vectors.
   */


  dot(vec) {
    return this.x * vec.x + this.y * vec.y;
  } // @endif
  // @ifdef VECTOR_LENGTH||VECTOR_NORMALIZE||VECTOR_ANGLE

  /**
   * Calculate the length (magnitude) of the Vector.
   * @memberof Vector
   * @function length
   *
   * @returns {Number} The length of the vector.
   */


  length() {
    return Math.hypot(this.x, this.y);
  } // @endif
  // @ifdef VECTOR_DISTANCE

  /**
   * Calculate the distance between the current vector and the given vector.
   * @memberof Vector
   * @function distance
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to calculate the distance between.
   *
   * @returns {Number} The distance between the two vectors.
   */


  distance(vec) {
    return Math.hypot(this.x - vec.x, this.y - vec.y);
  } // @endif
  // @ifdef VECTOR_ANGLE

  /**
   * Calculate the angle (in radians) between the current vector and the given vector. Requires the Vector [dot](api/vector#dot) and [length](api/vector#length) functions.
   * @memberof Vector
   * @function angle
   *
   * @param {Vector} vector - Vector to calculate the angle between.
   *
   * @returns {Number} The angle (in radians) between the two vectors.
   */


  angle(vec) {
    return Math.acos(this.dot(vec) / (this.length() * vec.length()));
  } // @endif
  // @ifdef VECTOR_CLAMP

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
    this._x = this._c ? clamp(this._a, this._d, value) : value;
  }

  set y(value) {
    this._y = this._c ? clamp(this._b, this._e, value) : value;
  } // @endif


}

function factory$1() {
  return new Vector(...arguments);
}

factory$1.prototype = Vector.prototype;
factory$1.class = Vector;
/**
 * This is a private class that is used just to help make the GameObject class more manageable and smaller.
 *
 * It maintains everything that can be changed in the update function:
 * position
 * velocity
 * acceleration
 * ttl
 */

class Updatable {
  constructor(properties) {
    return this.init(properties);
  }

  init(properties = {}) {
    // --------------------------------------------------
    // defaults
    // --------------------------------------------------

    /**
     * The game objects position vector. Represents the local position of the object as opposed to the [world](api/gameObject#world) position.
     * @property {Vector} position
     * @memberof GameObject
     * @page GameObject
     */
    this.position = factory$1(); // --------------------------------------------------
    // optionals
    // --------------------------------------------------
    // @ifdef GAMEOBJECT_VELOCITY

    /**
     * The game objects velocity vector.
     * @memberof GameObject
     * @property {Vector} velocity
     * @page GameObject
     */

    this.velocity = factory$1(); // @endif
    // @ifdef GAMEOBJECT_ACCELERATION

    /**
     * The game objects acceleration vector.
     * @memberof GameObject
     * @property {Vector} acceleration
     * @page GameObject
     */

    this.acceleration = factory$1(); // @endif
    // @ifdef GAMEOBJECT_TTL

    /**
     * How may frames the game object should be alive.
     * @memberof GameObject
     * @property {Number} ttl
     * @page GameObject
     */

    this.ttl = Infinity; // @endif
    // add all properties to the object, overriding any defaults

    Object.assign(this, properties);
  }
  /**
   * Update the game objects position based on its velocity and acceleration. Calls the game objects [advance()](api/gameObject#advance) function.
   * @memberof GameObject
   * @function update
   * @page GameObject
   *
   * @param {Number} [dt] - Time since last update.
   */


  update(dt) {
    this.advance(dt);
  }
  /**
   * Move the game object by its acceleration and velocity. If you pass `dt` it will multiply the vector and acceleration by that number. This means the `dx`, `dy`, `ddx` and `ddy` should be the how far you want the object to move in 1 second rather than in 1 frame.
   *
   * If you override the game objects [update()](api/gameObject#update) function with your own update function, you can call this function to move the game object normally.
   *
   * ```js
   * import { GameObject } from 'kontra';
   *
   * let gameObject = GameObject({
   *   x: 100,
   *   y: 200,
   *   width: 20,
   *   height: 40,
   *   dx: 5,
   *   dy: 2,
   *   update: function() {
   *     // move the game object normally
   *     this.advance();
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
   * @memberof GameObject
   * @function advance
   * @page GameObject
   *
   * @param {Number} [dt] - Time since last update.
   *
   */


  advance(dt) {
    // @ifdef GAMEOBJECT_VELOCITY
    // @ifdef GAMEOBJECT_ACCELERATION
    let acceleration = this.acceleration; // @ifdef VECTOR_SCALE

    if (dt) {
      acceleration = acceleration.scale(dt);
    } // @endif


    this.velocity = this.velocity.add(acceleration); // @endif
    // @endif
    // @ifdef GAMEOBJECT_VELOCITY

    let velocity = this.velocity; // @ifdef VECTOR_SCALE

    if (dt) {
      velocity = velocity.scale(dt);
    } // @endif


    this.position = this.position.add(velocity);

    this._pc(); // @endif
    // @ifdef GAMEOBJECT_TTL


    this.ttl--; // @endif
  } // --------------------------------------------------
  // velocity
  // --------------------------------------------------
  // @ifdef GAMEOBJECT_VELOCITY

  /**
   * X coordinate of the velocity vector.
   * @memberof GameObject
   * @property {Number} dx
   * @page GameObject
   */


  get dx() {
    return this.velocity.x;
  }
  /**
   * Y coordinate of the velocity vector.
   * @memberof GameObject
   * @property {Number} dy
   * @page GameObject
   */


  get dy() {
    return this.velocity.y;
  }

  set dx(value) {
    this.velocity.x = value;
  }

  set dy(value) {
    this.velocity.y = value;
  } // @endif
  // --------------------------------------------------
  // acceleration
  // --------------------------------------------------
  // @ifdef GAMEOBJECT_ACCELERATION

  /**
   * X coordinate of the acceleration vector.
   * @memberof GameObject
   * @property {Number} ddx
   * @page GameObject
   */


  get ddx() {
    return this.acceleration.x;
  }
  /**
   * Y coordinate of the acceleration vector.
   * @memberof GameObject
   * @property {Number} ddy
   * @page GameObject
   */


  get ddy() {
    return this.acceleration.y;
  }

  set ddx(value) {
    this.acceleration.x = value;
  }

  set ddy(value) {
    this.acceleration.y = value;
  } // @endif
  // --------------------------------------------------
  // ttl
  // --------------------------------------------------
  // @ifdef GAMEOBJECT_TTL

  /**
   * Check if the game object is alive.
   * @memberof GameObject
   * @function isAlive
   * @page GameObject
   *
   * @returns {Boolean} `true` if the game objects [ttl](api/gameObject#ttl) property is above `0`, `false` otherwise.
   */


  isAlive() {
    return this.ttl > 0;
  } // @endif


  _pc() {}

} // noop function


const noop = () => {}; // style used for DOM nodes needed for screen readers


const srOnlyStyle = 'position:absolute;left:-9999px'; // append a node directly after the canvas and as the last
// element of other kontra nodes

function addToDom(node, canvas) {
  let container = canvas.parentNode;
  node.setAttribute('data-kontra', '');

  if (container) {
    let target = container.querySelector('[data-kontra]:last-of-type') || canvas;
    container.insertBefore(node, target.nextSibling);
  } else {
    document.body.appendChild(node);
  }
}
/**
 * The base class of most renderable classes. Handles things such as position, rotation, anchor, and the update and render life cycle.
 *
 * Typically you don't create a GameObject directly, but rather extend it for new classes.
 * @class GameObject
 *
 * @param {Object} [properties] - Properties of the game object.
 * @param {Number} [properties.x] - X coordinate of the position vector.
 * @param {Number} [properties.y] - Y coordinate of the position vector.
 * @param {Number} [properties.width] - Width of the game object.
 * @param {Number} [properties.height] - Height of the game object.
 *
 * @param {CanvasRenderingContext2D} [properties.context] - The context the game object should draw to. Defaults to [core.getContext()](api/core#getContext).
 *
 * @param {Number} [properties.dx] - X coordinate of the velocity vector.
 * @param {Number} [properties.dy] - Y coordinate of the velocity vector.
 * @param {Number} [properties.ddx] - X coordinate of the acceleration vector.
 * @param {Number} [properties.ddy] - Y coordinate of the acceleration vector.
 * @param {Number} [properties.ttl=Infinity] - How many frames the game object should be alive. Used by [Pool](api/pool).
 *
 * @param {{x: number, y: number}} [properties.anchor={x:0,y:0}] - The x and y origin of the game object. {x:0, y:0} is the top left corner of the game object, {x:1, y:1} is the bottom right corner.
 * @param {Number} [properties.sx=0] - The x camera position.
 * @param {Number} [properties.sy=0] - The y camera position.
 * @param {GameObject[]} [properties.children] - Children to add to the game object.
 * @param {Number} [properties.opacity=1] - The opacity of the game object.
 * @param {Number} [properties.rotation=0] - The rotation around the anchor in radians.
 * @param {Number} [properties.scaleX=1] - The x scale of the game object.
 * @param {Number} [properties.scaleY=1] - The y scale of the game object.
 *
 * @param {(dt?: number) => void} [properties.update] - Function called every frame to update the game object.
 * @param {Function} [properties.render] - Function called every frame to render the game object.
 *
 * @param {...*} properties.props - Any additional properties you need added to the game object. For example, if you pass `gameObject({type: 'player'})` then the game object will also have a property of the same name and value. You can pass as many additional properties as you want.
 */


class GameObject extends Updatable {
  /**
   * @docs docs/api_docs/gameObject.js
   */

  /**
   * Use this function to reinitialize a game object. It takes the same properties object as the constructor. Useful it you want to repurpose a game object.
   * @memberof GameObject
   * @function init
   *
   * @param {Object} properties - Properties of the game object.
   */
  init({
    // --------------------------------------------------
    // defaults
    // --------------------------------------------------

    /**
     * The width of the game object. Represents the local width of the object as opposed to the [world](api/gameObject#world) width.
     * @memberof GameObject
     * @property {Number} width
     */
    width = 0,

    /**
     * The height of the game object. Represents the local height of the object as opposed to the [world](api/gameObject#world) height.
     * @memberof GameObject
     * @property {Number} height
     */
    height = 0,

    /**
     * The context the game object will draw to.
     * @memberof GameObject
     * @property {CanvasRenderingContext2D} context
     */
    context = getContext(),
    render = this.draw,
    update = this.advance,
    // --------------------------------------------------
    // optionals
    // --------------------------------------------------
    // @ifdef GAMEOBJECT_GROUP

    /**
     * The game objects parent object.
     * @memberof GameObject
     * @property {GameObject|null} parent
     */

    /**
     * The game objects children objects.
     * @memberof GameObject
     * @property {GameObject[]} children
     */
    children = [],
    // @endif
    // @ifdef GAMEOBJECT_ANCHOR

    /**
     * The x and y origin of the game object. {x:0, y:0} is the top left corner of the game object, {x:1, y:1} is the bottom right corner.
     * @memberof GameObject
     * @property {{x: number, y: number}} anchor
     *
     * @example
     * // exclude-code:start
     * let { GameObject } = kontra;
     * // exclude-code:end
     * // exclude-script:start
     * import { GameObject } from 'kontra';
     * // exclude-script:end
     *
     * let gameObject = GameObject({
     *   x: 150,
     *   y: 100,
     *   width: 50,
     *   height: 50,
     *   color: 'red',
     *   // exclude-code:start
     *   context: context,
     *   // exclude-code:end
     *   render: function() {
     *     this.context.fillStyle = this.color;
     *     this.context.fillRect(0, 0, this.height, this.width);
     *   }
     * });
     *
     * function drawOrigin(gameObject) {
     *   gameObject.context.fillStyle = 'yellow';
     *   gameObject.context.beginPath();
     *   gameObject.context.arc(gameObject.x, gameObject.y, 3, 0, 2*Math.PI);
     *   gameObject.context.fill();
     * }
     *
     * gameObject.render();
     * drawOrigin(gameObject);
     *
     * gameObject.anchor = {x: 0.5, y: 0.5};
     * gameObject.x = 300;
     * gameObject.render();
     * drawOrigin(gameObject);
     *
     * gameObject.anchor = {x: 1, y: 1};
     * gameObject.x = 450;
     * gameObject.render();
     * drawOrigin(gameObject);
     */
    anchor = {
      x: 0,
      y: 0
    },
    // @endif
    // @ifdef GAMEOBJECT_CAMERA

    /**
     * The X coordinate of the camera.
     * @memberof GameObject
     * @property {Number} sx
     */
    sx = 0,

    /**
     * The Y coordinate of the camera.
     * @memberof GameObject
     * @property {Number} sy
     */
    sy = 0,
    // @endif
    // @ifdef GAMEOBJECT_OPACITY

    /**
     * The opacity of the object. Represents the local opacity of the object as opposed to the [world](api/gameObject#world) opacity.
     * @memberof GameObject
     * @property {Number} opacity
     */
    opacity = 1,
    // @endif
    // @ifdef GAMEOBJECT_ROTATION

    /**
     * The rotation of the game object around the anchor in radians. . Represents the local rotation of the object as opposed to the [world](api/gameObject#world) rotation.
     * @memberof GameObject
     * @property {Number} rotation
     */
    rotation = 0,
    // @endif
    // @ifdef GAMEOBJECT_SCALE

    /**
     * The x scale of the object. Represents the local x scale of the object as opposed to the [world](api/gameObject#world) x scale.
     * @memberof GameObject
     * @property {Number} scaleX
     */
    scaleX = 1,

    /**
     * The y scale of the object. Represents the local y scale of the object as opposed to the [world](api/gameObject#world) y scale.
     * @memberof GameObject
     * @property {Number} scaleY
     */
    scaleY = 1,
    // @endif
    ...props
  } = {}) {
    // @ifdef GAMEOBJECT_GROUP
    this.children = []; // @endif
    // by setting defaults to the parameters and passing them into
    // the init, we can ensure that a parent class can set overriding
    // defaults and the GameObject won't undo it (if we set
    // `this.width` then no parent could provide a default value for
    // width)

    super.init({
      width,
      height,
      context,
      // @ifdef GAMEOBJECT_ANCHOR
      anchor,
      // @endif
      // @ifdef GAMEOBJECT_CAMERA
      sx,
      sy,
      // @endif
      // @ifdef GAMEOBJECT_OPACITY
      opacity,
      // @endif
      // @ifdef GAMEOBJECT_ROTATION
      rotation,
      // @endif
      // @ifdef GAMEOBJECT_SCALE
      scaleX,
      scaleY,
      // @endif
      ...props
    }); // di = done init

    this._di = true;

    this._uw(); // @ifdef GAMEOBJECT_GROUP


    children.map(child => this.addChild(child)); // @endif
    // rf = render function

    this._rf = render; // uf = update function

    this._uf = update;
  }
  /**
   * Update all children
   */


  update(dt) {
    this._uf(dt); // @ifdef GAMEOBJECT_GROUP


    this.children.map(child => child.update && child.update()); // @endif
  }
  /**
   * Render the game object. Calls the game objects [draw()](api/gameObject#draw) function.
   * @memberof GameObject
   * @function render
   *
   * @param {Function} [filterObjects] - [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) function which is used to filter which children to render.
   */


  render(filterObjects) {
    let context = this.context;
    context.save(); // 1) translate to position
    //
    // it's faster to only translate if one of the values is non-zero
    // rather than always translating
    // @see https://jsperf.com/translate-or-if-statement/2

    if (this.x || this.y) {
      context.translate(this.x, this.y);
    } // @ifdef GAMEOBJECT_ROTATION
    // 2) rotate around the anchor
    //
    // it's faster to only rotate when set rather than always rotating
    // @see https://jsperf.com/rotate-or-if-statement/2


    if (this.rotation) {
      context.rotate(this.rotation);
    } // @endif
    // @ifdef GAMEOBJECT_CAMERA
    // 3) translate to the camera position after rotation so camera
    // values are in the direction of the rotation rather than always
    // along the x/y axis


    if (this.sx || this.sy) {
      context.translate(-this.sx, -this.sy);
    } // @endif
    // @ifdef GAMEOBJECT_SCALE
    // 4) scale after translation to position so object can be
    // scaled in place (rather than scaling position as well).
    //
    // it's faster to only scale if one of the values is not 1
    // rather than always scaling
    // @see https://jsperf.com/scale-or-if-statement/4


    if (this.scaleX != 1 || this.scaleY != 1) {
      context.scale(this.scaleX, this.scaleY);
    } // @endif
    // @ifdef GAMEOBJECT_ANCHOR
    // 5) translate to the anchor so (0,0) is the top left corner
    // for the render function


    let anchorX = -this.width * this.anchor.x;
    let anchorY = -this.height * this.anchor.y;

    if (anchorX || anchorY) {
      context.translate(anchorX, anchorY);
    } // @endif
    // @ifdef GAMEOBJECT_OPACITY
    // it's not really any faster to gate the global alpha
    // @see https://jsperf.com/global-alpha-or-if-statement/1


    this.context.globalAlpha = this.opacity; // @endif

    this._rf(); // @ifdef GAMEOBJECT_ANCHOR
    // 7) translate back to the anchor so children use the correct
    // x/y value from the anchor


    if (anchorX || anchorY) {
      context.translate(-anchorX, -anchorY);
    } // @endif
    // @ifdef GAMEOBJECT_GROUP
    // perform all transforms on the parent before rendering the children


    let children = this.children;

    if (filterObjects) {
      children = children.filter(filterObjects);
    }

    children.map(child => child.render && child.render()); // @endif

    context.restore();
  }
  /**
   * Draw the game object at its X and Y position, taking into account rotation, scale, and anchor.
   *
   * Do note that the canvas has been rotated and translated to the objects position (taking into account anchor), so {0,0} will be the top-left corner of the game object when drawing.
   *
   * If you override the game objects `render()` function with your own render function, you can call this function to draw the game object normally.
   *
   * ```js
   * let { GameObject } = kontra;
   *
   * let gameObject = GameObject({
   *  x: 290,
   *  y: 80,
   *  width: 20,
   *  height: 40,
   *
   *  render: function() {
   *    // draw the game object normally (perform rotation and other transforms)
   *    this.draw();
   *
   *    // outline the game object
   *    this.context.strokeStyle = 'yellow';
   *    this.context.lineWidth = 2;
   *    this.context.strokeRect(0, 0, this.width, this.height);
   *  }
   * });
   *
   * gameObject.render();
   * ```
   * @memberof GameObject
   * @function draw
   */


  draw() {}
  /**
   * Sync property changes from the parent to the child
   */


  _pc(prop, value) {
    this._uw(); // @ifdef GAMEOBJECT_GROUP


    this.children.map(child => child._pc()); // @endif
  }
  /**
   * X coordinate of the position vector.
   * @memberof GameObject
   * @property {Number} x
   */


  get x() {
    return this.position.x;
  }
  /**
   * Y coordinate of the position vector.
   * @memberof GameObject
   * @property {Number} y
   */


  get y() {
    return this.position.y;
  }

  set x(value) {
    this.position.x = value; // pc = property changed

    this._pc();
  }

  set y(value) {
    this.position.y = value;

    this._pc();
  }

  get width() {
    // w = width
    return this._w;
  }

  set width(value) {
    this._w = value;

    this._pc();
  }

  get height() {
    // h = height
    return this._h;
  }

  set height(value) {
    this._h = value;

    this._pc();
  }
  /**
   * Update world properties
   */


  _uw() {
    // don't update world properties until after the init has finished
    if (!this._di) return; // @ifdef GAMEOBJECT_GROUP||GAMEOBJECT_OPACITY||GAMEOBJECT_ROTATION||GAMEOBJECT_SCALE

    let {
      _wx = 0,
      _wy = 0,
      // @ifdef GAMEOBJECT_OPACITY
      _wo = 1,
      // @endif
      // @ifdef GAMEOBJECT_ROTATION
      _wr = 0,
      // @endif
      // @ifdef GAMEOBJECT_SCALE
      _wsx = 1,
      _wsy = 1 // @endif

    } = this.parent || {}; // @endif
    // wx = world x, wy = world y

    this._wx = this.x;
    this._wy = this.y; // ww = world width, wh = world height

    this._ww = this.width;
    this._wh = this.height; // @ifdef GAMEOBJECT_OPACITY
    // wo = world opacity

    this._wo = _wo * this.opacity; // @endif
    // @ifdef GAMEOBJECT_ROTATION
    // wr = world rotation

    this._wr = _wr + this.rotation;
    let {
      x,
      y
    } = rotatePoint({
      x: this.x,
      y: this.y
    }, _wr);
    this._wx = x;
    this._wy = y; // @endif
    // @ifdef GAMEOBJECT_SCALE
    // wsx = world scale x, wsy = world scale y

    this._wsx = _wsx * this.scaleX;
    this._wsy = _wsy * this.scaleY;
    this._wx = this.x * _wsx;
    this._wy = this.y * _wsy;
    this._ww = this.width * this._wsx;
    this._wh = this.height * this._wsy; // @endif
    // @ifdef GAMEOBJECT_GROUP

    this._wx += _wx;
    this._wy += _wy; // @endif
  }
  /**
   * The world position, width, height, opacity, rotation, and scale. The world property is the true position, width, height, etc. of the object, taking into account all parents.
   *
   * The world property does not adjust for anchor or scale, so if you set a negative scale the world width or height could be negative. Use [getWorldRect](/api/helpers#getWorldRect) to get the world position and size adjusted for anchor and scale.
   * @property {{x: number, y: number, width: number, height: number, opacity: number, rotation: number, scaleX: number, scaleY: number}} world
   * @memberof GameObject
   */


  get world() {
    return {
      x: this._wx,
      y: this._wy,
      width: this._ww,
      height: this._wh,
      // @ifdef GAMEOBJECT_OPACITY
      opacity: this._wo,
      // @endif
      // @ifdef GAMEOBJECT_ROTATION
      rotation: this._wr,
      // @endif
      // @ifdef GAMEOBJECT_SCALE
      scaleX: this._wsx,
      scaleY: this._wsy // @endif

    };
  } // --------------------------------------------------
  // group
  // --------------------------------------------------
  // @ifdef GAMEOBJECT_GROUP

  /**
   * Add an object as a child to this object. The childs [world](api/gameObject#world) property will be updated to take into account this object and all of its parents.
   * @memberof GameObject
   * @function addChild
   *
   * @param {GameObject} child - Object to add as a child.
   *
   * @example
   * // exclude-code:start
   * let { GameObject } = kontra;
   * // exclude-code:end
   * // exclude-script:start
   * import { GameObject } from 'kontra';
   * // exclude-script:end
   *
   * function createObject(x, y, color, size = 1) {
   *   return GameObject({
   *     x,
   *     y,
   *     width: 50 / size,
   *     height: 50 / size,
   *     anchor: {x: 0.5, y: 0.5},
   *     color,
   *     // exclude-code:start
   *     context: context,
   *     // exclude-code:end
   *     render: function() {
   *       this.context.fillStyle = this.color;
   *       this.context.fillRect(0, 0, this.height, this.width);
   *     }
   *   });
   * }
   *
   * let parent = createObject(300, 100, 'red');
   * let child = createObject(25, 25, 'yellow', 2);
   *
   * parent.addChild(child);
   *
   * parent.render();
   */


  addChild(child, {
    absolute = false
  } = {}) {
    this.children.push(child);
    child.parent = this;
    child._pc = child._pc || noop;

    child._pc();
  }
  /**
   * Remove an object as a child of this object. The removed objects [world](api/gameObject#world) property will be updated to not take into account this object and all of its parents.
   * @memberof GameObject
   * @function removeChild
   *
   * @param {GameObject} child - Object to remove as a child.
   */


  removeChild(child) {
    let index = this.children.indexOf(child);

    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;

      child._pc();
    }
  } // @endif
  // --------------------------------------------------
  // opacity
  // --------------------------------------------------
  // @ifdef GAMEOBJECT_OPACITY


  get opacity() {
    return this._opa;
  }

  set opacity(value) {
    this._opa = value;

    this._pc();
  } // @endif
  // --------------------------------------------------
  // rotation
  // --------------------------------------------------
  // @ifdef GAMEOBJECT_ROTATION


  get rotation() {
    return this._rot;
  }

  set rotation(value) {
    this._rot = value;

    this._pc();
  } // @endif
  // --------------------------------------------------
  // scale
  // --------------------------------------------------
  // @ifdef GAMEOBJECT_SCALE

  /**
   * Set the x and y scale of the object. If only one value is passed, both are set to the same value.
   * @memberof GameObject
   * @function setScale
   *
   * @param {Number} x - X scale value.
   * @param {Number} [y=x] - Y scale value.
   */


  setScale(x, y = x) {
    this.scaleX = x;
    this.scaleY = y;
  }

  get scaleX() {
    return this._scx;
  }

  set scaleX(value) {
    this._scx = value;

    this._pc();
  }

  get scaleY() {
    return this._scy;
  }

  set scaleY(value) {
    this._scy = value;

    this._pc();
  } // @endif


}

function factory$2() {
  return new GameObject(...arguments);
}

factory$2.prototype = GameObject.prototype;
factory$2.class = GameObject;
/**
 * A versatile way to update and draw your sprites. It can handle simple rectangles, images, and sprite sheet animations. It can be used for your main player object as well as tiny particles in a particle engine.
 * @class Sprite
 * @extends GameObject
 *
 * @param {Object} [properties] - Properties of the sprite.
 * @param {String} [properties.color] - Fill color for the game object if no image or animation is provided.
 * @param {HTMLImageElement|HTMLCanvasElement} [properties.image] - Use an image to draw the sprite.
 * @param {Object} [properties.animations] - An object of [Animations](api/animation) from a [Spritesheet](api/spriteSheet) to animate the sprite.
 */

class Sprite extends factory$2.class {
  /**
   * @docs docs/api_docs/sprite.js
   */
  init({
    /**
     * The color of the game object if it was passed as an argument.
     * @memberof Sprite
     * @property {String} color
     */
    // @ifdef SPRITE_IMAGE

    /**
     * The image the sprite will use when drawn if passed as an argument.
     * @memberof Sprite
     * @property {HTMLImageElement|HTMLCanvasElement} image
     */
    image,

    /**
     * The width of the sprite. If the sprite is a [rectangle sprite](api/sprite#rectangle-sprite), it uses the passed in value. For an [image sprite](api/sprite#image-sprite) it is the width of the image. And for an [animation sprite](api/sprite#animation-sprite) it is the width of a single frame of the animation.
     * @memberof Sprite
     * @property {Number} width
     */
    width = image ? image.width : undefined,

    /**
     * The height of the sprite. If the sprite is a [rectangle sprite](api/sprite#rectangle-sprite), it uses the passed in value. For an [image sprite](api/sprite#image-sprite) it is the height of the image. And for an [animation sprite](api/sprite#animation-sprite) it is the height of a single frame of the animation.
     * @memberof Sprite
     * @property {Number} height
     */
    height = image ? image.height : undefined,
    // @endif
    ...props
  } = {}) {
    super.init({
      // @ifdef SPRITE_IMAGE
      image,
      width,
      height,
      // @endif
      ...props
    });
  } // @ifdef SPRITE_ANIMATION

  /**
   * An object of [Animations](api/animation) from a [SpriteSheet](api/spriteSheet) to animate the sprite. Each animation is named so that it can can be used by name for the sprites [playAnimation()](api/sprite#playAnimation) function.
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
     * @property {Animation} currentAnimation
     */


    this.currentAnimation = firstAnimation;
    this.width = this.width || firstAnimation.width;
    this.height = this.height || firstAnimation.height;
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

  advance(dt) {
    super.advance(dt);

    if (this.currentAnimation) {
      this.currentAnimation.update(dt);
    }
  } // @endif


  draw() {
    // @ifdef SPRITE_IMAGE
    if (this.image) {
      this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    } // @endif
    // @ifdef SPRITE_ANIMATION


    if (this.currentAnimation) {
      this.currentAnimation.render({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        context: this.context
      });
    } // @endif


    if (this.color) {
      this.context.fillStyle = this.color;
      this.context.fillRect(0, 0, this.width, this.height);
    }
  }

}

function factory$3() {
  return new Sprite(...arguments);
}

factory$3.prototype = Sprite.prototype;
factory$3.class = Sprite;
let fontSizeRegex = /(\d+)(\w+)/;

function parseFont(font) {
  let match = font.match(fontSizeRegex); // coerce string to number
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types

  let size = +match[1];
  let unit = match[2];
  let computed = size; // compute font size
  // switch(unit) {
  //   // px defaults to the size
  //   // em uses the size of the canvas when declared (but won't keep in sync with
  //   // changes to the canvas font-size)
  //   case 'em': {
  //     let fontSize = window.getComputedStyle(getCanvas()).fontSize;
  //     let parsedSize = parseFont(fontSize).size;
  //     computed = size * parsedSize;
  //   }
  //   // rem uses the size of the HTML element when declared (but won't keep in
  //   // sync with changes to the HTML element font-size)
  //   case 'rem': {
  //     let fontSize = window.getComputedStyle(document.documentElement).fontSize;
  //     let parsedSize = parseFont(fontSize).size;
  //     computed = size * parsedSize;
  //   }
  // }

  return {
    size,
    unit,
    computed
  };
}
/**
 * An object for drawing text to the screen. Supports newline characters as well as automatic new lines when setting the `width` property.
 *
 * You can also display RTL languages by setting the attribute `dir="rtl"` on the main canvas element. Due to the limited browser support for individual text to have RTL settings, it must be set globally for the entire game.
 *
 * @example
 * // exclude-code:start
 * let { Text } = kontra;
 * // exclude-code:end
 * // exclude-script:start
 * import { Text } from 'kontra';
 * // exclude-script:end
 *
 * let text = Text({
 *   text: 'Hello World!\nI can even be multiline!',
 *   font: '32px Arial',
 *   color: 'white',
 *   x: 300,
 *   y: 100,
 *   anchor: {x: 0.5, y: 0.5},
 *   textAlign: 'center'
 * });
 * // exclude-code:start
 * text.context = context;
 * // exclude-code:end
 *
 * text.render();
 * @class Text
 * @extends GameObject
 *
 * @param {Object} properties - Properties of the text.
 * @param {String} properties.text - The text to display.
 * @param {String} [properties.font] - The [font](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) style. Defaults to the main context font.
 * @param {String} [properties.color] - Fill color for the text. Defaults to the main context fillStyle.
 * @param {Number} [properties.width] - Set a fixed width for the text. If set, the text will automatically be split into new lines that will fit the size when possible.
 * @param {String} [properties.textAlign='left'] - The [textAlign](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) for the context. If the `dir` attribute is set to `rtl` on the main canvas, the text will automatically be aligned to the right, but you can override that by setting this property.
 * @param {Number} [properties.lineHeight=1] - The distance between two lines of text.
 */


class Text extends factory$2.class {
  init({
    // --------------------------------------------------
    // defaults
    // --------------------------------------------------

    /**
     * The string of text. Use newline characters to create multi-line strings.
     * @memberof Text
     * @property {String} text
     */
    text = '',

    /**
     * The text alignment.
     * @memberof Text
     * @property {String} textAlign
     */
    textAlign = '',

    /**
     * The distance between two lines of text. The value is multiplied by the texts font size.
     * @memberof Text
     * @property {Number} lineHeight
     */
    lineHeight = 1,

    /**
     * The font style.
     * @memberof Text
     * @property {String} font
     */
    font = getContext().font,

    /**
     * The color of the text.
     * @memberof Text
     * @property {String} color
     */
    ...props
  } = {}) {
    super.init({
      text,
      textAlign,
      lineHeight,
      font,
      ...props
    }); // p = prerender

    this._p();
  } // keep width and height getters/settings so we can set _w and _h and not
  // trigger infinite call loops


  get width() {
    // w = width
    return this._w;
  }

  set width(value) {
    // d = dirty
    this._d = true;
    this._w = value; // fw = fixed width

    this._fw = value;
  }

  get text() {
    return this._t;
  }

  set text(value) {
    this._d = true;
    this._t = value;
  }

  get font() {
    return this._f;
  }

  set font(value) {
    this._d = true;
    this._f = value;
    this._fs = parseFont(value).computed;
  }

  get lineHeight() {
    // lh = line height
    return this._lh;
  }

  set lineHeight(value) {
    this._d = true;
    this._lh = value;
  }

  render() {
    if (this._d) {
      this._p();
    }

    super.render();
  }
  /**
   * Calculate the font width, height, and text strings before rendering.
   */


  _p() {
    // s = strings
    this._s = [];
    this._d = false;
    let context = this.context;
    context.font = this.font; // @ifdef TEXT_AUTONEWLINE

    if (!this._s.length && this._fw) {
      let parts = this.text.split(' ');
      let start = 0;
      let i = 2; // split the string into lines that all fit within the fixed width

      for (; i <= parts.length; i++) {
        let str = parts.slice(start, i).join(' ');
        let width = context.measureText(str).width;

        if (width > this._fw) {
          this._s.push(parts.slice(start, i - 1).join(' '));

          start = i - 1;
        }
      }

      this._s.push(parts.slice(start, i).join(' '));
    } // @endif
    // @ifdef TEXT_NEWLINE


    if (!this._s.length && this.text.includes('\n')) {
      let width = 0;
      this.text.split('\n').map(str => {
        this._s.push(str);

        width = Math.max(width, context.measureText(str).width);
      });
      this._w = this._fw || width;
    } // @endif


    if (!this._s.length) {
      this._s.push(this.text);

      this._w = this._fw || context.measureText(this.text).width;
    }

    this.height = this._fs + (this._s.length - 1) * this._fs * this.lineHeight;

    this._uw();
  }

  draw() {
    let alignX = 0;
    let textAlign = this.textAlign;
    let context = this.context; // @ifdef TEXT_RTL

    textAlign = this.textAlign || (context.canvas.dir === 'rtl' ? 'right' : 'left'); // @endif
    // @ifdef TEXT_ALIGN||TEXT_RTL

    alignX = textAlign === 'right' ? this.width : textAlign === 'center' ? this.width / 2 | 0 : 0; // @endif

    this._s.map((str, index) => {
      context.textBaseline = 'top';
      context.textAlign = textAlign;
      context.fillStyle = this.color;
      context.font = this.font;
      context.fillText(str, alignX, this._fs * this.lineHeight * index);
    });
  }

}

function factory$4() {
  return new Text(...arguments);
}

factory$4.prototype = Text.prototype;
factory$4.class = Text;
/**
 * A simple pointer API. You can use it move the main sprite or respond to a pointer event. Works with both mouse and touch events.
 *
 * Pointer events can be added on a global level or on individual sprites or objects. Before an object can receive pointer events, you must tell the pointer which objects to track and the object must haven been rendered to the canvas using `object.render()`.
 *
 * After an object is tracked and rendered, you can assign it an `onDown()`, `onUp()`, `onOver()`, or `onOut()` functions which will be called whenever a pointer down, up, over, or out event happens on the object.
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
 *   },
 *   onOut: function() {
 *     // handle on out events on the sprite
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

let pointers = new WeakMap();
let callbacks$1 = {};
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
 * Get the pointer object which contains the `radius`, current `x` and `y` position of the pointer relative to the top-left corner of the canvas, and which `canvas` the pointer applies to.
 *
 * ```js
 * import { initPointer, getPointer } from 'kontra';
 *
 * initPointer();
 *
 * console.log(getPointer());  //=> { x: 100, y: 200, radius: 5, canvas: <canvas> };
 * ```
 *
 * @function getPointer
 *
 * @param {HTMLCanvasElement} [canvas] - The canvas which maintains the pointer. Defaults to [core.getCanvas()](api/core#getCanvas).
 *
 * @returns {{x: Number, y: Number, radius: Number, canvas: HTMLCanvasElement, touches: Object}} pointer with properties `x`, `y`, and `radius`. If using touch events, also has a `touches` object with keys of the touch identifier and the x/y position of the touch as the value.
 */

function getPointer(canvas = getCanvas()) {
  return pointers.get(canvas);
}
/**
 * Detection collision between a rectangle and a circle.
 * @see https://yal.cc/rectangle-circle-intersection-test/
 *
 * @param {Object} object - Object to check collision against.
 */


function circleRectCollision(object, pointer) {
  let {
    x,
    y,
    width,
    height
  } = getWorldRect(object); // account for camera

  do {
    x -= object.sx || 0;
    y -= object.sy || 0;
  } while (object = object.parent);

  let dx = pointer.x - Math.max(x, Math.min(pointer.x, x + width));
  let dy = pointer.y - Math.max(y, Math.min(pointer.y, y + height));
  return dx * dx + dy * dy < pointer.radius * pointer.radius;
}
/**
 * Get the first on top object that the pointer collides with.
 *
 * @param {Object} pointer - The pointer object
 *
 * @returns {Object} First object to collide with the pointer.
 */


function getCurrentObject(pointer) {
  // if pointer events are required on the very first frame or
  // without a game loop, use the current frame
  let renderedObjects = pointer._lf.length ? pointer._lf : pointer._cf;

  for (let i = renderedObjects.length - 1; i >= 0; i--) {
    let object = renderedObjects[i];
    let collides = object.collidesWithPointer ? object.collidesWithPointer(pointer) : circleRectCollision(object, pointer);

    if (collides) {
      return object;
    }
  }
}
/**
 * Get the style property value.
 */


function getPropValue(style, value) {
  return parseFloat(style.getPropertyValue(value)) || 0;
}
/**
 * Calculate the canvas size, scale, and offset.
 *
 * @param {Object} The pointer object
 *
 * @returns {Object} The scale and offset of the canvas
 */


function getCanvasOffset(pointer) {
  // we need to account for CSS scale, transform, border, padding,
  // and margin in order to get the correct scale and offset of the
  // canvas
  let {
    canvas,
    _s
  } = pointer;
  let rect = canvas.getBoundingClientRect(); // @see https://stackoverflow.com/a/53405390/2124254

  let transform = _s.transform !== 'none' ? _s.transform.replace('matrix(', '').split(',') : [1, 1, 1, 1];
  let transformScaleX = parseFloat(transform[0]);
  let transformScaleY = parseFloat(transform[3]); // scale transform applies to the border and padding of the element

  let borderWidth = (getPropValue(_s, 'border-left-width') + getPropValue(_s, 'border-right-width')) * transformScaleX;
  let borderHeight = (getPropValue(_s, 'border-top-width') + getPropValue(_s, 'border-bottom-width')) * transformScaleY;
  let paddingWidth = (getPropValue(_s, 'padding-left') + getPropValue(_s, 'padding-right')) * transformScaleX;
  let paddingHeight = (getPropValue(_s, 'padding-top') + getPropValue(_s, 'padding-bottom')) * transformScaleY;
  return {
    scaleX: (rect.width - borderWidth - paddingWidth) / canvas.width,
    scaleY: (rect.height - borderHeight - paddingHeight) / canvas.height,
    offsetX: rect.left + (getPropValue(_s, 'border-left-width') + getPropValue(_s, 'padding-left')) * transformScaleX,
    offsetY: rect.top + (getPropValue(_s, 'border-top-width') + getPropValue(_s, 'padding-top')) * transformScaleY
  };
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
 *
 * @param {MouseEvent|TouchEvent} evt
 */


function blurEventHandler(evt) {
  let pointer = pointers.get(evt.target);
  pointer._oo = null;
  pressedButtons = {};
}
/**
 * Find the first object for the event and execute it's callback function
 *
 * @param {MouseEvent|TouchEvent} evt
 * @param {string} eventName - Which event was called.
 */


function pointerHandler(evt, eventName) {
  evt.preventDefault();
  let canvas = evt.target;
  let pointer = pointers.get(canvas);
  let {
    scaleX,
    scaleY,
    offsetX,
    offsetY
  } = getCanvasOffset(pointer);
  let isTouchEvent = ['touchstart', 'touchmove', 'touchend'].indexOf(evt.type) !== -1;

  if (isTouchEvent) {
    // update pointer.touches
    pointer.touches = {};

    for (var i = 0; i < evt.touches.length; i++) {
      pointer.touches[evt.touches[i].identifier] = {
        id: evt.touches[i].identifier,
        x: (evt.touches[i].clientX - offsetX) / scaleX,
        y: (evt.touches[i].clientY - offsetY) / scaleY,
        changed: false
      };
    } // handle all touches


    for (var i = evt.changedTouches.length; i--;) {
      const id = evt.changedTouches[i].identifier;

      if (typeof pointer.touches[id] !== "undefined") {
        pointer.touches[id].changed = true;
      }

      let clientX = evt.changedTouches[i].clientX;
      let clientY = evt.changedTouches[i].clientY;
      pointer.x = (clientX - offsetX) / scaleX;
      pointer.y = (clientY - offsetY) / scaleY; // Trigger events

      let object = getCurrentObject(pointer);

      if (object && object[eventName]) {
        object[eventName](evt);
      }

      if (callbacks$1[eventName]) {
        callbacks$1[eventName](evt, object);
      }
    }
  } else {
    // translate the scaled size back as if the canvas was at a
    // 1:1 scale
    pointer.x = (evt.clientX - offsetX) / scaleX;
    pointer.y = (evt.clientY - offsetY) / scaleY;
    let object = getCurrentObject(pointer);

    if (object && object[eventName]) {
      object[eventName](evt);
    }

    if (callbacks$1[eventName]) {
      callbacks$1[eventName](evt, object);
    } // handle onOut events


    if (eventName == 'onOver') {
      if (object != pointer._oo && pointer._oo && pointer._oo.onOut) {
        pointer._oo.onOut(evt);
      }

      pointer._oo = object;
    }
  }
}
/**
 * Initialize pointer event listeners. This function must be called before using other pointer functions.
 *
 * If you need to use multiple canvas, you'll have to initialize the pointer for each one individually as each canvas maintains its own pointer object.
 * @function initPointer
 *
 * @param {HTMLCanvasElement} [canvas] - The canvas that event listeners will be attached to. Defaults to [core.getCanvas()](api/core#getCanvas).
 *
 * @returns {{x: Number, y: Number, radius: Number, canvas: HTMLCanvasElement, touches: Object}} The pointer object for the canvas.
 */


function initPointer(canvas = getCanvas()) {
  let pointer = pointers.get(canvas);

  if (!pointer) {
    let style = window.getComputedStyle(canvas);
    pointer = {
      x: 0,
      y: 0,
      radius: 5,
      // arbitrary size
      touches: {},
      canvas,
      // cf = current frame, lf = last frame, o = objects,
      // oo = over object, _s = style
      _cf: [],
      _lf: [],
      _o: [],
      _oo: null,
      _s: style
    };
    pointers.set(canvas, pointer);
  } // if this function is called multiple times, the same event
  // won't be added multiple times
  // @see https://stackoverflow.com/questions/28056716/check-if-an-element-has-event-listener-on-it-no-jquery/41137585#41137585


  canvas.addEventListener('mousedown', pointerDownHandler);
  canvas.addEventListener('touchstart', pointerDownHandler);
  canvas.addEventListener('mouseup', pointerUpHandler);
  canvas.addEventListener('touchend', pointerUpHandler);
  canvas.addEventListener('touchcancel', pointerUpHandler);
  canvas.addEventListener('blur', blurEventHandler);
  canvas.addEventListener('mousemove', mouseMoveHandler);
  canvas.addEventListener('touchmove', mouseMoveHandler); // however, the tick event should only be registered once
  // otherwise it completely destroys pointer events

  if (!pointer._t) {
    pointer._t = true; // reset object render order on every new frame

    on('tick', () => {
      pointer._lf.length = 0;

      pointer._cf.map(object => {
        pointer._lf.push(object);
      });

      pointer._cf.length = 0;
    });
  }

  return pointer;
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
 * track(obj1, obj2);
 * ```
 * @function track
 *
 * @param {...Object[]} objects - Objects to track.
 */


function track(...objects) {
  objects.map(object => {
    let canvas = object.context ? object.context.canvas : getCanvas();
    let pointer = pointers.get(canvas); // @ifdef DEBUG

    if (!pointer) {
      throw new ReferenceError('Pointer events not initialized for the objects canvas');
    } // @endif
    // override the objects render function to keep track of render
    // order


    if (!object._r) {
      object._r = object.render;

      object.render = function () {
        pointer._cf.push(this);

        this._r();
      };

      pointer._o.push(object);
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
 * untrack(obj1, obj2);
 * ```
 * @function untrack
 *
 * @param {...Object[]} objects - Object or objects to stop tracking.
 */


function untrack(...objects) {
  objects.map(object => {
    let canvas = object.context ? object.context.canvas : getCanvas();
    let pointer = pointers.get(canvas); // @ifdef DEBUG

    if (!pointer) {
      throw new ReferenceError('Pointer events not initialized for the objects canvas');
    } // @endif
    // restore original render function to no longer track render order


    object.render = object._r;
    object._r = 0; // 0 is the shortest falsy value

    let index = pointer._o.indexOf(object);

    if (index !== -1) {
      pointer._o.splice(index, 1);
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
 * track(sprite1, sprite2);
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
  let canvas = object.context ? object.context.canvas : getCanvas();
  let pointer = pointers.get(canvas); // @ifdef DEBUG

  if (!pointer) {
    throw new ReferenceError('Pointer events not initialized for the objects canvas');
  } // @endif


  return pointer._o.includes(object) && getCurrentObject(pointer) === object;
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
 * @param {(evt: MouseEvent|TouchEvent, object?: Object) => void} callback - Function to call on pointer down.
 */


function onPointerDown(callback) {
  callbacks$1.onDown = callback;
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
 * @param {(evt: MouseEvent|TouchEvent, object?: Object) => void} callback - Function to call on pointer up.
 */


function onPointerUp(callback) {
  callbacks$1.onUp = callback;
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
 * An accessible button. Supports screen readers and keyboard navigation using the <kbd>Tab</kbd> key. The button is automatically [tracked](api/pointer#track) by the pointer and accepts all pointer functions, but you will still need to call [initPointer](api/pointer#initPointer) to have pointer events enabled.
 * @class Button
 * @extends Sprite
 *
 * @param {Object} [properties] - Properties of the button (in addition to all Sprite properties).
 * @param {Object} [properties.text] - Properties of [Text](api/text) which are used to create the [textNode](api/button#textNode).
 * @param {Number} [properties.padX=0] - The horizontal padding.
 * @param {Number} [properties.padY=0] - The vertical padding.
 * @param {Function} [properties.onEnable] - Function called when the button is enabled.
 * @param {Function} [properties.onDisable] - Function called when the button is disabled.
 * @param {Function} [properties.onFocus] - Function called when the button is focused by the keyboard.
 * @param {Function} [properties.onBlur] - Function called when the button losses focus either by the pointer or keyboard.
 */


class Button extends factory$3.class {
  /**
   * @docs docs/api_docs/button.js
   */
  init({
    /**
     * The horizontal padding. This will be added to the width to give the final width of the button.
     * @memberof Button
     * @property {Number} padX
     */
    padX = 0,

    /**
     * The vertical padding. This will be added to the height to give the final height of the button.
     * @memberof Button
     * @property {Number} padY
     */
    padY = 0,
    text,
    onDown,
    onUp,
    ...props
  } = {}) {
    super.init({
      padX,
      padY,
      ...props
    });
    /**
     * Each Button creates a Text object and adds it as a child. The `text` of the Text object is used as the accessible name of the HTMLButtonElement.
     * @memberof Button
     * @property {Text} textNode
     */

    this.textNode = factory$4({ ...text,
      // ensure the text uses the same context as the button
      context: this.context
    }); // if the user didn't set a width/height or use an image
    // default to the textNode dimensions

    if (!this.width) {
      this.width = this.textNode.width;
      this.height = this.textNode.height;
    }

    track(this);
    this.addChild(this.textNode); // od = on down

    this._od = onDown || noop; // ou = on up

    this._ou = onUp || noop; // create an accessible DOM node for screen readers
    // dn = dom node

    const button = this._dn = document.createElement('button');
    button.style = srOnlyStyle;
    button.textContent = this.text; // sync events between the button element and the class

    button.addEventListener('focus', () => this.focus());
    button.addEventListener('blur', () => this.blur());
    button.addEventListener('keydown', evt => this._kd(evt));
    button.addEventListener('keyup', evt => this._ku(evt));
    addToDom(button, this.context.canvas);

    this._uw();

    this._p();
  }
  /**
   * The text property of the Text object.
   * @memberof Button
   * @property {String} text
   */


  get text() {
    return this.textNode.text;
  }

  set text(value) {
    // d = dirty
    this._d = true;
    this.textNode.text = value;
  }
  /**
   * Clean up the button by removing the HTMLButtonElement from the DOM.
   * @memberof Button
   * @function destroy
   */


  destroy() {
    this._dn.remove();
  }

  _p() {
    // update DOM node text if it has changed
    if (this.text !== this._dn.textContent) {
      this._dn.textContent = this.text;
    } // update width and height (need to prerender the button
    // first)


    this.textNode._p();

    let width = this.textNode.width + this.padX * 2;
    let height = this.textNode.height + this.padY * 2;
    this.width = Math.max(width, this.width);
    this.height = Math.max(height, this.height);

    this._uw();
  }

  render() {
    if (this._d) {
      this._p();
    }

    super.render();
  }
  /**
   * Enable the button. Calls [onEnable](api/button#onEnable) if passed.
   * @memberof Button
   * @function enable
   */


  enable() {
    /**
     * If the button is disabled.
     * @memberof Button
     * @property {Boolean} disabled
     */
    this.disabled = this._dn.disabled = false;
    this.onEnable();
  }
  /**
   * Disable the button. A disabled button will not longer render nor respond to pointer and keyboard events. Calls [onDisable](api/button#onDisable) if passed.
   * @memberof Button
   * @function disable
   */


  disable() {
    this.disabled = this._dn.disabled = true;
    this.onDisable();
  }
  /**
   * Focus the button. Calls [onFocus](api/button#onFocus) if passed.
   * @memberof Button
   * @function focus
   */


  focus() {
    if (!this.disabled) {
      /**
       * If the button is focused.
       * @memberof Button
       * @property {Boolean} focused
       */
      this.focused = true; // prevent infinite loop

      if (document.activeElement != this._dn) this._dn.focus();
      this.onFocus();
    }
  }
  /**
   * Blur the button. Calls [onBlur](api/button#onBlur) if passed.
   * @memberof Button
   * @function blur
   */


  blur() {
    this.focused = false; // prevent infinite loop

    if (document.activeElement == this._dn) this._dn.blur();
    this.onBlur();
  }

  onOver() {
    if (!this.disabled) {
      /**
       * If the button is hovered.
       * @memberof Button
       * @property {Boolean} hovered
       */
      this.hovered = true;
    }
  }

  onOut() {
    this.hovered = false;
  }
  /**
   * Function called when then button is enabled. Override this function to have the button do something when enabled.
   * @memberof Button
   * @function onEnable
   */


  onEnable() {}
  /**
   * Function called when then button is disabled. Override this function to have the button do something when disabled.
   * @memberof Button
   * @function onDisable
   */


  onDisable() {}
  /**
   * Function called when then button is focused. Override this function to have the button do something when focused.
   * @memberof Button
   * @function onFocus
   */


  onFocus() {}
  /**
   * Function called when then button is blurred. Override this function to have the button do something when blurred.
   * @memberof Button
   * @function onBlur
   */


  onBlur() {}

  onDown() {
    if (!this.disabled) {
      /**
       * If the button is pressed.
       * @memberof Button
       * @property {Boolean} pressed
       */
      this.pressed = true;

      this._od();
    }
  }

  onUp() {
    if (!this.disabled) {
      this.pressed = false;

      this._ou();
    }
  } // kd = keydown


  _kd(evt) {
    // activate button on enter or space
    if (evt.code == 'Enter' || evt.code == 'Space') {
      this.onDown();
    }
  } // kd = keydown


  _ku(evt) {
    // activate button on enter or space
    if (evt.code == 'Enter' || evt.code == 'Space') {
      this.onUp();
    }
  }

}

function factory$5() {
  return new Button(...arguments);
}

factory$5.prototype = Button.prototype;
factory$5.class = Button;
/**
 * Clear the canvas.
 */

function clear(context) {
  let canvas = context.canvas;
  context.clearRect(0, 0, canvas.width, canvas.height);
}
/**
 * The game loop updates and renders the game every frame. The game loop is stopped by default and will not start until the loops `start()` function is called.
 *
 * The game loop uses a time-based animation with a fixed `dt` to [avoid frame rate issues](http://blog.sklambert.com/using-time-based-animation-implement/). Each update call is guaranteed to equal 1/60 of a second.
 *
 * This means that you can avoid having to do time based calculations in your update functions and instead do fixed updates.
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
 * @class GameLoop
 *
 * @param {Object} properties - Properties of the game loop.
 * @param {(dt?: Number) => void} [properties.update] - Function called every frame to update the game. Is passed the fixed `dt` as a parameter.
 * @param {Function} properties.render - Function called every frame to render the game.
 * @param {Number}   [properties.fps=60] - Desired frame rate.
 * @param {Boolean}  [properties.clearCanvas=true] - Clear the canvas every frame before the `render()` function is called.
 * @param {CanvasRenderingContext2D} [properties.context] - The context that should be cleared each frame if `clearContext` is not set to `false`. Defaults to [core.getContext()](api/core#getContext).
 */


function GameLoop({
  fps = 60,
  clearCanvas = true,
  update = noop,
  render,
  context = getContext()
} = {}) {
  // check for required functions
  // @ifdef DEBUG
  if (!render) {
    throw Error('You must provide a render() function');
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

    clearFn(context);
    loop.render();
  } // game loop object


  loop = {
    /**
     * Called every frame to update the game. Put all of your games update logic here.
     * @memberof GameLoop
     * @function update
     *
     * @param {Number} [dt] - The fixed dt time of 1/60 of a frame.
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
    // @ifdef DEBUG
    _frame: frame,

    set _last(value) {
      last = value;
    } // @endif


  };
  return loop;
}

let handler = {
  set(obj, prop, value) {
    // don't set dirty for private properties
    if (!prop.startsWith('_')) {
      obj._d = true;
    }

    return Reflect.set(obj, prop, value);
  }

};
let alignment = {
  start(rtl) {
    return rtl ? 1 : 0;
  },

  center() {
    return 0.5;
  },

  end(rtl) {
    return rtl ? 0 : 1;
  }

};
/**
 * Quickly and easily organize your UI elements into a grid. Works great for auto placing menu options without having to figure out the position for each one. Based on the concept of CSS Grid Layout.
 * @class Grid
 * @extends GameObject
 *
 * @param {Object} [properties] - Properties of the grid manager.
 * @param {String} [properties.flow='column'] - The flow of the grid.
 * @param {String} [properties.align='start'] - The vertical alignment of the grid.
 * @param {String} [properties.justify='start'] - The horizontal alignment of the grid.
 * @param {Number|Number[]} [properties.colGap=0] - The horizontal gap between each column in the grid.
 * @param {Number|Number[]} [properties.rowGap=0] - The vertical gap between each row in the grid.
 * @param {Number} [properties.numCols=1] - The number of columns in the grid. Only applies if the `flow` property is set to `grid`.
 * @param {String} [properties.dir=''] - The direction of the grid.
 * @param {{metric: Function, callback: Function}[]} [properties.breakpoints=[]] - How the grid should change based on different metrics.
 */

class Grid extends factory$2.class {
  /**
   * @docs docs/api_docs/grid.js
   */
  init({
    /**
     * How to organize all objects in the grid. Valid values are:
     *
     * - `column` - organize into a single column
     * - `row` - organize into a single row
     * - `grid` - organize into a grid with [numCols](api/grid#numCols) number of columns
     * @memberof Grid
     * @property {String} flow
     */
    flow = 'column',

    /**
     * The vertical alignment of the grid. Valid values are:
     *
     * - `start` - align to the top of row
     * - `center` - align to the center of the row
     * - `end` - align to the the bottom of the row
     *
     * Additionally, each child of the grid can use the `alignSelf` property to change it's alignment in the grid.
     * @memberof Grid
     * @property {String} align
     */
    align = 'start',

    /**
     * The horizontal alignment of the grid. Valid values are:
     *
     * - `start` - align to the left of column
     * - `center` - align to the center of the column
     * - `end` - align to the the right of the column
     *
     * If the [dir](api/grid#dir) property is set to `rtl`, then `start` and `end` are reversed.
     *
     * Additionally, each child of the grid can use the `justifySelf` property to change it's alignment in the grid.
     * @memberof Grid
     * @property {String} justify
     */
    justify = 'start',

    /**
     * The horizontal gap between each column in the grid.
     *
     * An array of numbers means the grid will set the gap between columns using the order of the array. For example, if the gap is set to be `[10, 5]`, then every odd column gap with use 10 and every even column gap will use 5.
     * @memberof Grid
     * @property {Number|Number[]} colGap
     */
    colGap = 0,

    /**
    * The vertical gap between each row in the grid.
    *
    * An array of numbers means the grid will set the gap between rows using the order of the array. For example, if the gap is set to be `[10, 5]`, then every odd row gap with use 10 and every even row gap will use 5.
    * @memberof Grid
    * @property {Number|Number[]} rowGap
    */
    rowGap = 0,

    /**
     * The number of columns in the grid. Only applies if the [flow](api/grid#flow) property is set to `grid`.
     * @memberof Grid
     * @property {Number} numCols
     */
    numCols = 1,

    /**
     * The direction of the grid. Defaults to organizing the grid objects left-to-right, but if set to `rtl` then the grid is organized right-to-left.
     * @memberof Grid
     * @property {String} dir
     */
    dir = '',

    /**
     * How the grid should change based on different metrics. Based on the concept of CSS Media Queries so you can update how the grid organizes the objects when things change (such as the scale).
     *
     * Each object in the array uses the `metric()` function to determine when the breakpoint applies and the `callback()` function is called to change any properties of the grid.
     *
     * ```js
     * let { Grid } = kontra;
     *
     * let grid = Grid({
     *   breakpoints: [{
     *     metric() {
     *       return this.scaleX < 1
     *     },
     *     callback() {
     *       this.numCols = 1;
     *     }
     *   },
     *   {
     *     metric() {
     *       return this.scaleX >= 1
     *     },
     *     callback() {
     *       this.numCols = 2;
     *     }
     *   }]
     * });
     * ```
     * @memberof Grid
     * @property {{metric: Function, callback: Function}[]} breakpoints
     */
    breakpoints = [],
    ...props
  } = {}) {
    super.init({
      flow,
      align,
      justify,
      colGap,
      rowGap,
      numCols,
      dir,
      breakpoints,
      ...props
    });

    this._p();

    return new Proxy(this, handler);
  }

  addChild(child) {
    this._d = true;
    super.addChild(child);
  }

  removeChild(child) {
    this._d = true;
    super.removeChild(child);
  }

  render() {
    if (this._d) {
      this._p();
    }

    super.render();
  }
  /**
   * Call `destroy()` on all children.
   * @memberof Grid
   * @function destroy
   */


  destroy() {
    this.children.map(child => child.destroy && child.destroy());
  }
  /**
   * Build the grid and calculate its width and height
   */


  _p() {
    this._d = false;
    this.breakpoints.map(breakpoint => {
      // b = breakpoint
      if (breakpoint.metric.call(this) && this._b !== breakpoint) {
        this._b = breakpoint;
        breakpoint.callback.call(this);
      }
    }); // g = grid, cw = colWidths, rh = rowHeights

    let grid = this._g = [];
    let colWidths = this._cw = [];
    let rowHeights = this._rh = [];
    let children = this.children; // nc = numCols

    let numCols = this._nc = this.flow === 'column' ? 1 : this.flow === 'row' ? children.length : this.numCols;
    let row = 0;
    let col = 0;

    for (let i = 0, child; child = children[i]; i++) {
      grid[row] = grid[row] || []; // prerender child to get current width/height

      if (child._p) {
        child._p();
      }

      rowHeights[row] = Math.max(rowHeights[row] || 0, child.height);
      let spans = child.colSpan || 1;
      let colSpan = spans;

      do {
        colWidths[col] = Math.max(colWidths[col] || 0, child.width / colSpan);
        grid[row][col] = child;
      } while (colSpan + col++ <= numCols && --spans);

      if (col >= numCols) {
        col = 0;
        row++;
      }
    } // fill remaining row


    while (col > 0 && col < numCols) {
      // add empty array item so we can reverse a row even when it
      // contains less items than another row
      grid[row][col++] = false;
    }

    let numRows = grid.length;
    let colGap = [].concat(this.colGap);
    let rowGap = [].concat(this.rowGap);
    this._w = colWidths.reduce((acc, width) => acc += width, 0);

    for (let i = 0; i < numCols - 1; i++) {
      this._w += colGap[i % colGap.length];
    }

    this._h = rowHeights.reduce((acc, height) => acc += height, 0);

    for (let i = 0; i < numRows - 1; i++) {
      this._h += rowGap[i % rowGap.length];
    }

    this._uw(); // reverse columns. direction property overrides canvas dir


    let dir = this.context.canvas.dir;
    let rtl = dir === 'rtl' && !this.dir || this.dir === 'rtl';
    this._rtl = rtl;

    if (rtl) {
      this._g = grid.map(row => row.reverse());
      this._cw = colWidths.reverse();
    }

    let topLeftY = -this.anchor.y * this.height;
    let rendered = [];

    this._g.map((gridRow, row) => {
      let topLeftX = -this.anchor.x * this.width;
      gridRow.map((child, col) => {
        // don't render the same child multiple times if it uses colSpan
        if (child && !rendered.includes(child)) {
          rendered.push(child);
          let justify = alignment[child.justifySelf || this.justify](this._rtl);
          let align = alignment[child.alignSelf || this.align]();
          let colSpan = child.colSpan || 1;
          let colWidth = colWidths[col];

          if (colSpan > 1 && col + colSpan <= this._nc) {
            for (let i = 1; i < colSpan; i++) {
              colWidth += colWidths[col + i] + colGap[(col + i) % colGap.length];
            }
          }

          let pointX = colWidth * justify;
          let pointY = rowHeights[row] * align;
          let anchorX = 0;
          let anchorY = 0;
          let {
            width,
            height
          } = child;

          if (child.anchor) {
            anchorX = child.anchor.x;
            anchorY = child.anchor.y;
          } // calculate the x position based on the alignment and
          // anchor of the object


          if (justify === 0) {
            pointX = pointX + width * anchorX;
          } else if (justify === 0.5) {
            let sign = anchorX < 0.5 ? -1 : anchorX === 0.5 ? 0 : 1;
            pointX = pointX + sign * width * justify;
          } else {
            pointX = pointX - width * (1 - anchorX);
          } // calculate the y position based on the justification and
          // anchor of the object


          if (align === 0) {
            pointY = pointY + height * anchorY;
          } else if (align === 0.5) {
            let sign = anchorY < 0.5 ? -1 : anchorY === 0.5 ? 0 : 1;
            pointY = pointY + sign * height * align;
          } else {
            pointY = pointY - height * (1 - anchorY);
          }

          child.x = topLeftX + pointX;
          child.y = topLeftY + pointY;
        }

        topLeftX += colWidths[col] + colGap[col % colGap.length];
      });
      topLeftY += rowHeights[row] + rowGap[row % rowGap.length];
    });
  }

}

function factory$6() {
  return new Grid(...arguments);
}

factory$6.prototype = Grid.prototype;
factory$6.class = Grid;
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
 * Below is a list of keys that are provided by default. If you need to extend this list, you can use the [keyMap](api/keyboard#keyMap) property.
 *
 * - a-z
 * - 0-9
 * - enter, esc, space, left, up, right, down
 * @sectionName Available Keys
 */

let callbacks$2 = {};
let pressedKeys = {};
/**
 * A map of [KeyboardEvent code values](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values) to key names. Add to this object to expand the list of [available keys](api/keyboard#available-keys).
 *
 * ```js
 * import { keyMap, bindKeys } from 'kontra';
 *
 * keyMap['ControlRight'] = 'ctrl';
 *
 * bindKeys('ctrl', function(e) {
 *   // handle ctrl key
 * });
 * ```
 * @property {{[key in (String|Number)]: string}} keyMap
 */

let keyMap = {
  // named keys
  'Enter': 'enter',
  'Escape': 'esc',
  'Space': 'space',
  'ArrowLeft': 'left',
  'ArrowUp': 'up',
  'ArrowRight': 'right',
  'ArrowDown': 'down'
};
/**
 * Execute a function that corresponds to a keyboard key.
 *
 * @param {KeyboardEvent} evt
 */

exports.keyMap = keyMap;

function keydownEventHandler(evt) {
  let key = keyMap[evt.code];
  pressedKeys[key] = true;

  if (callbacks$2[key]) {
    callbacks$2[key](evt);
  }
}
/**
 * Set the released key to not being pressed.
 *
 * @param {KeyboardEvent} evt
 */


function keyupEventHandler(evt) {
  pressedKeys[keyMap[evt.code]] = false;
}
/**
 * Reset pressed keys.
 */


function blurEventHandler$1() {
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
    keyMap[i + 65] = keyMap['Key' + String.fromCharCode(i + 65)] = String.fromCharCode(i + 97);
  } // numeric keys


  for (i = 0; i < 10; i++) {
    keyMap[48 + i] = keyMap['Digit' + i] = '' + i;
  }

  window.addEventListener('keydown', keydownEventHandler);
  window.addEventListener('keyup', keyupEventHandler);
  window.addEventListener('blur', blurEventHandler$1);
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
 * @param {(evt: KeyboardEvent) => void} callback - The function to be called when the key is pressed.
 */


function bindKeys(keys, callback) {
  // smaller than doing `Array.isArray(keys) ? keys : [keys]`
  [].concat(keys).map(key => callbacks$2[key] = callback);
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
  [].concat(keys).map(key => callbacks$2[key] = 0);
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
 * A fast and memory efficient [object pool](https://gameprogrammingpatterns.com/object-pool.html) for sprite reuse. Perfect for particle systems or SHUMPs. The pool starts out with just one object, but will grow in size to accommodate as many objects as are needed.
 *
 * <canvas width="600" height="200" id="pool-example"></canvas>
 * <script src="assets/js/pool.js"></script>
 * @class Pool
 *
 * @param {Object} properties - Properties of the pool.
 * @param {() => {update: (dt?: number) => void, render: Function, init: (properties?: object) => void, isAlive: () => boolean}} properties.create - Function that returns a new object to be added to the pool when there are no more alive objects.
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
    // @ifdef DEBUG
    let obj;

    if (!create || !(obj = create()) || !(obj.update && obj.init && obj.isAlive && obj.render)) {
      throw Error('Must provide create() function which returns an object with init(), update(), render(), and isAlive() functions');
    } // @endif
    // c = create


    this._c = create;
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

    this.size = 0;
    /**
     * The maximum number of objects allowed in the pool. The pool will never grow beyond this size.
     * @memberof Pool
     * @property {Number} maxSize
     */

    this.maxSize = maxSize;
  }
  /**
   * Get and return an object from the pool. The properties parameter will be passed directly to the objects `init()` function. If you're using a [Sprite](api/sprite), you should also pass the `ttl` property to designate how many frames you want the object to be alive for.
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
   * @param {Object} [properties] - Properties to pass to the objects `init()` function.
   *
   * @returns {Object} The newly initialized object.
   */


  get(properties = {}) {
    // the pool is out of objects if the first object is in use and it can't grow
    if (this.size === this.objects.length) {
      if (this.size === this.maxSize) {
        return;
      } // double the size of the array by adding twice as many new objects to the end
      else {
          for (let i = 0; i < this.size && this.objects.length < this.maxSize; i++) {
            this.objects.push(this._c());
          }
        }
    } // save off first object in pool to reassign to last object after unshift


    let obj = this.objects[this.size];
    this.size++;
    obj.init(properties);
    return obj;
  }
  /**
   * Returns an array of all alive objects. Useful if you need to do special processing on all alive objects outside of the pool, such as to add all alive objects to a [Quadtree](api/quadtree).
   * @memberof Pool
   * @function getAliveObjects
   *
   * @returns {Object[]} An Array of all alive objects.
   */


  getAliveObjects() {
    return this.objects.slice(0, this.size);
  }
  /**
   * Clear the object pool. Removes all objects from the pool and resets its [size](api/pool#size) to 1.
   * @memberof Pool
   * @function clear
   */


  clear() {
    this.size = this.objects.length = 0;
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
    let obj;
    let doSort = false;

    for (let i = this.size; i--;) {
      obj = this.objects[i];
      obj.update(dt);

      if (!obj.isAlive()) {
        doSort = true;
        this.size--;
      }
    } // sort all dead elements to the end of the pool


    if (doSort) {
      this.objects.sort((a, b) => b.isAlive() - a.isAlive());
    }
  }
  /**
   * Render all alive objects in the pool by calling the objects `render()` function.
   * @memberof Pool
   * @function render
   */


  render() {
    for (let i = this.size; i--;) {
      this.objects[i].render();
    }
  }

}

function factory$7() {
  return new Pool(...arguments);
}

factory$7.prototype = Pool.prototype;
factory$7.class = Pool;
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
  let horizontalMidpoint = bounds.y + bounds.height / 2;
  let {
    x,
    y,
    width,
    height
  } = getWorldRect(object); // save off quadrant checks for reuse

  let intersectsTopQuadrants = object.y < horizontalMidpoint;
  let intersectsBottomQuadrants = object.y + object.height >= horizontalMidpoint; // object intersects with the left quadrants

  if (object.x < verticalMidpoint) {
    if (intersectsTopQuadrants) {
      // top left
      indices.push(0);
    }

    if (intersectsBottomQuadrants) {
      // bottom left
      indices.push(2);
    }
  } // object intersects with the right quadrants


  if (object.x + object.width >= verticalMidpoint) {
    if (intersectsTopQuadrants) {
      // top right
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
 * @param {Object} [properties] - Properties of the quadtree.
 * @param {Number} [properties.maxDepth=3] - Maximum node depth of the quadtree.
 * @param {Number} [properties.maxObjects=25] - Maximum number of objects a node can have before splitting.
 * @param {{x: Number, y: Number, width: Number, height: Number}} [properties.bounds] - The 2D space (x, y, width, height) the quadtree occupies. Defaults to the entire canvas width and height.
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
     * @property {{x: Number, y: Number, width: Number, height: Number}} bounds
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
   * @param {{x: Number, y: Number, width: Number, height: Number}} object - Object to use for finding other objects. The object must have the properties `x`, `y`, `width`, and `height` so that its position in the quadtree can be calculated.
   *
   * @returns {Object[]} A list of objects in the same node as the object, not including the object itself.
   */


  get(object) {
    // since an object can belong to multiple nodes we should not add it multiple times
    let objects = new Set(); // traverse the tree until we get to a leaf node

    while (this._s.length && this._b) {
      getIndices(object, this.bounds).map(index => {
        this._s[index].get(object).map(obj => objects.add(obj));
      });
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
   * @param {...Object[]} objects - Objects to add to the quadtree.
   */


  add(...objects) {
    objects.map(object => {
      // add a group of objects separately
      if (Array.isArray(object)) {
        this.add.apply(this, object);
        return;
      } // current node has subnodes, so we need to add this object into a subnode


      if (this._b) {
        this._a(object);

        return;
      } // this node is a leaf node so add the object to it


      this._o.push(object); // split the node if there are too many objects


      if (this._o.length > this.maxObjects && this._d < this.maxDepth) {
        this._sp(); // move all objects to their corresponding subnodes


        this._o.map(obj => this._a(obj));

        this._o.length = 0;
      }
    });
  }
  /**
   * Add an object to a subnode.
   *
   * @param {Object} object - Object to add into a subnode
   */


  _a(object) {
    // add the object to all subnodes it intersects
    getIndices(object, this.bounds).map(index => {
      this._s[index].add(object);
    });
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
      this._s[i] = new Quadtree({
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
      /* @ifdef VISUAL_DEBUG */

      this._s[i]._p = this;
      /* @endif */
    }
  }
  /**
   * Draw the quadtree. Useful for visual debugging.
   */

  /* @ifdef VISUAL_DEBUG **
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

function factory$8() {
  return new Quadtree(...arguments);
}

factory$8.prototype = Quadtree.prototype;
factory$8.class = Quadtree;

function getAllNodes(object) {
  let nodes = [];

  if (object._dn) {
    nodes.push(object._dn);
  } else if (object.children) {
    object.children.map(child => {
      nodes = nodes.concat(getAllNodes(child));
    });
  }

  return nodes;
}
/**
 * A scene object for organizing a group of objects that will update and render together.
 *
 * ```js
 * import { Scene, Sprite } from 'kontra';
 *
 * sprite = Sprite({
 *   x: 100,
 *   y: 200,
 *   width: 20,
 *   height: 40,
 *   color: 'red'
 * });
 *
 * scene = Scene({
 *   id: 'game',
 *   children: [sprite]
 * });
 *
 * scene.render();
 * ```
 *
 * @class Scene
 * @extends GameObject
 *
 * @param {Object} properties - Properties of the scene.
 * @param {String} properties.id - The id of the scene.
 * @param {String} [properties.name=properties.id] - The name of the scene. Used by screen readers to identify each scene. Use this property to give the scene a human friendly name.
 * @param {Boolean} [properties.cullObjects=true] - If the scene should not render objects outside the camera bounds.
 * @param {Function} [properties.cullFunction] - The function used to filter objects to render. Defaults to [helpers.collides](api/helpers#collides).
 * @param {Function} [properties.onShow] - Function called when the scene is shown.
 * @param {Function} [properties.onHide] - Function called when the scene is hidden.
 */


class Scene extends factory$2.class {
  init({
    /**
     * The id of the scene.
     * @memberof Scene
     * @property {String} id
     */
    id,

    /**
     * The name of the scene. Used by screen readers to identify each scene. Use this property to give the scene a human friendly name.
     * @memberof Scene
     * @property {String} name
     */
    name = id,

    /**
     * If the camera should cull objects outside the camera bounds. Not rendering objects which can't be seen greatly improves the performance.
     * @memberof Scene
     * @property {Boolean} cullObjects
     */
    cullObjects = true,

    /**
    * Camera culling function which prevents objects outside the camera screen from rendering. Is passed as the `filterFunction` to the [render](api/gameObject#render) function.
    * @memberof Scene
    * @property {Function} cullFunction
    */
    cullFunction = collides,
    ...props
  }) {
    // create an accessible DOM node for screen readers (do this first
    // so we can move DOM nodes in addChild)
    // dn = dom node
    const section = this._dn = document.createElement('section');
    section.tabIndex = -1;
    section.style = srOnlyStyle;
    section.id = id;
    section.setAttribute('aria-label', name);
    super.init({
      id,
      name,
      cullObjects,
      cullFunction,
      ...props
    });
    addToDom(section, this.context.canvas);
    let canvas = this.context.canvas;
    /**
     * The camera object which is used as the focal point for the scene. The scene will not render objects that are outside the bounds of the camera.
     *
     * Additionally, the camera can be used to [lookAt](api/scene#lookAt) an object which will center the camera to that object. This allows you to zoom the scene in and out while the camera remains centered on the object.
     * @memberof Scene
     * @property {GameObject} camera
     */

    this.camera = factory$2({
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: canvas.width,
      height: canvas.height,
      anchor: {
        x: 0.5,
        y: 0.5
      }
    }); // can call super here only by using lexical scope

    this.camera._pc = () => {
      super._pc.call(this.camera); // only set the cameras position based on scale
      // but not the width/height


      let canvas = this.context.canvas;
      this.camera._wx = this.camera.x * this.scaleX;
      this.camera._wy = this.camera.y * this.scaleY;
    };
  }
  /**
   * Show the scene and resume update and render. Calls [onShow](api/scene#onShow) if passed.
   * @memberof Scene
   * @function show
   */


  show() {
    /**
     * If the scene is hidden.
     * @memberof Scene
     * @property {Boolean} hidden
     */
    this.hidden = this._dn.hidden = false; // find first focusable child

    let focusableChild = this.children.find(child => child.focus);

    if (focusableChild) {
      focusableChild.focus();
    } else {
      this._dn.focus();
    }

    this.onShow();
  }
  /**
   * Hide the scene. A hidden scene will not update or render. Calls [onHide](api/scene#onHide) if passed.
   * @memberof Scene
   * @function hide
   */


  hide() {
    this.hidden = this._dn.hidden = true;
    this.onHide();
  }

  addChild(object, options) {
    super.addChild(object, options); // move all children to be in the scenes DOM node so we can
    // hide and show the DOM node and thus hide and show all the
    // children

    getAllNodes(object).map(node => {
      this._dn.appendChild(node);
    });
  }

  removeChild(object) {
    super.removeChild(object);
    getAllNodes(object).map(node => {
      addToDom(node, this.context.canvas);
    });
  }
  /**
   * Clean up the scene and call `destroy()` on all children.
   * @memberof Scene
   * @function destroy
   */


  destroy() {
    this._dn.remove();

    this.children.map(child => child.destroy && child.destroy());
  }

  update(dt) {
    if (!this.hidden) {
      super.update(dt);
    }
  }
  /**
   * Focus the camera to the object or x/y position. As the scene is scaled the focal point will keep to the position.
   * @memberof Scene
   * @function lookAt
   *
   * @param {{x: number, y: number}} object - Object with x/y properties.
   */


  lookAt(object) {
    // don't call getWorldRect so we can ignore the objects anchor
    object = object.world || object;
    let x = object.x;
    let y = object.y;

    if (object.scaleX) {
      x /= object.scaleX;
      y /= object.scaleY;
    }

    this.camera.x = x;
    this.camera.y = y;

    this._pc();
  }

  _pc() {
    super._pc(); // this can be called before the camera is initialized so we
    // need to guard it


    this.camera && this.camera._pc();
  }

  render() {
    let {
      x,
      y,
      width,
      height
    } = this.camera;
    this.sx = x * this.scaleX - width / 2;
    this.sy = y * this.scaleY - height / 2;

    if (!this.hidden) {
      super.render(child => this.cullObjects ? this.cullFunction(child, this.camera) : true);
    }
  }
  /**
   * Function called when the scene is shown. Override this function to have the scene do something when shown.
   * @memberof Scene
   * @function onShow
   */


  onShow() {}
  /**
   * Function called when the scene is hidden. Override this function to have the scene do something when hidden.
   * @memberof Scene
   * @function onHide
   */


  onHide() {}

}

function factory$9() {
  return new Scene(...arguments);
}

factory$9.prototype = Scene.prototype;
factory$9.class = Scene;
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
 * A sprite sheet to animate a sequence of images. Used to create [animation sprites](api/sprite#animation-sprite).
 *
 * <figure>
 *   <a href="assets/imgs/character_walk_sheet.png">
 *     <img src="assets/imgs/character_walk_sheet.png" width="266" height="512" alt="11 frames of a walking pill-like alien wearing a space helmet.">
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
 * @param {HTMLImageElement|HTMLCanvasElement} properties.image - The sprite sheet image.
 * @param {Number} properties.frameWidth - The width of a single frame.
 * @param {Number} properties.frameHeight - The height of a single frame.
 * @param {Number} [properties.frameMargin=0] - The amount of whitespace between each frame.
 * @param {Object} [properties.animations] - Animations to create from the sprite sheet using [Animation](api/animation). Passed directly into the sprite sheets [createAnimations()](api/spriteSheet#createAnimations) function.
 */


class SpriteSheet {
  constructor({
    image,
    frameWidth,
    frameHeight,
    frameMargin,
    animations
  } = {}) {
    // @ifdef DEBUG
    if (!image) {
      throw Error('You must provide an Image for the SpriteSheet');
    } // @endif

    /**
     * An object of named [Animation](api/animation) objects. Typically you pass this object into [Sprite](api/sprite) to create an [animation sprites](api/spriteSheet#animation-sprite).
     * @memberof SpriteSheet
     * @property {Object} animations
     */


    this.animations = {};
    /**
     * The sprite sheet image.
     * @memberof SpriteSheet
     * @property {HTMLImageElement|HTMLCanvasElement} image
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
   * This function populates the sprite sheets `animations` property with [Animation](api/animation) objects. Each animation is accessible by its name.
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

      sequence = []; // @ifdef DEBUG

      if (frames === undefined) {
        throw Error('Animation ' + name + ' must provide a frames property');
      } // @endif
      // add new frames to the end of the array


      [].concat(frames).map(frame => {
        sequence = sequence.concat(parseFrames(frame));
      });
      this.animations[name] = factory({
        spriteSheet: this,
        frames: sequence,
        frameRate,
        loop
      });
    }
  }

}

function factory$a() {
  return new SpriteSheet(...arguments);
}

factory$a.prototype = SpriteSheet.prototype;
factory$a.class = SpriteSheet;
/**
 * A tile engine for managing and drawing tilesets.
 *
 * <figure>
 *   <a href="assets/imgs/mapPack_tilesheet.png">
 *     <img src="assets/imgs/mapPack_tilesheet.png" width="1088" height="768" alt="Tileset to create an overworld map in various seasons.">
 *   </a>
 *   <figcaption>Tileset image courtesy of <a href="https://kenney.nl/assets">Kenney</a>.</figcaption>
 * </figure>
 * @class TileEngine
 *
 * @param {Object} properties - Properties of the tile engine.
 * @param {Number} properties.width - Width of the tile map (in number of tiles).
 * @param {Number} properties.height - Height of the tile map (in number of tiles).
 * @param {Number} properties.tilewidth - Width of a single tile (in pixels).
 * @param {Number} properties.tileheight - Height of a single tile (in pixels).
 * @param {CanvasRenderingContext2D} [properties.context] - The context the tile engine should draw to. Defaults to [core.getContext()](api/core#getContext)
 *
 * @param {Object[]} properties.tilesets - Array of tileset objects.
 * @param {Number} properties.tilesetN.firstgid - First tile index of the tileset. The first tileset will have a firstgid of 1 as 0 represents an empty tile.
 * @param {String|HTMLImageElement} properties.tilesetN.image - Relative path to the HTMLImageElement or an HTMLImageElement. If passing a relative path, the image file must have been [loaded](api/assets#load) first.
 * @param {Number} [properties.tilesetN.margin=0] - The amount of whitespace between each tile (in pixels).
 * @param {Number} [properties.tilesetN.tilewidth] - Width of the tileset (in pixels). Defaults to properties.tilewidth.
 * @param {Number} [properties.tilesetN.tileheight] - Height of the tileset (in pixels). Defaults to properties.tileheight.
 * @param {String} [properties.tilesetN.source] - Relative path to the source JSON file. The source JSON file must have been [loaded](api/assets#load) first.
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

function TileEngine(properties) {
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
      this._sx = clamp(0, mapwidth - getCanvas().width, value);
      objects.forEach(obj => obj.sx = this._sx);
    },

    set sy(value) {
      this._sy = clamp(0, mapheight - getCanvas().height, value);
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

      if (layer._d) {
        layer._d = false;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        tileEngine._r(layer, canvas.getContext('2d'));
      }

      render(canvas);
    },

    /**
     * Check if the object collides with the layer (shares a gird coordinate with any positive tile index in layers data). The object being checked must have the properties `x`, `y`, `width`, and `height` so that its position in the grid can be calculated. [Sprite](api/sprite) defines these properties for you.
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
      let {
        x,
        y,
        width,
        height
      } = getWorldRect(object);
      let row = getRow(y);
      let col = getCol(x);
      let endRow = getRow(y + height);
      let endCol = getCol(x + width);
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
     * @param {{x: Number, y: Number}|{row: Number, col: Number}} position - Position of the tile in either {x, y} or {row, col} coordinates.
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
     * @param {{x: Number, y: Number}|{row: Number, col: Number}} position - Position of the tile in either {x, y} or {row, col} coordinates.
     * @param {Number} tile - Tile index to set.
     */
    setTileAtLayer(name, position, tile) {
      let row = position.row || getRow(position.y);
      let col = position.col || getCol(position.x);

      if (layerMap[name]) {
        this._d = true;
        layerMap[name]._d = true;
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
    * @param {String} name - Name of the layer.
    * @param {Number[]} data - 1D array of tile indices.
    */
    setLayer(name, data) {
      if (layerMap[name]) {
        this._d = true;
        layerMap[name]._d = true;
        layerMap[name].data = data;
      }
    },

    /**
     * Add an object to the tile engine. The tile engine will set the objects camera position (`sx`, `sy`) to be in sync with the tile engine camera. [Sprite](api/sprite) uses this information to draw the sprite to the correct position on the canvas.
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
    // @ifdef DEBUG
    layerCanvases: layerCanvases,
    layerMap: layerMap // @endif

  }, properties); // resolve linked files (source, image)

  tileEngine.tilesets.map(tileset => {
    // get the url of the Tiled JSON object (in this case, the properties object)
    let url = (window.__k ? window.__k.dm.get(properties) : '') || window.location.href;

    if (tileset.source) {
      // @ifdef DEBUG
      if (!window.__k) {
        throw Error(`You must use "load" or "loadData" to resolve tileset.source`);
      } // @endif


      let source = window.__k.d[window.__k.u(tileset.source, url)]; // @ifdef DEBUG


      if (!source) {
        throw Error(`You must load the tileset source "${tileset.source}" before loading the tileset`);
      } // @endif


      Object.keys(source).map(key => {
        tileset[key] = source[key];
      });
    }

    if ('' + tileset.image === tileset.image) {
      // @ifdef DEBUG
      if (!window.__k) {
        throw Error(`You must use "load" or "loadImage" to resolve tileset.image`);
      } // @endif


      let image = window.__k.i[window.__k.u(tileset.image, url)]; // @ifdef DEBUG


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
    (layer.data || []).map((tile, index) => {
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
        layer._d = false;
        layerMap[layer.name] = layer;

        if (layer.data && layer.visible !== false) {
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
  Animation: factory,
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
  Button: factory$5,
  init,
  getCanvas,
  getContext,
  on,
  off,
  emit,
  GameLoop,
  GameObject: factory$2,
  Grid: factory$6,
  degToRad,
  radToDeg,
  angleToTarget,
  rotatePoint,
  randInt,
  seedRand,
  lerp,
  inverseLerp,
  clamp,
  setStoreItem,
  getStoreItem,
  collides,
  getWorldRect,
  keyMap,
  initKeys,
  bindKeys,
  unbindKeys,
  keyPressed,
  registerPlugin,
  unregisterPlugin,
  extendObject,
  initPointer,
  getPointer,
  track,
  untrack,
  pointerOver,
  onPointerDown,
  onPointerUp,
  pointerPressed,
  Pool: factory$7,
  Quadtree: factory$8,
  Scene: factory$9,
  Sprite: factory$3,
  SpriteSheet: factory$a,
  Text: factory$4,
  TileEngine,
  Vector: factory$1
};
var _default = kontra;
exports.default = _default;
},{}],"src/common/events.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emit = exports.allOff = exports.off = exports.on = exports.EV_INTERACTION = exports.EV_SCENECHANGE = exports.EV_CONVOCHOICE = exports.EV_CONVONEXT = exports.EV_CONVOEND = exports.EV_CONVOSTART = void 0;

var _kontra = require("kontra");

const EV_CONVOSTART = "ev.convoStart";
exports.EV_CONVOSTART = EV_CONVOSTART;
const EV_CONVOEND = "ev.convoEnd";
exports.EV_CONVOEND = EV_CONVOEND;
const EV_CONVONEXT = "ev.convoNext";
exports.EV_CONVONEXT = EV_CONVONEXT;
const EV_CONVOCHOICE = "ev.convoChoice";
exports.EV_CONVOCHOICE = EV_CONVOCHOICE;
const EV_SCENECHANGE = "ev.sceneChange";
exports.EV_SCENECHANGE = EV_SCENECHANGE;
const EV_INTERACTION = "ev.onInteraction";
exports.EV_INTERACTION = EV_INTERACTION;
let registry = {};

const on = (e, fn) => {
  registry[e] = fn;
  (0, _kontra.on)(e, registry[e]);
};

exports.on = on;

const off = (e, fn) => (0, _kontra.off)(e, fn);

exports.off = off;

const allOff = function allOff() {
  let ignoreList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return Object.keys(registry).map(k => !ignoreList.some(str => str === k) && off(k, registry[k]));
};

exports.allOff = allOff;

const emit = function emit(e) {
  let args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return (0, _kontra.emit)(e, args);
};

exports.emit = emit;
},{"kontra":"node_modules/kontra/kontra.mjs"}],"src/common/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = exports.getRandomIntInclusive = exports.circleCollision = exports.sortByDist = exports.dist = exports.vmulti = exports.getNormal = exports.between = exports.uniqueId = void 0;

var _events = require("../common/events");

const uniqueId = function uniqueId() {
  let pre = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return "".concat(pre).concat(pre.length ? "_" : "") + (Number(String(Math.random()).slice(2)) + Date.now() + Math.round(performance.now())).toString(36);
};

exports.uniqueId = uniqueId;

const between = (v, a, b) => v > a && v < b;

exports.between = between;

const getNormal = dir => {
  const dirLength = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
  return {
    x: dir.x !== 0 ? dir.x / dirLength : 0,
    y: dir.y !== 0 ? dir.y / dirLength : 0
  };
};

exports.getNormal = getNormal;

const vmulti = (vec, v) => {
  let x = 0;
  let y = 0;

  if (typeof v === "object") {
    x = vec.x * v.x;
    y = vec.y * v.y;
  } else {
    x = vec.x * v;
    y = vec.y * v;
  }

  return Vector(x, y);
};

exports.vmulti = vmulti;

const dist = (p1, p2) => {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;
  return Math.sqrt(a * a + b * b);
};

exports.dist = dist;

const sortByDist = function sortByDist(target) {
  let items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return items.sort((a, b) => dist(target, a.position) - dist(target, b.position));
};

exports.sortByDist = sortByDist;

const circleCollision = function circleCollision(collider, targets) {
  let destroyOnHit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!collider.radius) {
    console.error("Cannot detect collisions without radius property.");
  }

  const filtered = targets.filter(target => {
    /* Because why would you ever want to collide with yourself? */
    if (collider.id === target.id) return;
    const offsets = target.collisionBodyOptions ? {
      x: target.collisionBodyOptions.offsetX ? target.x + target.collisionBodyOptions.offsetX : target.x,
      y: target.collisionBodyOptions.offsetY ? target.y + target.collisionBodyOptions.offsetY : target.y
    } : {
      x: target.x,
      y: target.y
    };
    let dx = offsets.x - collider.x;
    let dy = offsets.y - collider.y;
    /* You might be seeing results from two perspectives. I'd ensure that it only comes from
    one in the case of a door. */
    //debug(target.name + ": " + Math.sqrt(dx * dx + dy * dy))

    if (Math.sqrt(dx * dx + dy * dy) < target.radius + collider.width) {
      target.ttl = destroyOnHit ? 0 : target.ttl;
      return target;
    }
  });
  return filtered;
};

exports.circleCollision = circleCollision;

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
};

exports.getRandomIntInclusive = getRandomIntInclusive;

const debug = o => {
  console.info(o);
  (0, _events.emit)(_events.EV_DEBUGLOG, o);
};

exports.debug = debug;
},{"../common/events":"src/common/events.js"}],"src/common/consts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AI_ACTIONS = exports.ENTITY_TYPE = void 0;
const ENTITY_TYPE = {
  FIXED: 0,
  NPC: 1,
  PICKUP: 2,
  DOOR: 3,
  PLAYER: 99
};
exports.ENTITY_TYPE = ENTITY_TYPE;
const AI_ACTIONS = {
  IDLE: 0,
  MOVING: 1,
  THINKING: 2,
  WAITING: 3
};
exports.AI_ACTIONS = AI_ACTIONS;
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

},{"./hyperscript":"node_modules/mithril/hyperscript.js","./request":"node_modules/mithril/request.js","./mount-redraw":"node_modules/mithril/mount-redraw.js","./route":"node_modules/mithril/route.js","./render":"node_modules/mithril/render.js","./querystring/parse":"node_modules/mithril/querystring/parse.js","./querystring/build":"node_modules/mithril/querystring/build.js","./pathname/parse":"node_modules/mithril/pathname/parse.js","./pathname/build":"node_modules/mithril/pathname/build.js","./render/vnode":"node_modules/mithril/render/vnode.js","./promise/polyfill":"node_modules/mithril/promise/polyfill.js"}],"src/ui/effects.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeWriter = void 0;

const typeWriter = (_ref) => {
  let {
    text,
    onStart = () => {},
    onTyped = str => {},
    onFinished = () => {}
  } = _ref;
  let animId = "";
  let str = "";
  onStart();

  const t = function t() {
    let s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (i > text.length) {
      cancelAnimationFrame(animId);
      onFinished();
      return;
    }

    str = s + text.charAt(i);
    i += 1;
    onTyped(str);
    requestAnimationFrame(() => t(str, i));
  };

  return {
    start: () => animId = requestAnimationFrame(() => t())
  };
};

exports.typeWriter = typeWriter;
},{}],"src/ui/dialogue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mithril = _interopRequireDefault(require("mithril"));

var _effects = require("./effects");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let mounted = false;
let isTyping = false;
let name = "";
let text = "";
let choices = [];

const primeGlobals = props => {
  name = props.name;
  text = "";
  choices = [];

  _mithril.default.redraw();
};

const callTypewriter = props => (0, _effects.typeWriter)({
  text: props.text,
  onStart: () => isTyping = true,
  onTyped: str => {
    text = str;

    _mithril.default.redraw();
  },
  onFinished: () => {
    isTyping = false;
    choices = props.choices.length ? props.choices : [];

    _mithril.default.redraw();
  }
}).start();

const _callText = props => {
  if (isTyping) return;
  primeGlobals(props);
  callTypewriter(props);
};

const Shell = (_ref) => {
  let {
    attrs
  } = _ref;
  return {
    oninit: () => mounted = true,
    onremove: () => {
      mounted = false;
      isTyping = false;
      name = "";
      text = "";
      choices = [];
    },
    view: () => (0, _mithril.default)("div", {
      class: "uiShell"
    }, text && (0, _mithril.default)("div", {
      class: "dialogueBoxOuter"
    }, [(0, _mithril.default)("div", {
      class: "dialogue"
    }, [(0, _mithril.default)("span", name ? "".concat(name, ":") : ""), (0, _mithril.default)("span", name ? "\"".concat(text, "\"") : text), (0, _mithril.default)("div", {
      class: "choiceWindow"
    }, choices.map(choice => {
      return (0, _mithril.default)("button", {
        class: "choiceBox",
        onclick: () => attrs.onChoiceSelected(choice)
      }, choice.text);
    })), isTyping ? "" : (0, _mithril.default)("span", {
      class: "arrow"
    })])]))
  };
};

var _default = {
  isBusy: () => isTyping,
  mount: function mount() {
    let attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _mithril.default.mount(document.getElementById("ui"), {
      view: () => (0, _mithril.default)(Shell, attrs)
    });
  },
  unmount: () => _mithril.default.mount(document.getElementById("ui"), null),
  callText: props => {
    if (!mounted) return;

    _callText(_objectSpread({}, props));
  }
};
exports.default = _default;
},{"mithril":"node_modules/mithril/index.js","./effects":"src/ui/effects.js"}],"src/common/conversationIterator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MODES = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MODES = {
  NOTRUNNING: 100,
  NEXTNODE: 200,
  AWAITINGINPUT: 300,
  JUSTFINISHED: 400,
  COMPLETED: 500
};
exports.MODES = MODES;

var _default = (_ref) => {
  let {
    conversationData,
    onChatStarted = (node, props) => {},
    onChatNext = (node, props) => {},
    onChatComplete = lastPositionSaved => {},
    onChainProgress = lastNodeId => {},
    onChatCancelled = () => {}
  } = _ref;
  let index = 0;
  let currentNode = conversationData[index];
  let _isRunning = false;
  let _isComplete = false;

  const displayNode = queriedNode => {
    if (queriedNode) {
      currentNode = queriedNode;
      index = queriedNode.index;
      return queriedNode;
    } else {
      throw "No node match.";
    }
  };

  const queryNode = query => {
    const queriedNode = conversationData.length ? conversationData.filter(node => query === node.id)[0] : null;
    return displayNode(queriedNode);
  };

  const start = function start(query) {
    let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const queriedNode = queryNode(query);
    _isRunning = true;
    _isComplete = false;
    onChatStarted(queriedNode, props);
    return _objectSpread(_objectSpread({}, displayNode(queriedNode)), {}, {
      mode: MODES.NEXTNODE
    });
  };

  const goToExact = function goToExact(query) {
    let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const queriedNode = queryNode(query);
    onChatNext(queriedNode, props);
    return _objectSpread(_objectSpread({}, displayNode(queriedNode)), {}, {
      mode: MODES.NEXTNODE
    });
  };

  const goToNext = function goToNext() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // We need to run this 'after' the finish so it avoids chained exec on exit.
    if (!_isRunning) return {
      mode: MODES.NOTRUNNING
    };

    if (_isComplete) {
      _isRunning = false;
      return {
        mode: MODES.COMPLETED
      };
    } // TODO: Beware, if you're not checking for existent choices, this will error out,
    // or do something a little funky. May want to check for choices here instead?


    const {
      id,
      to,
      choices,
      actions
    } = currentNode; // Wait if choices are presented.

    if (choices.length) return _objectSpread(_objectSpread({}, currentNode), {}, {
      mode: MODES.AWAITINGINPUT
    }); // TODO: Consts please.

    if (actions.some(action => action === "endConversation") || choices.length === 0 && !to) {
      if (actions.some(action => action === "save")) {
        onChainProgress(id);
      }

      if (actions.some(action => action === "cancel")) {
        onChatCancelled();
      }

      _isComplete = true;
      onChatComplete(id);
      console.log("End reached, close the convo.");
      return _objectSpread(_objectSpread({}, currentNode), {}, {
        mode: MODES.JUSTFINISHED
      });
    }

    return _objectSpread(_objectSpread({}, goToExact(to, props)), {}, {
      mode: MODES.NEXTNODE
    });
  };

  return {
    isComplete: () => _isComplete,
    isRunning: () => _isRunning,
    currentIndex: () => index,
    start,
    goToExact,
    goToNext
  };
};

exports.default = _default;
},{}],"src/input/onPush.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _default = function _default(key) {
  let cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => {};
  let pushed = false;
  return props => {
    if (!pushed && (0, _kontra.keyPressed)(key)) {
      cb(props);
      pushed = true;
    } else if (pushed && !(0, _kontra.keyPressed)("e")) {
      pushed = false;
    }
  };
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs"}],"src/states/startConvoState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _dialogue = _interopRequireDefault(require("../ui/dialogue"));

var _events = require("../common/events");

var _conversationIterator = _interopRequireWildcard(require("../common/conversationIterator"));

var _onPush = _interopRequireDefault(require("../input/onPush"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _default = (_ref) => {
  let {
    id,
    startId,
    onEntry = () => {},
    onExit = () => {}
  } = _ref;
  console.log("Start convo.");
  let _isComplete = false;
  const dataKey = "assets/gameData/conversationData.json";
  const conversationData = _kontra.dataAssets[dataKey];
  const conversationController = (0, _conversationIterator.default)({
    conversationData,
    onChatComplete: exitId => {
      _dialogue.default.unmount();

      (0, _events.emit)(_events.EV_CONVOEND, {
        exitId
      });
    },
    onChainProgress: lastNodeId => (0, _kontra.setStoreItem)("progress", {
      storyProgress: lastNodeId
    })
  });

  const onDisplayText = (_ref2) => {
    let {
      actor: name,
      text,
      choices
    } = _ref2;
    return _dialogue.default.callText({
      name,
      text,
      choices
    });
  };

  const onInteractionPushed = (0, _onPush.default)("e", () => {
    if (_dialogue.default.isBusy()) return;

    const _ref3 = !conversationController.isRunning() ? conversationController.start(startId, {
      startId
    }) : conversationController.goToNext(),
          {
      mode
    } = _ref3,
          rest = _objectWithoutProperties(_ref3, ["mode"]);

    if (mode === _conversationIterator.MODES.NEXTNODE) {
      onDisplayText(rest);
    }

    _isComplete = mode === _conversationIterator.MODES.JUSTFINISHED || mode === _conversationIterator.MODES.COMPLETED;
  });

  _dialogue.default.mount({
    onChoiceSelected: choice => {
      console.log("Selected:");
      console.log(choice);

      const _conversationControll = conversationController.goToExact(choice.to),
            {
        mode
      } = _conversationControll,
            rest = _objectWithoutProperties(_conversationControll, ["mode"]);

      if (mode === _conversationIterator.MODES.NEXTNODE) {
        onDisplayText(rest);
      }

      _isComplete = mode === _conversationIterator.MODES.JUSTFINISHED || mode === _conversationIterator.MODES.COMPLETED;
    }
  });

  return {
    id,
    isComplete: () => _isComplete,
    enter: props => onEntry(),
    update: () => onInteractionPushed(),
    exit: () => onExit()
  };
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","../ui/dialogue":"src/ui/dialogue.js","../common/events":"src/common/events.js","../common/conversationIterator":"src/common/conversationIterator.js","../input/onPush":"src/input/onPush.js"}],"src/ui/inventory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _mithril = _interopRequireDefault(require("mithril"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let mounted = false;
/* still deciding how to work the UI either with
sngular instances of mithril or otherwise. */

const Shell = (_ref) => {
  let {
    attrs
  } = _ref;
  const entitiesInStore = (0, _kontra.getStoreItem)("entities");
  const dataKey = "assets/gameData/entityData.json";
  const itemsInData = _kontra.dataAssets[dataKey];
  return {
    oninit: () => mounted = true,
    onremove: () => mounted = false,
    view: () => (0, _mithril.default)("div", {
      class: "uiShell"
    }, [(0, _mithril.default)("div", {
      class: "dialogueBoxOuter"
    }, [(0, _mithril.default)("div", {
      class: "dialogue"
    }, [attrs.items.length ? (0, _mithril.default)("dl", {
      class: "itemListing"
    }, attrs.items.map(item => {
      const data = itemsInData.find((_ref2) => {
        let {
          id
        } = _ref2;
        return id === item.id;
      });
      const storedItem = entitiesInStore.find((_ref3) => {
        let {
          id
        } = _ref3;
        return id === item.id;
      });
      const qty = storedItem ? storedItem.qty : 0;
      return (0, _mithril.default)("dd", {
        class: "itemNode",
        onclick: () => attrs.onItemSelected(data)
      }, [(0, _mithril.default)("img", {
        src: data.thumb
      }), (0, _mithril.default)("h4", "".concat(data.name, ": x").concat(qty)), (0, _mithril.default)("h5", data.description)]);
    })) : (0, _mithril.default)("p", "No items."), (0, _mithril.default)("div", {
      class: "choiceWindow"
    }, (0, _mithril.default)("button", {
      class: "choiceBox",
      onclick: () => attrs.onInventoryClosed()
    }, "Close"))])])])
  };
};

var _default = {
  isBusy: () => mounted,
  mount: function mount() {
    let attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _mithril.default.mount(document.getElementById("ui"), {
      view: () => (0, _mithril.default)(Shell, attrs)
    });
  },
  unmount: () => _mithril.default.mount(document.getElementById("ui"), null)
};
exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","mithril":"node_modules/mithril/index.js"}],"src/states/fieldState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _inventory = _interopRequireDefault(require("../ui/inventory"));

var _consts = require("../common/consts");

var _onPush = _interopRequireDefault(require("../input/onPush"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (_ref) => {
  let {
    id,
    reactionManager,
    getAllEntitiesOfType = () => {},
    onEntry = () => {},
    onExit = () => {}
  } = _ref;
  let _isComplete = false;
  let interactionCooldown = false;
  /* TODO: Use consts on keys also */

  const onInteractionPushed = (0, _onPush.default)("e", (_ref2) => {
    let {
      origin,
      collisions = []
    } = _ref2;

    if (collisions.length && origin.controlledByUser) {
      if (!interactionCooldown) {
        /* Collision usually pre-sorted by this point, it's not up to the state
        to handle this though. */
        const interactible = collisions[0];
        const reactionData = reactionManager.get(interactible.type);
        /* Not all things will have a reaction set, plus they might expect
        different properties to be passed in future. */

        if (reactionData) {
          reactionData.reactionEvent(interactible, [interactible, origin]);
        }
      } else {
        interactionCooldown = false;
      }
    }
  });
  const onAttackPushed = (0, _onPush.default)("space", (_ref3) => {
    let {
      origin,
      collisions = []
    } = _ref3;
    collisions.map(col => {
      if (typeof col.onAttacked === "function") {
        col.onAttacked({
          origin
        });
      }
    });
  });
  /* Technically, the inventory should only be openable in the field (or battle, but that's
  out of this scope). Note: You might want the inventory to be a whole new state, but doing
  it this way means you can overlay it across the game whilst you play. Whatever you need
  basically. You might even want to life this to the index like the other reactions, in fact
  that might make more sense. */

  const onInventoryOpened = (0, _onPush.default)("i", () => {
    if (_inventory.default.isBusy()) return;
    /* Get you a list of all items that are being held in data */

    _inventory.default.mount({
      items: getAllEntitiesOfType(_consts.ENTITY_TYPE.PICKUP),
      onInventoryClosed: () => _inventory.default.unmount(),
      onItemSelected: itemData => {
        console.log(itemData);
      }
    }); // Don't forget to unmount it when it's done also!

  });
  return {
    id,
    isComplete: () => _isComplete,
    enter: props => onEntry(),
    update: props => {
      // TODO: Careful these don't conflict and do weird things (inventory in convo, etc, do not want!)
      onInteractionPushed(props);
      onAttackPushed(props);
      onInventoryOpened();
    },
    exit: () => onExit()
  };
};

exports.default = _default;
},{"../ui/inventory":"src/ui/inventory.js","../common/consts":"src/common/consts.js","../input/onPush":"src/input/onPush.js"}],"src/states/curtainState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (_ref) => {
  let {
    id,
    ctx,
    direction = 1,
    onFadeComplete = () => {}
  } = _ref;
  // https://stackoverflow.com/questions/19258169/fadein-fadeout-in-html5-canvas
  let _isComplete = false;
  let alpha = direction < 0 ? 1 : 0,
      delta = 0.05; //ctx.globalAlpha = direction < 0 ? 1 : 0;
  // Under heavy testing

  const curtainEl = document.getElementById("curtain");
  curtainEl.style.opacity = direction < 0 ? 1 : 0;
  return {
    id,
    isComplete: () => _isComplete,
    enter: props => {},
    update: () => {
      _isComplete = direction > 0 && alpha >= 1 || direction < 0 && alpha <= -1;
      alpha = direction < 0 ? alpha - delta : alpha + delta; //ctx.clearRect(0, 0, ctx.width, ctx.height);
      //ctx.globalAlpha = isComplete ? Math.round(alpha) : alpha;

      curtainEl.style.opacity = _isComplete ? Math.round(alpha) : alpha;
    },
    exit: () => {
      //ctx.globalAlpha = direction < 0 ? 0 : 1;
      curtainEl.style.opacity = direction < 0 ? 0 : 1;

      if (direction === 0) {
        curtainEl.remove();
      }

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

var _default = (_ref) => {
  let {
    sceneObject: Scene
  } = _ref;
  let currentScene = null;
  return {
    loadScene: props => {
      if (currentScene) currentScene.stop();
      currentScene = Scene(props);
      currentScene.start();
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

var _default = () => {
  let states = [];

  const top = arr => arr[arr.length - 1];

  return {
    push: (state, props) => {
      if (!states.some(s => s.id === state.id)) {
        states.push(state);
        top(states).enter(props);
      }
    },
    update: props => {
      const currentState = top(states);
      if (!currentState) return;
      currentState.update(props);

      if (currentState.isComplete()) {
        currentState.exit(); //states.pop(); ???
        // Careful doing this. Kind of breaks the idea of state. Look in to
        // other AI methods rather than state machines as I think they suck
        // when it comes to AI. Fine with other things like curtains though.

        states = states.filter(x => x.id !== currentState.id);
      }
    },
    pop: () => {
      const currentState = top(states);
      currentState.exit();
      states.pop();
    }
  };
};

exports.default = _default;
},{}],"src/sprites/spriteFunctions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flipSprite = exports.moveSprite = void 0;

var _helpers = require("../common/helpers");

const moveSprite = (_ref) => {
  let {
    dir,
    sprite,
    checkCollision = () => {
      return false;
    }
  } = _ref;

  /* Normalise so you don't go super fast diagonally */
  const directionNormal = (0, _helpers.getNormal)(dir); /// For collisions with tiles

  let oldPos = {
    x: sprite.x,
    y: sprite.y
  }; // Move X then check X (careful editing directly, might lead to issues with camera)

  sprite.x += directionNormal.x; // Collider check (const layer names please)

  const collidedWithX = checkCollision(sprite);

  if (sprite.collidesWithTiles && collidedWithX) {
    sprite.x = oldPos.x;
    sprite.y = oldPos.y;
  } // Update old pos ref


  oldPos = {
    x: sprite.x,
    y: sprite.y
  }; // Move Y then check Y (careful editing directly, might lead to issues with camera)

  sprite.y += directionNormal.y; // Collider check against tiles

  const collidedWithY = checkCollision(sprite);

  if (sprite.collidesWithTiles && collidedWithY) {
    sprite.x = oldPos.x;
    sprite.y = oldPos.y;
  }

  return {
    directionNormal
  };
};

exports.moveSprite = moveSprite;

const flipSprite = (_ref2) => {
  let {
    direction,
    sprite
  } = _ref2;

  if (direction.x < 0 && sprite.scaleX > 0) {
    sprite.setScale(-1, 1);
  } else if (direction.x > 0 && sprite.scaleX < 0) {
    sprite.setScale(1, 1);
  }
};

exports.flipSprite = flipSprite;
},{"../common/helpers":"src/common/helpers.js"}],"src/sprites/player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stateManager = _interopRequireDefault(require("../managers/stateManager"));

var _spriteFunctions = require("./spriteFunctions");

var _helpers = require("../common/helpers");

var _kontra = require("kontra");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Really important TODO: Split sprites out so they aren't sharing the same
// properties. Do you really need a ladder to animate for example? Just give it
// a 'static' flag or no animations full stop.
// TODO: Can we make sure we don't use the 'controlled by user' nonsense in the data anymore. What
// if I want to use a different entity for the player?
var _default = (_ref) => {
  let {
    id,
    x,
    y,
    z = 1,
    customProperties = {},
    entityData = null,
    collisionMethod = (layer, sprite) => {}
  } = _ref;

  if (!id) {
    throw new Error("Entity is fairly useless without an id, you should add one.");
  }

  const entityStateMachine = (0, _stateManager.default)();
  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    controlledByUser = false,
    controlledByAI = false,
    collidesWithTiles = true
  } = entityData;
  let spriteSheet = (0, _kontra.SpriteSheet)({
    image: _kontra.imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });
  /* These are passable to states so they can act accordingly */

  let dir = {
    x: 0,
    y: 0
  }; // AI (to add later)

  let targetDestination = null;
  let movementDisabled = false;
  /* Id should really be named 'class' since its re-used. */

  const sprite = (0, _kontra.Sprite)({
    instId: (0, _helpers.uniqueId)(id),
    id,
    type,
    name,
    x,
    y,
    z,
    anchor: {
      x: 0.5,
      y: 0.5
    },
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    controlledByAI,
    collisionBodyOptions,
    manualAnimation,
    onAttacked: () => {
      // Push an internal state for damage effect (whatever that's going to be)
      console.log(id);
    },
    enableMovement: () => movementDisabled = false,
    disableMovement: () => movementDisabled = true,
    lookAt: (_ref2) => {
      let {
        x,
        y
      } = _ref2;
      (0, _spriteFunctions.flipSprite)({
        direction: {
          x: sprite.x > x ? -1 : 1,
          y: sprite.y > y ? -1 : 1
        },
        sprite
      });
    },
    update: () => {
      entityStateMachine.update();
      /* Movement - Massively a work in progress - TODO: Sort out data and splitting out concerns of sprite types. 
      targestDestination prop may or may not be an AI thing, as we might want to automatically move the player
      to a location. So make sure it's accessible by all entities further up. */

      if (targetDestination !== null) {
        /* You could also stick pathfinding in here or in AI when it's implemented */
        dir = {
          x: sprite.x > targetDestination.x ? -1 : 1,
          y: sprite.y > targetDestination.y ? -1 : 1
        };
      } else if (controlledByUser && targetDestination == null) {
        dir = {
          x: (0, _kontra.keyPressed)("a") ? -1 : (0, _kontra.keyPressed)("d") ? 1 : 0,
          y: (0, _kontra.keyPressed)("w") ? -1 : (0, _kontra.keyPressed)("s") ? 1 : 0
        };
      } else {
        // This is literally just to stop things like ladders moving. It shouldn't be done this
        // way at all so refactor all of this asap.
        dir = {
          x: 0,
          y: 0
        };
      } // TODO: Not really needed any more


      const {
        directionNormal
      } = (0, _spriteFunctions.moveSprite)({
        dir: movementDisabled && targetDestination === null ? {
          x: 0,
          y: 0
        } : dir,
        sprite,
        checkCollision: sprite => collisionMethod("Collision", sprite)
      }); // Flip the sprite on movement

      (0, _spriteFunctions.flipSprite)({
        direction: directionNormal,
        sprite
      }); // Do some animations

      const isMoving = directionNormal.x !== 0 || directionNormal.y !== 0;

      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      } // Call this to ensure animations are player


      sprite.advance();
    }
  }); // console.log("=> Sprite generated:", sprite.name, sprite.id);
  // console.log(sprite);

  return sprite;
};

exports.default = _default;
},{"../managers/stateManager":"src/managers/stateManager.js","./spriteFunctions":"src/sprites/spriteFunctions.js","../common/helpers":"src/common/helpers.js","kontra":"node_modules/kontra/kontra.mjs"}],"src/states/aiMoveToState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _spriteFunctions = require("../sprites/spriteFunctions");

var _default = (_ref) => {
  let {
    id,
    sprite,
    destination,
    onEntry = () => {},
    onExit = () => {}
  } = _ref;
  let _isComplete = false;
  let current = (0, _kontra.Vector)(sprite.x, sprite.y);
  return {
    id,
    isComplete: () => _isComplete,
    enter: props => onEntry(),
    update: () => {
      // Note: No need for acc at this stage
      let vel = (0, _kontra.Vector)(0, 0); // Current vector towards target

      let distanceToTarget = destination.subtract(current).length(); // Cease all movement if arrived, otherwise just carry on

      if (distanceToTarget > 10) {
        vel = destination.subtract(current).normalize().scale(0.5);
        sprite.x += vel.x;
        sprite.y += vel.y;
        current = (0, _kontra.Vector)(sprite.x, sprite.y);
      } else {
        console.log(sprite.name + " reached destination.");
        destination = current;
        _isComplete = true;
      }

      (0, _spriteFunctions.flipSprite)({
        direction: vel,
        sprite
      }); // Do some animations

      const isMoving = vel.x !== 0 || vel.y !== 0;

      if (!sprite.manualAnimation) {
        sprite.playAnimation(isMoving ? "walk" : "idle");
      } // Call this to ensure animations are player


      sprite.advance();
    },
    exit: () => onExit()
  };
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","../sprites/spriteFunctions":"src/sprites/spriteFunctions.js"}],"src/states/aiWaitState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const wait = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

var _default = (_ref) => {
  let {
    id,
    waitFor,
    sprite,
    onEntry = () => {},
    onExit = () => {}
  } = _ref;
  let _isComplete = false;
  return {
    id,
    isComplete: () => _isComplete,
    enter: async props => {
      onEntry();
      await wait(waitFor);
      _isComplete = true;
    },
    update: () => {
      sprite.playAnimation("idle");
    },
    exit: () => onExit()
  };
};

exports.default = _default;
},{}],"src/sprites/npc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stateManager = _interopRequireDefault(require("../managers/stateManager"));

var _aiMoveToState = _interopRequireDefault(require("../states/aiMoveToState"));

var _aiWaitState = _interopRequireDefault(require("../states/aiWaitState"));

var _spriteFunctions = require("./spriteFunctions");

var _helpers = require("../common/helpers");

var _kontra = require("kontra");

var _consts = require("../common/consts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (_ref) => {
  let {
    id,
    x,
    y,
    z = 1,
    customProperties = {},
    entityData = null,
    collisionMethod = (layer, sprite) => {}
  } = _ref;

  if (!id) {
    throw new Error("Entity is fairly useless without an id, you should add one.");
  }

  const entityStateMachine = (0, _stateManager.default)();
  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    controlledByUser = false,
    controlledByAI = false,
    collidesWithTiles = true
  } = entityData;
  let spriteSheet = (0, _kontra.SpriteSheet)({
    image: _kontra.imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });
  /* These are passable to states so they can act accordingly */

  let movementDisabled = false;
  let currentAction = _consts.AI_ACTIONS.IDLE; // ... Perhaps add these to the sprite instead?

  const doRandomWait = sprite => {
    currentAction = _consts.AI_ACTIONS.WAITING;
    entityStateMachine.push((0, _aiWaitState.default)({
      id: "wait",
      sprite,
      waitFor: (0, _helpers.getRandomIntInclusive)(500, 2000),
      onExit: () => currentAction = _consts.AI_ACTIONS.IDLE
    }));
  };

  const doRandomDest = (_ref2) => {
    let {
      sprite,
      destination
    } = _ref2;
    currentAction = _consts.AI_ACTIONS.MOVING;
    entityStateMachine.push((0, _aiMoveToState.default)({
      id: "moveTo",
      sprite,
      destination,
      onExit: () => currentAction = _consts.AI_ACTIONS.THINKING
    }));
  };
  /* Id should really be named 'class' since its re-used. */


  const sprite = (0, _kontra.Sprite)({
    instId: (0, _helpers.uniqueId)(id),
    id,
    type,
    name,
    x,
    y,
    z,
    anchor: {
      x: 0.5,
      y: 0.5
    },
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    controlledByAI,
    collisionBodyOptions,
    manualAnimation,
    enableMovement: () => movementDisabled = false,
    disableMovement: () => movementDisabled = true,
    lookAt: (_ref3) => {
      let {
        x,
        y
      } = _ref3;
      (0, _spriteFunctions.flipSprite)({
        direction: {
          x: sprite.x > x ? -1 : 1,
          y: sprite.y > y ? -1 : 1
        },
        sprite
      });
    },
    update: () => {
      entityStateMachine.update();

      switch (currentAction) {
        case _consts.AI_ACTIONS.IDLE:
          doRandomDest({
            sprite,
            destination: (0, _kontra.Vector)((0, _helpers.getRandomIntInclusive)(30, 160), (0, _helpers.getRandomIntInclusive)(30, 160))
          });
          break;

        case _consts.AI_ACTIONS.THINKING:
          doRandomWait(sprite);
          break;
      }
    }
  });
  return sprite;
};

exports.default = _default;
},{"../managers/stateManager":"src/managers/stateManager.js","../states/aiMoveToState":"src/states/aiMoveToState.js","../states/aiWaitState":"src/states/aiWaitState.js","./spriteFunctions":"src/sprites/spriteFunctions.js","../common/helpers":"src/common/helpers.js","kontra":"node_modules/kontra/kontra.mjs","../common/consts":"src/common/consts.js"}],"src/sprites/fixed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("../common/helpers");

var _kontra = require("kontra");

var _default = (_ref) => {
  let {
    id,
    x,
    y,
    z = 1,
    customProperties = {},
    entityData = null,
    collisionMethod = (layer, sprite) => {}
  } = _ref;

  if (!id) {
    throw new Error("Entity is fairly useless without an id, you should add one.");
  }

  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    controlledByUser = false,
    controlledByAI = false,
    collidesWithTiles = true
  } = entityData;
  let spriteSheet = (0, _kontra.SpriteSheet)({
    image: _kontra.imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });
  /* Id should really be named 'class' since its re-used. */

  const sprite = (0, _kontra.Sprite)({
    instId: (0, _helpers.uniqueId)(id),
    id,
    type,
    name,
    x,
    y,
    z,
    anchor: {
      x: 0.5,
      y: 0.5
    },
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    controlledByAI,
    collisionBodyOptions,
    manualAnimation,
    onAttacked: () => {
      // Push an internal state for damage effect (whatever that's going to be)
      console.log(id);
    },
    update: () => {
      // Static entities may still have anims so add them in later.
      // Anim code...
      // Call this to ensure animations are player
      sprite.advance();
    }
  });
  return sprite;
};

exports.default = _default;
},{"../common/helpers":"src/common/helpers.js","kontra":"node_modules/kontra/kontra.mjs"}],"src/sprites/pickup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("../common/helpers");

var _kontra = require("kontra");

var _default = (_ref) => {
  let {
    id,
    x,
    y,
    z = 1,
    customProperties = {},
    entityData = null,
    collisionMethod = (layer, sprite) => {}
  } = _ref;

  if (!id) {
    throw new Error("Entity is fairly useless without an id, you should add one.");
  }

  const {
    name,
    type,
    animations,
    frameWidth,
    frameHeight,
    sheet,
    collisionBodyOptions = null,
    manualAnimation = false,
    controlledByUser = false,
    controlledByAI = false,
    collidesWithTiles = true
  } = entityData;
  let spriteSheet = (0, _kontra.SpriteSheet)({
    image: _kontra.imageAssets[sheet],
    frameWidth,
    frameHeight,
    animations
  });
  /* Id should really be named 'class' since its re-used. */

  const sprite = (0, _kontra.Sprite)({
    instId: (0, _helpers.uniqueId)(id),
    id,
    type,
    name,
    x,
    y,
    z,
    anchor: {
      x: 0.5,
      y: 0.5
    },
    customProperties,
    radius: 1,
    animations: spriteSheet.animations,
    collidesWithTiles,
    controlledByUser,
    controlledByAI,
    collisionBodyOptions,
    manualAnimation,
    onAttacked: () => {
      // Push an internal state for damage effect (whatever that's going to be)
      console.log(id);
    },
    update: () => {
      // Static entities may still have anims so add them in later.
      // Anim code...
      // Call this to ensure animations are player
      sprite.advance();
    }
  });
  return sprite;
};

exports.default = _default;
},{"../common/helpers":"src/common/helpers.js","kontra":"node_modules/kontra/kontra.mjs"}],"src/managers/worldManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kontra = require("kontra");

var _player = _interopRequireDefault(require("../sprites/player"));

var _npc = _interopRequireDefault(require("../sprites/npc"));

var _fixed = _interopRequireDefault(require("../sprites/fixed"));

var _pickup = _interopRequireDefault(require("../sprites/pickup"));

var _consts = require("../common/consts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    dataKey: "assets/gameData/worldData.json"
  };
  const {
    dataKey
  } = options;
  const worldData = _kontra.dataAssets[dataKey]; // TODO: Pass this in?

  const entityDataKey = "assets/gameData/entityData.json";
  const entityTable = _kontra.dataAssets[entityDataKey]; // TODO: Move these commands out of here and in to some sort of helper layer.

  const entitiesInStore = (0, _kontra.getStoreItem)("entities");

  const _getEntityFromStore = id => entitiesInStore.length ? entitiesInStore.find(e => e.id === id) : null;

  return {
    getAllEntitiesOfType: type => {
      const existingEntities = (0, _kontra.getStoreItem)("entities");
      return existingEntities ? existingEntities.filter(ent => ent.type === type) : [];
    },
    getAllEntities: () => (0, _kontra.getStoreItem)("entities"),
    getEntityFromStore: id => _getEntityFromStore(id),
    resetEntityStates: () => (0, _kontra.setStoreItem)("entities", []),
    savePickup: entityData => {
      const {
        id,
        type,
        ttl
      } = entityData;
      const existingEntities = (0, _kontra.getStoreItem)("entities");
      const existingEntity = existingEntities ? existingEntities.find(x => x.id === id) : null;
      /* This needs cleaning up */

      (0, _kontra.setStoreItem)("entities", existingEntities ? existingEntities.filter(ent => ent.id !== id).concat([{
        id,
        type,
        ttl,
        qty: existingEntity ? existingEntity.qty + 1 : 1
      }]) : [{
        id,
        type,
        ttl,
        qty: 1
      }]);
    },
    createWorld: (_ref) => {
      let {
        areaId,
        playerStartId
      } = _ref;
      const {
        entities,
        mapKey
      } = worldData.find(x => x.areaId === areaId);
      const map = _kontra.dataAssets[mapKey];
      const tileEngine = (0, _kontra.TileEngine)(map);
      const playerStart = entities.find(x => x.customProperties.playerStartId === playerStartId);
      const playerEntityData = entityTable.find(x => x.id === "player");
      const player = (0, _player.default)({
        id: "player",
        x: playerStart.x,
        y: playerStart.y,
        entityData: playerEntityData,
        collisionMethod: (layer, sprite) => {
          // If 16x16
          const spriteBody = {
            x: 2,
            y: 8,
            width: 11,
            height: 8
          };
          const t = {
            width: spriteBody.width,
            height: spriteBody.height,
            x: sprite.x + spriteBody.x,
            y: sprite.y + spriteBody.y,
            anchor: sprite.anchor
          };
          return tileEngine.layerCollidesWith(layer, t);
        } // tileEngine.layerCollidesWith(layer, sprite)

      });
      tileEngine.addObject(player);
      return {
        mapKey,
        tileEngine,
        player,
        sprites: entities.map(entity => {
          // TODO: Tidy all this up

          /* Check if entity exists in store as it may have been destroyed
          or collected. TODO: Move the pickup check out of here, it's a bit
          confusing alongside other field entity types. */
          const {
            id
          } = entity;
          let ent = null;
          const entityData = entityTable.find(ent => ent.id === id);

          switch (entityData.type) {
            case _consts.ENTITY_TYPE.PICKUP:
              const alreadyCollected = _getEntityFromStore(id);

              if (alreadyCollected) return null;
              ent = (0, _pickup.default)(_objectSpread(_objectSpread({}, entity), {}, {
                entityData,
                collisionMethod: (layer, sprite) => tileEngine.layerCollidesWith(layer, sprite)
              }));
              break;

            case _consts.ENTITY_TYPE.NPC:
              ent = (0, _npc.default)(_objectSpread(_objectSpread({}, entity), {}, {
                entityData,
                collisionMethod: (layer, sprite) => tileEngine.layerCollidesWith(layer, sprite)
              }));
              break;

            case _consts.ENTITY_TYPE.DOOR:
              // Doors may be animated, this is just temporary usage.
              ent = (0, _fixed.default)(_objectSpread(_objectSpread({}, entity), {}, {
                entityData,
                collisionMethod: (layer, sprite) => tileEngine.layerCollidesWith(layer, sprite)
              }));
              break;

            case _consts.ENTITY_TYPE.FIXED:
              ent = (0, _fixed.default)(_objectSpread(_objectSpread({}, entity), {}, {
                entityData,
                collisionMethod: (layer, sprite) => tileEngine.layerCollidesWith(layer, sprite)
              }));
              break;

            default:
              return null;
          }
          /* May wish to add a flag if you want to add it to tilemap or not */


          tileEngine.addObject(ent);
          return ent;
        }).filter(e => e).concat([player])
      };
    }
  };
};

exports.default = _default;
},{"kontra":"node_modules/kontra/kontra.mjs","../sprites/player":"src/sprites/player.js","../sprites/npc":"src/sprites/npc.js","../sprites/fixed":"src/sprites/fixed.js","../sprites/pickup":"src/sprites/pickup.js","../common/consts":"src/common/consts.js"}],"src/managers/reactionManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  let reactions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return {
    get: type => reactions.find(reaction => reaction.type === type)
  };
};

exports.default = _default;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _kontra = require("kontra");

var _helpers = require("./common/helpers");

var _consts = require("./common/consts");

var _events = require("./common/events");

var _startConvoState = _interopRequireDefault(require("./states/startConvoState"));

var _fieldState = _interopRequireDefault(require("./states/fieldState"));

var _curtainState = _interopRequireDefault(require("./states/curtainState"));

var _sceneManager = _interopRequireDefault(require("./managers/sceneManager"));

var _worldManager = _interopRequireDefault(require("./managers/worldManager"));

var _reactionManager = _interopRequireDefault(require("./managers/reactionManager"));

var _stateManager = _interopRequireDefault(require("./managers/stateManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Screen size (16:9) */
const resolution = {
  width: 256,
  height: 192,
  scale: 3
};
/* Canvas initialization */
// Make absolutely sure we have to use two canvases (I'm not convinced)

const {
  canvas: gameCanvas
} = (0, _kontra.init)("gameCanvas");
const scaledCanvas = document.getElementById("scaledCanvas");
const rootElement = document.getElementById("root");
/* Set correct scales to be universal */

gameCanvas.width = resolution.width;
gameCanvas.height = resolution.height;
/* Scaled canvas works in the same way only we multiply to zoom it in */

scaledCanvas.width = resolution.width * resolution.scale;
scaledCanvas.height = resolution.height * resolution.scale;
/* Apply to root element also */

rootElement.style.width = resolution.width * resolution.scale + "px";
rootElement.style.height = resolution.height * resolution.scale + "px";
/* Remove smoothing */

const gameCanvasCtx = gameCanvas.getContext("2d");
gameCanvasCtx.imageSmoothingEnabled = false;
gameCanvasCtx.webkitImageSmoothingEnabled = false;
gameCanvasCtx.mozImageSmoothingEnabled = false;
gameCanvasCtx.msImageSmoothingEnabled = false;
gameCanvasCtx.oImageSmoothingEnabled = false;
const ctx = scaledCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.oImageSmoothingEnabled = false;
/* Primary field scene */

const FieldScene = sceneProps => {
  /* World creation (can we not have entities just in store, it's a bit confusing) */
  const {
    createWorld,
    savePickup,
    getAllEntitiesOfType,
    resetEntityStates
  } = (0, _worldManager.default)();
  const {
    sprites,
    player,
    tileEngine
  } = createWorld(sceneProps);
  let spriteCache = sprites.filter(spr => spr.isAlive()); // Temporary: Use this to erase storage data

  resetEntityStates();
  /* Main states creation */

  const sceneStateMachine = (0, _stateManager.default)();
  const screenEffectsStateMachine = (0, _stateManager.default)();
  /* Decide what happens on different player interaction events (was separated, seemed pointless at this stage) */

  const reactionManager = (0, _reactionManager.default)([{
    type: _consts.ENTITY_TYPE.DOOR,

    /* First available refers to the first given collision. So it might not always be what
    what you want it to be. This needs to be made a bit more robust. */
    reactionEvent: function reactionEvent(interactible) {
      let actors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      // TODO: Entities should manage their own animations (same problem seen elsewhere)
      //interactible.playAnimation("default");
      screenEffectsStateMachine.push((0, _curtainState.default)({
        id: "curtain",
        ctx,
        direction: 1,
        onFadeComplete: () => {
          (0, _events.allOff)([_events.EV_SCENECHANGE]);
          /* Player start becomes part of the collider data so we attempt to use that. */

          (0, _events.emit)(_events.EV_SCENECHANGE, {
            areaId: interactible.customProperties.goesTo,
            playerStartId: interactible.customProperties.playerStartId
          });
        }
      }));
    }
  }, {
    type: _consts.ENTITY_TYPE.NPC,
    reactionEvent: function reactionEvent(interactible) {
      let actors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      console.log(interactible);
      const {
        customProperties
      } = interactible;
      if (!Object.keys(customProperties).length) return;

      if (customProperties.triggerConvo) {
        sceneStateMachine.push((0, _startConvoState.default)({
          id: "conversation",
          // What's this for?
          startId: customProperties.triggerConvo,
          // I feel these might be better done within the state... perhaps the same elsewhere too.
          onEntry: () => actors.map(spr => spr.disableMovement()),
          onExit: () => actors.map(spr => spr.enableMovement())
        }));
      }
    }
  }, {
    type: _consts.ENTITY_TYPE.PICKUP,
    reactionEvent: function reactionEvent(interactible) {
      let actors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      interactible.ttl = 0;
      savePickup(interactible);
    }
  }]); // TODO: Can we please not have to pass everything in like this? It's a bit too coupled.

  /* Start game within FieldState */

  sceneStateMachine.push((0, _fieldState.default)({
    id: "field",
    sprites,
    tileEngine,
    reactionManager,
    getAllEntitiesOfType
  }));
  /* Open up the first scene with a fade */

  screenEffectsStateMachine.push((0, _curtainState.default)({
    id: "curtain",
    ctx,
    direction: -1
  }));
  /* Primary loop */

  return (0, _kontra.GameLoop)({
    update: () => {
      /* Add a flag to sprite to enable/disable collision checks */

      /* Check for anything dead (GC does the rest) */
      spriteCache = spriteCache.filter(spr => spr.isAlive());
      /* Player to useable collision with other entities (not tiles) */

      const playerCollidingWith = (0, _helpers.sortByDist)(player, (0, _helpers.circleCollision)(player, spriteCache.filter(s => s.id !== "player")));
      /* Update all sprites */

      spriteCache.map(sprite => sprite.update()); // ...

      player.isColliding = playerCollidingWith.length > 0;
      /* Origin is the controller of the scene, so 9/10 that'll probably be the player */

      sceneStateMachine.update({
        origin: player,
        collisions: playerCollidingWith
      }); /// Under serious testing

      /*
      Take your map width and height. Say it's 128x128.
      
      If player is:
      x greater than 36 or x less than map width minus 36
      y greater than 36 or y less than map height minus 36
      */
      //if (tileEngine.mapwidth > resolution.width) {

      tileEngine.sx = player.x - resolution.width / 2; //}
      //if (player.y > pad) {

      tileEngine.sy = player.y - resolution.height / 2; //player.y - 120;
      //}
    },
    render: () => {
      /* Instruct tileEngine to update its frame */
      tileEngine.render();
      /* Edit z-order based on 'y' then change render order */

      spriteCache.sort((a, b) => Math.round(a.y - a.z) - Math.round(b.y - b.z)).forEach(sprite => sprite.render());
      /* Update any screen effects that are running */

      screenEffectsStateMachine.update();
      /* Project the actual game canvas on to the scaled canvas */

      ctx.drawImage(gameCanvas, 0, 0, resolution.width, resolution.height, 0, 0, scaledCanvas.width, scaledCanvas.height);
    }
  });
};
/* Make sure to embed your tilesets or it'll run in to problems,
TODO: Can we also const the dataKeys across the board plz. */


(0, _kontra.load)("assets/tileimages/test.png", "assets/tiledata/test.json", "assets/tiledata/test2.json", "assets/tiledata/test3.json", "assets/entityimages/little_devil.png", "assets/entityimages/little_orc.png", "assets/entityimages/little_bob.png", "assets/gameData/conversationData.json", "assets/gameData/entityData.json", "assets/gameData/worldData.json").then(assets => {
  (0, _kontra.initKeys)(); /// Note: There's now a scene manager in kontra that can be used
  // Hook up player start todo

  const sceneManager = (0, _sceneManager.default)({
    sceneObject: FieldScene
  });
  /* First load instigates a player start so this might be found from saveData
  or if at the very beginning of a game, passed in directly.
  If we look at the worldData, the playerStart id is actually linked to one of the
  entities that gets loaded in. This in theory means you can make anything a player start
  so long as you specify the right id for it. That being said, you do have to make sure
  both of them exist in the same context, otherwise you'll never get access to it.
  */

  sceneManager.loadScene({
    areaId: "area2",
    playerStartId: "area2_entrance"
  });
  (0, _events.on)(_events.EV_SCENECHANGE, props => sceneManager.loadScene(_objectSpread({}, props)));
});
},{"kontra":"node_modules/kontra/kontra.mjs","./common/helpers":"src/common/helpers.js","./common/consts":"src/common/consts.js","./common/events":"src/common/events.js","./states/startConvoState":"src/states/startConvoState.js","./states/fieldState":"src/states/fieldState.js","./states/curtainState":"src/states/curtainState.js","./managers/sceneManager":"src/managers/sceneManager.js","./managers/worldManager":"src/managers/worldManager.js","./managers/reactionManager":"src/managers/reactionManager.js","./managers/stateManager":"src/managers/stateManager.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50429" + '/');

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
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
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