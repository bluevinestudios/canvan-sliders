/**
 *  Simple coordinate type, used for mouse calculations.
 */
export type Coordinate = [number, number];

/**
 * Width/Height dimension type.
 */
export type Dimensions = [number, number];

/** Non-nullable option value type. */
export type OptionValueType = string | number | boolean;

/** Generic attribute option type found in HTML. */
export type OptionType = {
    paramName: string,
    defaultValue: OptionValueType
}

/** Array of option definitions. */
export type OptionsArray = OptionType[];

