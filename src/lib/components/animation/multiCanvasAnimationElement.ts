import * as utils from '../../utils';
import { Animatable } from "./animatable";
import { Dragable } from './dragable';
import { CanvasAnimationElement } from "./canvasAnimationElement";
import { EventDispatcher } from "../eventDispatcher";
import { EventType, EventParams } from "../eventTypes";

export abstract class MultiCanvasAnimationElement implements Animatable {
    constructor() {
        this.canvasLayers = [];
    }

    async init(): Promise<void> {
        this.parseAndBuildChildren();
        const loadAll = this.canvasLayers.map(
            async (layer: CanvasAnimationElement, index: number) => {
                return layer.init();
            }
        );
        return new Promise<void>(async () => {
            return Promise.all(loadAll);
        });
    }

    draw() {
        for (let canvas of this.canvasLayers) canvas.draw();
    }

    abstract parseOptions();
    abstract step(timestamp: number);
    abstract get active(): boolean;
    abstract parseAndBuildChildren();

    protected canvasLayers: CanvasAnimationElement[];
}

export abstract class MultiCanvasDragableAnimationElement {
    constructor() {
        this.canvasLayers = [];
    }
}

export interface MultiCanvasDragableAnimationElement
    extends MultiCanvasAnimationElement, Dragable { }

utils.applyMixins(MultiCanvasDragableAnimationElement,
    [MultiCanvasAnimationElement, Dragable]);