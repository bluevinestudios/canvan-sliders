import { Gradient, GradientRange, MakeGradientRange } from './gradient';
import { Range } from './range';
import { Coordinate } from '../common';

/**
 * Transparancy radial gradient, a circle at a particular position and radius.
 */
export class GradientRadial extends Gradient {
    constructor(
        context: CanvasRenderingContext2D,
        width: number,
        height: number,
        centerPosition: Coordinate,
        innerRadius: number,
        outerRadius: number,
        gradientTransitionWidth: number
    ) {
        super(context, gradientTransitionWidth);
        let x = width * (centerPosition[0] / 100);
        let y = height * (centerPosition[1] / 100);
        this.canvasGradient = this.context.createRadialGradient(
            x,
            y,
            innerRadius,
            x,
            y,
            outerRadius
        );

        this.centerPosition = centerPosition;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
    }

    addGradientStops() {
        let ranges: GradientRange[] = [];
        ranges.push(MakeGradientRange(new Range(0, 75), new Range(0.0, 0.0)));
        ranges.push(MakeGradientRange(new Range(75, 100), new Range(0.0, 1.0)));

        for (let i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            this.canvasGradient.addColorStop(range.positionRange.min / 100, `rgba(255, 255, 255, ${range.opacityRange.min})`);
            this.canvasGradient.addColorStop(range.positionRange.max / 100, `rgba(255, 255, 255, ${range.opacityRange.max})`);
        }
    }

    private centerPosition: [number, number];
    private innerRadius: number;
    private outerRadius: number;
}
