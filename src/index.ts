import css from './style.css?inline';

const template = document.createElement('template');
template.innerHTML = `
<div>
  <style>${css}</style>
  <div class="relative">
    <div class="absolute right-0 self-center text-white bg-black bg-opacity-25 hover:bg-opacity-50 transparency-reduce:bg-opacity-80 transparency-reduce:hover:bg-opacity-100 z-10">
      <button type="button" id="exit-fullscreen" class="hidden" title="Minimise Slide" aria-label="Minimise Slide">
        <svg class="w-8 h-8" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		  <path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M5.5 2C5.77614 2 6 2.22386 6 2.5V5.5C6 5.77614 5.77614 6 5.5 6H2.5C2.22386 6 2 5.77614 2 5.5C2 5.22386 2.22386 5 2.5 5H5V2.5C5 2.22386 5.22386 2 5.5 2ZM9.5 2C9.77614 2 10 2.22386 10 2.5V5H12.5C12.7761 5 13 5.22386 13 5.5C13 5.77614 12.7761 6 12.5 6H9.5C9.22386 6 9 5.77614 9 5.5V2.5C9 2.22386 9.22386 2 9.5 2ZM2 9.5C2 9.22386 2.22386 9 2.5 9H5.5C5.77614 9 6 9.22386 6 9.5V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V10H2.5C2.22386 10 2 9.77614 2 9.5ZM9 9.5C9 9.22386 9.22386 9 9.5 9H12.5C12.7761 9 13 9.22386 13 9.5C13 9.77614 12.7761 10 12.5 10H10V12.5C10 12.7761 9.77614 13 9.5 13C9.22386 13 9 12.7761 9 12.5V9.5Z"
			fill="currentcolor"
		  />
		</svg>
      </button>
      <button type="button" id="enter-fullscreen" class="hidden md:block" title="Maximise Slide" aria-label="Maximise Slide">
        <svg class="w-8 h-8"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="none" aria-hidden="true">
  			<path
  				fill-rule="evenodd"
  				clip-rule="evenodd"
  				d="M2 2.5C2 2.22386 2.22386 2 2.5 2H5.5C5.77614 2 6 2.22386 6 2.5C6 2.77614 5.77614 3 5.5 3H3V5.5C3 5.77614 2.77614 6 2.5 6C2.22386 6 2 5.77614 2 5.5V2.5ZM9 2.5C9 2.22386 9.22386 2 9.5 2H12.5C12.7761 2 13 2.22386 13 2.5V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3H9.5C9.22386 3 9 2.77614 9 2.5ZM2.5 9C2.77614 9 3 9.22386 3 9.5V12H5.5C5.77614 12 6 12.2239 6 12.5C6 12.7761 5.77614 13 5.5 13H2.5C2.22386 13 2 12.7761 2 12.5V9.5C2 9.22386 2.22386 9 2.5 9ZM12.5 9C12.7761 9 13 9.22386 13 9.5V12.5C13 12.7761 12.7761 13 12.5 13H9.5C9.22386 13 9 12.7761 9 12.5C9 12.2239 9.22386 12 9.5 12H12V9.5C12 9.22386 12.2239 9 12.5 9Z"
  				fill="currentcolor"
			/>
		</svg>
      </button>
    </div>
    <div class="relative flex">
      <div class="absolute self-center text-white bg-black bg-opacity-25 hover:bg-opacity-50 transparency-reduce:bg-opacity-80 transparency-reduce:hover:bg-opacity-100 hidden z-10">
        <a href="#" aria-label="Previous Slide" class="previous-image-link" aria-controls="carousel-items">
          <svg class="w-12 h-12 pointer-events-none" fill="none" stroke="currentColor"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        </a>
      </div>
      <div class="absolute right-0 self-center text-white bg-black bg-opacity-25 hover:bg-opacity-50 transparency-reduce:bg-opacity-80 transparency-reduce:hover:bg-opacity-100 hidden z-10">
        <a href="#" aria-label="Next Slide" class="next-image-link z-10" aria-controls="carousel-items">
          <svg class="w-12 h-12 pointer-events-none" fill="none" stroke="currentColor"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        </a>
      </div>
      <ul
		class="snap-mandatory snap-x scrollbar-none flex gap-5 flex-1 w-full motion-safe:scroll-smooth overflow-x-auto contents-container"
		id="carousel-items"
		aria-label="Carousel Items"
	  >
        <slot></slot>
      </ul>
    </div>
  </div>
  <div class="fixed inset-0 backdrop-brightness-50 transparency-reduce:backdrop-brightness-[0.25] z-5 hidden fullscreen-background"></div>
</div>`;

export default class HorizontalScroller extends HTMLElement {
	readonly #contents: DocumentFragment;
	#activeSlideIndex: number = 0;
	#numberOfChildren: number = 0;
	readonly #internals: ElementInternals;

	#closeWatcher: CloseWatcher | null = null;

	constructor() {
		super();

		const shadowRoot = this.attachShadow({ mode: 'open' });

		this.#contents = shadowRoot;
		shadowRoot.appendChild(template.content.cloneNode(true));
		this.#internals = this.attachInternals();
	}

	#exitFullscreen = (event: Event) => {
		event.stopPropagation();
		this.#closeWatcher?.destroy();

