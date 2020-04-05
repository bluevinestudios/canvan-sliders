import * as utils from "../utils";
import * as constants from "../constants";
import { TouchHandler } from "./touchHandler";
import { EventDispatcher } from "./eventDispatcher";
import { Animator } from "./animation/animator";
import { GlobalOptions } from "./globalOptions";
import { MultiCanvasAnimationElement } from "./animation/multiCanvasAnimationElement";
import { MultiCanvasAxisSlider } from "./animation/sliders/multiCanvasAxisSlider";
import { SliderType, GradientType } from "./animation/sliders/axisSliderTypes";

/**
 *  A single slider component with 1+ images to display and animate.
 */
export class CanvasBuilder {
    /**
     * Create a new slider
     * @param container  Outermost div element that contains all of the image data.
     * @param uniqueIndex  A unique number that identifies this slider (creator must supply this number).
     */
    constructor(container: Element, public selectorPrefix: string, public uniqueIndex: number) { 
        this.container = container;

        this.options = new GlobalOptions();
        this.options.parse(container);

        // Create a unique index to identify this slider.
        this.className = utils.addSelectorPrefix(
            this.selectorPrefix,
            `${constants.uniqueSelectorID}-${this.uniqueIndex}`
        );

        utils.addClass(container, this.className);

        this.canvasArray = [];
        this.eventDispatcher = new EventDispatcher();
        this.touchHandler = new TouchHandler(this.container, this.eventDispatcher, this.selectorPrefix);

        this.animator = new Animator(this.container, this.canvasArray, this.eventDispatcher);

        if (this.options.dragable) this.touchHandler.addMouseListeners(container);
    }

    async parseAndBuildElements(): Promise<void> {
        let children = this.container.getElementsByTagName("div");
        for (let index = 0; index < children.length; index++) {
            let classes = children[index].classList;
            if (classes != null) {
                                
                // Support multiple animation types with this class selection.
                let gradientType: GradientType;
                if (classes.contains(utils.addSelectorPrefix(this.selectorPrefix, constants.linearSliderSelectorName)))
                    gradientType = GradientType.Linear;
                else if (classes.contains(utils.addSelectorPrefix(this.selectorPrefix, constants.radialSliderSelectorName)))
                    gradientType = GradientType.Radial

                let sliders = new MultiCanvasAxisSlider(
                    children[index],
                    this.eventDispatcher,
                    SliderType.Horizontal,
                    gradientType,
                    this.selectorPrefix
                );
                this.canvasArray.push(sliders);
            }
        }
        const loadAll: Promise<void>[] =
            this.canvasArray.map(async (sliderCanvas: MultiCanvasAnimationElement, index: number) => {
                sliderCanvas.init();
            });
        
        return new Promise<void>(async () => {
            await Promise.all(loadAll);            
        });  
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
