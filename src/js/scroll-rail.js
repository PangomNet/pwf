function initializeRail(rail) {
  const viewport = rail.querySelector('[data-pwf-scroll-viewport]');
  const track = rail.querySelector('[data-pwf-scroll-track]');
  const thumb = rail.querySelector('[data-pwf-scroll-thumb]');
  if (!viewport || !track || !thumb) return () => {};

  let maximumScroll = 0;
  let maximumThumbOffset = 0;
  rail.setAttribute('data-pwf-scroll-ready', '');

  const update = () => {
    maximumScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const trackWidth = track.clientWidth;
    const thumbWidth = maximumScroll === 0
      ? trackWidth
      : Math.max(40, trackWidth * viewport.clientWidth / viewport.scrollWidth);
    maximumThumbOffset = Math.max(0, trackWidth - thumbWidth);
    const offset = maximumScroll === 0 ? 0 : viewport.scrollLeft / maximumScroll * maximumThumbOffset;
    track.hidden = maximumScroll <= 1;
    thumb.style.width = `${thumbWidth}px`;
    thumb.style.setProperty('--pwf-scroll-thumb-x', `${offset}px`);
    thumb.setAttribute('aria-valuemin', '0');
    thumb.setAttribute('aria-valuemax', String(Math.round(maximumScroll)));
    thumb.setAttribute('aria-valuenow', String(Math.round(viewport.scrollLeft)));
  };

  const onWheel = (event) => {
    if (maximumScroll <= 0 || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    viewport.scrollLeft += event.deltaY;
  };

  const onTrackPointerDown = (event) => {
    if (event.target === thumb || maximumScroll <= 0) return;
    const bounds = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    viewport.scrollTo({ left: maximumScroll * ratio, behavior: 'smooth' });
  };

  const onThumbPointerDown = (event) => {
    if (maximumScroll <= 0) return;
    event.preventDefault();
    thumb.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startScroll = viewport.scrollLeft;
    const onMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      viewport.scrollLeft = startScroll + delta / Math.max(1, maximumThumbOffset) * maximumScroll;
    };
    const onEnd = () => {
      thumb.removeEventListener('pointermove', onMove);
      thumb.removeEventListener('pointerup', onEnd);
      thumb.removeEventListener('pointercancel', onEnd);
    };
    thumb.addEventListener('pointermove', onMove);
    thumb.addEventListener('pointerup', onEnd);
    thumb.addEventListener('pointercancel', onEnd);
  };

  const onThumbKeyDown = (event) => {
    const step = Math.max(40, viewport.clientWidth * 0.15);
    const actions = {
      ArrowLeft: () => { viewport.scrollLeft -= step; },
      ArrowRight: () => { viewport.scrollLeft += step; },
      PageUp: () => { viewport.scrollLeft -= viewport.clientWidth * 0.8; },
      PageDown: () => { viewport.scrollLeft += viewport.clientWidth * 0.8; },
      Home: () => { viewport.scrollLeft = 0; },
      End: () => { viewport.scrollLeft = maximumScroll; }
    };
    if (!actions[event.key]) return;
    event.preventDefault();
    actions[event.key]();
  };

  viewport.addEventListener('scroll', update, { passive: true });
  viewport.addEventListener('wheel', onWheel, { passive: false });
  track.addEventListener('pointerdown', onTrackPointerDown);
  thumb.addEventListener('pointerdown', onThumbPointerDown);
  thumb.addEventListener('keydown', onThumbKeyDown);
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
  observer?.observe(viewport);
  observer?.observe(track);
  update();

  return () => {
    observer?.disconnect();
    rail.removeAttribute('data-pwf-scroll-ready');
    track.hidden = true;
    viewport.removeEventListener('scroll', update);
    viewport.removeEventListener('wheel', onWheel);
    track.removeEventListener('pointerdown', onTrackPointerDown);
    thumb.removeEventListener('pointerdown', onThumbPointerDown);
    thumb.removeEventListener('keydown', onThumbKeyDown);
  };
}

/** Enhance horizontal overflow regions with a pointer, wheel, and keyboard rail. */
export function initScrollRails(root = document) {
  const cleanups = [...root.querySelectorAll('[data-pwf-scroll-rail]')].map(initializeRail);
  return () => cleanups.forEach((cleanup) => cleanup());
}
