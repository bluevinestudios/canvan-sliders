import * as utils from '../../utils';
import { Animatable } from './animatable';
import { Dragable } from './dragable';
import { CanvasAnimationElement } from './canvasAnimationElement';

export abstract class MultiCanvasAnimationElement implements Animatable {
    constructor(public selectorPrefix: string) {
        this.canvasLayers = [];
        this.selectorPrefix = selectorPrefix;
    }

    async init(): Promise<void> {
        this.parseAndBuildChildren();
        const loadAll: Promise<void>[] = this.canvasLayers.map(async (layer: CanvasAnimationElement, index: number) => {
            return layer.init();
        });
        return new Promise<void>(async (resolve, reject) => {
            Promise.all(loadAll)
                .then(() => {
                    resolve();
                })
                .catch((error: Error) => {
                    reject(error);
                });
        });
    }

    draw() {
        for (let canvas of this.canvasLayers) canvas.draw();
    }

    abstract parseOptions();
    abstract step(timestamp: number);
    abstract get active(): boolean;
    abstract set active(active: boolean);
    abstract parseAndBuildChildren(): void;

    protected canvasLayers: CanvasAnimationElement[];
}

export abstract class MultiCanvasDragableAnimationElement {
    constructor(selectorPrefix: string) {
        this.canvasLayers = [];
        this.selectorPrefix = selectorPrefix;
    }
}

export interface MultiCanvasDragableAnimationElement extends MultiCanvasAnimationElement, Dragable {}

utils.applyMixins(MultiCanvasDragableAnimationElement, [MultiCanvasAnimationElement, Dragable]);
