const INTERVAL = Math.max(Number(configuration.autoplayDelay || 5000), 1000);

const MOVE_LEFT = 'move-left';
const MOVE_RIGHT = 'move-right';

const editMode = layoutMode === 'edit';

const slider = fragmentElement.querySelector('.lxp-slider');
const track = fragmentElement.querySelector('.lxp-slider__track');
const slides = Array.from(fragmentElement.querySelectorAll('.lxp-slide'));
const bullets = Array.from(fragmentElement.querySelectorAll('.lxp-slider__bullet'));
const fractionEl = fragmentElement.querySelector('.lxp-slider__fraction');
const prev = fragmentElement.querySelector('.lxp-slider__nav--prev');
const next = fragmentElement.querySelector('.lxp-slider__nav--next');
const toggleButton = fragmentElement.querySelector('.lxp-slider__toggle');
const nextItemIndexKey = `${fragmentEntryLinkNamespace}-next-item-index`;

let intervalId = null;
let moving = false;
let userPaused = false;

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

function clampIndex(index) {
	if (!slides.length) {
		return 0;
	}

	return Math.min(Math.max(index, 0), slides.length - 1);
}

function getActiveSlide() {
	return fragmentElement.querySelector('.lxp-slide.is-active');
}

function getActiveIndex() {
	const activeSlide = getActiveSlide();

	if (!activeSlide) {
		return 0;
	}

	const index = slides.indexOf(activeSlide);

	return index >= 0 ? index : 0;
}

function setNextItemIndex(index) {
	window[nextItemIndexKey] = clampIndex(index);
}

function getNextItemIndex() {
	return clampIndex(window[nextItemIndexKey] || 0);
}

function syncPagination() {
	const index = getActiveIndex();

	setNextItemIndex(index);

	if (bullets.length) {
		bullets.forEach((bullet, bulletIndex) => {
			const isActive = bulletIndex === index;

			bullet.classList.toggle('is-active', isActive);
			bullet.setAttribute('aria-current', isActive ? 'true' : 'false');
		});
	}

	if (fractionEl) {
		fractionEl.textContent = `${index + 1} / ${slides.length}`;
	}
}

function trackEvent(action, extra = {}) {
	if (!getConfigBoolean(configuration.enableTracking, false) || editMode) {
		return;
	}

	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: configuration.trackingEventName || 'advanced_slider_interaction',
		sliderId: configuration.sliderId || 'advanced-liferay-slider',
		action,
		slideIndex: getActiveIndex(),
		variant: configuration.variant || 'hero',
		...extra
	});
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
	const activeIndex = getActiveIndex();
	const previousIndex = activeIndex;

	let targetIndex;

	if (index !== null) {
		targetIndex = clampIndex(index);
	} else if (direction === MOVE_RIGHT) {
		targetIndex = activeIndex >= slides.length - 1 ? 0 : activeIndex + 1;
	} else {
		targetIndex = activeIndex <= 0 ? slides.length - 1 : activeIndex - 1;
	}

	const nextSlide = slides[targetIndex];

	window.setTimeout(() => {
		activateSlide(activeSlide, nextSlide);
		syncPagination();
		moving = false;

		if (targetIndex !== previousIndex) {
			trackEvent('slide_view', {
				previousSlideIndex: previousIndex,
				direction: index !== null ? 'bullet' : direction
			});
		}
	}, 120);
}

function startCarousel() {
	if (editMode || !getConfigBoolean(configuration.autoplay, true) || slides.length <= 1) {
		return;
	}

	userPaused = false;

	if (intervalId) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(() => {
		if (document.contains(slides[0])) {
			move(MOVE_RIGHT);
		} else {
			stopCarousel(false);
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

function stopCarousel(manual = true) {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}

	if (manual) {
		userPaused = true;
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

	if (absX < 40 || absX <= absY) {
		return;
	}

	stopCarousel();
	trackEvent('swipe', { direction: deltaX < 0 ? 'next' : 'prev' });

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
		const isFirst = index === 0;

		slide.classList.toggle('is-active', isFirst);
		slide.setAttribute('aria-hidden', isFirst ? 'false' : 'true');
	});

	syncPagination();

	if (!editMode) {
		startCarousel();
	}

	fragmentElement.querySelectorAll('.lxp-slide__cta--primary').forEach(cta => {
		cta.addEventListener('click', () => {
			trackEvent('click_cta', { ctaType: 'primary' });
		});
	});

	fragmentElement.querySelectorAll('.lxp-slide__cta--secondary').forEach(cta => {
		cta.addEventListener('click', () => {
			trackEvent('click_cta', { ctaType: 'secondary' });
		});
	});

	if (prev) {
		prev.addEventListener('click', () => {
			stopCarousel();
			trackEvent('nav_arrow', { direction: 'prev' });
			move(MOVE_LEFT);
		});
	}

	if (next) {
		next.addEventListener('click', () => {
			stopCarousel();
			trackEvent('nav_arrow', { direction: 'next' });
			move(MOVE_RIGHT);
		});
	}

	if (toggleButton) {
		toggleButton.addEventListener('click', () => {
			if (intervalId) {
				stopCarousel();
				trackEvent('autoplay_toggle', { state: 'paused' });
			} else {
				startCarousel();
				trackEvent('autoplay_toggle', { state: 'playing' });
			}
		});
	}

	bullets.forEach((bullet, index) => {
		bullet.addEventListener('click', () => {
			const activeIndex = getActiveIndex();

			if (index !== activeIndex) {
				stopCarousel();
				trackEvent('nav_bullet', { targetSlideIndex: index });
				move(null, index);
			}
		});
	});

	if (slider) {
		slider.addEventListener('keydown', event => {
			if (event.key === 'ArrowLeft') {
				stopCarousel();
				trackEvent('nav_keyboard', { direction: 'prev' });
				move(MOVE_LEFT);
			} else if (event.key === 'ArrowRight') {
				stopCarousel();
				trackEvent('nav_keyboard', { direction: 'next' });
				move(MOVE_RIGHT);
			}
		});

		slider.addEventListener('touchstart', handleTouchStart, { passive: true });
		slider.addEventListener('touchend', handleTouchEnd, { passive: true });

		if (getConfigBoolean(configuration.pauseOnHover, true)) {
			slider.addEventListener('mouseenter', () => {
				if (!editMode && getConfigBoolean(configuration.autoplay, true) && intervalId) {
					stopCarousel(false);
				}
			});

			slider.addEventListener('mouseleave', () => {
				if (
					!editMode &&
					!userPaused &&
					getConfigBoolean(configuration.autoplay, true)
				) {
					startCarousel();
				}
			});
		}
	}
})();
