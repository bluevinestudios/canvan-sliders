'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

// Minimum width in % where we bother to show a gradient -- this can be so small
// because we wrap the gradient around the 0/1 boundaries.
var minimumGradientWidth = 0.01;
/**
 *  Various class selectors defining our canvas animation.  A user-defined
 * (or default 'canvan') prefix is added to these selectors.  For example,
 * a top-level component would be, by default, 'canvan-animator'.
 */
var animatorSelectorName = 'animator';
var uniqueSelectorID = 'component-id';
var staticSliderSelectorName = 'static-slider';
var linearSliderSelectorName = 'linear-slider';
var radialSliderSelectorName = 'radial-slider';
var embeddedCanvasClass = 'embedded';
var dragableParamName = 'dragable';

/**
 * ErrorType defines the potential types of errors.
 */
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["Error"] = 0] = "Error";
    ErrorType[ErrorType["Warning"] = 1] = "Warning";
})(ErrorType || (ErrorType = {}));
/**
 * Basic application-specific error type.
 */
var SliderError = /** @class */ (function (_super) {
    __extends(SliderError, _super);
    function SliderError(errorType, message) {
        var _this = _super.call(this, createErrorMessage(errorType, message)) || this;
        _this.errorType = errorType;
        _this.message = message;
        return _this;
    }
    return SliderError;
}(Error));
/**
 * Simple error handler that currently logs to the console.
 * @param errorType
 * @param message
 */
function handleError(errorType, message) {
    var errorMessage = createErrorMessage(errorType, message);
    if (errorType == ErrorType.Error)
        console.error(errorMessage);
    else
        console.warn(errorMessage);
}
function createErrorMessage(errorType, message) {
    return errorType == ErrorType.Error ? "Canvan Error!: " + message : "Canvan Warning: " + message;
}

/**
 * Helper function that prepends a selector with a global prefix followed
 * by a dash between the two.
 * @param prefix
 * @param selector
 */
function addSelectorPrefix(prefix, selector) {
    return prefix + "-" + selector;
}
/**
 * Add a class to an element.
 * @param element DOM Element
 * @param elementClass Class name to add.
 */
function addClass(element, elementClass) {
    if (!element.classList.contains(elementClass)) {
        element.classList.add(elementClass);
    }
}
/**
 * Remove a class from an element.
 * @param element DOM Element
 * @param elementClass Class name to remove.
 */
function removeClass(element, elementClass) {
    if (element.classList.contains(elementClass)) {
        element.classList.remove(elementClass);
    }
}
/**
 * Returns a number parsed from an element attribute.  Logs a warning and
 * returns null if the value can't be parsed as a number.  Returns null (with
 * no logging) if attribute doesn't exist.
 * @param element
 * @param attributeName
 */
function getNumberAttribute(element, attributeName) {
    if (element === null)
        throw new SliderError(ErrorType.Error, 'Empty element in getNumberAttribute.');
    var attribute = element.getAttribute(attributeName);
    if (attribute === null)
        return undefined;
    var result = Number.parseFloat(attribute);
    if (isNaN(result)) {
        handleError(ErrorType.Warning, 'Invalid attribute value: ' + result);
        return undefined;
    }
    return result;
}
/**
 * Returns a string parsed from an element attribute. Logs a warning if the attribute is defined but empty.
 * @param element
 * @param attributeName
 * @returns Attribute string or undefined if attribute isn't defined.
 */
function getStringAttribute(element, attributeName) {
    if (element === null)
        throw new SliderError(ErrorType.Error, 'Empty element in getStringAttribute.');
    var attribute = element.getAttribute(attributeName);
    if (attribute === null)
        return undefined;
    // However if the attribute is defined but empty then it's an error.
    if (attribute === undefined || attribute.length === 0) {
        handleError(ErrorType.Warning, 'Undefined or empty attribute: ' + attributeName);
        return undefined;
    }
    return attribute;
}
/**
 * Parses and returns an attribute value that is a string, number, or boolean.
 * @param element Element to retrieve the attribute value from.
 * @param attributeName Name of attribute to grab.
 * @param defaultValue If the attributeValue is null then assign to defaultValue.
 */
function assignNullableAttribute(element, attributeName, defaultValue) {
    if (element === null)
        throw new SliderError(ErrorType.Error, 'Empty element in assignNullableAttribute.');
    if (typeof defaultValue === 'string') {
        var returnVal = getStringAttribute(element, attributeName);
        return returnVal === undefined ? defaultValue : returnVal;
    }
    else if (typeof defaultValue === 'number') {
        var returnVal = getNumberAttribute(element, attributeName);
        return returnVal === undefined ? defaultValue : returnVal;
    }
    else if (typeof defaultValue === 'boolean') {
        var returnVal = getStringAttribute(element, attributeName);
        var result = false;
        if (returnVal != null && returnVal !== undefined) {
            var val = returnVal.toLowerCase();
            if (val !== 'true' && val !== 'false')
                handleError(ErrorType.Warning, "Invalid attribute value " + val + " for boolean " + attributeName);
            else
                result = val === 'true';
        }
        return returnVal === undefined ? defaultValue : result;
    }
    else {
        throw new SliderError(ErrorType.Error, 'Unexpected attribute type in assignNullableAttribute.');
    }
}
/**
 * Generator that takes an array of parameters defining attributes to parse and yields
 * the parsed values.
 * @param element
 * @param params
 * @description Example params:
 * ```typescript
 * const parentOptions: common.OptionsArray = [
    {
        paramName: 'transition-size',
        defaultValue: 1
    },
    {
        paramName: 'dragable',
        defaultValue: true
    }
    ]
 * ```
 */
function assignNullableAttributes(element, params) {
    var _i, params_1, param, val;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, params_1 = params;
                _a.label = 1;
            case 1:
                if (!(_i < params_1.length)) return [3 /*break*/, 4];
                param = params_1[_i];
                val = assignNullableAttribute(element, param.paramName, param.defaultValue);
                return [4 /*yield*/, val];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
/**
 * Create an HTMLCanvasElement and append it to the provided container.
 * @param container Container Element to add the canvas to.
 * @param className Assign this class name to the canvas.
 */
function createAndInsertCanvasElement(container, className) {
    var canvasElement = document.createElement('canvas');
    canvasElement.width = container.clientWidth;
    canvasElement.height = container.clientHeight;
    container.appendChild(canvasElement);
    canvasElement.className = className;
    return canvasElement;
}
/**
 * Helper function to mix two objects so we can utilize a form of multiple inheritance.
 * @param derivedCtor Derived interface.
 * @param baseCtors Base interfaces to mixin with derivedCtor.
 */
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}

