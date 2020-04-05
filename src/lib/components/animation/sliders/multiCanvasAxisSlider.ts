import * as error from "../../../error";
import * as utils from "../../../utils";
import * as constants from "../../../constants";
import * as common from "../../../common";
import { AxisSliderState, AnimationState } from "./axisSliderState";
import { SliderImage } from "../../sliderImage";
import { CanvasImageAnimationElement } from "../canvasImageAnimationElement";
import { MultiCanvasAnimationElement } from "../multiCanvasAnimationElement";
import { MultiCanvasSlider } from "./multiCanvasSlider";
import { Animatable } from "../animatable";
import { SingleCanvasAxisSlider } from "./singleCanvasAxisSlider";
import { GradientLinear } from "../../gradientLinear";
import { EventDispatcher } from "../../eventDispatcher";
import { EventType, MouseEventParams, ResizeParams } from "../../eventTypes";
import { CanvasAnimationElement } from "../canvasAnimationElement";
import { GradientType, SliderType } from './axisSliderTypes';


const parentOptions: common.OptionsArray = [
    {
        paramName: "transition-size",
        defaultValue: 1
    },
    {
        paramName: "dragable",
        defaultValue: true
    },
    {
        paramName: "position-increment",
        defaultValue: 0.5
    }
];

const childOptions: common.OptionsArray = [
    {
        paramName: "start-position-x",
        defaultValue: -1
    },
    {
        paramName: "start-position-y",
        defaultValue: -1
    },
    {
        paramName: "static",
        defaultValue: false
    }
];

export class MultiCanvasAxisSlider extends MultiCanvasSlider {
    constructor(
        container: Element,
        eventDispatcher: EventDispatcher,
        sliderType: SliderType,
        gradientType: GradientType,
        selectorPrefix: string
    ) {
        super(container, eventDispatcher, selectorPrefix);

        this.static$ = false;
        this.sliderState = new AxisSliderState();
        this.sliderType = sliderType;
        this.gradientType = gradientType;
    }

    parseOptions() {
        let results = utils.assignNullableAttributes(
            this.container,
            parentOptions
        );
        this.transitionSize = results.next().value / 100;
        this.dragable = results.next().value;
        this.positionIncrement = results.next().value / 100;
    }

    incrementPosition() {
        if (this.sliderType == SliderType.Horizontal)
            this.sliderState.relativePosition[0] += this.positionIncrement;
        else this.sliderState.relativePosition[1] += this.positionIncrement;        
        this.checkPositionBoundaries(this.sliderState.relativePosition);
    }

    checkPositionBoundaries(position: [number, number]) {
        let bounds = [0, 1];
        if (this.sliderType == SliderType.Horizontal) {
            if (position[0] < bounds[0]) position[0] = bounds[1];
            if (position[0] > bounds[1]) position[0] = bounds[0];
        } else {
            if (position[1] < bounds[0]) position[1] = bounds[1];
            if (position[1] > bounds[1]) position[1] = bounds[0];
        }
    }

    get active(): boolean {
        return (
            this.sliderState.animationState != AnimationState.Inactive &&
            this.sliderState.animationState != AnimationState.Dragging
        );
    }

    parseAndBuildChildren(): void {
        let childrenImages = this.container.getElementsByTagName("img");

        // Keep track of where the next slider center position will be based
        // on the previous visible window width.
        let nextPosition = 0;
        let startPosition = 0;
        for (
            let imageIndex = 0;
            imageIndex < childrenImages.length;
            imageIndex++
        ) {
            startPosition = nextPosition;

            // Create an image element and parse attribute options.
            let image: HTMLImageElement = childrenImages[imageIndex];
            let sliderImage = new SliderImage(image);

            // Each image in the slider has a canvas that we show/and hide parts
            // of to build the sliding transition effect.
            let canvasElement = utils.createAndInsertCanvasElement(
                this.container,
                utils.addSelectorPrefix(this.selectorPrefix, constants.embeddedCanvasClass)
            );

            let autoPosition = startPosition - this.transitionSize;

            let results = utils.assignNullableAttributes(image, childOptions);
            let thisStartPositionX = results.next().value;
            let thisStartPositionY = results.next().value;

            if (thisStartPositionX == -1) thisStartPositionX = autoPosition;
            else thisStartPositionX /= 100;
            if (thisStartPositionY == -1) thisStartPositionY = autoPosition;
            else thisStartPositionY /= 100;

            this.static$ = results.next().value;

            //this.parseChildCanvasOptions(image);

            let sliderCanvas: CanvasAnimationElement = null;
            if (this.static$) {
                sliderCanvas = new CanvasImageAnimationElement(
                    image,
                    sliderImage,
                    canvasElement,
                    this.eventDispatcher
                );
            } else {
                let slider = new SingleCanvasAxisSlider(
                    this.sliderType,
                    this.gradientType,
                    image,
                    sliderImage,
                    canvasElement,
                    this.eventDispatcher,
                    [thisStartPositionX, thisStartPositionY],
                    AnimationState.Active,
                    this.positionIncrement,
                    this.transitionSize
                );
                slider.parseOptions();
                if (slider.visibleWindowWidth > 0)
                    nextPosition =
                        thisStartPositionX + slider.visibleWindowWidth;

                sliderCanvas = slider;
            }
            this.canvasLayers.push(sliderCanvas);
        }

        this.sliderState.resetState();
    }

    onDragEnd(params: MouseEventParams) {
        this.sliderState.animationState = AnimationState.Active;
    }

    onDragStart(params: MouseEventParams) {
        this.sliderState.animationState = AnimationState.Dragging;
        this.sliderState.absolutePosition = [params.x, params.y];
    }

    onMouseLeave(params: MouseEventParams) {
        this.sliderState.animationState = AnimationState.Active;
    }

    onMouseMove(params: MouseEventParams) {
        this.updatePositionsHelper(params, false);
    }

    private updatePositionsHelper(
        params: MouseEventParams,
        forceUpdate: boolean = false
    ) {
        let relativeMovement = [0, 0];
        //if (this.sliderType == SliderType.Horizontal)
        relativeMovement[0] =
            params.x - this.sliderState.absolutePosition[0];
        //else
        relativeMovement[1] =
            params.y - this.sliderState.absolutePosition[1];

        if (params.mouseDown && (relativeMovement[0] != 0 || relativeMovement[1] != 0 || forceUpdate)) {
            // We need the container height.  Unfortunately our container (a div)
            // can have height 0 so we need to grab it from the first slider canvas.
            if (this.canvasLayers.length > 0) {
                let width = this.canvasLayers[0].width;
                let height = this.canvasLayers[1].height;

                this.sliderState.absolutePosition = [
                    params.x,
                    params.y
                ];

                this.sliderState.relativePosition = [0, 0];
                //if (this.sliderType == SliderType.Horizontal) {
                    this.sliderState.relativePosition[0] +=
                        relativeMovement[0] / width;
                //} else {
                    this.sliderState.relativePosition[1] +=
                        relativeMovement[1] / height;
                //}

                for (let sliderCanvas of this.canvasLayers) {
                    sliderCanvas.updatePosition(
                        this.sliderState.absolutePosition,
                        this.sliderState.relativePosition
                    );
                }
                this.draw();
            } 
        } 
    }

    get static() {
        return this.static$;
    }

    transitionSize: number;
    positionIncrement: number;
    protected position: [number, number];
    protected sliderState: AxisSliderState;
    private lastStartPosition: number;
    private sliderType: SliderType;
    private gradientType: GradientType;
    private static$: boolean;
}
