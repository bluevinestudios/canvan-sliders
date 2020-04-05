/**
 * ErrorType defines the potential custom errors.
 */
export enum ErrorType {
    Error,
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