/** Currently supported events. */
var EventType;
(function (EventType) {
    EventType[EventType["Init"] = 0] = "Init";
    EventType[EventType["DragStart"] = 1] = "DragStart";
    EventType[EventType["DragEnd"] = 2] = "DragEnd";
    EventType[EventType["MouseMove"] = 3] = "MouseMove";
    EventType[EventType["MouseLeave"] = 4] = "MouseLeave";
    EventType[EventType["Resize"] = 5] = "Resize";
    EventType[EventType["RequestRepaint"] = 6] = "RequestRepaint";
    EventType[EventType["Pause"] = 7] = "Pause";
    EventType[EventType["Play"] = 8] = "Play";
})(EventType || (EventType = {}));
function MouseEventParams(x, y, movementX, movementY, mouseDown) {
    return {
        x: x,
        y: y,
        movementX: movementX,
        movementY: movementY,
        mouseDown: mouseDown
    };
}
function ResizeParams(width, height) {
    return { width: width, height: height };
}
function EventHandlerItem(eventID, eventType, eventHandler) {
    return { eventID: eventID, eventType: eventType, eventHandler: eventHandler };
}

/**
 *  Class names to add to our element dragging.  Note, a customizable prefix is added to these for uniqueness.
 *  See [[SliderCreator]].
 */
var mouseDownClass = 'mouse-down';
var mouseGrabClass = 'mouse-grab';
/**
 *  Class to manage touch events, currently only supporting desktop mouse events.
 */
var TouchHandler = /** @class */ (function () {
    /**
     * Constructor
     * @param element High-level element to watch for mouse events.  The classes defined in the
     * [mouseDownClass] and [mouseGrabClass] constants are added to this element dynamically.
     * @param eventDispatcher: Dispatcher for touch/mouse events.
     * @param selectorPrefix: Prefix to prepend to the mouse down/grab classes.
     */
    function TouchHandler(element, eventDispatcher, selectorPrefix) {
        this.selectorPrefix = selectorPrefix;
        this.container = element;
        this.eventDispatcher = eventDispatcher;
        this.dragging = false;
        this.mouseEventItems = [
            { name: 'mousedown', event: this.mouseDown },
            { name: 'mouseup', event: this.mouseUp },
            { name: 'mousemove', event: this.mouseMove },
            { name: 'mouseleave', event: this.mouseLeave }
        ];
        for (var _i = 0, _a = this.mouseEventItems; _i < _a.length; _i++) {
            var mouseEvent = _a[_i];
            mouseEvent.event = mouseEvent.event.bind(this);
        }
    }
    TouchHandler.prototype.addMouseListeners = function (element) {
        // TODO: add touch capabilities.
        //addListener(element, 'touchstart', this.mouseDownEvent);
        //addListener('touchend', this.mouseUpEvent);
        //addListener('touchcancel', this.mouseUpEvent);
        //element.addEventListener('mousedown', this.mouseDownEvent);
        for (var _i = 0, _a = this.mouseEventItems; _i < _a.length; _i++) {
            var mouseEvent = _a[_i];
            element.addEventListener(mouseEvent.name, mouseEvent.event);
        }
    };
    TouchHandler.prototype.removeMouseListeners = function (element) {
        //removeListener('touchstart', this.mouseDownEvent);
        //removeListener('touchend', this.mouseUpEvent);
        //removeListener('touchcancel', this.mouseUpEvent);
        //removeListener('touchmove', this.mouseMoveEvent);
        for (var _i = 0, _a = this.mouseEventItems; _i < _a.length; _i++) {
            var mouseEvent = _a[_i];
            element.removeEventListener(mouseEvent.name, mouseEvent.event);
        }
    };
    TouchHandler.prototype.mouseDown = function (event) {
        addClass(this.container, addSelectorPrefix(this.selectorPrefix, mouseDownClass));
        this.dragging = true;
        this.dispatchMouseEvent(event, EventType.DragStart);
    };
    TouchHandler.prototype.mouseUp = function (event) {
        this.removeMouseClasses();
        this.dragging = false;
        this.dispatchMouseEvent(event, EventType.DragEnd);
    };
    TouchHandler.prototype.mouseMove = function (event) {
        addClass(this.container, addSelectorPrefix(this.selectorPrefix, mouseGrabClass));
        this.dispatchMouseEvent(event, EventType.MouseMove);
    };
    TouchHandler.prototype.mouseLeave = function (event) {
        if (this.dragging) {
            this.dragging = false;
            this.removeMouseClasses();
            this.dispatchMouseEvent(event, EventType.MouseLeave);
        }
    };
    TouchHandler.prototype.removeMouseClasses = function () {
        removeClass(this.container, mouseDownClass);
        removeClass(this.container, mouseGrabClass);
    };
    TouchHandler.prototype.dispatchMouseEvent = function (event, eventType) {
        var mouseEvent = event;
        this.eventDispatcher.dispatch(eventType, MouseEventParams(mouseEvent.x, mouseEvent.y, mouseEvent.movementX, mouseEvent.movementY, this.dragging));
    };
    return TouchHandler;
}());

// eventDispatcher.ts
/**
 * Class to handle and dispatch internal events (not DOM events).  These are global events
 * that any lower-level components can subscribe to.
 */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.events = new Map();
        this.nextEventID = 0;
    }
    /**
     * Subscribe to a given event type
     * @param eventType Type of event.
     * @param eventHandler Event handler.
     * @returns Unique ID for the subscription that is supplied to [[unsubscribe]].
     */
    EventDispatcher.prototype.subscribe = function (eventType, eventHandler) {
        var newEventID = this.nextEventID;
        var eventArray = this.events.get(eventType);
        var newHandlerItem = EventHandlerItem(newEventID, eventType, eventHandler);
        if (eventArray == null)
            eventArray = new Array(1);
        eventArray[newEventID] = newHandlerItem;
        this.events.set(eventType, eventArray);
        this.nextEventID++;
        return newEventID;
    };
    /**
     * Unsubscribe from an event stream.
     * @param eventID Unique subscription ID returned from [[subscribe]].
     */
    EventDispatcher.prototype.unsubscribe = function (eventType, eventID) {
        var eventArray = this.events.get(eventType);
        if (eventArray != undefined) {
            var index = 0;
            for (var _i = 0, eventArray_1 = eventArray; _i < eventArray_1.length; _i++) {
                var eventHandlerItem = eventArray_1[_i];
                if (eventHandlerItem.eventID == eventID) {
                    eventArray.splice(index, 1);
                    break;
                }
                index++;
            }
        }
    };
    /**
     * Kick off an event to all subscribers.
     * @param eventType Type of event to publish.
     * @param eventParams Event parameters.
     */
    EventDispatcher.prototype.dispatch = function (eventType, eventParams) {
        var eventArray = this.events.get(eventType);
        if (eventArray != null) {
            eventArray.forEach(function (handler) {
                handler.eventHandler(eventParams);
            });
        }
    };
    return EventDispatcher;
}());

