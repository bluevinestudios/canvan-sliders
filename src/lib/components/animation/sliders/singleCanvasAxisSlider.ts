import * as error from "../../../error";
import * as utils from "../../../utils";
import * as constants from "../../../constants";
import { AnimationState, AxisSliderState } from "./axisSliderState";
import { SliderImage } from "../../sliderImage";
import { CanvasImageAnimationElement } from "../canvasImageAnimationElement";
import { GradientRadial } from "../../gradientRadial";
import { EventDispatcher } from "../../eventDispatcher";
import { EventType, ResizeParams } from "../../eventTypes";
import { GradientLinear } from "../../gradientLinear";
import { GradientType, SliderType } from './axisSliderTypes';

/** Option names as they appear in the HTML tags. */
const windowWidthParamName = "window-width";
const radiusParamName = "radius";

/**
 * Animated canvas that slides a visible image vertical slice across the canvas
 * left to right, looping around at the right side to the left.
 */
export class SingleCanvasAxisSlider extends CanvasImageAnimationElement {
    constructor(
        sliderType: SliderType,
        gradientType: GradientType,
        optionsElement: Element,
        sliderImage: SliderImage,
        canvasElement: HTMLCanvasElement,
        eventDispatcher: EventDispatcher,
        gradientCenter: [number, number],
        animationState: AnimationState,
        positionIncrement: number,
        gradientTransitionWidth: number
    ) {
        super(optionsElement, sliderImage, canvasElement, eventDispatcher);

        this.gradientType = gradientType;
        this.sliderType = sliderType;
        this.animationState = animationState;
        this.gradientCenter = gradientCenter;
        this.positionIncrement = positionIncrement;
        this.gradientTransitionWidth = gradientTransitionWidth;
        this.startPosition = this.gradientCenter;
    }

    step(timestamp: number) {
        if (this.gradientType == GradientType.Linear)
            this.linearStep(timestamp);
        else
            this.radialStep(timestamp);
    }

    linearStep(timestamp: number) {
        this.gradientCenter[0] += this.positionIncrement;
        if (this.gradientCenter[0] > 1) this.gradientCenter[0] = 0;
        if (this.gradientCenter[0] < 0) this.gradientCenter[0] = 1;
    }

    radialStep(timestamp: number) {
        this.gradientCenter[0] += this.positionIncrement;

        let rightBound = 1 + this.radius;
        let leftBound = -this.radius;
        if (this.gradientCenter[0] > rightBound) {
            this.gradientCenter[0] = leftBound;
        }
        if (this.gradientCenter[0] < leftBound) {
            this.gradientCenter[0] = rightBound;
        }
    }

    draw() {
        super.draw();
        this.addGradient();
    }
    addGradient() {
        if (this.gradientType == GradientType.Linear)
            this.addLinearGradient();
        else
            this.addRadialGradient();
    }

    addLinearGradient() {
        if (this.windowWidth > 0) {
            this.context.globalCompositeOperation = "destination-out";

            let width = this.canvasElement.clientWidth;
            let height = this.canvasElement.clientHeight;
            let gradient = new GradientLinear(
                this.context,
                {
                    width,
                    height,
                    centerPosition: this.gradientCenter[0],
                    visibleWindowWidth: this.windowWidth,
                    gradientTransitionWidth: this.gradientTransitionWidth
                }
            );

            gradient.addGradientStops();

            this.context.fillStyle = gradient.gradientElement;
            this.context.fillRect(
                0,
                0,
                this.canvasElement.clientWidth,
                this.canvasElement.clientHeight
            );
            this.context.globalCompositeOperation = "source-over";
        }
    }

    addRadialGradient() {
        if (this.radius > 0) {
            this.context.globalCompositeOperation = "destination-out";

            let width = this.canvasElement.clientWidth;
            let height = this.canvasElement.clientHeight;
            let gradient = new GradientRadial(
                this.context,
                width,
                height,
                this.gradientCenter,
                0,
                this.radius * width,
                this.gradientTransitionWidth
            );
            gradient.addGradientStops();
            
            this.context.fillStyle = gradient.gradientElement;
            this.context.fillRect(
                0,
                0,
                this.canvasElement.clientWidth,
                this.canvasElement.clientHeight
            );
            this.context.globalCompositeOperation = "source-over";            
        }
    }

    /**
     * Parses the HTML attribute parameters of the lower-level sliding image.
     * Errors are logged with the error handler routines from error.ts
     * (see [[HandleError]] function).
     * @param element
     */
    parseOptions() {
        this.windowWidth = utils.assignNullableAttribute(
            this.optionsElement,
            windowWidthParamName,
            constants.defaultVisibleWindowWidth
        ) as number;
        this.windowWidth /= 100;

        this.radius = utils.assignNullableAttribute(
            this.optionsElement,
            radiusParamName,
            constants.defaultSliderRadius
        ) as number;
        this.radius /= 100;
    }

    updatePosition(position: [number, number], movement: [number, number]) {
        if (this.gradientType == GradientType.Linear)
            this.updateLinearPosition(position, movement);
        else
            this.updateRadialPosition(position, movement);
    }

    updateRadialPosition(position: [number, number], movement: [number, number]) {
        //this.gradientCenter = [position[0], position[1]];
        this.gradientCenter[0] = movement[0] + this.startPosition[0];
        this.gradientCenter[1] = movement[1] + this.startPosition[1];
        if (this.gradientCenter[0] > 1)
            this.gradientCenter[0] = this.gradientCenter[0] - 1;
        if (this.gradientCenter[0] < 0)
            this.gradientCenter[0] = 1 + this.gradientCenter[0];

        if (this.gradientCenter[1] > 1)
            this.gradientCenter[1] = this.gradientCenter[1] - 1;
        if (this.gradientCenter[1] < 0)
            this.gradientCenter[1] = 1 + this.gradientCenter[1];
    }

    updateLinearPosition(position: [number, number], movement: [number, number]) {
        this.gradientCenter[0] = movement[0] + this.startPosition[0];
        if (this.gradientCenter[0] > 1)
            this.gradientCenter[0] = this.gradientCenter[0] - 1;
        if (this.gradientCenter[0] < 0)
            this.gradientCenter[0] = 1 + this.gradientCenter[0];
    }

    get visibleWindowWidth() {
        return this.windowWidth;
    }

    protected positionIncrement: number;
    protected windowWidth: number;
    protected startPosition: [number, number];
    protected gradientCenter: [number, number];
    protected radius: number;
    protected gradientTransitionWidth: number;
    protected animationState: AnimationState;
    protected sliderType: SliderType;
    protected gradientType: GradientType;
}
