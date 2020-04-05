import * as error from './error';
import * as common from './common';

/** Alias for a DOM event handler. */
export type DOMEventHandler = (evt: Event) => void;

/**
 * Helper function that prepends a selector with a global prefix followed
 * by a dash between the two.
 * @param prefix
 * @param selector
 */
export function addSelectorPrefix(prefix: string, selector: string) {
    return `${prefix}-${selector}`;
}

/**
 * Add a class to an element.
 * @param element DOM Element
 * @param elementClass Class name to add.
 */
export function addClass(element: Element, elementClass: string): void {
    if (!element.classList.contains(elementClass)) {
        element.classList.add(elementClass);
    }
}

/**
 * Remove a class from an element.
 * @param element DOM Element
 * @param elementClass Class name to remove.
 */
export function removeClass(element: Element, elementClass: string): void {
    if (element.classList.contains(elementClass)) {
        element.classList.remove(elementClass);
    }
}

/**
 * Returns a number parsed from an element attribute.  Logs a warning and
 * returns null if the value can't be parsed as a number.  Returns null (with
 * no logging) if attribute doesn't exist.
 * @param element
 * @param attributeName
 */
export function getNumberAttribute(element: Element, attributeName: string): number | undefined {
    if (element === null) throw new error.SliderError(error.ErrorType.Error, 'Empty element in getNumberAttribute.');

    const attribute = element.getAttribute(attributeName);
    if (attribute === null) return undefined;

    const result = Number.parseFloat(attribute);
    if (isNaN(result)) {
        error.handleError(error.ErrorType.Warning, 'Invalid attribute value: ' + result);
        return undefined;
    }
    return result;
}

/**
 * Returns a string parsed from an element attribute. Logs a warning if the attribute is defined but empty.
 * @param element
 * @param attributeName
 * @returns Attribute string or undefined if attribute isn't defined.
 */
export function getStringAttribute(element: Element, attributeName: string): string | undefined {
    if (element === null) throw new error.SliderError(error.ErrorType.Error, 'Empty element in getStringAttribute.');

    const attribute = element.getAttribute(attributeName);
    if (attribute === null) return undefined;
    // However if the attribute is defined but empty then it's an error.
    if (attribute === undefined || attribute.length === 0) {
        error.handleError(error.ErrorType.Warning, 'Undefined or empty attribute: ' + attributeName);
        return undefined;
    }

    return attribute;
}

/**
 * Parses and returns an attribute value that is a string, number, or boolean.
 * @param element Element to retrieve the attribute value from.
 * @param attributeName Name of attribute to grab.
 * @param defaultValue If the attributeValue is null then assign to defaultValue.
 */
export function assignNullableAttribute(
    element: Element,
    attributeName: string,
    defaultValue: string | number | boolean
): string | number | boolean {
    if (element === null)
        throw new error.SliderError(error.ErrorType.Error, 'Empty element in assignNullableAttribute.');

    if (typeof defaultValue === 'string') {
        const returnVal = getStringAttribute(element, attributeName);
        return returnVal === undefined ? defaultValue : returnVal;
    } else if (typeof defaultValue === 'number') {
        const returnVal = getNumberAttribute(element, attributeName);
        return returnVal === undefined ? defaultValue : returnVal;
    } else if (typeof defaultValue === 'boolean') {
        const returnVal = getStringAttribute(element, attributeName);
        let result = false;
        if (returnVal != null && returnVal !== undefined) {
            
            let val = returnVal.toLowerCase();
            if (val !== 'true' && val !== 'false')
                error.handleError(error.ErrorType.Warning, `Invalid attribute value ${val} for boolean ${attributeName}`);
            else
                result = val === 'true';
        }
        return returnVal === undefined ? defaultValue : result;
    } else {
        throw new error.SliderError(error.ErrorType.Error, 'Unexpected attribute type in assignNullableAttribute.');
    }
}

/**
 * Generator that takes an array of parameters defining attributes to parse and yields
 * the parsed values.
 * @param element
 * @param params
 * @description Example params:
 * ```typescript
 * const parentOptions: common.OptionsArray = [
    {
        paramName: 'transition-size',
        defaultValue: 1
    },
    {
        paramName: 'dragable',
        defaultValue: true
    }
    ]
 * ```
 */
export function* assignNullableAttributes(
    element: Element,
    params: common.OptionType[]
): Iterator<string | number | boolean> {
    for (let param of params) {
        let val = assignNullableAttribute(element, param.paramName, param.defaultValue);
        yield val;
    }
}

/**
 * Create an HTMLCanvasElement and append it to the provided container.
 * @param container Container Element to add the canvas to.
 * @param className Assign this class name to the canvas.
 */
export function createAndInsertCanvasElement(container: Element, className: string): HTMLCanvasElement {
    let canvasElement = document.createElement('canvas');
    canvasElement.width = container.clientWidth;
    canvasElement.height = container.clientHeight;
    container.appendChild(canvasElement);
    canvasElement.className = className;

    return canvasElement;
}

/**
 * Helper function to mix two objects so we can utilize a form of multiple inheritance.
 * @param derivedCtor Derived interface.
 * @param baseCtors Base interfaces to mixin with derivedCtor.
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
            );
        });
    });
}
