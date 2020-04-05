import { Options } from './options';
import * as utils from '../utils';
import * as constants from '../constants';

/** Top-level options for a single canvas slider component. */
export class ComponentOptions extends Options {

    /**
     * Constructor
     * @param dragable 'true' if component allows dragging.
     */
    constructor(public dragable: boolean = true) {
        super();

        this.dragable = dragable;
    }

    parse(element: Element) {
        let dragable: boolean = utils.assignNullableAttribute(element,
            constants.dragableParamName, this.dragable) as boolean;
        this.dragable = dragable;
    }
}
