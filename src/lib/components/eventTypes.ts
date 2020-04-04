
/** Currently supported events. */
export enum EventType {
    Init,
    DragStart,
    DragEnd,
    MouseMove,
    MouseLeave,
    Resize,
    RequestRepaint,
    Pause,
    Play
}

export interface EventParams { }

export interface MouseEventParams extends EventParams {
    x: number;
    y: number;
    movementX: number;
    movementY: number;
    mouseDown: boolean;
}

export interface ResizeParams extends EventParams {
    width: number;
    height: number;
}

export function MouseEventParams(x: number, y: number,
    movementX: number, movementY: number,
    mouseDown: boolean) {

    return {
        x: x, y: y,
        movementX: movementX, movementY: movementY,
        mouseDown: mouseDown
    };
}


export function ResizeParams(width: number, height: number): ResizeParams {
    return { width: width, height: height };
}

export type EventHandler = (params: EventParams) => void;

export interface EventHandlerItem {
    eventID: number;
    eventType: EventType;
    eventHandler: EventHandler;
}

export function EventHandlerItem(eventID: number, eventType: EventType, eventHandler: EventHandler) {
    return { eventID: eventID, eventType: eventType, eventHandler: eventHandler };
}

type EventHandlerItemArray = EventHandlerItem[];
