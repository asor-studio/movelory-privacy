// Keep the contents expanded on desktop and initially collapsed on small screens.
const mobileNavigation = window.matchMedia('(max-width: 640px)');
const pageContents = document.querySelector('.page-contents');
if (pageContents) {
  const updateContents = () => { pageContents.open = !mobileNavigation.matches; };
  updateContents();
  mobileNavigation.addEventListener('change', updateContents);
}
