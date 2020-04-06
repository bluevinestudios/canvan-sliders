import * as error from '../../../error';
import * as utils from '../../../utils';
import * as constants from '../../../constants';
import * as common from '../../../common';
import { AnimationState, AxisSliderState } from './axisSliderState';
import { SliderImage } from '../../sliderImage';
import { CanvasImageAnimationElement } from '../canvasImageAnimationElement';
import { GradientRadial } from '../../gradientRadial';
import { EventDispatcher } from '../../eventDispatcher';
import { GradientLinear } from '../../gradientLinear';
import { GradientType, SliderType } from './axisSliderTypes';
import { Coordinate } from '../../../common';

/** Option names as they appear in the HTML tags. */
const options: common.OptionsArray = [
    {
        paramName: 'start-position-x',
        defaultValue: -1
    },
    {
        paramName: 'start-position-y',
        defaultValue: -1
    },
    {
        paramName: 'size',
        defaultValue: 20
    }
];

/**
 * Single animated canvas that slides a vertical image slice across the canvas left to right, looping around at the
 * right side to the left.
 */
export class SingleCanvasAxisSlider extends CanvasImageAnimationElement {
    constructor(
        sliderType: SliderType,
        gradientType: GradientType,
        optionsElement: Element,
        sliderImage: SliderImage,
        canvasElement: HTMLCanvasElement,
        eventDispatcher: EventDispatcher,
        positionIncrement: number,
        gradientTransitionWidth: number
    ) {
        super(optionsElement, sliderImage, canvasElement, eventDispatcher);

        this.gradientType = gradientType;
        this.sliderType = sliderType;
        this.animationState = AnimationState.Inactive;        
        this.positionIncrement = positionIncrement;
        this.gradientTransitionWidth = gradientTransitionWidth;

        this.startPosition$ = [0, 0];
        this.gradientCenter$ = [0, 0];
        this.size$ = 0;
    }

    step(timestamp: number) {
        if (this.gradientType == GradientType.Linear) this.linearStep(timestamp);
        else this.radialStep(timestamp);
    }

    linearStep(timestamp: number) {
        this.gradientCenter$[0] += this.positionIncrement;
        if (this.gradientCenter$[0] > 100) this.gradientCenter$[0] = 0;
        if (this.gradientCenter$[0] < 0) this.gradientCenter$[0] = 100;
    }

    radialStep(timestamp: number) {
        this.gradientCenter$[0] += this.positionIncrement;

        let rightBound = 100 + this.size$;
        let leftBound = -this.size$;
        if (this.gradientCenter$[0] > rightBound) {
            this.gradientCenter$[0] = leftBound;
        }
        if (this.gradientCenter$[0] < leftBound) {
            this.gradientCenter$[0] = rightBound;
        }
    }

    draw() {
        super.draw();
        this.addGradient();
    }
    addGradient() {
        if (this.gradientType == GradientType.Linear) this.addLinearGradient();
        else this.addRadialGradient();
    }

    addLinearGradient() {
        if (this.size$ > 0) {
            this.context.globalCompositeOperation = 'destination-out';

            let width = this.canvasElement.clientWidth;
            let height = this.canvasElement.clientHeight;
            let gradient = new GradientLinear(this.context, {
                width,
                height,
                centerPosition: this.gradientCenter$[0],
                visibleWindowWidth: this.size$,
                gradientTransitionWidth: this.gradientTransitionWidth
            });

            gradient.addGradientStops();

            this.context.fillStyle = gradient.gradientElement;
            this.context.fillRect(0, 0, this.canvasElement.clientWidth, this.canvasElement.clientHeight);
            this.context.globalCompositeOperation = 'source-over';
        }
    }

    addRadialGradient() {
        if (this.size$ > 0) {
            this.context.globalCompositeOperation = 'destination-out';

            let width = this.canvasElement.clientWidth;
            let height = this.canvasElement.clientHeight;
            let gradient = new GradientRadial(
                this.context,
                width,
                height,
                this.gradientCenter$,
                0,
                (this.size$ / 100) * width,
                this.gradientTransitionWidth
            );
            gradient.addGradientStops();

            this.context.fillStyle = gradient.gradientElement;
            this.context.fillRect(0, 0, this.canvasElement.clientWidth, this.canvasElement.clientHeight);
            this.context.globalCompositeOperation = 'source-over';
        }
    }

    /**
     * Parses the HTML attribute parameters of the lower-level sliding image.
     * Errors are logged with the error handler routines from error.ts
     * (see [[HandleError]] function).
     * @param element
     */
    parseOptions() {

        let results = utils.assignNullableAttributes(this.optionsElement, options);
        this.gradientCenter$[0] = results.next().value;
        this.gradientCenter$[1] = results.next().value;
        this.size$ = results.next().value;
        this.startPosition$[0] = this.gradientCenter$[0];
        this.startPosition$[1] = this.gradientCenter$[1];
    }

    updatePosition(position: Coordinate, movement: Coordinate) {
        if (this.gradientType == GradientType.Linear)
            this.updateLinearPosition(position, movement);
        else
            this.updateRadialPosition(position, movement);
    }

    updateRadialPosition(position: Coordinate, movement: Coordinate) {
        this.gradientCenter$[0] = movement[0] + this.startPosition$[0];
        this.gradientCenter$[1] = movement[1] + this.startPosition$[1];
        if (this.gradientCenter$[0] > 100) this.gradientCenter$[0] = this.gradientCenter$[0] - 100;
        if (this.gradientCenter$[0] < 0) this.gradientCenter$[0] = 100 + this.gradientCenter$[0];

        if (this.gradientCenter$[1] > 100) this.gradientCenter$[1] = this.gradientCenter$[1] - 100;
        if (this.gradientCenter$[1] < 0) this.gradientCenter$[1] = 100 + this.gradientCenter$[1];
    }

    updateLinearPosition(position: Coordinate, movement: Coordinate) {
        this.gradientCenter$[0] = movement[0] + this.startPosition$[0];
        if (this.gradientCenter$[0] > 100) this.gradientCenter$[0] = this.gradientCenter$[0] - 100;
        if (this.gradientCenter$[0] < 0) this.gradientCenter$[0] = 100 + this.gradientCenter$[0];
    }

    get size() {
        return this.size$;
    }

    get gradientCenter() {
        return [this.gradientCenter$[0], this.gradientCenter$[1]];
    }

    set gradientCenter(gradientCenter: Coordinate) {
        this.gradientCenter$[0] = gradientCenter[0];
        this.gradientCenter$[1] = gradientCenter[1];
        this.startPosition$[0] = gradientCenter[0]
        this.startPosition$[1] = gradientCenter[1];
    }


    protected size$: number;
    protected startPosition$: Coordinate;
    protected gradientCenter$: Coordinate;

    protected positionIncrement: number;
    protected gradientTransitionWidth: number;
    
    protected animationState: AnimationState;
    protected sliderType: SliderType;
    protected gradientType: GradientType;
}