/**
 * Class to administer initialization and animation of animatable elements.
 * Multiple canvas elements will be animated using the high-performance
 * 'window.requestAnimationFrame' function.
 */
var Animator = /** @class */ (function () {
    function Animator(container, animationElements, eventDispatcher) {
        this.eventDispatcher = eventDispatcher;
        this.container = container;
        this.animationElements = animationElements;
        this.lastHeight = this.lastWidth = 0;
        this.active = false;
    }
    Animator.prototype.addElement = function (animationElement) {
        this.animationElements.push(animationElement);
    };
    /**
     * Stub callback function for our window frame paint event so that the core code can be reused.
     * See frameEvent below.
     * @param timestamp
     */
    Animator.prototype.animateFrameEvent = function (timestamp) {
        this.frameEvent(timestamp, true);
    };
    /**
     * This is the core animation function attached to our document window 'requestAnimationFrame' callback event.
     * @param timestamp Not used at the moment.
     * @param requestNewFrame True if we should recursively ask for a new
     * animation callback.
     */
    Animator.prototype.frameEvent = function (timestamp, requestNewFrame) {
        for (var _i = 0, _a = this.animationElements; _i < _a.length; _i++) {
            var animationElement = _a[_i];
            if (animationElement.active) {
                animationElement.draw();
                animationElement.step(timestamp);
            }
        }
        // Currently this is the best way to detect a resize events until
        // the DOM supports an element-specific size change event.
        if (this.container.clientWidth != this.lastWidth || this.container.clientHeight != this.lastHeight) {
            this.eventDispatcher.dispatch(EventType.Resize, ResizeParams(this.container.clientWidth, this.container.clientHeight));
            this.initializeAnimation();
        }
        if (this.active && requestNewFrame)
            window.requestAnimationFrame(this.animateFrameEvent.bind(this));
    };
    Animator.prototype.initializeAnimation = function () {
        this.lastWidth = this.container.clientWidth;
        this.lastHeight = this.container.clientHeight;
        for (var _i = 0, _a = this.animationElements; _i < _a.length; _i++) {
            var animationElement = _a[_i];
            animationElement.active = true;
        }
        // Sending a resize event tells our children elements what size they are after initialization.
        this.eventDispatcher.dispatch(EventType.Resize, ResizeParams(this.container.clientWidth, this.container.clientHeight));
    };
    Animator.prototype.start = function () {
        this.initializeAnimation();
        this.active = true;
        this.animateFrameEvent(0);
    };
    Animator.prototype.stop = function () {
        this.active = false;
    };
    return Animator;
}());

/**
 * Different components have different options, class Options serves
 * as a top-level interface for parsing.
 */
var Options = /** @class */ (function () {
    function Options() {
    }
    return Options;
}());

/** Top-level options for a single canvas slider component. */
var ComponentOptions = /** @class */ (function (_super) {
    __extends(ComponentOptions, _super);
    /**
     * Constructor
     * @param dragable 'true' if component allows dragging.
     */
    function ComponentOptions(dragable) {
        if (dragable === void 0) { dragable = true; }
        var _this = _super.call(this) || this;
        _this.dragable = dragable;
        _this.dragable = dragable;
        return _this;
    }
    ComponentOptions.prototype.parse = function (element) {
        var dragable = assignNullableAttribute(element, dragableParamName, this.dragable);
        this.dragable = dragable;
    };
    return ComponentOptions;
}(Options));

var AnimationState;
(function (AnimationState) {
    AnimationState[AnimationState["Inactive"] = 0] = "Inactive";
    AnimationState[AnimationState["Active"] = 1] = "Active";
    AnimationState[AnimationState["Dragging"] = 2] = "Dragging";
})(AnimationState || (AnimationState = {}));
var AxisSliderState = /** @class */ (function () {
    function AxisSliderState() {
        this.resetState();
    }
    AxisSliderState.prototype.init = function () {
        this.resetState();
    };
    AxisSliderState.prototype.resetState = function () {
        this.relativePosition$ = [0, 0];
        this.absolutePosition$ = [0, 0];
        this.animationState$ = AnimationState.Active;
    };
    Object.defineProperty(AxisSliderState.prototype, "animationState", {
        get: function () {
            return this.animationState$;
        },
        set: function (animationState) {
            this.animationState$ = animationState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisSliderState.prototype, "relativePosition", {
        get: function () {
            return this.relativePosition$;
        },
        set: function (position) {
            this.relativePosition$ = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisSliderState.prototype, "absolutePosition", {
        get: function () {
            return this.absolutePosition$;
        },
        set: function (absolutePosition) {
            this.absolutePosition$ = absolutePosition;
        },
        enumerable: true,
        configurable: true
    });
    return AxisSliderState;
}());

/**
 * Class to handle loading of a DOM image element.
 */
var SliderImage = /** @class */ (function () {
    /**
     * Constructor
     * @param htmlImageElement DOM Image element to load.
     */
    function SliderImage(htmlImageElement) {
        this.image = htmlImageElement;
    }
    /**
     *  Asynchronously make sure the image has been loaded by the browser.
     *  @throws SliderError warning if the image can't be loaded.
     *  @returns Promise that resolves when the image has been loaded.
     */
    SliderImage.prototype.loadImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.image.complete) {
                            if (_this.image.width === 0 || _this.image.height === 0)
                                return reject("Failed to load image: " + _this.image.src);
                            return resolve();
                        }
                        _this.image.onload = function () {
                            resolve();
                        };
                        _this.image.onerror = function (event) {
                            reject("Failed to load image: " + event.toString());
                        };
                    })];
            });
        });
    };
    Object.defineProperty(SliderImage.prototype, "imageElement", {
        get: function () {
            return this.image;
        },
        enumerable: true,
        configurable: true
    });
    return SliderImage;
}());

/**
 * Abstract class to handle a given canvas animation layer.  Responsible for drawing, time step increments,
 * resizing, etc.
 */