		const background = this.#contents.querySelector('.fullscreen-background')! as HTMLElement;
		const enterFullscreenButton = this.#contents.querySelector('#enter-fullscreen')! as HTMLButtonElement;
		const exitFullscreenButton = this.#contents.querySelector('#exit-fullscreen')! as HTMLButtonElement;

		background.classList.add('hidden');
		exitFullscreenButton.parentElement!.parentElement!.classList.add('relative');
		exitFullscreenButton.parentElement!.parentElement!.classList.remove('fixed', 'z-10', 'start-0', 'end-0', 'block-start-0', 'block-end-0', 'm-auto', 'max-w-[80%]', 'h-fit', 'w-fit');

		enterFullscreenButton.classList.toggle('md:block');
		exitFullscreenButton.classList.toggle('md:block');
		// @ts-ignore
		if (this.#contents!.activeElement === exitFullscreenButton)
			enterFullscreenButton.focus();

		this.dispatchEvent(new CustomEvent('scrollerfullscreenexit', { bubbles: true, composed: true }));
	};

	#scrollToTarget = (target: string) => {
		const slide = this.querySelector(target);
		if (!slide) return;

		const behaviour = window.matchMedia('(prefers-reduced-motion: reduce').matches ? 'auto' : 'smooth';
		slide.scrollIntoView({ behavior: behaviour, block: "nearest"});
	};

	#handleKeyPress = (e: KeyboardEvent) => {
		switch (e.key) {
			case "Escape":
				this.#exitFullscreen(e);
				break;
		}
	}

	#scrollendHandler = (event: Event) => {
		const target = event.target as HTMLElement;
		this.#activeSlideIndex = Math.round((target.scrollLeft / target.scrollWidth) * this.#numberOfChildren);
		const previousLink = this.#contents.querySelector(`.previous-image-link`)! as HTMLAnchorElement;
		const previousLinkContainer = previousLink.parentElement!;
		const nextLink = this.#contents.querySelector(`.next-image-link`)! as HTMLAnchorElement;
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
		this.#contents.firstElementChild!.classList.add('group', 'block');
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

		const contentsContainer = this.#contents.querySelector('.contents-container')!;

		if (this.#numberOfChildren > 1) {
			if ('onscrollend' in document) {
				this.#contents.querySelector('.contents-container')!.addEventListener('scrollend', this.#scrollendHandler);
			} else {
				this.#contents.querySelector('.contents-container')!.addEventListener('scroll', this.#scrollendHandler, {passive: true});
			}

			const nextLink = this.#contents.querySelector('.next-image-link')! as HTMLAnchorElement;
			nextLink.parentElement!.classList.add('!block');
			nextLink.href = `#${this.id}-2`;

			const scrollTo = (event: Event) => {
				event.stopPropagation();
				event.preventDefault();
				const target = event.target as HTMLAnchorElement;

				this.#scrollToTarget(`#${target.href.split('#')[1]}`);
			};

			nextLink.onclick = scrollTo;

			const previousLink = this.#contents.querySelector('.previous-image-link')! as HTMLAnchorElement;

			previousLink.onclick = scrollTo;
		} else {
			contentsContainer.classList.toggle('overflow-x-auto');
		}

		const background = this.#contents.querySelector('.fullscreen-background')! as HTMLElement;
		const enterFullscreenButton = this.#contents.querySelector('#enter-fullscreen')! as HTMLButtonElement;
		const exitFullscreenButton = this.#contents.querySelector('#exit-fullscreen')! as HTMLButtonElement;

		const noFullscreen = this.hasAttribute('no-fullscreen') || this.getAttribute('no-fullscreen') === 'true';

		if (!noFullscreen) {
			enterFullscreenButton.onclick = (event) => {
				event.stopPropagation();
				enterFullscreenButton.parentElement!.parentElement!.classList.remove('relative');
				enterFullscreenButton.parentElement!.parentElement!.classList.add('fixed', 'z-10', 'start-0', 'end-0', 'block-start-0', 'block-end-0', 'm-auto', 'max-w-[80%]', 'h-fit', 'w-fit');
				background.classList.remove('hidden');
				enterFullscreenButton.classList.toggle('md:block');
				exitFullscreenButton.classList.toggle('md:block');
				exitFullscreenButton.focus();

				this.dispatchEvent(new CustomEvent('scrollerfullscreenenter', { bubbles: true, composed: true }));

				// TODO: Should probably just make a simple polyfill for CloseWatcher
				if ('CloseWatcher' in window) {
					this.#closeWatcher?.destroy();
					this.#closeWatcher = new CloseWatcher();
					this.#closeWatcher.onclose = (e: Event) => {
						this.#exitFullscreen(e);
					}
				} else {
					document.addEventListener('keydown', this.#handleKeyPress);
				}
			}
			background.onclick = this.#exitFullscreen;
			exitFullscreenButton.onclick = this.#exitFullscreen;
		}

		if (noFullscreen) {
			enterFullscreenButton.classList.toggle('md:block');
		}

		document.querySelectorAll('img[data-hidden]').forEach((e: any) => {
			e.style.display = 'block';
		});

	}

	disconnectedCallback() {
		document.removeEventListener('keydown', this.#handleKeyPress);
		this.#contents.querySelector('.contents-container')!.removeEventListener('scroll', this.#scrollendHandler);
		this.#contents.querySelector('.contents-container')!.removeEventListener('scrollend', this.#scrollendHandler);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'horizontal-scroller': HorizontalScroller;
	}
}
