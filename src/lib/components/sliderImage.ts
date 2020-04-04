import * as error from '../error';
import * as utils from '../utils';
import * as constants from '../constants';

/**
 * Class to handle loading of a DOM image element and image slider options.
 */
export class SliderImage {

    /**
    * Constructor
    * @param htmlImageElement DOM Image element as parsed (src already set).    
    */
    constructor(htmlImageElement: HTMLImageElement) {
        this.image = htmlImageElement;
    }
    
    /**
    *  Asynchronously make sure the image has been loaded by the browser.
    *  @throws SliderError warning if the image can't be loaded.
    *  @returns Promise that resolves when the image has been loaded.
    */
    async loadImage(): Promise<void> {
        return new Promise<void>(resolve => {
            if (this.image.complete) {
                return resolve();
            }
            this.image.onload = () => {
                resolve();
            };
        });
    }

    get imageElement() {
        return this.image;
    }

    private image: HTMLImageElement;
}
