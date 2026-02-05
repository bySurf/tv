document.addEventListener('DOMContentLoaded', () => {
      
['click', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, () => {
    userHasInteracted = true;
  }, { once: true });
});
const DATA_URL = `https://lively-river-42ea.ktrocityy.workers.dev`;
let FW_HISTORY = [];
        const PLACEHOLDER_IMG = 'https://imgproxy.fourthwall.com/NGtTO-xePFSZdb5LAhcDCr3XNJqbjfENjyEBhj3iuwg/rt:fill/w:890/el:0/q:90/sm:1/enc/OWI1ZjVmZWY3YzFl/NTU3MhnnXWS1kcOe/jMySDjmqYEIrQsny/BKsT-ZtwEAE_BOqy/SEdbRIPEeHAY5Wc4/Pf6vugezBG5nV_2Q/4pdiBMDSBVWkrmq1/HsM_1Kt1tsThv_Cm/jT5yLyH3U-f_N9L2/3fZfgDs7zHsdRfPi/hCLoWk1VnrE.webp';
function getResizedUrl(url, width) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=80&output=webp`;
}


const LOCK_ICON_HTML = `
  <div class="lock-tag">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
</svg>
  </div>
`;

        const CLEARED_KEY = 'bysurf_cleared_v1';
        const DEBUG = localStorage.getItem('bysurf_debug') === '1';
        const dbg = (...a)=>{ if(DEBUG) console.log('[bysurf]', ...a); };
let showBannerVideoTimeout = null;
let userPrefersMuted = true;
let heroIsInView = true;
async function isPaidMember() {
  try {
    const res = await fetch('https://bysurf.tv/supporters/perks', {
      credentials: 'include'
    });
    if (res.redirected) return false;

    const html = await res.text();
    return html.includes('Your perks');
  } catch {
    return false;
  }
}

async function loadAndPlayBannerVideo(videoEl, url) {
  if (!videoEl || !url) return;
let userHasInteracted = false;
  try {
    // Fetch as blob
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Reset state
    videoEl.pause();
    videoEl.src = blobUrl;
    videoEl.currentTime = 0;
    videoEl.muted = !userHasInteracted;
    videoEl.volume = 0;
    videoEl.style.opacity = 0;
videoEl.muted = userPrefersMuted && !userHasInteracted;

    await videoEl.play();

    // Fade in (to 0.3 volume)
    let v = 0;
    const fadeIn = setInterval(() => {
      v += 0.03;
      videoEl.volume = Math.min(v, 0.3);
      videoEl.style.opacity = Math.min(v * 4, 1);
      if (v >= 0.3) clearInterval(fadeIn);
    }, 50);

    // Fade out when finished
    videoEl.onended = () => {
      const fadeOut = setInterval(() => {
        v -= 0.03;
        videoEl.volume = Math.max(v, 0);
        videoEl.style.opacity = Math.max(v * 3, 0);
        if (v <= 0) {
          clearInterval(fadeOut);
          videoEl.pause();
        }
      }, 50);
    };
  } catch (err) {
    console.warn('Banner video failed to load:', err);
  }
}

        const slug = (s='')=> s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
        const pad = n => { n = parseInt(n,10); if(isNaN(n)||n<0) return '00'; return n<10 ? `0${n}` : String(n); };
        const getEpisodeLabel = (v) => {
            const ep = v.episodeNumber ?? v.episode;
            const sn = v.seasonNumber ?? v.season ?? 1;
            if (ep == null) return '';
            return `S${pad(sn)}E${pad(ep)}`;
        };
        const episodeLabelStrict = getEpisodeLabel;
        const showVideoMuteBtn = document.getElementById('showVideoMute');
function addRippleEffect(button, event) {
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');

  const size = Math.max(rect.width, rect.height);

  const clientX = event?.clientX ?? (rect.left + rect.width / 2);
  const clientY = event?.clientY ?? (rect.top + rect.height / 2);

  const x = clientX - rect.left - size / 2;
  const y = clientY - rect.top - size / 2;

  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  button.appendChild(ripple);

  ripple.addEventListener('animationend', () => ripple.remove());
}

showVideoMuteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const v = document.getElementById('showBannerVideo');
  if (!v) return;

  v.muted = !v.muted;
userPrefersMuted = v.muted;
  const iconOn = showVideoMuteBtn.querySelector('.icon-on');
  const iconOff = showVideoMuteBtn.querySelector('.icon-off');

  if (v.muted) {
    iconOn.style.display = 'none';
    iconOff.style.display = 'block';
  } else {
    iconOn.style.display = 'block';
    iconOff.style.display = 'none';
  }
});

        function renderDescription(el, text='', creatorLinks){
          const md = (text||'').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (m,t,u)=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
          const container = document.createElement('div');
          container.innerHTML = md;
          container.querySelectorAll('*').forEach(n=>{
            [...n.attributes].forEach(a=>{ if(/^on/i.test(a.name)) n.removeAttribute(a.name); });
            if(n.tagName.toLowerCase()==='a'){
              const href = n.getAttribute('href')||''; if(!/^https?:\/\//i.test(href)) n.removeAttribute('href');
              n.setAttribute('target','_blank'); n.setAttribute('rel','noopener noreferrer');
            }
          });
          el.innerHTML = container.innerHTML;
          if(Array.isArray(creatorLinks) && creatorLinks.length){
            const wrap = document.createElement('div'); wrap.style.marginTop = '8px'; wrap.style.display='flex'; wrap.style.gap='8px'; wrap.style.flexWrap='wrap';
            creatorLinks.forEach(l=>{
              if(!l || !/^https?:\/\//i.test(l.href||'')) return;
              const a = document.createElement('a'); a.href=l.href; a.textContent=l.title||l.href; a.target='_blank'; a.rel='noopener noreferrer';
              a.className='creatorLink';
              wrap.appendChild(a);
            });
            el.appendChild(document.createElement('br'));
            el.appendChild(wrap);
          }
        }

        const playerModal = document.getElementById('playerModal');
        const wrap  = document.getElementById('playerWrap');
        const closePlayerBtn = document.getElementById('closeModal');
        let isModalOpen = false;
        let updateHeroFromHistory = function() {};

        function lockPage(){ document.body.classList.add('no-scroll'); }
        function unlockPage(){ document.body.classList.remove('no-scroll'); }
        
        closePlayerBtn.onclick = closePlayer;
        playerModal.addEventListener('click', (e)=>{ if(e.target===playerModal) closePlayer(); });
        document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closePlayer(); closeShow(); } });

        function openIframe(v) {
            if (!v || !v.url) { return; }
            const videoId = v.__id;
            if (videoId) {
                const cleared = getCleared();
                if (cleared.has(videoId)) {
                    cleared.delete(videoId);
                    putCleared(cleared);
                    const isAlreadyInHistory = FW_HISTORY.some(item => item.id === videoId);
                    if (!isAlreadyInHistory) {
                        FW_HISTORY.unshift({ id: v.__id, title: v.title, thumbnail: v.thumbnail, url: v.url, show: v.show || '', progressPct: 0 });
                        loadCW();
                    }
                }
            }
            isModalOpen = true;
            wrap.innerHTML = `<iframe src="${v.url}" class="player-frame" allow="autoplay; fullscreen; picture-in-picture; encrypted-media"></iframe>`;
            playerModal.classList.add('open');
            lockPage();
            syncHeroVideoToModals();
        }

        function closePlayer() {
            if (!isModalOpen) return;
            wrap.innerHTML = '';
            playerModal.classList.remove('open');
            unlockPage();
            isModalOpen = false;
            syncHeroVideoToModals();
            fetchFourthwallHistory().then(({history}) => {
                FW_HISTORY = history;
                loadCW();
                buildBecauseYouWatchedRail();
                updateHeroFromHistory();
            });
        }
        
        function openPlayer(v) {
            closeShow();
            openIframe(v);
        }

        function closeAllSelects(elmnt) {
            const selectItems = document.getElementsByClassName("select-items");
            const selectSelected = document.getElementsByClassName("select-selected");
            for (let i = 0; i < selectSelected.length; i++) {
                if (elmnt == selectSelected[i]) continue;
                selectSelected[i].classList.remove("select-arrow-active");
            }
            for (let i = 0; i < selectItems.length; i++) {
                if (elmnt == selectItems[i].previousElementSibling) continue;
                selectItems[i].classList.add("select-hide");
            }
        }
        document.addEventListener("click", () => closeAllSelects(null));

function videoCard(v){
  const div = document.createElement('div');
  div.className = 'card';

  const label = episodeLabelStrict(v);
  const sub = [label, v.show].filter(Boolean).join(' · ');

  const freeTag = v.isFree ? '<div class="free-tag">Free</div>' : '';
  const lockTag = (!v.isFree && !IS_PAID_MEMBER) ? LOCK_ICON_HTML : '';

  div.innerHTML = `
    <div style="position:relative">
      ${freeTag}
      ${lockTag}
      <img class="thumb lazy-img"
           src="${PLACEHOLDER_IMG}"
           data-src="${getResizedUrl(v.thumbnail, 600)}"
           alt="${v.title}">



      <div class="progress-bar" style="display:none"><span></span></div>
    </div>
    <div class="meta">
      <div class="name">${v.title}</div>
      ${sub ? `<div class="sub">${sub}</div>` : ''}
    </div>
  `;
  div.onclick = () => openPlayer(v);
  return div;
}


        function cwCard(v, options={}){
          const pct = Math.max(0, Math.min(100, options.progressPct || 0));
          const div=document.createElement('div');
          div.className='card';
          const sub = v.show ? v.show : '';
          div.innerHTML=`<div style="position:relative">
                           <img class="thumb lazy-img" src="${getResizedUrl(v.thumbnail, 600)}" data-src="${getResizedUrl(v.thumbnail, 600)}" alt="${v.title}">
                           <button class="remove-from-cw" title="Remove from queue">&times;</button>
                           <div class="progress-bar"><span style="width:${pct}%"></span></div>
                         </div>
                         <div class="meta">
                           <div class="name">${v.title}</div>
                           ${sub?`<div class="sub">${sub}</div>`:''}
                         </div>`;
          div.onclick=()=> openPlayer(v);
          const removeBtn = div.querySelector('.remove-from-cw');
          removeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const videoId = v.__id;
              const cleared = getCleared();
              cleared.add(videoId);
              putCleared(cleared);
              FW_HISTORY = FW_HISTORY.filter(item => item.id !== videoId);
              loadCW();
          });
          return div;
        }

        function adjustShowMobileSpacing() {
  if (window.innerWidth > 768) return;

  const desc = document.getElementById('showDesc');
  const spacer = document.getElementById('showMobileSpacer');
  const banner = document.getElementById('showBanner');

  if (!desc || !spacer || !banner) return;

  const descRect = desc.getBoundingClientRect();
  const bannerRect = banner.getBoundingClientRect();

  const overlap = descRect.bottom - bannerRect.bottom;

  spacer.style.display = 'block';
  spacer.style.height = overlap > 0 ? `${overlap + 12}px` : '0px';
}

function syncMuteIcon(btn, isMuted) {
  if (!btn) return;
  const on = btn.querySelector('.icon-on');
  const off = btn.querySelector('.icon-off');

  if (!on || !off) return;

  if (isMuted) {
    on.style.display = 'none';
    off.style.display = 'block';
  } else {
    on.style.display = 'block';
    off.style.display = 'none';
  }
}

                                    const HISTORY_URL = 'https://bysurf.tv/supporters/history';

async function fetchWatchHistoryHTML() {
  const res = await fetch(HISTORY_URL, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.text();
}

function parseFullyWatchedEpisodes(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const videos = [...doc.querySelectorAll('.video')];
  const MIN_PCT = 95;
  return videos
    .map(video => {
      const href = (video.getAttribute && video.getAttribute('href')) || (video.closest && (video.closest('a')?.getAttribute('href')) || '');
      const idMatch = (href || '').match(/\/videos\/(\d+)/);
      const videoId = idMatch ? idMatch[1] : null;
      const bar = video.querySelector('.video__progress-bar');
      const title = video.querySelector('.video__title')?.textContent?.trim();
      const pctStr = bar?.style?.width?.replace('%', '') || '';
      const pct = parseFloat(pctStr, 10);

      if (videoId && title && !Number.isNaN(pct) && pct >= MIN_PCT) return { videoId, title };
      return null;
    })
    .filter(Boolean);
}



function getSimilarShows(currentShow, allShows) {
  if (!currentShow.tags || !currentShow.tags.length) return [];

  const tagSet = new Set(currentShow.tags.map(t => t.toLowerCase()));

  return allShows
    .filter(s => s !== currentShow)
    .map(s => {
      const overlap = (s.tags || []).filter(t =>
        tagSet.has(t.toLowerCase())
      ).length;
      return { show: s, score: overlap };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.show);
}

/**
 * Build hero banner item from user's history: first video in history -> episode -> show -> similar show (by tags).
 * Returns array of one hero item for renderHero, or null if not possible.
 */
function getHeroFromHistory() {
  const history = typeof FW_HISTORY !== 'undefined' ? FW_HISTORY : [];
  const videos = window.__ALL_VIDEOS__ || [];
  const shows = window.__ALL_SHOWS__ || [];
  if (!history.length || !videos.length || !shows.length) return null;

  const first = history[0];
  const id = first.id || '';
  const url = first.url || '';
  const postIdMatch = id.match(/^fw:(\d+)$/) || url.match(/\/videos\/(\d+)/);
  const postId = postIdMatch ? postIdMatch[1] : null;
  if (!postId) return null;

  const episode = videos.find(v => {
    if (!v.url) return false;
    const m = v.url.match(/\/videos\/(\d+)/);
    return m && m[1] === postId;
  });
  if (!episode || !episode.show) return null;

  const historyShow = shows.find(s => s.title === episode.show);
  if (!historyShow) return null;

  const similarShows = getSimilarShows(historyShow, shows);
  const targetShow = similarShows.length > 0 ? similarShows[0] : historyShow;

  const episodesForShow = videos.filter(v => v.show === targetShow.title);
  const firstEpisode = episodesForShow.length > 0
    ? episodesForShow.sort((a, b) => (a.seasonNumber ?? a.season ?? 1) - (b.seasonNumber ?? b.season ?? 1) || (a.episodeNumber ?? a.episode ?? 0) - (b.episodeNumber ?? b.episode ?? 0))[0]
    : null;
  if (!firstEpisode || !firstEpisode.url) return null;

  const bgUrl = targetShow.banner || targetShow.thumbnail || '';
  if (!bgUrl) return null;

  return [{
    bgUrl,
    heroTitle: targetShow.title,
    heroDesc: targetShow.description || '',
    heroShowHasLogo: !!targetShow.showHasLogo,
    heroLogoUrl: targetShow.showLogoUrl || '',
    pillText: targetShow.presents || '',
    heroOrder: 0,
    url: firstEpisode.url,
    show: targetShow.title,
    heroHasVideo: !!targetShow.showModalHasVideo && !!targetShow.showModalVideoURL,
    heroVideoURL: targetShow.showModalVideoURL || ''
  }];
}

function showCard(s) {
  const div = document.createElement('div');
  div.className = 'card show-card';

  const lockTag = (!s.isFree && !IS_PAID_MEMBER) ? LOCK_ICON_HTML : '';
  const freeTag = s.isFree ? '<div class="free-tag">Free</div>' : '';

  div.innerHTML = `
    <div class="show-thumb-wrap">
      ${freeTag}
      ${lockTag}
      <img
        class="thumb lazy-img"
        src="${PLACEHOLDER_IMG}"
        data-src="${getResizedUrl(s.thumbnail, 600)}"
        alt="${s.title}"
      />

      <div class="hover-preview">
        <video
          class="hover-video"
          playsinline
          muted
          disablepictureinpicture="true"
          preload="metadata"
          data-src="${s.showModalHasVideo ? s.showModalVideoURL : ''}">
        </video>

        <button class="hover-mute-btn video-mute-btn2">
          ${document.getElementById('showVideoMute').innerHTML}
        </button>
