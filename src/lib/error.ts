/**
 * ErrorType defines the potential types of errors.
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
        super(createErrorMessage(errorType, message));
    }
}

/**
 * Simple error handler that currently logs to the console.
 * @param errorType
 * @param message
 */
export function handleError(errorType: ErrorType, message: string) {
    let errorMessage = createErrorMessage(errorType, message);
    if (errorType == ErrorType.Error) console.error(errorMessage);
    else console.warn(errorMessage);
}

function createErrorMessage(errorType: ErrorType, message: string) {
    return errorType == ErrorType.Error ? `Canvan Error!: ${message}` : `Canvan Warning: ${message}`;
}
