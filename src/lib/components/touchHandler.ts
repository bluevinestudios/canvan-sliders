import * as utils from '../utils';
import { EventDispatcher } from './eventDispatcher';
import { EventType, MouseEventParams } from './eventTypes';

/**
 *  Class names to add to our element dragging.  Note, a customizable prefix is added to these for uniqueness.
 *  See [[SliderCreator]].
 */
const mouseDownClass = 'mouse-down';
const mouseGrabClass = 'mouse-grab';

/**
 *  Class to manage touch events, currently only supporting desktop mouse events.
 */
export class TouchHandler {
    /**
     * Constructor
     * @param element High-level element to watch for mouse events.  The classes defined in the
     * [mouseDownClass] and [mouseGrabClass] constants are added to this element dynamically.
     * @param eventDispatcher: Dispatcher for touch/mouse events.
     * @param selectorPrefix: Prefix to prepend to the mouse down/grab classes.
     */
    constructor(element: Element, eventDispatcher: EventDispatcher, public selectorPrefix: string) {
        this.container = element;
        this.eventDispatcher = eventDispatcher;
        this.dragging = false;

        this.mouseEventItems = [
            { name: 'mousedown', event: this.mouseDown },
            { name: 'mouseup', event: this.mouseUp },
            { name: 'mousemove', event: this.mouseMove },
            { name: 'mouseleave', event: this.mouseLeave }
        ];
        for (let mouseEvent of this.mouseEventItems) {
            mouseEvent.event = mouseEvent.event.bind(this);
        }
    }

    addMouseListeners(element: Element) {
        // TODO: add touch capabilities.
        //addListener(element, 'touchstart', this.mouseDownEvent);
        //addListener('touchend', this.mouseUpEvent);
        //addListener('touchcancel', this.mouseUpEvent);
        //element.addEventListener('mousedown', this.mouseDownEvent);
        for (let mouseEvent of this.mouseEventItems) {
            element.addEventListener(mouseEvent.name, mouseEvent.event);
        }
    }

    removeMouseListeners(element: Element) {
        //removeListener('touchstart', this.mouseDownEvent);
        //removeListener('touchend', this.mouseUpEvent);
        //removeListener('touchcancel', this.mouseUpEvent);
        //removeListener('touchmove', this.mouseMoveEvent);

        for (let mouseEvent of this.mouseEventItems) {
            element.removeEventListener(mouseEvent.name, mouseEvent.event);
        }
    }

    private mouseDown(event: Event): void {
        utils.addClass(this.container, utils.addSelectorPrefix(this.selectorPrefix, mouseDownClass));
        this.dragging = true;
        this.dispatchMouseEvent(event, EventType.DragStart);
    }

    private mouseUp(event: Event): void {
        this.removeMouseClasses();
        this.dragging = false;
        this.dispatchMouseEvent(event, EventType.DragEnd);
    }

    private mouseMove(event: Event): void {
        utils.addClass(this.container, utils.addSelectorPrefix(this.selectorPrefix, mouseGrabClass));
        this.dispatchMouseEvent(event, EventType.MouseMove);
    }

    private mouseLeave(event: Event): void {
        if (this.dragging) {
            this.dragging = false;
            this.removeMouseClasses();
            this.dispatchMouseEvent(event, EventType.MouseLeave);
        }
    }

    private removeMouseClasses() {
        utils.removeClass(this.container, mouseDownClass);
        utils.removeClass(this.container, mouseGrabClass);
    }

    private dispatchMouseEvent(event: Event, eventType: EventType) {
        const mouseEvent = event as MouseEvent;

        this.eventDispatcher.dispatch(
            eventType,
            MouseEventParams(mouseEvent.x, mouseEvent.y, mouseEvent.movementX, mouseEvent.movementY, this.dragging)
        );
    }

    private dragging: boolean;
    private container: Element;
    private eventDispatcher: EventDispatcher;

    private mouseEventItems: MouseEventItem[];
}

/**
 * Helper data structure to manage mouse events bound to our touch handler.
 **/
interface MouseEventItem {
    name: string;
    event: utils.DOMEventHandler;
}
