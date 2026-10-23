const mobileNavigation = window.matchMedia('(max-width: 640px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const siteMenu = document.querySelector('.site-menu');
const pageContents = document.querySelector('.page-contents');
const italian = document.documentElement.lang === 'it';
const siteNav = document.querySelector('.site-nav');
let activeButton = null;
let savedScroll = 0;
let closing = false;

const dialog = document.createElement('dialog');
dialog.className = 'navigation-dialog';
dialog.id = 'navigation-dialog';
dialog.setAttribute('aria-labelledby', 'navigation-title');
dialog.innerHTML = `<header class="dialog-header"><h2 id="navigation-title"></h2><button type="button" class="dialog-close" aria-label="${italian ? 'Chiudi menu' : 'Close menu'}">×</button></header><div class="dialog-content"></div>`;
document.body.append(dialog);
const content = dialog.querySelector('.dialog-content');
const toolbar = document.createElement('div');
toolbar.className = 'mobile-toolbar';
const buttons = [];
function addButton(label, source, kind) {
  if (!source) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'toolbar-button';
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', dialog.id);
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = `<span aria-hidden="true">${kind === 'site' ? '☰' : '≡'}</span><span>${label}</span>`;
  button.addEventListener('click', () => openPanel(button, label, source, kind));
  toolbar.append(button);
  buttons.push(button);
}
addButton('Menu', siteMenu?.querySelector('.menu-panel'), 'site');
addButton(italian ? 'In questa pagina' : 'On this page', pageContents?.querySelector('.contents-panel'), 'contents');
siteNav?.prepend(toolbar);
if (siteNav && typeof dialog.showModal === 'function') document.documentElement.classList.add('navigation-enhanced');

function openPanel(button, label, source, kind) {
  if (!mobileNavigation.matches || closing || dialog.open) return;
  activeButton = button;
  button.setAttribute('aria-expanded', 'true');
  dialog.querySelector('h2').textContent = label;
  content.replaceChildren(source.cloneNode(true));
  dialog.dataset.kind = kind;
  savedScroll = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScroll}px`;
  document.body.style.width = '100%';
  dialog.showModal();
  content.scrollTop = 0;
  dialog.querySelector('.dialog-close').focus();
  dialog.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}], {duration:reducedMotion.matches ? 0 : 220,easing:'cubic-bezier(.2,.8,.2,1)'});
}
async function closePanel() {
  if (!dialog.open || closing) return;
  closing = true;
  dialog.classList.add('is-closing');
  await dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(24px)'}], {duration:reducedMotion.matches ? 0 : 160,easing:'ease-in',fill:'forwards'}).finished;
  dialog.close();
  dialog.getAnimations().forEach(animation => animation.cancel());
  dialog.classList.remove('is-closing');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, savedScroll);
  activeButton?.setAttribute('aria-expanded', 'false');
  activeButton?.focus({preventScroll:true});
  closing = false;
}
dialog.querySelector('.dialog-close').addEventListener('click', closePanel);
dialog.addEventListener('cancel', event => { event.preventDefault(); closePanel(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closePanel();
});
content.addEventListener('click', async event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  const hash = link.hash;
  document.dispatchEvent(new CustomEvent('movelory:feature', {detail:hash.slice(1)}));
  await closePanel();
  history.pushState(null, '', hash);
  target.setAttribute('tabindex', '-1');
  target.focus({preventScroll:true});
  target.scrollIntoView({block:'start'});
});
function updateNavigation() {
  if (!mobileNavigation.matches && dialog.open) closePanel();
  if (siteMenu) siteMenu.open = !mobileNavigation.matches;
  if (pageContents) pageContents.open = !mobileNavigation.matches;
}
updateNavigation();
mobileNavigation.addEventListener('change', updateNavigation);

// Keep the article index in step with the section being read.
const indexLinks = [...document.querySelectorAll('.page-nav a[href^="#"]')];
const indexSections = indexLinks.map(link => ({link, target:document.getElementById(link.hash.slice(1))})).filter(item => item.target);
if (indexSections.length) {
  let pendingIndexUpdate = false;
  function updateCurrentSection() {
    pendingIndexUpdate = false;
    if (dialog.open) return;
    let current = indexSections[0];
    for (const item of indexSections) {
      if (item.target.getBoundingClientRect().top <= 120) current = item;
    }
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = indexSections.at(-1);
    const changed = current.link.getAttribute('aria-current') !== 'location';
    indexSections.forEach(item => {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
    const panel = current.link.closest('.contents-panel');
    if (changed && !mobileNavigation.matches && pageContents.open && panel) {
      const linkBox = current.link.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      if (linkBox.top < panelBox.top || linkBox.bottom > panelBox.bottom) {
        panel.scrollTo({top:panel.scrollTop + linkBox.top - panelBox.top - panel.clientHeight / 2 + linkBox.height / 2,behavior:reducedMotion.matches ? 'instant' : 'smooth'});
      }
    }
  }
  function scheduleIndexUpdate() {
    if (pendingIndexUpdate) return;
    pendingIndexUpdate = true;
    requestAnimationFrame(updateCurrentSection);
  }
  window.addEventListener('scroll', scheduleIndexUpdate, {passive:true});
  window.addEventListener('resize', scheduleIndexUpdate);
  window.addEventListener('hashchange', scheduleIndexUpdate);
  updateCurrentSection();
}

// Remember dismissal only within this tab's session; never set a cookie.
const noticeStorageKey = 'movelory.cookieNotice.dismissed.v1';
let noticeDismissed = false;
try { noticeDismissed = sessionStorage.getItem(noticeStorageKey) === '1'; } catch { /* Storage may be blocked. */ }
const cookieNotice = document.querySelector('.cookie-notice');
const cookieClose = cookieNotice?.querySelector('.cookie-close');
if (cookieNotice && cookieClose) {
  cookieNotice.id = 'cookie-notice';
  const cookieTab = document.createElement('button');
  cookieTab.type = 'button';
  cookieTab.className = 'cookie-tab';
  cookieTab.textContent = italian ? 'Info cookie' : 'Cookie info';
  cookieTab.setAttribute('aria-label', italian ? 'Riapri avviso sui cookie' : 'Reopen cookie notice');
  cookieTab.setAttribute('aria-controls', cookieNotice.id);
  cookieTab.setAttribute('aria-expanded', String(!noticeDismissed));
  cookieTab.hidden = !noticeDismissed;
  cookieNotice.hidden = noticeDismissed;
  document.body.append(cookieTab);
  cookieClose.hidden = false;
  cookieNotice.classList.add('is-banner');
  document.body.classList.toggle('has-cookie-banner', !noticeDismissed);
  document.body.classList.toggle('has-cookie-tab', noticeDismissed);
  const resizeNotice = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--cookie-banner-space', `${cookieNotice.offsetHeight + 32}px`);
  });
  if (!noticeDismissed) resizeNotice.observe(cookieNotice);
  cookieTab.addEventListener('click', () => {
    cookieTab.hidden = true;
    cookieTab.setAttribute('aria-expanded', 'true');
    cookieNotice.hidden = false;
    cookieClose.disabled = false;
    document.body.classList.remove('has-cookie-tab');
    document.body.classList.add('has-cookie-banner');
    resizeNotice.observe(cookieNotice);
    cookieNotice.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}], {duration:reducedMotion.matches ? 0 : 160,easing:'ease-out'});
    cookieClose.focus({preventScroll:true});
  });
  cookieClose.addEventListener('click', async () => {
    cookieClose.disabled = true;
    try { sessionStorage.setItem(noticeStorageKey, '1'); } catch { /* Still close this page's banner. */ }
    await cookieNotice.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(16px)'}], {duration:reducedMotion.matches ? 0 : 160,easing:'ease-in'}).finished;
    cookieNotice.hidden = true;
    resizeNotice.disconnect();
    document.body.classList.remove('has-cookie-banner');
    document.body.classList.add('has-cookie-tab');
    document.documentElement.style.removeProperty('--cookie-banner-space');
    cookieTab.hidden = false;
    cookieTab.setAttribute('aria-expanded', 'false');
    cookieTab.focus({preventScroll:true});
  });
}
