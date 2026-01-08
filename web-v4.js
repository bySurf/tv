document.addEventListener('DOMContentLoaded', () => {
        const DATA_URL = 'https://bysurf.github.io/tv/bysurf_tv_data.json';
        const PLACEHOLDER_IMG = 'https://imgproxy.fourthwall.com/NGtTO-xePFSZdb5LAhcDCr3XNJqbjfENjyEBhj3iuwg/rt:fill/w:890/el:0/q:90/sm:1/enc/OWI1ZjVmZWY3YzFl/NTU3MhnnXWS1kcOe/jMySDjmqYEIrQsny/BKsT-ZtwEAE_BOqy/SEdbRIPEeHAY5Wc4/Pf6vugezBG5nV_2Q/4pdiBMDSBVWkrmq1/HsM_1Kt1tsThv_Cm/jT5yLyH3U-f_N9L2/3fZfgDs7zHsdRfPi/hCLoWk1VnrE.webp';




        const CLEARED_KEY = 'bysurf_cleared_v1';
        const DEBUG = localStorage.getItem('bysurf_debug') === '1';
        const dbg = (...a)=>{ if(DEBUG) console.log('[bysurf]', ...a); };

        const slug = (s='')=> s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
        const pad = n => { n = parseInt(n,10); if(isNaN(n)||n<0) return '00'; return n<10 ? `0${n}` : String(n); };
        const getEpisodeLabel = (v) => {
            const ep = v.episodeNumber ?? v.episode;
            const sn = v.seasonNumber ?? v.season ?? 1;
            if (ep == null) return '';
            return `S${pad(sn)}E${pad(ep)}`;
        };
        const episodeLabelStrict = getEpisodeLabel;
        
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
        }

        function closePlayer() {
            if (!isModalOpen) return;
            wrap.innerHTML = '';
            playerModal.classList.remove('open');
            unlockPage();
            isModalOpen = false;
            fetchFourthwallHistory().then(({history}) => {
                FW_HISTORY = history;
                loadCW();
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
          const div=document.createElement('div'); div.className='card'; const label=episodeLabelStrict(v); const sub=[label, v.show].filter(Boolean).join(' · ');
          const freeTag = v.isFree ? '<div class="free-tag">Free</div>' : '';
          div.innerHTML=`<div style="position:relative">${freeTag}<img class="thumb lazy-img" src="${PLACEHOLDER_IMG}" data-src="${v.thumbnail||''}" alt="${v.title}"><div class="progress-bar" style="display:none"><span></span></div></div><div class="meta"><div class="name">${v.title}</div>${sub?`<div class="sub">${sub}</div>`:''}</div>`;
          div.onclick=()=> openPlayer(v);
          return div;
        }

        function cwCard(v, options={}){
          const pct = Math.max(0, Math.min(100, options.progressPct || 0));
          const div=document.createElement('div');
          div.className='card';
          const sub = v.show ? v.show : '';
          div.innerHTML=`<div style="position:relative">
                           <img class="thumb lazy-img" src="${v.thumbnail||''}" data-src="${v.thumbnail||''}" alt="${v.title}">
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

        function showCard(s){ 
            const div=document.createElement('div'); 
            div.className='card'; 
            const freeTag = s.isFree ? '<div class="free-tag">Free</div>' : '';
            div.innerHTML=`<div style="position:relative">${freeTag}<img class="thumb lazy-img" src="${PLACEHOLDER_IMG}" data-src="${s.thumbnail||''}" alt="${s.title}"><div class="progress-bar" style="display:none"><span></span></div></div>`; 
            div.onclick = () => {
                openShowModal(s);
                const url = new URL(window.location);
                url.searchParams.set('show', slug(s.title));
                window.history.pushState({}, "", url);
            };
            return div;
        }

        const showModal=document.getElementById('showModal');
        document.getElementById('closeShow').onclick=()=> closeShow();
        showModal.addEventListener('click',e=>{ if(e.target===showModal) closeShow(); });
        function closeShow(){ showModal.classList.remove('open'); // Remove ?show from URL
  const url = new URL(window.location);
  url.searchParams.delete("show");
  window.history.pushState({}, "", url); document.body.classList.remove('no-scroll'); }

        function getEpisodesForShow(title){ return (window.__ALL_VIDEOS__||[]).filter(v=> v.show===title); }

        function renderEpisodesList(epsEl, list){
          epsEl.innerHTML='';
          list.forEach((v,idx)=>{
            const el=document.createElement('div'); el.className='ep'; 
            const label=getEpisodeLabel(v);
            const freeTag = v.isFree ? `<div class="free-tag">Free</div>` : '';

            el.innerHTML = `
                <div class="ep-thumb-wrap">
                    ${freeTag}
                    <img class="lazy-img" src="${PLACEHOLDER_IMG}" data-src="${v.thumbnail||''}" alt='${v.title}'/>
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
            
            banner.classList.remove('loaded');
            banner.style.backgroundImage = `url(${PLACEHOLDER_IMG})`;
            banner.setAttribute('data-bg', show.banner || show.thumbnail || '');
            
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
            revealLoadedImages(showModal);
          }catch(err){ console.error('openShowModal failed:', err); document.getElementById('episodes').innerHTML = '<div style="opacity:.7">Unable to load episodes.</div>'; showModal.classList.add('open'); document.body.classList.add('no-scroll'); }
        }

        function renderHero(items){
          const hero=document.getElementById('hero'); 
          const dotsWrap=document.getElementById('hero-dots');
          hero.innerHTML = `<button class="nav prev" aria-label="Previous">❮</button> <button class="nav next" aria-label="Next">❯</button>`; // Clear old slides, keep nav
          dotsWrap.innerHTML = '';
          
          // Sort items by heroOrder
          items.sort((a, b) => (a.heroOrder || 0) - (b.heroOrder || 0));

          items.forEach((v,i)=>{
            const s=document.createElement('div'); s.className='hero-slide'+(i===0?' active':'');
            s.style.backgroundImage = `url(${PLACEHOLDER_IMG})`;
            s.setAttribute('data-bg', v.bgUrl || '');
            
            // Logic for Hero Logo vs Title
            let titleContent = `<div class="title">${v.heroTitle}</div>`;
            if (v.heroShowHasLogo && v.heroLogoUrl) {
                titleContent = `<img src="${v.heroLogoUrl}" class="hero-logo" alt="${v.heroTitle}">`;
            }

            s.innerHTML=`<div class="hero-content">${v.pillText?`<span class="presents-text">${v.pillText}</span>`:''}${titleContent}<div class="desc">${v.heroDesc||''}</div><button class="cta">▶ Play</button></div>`;
            s.querySelector('.cta').onclick=(e)=>{ e.stopPropagation(); openPlayer(v); };
            hero.appendChild(s);
            const d=document.createElement('div'); d.className='dot'+(i===0?' active':''); d.dataset.index=i; dotsWrap.appendChild(d);
          });
          let idx=0; const slides=()=>Array.from(document.querySelectorAll('.hero-slide')); const dots=()=>Array.from(document.querySelectorAll('.dot'));
          function show(i){ idx=(i+items.length)%items.length; slides().forEach((el,j)=>el.classList.toggle('active',j===idx)); dots().forEach((el,j)=>el.classList.toggle('active',j===idx)); }
          document.querySelector('.nav.prev').onclick=()=>show(idx-1); document.querySelector('.nav.next').onclick=()=>show(idx+1); dotsWrap.addEventListener('click',e=>{ if(e.target.classList.contains('dot')) show(+e.target.dataset.index); });
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

        let FW_HISTORY = [];

        const getCleared = () => { try{return new Set(JSON.parse(localStorage.getItem(CLEARED_KEY)||'[]'))}catch{return new Set()} };
        const putCleared = (set) => { try{localStorage.setItem(CLEARED_KEY, JSON.stringify(Array.from(set)))}catch{} };
        
        function updateNav(isLoggedIn) {
            const loginBtn = document.getElementById('login-button');
            const joinBtn = document.getElementById('join-button');
            const accountLink = document.getElementById('your-account-link');
            const notificationLink = document.getElementById('your-notifications');

            if (isLoggedIn) {
                loginBtn.classList.add('hidden');
                joinBtn.classList.add('hidden');
                accountLink.classList.remove('hidden');
                notificationLink.classList.remove('hidden');
            } else {
                loginBtn.classList.remove('hidden');
                joinBtn.classList.remove('hidden');
                accountLink.classList.add('hidden');
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
            const finalItems = clearedIds.size === 0 ? items : items.filter(item => !clearedIds.has(item.id));
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
        
        /* ========= Init ========= */
        (async function(){
          const res=await fetch(DATA_URL,{cache:'no-store'}); const db=await res.json();
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
          
          const heroItems = videos.filter(v => v.addedToHero && v.bgUrl);
          if (heroItems.length > 0) {
            document.getElementById('hero').style.display = 'block';
            renderHero(heroItems);
          } else {
            document.getElementById('hero').style.display = 'none';
          }
          
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
});

          dbg('FW history count', FW_HISTORY.length);
          loadCW();

          const imageUrls = new Set();
          videos.forEach(v => {
              if(v.thumbnail) imageUrls.add(v.thumbnail);
              if(v.addedToHero && v.bgUrl) imageUrls.add(v.bgUrl);
              if(v.heroShowHasLogo && v.heroLogoUrl) imageUrls.add(v.heroLogoUrl);
          });
          db.shows.forEach(s => {
              if(s.thumbnail) imageUrls.add(s.thumbnail);
              if(s.banner) imageUrls.add(s.banner);
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
