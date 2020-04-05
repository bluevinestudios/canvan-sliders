/**
 *  General purpose interface for a class that can be animated.
 */
export abstract class Animatable {
    abstract init(): Promise<void>;
    abstract draw();
    abstract step(timestamp: number);
    abstract active: boolean;
    abstract parseOptions();
}