var CanvasAnimationElement = /** @class */ (function () {
    /**
     * Constructor
     * @param optionsElement DOM element that has attribute option parameters to parse from.
     * @param canvasElement  Canvas element to draw on.
     * @param eventDispatcher  Dispatcher to publish or subscribe to events.
     */
    function CanvasAnimationElement(optionsElement, canvasElement, eventDispatcher) {
        this.optionsElement = optionsElement;
        this.canvasElement = canvasElement;
        this.eventDispatcher = eventDispatcher;
        this.eventDispatcher.subscribe(EventType.Resize, this.onResize.bind(this));
    }
    CanvasAnimationElement.prototype.resize = function () {
        this.canvasElement.width = window.devicePixelRatio * this.canvasElement.clientWidth;
        this.canvasElement.height = window.devicePixelRatio * this.canvasElement.clientHeight;
        this.context = this.canvasElement.getContext('2d', {
            alpha: true
        });
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    CanvasAnimationElement.prototype.onResize = function (resizeParams) {
        this.resize();
    };
    Object.defineProperty(CanvasAnimationElement.prototype, "width", {
        get: function () {
            return this.canvasElement.clientWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasAnimationElement.prototype, "height", {
        get: function () {
            return this.canvasElement.clientHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasAnimationElement.prototype, "active", {
        /** If not active, this element may not receive draw or step events. */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return CanvasAnimationElement;
}());

/**
 * Aside from serving as a parent class to dynamic image-based animations, this
 * class serves as a static image drawn on the canvas.
 */
var CanvasImageAnimationElement = /** @class */ (function (_super) {
    __extends(CanvasImageAnimationElement, _super);
    function CanvasImageAnimationElement(optionsElement, sliderImage, canvasElement, eventDispatcher) {
        var _this = _super.call(this, optionsElement, canvasElement, eventDispatcher) || this;
        _this.sliderImage = sliderImage;
        return _this;
    }
    CanvasImageAnimationElement.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sliderImage.loadImage()];
            });
        });
    };
    CanvasImageAnimationElement.prototype.step = function (timestamp) { };
    CanvasImageAnimationElement.prototype.draw = function () {
        var newWidth = this.canvasElement.clientWidth;
        var newHeight = this.canvasElement.clientHeight;
        this.context.drawImage(this.sliderImage.imageElement, 0, 0, newWidth, newHeight);
    };
    CanvasImageAnimationElement.prototype.resize = function () {
        this.canvasElement.width = window.devicePixelRatio * this.canvasElement.clientWidth;
        this.canvasElement.height = window.devicePixelRatio * this.canvasElement.clientHeight;
        this.context = this.canvasElement.getContext('2d', { alpha: true });
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    CanvasImageAnimationElement.prototype.parseOptions = function () { };
    CanvasImageAnimationElement.prototype.updatePosition = function (position, movement) { };
    return CanvasImageAnimationElement;
}(CanvasAnimationElement));

/** Abstract class for a dragable item. */
var Dragable = /** @class */ (function () {
    function Dragable() {
    }
    Dragable.prototype.addMouseListeners = function (eventDispatcher) {
        eventDispatcher.subscribe(EventType.DragStart, this.onDragStart.bind(this));
        eventDispatcher.subscribe(EventType.DragEnd, this.onDragEnd.bind(this));
        eventDispatcher.subscribe(EventType.MouseLeave, this.onMouseLeave.bind(this));
        eventDispatcher.subscribe(EventType.MouseMove, this.onMouseMove.bind(this));
    };
    return Dragable;
}());

var MultiCanvasAnimationElement = /** @class */ (function () {
    function MultiCanvasAnimationElement(selectorPrefix) {
        this.selectorPrefix = selectorPrefix;
        this.canvasLayers = [];
        this.selectorPrefix = selectorPrefix;
    }
    MultiCanvasAnimationElement.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadAll;
            var _this = this;
            return __generator(this, function (_a) {
                this.parseAndBuildChildren();
                loadAll = this.canvasLayers.map(function (layer, index) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, layer.init()];
                    });
                }); });
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            Promise.all(loadAll)
                                .then(function () {
                                resolve();
                            })
                                .catch(function (error) {
                                reject(error);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    MultiCanvasAnimationElement.prototype.draw = function () {
        for (var _i = 0, _a = this.canvasLayers; _i < _a.length; _i++) {
            var canvas = _a[_i];
            canvas.draw();
        }
    };
    return MultiCanvasAnimationElement;
}());
var MultiCanvasDragableAnimationElement = /** @class */ (function () {
    function MultiCanvasDragableAnimationElement(selectorPrefix) {
        this.canvasLayers = [];
        this.selectorPrefix = selectorPrefix;
    }
    return MultiCanvasDragableAnimationElement;
}());
applyMixins(MultiCanvasDragableAnimationElement, [MultiCanvasAnimationElement, Dragable]);

/**
 *  A component that contains multiple 'single canvas sliders', all layered on top of each other with
 *  component-defined transparency.
 */
var MultiCanvasSlider = /** @class */ (function (_super) {
    __extends(MultiCanvasSlider, _super);
    function MultiCanvasSlider(container, eventDispatcher, selectorPrefix) {
        var _this = _super.call(this, selectorPrefix) || this;
        _this.container = container;
        _this.eventDispatcher = eventDispatcher;
        _this.parseOptions();
        if (_this.dragable)
            _this.addMouseListeners(_this.eventDispatcher);
        return _this;
    }
    MultiCanvasSlider.prototype.step = function (timestamp) {
        if (this.active) {
            this.incrementPosition();
            for (var _i = 0, _a = this.canvasLayers; _i < _a.length; _i++) {
                var layer = _a[_i];
                layer.step(timestamp);
            }
        }
    };
    return MultiCanvasSlider;
}(MultiCanvasDragableAnimationElement));

/**
 * Construct a GradientRange object.
 * @param positionRange
 * @param opacityRange
 */
function MakeGradientRange(positionRange, opacityRange) {
    return { positionRange: positionRange, opacityRange: opacityRange };
}
/** Parent class to manage our Canvas 2D gradients.  Note, this is not a class
 * defining all operations on a Canvas gradient but instead the specific use-case
 * of creating transitions between transparent and opaque.*/
var Gradient = /** @class */ (function () {
    /**
     * Constructor.
     * @param context Our 2D rendering context.
     * @param gradientTransitionWidth Width between 0-1 specifying how large the transition
     * should be between fully transparent to fully opaque segments.
     */
    function Gradient(context, gradientTransitionWidth) {
        this.context = context;
        this.gradientTransitionWidth = gradientTransitionWidth;
    }
    Object.defineProperty(Gradient.prototype, "gradientElement", {
        get: function () {
            return this.canvasGradient;
        },
        enumerable: true,
        configurable: true
    });
    return Gradient;
}());

/**
 * A simple real-valued min/max range that can interpolate a
 * value from one range to another.
 */
