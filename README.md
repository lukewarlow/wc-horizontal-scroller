# Navigation API Types

[![npm](https://img.shields.io/npm/v/wc-horizontal-scroller.svg?style=flat-square)](https://www.npmjs.com/package/wc-horizontal-scroller)

A web component for a horizontal scroller (carousel)

### Install

```shell
$ npm i wc-horizontal-scroller
```
### Usage

Firstly, you need to register the custom element.

```js
import HorizontalScroller from "wc-horizontal-scroller";

window.customElements.define('horizontal-scroller', HorizontalScroller);
```

Then you can use it in your HTML. You must provide an ID for the element.

```html
<horizontal-scroller id="foo">
    <div>Item 1</div>
    <div>Item 2</div>
</horizontal-scroller>
```

#### Fullscreen

By default, clicking on the element will expand it to cover most of the viewport. This can be disabled by adding the `no-fullscreen` attribute to the custom element.

A `scrollerfullscreenenter` event will be dispatched by the element when entering fullscreen, and `scrollerfullscreenexit` when exiting fullscreen. See [index.html](https://github.com/lukewarlow/navigation-api-types/blob/master/index.html) for an example usage.

## License

This project is licensed under the [MIT License](https://github.com/lukewarlow/navigation-api-types/blob/master/LICENSE).
