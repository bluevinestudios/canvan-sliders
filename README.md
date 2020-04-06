<br />
<div align="center">
  <p align="center">
    <a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/license-MIT-green.svg"></a>
    <a href="https://prettier.io" target="_blank"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat"></a>
  </p>

  <strong>
    <h2 align="center">Canvan Sliders</h2>
  </strong>

  <p align="center">
    Canvan Sliders allows you to build interactive, animatable before/after canvas sliders.  
    Canvan Sliders is dependency free and 100% open source.
  </p>

  <br>

  <p align="center">
    <strong>
      <code>&nbsp;<a href="https://bluevinestudios.github.io/canvan-sliders/">TRY DEMO</a>&nbsp;</code>
    </strong>
  </p>

  <br>

</div>
<br />

## Installation

NPM

<pre>npm install <a href="https://www.npmjs.com/package/canvan-sliders">canvan-sliders</a></pre>

<br>

## QuickStart

HTML

```html
<div class="canvan-container">
        <div class="canvan-animator">
            <div class="canvan-linear-slider" transition-size="1" position-increment="0.1" dragable="true">
                 <picture>
                     <source srcset="/images/source_example2b.webp" type="image/webp" />
                     <img src="/images/source_example2b.jpg" type="image/jpeg"  static="true"/>
                 </picture>
                 <picture>
                     <source srcset="/images/mapped_example2.webp" type="image/webp" />
                     <img src="/images/mapped_example2.jpg" type="image/jpeg" window-width="50" start-position-x="50"/>
                 </picture>

                 <picture>
                     <source srcset="/images/color_example2.webp" type="image/webp" />
                     <img src="/images/color_example2.jpg" type="image/jpeg" window-width="20" start-position-x="60"/>
                 </picture>
             </div> 
             <div class="canvan-radial-slider" transition-size="1" position-increment="0.5" dragable="true">
                <picture>
                    <source srcset="/images/source_example2.webp" type="image/webp" />
                    <img src="/images/source_example2.jpg" type="image/jpeg" radius="10" start-position-x="0" start-position-y="40" />
                </picture>
                <picture>
                    <source srcset="/images/mapped_example2.webp" type="image/webp" />
                    <img src="/images/mapped_example2.jpg" type="image/jpeg" radius="10" start-position-x="15" start-position-y="80" />
                </picture>
                <picture>
                    <source srcset="/images/color_example2.webp" type="image/webp" />
                    <img src="/images/color_example2.jpg" type="image/jpeg" radius="10" start-position-x="80" start-position-y="10" />
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

<br>

## Options

<br>

<h2 align="center">Open Source</h2>

<p align="center">
  <sup>Copyright © 2020, Ryan Robbins.</sup><br>
  Canvan is <a href="https://github.com/bluevinestudios/canvan-sliders/blob/master/LICENSE">MIT licensed</a>
</p>

<p align="center">
  <strong>· · ·</strong>
</p>

