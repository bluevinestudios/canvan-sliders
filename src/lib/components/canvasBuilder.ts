import * as utils from '../utils';
import * as constants from '../constants';
import { TouchHandler } from './touchHandler';
import { EventDispatcher } from './eventDispatcher';
import { Animator } from './animation/animator';
import { GlobalOptions } from './globalOptions';
import { MultiCanvasAnimationElement } from './animation/multiCanvasAnimationElement';
import { MultiCanvasAxisSlider, SliderType, GradientType } from './animation/sliders/multiCanvasAxisSlider';
//import { LinearSliders } from "./animation/sliders/linearSliders";
//import { RadialSliders } from "./animation/sliders/radialSliders";

/**
 *  A single slider component with 1+ images to display and animate.
 */
export class CanvasBuilder {
    /**
     * Create a new slider
     * @param container  Outermost div element that contains all of the image data.
     * @param uniqueIndex  A unique number that identifies this slider (creator must supply this number).
     */
    constructor(container: Element, public uniqueIndex: number) {
        this.container = container;

        this.options = new GlobalOptions();
        this.options.parse(container);

        // Create a unique index to identify this slider.
        this.className = `${constants.uniqueSelectorID}-${this.uniqueIndex}`;

        utils.addClass(container, this.className);

        this.canvasArray = [];
        this.eventDispatcher = new EventDispatcher();
        this.touchHandler = new TouchHandler(
            this.container,
            this.eventDispatcher
        );

        this.animator = new Animator(
            this.container,
            this.canvasArray,
            this.eventDispatcher
        );

        if (this.options.dragable)
            this.touchHandler.addMouseListeners(container);
    }

    async parseAndBuildElements(): Promise<void> {
        let children = this.container.getElementsByTagName("div");
        for (let index = 0; index < children.length; index++) {
            let classes = children[index].classList;
            if (classes != null) {
                // Support multiple animation types with this class selection.
                if (classes.contains(constants.linearSliderSelectorName)) {
                    let sliders = new MultiCanvasAxisSlider(
                        children[index],
                        this.eventDispatcher,
                        SliderType.Horizontal,
                        GradientType.Linear
                    );
                    this.canvasArray.push(sliders);
                } else if (
                    classes.contains(constants.radialSliderSelectorName)
                ) {
                    let sliders = new MultiCanvasAxisSlider(
                        children[index],
                        this.eventDispatcher,
                        SliderType.Horizontal,
                        GradientType.Radial
                    );
                    this.canvasArray.push(sliders);
                }
            }
        }
        const loadAll = this.canvasArray.map(
            async (sliderCanvas: MultiCanvasAnimationElement, index: number) => {
                return sliderCanvas.init();
            }
        );
        let results = Promise.all(loadAll);
        /*return new Promise<void>(async () => {
            return Promise.all(loadAll)
        }); */
    }
    animate() {
        this.animator.start();
    }

    //private sliderState: SliderState;
    private animator: Animator;
    private container: Element;
    private options: GlobalOptions;
    private canvasArray: MultiCanvasAnimationElement[];
    private readonly className: string;
    private touchHandler: TouchHandler;
    private eventDispatcher: EventDispatcher;
}
