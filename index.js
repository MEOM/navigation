/* Import internal depedencies. */
import animate from './helpers/animate';
import updateAria from './helpers/updateAria';

const TAB_KEY = 9;
const ESCAPE_KEY = 27;

/**
 * Define the constructor to instantiate a navigation.
 *
 * @constructor
 * @param {Object} element Navigation element.
 * @param {Object} toggle Navigation toggle element.
 * @param {Object} options The settings and options for this instance.
 */
 function Navigation(element, toggle, options = {}) {
     // Default settings.
    const defaults = {
        action: 'click',
        subNavAnchors: '.menu-item-has-children.is-item-level-0 > a',
        subSubNavAnchors: 'ul .menu-item-has-children > a',
        subNavClass: '.sub-menu',
        subToggleButtonClasses: '',
        subSubToggleButtonClasses: '',
        animateSubNav: false,
        animateSubNavClass: '',
        closeNavOnEscKey: true,
        closeNavOnLastTab: false,
        visuallyHiddenClass: 'screen-reader-text',
        expandChildNavText: 'Child menu',
        dropDownIcon: '<svg class="icon" aria-hidden="true" focusable="false" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4.793 4.793a1 1 0 001.414 0L12 1" stroke-width="2" stroke-linecap="round"></path></svg>',
    };

    // Bind methods.
    this._handleNav = this.handleNav.bind(this);
    this._handleSubNav = this.handleSubNav.bind(this);
    this._handleCloseNav = this.handleCloseNav.bind(this);
    this._handleCloseSubNav = this.handleCloseSubNav.bind(this);
    this._closeAllSubMenus = this.closeAllSubMenus.bind(this);
    this._setSubMenu = this.setSubMenu.bind(this);
    this._closeAllSubMenuToggles = this.closeAllSubMenuToggles.bind(this);
    this._handleDocClick = this.handleDocClick.bind(this);
    this._handleFocus = this.handleFocus.bind(this);

    // Merge options to defaults.
    let settings = { ...defaults, ...options };

    // Set elements and settings.
    this.$element = element;
    this.$toggle = toggle;
    this.settings = settings;
    this.navOpened = false;

    // Set all sub and sub sub navigations.
    this.$subNavs = this.$element.querySelectorAll(this.settings.subNavAnchors);
    this.$subSubNavs = this.$element.querySelectorAll(this.settings.subSubNavAnchors);
  
    // Initialise everything needed for the navigation.
    this.create();
}

/**
 * Setup navigation.
 */
Navigation.prototype.create = function () {
    // Set ARIA for navigation toggle button.
    this.$toggle.setAttribute('aria-expanded', 'false');

    // Set data value for nav element. This is for targeting without a class name.
    this.$element.setAttribute('data-meom-nav', 'navigation'); 

    // Setup sub navs toggle buttons.
    this.$subNavs.forEach(function (subNav) {
        // Hide link in JS to avoid cumulative layout shift (CLS).
        if (this.settings.action === 'click') {
            subNav.setAttribute('hidden', '');
        }

        const subToggleButton = document.createElement('button');
        subToggleButton.setAttribute('data-meom-nav', 'sub-toggle');
        subToggleButton.className = `${this.settings.subToggleButtonClasses}`;
        subToggleButton.type = 'button';
        subToggleButton.setAttribute('aria-expanded', 'false');

        if (this.settings.action === 'click') {
            subToggleButton.innerHTML = `${subNav.textContent}${this.settings.dropDownIcon}`;
        }

        if (this.settings.action === 'hover') {
            subToggleButton.innerHTML = `<span class="${this.settings.visuallyHiddenClass}">${this.settings.expandChildNavText}</span>${this.settings.dropDownIcon}`;
        }

        subNav.after(subToggleButton);
    }, this);

    // Setup sub sub navs toggle buttons.
    this.$subSubNavs.forEach(function (subSubNav) {
        const subToggleButton = document.createElement('button');
        subToggleButton.setAttribute('data-meom-nav', 'sub-sub-toggle');
        subToggleButton.className = `${this.settings.subSubToggleButtonClasses}`;
        subToggleButton.type = 'button';
        subToggleButton.setAttribute('aria-expanded', 'false');

        subToggleButton.innerHTML = `<span class="${this.settings.visuallyHiddenClass}">${this.settings.expandChildNavText}</span>${this.settings.dropDownIcon}`;

        subSubNav.after(subToggleButton);
    }, this);

    // Set event listeners.
    this.$toggle.addEventListener('click', this._handleNav, false);
    this.$element.addEventListener('click', this._handleSubNav, false);
    document.addEventListener('keydown', this._handleCloseNav, false);
    this.$element.addEventListener('keydown', this._handleCloseSubNav, false);
    this.$element.addEventListener('keydown', this._handleFocus, false);
    document.addEventListener('click', this._handleDocClick, false);

    return this;
};

