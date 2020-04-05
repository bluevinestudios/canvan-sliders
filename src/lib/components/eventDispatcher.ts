// eventDispatcher.ts
/**
 * This is the doc comment for file1.ts
 * @packageDocumentation
 */
import * as eventTypes from './eventTypes';

type EventHandlerItemArray = eventTypes.EventHandlerItem[];

/**
 * Class to handle and dispatch internal events (not DOM events).  These are global events
 * that any lower-level components can subscribe to.
 */
export class EventDispatcher {   
    constructor() {
        this.events = new Map<eventTypes.EventType, EventHandlerItemArray>();
        this.nextEventID = 0;
    }

    /**
    * Subscribe to a given event type
    * @param eventType Type of event.
    * @param eventHandler Event handler.
    * @returns Unique ID for the subscription that is supplied to [[unsubscribe]].
    */
    subscribe(eventType: eventTypes.EventType, eventHandler: eventTypes.EventHandler): number {
        let newEventID = this.nextEventID;
        let eventArray = this.events.get(eventType);
        let newHandlerItem = eventTypes.EventHandlerItem(newEventID, eventType, eventHandler);
        if (eventArray == null)
            eventArray = new Array(1);
        eventArray[newEventID] = newHandlerItem;
        this.events.set(eventType, eventArray);

        this.nextEventID++;
        return newEventID;
    }

    /**
     * Unsubscribe from an event stream.
     * @param eventID Unique subscription ID returned from [[subscribe]].
     */
    unsubscribe(eventType: eventTypes.EventType, eventID: number) {
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
    dispatch(eventType: eventTypes.EventType, eventParams: eventTypes.EventParams) {
        let eventArray = this.events.get(eventType);
        if (eventArray != null) {
            eventArray.forEach((handler) => {
                handler.eventHandler(eventParams);
            });
        }
    }    

    private events: Map<eventTypes.EventType, EventHandlerItemArray>;
    private nextEventID: number;
}

