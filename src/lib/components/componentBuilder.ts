import * as utils from "../utils";
import * as constants from "../constants";
import { TouchHandler } from "./touchHandler";
import { EventDispatcher } from "./eventDispatcher";
import { Animator } from "./animation/animator";
import { ComponentOptions } from "./componentOptions";
import { MultiCanvasAnimationElement } from "./animation/multiCanvasAnimationElement";
import { MultiCanvasAxisSlider } from "./animation/sliders/multiCanvasAxisSlider";
import { SliderType, GradientType } from "./animation/sliders/axisSliderTypes";

/**
 * ComponentBuilder parses and initializes a single canvas component on the page (out of potentially many).
 * Example component HTML with two different types of layered canvas animation:
 * ```html
 * <div class="canvan-animator">
 *           <div class="canvan-linear-slider" transition-size="1" position-increment="0.1" dragable="true">
 *               <picture>
 *                   <source srcset="/images/source_example2.webp" type="image/webp" />
 *                   <img src="/images/source_example2.jpg" type="image/jpeg"  static="true"/>
 *               </picture>
 *               <picture>
 *                   <source srcset="/images/mapped_example2.webp" type="image/webp" />
 *                   <img src="/images/mapped_example2.jpg" type="image/jpeg" window-width="50" start-position-x="50"/>
 *               </picture>
 *           </div>
 *           <div class="canvan-radial-slider" transition-size="1" position-increment="0.5" dragable="true">
 *              <picture>
 *                  <source srcset="/images/source_example2.webp" type="image/webp" />
 *                  <img src="/images/source_example2.jpg" type="image/jpeg" radius="10" start-position-x="0" start-position-y="40" />
 *              </picture>
 *              <picture>
 *                  <source srcset="/images/mapped_example2.webp" type="image/webp" />
 *                  <img src="/images/mapped_example2.jpg" type="image/jpeg" radius="10" start-position-x="15" start-position-y="80" />
 *              </picture>
 *          </div>
 *      </div>
 *  </div>
 * ```
 */
export class ComponentBuilder {
    /**
     * @param container  Outermost div element that contains all of the component elements and attribute params.
     * @param uniqueIndex  A unique number that identifies this slider (creator must supply this number).  This is
     * used to dynamically add a unique class to the component.
     */
    constructor(container: Element, public selectorPrefix: string, public uniqueIndex: number) {
        this.container = container;

        this.options = new ComponentOptions();
        this.options.parse(container);
        this.className = utils.addSelectorPrefix(
            this.selectorPrefix,
            `${constants.uniqueSelectorID}-${this.uniqueIndex}`
        );
        utils.addClass(container, this.className);

        this.canvasArray = [];
        this.eventDispatcher = new EventDispatcher();
        this.touchHandler = new TouchHandler(this.container, this.eventDispatcher, this.selectorPrefix);
        this.animator = new Animator(this.container, this.canvasArray, this.eventDispatcher);

        if (this.options.dragable) this.touchHandler.addMouseListeners(container);
    }

    /**
     * Asynchronously parse our children elements.
     */
    async parseAndBuildElements(): Promise<void> {
        let children = this.container.getElementsByTagName("div");
        for (let index = 0; index < children.length; index++) {
            let classes = children[index].classList;
            if (classes != null) {
                // Support multiple animation types with this class selection.
                let gradientType: GradientType;
                if (classes.contains(utils.addSelectorPrefix(this.selectorPrefix, constants.linearSliderSelectorName)))
                    gradientType = GradientType.Linear;
                else if (
                    classes.contains(utils.addSelectorPrefix(this.selectorPrefix, constants.radialSliderSelectorName))
                )
                    gradientType = GradientType.Radial;

                let sliders = new MultiCanvasAxisSlider(
                    children[index],
                    this.eventDispatcher,
                    SliderType.Horizontal,
                    gradientType,
                    this.selectorPrefix
                );
                this.canvasArray.push(sliders);
            }
        }
        const loadAll: Promise<void>[] = this.canvasArray.map(
            async (sliderCanvas: MultiCanvasAnimationElement, index: number) => {
                return sliderCanvas.init();
            }
        );
        return new Promise<void>(async (resolve, reject) => {
            Promise.all(loadAll).then(() => {
                resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    /**
     * Start animating all of our components.
     */
    animate() {
        this.animator.start();
    }

    private animator: Animator;
    private container: Element;
    private options: ComponentOptions;
    private canvasArray: MultiCanvasAnimationElement[];
    private readonly className: string;
    private touchHandler: TouchHandler;
    private eventDispatcher: EventDispatcher;
}
