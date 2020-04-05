// eventDispatcher.ts
/**
 * Event dispatcher.
 * @packageDocumentation
 */
import { EventType, EventHandler, EventHandlerItem, EventParams, EventHandlerItemArray } from './eventTypes';

/**
 * Class to handle and dispatch internal events (not DOM events).  These are global events
 * that any lower-level components can subscribe to.
 */
export class EventDispatcher {
    constructor() {
        this.events = new Map<EventType, EventHandlerItemArray>();
        this.nextEventID = 0;
    }

    /**
     * Subscribe to a given event type
     * @param eventType Type of event.
     * @param eventHandler Event handler.
     * @returns Unique ID for the subscription that is supplied to [[unsubscribe]].
     */
    subscribe(eventType: EventType, eventHandler: EventHandler): number {
        let newEventID = this.nextEventID;
        let eventArray = this.events.get(eventType);
        let newHandlerItem = EventHandlerItem(newEventID, eventType, eventHandler);
        if (eventArray == null) eventArray = new Array(1);
        eventArray[newEventID] = newHandlerItem;
        this.events.set(eventType, eventArray);

        this.nextEventID++;
        return newEventID;
    }

    /**
     * Unsubscribe from an event stream.
     * @param eventID Unique subscription ID returned from [[subscribe]].
     */
    unsubscribe(eventType: EventType, eventID: number) {
        let eventArray = this.events.get(eventType);
        if (eventArray != undefined) {
            let index = 0;
            for (let eventHandlerItem of eventArray) {
                if (eventHandlerItem.eventID == eventID) {
                    eventArray.splice(index, 1);
                    break;
                }
                index++;
            }
        }
    }

    /**
     * Kick off an event to all subscribers.
     * @param eventType Type of event to publish.
     * @param eventParams Event parameters.
     */
    dispatch(eventType: EventType, eventParams: EventParams) {
        let eventArray = this.events.get(eventType);
        if (eventArray != null) {
            eventArray.forEach(handler => {
                handler.eventHandler(eventParams);
            });
        }
    }

    private events: Map<EventType, EventHandlerItemArray>;
    private nextEventID: number;
}
