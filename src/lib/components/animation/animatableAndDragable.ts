import * as utils from "../../utils";
import { Animatable } from "./animatable";
import { Dragable } from "./dragable";

export abstract class AnimatableAndDragable {}

export interface AnimatableAndDragable extends Animatable, Dragable {}
utils.applyMixins(AnimatableAndDragable, [Animatable, Dragable]);
