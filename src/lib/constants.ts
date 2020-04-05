export const defaultTransitionWidth = 1;
export const defaultPositionIncrement = 0.5;
export const defaultVisibleWindowWidth = 20;
export const defaultDragable = true;
export const defaultSliderRadius = 50;

// Minimum width in % where we bother to show a gradient -- this can be so small
// because we wrap the gradient around the 0/1 boundaries.
export const minimumGradientWidth = 0.0001;

/** 
 *  Various class selectors defining our canvas animation.  A user-defined
 * (or default 'canvan') prefix is added to these selectors.  For example,
 * a top-level component would be, by default, 'canvan-animator'.
 */
export const animatorSelectorName = 'animator';
export const uniqueSelectorID = 'component-id';
export const linearSliderSelectorName = 'linear-slider';
export const radialSliderSelectorName = 'radial-slider';
export const embeddedCanvasClass = 'embedded';

export const dragableParamName = 'dragable';