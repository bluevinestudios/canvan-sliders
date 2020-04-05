import * as error from "./error";
import * as common from "./common";

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
export function getNumberAttribute(
    element: Element,
    attributeName: string
): number | null {
    if (element == null)
        throw new error.SliderError(
            error.ErrorType.Error,
            "Empty element in getNumberAttribute."
        );

    const attribute = element.getAttribute(attributeName);
    if (attribute == null) return null;

    const result = Number.parseFloat(attribute);
    if (isNaN(result)) {
        error.handleError(
            error.ErrorType.Warning,
            "Invalid attribute value: " + result
        );
        return null;
    }
    return result;
}

/**
 * Same as [[getNumberAttribute]] except returns a string.
 * @param element
 * @param attributeName
 */
export function getStringAttribute(
    element: Element,
    attributeName: string
): string | null {
    if (element == null)
        throw new error.SliderError(
            error.ErrorType.Error,
            "Empty element in getStringAttribute."
        );

    const attribute = element.getAttribute(attributeName);
    if (attribute == null) return null;
    // However if the attribute is defined but empty then it's an error.
    if (attribute == undefined || attribute.length == 0) {
        error.handleError(
            error.ErrorType.Warning,
            "Undefined or empty attribute: " + attributeName
        );
        return null;
    }

    return attribute;
}

/**
 * Parses and returns an attribute value that is either a string or a number.
 * @param element Element to retrieve the attribute value from.
 * @param attributeName Name of attribute to grab.
 * @param defaultValue If the attributeValue is null then assign to defaultValue.
 * Note, the default can be undefined in certain circumstances (see the
 * `start-position` attribute).
 */
export function assignNullableAttribute(
    element: Element,
    attributeName: string,
    defaultValue: string | number | boolean
): string | number | boolean {
    if (element == null)
        throw new error.SliderError(
            error.ErrorType.Error,
            "Empty element in assignNullableAttribute."
        );

    if (typeof defaultValue === "string") {
        const returnVal = getStringAttribute(element, attributeName);
        return returnVal == null ? defaultValue : returnVal;
    } else if (typeof defaultValue === "number") {
        const returnVal = getNumberAttribute(element, attributeName);
        return returnVal == null ? defaultValue : returnVal;
    } else if (typeof defaultValue === "boolean") {
        const returnVal = getStringAttribute(element, attributeName);
        return returnVal == null ? defaultValue : returnVal === "true";
    } else {
        // If this happens something has gone horribly wrong.
        throw new error.SliderError(
            error.ErrorType.Error,
            "Unexpected attribute type in assignNullableAttribute."
        );
    }
}

export interface AssignAttributesResult {
    value: string | number | boolean;
}

export function* assignNullableAttributes(
    element: Element,
    params: common.OptionType[]
): Iterator<string | number | boolean> {
    //let results: AssignAttributesResult[] = [];
    for (let param of params) {
        let val = assignNullableAttribute(
            element,
            param.paramName,
            param.defaultValue
        );
        yield val;
        //results.push({ paramName: param.paramName, value: val });
    }
    //return results;
}

/**
 * Create an HTMLCanvasElement and append it to the provided container.
 * @param container Container Element to add the canvas to.
 * @param className Assign this class name to the canvas.
 */
export function createAndInsertCanvasElement(
    container: Element,
    className: string
): HTMLCanvasElement {

    let canvasElement = document.createElement("canvas");
    canvasElement.width = container.clientWidth;
    canvasElement.height = container.clientHeight;
    container.appendChild(canvasElement);
    canvasElement.className = className;

    return canvasElement;
}

/**
 * Helper function to mix two objects so we can utilize multiple inheritance.
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
