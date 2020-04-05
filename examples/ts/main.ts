import { SliderCreator } from 'index';

let sliderCreator: SliderCreator;
const attributeSelectorPrefix = 'canvan';

function waitForDomContentLoaded() {
    return new Promise<HTMLDocument>(resolve => {
        window.addEventListener('DOMContentLoaded', (event: Event) => {
            let target: EventTarget = event.target as EventTarget;
            let document: HTMLDocument = target as HTMLDocument;
            resolve(document);
        });
    });
}

/**
 *  Wait for the DOM content to be loaded before we initialize our sliders.  We rely
 *  on exceptions to handle lower-level errors. 
 */
waitForDomContentLoaded()
    .then((document: HTMLDocument) => {
        sliderCreator = new SliderCreator(document, attributeSelectorPrefix);
        sliderCreator.scanAndCreateSliders()
            .then(() => {
                sliderCreator.animate();
            })
            .catch((error: Error) => {
                console.error(error);
            });
    })
    .catch((error: Error) => {
        console.error(error);
    });