/**
 * Handle navigation opening and closing.
 *
 * @param {Event} event
 * @return {this}
 */
Navigation.prototype.handleNav = function (event) {
    // If navigation is closed and we want to open it.
    if (!this.navOpened) {
        updateAria(this.$toggle, 'expanded');
        this.$element.classList.add('is-opened');

        // Set navigation as opened.
        this.navOpened = true;
    } else {
        updateAria(this.$toggle, 'expanded');
        this.$element.classList.remove('is-opened');

        // Set focus back to toggle button if setting `closeNavOnLastTab` is true.
        if (this.settings.closeNavOnLastTab) {
            this.$toggle.focus();
        }

        // Set navigation as closed.
        this.navOpened = false;

        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();
    }

    return this;
}

/**
 * Handle sub navigation opening and closing.
 *
 * @param {Event} event
 * @return {this}
 */
Navigation.prototype.handleSubNav = function (event) {
    const target = event.target;
    // Use .closest because there can be SVG inside the button.
    const closestSubButton = target.closest('[data-meom-nav="sub-toggle"]');
    const closestSubSubButton = target.closest(
        '[data-meom-nav="sub-sub-toggle"]'
    );

    // If the clicked element doesn't have the correct data attribute, bail.
    if (!closestSubButton && !closestSubSubButton) {
        return this;
    }

    // Close other sub menus first.
    // If toggle <button> next element (sub-menu) is already open, skip this.
    // Or we are clicking sub sub toggle.
    if (
        !target.nextElementSibling.classList.contains('is-opened') &&
        !target.matches('[data-meom-nav="sub-sub-toggle"]')
    ) {
        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();
    }

    // Update sub toggle ARIA.
    updateAria(target, 'expanded');

    // Toggle class for next <ul> element (sub-menu).
    if (target.nextElementSibling) {
        this._setSubMenu(target.nextElementSibling);
    }

    return this;
}

/**
 * Handle closing nav with Esc key.
 *
 * @param {Object} event Event triggered.
 * @return {this}
*/
Navigation.prototype.handleCloseNav = function(event) {
    // Close nav on Esc key if nav is open.
    if (this.navOpened && this.settings.closeNavOnEscKey && ESCAPE_KEY === event.keyCode) {
        this._handleNav(event);
    }

    return this;
}

