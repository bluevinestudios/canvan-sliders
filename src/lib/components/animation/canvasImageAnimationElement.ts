import { SliderImage } from '../sliderImage';
import { EventDispatcher } from '../eventDispatcher';
import { CanvasAnimationElement } from './canvasAnimationElement';
import { EventType, ResizeParams } from '../eventTypes';

/**
 * Aside from serving as a parent class to dynamic animations, this 
 * class serves as a static
 * image drawn on the canvas.
 */
export class CanvasImageAnimationElement extends CanvasAnimationElement {
    constructor(optionsElement: Element, sliderImage: SliderImage, 
        canvasElement: HTMLCanvasElement, eventDispatcher: EventDispatcher) {
        super(optionsElement, canvasElement, eventDispatcher);

        this.sliderImage = sliderImage;
    }

    async init(): Promise<void> {
        return this.sliderImage.loadImage();
    }

    step(timestamp: number) {}

    draw() {
        let newWidth = this.canvasElement.clientWidth;
        let newHeight = this.canvasElement.clientHeight;
        this.context.drawImage(this.sliderImage.imageElement, 0, 0, newWidth, newHeight);
    }

    resize() {
        this.canvasElement.width = window.devicePixelRatio * this.canvasElement.clientWidth;
        this.canvasElement.height = window.devicePixelRatio * this.canvasElement.clientHeight;
        this.context = this.canvasElement.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    parseOptions() {}
    updatePosition(position: [number, number], movement: [number, number]) {}
    
    protected sliderImage: SliderImage
}