# Canvan Sliders

Canvan Sliders allows you to build interactive, animatable before/after canvas sliders.  Still a WIP, the best
way to show what it can do now is to try out the demo!:

[TRY DEMO](https://bluevinestudios.github.io/canvan-sliders/)

## Installation

NPM

<pre>npm install <a href="https://www.npmjs.com/package/canvan-sliders">canvan-sliders</a></pre>

## QuickStart

HTML

```html
<div class="canvan-container">
    <div class="canvan-animator">
        <div class="canvan-static-slider">
            <picture>
                <source srcset="./images/source_example2.webp" type="image/webp" />
                <img src="./images/source_example2.jpg" type="image/jpeg" />
            </picture>
        </div>
        <div class="canvan-linear-slider" transition-size="5" position-increment="0.5" dragable="true">
            <picture>
                <source srcset="./images/mapped_example2.webp" type="image/webp" />
                <img src="./images/mapped_example2.jpg" type="image/jpeg" size="50" />
            </picture>
            <picture>
                <source srcset="./images/color_example2.webp" type="image/webp" />
                <img src="./images/color_example2.jpg" type="image/jpeg" size="20" />
            </picture>
        </div>
    </div>
</div>

```

CSS

```css
.canvan-container {
    width: 900px;
    height: 600px; 
    max-width: initial;
}

.canvan-animator {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.canvan-slider-mouse-down {
    cursor: grabbing;
}

.canvan-embedded {
    position: absolute;
    height: 100%;
    display: inline-block;
    max-height: initial;
    max-width: initial;
    margin-bottom: 0;
    width: auto;
}

.canvan-static-slider img {
    display: none;
}

.canvan-linear-slider img {
    display: none;
}

.canvan-radial-slider img {
    display: none;
}
```

TypeScript

```typescript
import { SliderCreator } from 'index';

let sliderCreator: SliderCreator;
const attributeSelectorPrefix = 'canvan';

function waitForDomContentLoaded() {
    return new Promise<HTMLDocument>(resolve => {
        window.addEventListener('DOMContentLoaded', (event: Event) => {
            let target: EventTarget = event.target as EventTarget;
            let document: HTMLDocument = target as HTMLDocument;
            resolve(document);
        });
    });
}

waitForDomContentLoaded()
    .then((document: HTMLDocument) => {
        sliderCreator = new SliderCreator(document, attributeSelectorPrefix);
        sliderCreator.scanAndCreateSliders()
            .then(() => {
                sliderCreator.animate();
            })
            .catch((error: Error) => {
                console.error(error);
            });
    })
    .catch((error: Error) => {
        console.error(error);
    });
```


## Options

WIP

<p align="center">
  <sup>Copyright © 2020, Ryan Robbins.</sup><br>
  Canvan is <a href="https://github.com/bluevinestudios/canvan-sliders/blob/master/LICENSE">MIT licensed</a>
</p>

<p align="center">
  <strong>· · ·</strong>
</p>

