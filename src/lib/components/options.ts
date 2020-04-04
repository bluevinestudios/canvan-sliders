
/** Different components have different options, class Options serves
 * as a top-level interface for parsing. */
export abstract class Options {
    /**
     * Parse element attributes into member variables.
     * @param element
     */
	abstract parse(element: Element);
}