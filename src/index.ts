import "invokers-polyfill";
import css from './style.css?inline';

if (!('trustedTypes' in window)) {
	window.trustedTypes={createPolicy:(_: string, options: TrustedTypePolicyOptions) => options};
}

const template = document.createElement('template');
const trustedTypesPolicy = window.trustedTypes!.createPolicy('wc-horizontal-scroller', { createHTML: (s: string) => s });

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(css);

template.innerHTML = trustedTypesPolicy.createHTML(`
<div>
<dialog id="dialog" closedby="any">
<div id="dialog-child">
  <button aria-expanded="true" command="close" commandfor="dialog" type="button" id="exit-fullscreen" title="Minimise Slide" aria-label="Minimise Slide">
	<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	  <path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M5.5 2C5.77614 2 6 2.22386 6 2.5V5.5C6 5.77614 5.77614 6 5.5 6H2.5C2.22386 6 2 5.77614 2 5.5C2 5.22386 2.22386 5 2.5 5H5V2.5C5 2.22386 5.22386 2 5.5 2ZM9.5 2C9.77614 2 10 2.22386 10 2.5V5H12.5C12.7761 5 13 5.22386 13 5.5C13 5.77614 12.7761 6 12.5 6H9.5C9.22386 6 9 5.77614 9 5.5V2.5C9 2.22386 9.22386 2 9.5 2ZM2 9.5C2 9.22386 2.22386 9 2.5 9H5.5C5.77614 9 6 9.22386 6 9.5V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V10H2.5C2.22386 10 2 9.77614 2 9.5ZM9 9.5C9 9.22386 9.22386 9 9.5 9H12.5C12.7761 9 13 9.22386 13 9.5C13 9.77614 12.7761 10 12.5 10H10V12.5C10 12.7761 9.77614 13 9.5 13C9.22386 13 9 12.7761 9 12.5V9.5Z"
		fill="currentcolor"
	  />
	</svg>
  </button>
  <button command="show-modal" commandfor="dialog" type="button" id="enter-fullscreen" title="Maximise Slide" aria-label="Maximise Slide">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="none" aria-hidden="true">
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M2 2.5C2 2.22386 2.22386 2 2.5 2H5.5C5.77614 2 6 2.22386 6 2.5C6 2.77614 5.77614 3 5.5 3H3V5.5C3 5.77614 2.77614 6 2.5 6C2.22386 6 2 5.77614 2 5.5V2.5ZM9 2.5C9 2.22386 9.22386 2 9.5 2H12.5C12.7761 2 13 2.22386 13 2.5V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3H9.5C9.22386 3 9 2.77614 9 2.5ZM2.5 9C2.77614 9 3 9.22386 3 9.5V12H5.5C5.77614 12 6 12.2239 6 12.5C6 12.7761 5.77614 13 5.5 13H2.5C2.22386 13 2 12.7761 2 12.5V9.5C2 9.22386 2.22386 9 2.5 9ZM12.5 9C12.7761 9 13 9.22386 13 9.5V12.5C13 12.7761 12.7761 13 12.5 13H9.5C9.22386 13 9 12.7761 9 12.5C9 12.2239 9.22386 12 9.5 12H12V9.5C12 9.22386 12.2239 9 12.5 9Z"
			fill="currentcolor"
		/>
	</svg>
  </button>
</div>
<div id="image-container">
  <div id="previous-link-container" class="link-container">
	<a id="previous-link" href="#" aria-label="Previous Slide" aria-controls="carousel-items">
	  <svg fill="none" stroke="currentColor"
		   viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
	  </svg>
	</a>
  </div>
  <div id="next-link-container" class="link-container">
	<a id="next-link" href="#" aria-label="Next Slide" aria-controls="carousel-items">
	  <svg fill="none" stroke="currentColor"
		   viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
	  </svg>
	</a>
  </div>
  <ul
	class="contents-container"
	id="carousel-items"
	aria-label="Carousel Items"
  >
	<slot></slot>
  </ul>
</div>
</dialog>
</div>`);

export default class HorizontalScroller extends HTMLElement {
	readonly #contents: DocumentFragment;
	#activeSlideIndex: number = 0;
	#numberOfChildren: number = 0;
	readonly #internals: ElementInternals;

	constructor() {
		super();

		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.adoptedStyleSheets.push(styleSheet);

		this.#contents = shadowRoot;
		shadowRoot.appendChild(template.content.cloneNode(true));
		this.#internals = this.attachInternals();
	}