/**
 * Handle closing sub-nav with Tab or Esc key.
 *
 * @param {Object} event Event triggered.
 * @return {this}
*/
Navigation.prototype.handleCloseSubNav = function(event) {
    // Set focusable elements inside sub-menu element.
    const openSubMenu = document.querySelector(`${this.settings.subNavClass}.is-opened`);

    if (openSubMenu) {
        // Focusable elements.
        const focusableElements = openSubMenu.querySelectorAll([
            'a[href]',
            'area[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
        ]);

        const lastFocusableElement =
            focusableElements[focusableElements.length - 1];

        // Last Tab closes sub-menu.
        if (
            TAB_KEY === event.keyCode &&
            !event.shiftKey &&
            event.target === lastFocusableElement
        ) {
            this._closeAllSubMenus();
            this._closeAllSubMenuToggles();
        }

        const subMenuToggle = openSubMenu.previousElementSibling;

        // Shift+Tab from sub-menu toggle closes sub-menu.
        if (
            subMenuToggle &&
            TAB_KEY === event.keyCode &&
            event.shiftKey &&
            event.target === subMenuToggle
        ) {
            this._closeAllSubMenus();
            this._closeAllSubMenuToggles();
        }
    }

    // Close sub-menu on Esc key.
    if (ESCAPE_KEY === event.keyCode) {
        // If we are on the sub-menu toggle itself.
        if (
            event.target.matches(
                '[data-meom-nav="sub-toggle"][aria-expanded="true"]'
            )
        ) {
            this._handleSubNav(event);
            this._closeAllSubMenus();
            this._closeAllSubMenuToggles();
            return this;
        }

        // Previous sub-menu toggle.
        const parentSubMenu = event.target.closest(`${this.settings.subNavClass}.is-opened`);

        // Set focus to sub menu toggle.
        if (parentSubMenu) {
            // sub-menu toggle.
            const subMenuToggle = parentSubMenu.previousElementSibling;

            // Set focus back to sub-menu toggle.
            if (subMenuToggle) {
                subMenuToggle.focus();
            }
        }

        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();
    }

    return this;
}

/**
 * Handle focus when nav is open.
 *
 * @param {Object} event Event triggered.
 * @return {this}
 */
Navigation.prototype.handleFocus = function(event) {
    // Bail if menu is not open.
    if (!this.navOpened) {
        return this;
    }

    // Bail if `closeNavOnLastTab` setting is not set to true.
    if (!this.settings.closeNavOnLastTab) {
        return this;
    }

    // Set focusable elements inside element.
    const focusableElements = this.$element.querySelectorAll([
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
    ]);

    const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

    // Close nav on last Tab.
    if (
        TAB_KEY === event.keyCode &&
        !event.shiftKey &&
        event.target === lastFocusableElement
    ) {
        event.preventDefault();
        // Close nav.
        this._handleNav(event);
    }

    return this;
}

/**
 * Handle closing sub-navs when clicking outside of nav.
 *
 * @param {Object} event Event triggered.
 * @return {this}
 */
Navigation.prototype.handleDocClick = function(event) {
    // Bail if clicking inside the nav.
    if (event.target.closest('[data-meom-nav="navigation"]')) {
        return this;
    }

    this._closeAllSubMenus();
    this._closeAllSubMenuToggles();

    return this;
}

/**
 * Close all sub menus.
 *
 * @return {this}
 */
Navigation.prototype.closeAllSubMenus = function() {
    const openSubMenus = document.querySelectorAll(`${this.settings.subNavClass}.is-opened`);

    openSubMenus.forEach(function (openSubMenu) {
        this._setSubMenu(openSubMenu);
    }, this);

    return this;
}

/**
 * Set classes and animate for sub-menu.
 *
 * @param {Node} submenu Sub menu node.
 * @return {this}
 */
Navigation.prototype.setSubMenu = function(submenu) {
    if (!submenu) {
        return this;
    }

    if (!submenu.classList.contains('is-opened')) {
        submenu.classList.add('is-opened');

        // Base animation with class.
        if (this.settings.animateSubNav) {
            animate(submenu, this.settings.animateSubNavClass);
        }
    } else {
        submenu.classList.remove('is-opened');
    }

    return this;
}

/**
 * Close all sub menu toggles.
 *
 * @return {this}
 */
Navigation.prototype.closeAllSubMenuToggles = function() {
    const openSubMenuToggles = document.querySelectorAll(
        '[data-meom-nav="sub-toggle"][aria-expanded="true"]'
    );

    openSubMenuToggles.forEach(function (openSubMenuToggle) {
        updateAria(openSubMenuToggle, 'expanded');
    });

    const openSubSubMenuToggles = document.querySelectorAll(
        '[data-meom-nav="sub-sub-toggle"][aria-expanded="true"]'
    );

    openSubSubMenuToggles.forEach(function (openSubSubMenuToggle) {
        updateAria(openSubSubMenuToggle, 'expanded');
    });

    return this;
}

export default Navigation;
  