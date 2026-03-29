const INTERVAL = Math.max(Number(configuration.autoplayDelay || 5000), 1000);

const MOVE_LEFT = 'move-left';
const MOVE_RIGHT = 'move-right';

const editMode = layoutMode === 'edit';

const slider = fragmentElement.querySelector('.lxp-slider');
const track = fragmentElement.querySelector('.lxp-slider__track');
const slides = Array.from(fragmentElement.querySelectorAll('.lxp-slide'));
const bullets = Array.from(fragmentElement.querySelectorAll('.lxp-slider__bullet'));
const prev = fragmentElement.querySelector('.lxp-slider__nav--prev');
const next = fragmentElement.querySelector('.lxp-slider__nav--next');
const toggleButton = fragmentElement.querySelector('.lxp-slider__toggle');
const nextItemIndexKey = `${fragmentEntryLinkNamespace}-next-item-index`;

let intervalId = null;
let moving = false;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function getConfigBoolean(value, fallback = true) {
	if (typeof value === 'boolean') return value;
	if (value === 'true') return true;
	if (value === 'false') return false;
	return fallback;
}

function getNextItemIndex() {
	return window[nextItemIndexKey] || 0;
}

function setNextItemIndex(index) {
	window[nextItemIndexKey] = index;
}

function getActiveSlide() {
	return fragmentElement.querySelector('.lxp-slide.is-active');
}

function getActiveBullet() {
	return fragmentElement.querySelector('.lxp-slider__bullet.is-active');
}

function updateBullets() {
	const nextBullet = bullets[getNextItemIndex()];
	const activeBullet = getActiveBullet();

	if (activeBullet) {
		activeBullet.classList.remove('is-active');
		activeBullet.setAttribute('aria-current', 'false');
	}

	if (nextBullet) {
		nextBullet.classList.add('is-active');
		nextBullet.setAttribute('aria-current', 'true');
	}
}

function activateSlide(activeSlide, nextSlide) {
	if (activeSlide) {
		activeSlide.classList.remove('is-active');
		activeSlide.setAttribute('aria-hidden', 'true');
	}

	if (nextSlide) {
		nextSlide.classList.add('is-active');
		nextSlide.setAttribute('aria-hidden', 'false');
	}
}

function move(direction, index = null) {
	if (moving || slides.length <= 1) {
		return;
	}

	moving = true;

	const activeSlide = getActiveSlide();
	const activeIndex = slides.indexOf(activeSlide);

	if (index !== null) {
		setNextItemIndex(index);
	} else if (direction === MOVE_RIGHT) {
		setNextItemIndex(activeIndex >= slides.length - 1 ? 0 : activeIndex + 1);
	} else {
		setNextItemIndex(activeIndex <= 0 ? slides.length - 1 : activeIndex - 1);
	}

	const nextSlide = slides[getNextItemIndex()];

	updateBullets();

	window.setTimeout(() => {
		activateSlide(activeSlide, nextSlide);
		moving = false;
	}, 120);
}

function startCarousel() {
	if (editMode || !getConfigBoolean(configuration.autoplay, true) || slides.length <= 1) {
		return;
	}

	if (intervalId) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(() => {
		if (document.contains(slides[0])) {
			move(MOVE_RIGHT);
		} else {
			stopCarousel();
		}
	}, INTERVAL);

	if (track) {
		track.setAttribute('aria-live', 'off');
	}

	if (toggleButton && slider) {
		toggleButton.classList.remove('is-stopped');
		slider.classList.remove('is-paused');
		toggleButton.setAttribute('aria-label', 'Pausar rotação automática');
	}
}

function stopCarousel() {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}

	if (track) {
		track.setAttribute('aria-live', 'polite');
	}

	if (toggleButton && slider) {
		toggleButton.classList.add('is-stopped');
		slider.classList.add('is-paused');
		toggleButton.setAttribute('aria-label', 'Iniciar rotação automática');
	}
}

function handleTouchStart(event) {
	if (!event.changedTouches || !event.changedTouches.length) return;

	touchStartX = event.changedTouches[0].clientX;
	touchStartY = event.changedTouches[0].clientY;
}

function handleTouchEnd(event) {
	if (!event.changedTouches || !event.changedTouches.length) return;

	touchEndX = event.changedTouches[0].clientX;
	touchEndY = event.changedTouches[0].clientY;

	const deltaX = touchEndX - touchStartX;
	const deltaY = touchEndY - touchStartY;

	const absX = Math.abs(deltaX);
	const absY = Math.abs(deltaY);

	/* só reage a swipe horizontal real */
	if (absX < 40 || absX <= absY) {
		return;
	}

	stopCarousel();

	if (deltaX < 0) {
		move(MOVE_RIGHT);
	} else {
		move(MOVE_LEFT);
	}
}

(function init() {
	if (!slides.length) {
		return;
	}

	slides.forEach((slide, index) => {
		slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
	});

	if (!editMode) {
		startCarousel();
	}

	updateBullets();

	if (prev) {
		prev.addEventListener('click', () => {
			stopCarousel();
			move(MOVE_LEFT);
		});
	}

	if (next) {
		next.addEventListener('click', () => {
			stopCarousel();
			move(MOVE_RIGHT);
		});
	}

	if (toggleButton) {
		toggleButton.addEventListener('click', () => {
			if (intervalId) {
				stopCarousel();
			} else {
				startCarousel();
			}
		});
	}

	bullets.forEach((bullet, index) => {
		bullet.addEventListener('click', () => {
			const activeBullet = getActiveBullet();
			const activeIndex = bullets.indexOf(activeBullet);

			if (index !== activeIndex) {
				stopCarousel();

				if (index < activeIndex) {
					move(MOVE_LEFT, index);
				} else {
					move(MOVE_RIGHT, index);
				}
			}
		});
	});

	if (slider) {
		slider.addEventListener('keydown', event => {
			if (event.key === 'ArrowLeft') {
				stopCarousel();
				move(MOVE_LEFT);
			} else if (event.key === 'ArrowRight') {
				stopCarousel();
				move(MOVE_RIGHT);
			}
		});

		/* suporte a touch */
		slider.addEventListener('touchstart', handleTouchStart, { passive: true });
		slider.addEventListener('touchend', handleTouchEnd, { passive: true });

		if (getConfigBoolean(configuration.pauseOnHover, true)) {
			slider.addEventListener('mouseenter', () => {
				if (!editMode && getConfigBoolean(configuration.autoplay, true)) {
					stopCarousel();
				}
			});

			slider.addEventListener('mouseleave', () => {
				if (!editMode && getConfigBoolean(configuration.autoplay, true)) {
					startCarousel();
				}
			});
		}
	}
})();