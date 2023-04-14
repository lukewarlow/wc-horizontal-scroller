import css from './style.css?inline';

const template = document.createElement('template');
template.innerHTML = `
	<div>
		<style>${css}</style>
		<div class="relative">
			<div class="absolute right-0 self-center text-white opacity-50 group-hover:opacity-100 bg-black bg-opacity-25 hover:bg-opacity-50 hidden z-10">
				<button class="hidden lg:block exit-fullscreen-button">
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						 xmlns="http://www.w3.org/2000/svg">
						<path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
					</svg>
				</button>
			</div>
			<div class="relative flex">
				<div class="absolute self-center text-white bg-black bg-opacity-25 hover:bg-opacity-50 hidden z-10">
					<a aria-label="Previous Image" class="previous-image-link" href="#">
						<svg class="w-12 h-12 pointer-events-none" fill="none" stroke="currentColor"
							 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
						</svg>
					</a>
				</div>
				<ul class="snap-mandatory snap-x scrollbar-none flex flex-1 w-full motion-safe:scroll-smooth overflow-x-auto contents-container">
					<slot></slot>
				</ul>
				<div class="absolute right-0 self-center text-white bg-black bg-opacity-25 hover:bg-opacity-50 hidden z-10">
					<a aria-label="Next Image" class="next-image-link z-10" href="#">
						<svg class="w-12 h-12 pointer-events-none" fill="none" stroke="currentColor"
							 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
						</svg>
					</a>
				</div>
			</div>
		</div>
		<div class="fixed inset-0 backdrop-brightness-50 z-5 hidden fullscreen-background"></div>
	</div>
`;

export default class HorizontalScroller extends HTMLElement {
	readonly #contents: DocumentFragment;
	#activeSlideIndex: number = 0;
	#numberOfChildren: number = 0;

	#closeWatcher: any = null;

	constructor() {
		super();

		const shadowRoot = this.attachShadow({ mode: 'open' });

		this.#contents = shadowRoot;
		shadowRoot.appendChild(template.content.cloneNode(true));
	}

	#exitFullscreen = (event: Event) => {
		event.stopPropagation();
		this.#closeWatcher?.destroy();

		const background = this.#contents.querySelector('.fullscreen-background')! as HTMLElement;
		const exitFullscreenButton = this.#contents.querySelector('.exit-fullscreen-button')! as HTMLButtonElement;

		background.classList.add('hidden');
		exitFullscreenButton.parentElement!.classList.remove('sm:block');
		exitFullscreenButton.parentElement!.parentElement!.classList.add('relative');
		exitFullscreenButton.parentElement!.parentElement!.classList.remove('fixed', 'z-10', 'start-0', 'end-0', 'block-start-0', 'block-end-0', 'm-auto', 'max-w-[80%]', 'h-fit', 'w-fit');

		this.#contents.firstElementChild!.classList.add('lg:cursor-pointer');
		document.body.style.overflowY = 'visible';
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
		const target = event.target as HTMLUListElement;
		this.#activeSlideIndex = Math.round((target.scrollLeft / target.scrollWidth) * this.#numberOfChildren);
		const previousLink = this.#contents.querySelector(`.previous-image-link`)! as HTMLAnchorElement;
		const previousLinkContainer = previousLink.parentElement!;
		const nextLink = this.#contents.querySelector(`.next-image-link`)! as HTMLAnchorElement;
		const nextLinkContainer = nextLink.parentElement!;
		if (this.#activeSlideIndex === 0) {
			previousLinkContainer.classList.remove('sm:block');
		}

		if (this.#activeSlideIndex === this.#numberOfChildren - 1) {
			nextLinkContainer.classList.remove('sm:block');
		}

		if (this.#activeSlideIndex > 0) {
			previousLinkContainer.classList.add('sm:block');
			previousLink.href = `#${this.id}-${this.#activeSlideIndex}`;
		}

		if (this.#activeSlideIndex < this.#numberOfChildren - 1) {
			nextLinkContainer.classList.add('sm:block');
			nextLink.href = `#${this.id}-${this.#activeSlideIndex + 2}`;
		}
	}

	connectedCallback() {
		this.#contents.firstElementChild!.classList.add('group', 'block');

		// @ts-ignore
		this.#numberOfChildren = Array.from(this.children).filter((el: HTMLElement) => getComputedStyle(el).display !== 'none').length;

		const contentsContainer = this.#contents.querySelector('.contents-container')!;

		if (this.#numberOfChildren > 1) {

			if ('onscrollend' in document) {
				this.#contents.querySelector('.contents-container')!.addEventListener('scrollend', this.#scrollendHandler);
			} else {
				this.#contents.querySelector('.contents-container')!.addEventListener('scroll', this.#scrollendHandler, {passive: true});
			}

			const nextLink = this.#contents.querySelector('.next-image-link')! as HTMLAnchorElement;
			nextLink.parentElement!.classList.add('sm:block');
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
		const exitFullscreenButton = this.#contents.querySelector('.exit-fullscreen-button')! as HTMLButtonElement;

		background.onclick = this.#exitFullscreen;
		exitFullscreenButton.onclick = this.#exitFullscreen;

		this.onclick = (event) => {
			event.stopPropagation();
			if (window.matchMedia('(min-width: 1024px)').matches && (!this.hasAttribute('can-fullscreen') || this.getAttribute('can-fullscreen') === 'true')) {
				exitFullscreenButton.parentElement!.classList.add('sm:block');
				exitFullscreenButton.parentElement!.parentElement!.classList.remove('relative');
				exitFullscreenButton.parentElement!.parentElement!.classList.add('fixed', 'z-10', 'start-0', 'end-0', 'block-start-0', 'block-end-0', 'm-auto', 'max-w-[80%]', 'h-fit', 'w-fit');

				background.classList.remove('hidden');

				this.#contents.firstElementChild!.classList.remove('lg:cursor-pointer');
				document.body.style.overflowY = 'hidden';
			}

			if ('#closeWatcher' in window) {
				// @ts-ignore
				this.#closeWatcher = new CloseWatcher();
				this.#closeWatcher.onclose = (e: CloseEvent) => {
					this.#exitFullscreen(e);
				}
			} else {
				document.addEventListener('keydown', this.#handleKeyPress);
			}
		};

		if ((!this.hasAttribute('can-fullscreen') || this.getAttribute('can-fullscreen') === 'true')) {
			this.#contents.firstElementChild!.classList.add('lg:cursor-pointer');
		}

		document.querySelectorAll('img[data-hidden]').forEach((e: any) => {
			e.style.display = 'block';
		})

	}

	disconnectedCallback() {
		document.removeEventListener('keydown', this.#handleKeyPress);
		this.#contents.querySelector('.contents-container')!.removeEventListener('scroll', this.#scrollendHandler);
		this.#contents.querySelector('.contents-container')!.removeEventListener('scrollend', this.#scrollendHandler);
	}
}
