import * as utils from "../../../utils";
import * as constants from "../../../constants";
import { MultiCanvasDragableAnimationElement }
    from "../multiCanvasAnimationElement";
import { EventDispatcher } from "../../eventDispatcher";
import { SliderImage } from "../../sliderImage";
import { CanvasAnimationElement } from "../canvasAnimationElement";
import { CanvasImageAnimationElement } from "../canvasImageAnimationElement";
import { CanvasAxisSlider } from './canvasAxisSlider';

export abstract class MultiCanvasSlider
    extends MultiCanvasDragableAnimationElement {

    constructor(container: Element, eventDispatcher: EventDispatcher) {
        super();
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

/*    buildCanvasElements() {
        let childrenImages = this.container.getElementsByTagName("img");

        let startPosition = 0;
        for (
            let imageIndex = 0;
            imageIndex < childrenImages.length;
            imageIndex++
        ) {
            // Create an image element and parse attribute options.
            let image: HTMLImageElement = childrenImages[imageIndex];
            let sliderImage = new SliderImage(image);

            // Each image in the slider has a canvas that we show/and hide parts of to build
            // the sliding transition effect.
            let canvasElement = utils.createAndInsertCanvasElement(
                this.container,
                constants.embeddedCanvasClass
            );

            this.parseChildCanvasOptions(image);

            let sliderCanvas: CanvasAnimationElement = null;

            if (this.static) {
                sliderCanvas = new CanvasImageAnimationElement(
                    image,
                    sliderImage,
                    canvasElement,
                    this.eventDispatcher
                );
            } else {
                let slider = new CanvasAxisSlider(
                    image,
                    sliderImage,
                    canvasElement,
                    this.eventDispatcher,
                    [thisStartPositionX, thisStartPositionY],
                    AnimationState.LeftRight,
                    this.positionIncrement,
                    this.transitionWidth
                );
                slider.parseOptions();
                sliderCanvas = slider;
            }
            this.canvasLayers.push(sliderCanvas);
        }

        this.sliderState.resetState();
    } */

    abstract parseChildCanvasOptions(optionsElement: Element): void;
    abstract incrementPosition();
    abstract parseOptions();
    abstract get active(): boolean;
    abstract get static(): boolean;
    abstract parseAndBuildChildren();

    protected container: Element;
    protected eventDispatcher: EventDispatcher;
    protected dragable: boolean;
}
