export function initPage() {
  const profileButton = document.querySelector('[data-profile-button]');
  const profileMenu = document.querySelector('[data-profile-menu]');
  const mobileNavButton = document.querySelector('[data-mobile-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-menu]');

  if (profileButton && profileMenu) {
    profileButton.addEventListener('click', () => {
      profileMenu.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
      if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
        profileMenu.classList.remove('show');
      }
    });
  }

  if (mobileNavButton && mobileNav) {
    mobileNavButton.addEventListener('click', () => {
      mobileNav.classList.toggle('show');
      mobileNavButton.setAttribute('aria-expanded', mobileNav.classList.contains('show'));
    });
  }
}
