import { Options } from './options';
import * as utils from '../utils';
import * as constants from '../constants';

/** Top-level options for a single canvas slider component. */
export class GlobalOptions extends Options {

    /**
     * Constructor
     * @param dragable 'true' if component allows dragging.
     */
    constructor(public dragable: boolean = true) {
        super();

        this.dragable = dragable;
    }

    /**
     * Parse element options into local member variables.  Defaults to constants.defaultDragable
     * for invalid input or undefined input.
     * @param element
     */
    parse(element: Element) {
        let dragable: boolean = utils.assignNullableAttribute(element,
            constants.dragableParamName, this.dragable) as boolean;
        this.dragable = dragable;
    }
}
