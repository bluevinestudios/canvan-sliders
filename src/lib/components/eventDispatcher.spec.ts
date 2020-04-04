
import { EventDispatcher } from './eventDispatcher';
import { EventType, EventParams, MouseEventParams, EventHandler } from './eventTypes';

describe("pf-event-dispatcher", () => {

    it("can dispatch event", (done) => {
        let d = new EventDispatcher();
        let eventParams = MouseEventParams(20, 100, 40, -30, true);
        d.subscribe(EventType.MouseMove, (params: MouseEventParams) => {
            expect(params.x).toBe(eventParams.x);
            expect(params.y).toBe(eventParams.y);
            expect(params.movementX).toBe(eventParams.movementX);
            expect(params.movementY).toBe(eventParams.movementY);
            done();
        });
        d.dispatch(EventType.MouseMove, eventParams);
    });

    it("can unsubscribe event", () => {
        let d = new EventDispatcher();
        let eventParams = MouseEventParams(20, 100, 40, -30, true);
        let event: EventHandler = (params: MouseEventParams) => {
            fail();
        };
        let eventID = d.subscribe(EventType.MouseMove, event);
        d.unsubscribe(EventType.MouseMove, eventID);
        d.dispatch(EventType.MouseMove, eventParams);
    });

});
