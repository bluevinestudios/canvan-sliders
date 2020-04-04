/**
 * Possible error types.
 * @readonly
 */
export enum ErrorType {
    /** A serious error that might require program terimination or a bug in 
     * the code. */
    Error,
    /** Less serious warning that might indicate invalid user input. */
    Warning
}
/**
 * Basic application-specific error type.
 */
export class SliderError extends Error {
    constructor(public errorType: ErrorType, public message: string) {
        super(getErrorString(errorType, message));
    }
}

/**
 * Simple error handler that currently logs to the console.
 * @param errorType
 * @param message
 */
export function handleError(errorType: ErrorType, message: string) {
    console.log(getErrorString(errorType, message));
}

function getErrorString(errorType: ErrorType, message: string) {
    return errorType == ErrorType.Error
        ? `ERROR!: ${message}`
        : `Warning: ${message}`;
}
