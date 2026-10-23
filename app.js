const featureNav = document.querySelector('.app-contents');
const featureGrid = document.querySelector('.feature-grid');
const featureCards = [...document.querySelectorAll('.feature-card')];
if (featureNav && featureGrid && featureCards.length) {
  const isItalian = document.documentElement.lang === 'it';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const originalLinks = [...featureNav.querySelectorAll('a[href^="#"]')];
  const tabs = document.createElement('div');
  tabs.className = 'feature-tabs';
  tabs.setAttribute('role', 'group');
  tabs.setAttribute('aria-label', featureNav.getAttribute('aria-label'));
  featureGrid.setAttribute('role', 'region');
  featureGrid.setAttribute('aria-roledescription', isItalian ? 'carosello' : 'carousel');
  featureGrid.setAttribute('aria-label', isItalian ? 'Schermate di Movelory' : 'Movelory screens');
  featureGrid.tabIndex = 0;
  let selectedIndex = 0;
  let settleTimer;
  const controls = document.createElement('div');
  controls.className = 'feature-controls';
  const previous = document.createElement('button');
  const next = document.createElement('button');
  const position = document.createElement('span');
  previous.type = next.type = 'button';
  previous.textContent = isItalian ? '← Precedente' : '← Previous';
  next.textContent = isItalian ? 'Successiva →' : 'Next →';
  position.setAttribute('role', 'status');
  controls.append(previous, position, next);
  const tabButtons = originalLinks.map((link, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = link.textContent;
    button.setAttribute('aria-controls', featureCards[index].id);
    featureCards[index].setAttribute('role', 'group');
    featureCards[index].setAttribute('aria-roledescription', isItalian ? 'schermata' : 'slide');
    featureCards[index].setAttribute('aria-label', `${index + 1} / ${featureCards.length}: ${link.textContent}`);
    button.addEventListener('click', () => selectFeature(index));
    button.addEventListener('keydown', event => {
      const target = keyboardTarget(event.key, index);
      if (target === undefined) return;
      event.preventDefault();
      selectFeature(target);
      tabButtons[target].focus({preventScroll:true});
    });
    tabs.append(button);
    return button;
  });
  // Copies on both sides make the seam visually identical when we recenter.
  featureCards.forEach((card, index) => { card.dataset.featureIndex = index; });
  function copyCards() {
    return featureCards.map(card => {
      const copy = card.cloneNode(true);
      copy.removeAttribute('id');
      copy.dataset.copy = 'true';
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      copy.querySelectorAll('a,button,[tabindex]').forEach(node => { node.tabIndex = -1; });
      return copy;
    });
  }
  featureGrid.prepend(...copyCards());
  featureGrid.append(...copyCards());
  const slides = [...featureGrid.children];
  const count = featureCards.length;
  function keyboardTarget(key, index) {
    if (key === 'ArrowRight') return (index + 1) % count;
    if (key === 'ArrowLeft') return (index - 1 + count) % count;
    if (key === 'Home') return 0;
    if (key === 'End') return featureCards.length - 1;
  }
  function updateSelection(index, updateHash) {
    selectedIndex = index;
    slides.forEach(card => {
      const i = Number(card.dataset.featureIndex);
      card.classList.toggle('is-selected', i === index);
      if ([index, (index + 1) % count, (index - 1 + count) % count].includes(i)) card.querySelector('img').loading = 'eager';
    });
    tabButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    originalLinks.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    position.textContent = `${index + 1} / ${featureCards.length} · ${tabButtons[index].textContent}`;
    const button = tabButtons[index];
    tabs.scrollLeft = button.offsetLeft - tabs.offsetLeft - (tabs.clientWidth - button.offsetWidth) / 2;
    if (updateHash) history.replaceState(null, '', `#${featureCards[index].id}`);
  }
  function selectFeature(index, updateHash = true, instant = false) {
    updateSelection(index, updateHash);
    const center = featureGrid.scrollLeft + featureGrid.clientWidth / 2;
    const card = instant ? featureCards[index] : slides.filter(slide => Number(slide.dataset.featureIndex) === index).reduce((best, slide) => Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center) < Math.abs(best.offsetLeft + best.offsetWidth / 2 - center) ? slide : best);
    featureGrid.scrollTo({left:card.offsetLeft - featureGrid.clientWidth / 2 + card.offsetWidth / 2,behavior:instant || motion.matches ? 'instant' : 'smooth'});
  }
  function nearestCard() {
    const center = featureGrid.scrollLeft + featureGrid.clientWidth / 2;
    let nearest = 0;
    slides.forEach((card, index) => {
      if (Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(slides[nearest].offsetLeft + slides[nearest].offsetWidth / 2 - center)) nearest = index;
    });
    return nearest;
  }
  featureGrid.addEventListener('scroll', () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      if (drag?.moved) return;
      const nearest = nearestCard();
      const index = Number(slides[nearest].dataset.featureIndex);
      updateSelection(index, true);
      if (nearest < count || nearest >= count * 2) selectFeature(index, false, true);
    }, 120);
  }, {passive:true});
  featureGrid.addEventListener('keydown', event => {
    if (event.target !== featureGrid) return;
    const target = keyboardTarget(event.key, selectedIndex);
    if (target === undefined) return;
    event.preventDefault();
    selectFeature(target);
  });
  // Native touch scrolling; mouse dragging works on desktop too.
  let drag;
  let suppressClick = false;
  featureGrid.addEventListener('dragstart', event => event.preventDefault());
  featureGrid.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('.text-link')) return;
    drag = {id:event.pointerId,x:event.clientX,left:featureGrid.scrollLeft,moved:false};
    suppressClick = false;
  });
  featureGrid.addEventListener('pointermove', event => {
    if (!drag) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) > 6) {
      drag.moved = true;
      featureGrid.setPointerCapture(drag.id);
      featureGrid.classList.add('is-dragging');
    }
    if (!drag.moved) return;
    event.preventDefault();
    featureGrid.scrollLeft = drag.left - distance;
  });
  function endDrag() {
    if (!drag) return;
    const moved = drag.moved;
    if (featureGrid.hasPointerCapture(drag.id)) featureGrid.releasePointerCapture(drag.id);
    drag = null;
    featureGrid.classList.remove('is-dragging');
    if (moved) { suppressClick = true; selectFeature(Number(slides[nearestCard()].dataset.featureIndex)); }
  }
  featureGrid.addEventListener('pointerup', endDrag);
  featureGrid.addEventListener('pointercancel', endDrag);
  featureGrid.addEventListener('pointerleave', () => { if (drag && !drag.moved) drag = null; });
  featureGrid.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; return; }
    const card = event.target.closest('.feature-card');
    if (card && (Number(card.dataset.featureIndex) !== selectedIndex || card.dataset.copy)) { event.preventDefault(); selectFeature(Number(card.dataset.featureIndex)); }
  }, true);
  previous.addEventListener('click', () => selectFeature((selectedIndex - 1 + count) % count));
  next.addEventListener('click', () => selectFeature((selectedIndex + 1) % count));
  function selectHash() {
    const index = featureCards.findIndex(card => `#${card.id}` === location.hash);
    if (index >= 0) selectFeature(index, false, true);
  }
  document.addEventListener('movelory:feature', event => {
    const index = featureCards.findIndex(card => card.id === event.detail);
    if (index >= 0) selectFeature(index, false, true);
  });
  window.addEventListener('hashchange', selectHash);
  featureNav.before(tabs);
  featureGrid.after(controls);
  document.querySelector('.app-explore').classList.add('app-feature-enhanced');
  selectFeature(0, false, true);
  selectHash();
  new ResizeObserver(() => selectFeature(selectedIndex, false, true)).observe(featureGrid);
}
