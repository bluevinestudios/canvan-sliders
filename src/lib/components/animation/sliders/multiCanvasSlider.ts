import { MultiCanvasDragableAnimationElement } from "../multiCanvasAnimationElement";
import { EventDispatcher } from "../../eventDispatcher";

export abstract class MultiCanvasSlider
    extends MultiCanvasDragableAnimationElement {

    constructor(
        container: Element,
        eventDispatcher: EventDispatcher,
        selectorPrefix: string
    ) {
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

    //bstract parseChildCanvasOptions(optionsElement: Element): void;
    abstract incrementPosition(): void;
    abstract parseOptions(): void;
    abstract get active(): boolean;
    abstract get static(): boolean;
    abstract parseAndBuildChildren(): void;

    protected container: Element;
    protected eventDispatcher: EventDispatcher;
    protected dragable: boolean;
}
