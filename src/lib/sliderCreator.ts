// sliderCreator.ts
/**
 * Module for scanning HTML for sliders and initializing and loading images.
 * @packageDocumentation
 */
import * as constants from "./constants";
import * as error from "./error";
import * as utils from "./utils";
import { ComponentBuilder } from "./components/componentBuilder";

/**
 *  SliderCreator parses the current document and creates and initializes all of the sliders on the page.
 */
export class SliderCreator {
    /**
     * Constructor
     * @param document Top-level document for the page.
     * @param selectorPrefix Allows the HTML classes searched to use a different selector 'namespace' in case there
     * are somehow class collisions.
     */
    constructor(public document: HTMLDocument, public selectorPrefix = "canvan") {
        this.sliders = null;
    }

    /** 
     * Asynchronously query the page for selectors and initialize.  Returns a promise that when
     * completed all of the sliders have been created, images loaded, and can be animated. 
     */
    async scanAndCreateSliders(): Promise<void[]> {
        let elements: HTMLCollectionOf<Element> = document.getElementsByClassName(
            utils.addSelectorPrefix(this.selectorPrefix, constants.animatorSelectorName)
        );

        // Load all of our slider elements into an array and parse and create them.  Note, images
        // are loaded at this point and we return a promise when everything is ready to animate.
        this.sliders = [];
        for (let index = 0; index < elements.length; index++) {
            let element = elements[index];
            let elementTag = element.tagName.toLowerCase();
            if (elementTag === "div") {
                this.sliders[index] = new ComponentBuilder(element, this.selectorPrefix, index);
            } else {
                error.handleError(
                    error.ErrorType.Warning,
                    `Invalid element type ${element.tagName} for slider, expected 'div', ignoring.`
                );
            }
        }

        const all: Promise<void>[] = this.sliders.map(
            async (slider: ComponentBuilder, index: number, sliders: ComponentBuilder[]) => {
                return slider.parseAndBuildElements();
            }
        );
        return Promise.all(all);
    }

    /** Start animating all of the sliders. */
    public animate() {
        if (!this.sliders) {
            error.handleError(error.ErrorType.Error, 'Sliders not initialized before requesting animation.');
            return;
        }
        for (let index = 0; index < this.sliders.length; index++) {
            this.sliders[index].animate();
        }
    }

    private sliders: ComponentBuilder[] | null;    
}
