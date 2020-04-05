import { Range } from './range';

/**
 *  Helper data structure to keep track of where we should place our gradient stops.
 */
export interface GradientRange {
    /** Left and right positions of where our gradient starts and stops. */
    positionRange: Range;
    /** Left and right opacity values. */
    opacityRange: Range;
}

/**
 * Construct a GradientRange object.
 * @param positionRange
 * @param opacityRange
 */
export function MakeGradientRange(positionRange: Range, opacityRange: Range): GradientRange {
    return { positionRange: positionRange, opacityRange: opacityRange };
}

/** Parent class to manage our Canvas 2D gradients.  Note, this is not a class
 * defining all operations on a Canvas gradient but instead the specific use-case
 * of creating transitions between transparent and opaque.*/
export abstract class Gradient {
    /**
     * Constructor.
     * @param context Our 2D rendering context.
     * @param gradientTransitionWidth Width between 0-1 specifying how large the transition
     * should be between fully transparent to fully opaque segments.
     */
    constructor(context: CanvasRenderingContext2D, gradientTransitionWidth: number) {
        this.context = context;
        this.gradientTransitionWidth = gradientTransitionWidth;
    }

    /** Adds gradient stops to our canvas gradient. */
    abstract addGradientStops();

    get gradientElement(): CanvasGradient {
        return this.canvasGradient;
    }

    protected context: CanvasRenderingContext2D;
    protected canvasGradient: CanvasGradient;
    protected gradientTransitionWidth: number;
}
