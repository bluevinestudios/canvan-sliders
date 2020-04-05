import * as utils from "./utils";
import { CanvasBuilder } from "./components/canvasBuilder";
import * as constants from "./constants";
import * as error from "./error";

export namespace CanvanSliders {
    /**
     *  Top-level class that creates all of the sliders on a given document object.
     */
    export class SliderCreator {
        /**
         * Constructor
         * @param document Top-level document for the page.
         */
        constructor(
            public document: HTMLDocument,
            public selectorPrefix = "canvan"
        ) {
            this.sliders = null;
        }

        /** Asynchronously query the page for selectors and initialize.  Returns a promise that when
         * completed all of the sliders have been created, images loaded, and can be animated. */
        async scanAndCreateSliders(): Promise<void[]> {
            let elements: HTMLCollectionOf<
                Element
            > = document.getElementsByClassName(
                utils.addSelectorPrefix(
                    this.selectorPrefix,
                    constants.animatorSelectorName
                )
            );

            // Load all of our slider elements into an array and parse and create them.  Note, images
            // are loaded at this point and we return a promise when everythings ready to animate.
            this.sliders = [];
            for (let index = 0; index < elements.length; index++) {
                let element = elements[index];
                let elementTag = element.tagName.toLowerCase();
                if (elementTag == "div") {
                    this.sliders[index] = new CanvasBuilder(
                        element,
                        this.selectorPrefix,
                        index
                    );
                } else {
                    error.handleError(
                        error.ErrorType.Warning,
                        `Invalid element type ${
                            element.tagName
                        } for slider, expected 'div', ignoring.`
                    );
                }
            }

            const all: Promise<void>[] = this.sliders.map(
                async (
                    slider: CanvasBuilder,
                    index: number,
                    sliders: CanvasBuilder[]
                ) => {
                    slider.parseAndBuildElements();
                    //return index;
                } 
            );
            return Promise.all(all);
        }

        /** Animate all of the sliders. */
        public animateAll() {
            for (let index = 0; index < this.sliders.length; index++) {
                this.sliders[index].animate();
            }
        }

        private sliders: CanvasBuilder[] | null;
    } // end namespace
} // end module
