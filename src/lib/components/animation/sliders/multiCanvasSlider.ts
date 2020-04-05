import { MultiCanvasDragableAnimationElement } from '../multiCanvasAnimationElement';
import { EventDispatcher } from '../../eventDispatcher';

/**
 *  A component that contains multiple 'single canvas sliders', all layered on top of each other with
 *  component-defined transparency.
 */
export abstract class MultiCanvasSlider extends MultiCanvasDragableAnimationElement {
    constructor(container: Element, eventDispatcher: EventDispatcher, selectorPrefix: string) {
        super(selectorPrefix);
        this.container = container;
        this.eventDispatcher = eventDispatcher;
        this.parseOptions();

        if (this.dragable) this.addMouseListeners(this.eventDispatcher);
    }

    step(timestamp: number) {
        if (this.active) {
            this.incrementPosition();
            for (let layer of this.canvasLayers) {
                layer.step(timestamp);
            }
        }
    }

    abstract incrementPosition(): void;
    abstract parseOptions(): void;
    abstract get active(): boolean;
    abstract get static(): boolean;
    abstract parseAndBuildChildren(): void;

    protected container: Element;
    protected eventDispatcher: EventDispatcher;
    protected dragable: boolean;
}
