export default class HorizontalScroller extends HTMLElement {
    #private;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'horizontal-scroller': HorizontalScroller;
    }
}
