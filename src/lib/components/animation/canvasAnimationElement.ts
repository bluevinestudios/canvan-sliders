import { SliderImage } from "../sliderImage";
import { EventDispatcher } from "../eventDispatcher";
import { EventType, ResizeParams } from "../eventTypes";
import { Animatable } from "./animatable";

/**
 * Abstract class to handle a given canvas animation layer.  Responsible for
 * drawing, time step increments, resizing, etc.
 */
export abstract class CanvasAnimationElement implements Animatable {
    /**
     * Constructor
     * @param optionsElement DOM element that has attribute option parameters
     * to parse from.
     * @param canvasElement  Canvas element to draw on.
     * @param eventDispatcher  Dispatcher to publish or subscribe to events.
     */
    constructor(
        optionsElement: Element,
        canvasElement: HTMLCanvasElement,
        eventDispatcher: EventDispatcher
    ) {
        this.optionsElement = optionsElement;
        this.canvasElement = canvasElement;
        this.eventDispatcher = eventDispatcher;
        this.eventDispatcher.subscribe(
            EventType.Resize,
            this.onResize.bind(this)
        );
    }

    /**
     *  Initialization, returns a promise that is resolved when this canvas
     *  is ready to go (images loaded, etc.)
     */
    abstract async init(): Promise<void>;

    abstract draw();
    abstract step(timestamp: number);
    abstract parseOptions();

    /**
     * Update the position based on mouse movement
     * @param position X,Y position with values [0, 1] where the mouse is.
     * @param movement Differential mouse movement between move events (0-1).
     */
    abstract updatePosition(
        position: [number, number],
        movement: [number, number]
    );

    resize() {
        this.canvasElement.width =
            window.devicePixelRatio * this.canvasElement.clientWidth;
        this.canvasElement.height =
            window.devicePixelRatio * this.canvasElement.clientHeight;

        this.context = this.canvasElement.getContext("2d", {
            alpha: true
        }) as CanvasRenderingContext2D;

        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    private onResize(resizeParams: ResizeParams) {
        this.resize();
    }

    get width(): number {
        return this.canvasElement.clientWidth;
    }
    get height(): number {
        return this.canvasElement.clientHeight;
    }

    /** If not active, this element may not receive draw or step events. */
    get active(): boolean {
        return false;
    }

    protected canvasElement: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;
    protected eventDispatcher: EventDispatcher;
    protected optionsElement: Element;
}