	#onToggle = (event: any) => {
		this.#internals.states.delete(event.oldState);
		this.#internals.states.add(event.newState);
	}

	#scrollToTarget = (target: string) => {
		const slide = this.querySelector(target);
		if (!slide) return;

		const behaviour = window.matchMedia('(prefers-reduced-motion: reduce').matches ? 'auto' : 'smooth';
		slide.scrollIntoView({ behavior: behaviour, block: "nearest"});
	};

	#scrollendHandler = (event: Event) => {
		const target = event.target as HTMLElement;
		this.#activeSlideIndex = Math.round((target.scrollLeft / target.scrollWidth) * this.#numberOfChildren);
		const previousLink = this.#contents.querySelector(`#previous-link`)! as HTMLAnchorElement;
		const previousLinkContainer = previousLink.parentElement!;
		const nextLink = this.#contents.querySelector(`#next-link`)! as HTMLAnchorElement;
		const nextLinkContainer = nextLink.parentElement!;
		if (this.#activeSlideIndex === 0) {
			previousLinkContainer.classList.remove('!block');
			// @ts-ignore
			if (this.#contents.activeElement == previousLink)
				nextLink.focus();
		}

		if (this.#activeSlideIndex === this.#numberOfChildren - 1) {
			nextLinkContainer.classList.remove('!block');
			// @ts-ignore
			if (this.#contents.activeElement == nextLink)
				previousLink.focus();
		}

		if (this.#activeSlideIndex > 0) {
			previousLinkContainer.classList.add('!block');
			previousLink.href = `#${this.id}-${this.#activeSlideIndex}`;
		}

		if (this.#activeSlideIndex < this.#numberOfChildren - 1) {
			nextLinkContainer.classList.add('!block');
			nextLink.href = `#${this.id}-${this.#activeSlideIndex + 2}`;
		}
	}

	connectedCallback() {
		this.#internals.role = 'region';
		this.#internals.ariaRoleDescription = 'carousel';
		this.#internals.ariaLabel = 'Carousel';
		this.#contents.firstElementChild!.classList.add('block');
		// @ts-ignore
		const children: HTMLElement[] = Array.from(this.children).filter((el: HTMLElement) => getComputedStyle(el).display !== 'none');

		children.forEach((child, index) => {
			const wrapper = document.createElement('li');
			child.parentNode!.insertBefore(wrapper, child);
			wrapper.appendChild(child);
			wrapper.id = `${this.id}-${index + 1}`;
			// wrapper.role = 'group'; // TODO double check this
			wrapper.ariaRoleDescription = 'slide';
			wrapper.ariaLabel = `${index + 1} of ${children.length}`;
			child.style.width = '100vw';
		});

		this.#numberOfChildren = children.length;

		const contentsContainer = this.#contents.querySelector('#carousel-items')! as HTMLElement;

		if (this.#numberOfChildren > 1) {
			if ('onscrollend' in document) {
				this.#contents.querySelector('#carousel-items')!.addEventListener('scrollend', this.#scrollendHandler);
			} else {
				this.#contents.querySelector('#carousel-items')!.addEventListener('scroll', this.#scrollendHandler, {passive: true});
			}

			const nextLink = this.#contents.querySelector('#next-link')! as HTMLAnchorElement;
			nextLink.parentElement!.classList.add('!block');
			nextLink.href = `#${this.id}-2`;

			const scrollTo = (event: Event) => {
				event.stopPropagation();
				event.preventDefault();
				const target = event.target as HTMLAnchorElement;

				this.#scrollToTarget(`#${target.href.split('#')[1]}`);
			};

			nextLink.onclick = scrollTo;

			const previousLink = this.#contents.querySelector('#previous-link')! as HTMLAnchorElement;

			previousLink.onclick = scrollTo;
		} else {
			contentsContainer.style.overflowX = 'visible';
		}

		const dialog = this.#contents.querySelector('dialog')! as HTMLDialogElement;
		dialog.addEventListener('toggle', this.#onToggle); // TODO Safari doesn't support this?

		document.querySelectorAll('img[data-hidden]').forEach((e: any) => {
			e.style.display = 'block';
		});
	}

	disconnectedCallback() {
		this.#contents.querySelector('dialog')!.removeEventListener('toggle', this.#onToggle);
		this.#contents.querySelector('#carousel-items')!.removeEventListener('scroll', this.#scrollendHandler);
		this.#contents.querySelector('#carousel-items')!.removeEventListener('scrollend', this.#scrollendHandler);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'horizontal-scroller': HorizontalScroller;
	}
}