var Range = /** @class */ (function () {
    /**
     * Constructor.
     * @param min Minimum value in range.
     * @param max Maximum value in range.
     */
    function Range(min, max) {
        this.min$ = min;
        this.max$ = max;
        this.width$ = max - min;
    }
    Object.defineProperty(Range.prototype, "min", {
        get: function () {
            return this.min$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Range.prototype, "max", {
        get: function () {
            return this.max$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Range.prototype, "width", {
        get: function () {
            return this.max$ - this.min$;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Maps a number from this range into a destination range, interpolating linearly.
     * @param sourceValue
     * @param destinationRange
     * @description Throws an error if size of range is zero.
     */
    Range.prototype.mapValueToRange = function (sourceValue, destinationRange) {
        if (this.width$ == 0)
            throw new SliderError(ErrorType.Error, "Invalid size of range " + this.min + " - " + this.max);
        var normalizedValue = (sourceValue - this.min$) / this.width$;
        return destinationRange.min$ + normalizedValue * destinationRange.width$;
    };
    return Range;
}());

/**
 * Transparancy radial gradient, a circle at a particular position and radius.
 */
var GradientRadial = /** @class */ (function (_super) {
    __extends(GradientRadial, _super);
    function GradientRadial(context, width, height, centerPosition, innerRadius, outerRadius, gradientTransitionWidth) {
        var _this = _super.call(this, context, gradientTransitionWidth) || this;
        var x = width * (centerPosition[0] / 100);
        var y = height * (centerPosition[1] / 100);
        _this.canvasGradient = _this.context.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
        _this.centerPosition = centerPosition;
        _this.innerRadius = innerRadius;
        _this.outerRadius = outerRadius;
        return _this;
    }
    GradientRadial.prototype.addGradientStops = function () {
        var ranges = [];
        ranges.push(MakeGradientRange(new Range(0, 75), new Range(0.0, 0.0)));
        ranges.push(MakeGradientRange(new Range(75, 100), new Range(0.0, 1.0)));
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            this.canvasGradient.addColorStop(range.positionRange.min / 100, "rgba(255, 255, 255, " + range.opacityRange.min + ")");
            this.canvasGradient.addColorStop(range.positionRange.max / 100, "rgba(255, 255, 255, " + range.opacityRange.max + ")");
        }
    };
    return GradientRadial;
}(Gradient));

/**
 *  Class defining a 'linear' gradient 'window' that currently goes only from left to right.
 * Specifically, a horizontal section of the canvas is visible with blending transitions on the
 * left and right side of the window.
 *
 * Note, when the gradient position extends beyond the right or left side it loops around
 * to the other side to create a seamless animation.
 */
var GradientLinear = /** @class */ (function (_super) {
    __extends(GradientLinear, _super);
    /**
     * Constructor.
     * @param context Canvas 2D rendering context.
     * @param width Width of the gradient.
     * @param height Height of the gradient (currently not being used).
     * @param centerPosition Center position percent 0-1 of the visible window.
     * @param visibleWindowWidth Width in percent 0-1 of the window.
     * @param gradientTransitionWidth Width of the transparancy transition in percent 0-1.
     */
    function GradientLinear(context, params) {
        var _this = _super.call(this, context, params.gradientTransitionWidth) || this;
        Object.assign(_this, params);
        _this.canvasGradient = _this.context.createLinearGradient(0, 0, params.width, 0);
        _this.windowWidthHalf = params.visibleWindowWidth / 2.0;
        return _this;
    }
    /** Add our DOM Gradient transparency 'stops'. */
    GradientLinear.prototype.addGradientStops = function () {
        var windowLeft = this.centerPosition - this.windowWidthHalf;
        var windowRight = this.centerPosition + this.windowWidthHalf;
        var leftGradientBounds = new Range(windowLeft - this.gradientTransitionWidth, windowLeft + this.gradientTransitionWidth);
        var rightGradientBounds = new Range(windowRight - this.gradientTransitionWidth, windowRight + this.gradientTransitionWidth);
        var leftOpacityRange = new Range(1.0, 0.0);
        var rightOpacityRange = new Range(0.0, 1.0);
        var ranges1 = this.calculateGradientStops(leftGradientBounds, leftOpacityRange);
        var ranges2 = this.calculateGradientStops(rightGradientBounds, rightOpacityRange);
        var ranges = ranges1.concat(ranges2);
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (range.positionRange.width > minimumGradientWidth) {
                this.canvasGradient.addColorStop(range.positionRange.min / 100, "rgba(255, 255, 255, " + range.opacityRange.min + ")");
                this.canvasGradient.addColorStop(range.positionRange.max / 100, "rgba(255, 255, 255, " + range.opacityRange.max + ")");
            }
        }
    };
    /**
     * Splits this gradient range across any left/right boundaries
     * @param positionRange
     * @param opacityRange
     * @returns Array of ranges where transparancy/opacity stops/starts.
     */
    GradientLinear.prototype.calculateGradientStops = function (positionRange, opacityRange) {
        var ranges = [];
        // If our boundaries overlap the edges we interpolate where the left/right
        // opacity would be start or stop.
        var startOpacity = opacityRange.min;
        var stopOpacity = opacityRange.max;
        var positionX1 = positionRange.min;
        var positionX2 = positionRange.max;
        // If our visible window is fully off-screen to the left then we move it to the right as though it slid
        // from right to left.
        if (positionRange.min < 0 && positionRange.max < 0) {
            ranges.push(MakeGradientRange(new Range(100 + positionRange.min, 100 + positionRange.max), opacityRange));
        }
        // Likewise, if our visible window is fully off-screen to the right then we slide it to the left.
        if (positionRange.min > 100 && positionRange.max > 100) {
            ranges.push(MakeGradientRange(new Range(positionRange.min - 100, positionRange.max - 100), opacityRange));
        }
        if (positionX1 < 0) {
            // Truncate our left-side opacity and wrap it around to a new range at the end.
            var truncatedLeftOpacity = positionRange.mapValueToRange(0, opacityRange);
            ranges.push(MakeGradientRange(new Range(0, positionX2), new Range(truncatedLeftOpacity, stopOpacity)));
            // This is a range on the right side ending at 100% -- the effect is a full wraparound of the gradient
            // window.
            ranges.push(MakeGradientRange(new Range(100 + positionX1, 1), new Range(startOpacity, truncatedLeftOpacity)));
        }
        else if (positionX2 > 100) {
            var truncatedRightOpacity = positionRange.mapValueToRange(100, opacityRange);
            ranges.push(MakeGradientRange(new Range(positionX1, 100), new Range(startOpacity, truncatedRightOpacity)));
            ranges.push(MakeGradientRange(new Range(0, 100 - positionX2), new Range(truncatedRightOpacity, stopOpacity)));
        }
        else {
            ranges.push(MakeGradientRange(positionRange, opacityRange));
        }
        return ranges;
    };
    return GradientLinear;
}(Gradient));

var GradientType;
(function (GradientType) {
    GradientType[GradientType["None"] = 0] = "None";
    GradientType[GradientType["Linear"] = 1] = "Linear";
    GradientType[GradientType["Radial"] = 2] = "Radial";
})(GradientType || (GradientType = {}));
var SliderType;
(function (SliderType) {
    SliderType[SliderType["Static"] = 0] = "Static";
    SliderType[SliderType["Vertical"] = 1] = "Vertical";
    SliderType[SliderType["Horizontal"] = 2] = "Horizontal";
})(SliderType || (SliderType = {}));

/** Option names as they appear in the HTML tags. */
var options = [
    {
        paramName: 'start-position-x',
        defaultValue: -1
    },
    {
        paramName: 'start-position-y',
        defaultValue: -1
    },
    {
        paramName: 'size',
        defaultValue: 20
    }
];
/**
 * Single animated canvas that slides a vertical image slice across the canvas left to right, looping around at the
 * right side to the left.
 */
var SingleCanvasAxisSlider = /** @class */ (function (_super) {
    __extends(SingleCanvasAxisSlider, _super);
    function SingleCanvasAxisSlider(sliderType, gradientType, optionsElement, sliderImage, canvasElement, eventDispatcher, positionIncrement, gradientTransitionWidth) {
        var _this = _super.call(this, optionsElement, sliderImage, canvasElement, eventDispatcher) || this;
        _this.gradientType = gradientType;
        _this.sliderType = sliderType;
        _this.animationState = AnimationState.Inactive;
        _this.positionIncrement = positionIncrement;
        _this.gradientTransitionWidth = gradientTransitionWidth;
        _this.startPosition$ = [0, 0];
        _this.gradientCenter$ = [0, 0];
        _this.size$ = 0;
        return _this;
    }
    SingleCanvasAxisSlider.prototype.step = function (timestamp) {
        if (this.gradientType == GradientType.Linear)
            this.linearStep(timestamp);
        else
            this.radialStep(timestamp);
    };
    SingleCanvasAxisSlider.prototype.linearStep = function (timestamp) {
        this.gradientCenter$[0] += this.positionIncrement;
        if (this.gradientCenter$[0] > 100)
            this.gradientCenter$[0] = 0;
        if (this.gradientCenter$[0] < 0)
            this.gradientCenter$[0] = 100;
    };
    SingleCanvasAxisSlider.prototype.radialStep = function (timestamp) {
        this.gradientCenter$[0] += this.positionIncrement;
        var rightBound = 100 + this.size$;
        var leftBound = -this.size$;
        if (this.gradientCenter$[0] > rightBound) {
            this.gradientCenter$[0] = leftBound;
        }
        if (this.gradientCenter$[0] < leftBound) {
            this.gradientCenter$[0] = rightBound;
        }
    };
    SingleCanvasAxisSlider.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.addGradient();
    };
    SingleCanvasAxisSlider.prototype.addGradient = function () {
        if (this.gradientType == GradientType.Linear)
            this.addLinearGradient();
        else
            this.addRadialGradient();
    };
    SingleCanvasAxisSlider.prototype.addLinearGradient = function () {
        if (this.size$ > 0) {
            this.context.globalCompositeOperation = 'destination-out';
            var width = this.canvasElement.clientWidth;
            var height = this.canvasElement.clientHeight;
            var gradient = new GradientLinear(this.context, {
                width: width,
                height: height,
                centerPosition: this.gradientCenter$[0],
                visibleWindowWidth: this.size$,
                gradientTransitionWidth: this.gradientTransitionWidth
            });
            gradient.addGradientStops();
            this.context.fillStyle = gradient.gradientElement;
            this.context.fillRect(0, 0, this.canvasElement.clientWidth, this.canvasElement.clientHeight);
            this.context.globalCompositeOperation = 'source-over';
        }
    };
    SingleCanvasAxisSlider.prototype.addRadialGradient = function () {
        if (this.size$ > 0) {
            this.context.globalCompositeOperation = 'destination-out';
            var width = this.canvasElement.clientWidth;
            var height = this.canvasElement.clientHeight;
            var gradient = new GradientRadial(this.context, width, height, this.gradientCenter$, 0, (this.size$ / 100) * width, this.gradientTransitionWidth);
            gradient.addGradientStops();
            this.context.fillStyle = gradient.gradientElement;
            this.context.fillRect(0, 0, this.canvasElement.clientWidth, this.canvasElement.clientHeight);
            this.context.globalCompositeOperation = 'source-over';
        }
    };
    /**
     * Parses the HTML attribute parameters of the lower-level sliding image.
     * Errors are logged with the error handler routines from error.ts
     * (see [[HandleError]] function).
     * @param element
     */
    SingleCanvasAxisSlider.prototype.parseOptions = function () {
        var results = assignNullableAttributes(this.optionsElement, options);
        this.gradientCenter$[0] = results.next().value;
        this.gradientCenter$[1] = results.next().value;
        this.size$ = results.next().value;
        this.startPosition$[0] = this.gradientCenter$[0];
        this.startPosition$[1] = this.gradientCenter$[1];
    };
    SingleCanvasAxisSlider.prototype.updatePosition = function (position, movement) {
        if (this.gradientType == GradientType.Linear)
            this.updateLinearPosition(position, movement);
        else
            this.updateRadialPosition(position, movement);
    };
    SingleCanvasAxisSlider.prototype.updateRadialPosition = function (position, movement) {
        this.gradientCenter$[0] = movement[0] + this.startPosition$[0];
        this.gradientCenter$[1] = movement[1] + this.startPosition$[1];
        if (this.gradientCenter$[0] > 100)
            this.gradientCenter$[0] = this.gradientCenter$[0] - 100;
        if (this.gradientCenter$[0] < 0)
            this.gradientCenter$[0] = 100 + this.gradientCenter$[0];
        if (this.gradientCenter$[1] > 100)
            this.gradientCenter$[1] = this.gradientCenter$[1] - 100;
        if (this.gradientCenter$[1] < 0)
            this.gradientCenter$[1] = 100 + this.gradientCenter$[1];
    };
    SingleCanvasAxisSlider.prototype.updateLinearPosition = function (position, movement) {
        this.gradientCenter$[0] = movement[0] + this.startPosition$[0];
        if (this.gradientCenter$[0] > 100)
            this.gradientCenter$[0] = this.gradientCenter$[0] - 100;
        if (this.gradientCenter$[0] < 0)
            this.gradientCenter$[0] = 100 + this.gradientCenter$[0];
    };
    Object.defineProperty(SingleCanvasAxisSlider.prototype, "size", {
        get: function () {
            return this.size$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleCanvasAxisSlider.prototype, "gradientCenter", {
        get: function () {
            return [this.gradientCenter$[0], this.gradientCenter$[1]];
        },
        set: function (gradientCenter) {
            this.gradientCenter$[0] = gradientCenter[0];
            this.gradientCenter$[1] = gradientCenter[1];
            this.startPosition$[0] = gradientCenter[0];
            this.startPosition$[1] = gradientCenter[1];
        },
        enumerable: true,
        configurable: true
    });
    return SingleCanvasAxisSlider;
}(CanvasImageAnimationElement));

var parentOptions = [
    {
        paramName: 'transition-size',
        defaultValue: 1
    },
    {
        paramName: 'dragable',
        defaultValue: true
    },
    {
        paramName: 'position-increment',
        defaultValue: 0.5
    }
];
/**
 * An 'axis' slider is an canvas animation that only travels in the X,Y directions, as opposed to diagonal, etc.
 * This could eventually be extended to run along any vector direction.
 */
var MultiCanvasAxisSlider = /** @class */ (function (_super) {
    __extends(MultiCanvasAxisSlider, _super);
    function MultiCanvasAxisSlider(container, eventDispatcher, sliderType, gradientType, selectorPrefix) {
        var _this = _super.call(this, container, eventDispatcher, selectorPrefix) || this;
        _this.sliderState = new AxisSliderState();
        _this.sliderType = sliderType;
        _this.gradientType = gradientType;
        return _this;
    }
    MultiCanvasAxisSlider.prototype.parseOptions = function () {
        var results = assignNullableAttributes(this.container, parentOptions);
        this.transitionSize = results.next().value;
        this.dragable = results.next().value;
        this.positionIncrement = results.next().value;
    };
    MultiCanvasAxisSlider.prototype.incrementPosition = function () {
        if (this.sliderType == SliderType.Horizontal)
            this.sliderState.relativePosition[0] += this.positionIncrement;
        else
            this.sliderState.relativePosition[1] += this.positionIncrement;
        this.checkPositionBoundaries(this.sliderState.relativePosition);
    };
    MultiCanvasAxisSlider.prototype.checkPositionBoundaries = function (position) {
        var bounds = [0, 100];
        if (this.sliderType == SliderType.Horizontal) {
            if (position[0] < bounds[0])
                position[0] = bounds[1];
            if (position[0] > bounds[1])
                position[0] = bounds[0];
        }
        else {
            if (position[1] < bounds[0])
                position[1] = bounds[1];
            if (position[1] > bounds[1])
                position[1] = bounds[0];
        }
    };
    Object.defineProperty(MultiCanvasAxisSlider.prototype, "active", {
        get: function () {
            return (this.sliderState.animationState != AnimationState.Inactive &&
                this.sliderState.animationState != AnimationState.Dragging);
        },
        set: function (active) {
            this.sliderState.animationState = active ? this.sliderState.animationState = AnimationState.Active :
                AnimationState.Inactive;
        },
        enumerable: true,
        configurable: true
    });
    MultiCanvasAxisSlider.prototype.parseAndBuildChildren = function () {
        var childrenImages = this.container.getElementsByTagName('img');
        // Keep track of where the next slider center position will be based
        // on the previous visible window width.
        var nextPosition = 0;
        var startPosition = 0;
        for (var imageIndex = 0; imageIndex < childrenImages.length; imageIndex++) {
            startPosition = nextPosition;
            // Create an image element and parse attribute options.
            var image = childrenImages[imageIndex];
            var sliderImage = new SliderImage(image);
            // Each image in the slider has a canvas that we show/and hide parts
            // of to build the sliding transition effect.
            var canvasElement = createAndInsertCanvasElement(this.container, addSelectorPrefix(this.selectorPrefix, embeddedCanvasClass));
            var sliderCanvas = null;
            if (this.sliderType === SliderType.Static) {
                sliderCanvas = new CanvasImageAnimationElement(image, sliderImage, canvasElement, this.eventDispatcher);
            }
            else {
                var slider = new SingleCanvasAxisSlider(this.sliderType, this.gradientType, image, sliderImage, canvasElement, this.eventDispatcher, this.positionIncrement, this.transitionSize);
                slider.parseOptions();
                var autoPosition = startPosition + (slider.size / 2) - this.transitionSize;
                var sliderCenter = slider.gradientCenter;
                if (sliderCenter[0] === -1) {
                    slider.gradientCenter = [autoPosition, 0];
                }
                nextPosition = autoPosition + slider.size / 2;
                sliderCanvas = slider;
            }
            this.canvasLayers.push(sliderCanvas);
        }
        this.sliderState.resetState();
    };
    MultiCanvasAxisSlider.prototype.onDragEnd = function (params) {
        this.sliderState.animationState = AnimationState.Active;
    };
    MultiCanvasAxisSlider.prototype.onDragStart = function (params) {
        this.sliderState.animationState = AnimationState.Dragging;
        this.sliderState.absolutePosition = [params.x, params.y];
    };
    MultiCanvasAxisSlider.prototype.onMouseLeave = function (params) {
        this.sliderState.animationState = AnimationState.Active;
    };
    MultiCanvasAxisSlider.prototype.onMouseMove = function (params) {
        this.updatePositionsHelper(params, false);
    };
    MultiCanvasAxisSlider.prototype.updatePositionsHelper = function (params, forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        var relativeMovement = [0, 0];
        relativeMovement[0] = params.x - this.sliderState.absolutePosition[0];
        relativeMovement[1] = params.y - this.sliderState.absolutePosition[1];
        if (params.mouseDown && (relativeMovement[0] != 0 || relativeMovement[1] != 0 || forceUpdate)) {
            // We need the container height.  Unfortunately our container (a div)
            // can have height 0 so we need to grab it from the first slider canvas.
            if (this.canvasLayers.length > 0) {
                var width = this.canvasLayers[0].width;
                var height = this.canvasLayers[0].height;
                this.sliderState.absolutePosition = [params.x, params.y];
                this.sliderState.relativePosition[0] += 100 * (relativeMovement[0] / width);
                this.sliderState.relativePosition[1] += 100 * (relativeMovement[1] / height);
                for (var _i = 0, _a = this.canvasLayers; _i < _a.length; _i++) {
                    var sliderCanvas = _a[_i];
                    sliderCanvas.updatePosition(this.sliderState.absolutePosition, this.sliderState.relativePosition);
                }
                this.draw();
            }
        }
    };
    Object.defineProperty(MultiCanvasAxisSlider.prototype, "static", {
        get: function () {
            return this.sliderType === SliderType.Static;
        },
        enumerable: true,
        configurable: true
    });
    return MultiCanvasAxisSlider;
}(MultiCanvasSlider));

/**
 * ComponentBuilder parses and initializes a single canvas component on the page (out of potentially many).
 * Example component HTML with two different types of layered canvas animation:
 * ```html
 * <div class='canvan-animator'>
 *           <div class='canvan-linear-slider' transition-size='1' position-increment='0.1' dragable='true'>
 *               <picture>
 *                   <source srcset='/images/source_example2.webp' type='image/webp' />
 *                   <img src='/images/source_example2.jpg' type='image/jpeg'  static='true'/>
 *               </picture>
 *               <picture>
 *                   <source srcset='/images/mapped_example2.webp' type='image/webp' />
 *                   <img src='/images/mapped_example2.jpg' type='image/jpeg' window-width='50' start-position-x='50'/>
 *               </picture>
 *           </div>
 *           <div class='canvan-radial-slider' transition-size='1' position-increment='0.5' dragable='true'>
 *              <picture>
 *                  <source srcset='/images/source_example2.webp' type='image/webp' />
 *                  <img src='/images/source_example2.jpg' type='image/jpeg' radius='10' start-position-x='0' start-position-y='40' />
 *              </picture>
 *              <picture>
 *                  <source srcset='/images/mapped_example2.webp' type='image/webp' />
 *                  <img src='/images/mapped_example2.jpg' type='image/jpeg' radius='10' start-position-x='15' start-position-y='80' />
 *              </picture>
 *          </div>
 *      </div>
 *  </div>
 * ```
 */
var ComponentBuilder = /** @class */ (function () {
    /**
     * @param container  Outermost div element that contains all of the component elements and attribute params.
     * @param uniqueIndex  A unique number that identifies this slider (creator must supply this number).  This is
     * used to dynamically add a unique class to the component.
     */
    function ComponentBuilder(container, selectorPrefix, uniqueIndex) {
        this.selectorPrefix = selectorPrefix;
        this.uniqueIndex = uniqueIndex;
        this.container = container;
        this.options = new ComponentOptions();
        this.options.parse(container);
        this.className = addSelectorPrefix(this.selectorPrefix, uniqueSelectorID + "-" + this.uniqueIndex);
        addClass(container, this.className);
        this.canvasArray = [];
        this.eventDispatcher = new EventDispatcher();
        this.touchHandler = new TouchHandler(this.container, this.eventDispatcher, this.selectorPrefix);
        this.animator = new Animator(this.container, this.canvasArray, this.eventDispatcher);
        if (this.options.dragable)
            this.touchHandler.addMouseListeners(container);
    }
    /**
     * Asynchronously parse our children elements.
     */
    ComponentBuilder.prototype.parseAndBuildElements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var children, index, classes, gradientType, sliderType, sliders, loadAll;
            var _this = this;
            return __generator(this, function (_a) {
                children = this.container.getElementsByTagName("div");
                for (index = 0; index < children.length; index++) {
                    classes = children[index].classList;
                    if (classes != null) {
                        gradientType = void 0;
                        sliderType = SliderType.Horizontal;
                        if (classes.contains(addSelectorPrefix(this.selectorPrefix, staticSliderSelectorName))) {
                            gradientType = GradientType.None;
                            sliderType = SliderType.Static;
                        }
                        else if (classes.contains(addSelectorPrefix(this.selectorPrefix, linearSliderSelectorName)))
                            gradientType = GradientType.Linear;
                        else if (classes.contains(addSelectorPrefix(this.selectorPrefix, radialSliderSelectorName)))
                            gradientType = GradientType.Radial;
                        sliders = new MultiCanvasAxisSlider(children[index], this.eventDispatcher, sliderType, gradientType, this.selectorPrefix);
                        this.canvasArray.push(sliders);
                    }
                }
                loadAll = this.canvasArray.map(function (sliderCanvas, index) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, sliderCanvas.init()];
                    });
                }); });
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            Promise.all(loadAll)
                                .then(function () {
                                resolve();
                            })
                                .catch(function (error) {
                                reject(error);
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    /**
     * Start animating all of our components.
     */
    ComponentBuilder.prototype.animate = function () {
        this.animator.start();
    };
    return ComponentBuilder;
}());

/**
 *  SliderCreator parses the current document and creates and initializes all of the sliders on the page.
 */
var SliderCreator = /** @class */ (function () {
    /**
     * Constructor
     * @param document Top-level document for the page.
     * @param selectorPrefix Allows the HTML classes searched to use a different selector 'namespace' in case there
     * are somehow class collisions.
     */
    function SliderCreator(document, selectorPrefix) {
        if (selectorPrefix === void 0) { selectorPrefix = 'canvan'; }
        this.document = document;
        this.selectorPrefix = selectorPrefix;
        this.sliders = null;
    }
    /**
     * Asynchronously query the page for selectors and initialize.  Returns a promise that when
     * completed all of the sliders have been created, images loaded, and can be animated.
     */
    SliderCreator.prototype.scanAndCreateSliders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var elements, index, element, elementTag, all;
            var _this = this;
            return __generator(this, function (_a) {
                elements = document.getElementsByClassName(addSelectorPrefix(this.selectorPrefix, animatorSelectorName));
                // Load all of our slider elements into an array and parse and create them.  Note, images
                // are loaded at this point and we return a promise when everything is ready to animate.
                this.sliders = [];
                for (index = 0; index < elements.length; index++) {
                    element = elements[index];
                    elementTag = element.tagName.toLowerCase();
                    if (elementTag === 'div') {
                        this.sliders[index] = new ComponentBuilder(element, this.selectorPrefix, index);
                    }
                    else {
                        handleError(ErrorType.Warning, "Invalid element type " + element.tagName + " for slider, expected 'div', ignoring.");
                    }
                }
                all = this.sliders.map(function (slider, index, sliders) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, slider.parseAndBuildElements()];
                    });
                }); });
                return [2 /*return*/, Promise.all(all)];
            });
        });
    };
    /** Start animating all of the sliders. */
    SliderCreator.prototype.animate = function () {
        if (!this.sliders) {
            handleError(ErrorType.Error, 'Sliders not initialized before requesting animation.');
            return;
        }
        for (var index = 0; index < this.sliders.length; index++) {
            this.sliders[index].animate();
        }
    };
    return SliderCreator;
}());

var sliderCreator;
var attributeSelectorPrefix = 'canvan';
function waitForDomContentLoaded() {
    return new Promise(function (resolve) {
        window.addEventListener('DOMContentLoaded', function (event) {
            var target = event.target;
            var document = target;
            resolve(document);
        });
    });
}
/**
 *  Wait for the DOM content to be loaded before we initialize our sliders.  We rely
 *  on exceptions to handle lower-level errors.
 */
waitForDomContentLoaded()
    .then(function (document) {
    sliderCreator = new SliderCreator(document, attributeSelectorPrefix);
    sliderCreator.scanAndCreateSliders()
        .then(function () {
        sliderCreator.animate();
    })
        .catch(function (error) {
        console.error(error);
    });
})
    .catch(function (error) {
    console.error(error);
});
