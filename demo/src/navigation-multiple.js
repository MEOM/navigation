import { Navigation, animate } from '@meom/navigation';

// Mandatory elements.
const navElement = document.querySelector('.js-site-nav-wrapper');
const navToggle = document.querySelector('.js-site-nav-toggle');

new Navigation(navElement, navToggle, {
    subNavAnchors: '.js-site-nav-wrapper > ul > .menu-item-has-children > a',
    subSubNavAnchors:
        '.js-site-nav-wrapper .sub-menu > .menu-item-has-children > a',
    subToggleButtonClasses: 'site-nav__sub-toggle',
    subSubToggleButtonClasses: 'site-nav__sub-sub-toggle',
    toggleNavClass: false,
    closeNavOnLastTab: true,

    onOpenNav(element) {
        // Prevent scrolling on page.
        document.documentElement.classList.add('overflow-hidden');
        document.documentElement.classList.add('is-site-nav-opened');

        element.classList.add('is-opened');
        animate(element, 'fade-in');
    },
    onCloseNav(element) {
        // Allow scrolling on page.
        document.documentElement.classList.remove('overflow-hidden');
        document.documentElement.classList.remove('is-site-nav-opened');

        animate(element, 'fade-out', 'is-opened');
    },
});
