import { EventType, MouseEventParams } from '../eventTypes';
import { EventDispatcher } from '../eventDispatcher';

/** Abstract class for a dragable item. */
export abstract class Dragable {
    addMouseListeners(eventDispatcher: EventDispatcher): void {
        eventDispatcher.subscribe(EventType.DragStart, this.onDragStart.bind(this));
        eventDispatcher.subscribe(EventType.DragEnd, this.onDragEnd.bind(this));
        eventDispatcher.subscribe(EventType.MouseLeave, this.onMouseLeave.bind(this));
        eventDispatcher.subscribe(EventType.MouseMove, this.onMouseMove.bind(this));
    }

    abstract onDragStart(params: MouseEventParams);
    abstract onDragEnd(params: MouseEventParams);
    abstract onMouseLeave(params: MouseEventParams);
    abstract onMouseMove(params: MouseEventParams);

    protected eventDispatcher: EventDispatcher;
}
