function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/** Enhance a semantic audio or video element with optional PWF controls. */
export function initMediaPlayers(root = document, { mediaSession = false } = {}) {
  const cleanups = [];
  root.querySelectorAll('[data-pwf-media-player]').forEach((player) => {
    const media = player.querySelector('audio, video');
    if (!media) return;
    const play = player.querySelector('[data-pwf-media-play]');
    const mute = player.querySelector('[data-pwf-media-mute]');
    const timeline = player.querySelector('[data-pwf-media-timeline]');
    const time = player.querySelector('[data-pwf-media-time]');
    const queue = [...player.querySelectorAll('[data-pwf-media-source]')];

    const sync = () => {
      if (play) {
        play.textContent = media.paused ? '▶' : '❚❚';
        play.setAttribute('aria-label', media.paused ? 'Wiedergabe starten' : 'Wiedergabe pausieren');
      }
      if (mute) {
        mute.textContent = media.muted ? 'Stumm' : 'Ton';
        mute.setAttribute('aria-pressed', String(media.muted));
      }
      if (timeline) {
        timeline.max = String(Number.isFinite(media.duration) ? media.duration : 0);
        timeline.value = String(media.currentTime || 0);
      }
      if (time) time.textContent = `${formatTime(media.currentTime)} / ${formatTime(media.duration)}`;
    };
    const onPlay = () => media.paused ? media.play().catch(() => {}) : media.pause();
    const onMute = () => { media.muted = !media.muted; sync(); };
    const onSeek = () => { media.currentTime = Number(timeline.value); };
    play?.addEventListener('click', onPlay);
    mute?.addEventListener('click', onMute);
    timeline?.addEventListener('input', onSeek);
    ['play', 'pause', 'timeupdate', 'durationchange', 'volumechange', 'ended'].forEach((type) => media.addEventListener(type, sync));
    queue.forEach((button) => {
      const onSelect = () => {
        queue.forEach((item) => item.setAttribute('aria-current', String(item === button)));
        if (button.dataset.pwfMediaSource) media.src = button.dataset.pwfMediaSource;
        media.load();
        player.dispatchEvent(new CustomEvent('pwf:media-source-change', { bubbles: true, detail: { id: button.dataset.pwfMediaId || null } }));
        sync();
      };
      button.addEventListener('click', onSelect);
      cleanups.push(() => button.removeEventListener('click', onSelect));
    });
    if (mediaSession && 'mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => media.play());
      navigator.mediaSession.setActionHandler('pause', () => media.pause());
    }
    sync();
    cleanups.push(() => {
      play?.removeEventListener('click', onPlay);
      mute?.removeEventListener('click', onMute);
      timeline?.removeEventListener('input', onSeek);
      ['play', 'pause', 'timeupdate', 'durationchange', 'volumechange', 'ended'].forEach((type) => media.removeEventListener(type, sync));
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

export async function activate({ root = document } = {}) {
  return initMediaPlayers(root);
}