<div class="hover-gradient"></div>
        <div class="hover-content">
          <div class="hp-logo-wrap">
            ${(s.showHasLogo && s.showLogoUrl) ? `<img class="hp-logo" src="${s.showLogoUrl}" alt="${(s.title || '').replace(/"/g, '&quot;')}">` : ''}
          </div>
          <div class="hp-tags">
            ${(s.tags || []).slice(0, 3).map(t => `<span>${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
div.addEventListener('click', (e) => {

  if (e.target.closest('.hover-mute-btn')) return;

  openShowModal(s);

  const url = new URL(window.location);
  url.searchParams.set('show', slug(s.title));
  window.history.pushState({}, "", url);
});
        
  /* ---------- HOVER VIDEO ---------- */
  const hover = div.querySelector('.hover-preview');
  const video = div.querySelector('.hover-video');
  const muteBtn = div.querySelector('.hover-mute-btn');

  let loaded = false;

div.addEventListener('mouseenter', async () => {
  div.classList.add('is-hovered');

  if (!video || !video.dataset.src) return;

  if (!video.src) {
    video.src = video.dataset.src;
    video.load();
  }

  video.muted = userPrefersMuted;
  video.loop = true;
  syncMuteIcon(muteBtn, userPrefersMuted);
  await video.play().catch(() => {});
  video.style.opacity = 1;
});

div.addEventListener('mouseleave', () => {
  div.classList.remove('is-hovered');

  if (!video) return;

  video.pause();
  video.removeAttribute('src'); // prevents frozen frame
  video.load();
  video.style.opacity = 0;
});

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    userPrefersMuted = video.muted;

        const on = muteBtn.querySelector('.icon-on');
    const off = muteBtn.querySelector('.icon-off');

    muteBtn.querySelector('.icon-on').style.display = video.muted ? 'none' : 'block';
    muteBtn.querySelector('.icon-off').style.display = video.muted ? 'block' : 'none';
    


    if (userPrefersMuted) {
      on.style.display = 'none';
      off.style.display = 'block';
    } else {
      on.style.display = 'block';
      off.style.display = 'none';
    }
  });

  
div.onclick = () => openShowModal(s);
muteBtn.style.pointerEvents = 'auto';
  return div;
}



        const showModal=document.getElementById('showModal');
        document.getElementById('closeShow').onclick=()=> closeShow();
        showModal.addEventListener('click',e=>{ if(e.target===showModal) closeShow(); });
function closeShow(){
  const spacer = document.getElementById('showMobileSpacer');
if (spacer) spacer.style.height = '0px';
  // hide modal
  showModal.classList.remove('open');
  showModal.style.display = 'none';


  // clear URL param
  const url = new URL(window.location);
  
  url.searchParams.delete("show");
  window.history.pushState({}, "", url);


  document.body.classList.remove('no-scroll');

  // === HARD STOP SHOW BANNER VIDEO ===
  if (showBannerVideoTimeout) {
    clearTimeout(showBannerVideoTimeout);
    showBannerVideoTimeout = null;
  }

  const bannerVideo = document.getElementById('showBannerVideo');
  if (bannerVideo) {
    bannerVideo.pause();
    bannerVideo.src = '';
    bannerVideo.load();
    bannerVideo.style.opacity = 0;
  }

  const muteBtn = document.getElementById('showVideoMute');
  if (muteBtn) muteBtn.style.display = 'none';

  syncHeroVideoToModals();
}

function syncHeroVideoToModals() {
  const showModalEl = document.getElementById('showModal');
  const playerModalEl = document.getElementById('playerModal');
  const anyOpen = (showModalEl && showModalEl.classList.contains('open')) || (playerModalEl && playerModalEl.classList.contains('open'));
  const heroVideos = document.querySelectorAll('#hero .hero-slide video');
  const shouldPause = anyOpen || !heroIsInView;
  if (shouldPause) {
    heroVideos.forEach(v => v.pause());
  } else {
    const activeSlide = document.querySelector('#hero .hero-slide.active');
    const activeVid = activeSlide ? activeSlide.querySelector('video') : null;
    const activeMuteBtn = activeSlide ? activeSlide.querySelector('.video-mute-btn') : null;
    heroVideos.forEach(v => {
      if (v === activeVid && activeVid) {
        activeVid.muted = userPrefersMuted;
        activeVid.play().catch(() => {});
      } else v.pause();
    });
    if (activeMuteBtn) syncMuteIcon(activeMuteBtn, userPrefersMuted);
  }
}

function setupHeroVisibilityObserver() {
  const heroEl = document.getElementById('hero');
  if (!heroEl) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      if (!e) return;
      heroIsInView = e.isIntersecting;
      syncHeroVideoToModals();
    },
    { threshold: 0, rootMargin: '0px' }
  );
  observer.observe(heroEl);
}
setupHeroVisibilityObserver();

        function getEpisodesForShow(title){ return (window.__ALL_VIDEOS__||[]).filter(v=> v.show===title); }
        function getEpisodeProgress(video) {
  if (!FW_HISTORY || !video.__id) return 0;
  const match = FW_HISTORY.find(h => h.id === video.__id);
  return match ? Math.max(0, Math.min(100, match.progressPct || 0)) : 0;
}

        /** Progress bar is shown in the episode list when progress > 0. At >= 98% we treat as "next episode", below that we resume same episode. */
        const UP_NEXT_THRESHOLD = 98;
        /** Returns { video, hasProgress }. hasProgress only true when at least one episode has a progress bar (progress > 0). */
        function getUpNextForShow(showTitle) {
          const episodes = getEpisodesForShow(showTitle);
          if (!episodes.length) return { video: null, hasProgress: false };
          const sorted = [...episodes].sort((a, b) => {
            const sA = Number(a.seasonNumber ?? a.season ?? 1);
            const sB = Number(b.seasonNumber ?? b.season ?? 1);
            if (sA !== sB) return sA - sB;
            const eA = Number(a.episodeNumber ?? a.episode ?? 0);
            const eB = Number(b.episodeNumber ?? b.episode ?? 0);
            return eA - eB;
          });

          const hasProgress = sorted.some(v => getEpisodeProgress(v) > 0);
          if (!hasProgress) return { video: sorted[0], hasProgress: false };

          const toResume = sorted.find(v => {
            const p = getEpisodeProgress(v);
            return p > 0 && p < UP_NEXT_THRESHOLD;
          });
          if (toResume) return { video: toResume, hasProgress: true };

          let lastNearlyDoneIdx = -1;
          sorted.forEach((v, idx) => {
            if (getEpisodeProgress(v) >= UP_NEXT_THRESHOLD) lastNearlyDoneIdx = idx;
          });
          const nextIdx = lastNearlyDoneIdx + 1;
          if (nextIdx < sorted.length) return { video: sorted[nextIdx], hasProgress: true };

          return { video: sorted[0], hasProgress: true };
        }

const searchInput = document.getElementById('searchInput');
const searchInputMobile = document.getElementById('searchInputMobile');
const searchClear = document.getElementById('searchClear');
const searchClearMobile = document.getElementById('searchClearMobile');
const searchResults = document.getElementById('searchResults');
const searchRail = document.getElementById('searchRail');
const searchTitle = document.getElementById('searchTitle');

function runSearch(q) {
  q = (q || '').trim().toLowerCase();
  const wrap = searchInput?.closest('.search-wrap-desktop') || searchInputMobile?.closest('.search-wrap-mobile');
  if (wrap) wrap.classList.toggle('has-value', !!q);

  searchRail.innerHTML = '';

  if (!q) {
    searchTitle.textContent = '';
    searchResults.classList.add('hidden');
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('hidden'));
    return;
  }

  searchResults.classList.remove('hidden');
  document.querySelectorAll('.section').forEach(sec => {
    if (sec.id !== 'searchResults') sec.classList.add('hidden');
  });

  const matchedShows = new Map();
  (window.__ALL_VIDEOS__ || []).forEach(v => {
    const haystack = [v.title, v.description, ...(v.tags || []), v.show].join(' ').toLowerCase();
    if (haystack.includes(q)) matchedShows.set(v.show, v.show);
  });
  (window.__ALL_SHOWS__ || []).forEach(s => {
    const haystack = [s.title, s.description, ...(s.tags || []), s.category].filter(Boolean).join(' ').toLowerCase();
    if (haystack.includes(q)) matchedShows.set(s.title, s.title);
  });

  if (!matchedShows.size) {
    searchTitle.textContent = 'No results found';
    return;
  }
  searchTitle.textContent = `Results for "${q}"`;
  matchedShows.forEach(showTitle => {
    const showObj = (window.__ALL_SHOWS__ || []).find(s => s.title === showTitle);
    if (showObj) searchRail.appendChild(showCard(showObj));
  });
  revealLoadedImages(searchRail);
}

if (searchClear && searchInput) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    if (searchInputMobile) searchInputMobile.value = '';
    runSearch('');
    searchInput.focus();
  });
}
if (searchClearMobile && searchInputMobile) {
  searchClearMobile.addEventListener('click', () => {
    searchInputMobile.value = '';
    if (searchInput) searchInput.value = '';
    runSearch('');
    searchInputMobile.focus();
  });
}

[searchInput, searchInputMobile].filter(Boolean).forEach(input => {
  input.addEventListener('input', () => runSearch(input.value));
});

const searchWrapDesktop = document.getElementById('searchWrap');
const searchWrapMobileEl = document.getElementById('searchWrapMobile');
const mobileSearchBtn = document.getElementById('mobileSearchToggle');
const searchToggleBtns = document.querySelectorAll('.search-toggle-btn');

if (searchToggleBtns.length) {
  searchToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const bar = isMobile ? searchWrapMobileEl : searchWrapDesktop;
      if (bar) bar.classList.toggle('mobile-active');
      if (mobileSearchBtn && isMobile) mobileSearchBtn.style.display = 'none';
      const focusInput = isMobile ? searchInputMobile : searchInput;
      if (focusInput) focusInput.focus();
    });
  });

  document.addEventListener('click', (e) => {
    if (searchToggleBtns.length && !Array.from(searchToggleBtns).some(b => b.contains(e.target))) {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const bar = isMobile ? searchWrapMobileEl : searchWrapDesktop;
      if (bar && !bar.contains(e.target)) {
        bar.classList.remove('mobile-active');
        if (mobileSearchBtn && isMobile) mobileSearchBtn.style.display = 'flex';
      }
    }
  });
}


        function renderEpisodesList(epsEl, list){
          epsEl.innerHTML='';
          list.forEach((v,idx)=>{
            const el=document.createElement('div'); el.className='ep'; 
            const label=getEpisodeLabel(v);
            const freeTag = v.isFree ? `<div class="free-tag">Free</div>` : '';
const lockTag = (!v.isFree && !IS_PAID_MEMBER) ? LOCK_ICON_HTML : '';
const progress = getEpisodeProgress(v);

            el.innerHTML = `
                <div class="ep-thumb-wrap">
                    ${freeTag}
                        ${lockTag}
                    <img class="lazy-img" src="${getResizedUrl(v.thumbnail, 600)}" data-src="${getResizedUrl(v.thumbnail, 600)}" alt='${v.title}'/>
                    ${progress > 0 ? `
      <div class="progress-bar" style="position: unset;">
        <span style="width:${progress}%"></span>
      </div>
    ` : ''}
                </div>
                <div>
                    <div class='n'>${label||''}</div>
                    <div class='t'>${v.title}</div>
                    <div class='d'>${v.description||''}</div>
                </div>`;
el.onclick=()=> openPlayer(v); epsEl.appendChild(el);
          });
        }

        function openShowModal(show){
          try{
            const banner=document.getElementById('showBanner');
            const presents=document.getElementById('showPresents');
            const title=document.getElementById('showTitle');
            const logo=document.getElementById('showLogo');
            const tagsWrap=document.getElementById('showTags');
            const desc=document.getElementById('showDesc');
            const epsEl=document.getElementById('episodes');
            const recWrap = document.getElementById('showRecommendations');
const recList = recWrap.querySelector('.show-recs-list');

recList.innerHTML = '';

const similar = getSimilarShows(show, window.__ALL_SHOWS__);

if (similar.length) {
  recWrap.style.display = 'block';

  similar.forEach(s => {
const firstEp = (window.__ALL_VIDEOS__ || []).find(e => e.show === s.title);
    if (!firstEp) return;

    const card = document.createElement('div');
    card.className = 'show-rec-card';
    card.innerHTML = `
      <img src="${getResizedUrl(s.thumbnail, 500)}" alt="${s.title}">
      <div class="name">${s.title}</div>
    `;

    card.onclick = () => {
      closeShow();
      openPlayer(firstEp);
    };

    recList.appendChild(card);
  });
} else {
  recWrap.style.display = 'none';
}

            banner.classList.remove('loaded');
            banner.style.backgroundImage = `url(${PLACEHOLDER_IMG})`;
            const bannerUrl = show.banner || show.thumbnail || '';
            banner.setAttribute('data-bg', getResizedUrl(bannerUrl, 1400));
            const bannerVideo = document.getElementById('showBannerVideo');
const muteBtn = document.getElementById('showVideoMute');

// reset any previous video state
if (bannerVideo) {
  bannerVideo.pause();
  bannerVideo.src = '';
  bannerVideo.style.opacity = 0;
}
if (muteBtn) muteBtn.style.display = 'none';

if (show.showModalHasVideo && show.showModalVideoURL) {
  showBannerVideoTimeout = setTimeout(() => {
    loadAndPlayBannerVideo(bannerVideo, show.showModalVideoURL);
    if (muteBtn) {
      muteBtn.style.display = 'block';
      syncMuteIcon(muteBtn, userPrefersMuted);
    }
  }, 350);
}

            presents.textContent = show.presents||''; presents.style.display = show.presents? 'inline-block':'none';
            
            // Logic for Show Logo vs Title
            if (show.showHasLogo && show.showLogoUrl) {
              title.textContent = show.title||'';
                logo.src = show.showLogoUrl;
                logo.style.display = 'block';
                title.style.visibility = 'collapse';
                title.style.display = 'none';
                
            } else {
                logo.style.display = 'none';
                title.style.display = 'block';
                title.style.visibility = 'visible';
                title.textContent = show.title||'';
            }

            tagsWrap.innerHTML = (show.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join('');
            renderDescription(desc, show.description||'', show.creatorLinks);
// === Start / Continue Watching button (in banner only) ===
const bannerActions = document.getElementById('showBannerActions');
if (bannerActions) bannerActions.innerHTML = '';
const btn = document.createElement('button');
btn.className = 'start-watching-btn';

const upNext = getUpNextForShow(show.title);
const startTarget = upNext.video;

if (upNext.hasProgress) {
  btn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    Continue Watching
  `;
} else {
  btn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    Start Watching
  `;
}

btn.addEventListener('mousedown', (e) => addRippleEffect(btn, e));
btn.addEventListener('touchstart', (e) => addRippleEffect(btn, e));
btn.addEventListener('click', () => {
  if (!startTarget) return;
  setTimeout(() => openPlayer(startTarget), 140);
});

if (bannerActions) bannerActions.appendChild(btn);


            const all = getEpisodesForShow(show.title);
            const seasons = new Map();
            all.forEach((v,idx)=>{ const s = Number(v.seasonNumber ?? v.season ?? 1); if(!seasons.has(s)) seasons.set(s, []); seasons.get(s).push({v, idx}); });
            
            const seasonControls = document.getElementById('seasonControls');
            const seasonContainer = document.getElementById('customSeasonSelect');
            seasonContainer.innerHTML = '';

            const keys = [...seasons.keys()].sort((a, b) => a - b);

            const renderSeason = (seasonNum) => {
                const list = (seasons.get(Number(seasonNum)) || []).map(x => x.v);
                renderEpisodesList(epsEl, list);
                revealLoadedImages(epsEl);
            };

            if (keys.length <= 1) {
                seasonControls.style.display = 'none';
                const seasonNum = keys[0] || 1;
                renderSeason(seasonNum);
            } else {
                seasonControls.style.display = 'flex';
                const selectedEl = document.createElement('div');
                selectedEl.className = 'select-selected';
                const itemsEl = document.createElement('div');
                itemsEl.className = 'select-items select-hide';
                seasonContainer.appendChild(selectedEl);
                seasonContainer.appendChild(itemsEl);
                const closeDropdown = () => {
                    itemsEl.classList.add('select-hide');
                    selectedEl.classList.remove('select-arrow-active');
                };
                const updateSelection = (seasonKey) => {
                    selectedEl.textContent = `Season ${seasonKey}`;
                    itemsEl.innerHTML = '';
                    keys.forEach(k => {
                        const optionEl = document.createElement('div');
                        optionEl.textContent = `Season ${k}`;
                        if (k === seasonKey) {
                            optionEl.classList.add('same-as-selected');
                        }
                        optionEl.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (k === seasonKey) { closeDropdown(); return; }
                            updateSelection(k);
                            renderSeason(k);
                            closeDropdown();
                        });
                        itemsEl.appendChild(optionEl);
                    });
                };
                selectedEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeAllSelects(e.target);
                    itemsEl.classList.toggle('select-hide');
                    e.target.classList.toggle('select-arrow-active');
                });
                const defaultSeason = keys[0];
                updateSelection(defaultSeason);
                renderSeason(defaultSeason);
            }
            showModal.classList.add('open'); 
            document.body.classList.add('no-scroll');
            showModal.style.display = 'flex';
            syncHeroVideoToModals();
            setTimeout(adjustShowMobileSpacing, 0);
window.addEventListener('resize', adjustShowMobileSpacing);
            revealLoadedImages(showModal);
          }catch(err){ console.error('openShowModal failed:', err); document.getElementById('episodes').innerHTML = '<div style="opacity:.7">Unable to load episodes.</div>'; showModal.classList.add('open'); document.body.classList.add('no-scroll'); syncHeroVideoToModals(); }
        }

        function renderHero(items, fromHistory){
          const hero=document.getElementById('hero');
          const singleFromHistory = fromHistory && items.length === 1;

          if (singleFromHistory) {
            hero.innerHTML = '';
          } else {
            hero.innerHTML = `<button class="nav prev" aria-label="Previous">❮</button><div id="hero-dots"></div><button class="nav next" aria-label="Next">❯</button>`;
          }
          const dotsWrap = singleFromHistory ? null : document.getElementById('hero-dots');
          // Sort items by heroOrder
          items.sort((a, b) => (a.heroOrder || 0) - (b.heroOrder || 0));

         items.forEach((v, i) => {
  const s = document.createElement('div');
  s.className = 'hero-slide' + (i === 0 ? ' active' : '');
  const bgUrlResized = getResizedUrl(v.bgUrl, 1400);

  // --- Hero title / logo (DECLARE ONCE) ---
  let titleContent = `<div class="title">${v.heroTitle}</div>`;
  if (v.heroShowHasLogo && v.heroLogoUrl) {
    titleContent = `<img src="${v.heroLogoUrl}" class="hero-logo" alt="${v.heroTitle}"> <div class="title" style="display: none;">${v.heroTitle}</div>`;
  }
s.__episodeRef = v;

  // --- Set innerHTML ONCE (hero-content stays in original slide box) ---
  s.innerHTML = `
    <div class="hero-content">
      ${titleContent}
      <div class="desc" style="display: none;">${v.heroDesc || ''}</div>
      <div class="hero-actions">
  <button class="cta">
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
    </svg>
    Play
  </button>

  <button class="hero-info-btn">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <path d="M64 6C32 6 6 32 6 64s26 58 58 58 58-26 58-58S96 6 64 6zm0 6c28.7 0 52 23.3 52 52s-23.3 52-52 52S12 92.7 12 64 35.3 12 64 12zm0 26c-1.7 0-3 1.3-3 3v5c0 1.7 1.3 3 3 3s3-1.3 3-3v-5c0-1.7-1.3-3-3-3zm0 20c-1.7 0-3 1.3-3 3v26c0 1.7 1.3 3 3 3s3-1.3 3-3V61c0-1.7-1.3-3-3-3z"/>
    </svg>
    More info
  </button>
</div>
    </div>
  `;

  // --- Background on separate layer so it can extend behind rail; content stays in original position ---
  const bgLayer = document.createElement('div');
  bgLayer.className = 'hero-slide-bg';
  bgLayer.style.backgroundImage = `url(${PLACEHOLDER_IMG})`;
  bgLayer.setAttribute('data-bg', bgUrlResized);
  s.insertBefore(bgLayer, s.firstChild);

  if (singleFromHistory) {
    const img = new Image();
    img.onload = () => {
      bgLayer.style.backgroundImage = `url(${bgUrlResized})`;
      bgLayer.classList.add('loaded');
    };
    img.src = bgUrlResized;
  }

  // --- CTA click ---
s.querySelector('.cta').onclick = (e) => {
  e.stopPropagation();

  const ep = s.__episodeRef;
  if (!ep || !ep.url) {
    console.warn('Hero CTA: episode URL missing');
    return;
  }

  openPlayer(ep);
};
const infoBtn = s.querySelector('.hero-info-btn');

infoBtn.onclick = (e) => {
  e.stopPropagation();

  const ep = s.__episodeRef;
  if (!ep || !ep.show) return;

  const showObj = (window.__ALL_SHOWS__ || []).find(
    s => s.title === ep.show
  );

  if (showObj) {
    openShowModal(showObj);

    const url = new URL(window.location);
    url.searchParams.set('show', slug(showObj.title));
    window.history.pushState({}, "", url);
  }
};



  // --- HERO VIDEO SUPPORT (append AFTER innerHTML) ---
  if (v.heroHasVideo && v.heroVideoURL) {
    const heroVideo = document.createElement('video');
    heroVideo.className = 'bg-video';
    heroVideo.playsInline = true;
    heroVideo.preload = 'none';
    heroVideo.dataset.src = v.heroVideoURL;

    s.appendChild(heroVideo);

    const heroMuteBtn = document.createElement('button');
    heroMuteBtn.className = 'video-mute-btn';
    heroMuteBtn.innerHTML = document.getElementById('showVideoMute').innerHTML;
    heroMuteBtn.style.display = 'none';

heroMuteBtn.onclick = (e) => {
  e.stopPropagation();

  heroVideo.muted = !heroVideo.muted;
  userPrefersMuted = heroVideo.muted;
  const iconOn = heroMuteBtn.querySelector('.icon-on');
  const iconOff = heroMuteBtn.querySelector('.icon-off');

  if (heroVideo.muted) {
    if (iconOn) iconOn.style.display = 'none';
    if (iconOff) iconOff.style.display = 'block';
  } else {
    if (iconOn) iconOn.style.display = 'block';
    if (iconOff) iconOff.style.display = 'none';
  }
};


    s.appendChild(heroMuteBtn);
  }

  hero.appendChild(s);

  if (dotsWrap) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.dataset.index = i;
    dotsWrap.appendChild(d);
  }
});
          let idx=0;
          const slides=()=>Array.from(document.querySelectorAll('#hero .hero-slide')); const dots=()=>Array.from(document.querySelectorAll('#hero .dot'));
          function show(i){
  idx = (i + items.length) % items.length;

  slides().forEach((el, j) => {
    const isActive = j === idx;
    el.classList.toggle('active', isActive);
    const vid = el.querySelector('video');
    const muteBtn = el.querySelector('.video-mute-btn');

    if (vid) {



       vid.muted = userPrefersMuted;

  if (muteBtn) {
    const on = muteBtn.querySelector('.icon-on');
    const off = muteBtn.querySelector('.icon-off');

    if (userPrefersMuted) {
      on.style.display = 'none';
      off.style.display = 'block';
    } else {
      on.style.display = 'block';
      off.style.display = 'none';
    }

    muteBtn.style.display = 'block';
  }



      if (isActive) {
if (!vid.src) {
  loadAndPlayBannerVideo(vid, vid.dataset.src);
} else {
  vid.style.opacity = 1;
  vid.play().catch(()=>{});
}
        if (muteBtn) muteBtn.style.display = 'block';
      } else {
        vid.pause();
        vid.currentTime = 0;
        vid.style.opacity = 0;
        if (muteBtn) muteBtn.style.display = 'none';
      }
    }
  });

  if (!singleFromHistory) dots().forEach((el,j)=>el.classList.toggle('active',j===idx));
}

          if (!singleFromHistory) {
            setTimeout(() => show(0), 1200);
            let startX = 0;
            let endX = 0;
            hero.addEventListener('touchstart', e => {
    if (e.target.closest('.cta, .hero-info-btn, .video-mute-btn, .modal-close, .playlist-toggle')) {
    startX = null;
    return;
  }
  startX = e.touches[0].clientX;
}, { passive: true });

hero.addEventListener('touchmove', e => {
  if (startX === null) return;
  endX = e.touches[0].clientX;
}, { passive: true });

hero.addEventListener('touchend', () => {
  if (startX === null || endX === null) {
    startX = endX = null;
    return;
  }

  const delta = endX - startX;

  if (Math.abs(delta) > 60) {
    if (delta < 0) {
      show(idx + 1);
    } else {
      show(idx - 1);
    }
  }

  startX = endX = null;
});
            document.querySelector('#hero .nav.prev').onclick=()=>show(idx-1); document.querySelector('#hero .nav.next').onclick=()=>show(idx+1); dotsWrap.addEventListener('click',e=>{ if(e.target.classList.contains('dot')) show(+e.target.dataset.index); });
          } else {
            show(0);
          }
        }

        function attachCarouselIfOverflow(sectionEl){
          const rail = sectionEl.querySelector('.rail'); if(!rail) return; if(rail.parentElement && rail.parentElement.classList.contains('carousel')) return;
          requestAnimationFrame(()=>{
            if(rail.scrollWidth <= rail.clientWidth + 1) return;
            const wrapper = document.createElement('div'); wrapper.className='carousel'; rail.parentNode.insertBefore(wrapper, rail); wrapper.appendChild(rail);
            const left = document.createElement('button'); left.className='caro-btn left'; left.innerHTML='❮';
            const right= document.createElement('button'); right.className='caro-btn right'; right.innerHTML='❯';
            const fadeL= document.createElement('div'); fadeL.className='fade left'; const fadeR= document.createElement('div'); fadeR.className='fade right';
            wrapper.appendChild(left); wrapper.appendChild(right); wrapper.appendChild(fadeL); wrapper.appendChild(fadeR);
            const step = rail.firstElementChild?.getBoundingClientRect().width || 280; left.onclick = ()=> rail.scrollBy({ left: -step, behavior:'smooth' }); right.onclick= ()=> rail.scrollBy({ left:  step, behavior:'smooth' });
          });
        }

        function ensureCategorySection(name){ const wrap=document.getElementById('category-sections'); let sec=document.querySelector(`[data-cat="${CSS.escape(name)}"]`); if(sec) return sec.querySelector('.rail'); sec=document.createElement('section'); sec.className='section'; sec.dataset.cat=name; sec.innerHTML=`<div class="row-head"><h2 class="row-title">${name}</h2></div><div class="rail"></div>`; wrap.appendChild(sec); return sec.querySelector('.rail'); }

        const getCleared = () => { try{return new Set(JSON.parse(localStorage.getItem(CLEARED_KEY)||'[]'))}catch{return new Set()} };
        const putCleared = (set) => { try{localStorage.setItem(CLEARED_KEY, JSON.stringify(Array.from(set)))}catch{} };
        
        function updateNav(isLoggedIn) {
          setupMobileNav(isLoggedIn);
function setupMobileNav(isLoggedIn) {
  const nav = document.getElementById('mobileBottomNav');
  const rewards = document.getElementById('mobileRewardsBtn');
  const accountBtn = document.getElementById('mobileAccountBtn');
  const pfpWrap = accountBtn.querySelector('.pfp-wrap');
let IS_PAID_MEMBER = false;

fetch('https://bysurf.tv/supporters/perks', { credentials: 'include' })
  .then(res => {
    if (res.redirected) return false;
    return res.text();
  })
  .then(html => {
    IS_PAID_MEMBER = html && html.includes('Your perks');
  })
  .catch(() => {
    IS_PAID_MEMBER = false;
  });

  nav.addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;

    // Remove highlight from all
    nav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const action = btn.dataset.action;
    btn.classList.add('active'); // accent color highlight

    switch (action) {
      case 'home':
        window.location.href = isLoggedIn
          ? 'https://bysurf.tv/videos'
          : 'https://bysurf.tv/join';
        break;

      case 'blog':
        window.location.href = 'https://studiobysurf.com/blog';
        break;

      case 'rewards':
        window.location.href = 'https://bysurf.tv/rewards';
        break;

      case 'account':
        window.location.href = isLoggedIn
          ? 'https://bysurf.tv/supporters/users/supporters/profile/edit'
          : 'https://bysurf.tv/supporters/sign_in';
        break;
    }
  });

  // Logged-in visual logic
  if (isLoggedIn) {

    // show rewards icon
    rewards.classList.remove('hidden');

    // fetch user avatar
    fetch('https://bysurf.tv/supporters/users/supporters/profile/edit', {
      credentials: 'include'
    })
      .then(res => res.text())
.then(html => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const img = doc.querySelector('img[data-testid="Avatar.Image"], img.avatar[src]');
  pfpWrap.innerHTML = '';

  const defaultAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>`;
  const navPfp = document.getElementById('nav-profile-wrap');
  if (img && img.src) {
    const avatar = document.createElement('img');
    avatar.src = img.src;
    avatar.alt = '';
    pfpWrap.innerHTML = '';
    pfpWrap.appendChild(avatar);
    if (navPfp) {
      navPfp.innerHTML = '';
      const navImg = document.createElement('img');
      navImg.src = img.src;
      navImg.alt = '';
      navPfp.appendChild(navImg);
    }
  } else {
    pfpWrap.innerHTML = defaultAvatarSvg;
    if (navPfp) navPfp.innerHTML = defaultAvatarSvg;
  }
})


  } else {
    // hide rewards
    rewards.classList.add('hidden');

    // show login icon only
    pfpWrap.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
  <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>
    `;
  }
}

        
            const loginBtn = document.getElementById('login-button');
            const joinBtn = document.getElementById('join-button');
            const navProfileWrap = document.getElementById('nav-profile-wrap');
            const navUpgradeBtn = document.getElementById('nav-upgrade-btn');
            const notificationLink = document.getElementById('your-notifications');

            if (isLoggedIn) {
                loginBtn.classList.add('hidden');
                joinBtn.classList.add('hidden');
                if (navProfileWrap) navProfileWrap.classList.remove('hidden');
                notificationLink.classList.remove('hidden');
                if (navUpgradeBtn) {
                    if (IS_PAID_MEMBER) {
                        navUpgradeBtn.classList.add('hidden');
                    } else {
                        navUpgradeBtn.classList.remove('hidden');
                    }
                }
            } else {
                loginBtn.classList.remove('hidden');
                joinBtn.classList.remove('hidden');
                if (navProfileWrap) navProfileWrap.classList.add('hidden');
                if (navUpgradeBtn) navUpgradeBtn.classList.add('hidden');
                notificationLink.classList.add('hidden');
            }
        }

        async function fetchFourthwallHistory(){
          try{
            const res = await fetch('/supporters/history', { credentials:'include' });
             if (!res.ok || res.redirected) {
                return { history: [], isLoggedIn: false };
            }
            const html = await res.text();
            const isLoggedIn = html.includes('history_posts_list');
            if (!isLoggedIn) return { history: [], isLoggedIn: false };

            const doc = new DOMParser().parseFromString(html, 'text/html');
            const container = doc.querySelector('#history_posts_list');
            if(!container) {
                return { history: [], isLoggedIn: true };
            }
            const items = [];
            container.querySelectorAll('a.video').forEach(a=>{
              const href = a.getAttribute('href')||'';
              const idMatch = href.match(/\/videos\/(\d+)/);
              const id = idMatch ? `fw:${idMatch[1]}` : `fw:${href}`;
              const title = a.querySelector('.video__title')?.textContent?.trim()||'Episode';
              const thumb = a.querySelector('.video__image')?.getAttribute('src')||'';
              const bar = a.querySelector('.video__progress-bar');
              let pct = 0; if(bar){ const w = bar.style.width||''; const m=w.match(/([\d.]+)%/); if(m) pct = Math.max(0, Math.min(100, parseFloat(m[1]))); }
              items.push({ id, title, thumbnail: thumb, url: href, show: '', progressPct: pct });
            });
            
            const clearedIds = getCleared();
const completed = items.filter(item => item.progressPct >= 100);
completed.forEach(item => clearedIds.add(item.id));
putCleared(clearedIds);
const finalItems = items.filter(
  item => item.progressPct < 100 && !clearedIds.has(item.id)
);

return { history: finalItems, isLoggedIn: true };

          }catch(err){ 
            dbg('FW history fetch failed, assuming logged out.', err); 
            return { history: [], isLoggedIn: false }; 
          }
        }

        function loadCW(){
          const rail=document.getElementById('cw-rail'); const sec=document.getElementById('cw-section');
          rail.innerHTML='';
          if (!FW_HISTORY || FW_HISTORY.length === 0) {
            sec.style.display = 'none';
            return;
          }
          sec.style.display = 'block';
          FW_HISTORY.forEach(item => {
            const v = window.__ALL_VIDEOS__.find(vid => vid.__id === item.id) || { __id: item.id, title: item.title, thumbnail: item.thumbnail, url: item.url, show: item.show };
            const options = { resumeSec: 0, progressPct: item.progressPct };
            rail.appendChild(cwCard(v, options));
          });
          attachCarouselIfOverflow(sec);
        }


        function renderNewRail(videos){ const newRail=document.getElementById('new-rail'); newRail.innerHTML=''; const pick = videos.slice(-5).reverse(); pick.forEach(v=> newRail.appendChild(videoCard(v))); attachCarouselIfOverflow(newRail.closest('.section')); }

        function renderRecommendedRail(videos) {
            const recRail = document.getElementById('recommended-rail');
            const recSection = document.getElementById('recommended-section');
            const recommendedVideos = videos.filter(v => v.isRecommended);

            if (recommendedVideos.length > 0) {
                recSection.style.display = 'block';
                recRail.innerHTML = '';
                recommendedVideos.forEach(v => recRail.appendChild(videoCard(v)));
                attachCarouselIfOverflow(recSection);
            } else {
                recSection.style.display = 'none';
            }
        }

        const loadedImageUrls = new Set();

        function preloadImages(urls) {
            const promises = urls.map(url => {
                if (!url || loadedImageUrls.has(url)) {
                    return Promise.resolve();
                }
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        loadedImageUrls.add(url);
                        resolve();
                    };
                    img.onerror = resolve; 
                    img.src = url;
                });
            });
            return Promise.all(promises);
        }

        function revealLoadedImages(container = document) {
            container.querySelectorAll('.lazy-img:not(.loaded)').forEach(img => {
                const realSrc = img.dataset.src;
                if (realSrc && loadedImageUrls.has(realSrc)) {
                    img.src = realSrc;
                    img.classList.add('loaded');
                }
            });
            container.querySelectorAll('[data-bg]:not(.loaded)').forEach(el => {
                const realBg = el.getAttribute('data-bg');
                if (realBg && loadedImageUrls.has(realBg)) {
                    el.style.backgroundImage = `url(${realBg})`;
                    el.classList.add('loaded');
                }
            });
        }
        const BYW_SECTION_ID = 'because-you-watched-section';
        async function buildBecauseYouWatchedRail() {
  try {
    document.getElementById(BYW_SECTION_ID)?.remove();
    const html = await fetchWatchHistoryHTML();
    const watchedItems = parseFullyWatchedEpisodes(html);
    if (!watchedItems.length) return;

    const showTitle = getMostRecentCompletedShow(watchedItems);
    if (!showTitle) return;

    const sourceShow = window.__ALL_SHOWS__.find(s => s.title === showTitle);
    if (!sourceShow) return;

    const recommendations = getSimilarShows(sourceShow, window.__ALL_SHOWS__)
      .slice(0, 5);
    if (recommendations.length < 1) return;

    const section = document.createElement('section');
    section.id = BYW_SECTION_ID;
    section.className = 'section';
    section.innerHTML = `
      <div class="row-head">
        <h2 class="row-title">Because you watched ${sourceShow.title}</h2>
      </div>
      <div class="rail"></div>
    `;

    const rail = section.querySelector('.rail');
    recommendations.forEach(s => rail.appendChild(showCard(s)));

    const newSectionForInsert = document.querySelector('#new-rail')?.closest('.section');
    if (!newSectionForInsert) return;

    newSectionForInsert.after(section);
    attachCarouselIfOverflow(section);
    revealLoadedImages(section);

  } catch (err) {
    console.warn('Because-you-watched skipped:', err);
  }
}

function resolveShowFromEpisodeTitle(epTitle) {
  return (window.__ALL_VIDEOS__ || []).find(v =>
    v.title.toLowerCase() === epTitle.toLowerCase()
  )?.show;
}

function resolveShowFromVideoId(videoId) {
  if (!videoId) return null;
  const id = String(videoId);
  return (window.__ALL_VIDEOS__ || []).find(v =>
    v.__id === 'fw:' + id || (String(v.__id || '').replace('fw:', '') === id)
  )?.show;
}

function isShowCompleted(showTitle, watchedItems) {
  const episodes = (window.__ALL_VIDEOS__ || []).filter(v => v.show === showTitle);
  if (!episodes.length) return false;
  const watchedIdSet = new Set((watchedItems || []).map(w => String(w.videoId || w)));
  const watchedForShow = episodes.filter(ep => {
    const id = String((ep.__id || '').replace('fw:', ''));
    return id && watchedIdSet.has(id);
  });
  if (episodes.length === 1) return watchedForShow.length >= 1;
  return watchedForShow.length >= Math.min(2, episodes.length);
}

function getMostRecentCompletedShow(watchedItems) {
  for (const item of watchedItems || []) {
    const videoId = item.videoId != null ? item.videoId : item;
    const show = resolveShowFromVideoId(videoId);
    if (!show) continue;
    if (isShowCompleted(show, watchedItems)) return show;
  }
  return null;
}

        /* ========= Init ========= */
        (async function(){
          IS_PAID_MEMBER = await isPaidMember();
          const res=await fetch(DATA_URL,{cache:'no-store'}); const db=await res.json();
          window.__ALL_SHOWS__ = db.shows || [];
          const showMap=new Map((db.shows||[]).map(s=>[s.title,s]));
          const videos=(db.videos||[]).map((v,idx)=>{ 
            const s=showMap.get(v.show)||{}; 
            let videoId = v.id || slug(`${v.show||''}-${v.title||''}`);
            if (v.url) {
                const urlMatch = v.url.match(/\/videos\/(\d+)/);
                if (urlMatch && urlMatch[1]) {
                    videoId = `fw:${urlMatch[1]}`;
                }
            }
            return { ...v, __idx:idx, __id: videoId, __banner:s.banner, __thumbnail:s.thumbnail, __presents:s.presents||'', __tags:s.tags||[], __category:s.category||'Uncategorized', showHasLogo: s.showHasLogo, showLogoUrl: s.showLogoUrl }; 
          });
          
          const videosByShow = videos.reduce((acc, video) => {
              if (!acc[video.show]) acc[video.show] = [];
              acc[video.show].push(video);
              return acc;
          }, {});

          for (const showTitle in videosByShow) {
              const episodesForShow = videosByShow[showTitle];
              const episodesBySeason = episodesForShow.reduce((acc, video) => {
                  const seasonNum = video.seasonNumber || video.season || 1;
                  if (!acc[seasonNum]) acc[seasonNum] = [];
                  acc[seasonNum].push(video);
                  return acc;
              }, {});
              
              for (const seasonNum in episodesBySeason) {
                  episodesBySeason[seasonNum].forEach((video, index) => {
                      if (video.episodeNumber == null && video.episode == null) {
                          video.episodeNumber = index + 1;
                      }
                  });
              }
          }
          window.__ALL_VIDEOS__=videos;


          const { history, isLoggedIn } = await fetchFourthwallHistory();
          FW_HISTORY = history;
          updateNav(isLoggedIn);
          loadCW();
          buildBecauseYouWatchedRail();



          function getWatchedEpisodesForShow(showTitle) {
  return FW_HISTORY.filter(
    h => h.show === showTitle && (h.progressPct || 0) >= 90
  );
}
function isShowWatchedEnough(showTitle) {
  const allEpisodes = (window.__ALL_VIDEOS__ || [])
    .filter(v => v.show === showTitle);

  const watched = getWatchedEpisodesForShow(showTitle);

  if (allEpisodes.length <= 1) {
    return watched.length >= 1;
  }

  // Multi-episode logic
  if (watched.length >= allEpisodes.length) return true;
  if (watched.length >= 2) return true;

  return false;
}
function getFirstCompletedShow() {
  for (const h of FW_HISTORY) {
    if ((h.progressPct || 0) >= 90 && h.show) {
      if (isShowWatchedEnough(h.show)) {
        return h.show;
      }
    }
  }
  return null;
}
function getBecauseYouWatchedRecommendations(sourceShowTitle) {
  const sourceShow = window.__ALL_SHOWS__
    .find(s => s.title === sourceShowTitle);

  if (!sourceShow) return [];

  return getSimilarShows(sourceShow, window.__ALL_SHOWS__)
    .filter(s => s.title !== sourceShowTitle)
    .slice(0, 5);
}
function renderBecauseYouWatchedRail() {
  if (!FW_HISTORY || !FW_HISTORY.length) return;

  const showTitle = getFirstCompletedShow();
  if (!showTitle) return;

  const recs = getBecauseYouWatchedRecommendations(showTitle);
  if (recs.length < 2) return;

  const section = document.createElement('section');
  section.className = 'section';

  section.innerHTML = `
    <div class="row-head">
      <h2 class="row-title">Because you watched ${showTitle}</h2>
    </div>
    <div class="rail"></div>
  `;

  const rail = section.querySelector('.rail');
  recs.forEach(s => rail.appendChild(showCard(s)));

  const newSection = document.querySelector('#new-rail')?.closest('.section');
  if (newSection) {
    newSection.after(section);
  }

  attachCarouselIfOverflow(section);
  revealLoadedImages(section);
}

          let heroItems = getHeroFromHistory();
          let fromHistory = !!(heroItems && heroItems.length > 0);
          if (!heroItems || heroItems.length === 0) heroItems = videos.filter(v => v.addedToHero && v.bgUrl);
          if (heroItems.length > 0) {
            document.getElementById('hero').style.display = 'block';
            renderHero(heroItems, fromHistory);
          } else {
            document.getElementById('hero').style.display = 'none';
          }

          updateHeroFromHistory = function() {
            const vids = window.__ALL_VIDEOS__ || [];
            let items = getHeroFromHistory();
            const fromHist = !!(items && items.length > 0);
            if (!items || items.length === 0) items = vids.filter(v => v.addedToHero && v.bgUrl);
            const heroEl = document.getElementById('hero');
            if (!heroEl) return;
            if (items.length > 0) {
              heroEl.style.display = 'block';
              renderHero(items, fromHist);
            } else {
              heroEl.style.display = 'none';
            }
          };
          
          renderNewRail(videos);
          renderRecommendedRail(videos);

          const categories=(db.categories&&db.categories.length)?db.categories:Array.from(new Set((db.shows||[]).map(s=>s.category||'Uncategorized')));
          categories.forEach(cat=>{ const showsInCat=(db.shows||[]).filter(s=>(s.category||'Uncategorized')===cat); if(showsInCat.length===0) return; const rail=ensureCategorySection(cat); showsInCat.forEach(s=> rail.appendChild(showCard(s)) ); attachCarouselIfOverflow(rail.closest('.section')); });

                  // After shows are loaded
const slugToShow = new Map((db.shows||[]).map(s => [slug(s.title), s]));

// Open modal if ?show= is present
const params = new URLSearchParams(window.location.search);
const showSlug = params.get("show");
if (showSlug && slugToShow.has(showSlug)) {
  openShowModal(slugToShow.get(showSlug));
}

// Handle back/forward navigation
window.addEventListener("popstate", () => {
  const params = new URLSearchParams(window.location.search);
  const slugVal = params.get("show");
  closeShow();
  if (slugVal && slugToShow.has(slugVal)) {
    openShowModal(slugToShow.get(slugVal));
  }

  // === Stop show banner video ===
if (showBannerVideoTimeout) {
  clearTimeout(showBannerVideoTimeout);
  showBannerVideoTimeout = null;
}

const bannerVideo = document.getElementById('showBannerVideo');
if (bannerVideo) {
  bannerVideo.pause();
  bannerVideo.src = '';
  bannerVideo.load();
  bannerVideo.style.opacity = 0;
}

const muteBtn = document.getElementById('showVideoMute');
if (muteBtn) muteBtn.style.display = 'none';

});

          dbg('FW history count', FW_HISTORY.length);
          loadCW();

const imageUrls = new Set();
videos.forEach(v => {
    if(v.thumbnail) imageUrls.add(getResizedUrl(v.thumbnail, 600));
    if(v.addedToHero && v.bgUrl) imageUrls.add(getResizedUrl(v.bgUrl, 1400));
    if(v.heroShowHasLogo && v.heroLogoUrl) imageUrls.add(v.heroLogoUrl); 
});

db.shows.forEach(s => {
    if(s.thumbnail) imageUrls.add(getResizedUrl(s.thumbnail, 600));
    if(s.banner) imageUrls.add(getResizedUrl(s.banner, 1400));
    if(s.showHasLogo && s.showLogoUrl) imageUrls.add(s.showLogoUrl);
});

          await preloadImages([...imageUrls]);

          revealLoadedImages(document);

          const loadingScreen = document.getElementById('loading-screen');
          loadingScreen.classList.add('fade-out');
          setTimeout(() => {
              loadingScreen.style.display = 'none';
              document.body.classList.remove('no-scroll');
          }, 500);


        })().catch(err=>{ 
            console.error('Failed to load data', err); 
            updateNav(false);
             const loadingScreen = document.getElementById('loading-screen');
             loadingScreen.classList.add('fade-out');
        });

        document.getElementById('clearQueue').onclick=()=>{
          if(!confirm('Clear all items from your Continue Watching list? This will hide them until you watch them again.')) return;
          
          const currentIds = FW_HISTORY.map(item => item.id);
          const cleared = getCleared();
          currentIds.forEach(id => cleared.add(id));
          putCleared(cleared);

          FW_HISTORY = [];
          loadCW();
        };
        window.addEventListener('focus', async ()=>{ 
          const { history, isLoggedIn } = await fetchFourthwallHistory();
          FW_HISTORY = history;
          updateNav(isLoggedIn);
          loadCW(); 
        });



        // --- Mobile Nav Toggle Script ---
        const mobileNavToggle = document.getElementById('mobileNavToggle');
        const navMenu = document.getElementById('navMenu');

        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isNavActive = navMenu.classList.contains('active');
            mobileNavToggle.innerHTML = isNavActive ? '&times;' : '&#9776;';
            document.body.classList.toggle('no-scroll', isNavActive);
        });
    });
