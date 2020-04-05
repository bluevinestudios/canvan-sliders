import { SliderError, ErrorType } from '../error';

/**
 * A simple real-valued min/max range that can interpolate a
 * value from one range to another.
 */
export class Range {
    /**
     * Constructor.
     * @param min Minimum value in range.
     * @param max Maximum value in range.
     */
    constructor(min: number, max: number) {
        this.min$ = min;
        this.max$ = max;
        this.width$ = max - min;
    }

    get min(): number {
        return this.min$;
    }

    get max(): number {
        return this.max$;
    }

    get width(): number {
        return this.max$ - this.min$;
    }

    /**
     * Maps a number from this range into a destination range, interpolating linearly.
     * @param sourceValue
     * @param destinationRange
     * @description Throws an error if size of range is zero.
     */
    mapValueToRange(sourceValue: number, destinationRange: Range): number {
        if (this.width$ == 0) throw new SliderError(ErrorType.Error, `Invalid size of range ${this.min} - ${this.max}`);

        let normalizedValue = (sourceValue - this.min$) / this.width$;
        return destinationRange.min$ + normalizedValue * destinationRange.width$;
    }

    private min$: number;
    private max$: number;
    private width$: number;
}
