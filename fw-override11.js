(function() {
    'use strict';
    var BASE = 'https://bysurf.tv';
    var NAV_OVERRIDE_PATHS = [
      '/',
      '/supporters/users/supporters/profile/edit',
      '/supporters/perks',
      '/supporters/badges',
      '/supporters/payments/billing',
      '/supporters/sign_in',
      'supporters/users/supporters/forgot_password/new',
      '/pages/join',
      '/join',
      '/pages/report-bugs',
      '/pages/terms-of-service',
      '/pages/privacy-policy',
      '/pages/returns-faq',
      '/pages/impressum'
    ];
  
    function isNavOverridePage() {
      if (typeof window === 'undefined' || !window.location) return false;
      var path = window.location.pathname || '/';
      if (path === '' || path === '/') return true;
      for (var i = 0; i < NAV_OVERRIDE_PATHS.length; i++) {
        var p = NAV_OVERRIDE_PATHS[i];
        if (p === '/') continue;
        if (path === p || path.indexOf(p) !== -1) return true;
      }
      return false;
    }
  
    function removeFourthwallHeader() {
      var el = document.querySelector('header.page__header');
      if (el) el.remove();
      document.documentElement.classList.add('fw-override-active');
    }
  
    function injectNavAndScript() {
      var style = document.createElement('style');
      style.id = 'fw-override-nav-styles';
      style.textContent = [
        ':root { --bg: #0f0f0f; --card: #1b1c1f; --muted: #b9c2cf; --accent: #009dff; --radius: 10px; }',
        '.sticky-nav { position: fixed; top: 0; left: 0; right: 0; width: 100%; padding: 0.6rem 2rem; background: linear-gradient(to bottom, #0f0f0f 0%, transparent 100%); z-index: 99999; transition: background 0.3s ease; }',
        '.nav-container { display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 1600px; margin: 0 auto; gap: 1rem; }',
        '.nav-left { display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0; margin-right: auto; }',
        '.nav-menu-left { display: flex; align-items: center; gap: 1.5rem; }',
        '.nav-right { display: flex; align-items: center; gap: 1.25rem; flex-shrink: 0; margin-left: auto; }',
        '.nav-logo img { height: 24px; display: block; }',
        '.nav-menu { display: flex; align-items: center; gap: 1.5rem; }',
        '.nav-link, .nav-button { text-decoration: none; color: var(--muted); font-family: "Roboto Mono", monospace; font-size: 0.9rem; font-weight: 500; transition: color 0.2s ease; }',
        '.nav-link:hover { color: #fff; }',
        '.nav-button { padding: 0.5rem 1rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 999px; color: #fff; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; }',
        '.nav-button:hover { background-color: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.3); color: #fff; }',
        '.nav-button.accent { background-color: var(--accent); border-color: var(--accent); color: #fff; }',
        '.nav-button.accent:hover { filter: brightness(1.1); }',
        '.mobile-nav-toggle { display: none; background: none; border: none; color: #fff; font-size: 2rem; line-height: 1; cursor: pointer; z-index: 1001; }',
        '.hidden { display: none !important; }',
        '.nav-icon-link { display: flex; align-items: center; color: var(--muted); transition: color 0.2s ease; }',
        '.nav-icon-link:hover { color: #fff; }',
        '.nav-profile-wrap { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.1); color: var(--muted); transition: background 0.2s ease, color 0.2s ease; cursor: pointer; border: none; }',
        '.nav-profile-wrap:hover { background: rgba(255,255,255,0.15); color: #fff; }',
        '.nav-profile-wrap img { width: 100%; height: 100%; object-fit: cover; }',
        '.nav-profile-wrap svg { width: 20px; height: 20px; }',
        '.notifications-img { height: 25px; display: block; }',
        '.discord-icon { width: 25px; height: 25px; display: block; }',
        '.mobile-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 60px; display: none; background: rgba(0,0,0,.35); backdrop-filter: blur(12px); border-top: 2px solid rgba(255,255,255,0.08); z-index: 9999; }',
        '@media (max-width: 768px) { .mobile-bottom-nav { display: flex; justify-content: space-around; align-items: center; } .sticky-nav { display: none; } }',
        '.nav-btn { position: relative; flex: 1; background: none; border: none; color: #fff; display: flex; align-items: center; justify-content: center; padding: 6px 0; transition: color 0.2s ease; cursor: pointer; }',
        '.nav-btn svg { width: 24px; height: 24px; fill: currentColor; }',
        '.nav-btn.active, .nav-btn:focus, .nav-btn:active { color: #009dff; }',
        '.pfp-wrap img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }',
        'body.no-scroll { overflow: hidden; }',
        '.fw-profile-dropdown-wrap { position: relative; }',
        '.fw-profile-dropdown { position: absolute; top: 100%; right: 0; margin-top: 6px; min-width: 200px; background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 100002; padding: 8px 0; display: none; }',
        '.fw-profile-dropdown.open { display: block; }',
        '.fw-profile-dropdown a, .fw-profile-dropdown button { display: block; width: 100%; text-align: left; padding: 10px 16px; color: var(--muted); text-decoration: none; border: none; background: none; font-family: inherit; font-size: 0.9rem; cursor: pointer; transition: color 0.2s, background 0.2s; }',
        '.fw-profile-dropdown a:hover, .fw-profile-dropdown button:hover { color: #fff; background: rgba(255,255,255,0.06); }',
        '.fw-profile-dropdown .fw-dropdown-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 6px 0; }',
        '.fw-profile-dropdown .fw-dropdown-back { color: var(--accent); }',
        '.fw-profile-sheet-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100001; opacity: 0; visibility: hidden; transition: opacity 0.25s, visibility 0.25s; }',
        '.fw-profile-sheet-backdrop.open { opacity: 1; visibility: visible; }',
        '.fw-profile-sheet { position: fixed; left: 0; right: 0; bottom: 0; max-height: 70vh; background: var(--card); border-radius: 16px 16px 0 0; z-index: 100002; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow-y: auto; box-shadow: 0 -4px 24px rgba(0,0,0,0.3); }',
        '.fw-profile-sheet.open { transform: translateY(0); }',
        '.fw-profile-sheet a, .fw-profile-sheet button { display: block; width: 100%; text-align: left; padding: 14px 20px; color: #fff; text-decoration: none; border: none; background: none; font-family: inherit; font-size: 1rem; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.2s; }',
        '.fw-profile-sheet a:hover, .fw-profile-sheet button:hover { background: rgba(255,255,255,0.06); }',
        '.fw-profile-sheet .fw-sheet-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 0; }',
        '.fw-profile-sheet .fw-sheet-handle { width: 40px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; margin: 10px auto 6px; }'
      ].join('\n');
      document.head.appendChild(style);
  
      var mobileNavHtml = '<nav class="mobile-bottom-nav" id="mobileBottomNav">' +
        '<button class="nav-btn" data-action="home" aria-label="Home"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/></svg></button>' +
        '<button class="nav-btn hidden" data-action="rewards" aria-label="Rewards" id="mobileRewardsBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506z"/></svg></button>' +
        '<button class="nav-btn" data-action="account" aria-label="Account" id="mobileAccountBtn"><div class="pfp-wrap"></div></button>' +
        '</nav>';
  
      var dropdownLinksHtml =
        '<a href="' + BASE + '/supporters/users/supporters/profile/edit">Profile</a>' +
        '<a href="' + BASE + '/supporters/perks">Perks</a>' +
        '<a href="' + BASE + '/supporters/badges">Badges</a>' +
        '<a href="' + BASE + '/supporters/payments/billing">Billing</a>' +
        '<div class="fw-dropdown-divider"></div>' +
        '<a href="' + BASE + '/pages/terms-of-service" target="_blank" rel="noopener">Terms of Service</a>' +
        '<a href="' + BASE + '/pages/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>' +
        '<a href="' + BASE + '/pages/returns-faq" target="_blank" rel="noopener">Returns &amp; FAQ</a>' +
        '<a href="' + BASE + '/pages/impressum" target="_blank" rel="noopener">Impressum</a>' +
        '<a href="' + BASE + '/contact" target="_blank" rel="noopener">Contact Support</a>' +
        '<div class="fw-dropdown-divider"></div>' +
        '<button type="button" class="fw-logout-btn">Logout</button>';
  
      var stickyNavHtml = '<header class="sticky-nav" id="fwStickyNav">' +
        '<div class="nav-container">' +
          '<div class="nav-left">' +
            '<a href="' + BASE + '" class="nav-logo"><img src="https://imgproxy.fourthwall.com/jm8_1IXS11ENpRBQOnDGD2LR2AIemqwHG5r9xZUkgyM/w:125/sm:1/enc/yY0t3w5BLDeCHl1n/vWdqIn1TCv2Z1qcM/d2iCajrnyQXqwPuf/9HtKWT_F2KCXFsoi/endtDTvYu3-L1-hF/uRwbv30xzJ5nyAa7/jzjhtsKtsnCVKmCu/uGygFicxUwPmEBxn/bFGa2d79RIJdM5vL/rekNF6Rp9epMylaV/Cx2qsO-R1ciIXlhY/0TBjzvFMCLVwuvHO/HJy59VjSYCI_8hOM/PraprysdLKUs2bYf/kQEeGP72K0cOQ_Rt/2kvC99eSpI5P03Vm" alt="bySurf TV"></a>' +
            '<nav class="nav-menu nav-menu-left" id="navMenu"><a href="' + BASE + '/pages/report-bugs" class="nav-link">Report a bug</a></nav>' +
          '</div>' +
          '<div class="nav-right">' +
            '<a href="' + BASE + '/supporters/perks" class="nav-link nav-icon-link hidden" id="discord-perks" aria-label="Discord &amp; perks" rel="noopener"><svg class="discord-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></a>' +
            '<div class="fw-profile-dropdown-wrap">' +
              '<button type="button" class="nav-profile-wrap hidden" id="nav-profile-wrap" aria-label="Your account" aria-haspopup="true" aria-expanded="false"></button>' +
              '<div class="fw-profile-dropdown" id="fwProfileDropdown" role="menu">' + dropdownLinksHtml + '</div>' +
            '</div>' +
            '<a href="' + BASE + '/join" class="nav-button accent hidden" id="nav-upgrade-btn">Upgrade</a>' +
            '<a href="' + BASE + '/supporters/sign_in" class="nav-button" id="login-button">Login</a>' +
            '<a href="' + BASE + '/en-eur/pages/join" class="nav-button accent" id="join-button">Join</a>' +
          '</div>' +
          '<button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Menu">&#9776;</button>' +
        '</div>' +
        '</header>';
  
      var sheetHtml = '<div class="fw-profile-sheet-backdrop" id="fwProfileSheetBackdrop" aria-hidden="true"></div>' +
        '<div class="fw-profile-sheet" id="fwProfileSheet" role="dialog" aria-label="Account menu">' +
          '<div class="fw-sheet-handle"></div>' +
          dropdownLinksHtml +
        '</div>';
  
      var wrap = document.createElement('div');
      wrap.id = 'fw-override-nav-root';
      wrap.innerHTML = mobileNavHtml + stickyNavHtml + sheetHtml;
      document.body.insertBefore(wrap, document.body.firstChild);
  
      runNavScript();
    }
  
    function runNavScript() {
      var IS_PAID_MEMBER = false;
      var isProfilePage = true;
  
      async function getAuthState() {
        try {
          var res = await fetch(BASE + '/supporters/perks', { credentials: 'include' });
          var isLoggedIn = !res.redirected;
          if (isLoggedIn) {
            var html = await res.text();
            IS_PAID_MEMBER = html && html.indexOf('Your perks') !== -1;
            return true;
          }
          var profileRes = await fetch(BASE + '/supporters/users/supporters/profile/edit', { credentials: 'include' });
          if (!profileRes.redirected) {
            IS_PAID_MEMBER = false;
            return true;
          }
          IS_PAID_MEMBER = false;
          return false;
        } catch (e) {
          IS_PAID_MEMBER = false;
          return false;
        }
      }
  
      function setupMobileNav(isLoggedIn) {
        var nav = document.getElementById('mobileBottomNav');
        if (!nav) return;
        var rewards = document.getElementById('mobileRewardsBtn');
        var accountBtn = document.getElementById('mobileAccountBtn');
        var pfpWrap = accountBtn && accountBtn.querySelector('.pfp-wrap');
        var sheet = document.getElementById('fwProfileSheet');
        var backdrop = document.getElementById('fwProfileSheetBackdrop');
  
        nav.addEventListener('click', function(e) {
          var btn = e.target.closest('.nav-btn');
          if (!btn) return;
          nav.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var action = btn.dataset.action;
          if (action === 'home') {
            window.location.href = isLoggedIn ? BASE + '/videos' : BASE + '/join';
            return;
          }
          if (action === 'rewards') {
            window.location.href = BASE + '/rewards';
            return;
          }
          if (action === 'account') {
            if (isLoggedIn && sheet && backdrop) {
              sheet.classList.add('open');
              backdrop.classList.add('open');
              document.body.classList.add('no-scroll');
            } else {
              window.location.href = BASE + '/supporters/sign_in';
            }
            return;
          }
        });
  
        if (backdrop) {
          backdrop.addEventListener('click', function() {
            if (sheet) sheet.classList.remove('open');
            backdrop.classList.remove('open');
            document.body.classList.remove('no-scroll');
          });
        }
        if (sheet) {
          sheet.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function() {
              sheet.classList.remove('open');
              if (backdrop) backdrop.classList.remove('open');
              document.body.classList.remove('no-scroll');
            });
          });
        }
  
        if (isLoggedIn) {
          if (rewards) rewards.classList.remove('hidden');
          if (pfpWrap) {
            fetch(BASE + '/supporters/users/supporters/profile/edit', { credentials: 'include' })
              .then(function(res) { return res.text(); })
              .then(function(html) {
                var doc = new DOMParser().parseFromString(html, 'text/html');
                var img = doc.querySelector('img[data-testid="Avatar.Image"], img.avatar[src]');
                var defaultSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>';
                var navPfp = document.getElementById('nav-profile-wrap');
                if (img && img.src) {
                  pfpWrap.innerHTML = '';
                  var av = document.createElement('img');
                  av.src = img.src;
                  av.alt = '';
                  pfpWrap.appendChild(av);
                  if (navPfp) { navPfp.innerHTML = ''; var ni = document.createElement('img'); ni.src = img.src; ni.alt = ''; navPfp.appendChild(ni); }
                } else {
                  pfpWrap.innerHTML = defaultSvg;
                  if (navPfp) navPfp.innerHTML = defaultSvg;
                }
              });
          }
        } else {
          if (rewards) rewards.classList.add('hidden');
          if (pfpWrap) pfpWrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/><path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/></svg>';
        }
      }
  
      function updateNav(isLoggedIn) {
        setupMobileNav(isLoggedIn);
        var loginBtn = document.getElementById('login-button');
        var joinBtn = document.getElementById('join-button');
        var navProfileWrap = document.getElementById('nav-profile-wrap');
        var navUpgradeBtn = document.getElementById('nav-upgrade-btn');
        var notificationLink = document.getElementById('your-notifications');
        var discordPerksLink = document.getElementById('discord-perks');
  
        if (isLoggedIn) {
          if (loginBtn) loginBtn.classList.add('hidden');
          if (joinBtn) joinBtn.classList.add('hidden');
          if (navProfileWrap) navProfileWrap.classList.remove('hidden');
          if (IS_PAID_MEMBER) {
            if (discordPerksLink) discordPerksLink.classList.remove('hidden');
            if (notificationLink) notificationLink.classList.add('hidden');
          } else {
            if (discordPerksLink) discordPerksLink.classList.add('hidden');
            if (notificationLink) notificationLink.classList.remove('hidden');
          }
          if (navUpgradeBtn) {
            if (IS_PAID_MEMBER) navUpgradeBtn.classList.add('hidden');
            else navUpgradeBtn.classList.remove('hidden');
          }
        } else {
          if (loginBtn) loginBtn.classList.remove('hidden');
          if (joinBtn) joinBtn.classList.remove('hidden');
          if (navProfileWrap) navProfileWrap.classList.add('hidden');
          if (navUpgradeBtn) navUpgradeBtn.classList.add('hidden');
          if (notificationLink) notificationLink.classList.add('hidden');
          if (discordPerksLink) discordPerksLink.classList.add('hidden');
        }
      }
  
      function doLogout() {
        var dropdown = document.getElementById('fwProfileDropdown');
        var sheet = document.getElementById('fwProfileSheet');
        var backdrop = document.getElementById('fwProfileSheetBackdrop');
        if (dropdown) dropdown.classList.remove('open');
        if (sheet) sheet.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        document.body.classList.remove('no-scroll');
        var signOutUrl = BASE + '/supporters/sign_out';
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = signOutUrl;
        form.style.display = 'none';
        var methodInput = document.createElement('input');
        methodInput.name = '_method';
        methodInput.value = 'delete';
        form.appendChild(methodInput);
        var csrf = document.querySelector('meta[name="csrf-token"]');
        if (csrf) {
          var csrfInput = document.createElement('input');
          csrfInput.name = 'authenticity_token';
          csrfInput.value = csrf.getAttribute('content');
          form.appendChild(csrfInput);
        }
        document.body.appendChild(form);
        form.submit();
      }

      function initLogoutButtons() {
        document.querySelectorAll('.fw-logout-btn').forEach(function(btn) {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            doLogout();
          });
        });
      }

      function initProfileDropdown() {
        var wrap = document.querySelector('.fw-profile-dropdown-wrap');
        var trigger = document.getElementById('nav-profile-wrap');
        var dropdown = document.getElementById('fwProfileDropdown');
        if (!trigger || !dropdown) return;
        trigger.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var isOpen = dropdown.classList.toggle('open');
          trigger.setAttribute('aria-expanded', isOpen);
        });
        document.addEventListener('click', function(e) {
          if (wrap && !wrap.contains(e.target)) {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
        dropdown.querySelectorAll('a').forEach(function(a) {
          a.addEventListener('click', function() {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
          });
        });
      }
  
      function initMobileNavToggle() {
        var toggle = document.getElementById('mobileNavToggle');
        var navMenu = document.getElementById('navMenu');
        if (!toggle || !navMenu) return;
        toggle.addEventListener('click', function() {
          navMenu.classList.toggle('active');
          var active = navMenu.classList.contains('active');
          toggle.innerHTML = active ? '&times;' : '&#9776;';
          document.body.classList.toggle('no-scroll', active);
        });
      }
  
      function init() {
        getAuthState().then(function(isLoggedIn) {
          updateNav(isLoggedIn);
        });
        setTimeout(function() {
          getAuthState().then(function(isLoggedIn) {
            updateNav(isLoggedIn);
          });
        }, 600);
        initProfileDropdown();
        initLogoutButtons();
        initMobileNavToggle();
        window.addEventListener('focus', function() {
          getAuthState().then(function(isLoggedIn) {
            updateNav(isLoggedIn);
          });
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    }
  
    function runOverride() {
      if (!isNavOverridePage()) return;
      removeFourthwallHeader();
      if (!document.getElementById('fw-override-nav-root')) {
        injectNavAndScript();
      }
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        runOverride();
        setTimeout(runOverride, 150);
        setTimeout(runOverride, 500);
      });
    } else {
      runOverride();
      setTimeout(runOverride, 150);
      setTimeout(runOverride, 500);
    }
    document.addEventListener('turbo:load', function() {
      runOverride();
      setTimeout(runOverride, 100);
      setTimeout(runOverride, 400);
    });
    document.addEventListener('turbo:render', function() {
      if (isNavOverridePage()) runOverride();
    });
    var observer = new MutationObserver(function(mutations) {
      if (!isNavOverridePage()) return;
      if (document.querySelector('header.page__header')) {
        runOverride();
      }
    });
    function observeBody() {
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        setTimeout(observeBody, 50);
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeBody);
    } else {
      observeBody();
    }
  })();
