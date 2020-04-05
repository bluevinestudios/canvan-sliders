import { EventDispatcher } from '../eventDispatcher';
import { EventType, ResizeParams } from '../eventTypes';
import { Animatable } from './animatable';

/**
 * Class to administer initialization and animation of animatable elements.
 * Multiple canvas elements will be animated using the high-performance
 * 'window.requestAnimationFrame' function.
 */
export class Animator {
    constructor(container: Element, animationElements: Animatable[], eventDispatcher: EventDispatcher) {
        this.eventDispatcher = eventDispatcher;
        this.container = container;
        this.animationElements = animationElements;
        this.lastHeight = this.lastWidth = 0;
        this.active = false;
    }

    addElement(animationElement: Animatable) {
        this.animationElements.push(animationElement);
    }

    /**
     * Stub callback function for our window frame paint event so that the core code can be reused.  
     * See frameEvent below.
     * @param timestamp
     */
    private animateFrameEvent(timestamp: number) {
        this.frameEvent(timestamp, true);
    }

    /**
     * This is the core animation function attached to our document window 'requestAnimationFrame' callback event.
     * @param timestamp Not used at the moment.
     * @param requestNewFrame True if we should recursively ask for a new
     * animation callback.
     */
    private frameEvent(timestamp: number, requestNewFrame: boolean) {
        for (let animationElement of this.animationElements) {
            if (animationElement.active) {
                animationElement.draw();
                animationElement.step(timestamp);
            }
        }

        // Currently this is the best way to detect a resize events until
        // the DOM supports an element-specific size change event.
        if (this.container.clientWidth != this.lastWidth || this.container.clientHeight != this.lastHeight) {
            this.eventDispatcher.dispatch(
                EventType.Resize,
                ResizeParams(this.container.clientWidth, this.container.clientHeight)
            );

            this.initializeAnimation();
        }

        if (this.active && requestNewFrame) window.requestAnimationFrame(this.animateFrameEvent.bind(this));
    }

    private initializeAnimation() {
        this.lastWidth = this.container.clientWidth;
        this.lastHeight = this.container.clientHeight;

        // Sending a resize event tells our children elements what size they are after initialization.
        this.eventDispatcher.dispatch(
            EventType.Resize,
            ResizeParams(this.container.clientWidth, this.container.clientHeight)
        );
    }

    start() {
        this.initializeAnimation();
        this.active = true;
        this.animateFrameEvent(0);
    }

    stop() {
        this.active = false;
    }

    protected eventDispatcher: EventDispatcher;
    protected container: Element;
    protected animationElements: Animatable[];
    protected active: boolean;

    // We keep track of when our size changes so we can resize.
    private lastWidth: number;
    private lastHeight: number;
}
