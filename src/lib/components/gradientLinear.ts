import * as constants from '../constants';
import { Gradient, GradientRange, MakeGradientRange } from './gradient';
import { Range } from './range';

type Params = {
    width: number;
    height: number;
    centerPosition: number;
    visibleWindowWidth: number;
    gradientTransitionWidth: number;
};

/**
 *  Class defining a 'linear' gradient 'window' that currently goes only from left to right.
 * Specifically, a horizontal section of the canvas is visible with blending transitions on the
 * left and right side of the window.
 *
 * Note, when the gradient position extends beyond the right or left side it loops around
 * to the other side to create a seamless animation.
 */
export class GradientLinear extends Gradient {
    /**
     * Constructor.
     * @param context Canvas 2D rendering context.
     * @param width Width of the gradient.
     * @param height Height of the gradient (currently not being used).
     * @param centerPosition Center position percent 0-1 of the visible window.
     * @param visibleWindowWidth Width in percent 0-1 of the window.
     * @param gradientTransitionWidth Width of the transparancy transition in percent 0-1.
     */
    constructor(context: CanvasRenderingContext2D, params: Params) {
        super(context, params.gradientTransitionWidth);
        Object.assign(this, params);
        this.canvasGradient = this.context.createLinearGradient(0, 0, params.width, 0);

        this.windowWidthHalf = params.visibleWindowWidth / 2.0;
    }

    /** Add our DOM Gradient transparency 'stops'. */
    addGradientStops() {
        let windowLeft = this.centerPosition - this.windowWidthHalf;
        let windowRight = this.centerPosition + this.windowWidthHalf;

        let leftGradientBounds = new Range(
            windowLeft - this.gradientTransitionWidth,
            windowLeft + this.gradientTransitionWidth
        );
        let rightGradientBounds = new Range(
            windowRight - this.gradientTransitionWidth,
            windowRight + this.gradientTransitionWidth
        );
        let leftOpacityRange = new Range(1.0, 0.0);
        let rightOpacityRange = new Range(0.0, 1.0);

        let ranges1 = this.calculateGradientStops(leftGradientBounds, leftOpacityRange);
        let ranges2 = this.calculateGradientStops(rightGradientBounds, rightOpacityRange);
        let ranges = ranges1.concat(ranges2);

        for (let i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            if (range.positionRange.width > constants.minimumGradientWidth) {
                this.canvasGradient.addColorStop(
                    range.positionRange.min,
                    `rgba(255, 255, 255, ${range.opacityRange.min})`
                );
                this.canvasGradient.addColorStop(
                    range.positionRange.max,
                    `rgba(255, 255, 255, ${range.opacityRange.max})`
                );
            }
        }
    }

    /**
     * Splits this gradient range across any left/right boundaries
     * @param positionRange
     * @param opacityRange
     * @returns Array of ranges where transparancy/opacity stops/starts.
     */
    private calculateGradientStops(positionRange: Range, opacityRange: Range): GradientRange[] {
        let ranges: GradientRange[] = [];

        // If our boundaries overlap the edges we interpolate where the left/right
        // opacity would be start or stop.
        let startOpacity = opacityRange.min;
        let stopOpacity = opacityRange.max;
        let positionX1 = positionRange.min;
        let positionX2 = positionRange.max;

        // If our visible window is fully off-screen to the left then we move it to the right as though it slid
        // from right to left.
        if (positionRange.min < 0 && positionRange.max < 0) {
            ranges.push(MakeGradientRange(new Range(1 + positionRange.min, 1 + positionRange.max), opacityRange));
        }
        // Likewise, if our visible window is fully off-screen to the right then we slide it to the left.
        if (positionRange.min > 1 && positionRange.max > 1) {
            ranges.push(MakeGradientRange(new Range(positionRange.min - 1, positionRange.max - 1), opacityRange));
        }

        if (positionX1 < 0) {
            // Truncate our left-side opacity and wrap it around to a new range at the end.
            let truncatedLeftOpacity = positionRange.mapValueToRange(0, opacityRange);
            ranges.push(MakeGradientRange(new Range(0, positionX2), new Range(truncatedLeftOpacity, stopOpacity)));
            // This is a range on the right side ending at 100% -- the effect is a full wraparound of the gradient
            // window.
            ranges.push(MakeGradientRange(new Range(1 + positionX1, 1), new Range(startOpacity, truncatedLeftOpacity)));
        } else if (positionX2 > 1) {
            let truncatedRightOpacity = positionRange.mapValueToRange(1, opacityRange);
            ranges.push(MakeGradientRange(new Range(positionX1, 1), new Range(startOpacity, truncatedRightOpacity)));
            ranges.push(MakeGradientRange(new Range(0, 1 - positionX2), new Range(truncatedRightOpacity, stopOpacity)));
        } else {
            ranges.push(MakeGradientRange(positionRange, opacityRange));
        }
        return ranges;
    }

    private centerPosition: number;
    private windowWidthHalf: number;
}
