import { CanvanSliders as ps } from "index";

let sliderCreator: ps.SliderCreator;

const attributeSelectorPrefix = 'canvan'

function waitForDomContentLoaded() {
    return new Promise<HTMLDocument>((resolve) => {
        window.addEventListener('DOMContentLoaded', (event: Event) => {
            console.log('DOM fully loaded and parsed');
            let target: EventTarget = event.target as EventTarget;
            let document: HTMLDocument = target as HTMLDocument;
            resolve(document);
        });
    });
}

waitForDomContentLoaded().then((document: HTMLDocument) => {
    sliderCreator = new ps.SliderCreator(document, attributeSelectorPrefix);
    let returnPromise = sliderCreator.scanAndCreateSliders();
    returnPromise.then((result) => {
        sliderCreator.animateAll();
    }).catch((error: Error) => {
        console.log(error.message);
    });
}).catch((error: Error) => {
    console.log(error.message);
});