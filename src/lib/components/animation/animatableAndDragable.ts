import * as utils from '../../utils';
import { Animatable } from './animatable';
import { Dragable } from './dragable';

/** Abstract class that is animatable and dragable, created using mixins. */
export abstract class AnimatableAndDragable {}

export interface AnimatableAndDragable extends Animatable, Dragable {}
utils.applyMixins(AnimatableAndDragable, [Animatable, Dragable]);
