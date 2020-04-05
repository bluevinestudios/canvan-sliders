import * as error from '../error';
import * as utils from '../utils';
import * as constants from '../constants';

/**
 * Class to handle loading of a DOM image element.
 */
export class SliderImage {

    /**
    * Constructor
    * @param htmlImageElement DOM Image element to load.
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
        return new Promise<void>((resolve, reject) => {            
            if (this.image.complete) {
                if (this.image.width === 0 || this.image.height === 0)
                    return reject(`Failed to load image: ${this.image.src}`);
                return resolve();
            }
            this.image.onload = () => {
                resolve();
            };
            this.image.onerror = (event: Event | string) => {
                reject(`Failed to load image: ${event.toString()}`);
            };
            
        });
    }

    get imageElement() {
        return this.image;
    }

    private image: HTMLImageElement;
}
