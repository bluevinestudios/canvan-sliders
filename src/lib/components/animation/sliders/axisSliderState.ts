import { Coordinate } from '../../../common';

export enum AnimationState {
    Inactive,
    Active,
    Dragging
}

export class AxisSliderState {
    constructor() {
        this.resetState();
    }

    init() {
        this.resetState();
    }

    resetState() {
        this.relativePosition$ = [0, 0];
        this.absolutePosition$ = [0, 0];
        this.animationState$ = AnimationState.Active;
    }

    get animationState(): AnimationState {
        return this.animationState$;
    }

    set animationState(animationState: AnimationState) {
        this.animationState$ = animationState;
    }

    get relativePosition(): Coordinate {
        return this.relativePosition$;
    }
    set relativePosition(position: Coordinate) {
        this.relativePosition$ = position;
    }

    get absolutePosition(): Coordinate {
        return this.absolutePosition$;
    }
    set absolutePosition(absolutePosition: Coordinate) {
        this.absolutePosition$ = absolutePosition;
    }

    private relativePosition$: Coordinate;
    private absolutePosition$: Coordinate;
    private animationState$: AnimationState;
}
