/* Import internal depedencies. */
import animate from './helpers/animate';
import updateAria from './helpers/updateAria';

const TAB_KEY = 9;
const ESCAPE_KEY = 27;

/**
 * Define the constructor to instantiate a navigation.
 *
 * @class
 * @param {Object} element Navigation element.
 * @param {Object} toggle  Navigation toggle element.
 * @param {Object} options The settings and options for this instance.
 */
function Navigation(element, toggle, options = {}) {
    // Default settings.
    const defaults = {
        action: 'click',
        subNavAnchors: '.js-site-nav-items > .menu-item-has-children > a',
        subSubNavAnchors:
            '.js-site-nav-items .sub-menu > .menu-item-has-children > a',
        toggleNavClass: true,
        toggleNavClassValue: 'is-opened',
        toggleSubNavClassValue: 'is-opened',
        closeNavOnEscKey: true,
        closeNavOnLastTab: false,
        closeNavOnDocClick: true,
        subNavClass: '.sub-menu',
        subToggleButtonClasses: '',
        subSubToggleButtonClasses: '',
        animateSubNav: false,
        animateSubNavClass: '',
        visuallyHiddenClass: 'screen-reader-text',
        expandChildNavText: 'Sub menu',
        dropDownIcon:
            '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path></svg>',
        onCreate: null,
        onOpenNav: null,
        onCloseNav: null,
        onOpenSubNav: null,
        onCloseSubNav: null,
    };

    // Bind methods.
    this._handleNav = this.handleNav.bind(this);
    this._handleSubNav = this.handleSubNav.bind(this);
    this._handleCloseNav = this.handleCloseNav.bind(this);
    this._handleCloseSubNav = this.handleCloseSubNav.bind(this);
    this._closeAllSubMenus = this.closeAllSubMenus.bind(this);
    this._closeAllSubSubMenus = this.closeAllSubSubMenus.bind(this);
    this._setSubMenu = this.setSubMenu.bind(this);
    this._closeAllSubMenuToggles = this.closeAllSubMenuToggles.bind(this);
    this._closeAllSubSubMenuToggles = this.closeAllSubSubMenuToggles.bind(this);
    this._handleDocClick = this.handleDocClick.bind(this);
    this._handleFocus = this.handleFocus.bind(this);

    // Merge options to defaults.
    const settings = { ...defaults, ...options };

    // Set elements and settings.
    this.$element = element;
    this.$toggle = toggle;
    this.settings = settings;
    this.navOpened = false;

    // Set all sub and sub sub navigations.
    this.$subNavs = this.$element.querySelectorAll(this.settings.subNavAnchors);
    this.$subSubNavs = this.$element.querySelectorAll(
        this.settings.subSubNavAnchors
    );

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
        subToggleButton.setAttribute('aria-expanded', 'false');

        subToggleButton.className = `${this.settings.subToggleButtonClasses}`;
        subToggleButton.type = 'button';

        if (this.settings.action === 'click') {
            // Allow HTML
            subToggleButton.innerHTML = `${subNav.innerHTML}${this.settings.dropDownIcon}`;
        }

        if (this.settings.action === 'hover') {
            subToggleButton.innerHTML = `<span class="${this.settings.visuallyHiddenClass}">${this.settings.expandChildNavText}</span>${this.settings.dropDownIcon}`;
        }

        // Add toggle button after anchor.
        subNav.after(subToggleButton);
    }, this);

    // Setup sub sub navs toggle buttons.
    this.$subSubNavs.forEach(function (subSubNav, index) {
        const subToggleButton = document.createElement('button');
        subToggleButton.setAttribute('data-meom-nav', 'sub-sub-toggle');
        subToggleButton.setAttribute('aria-expanded', 'false');

        subToggleButton.setAttribute('aria-controls', `sub-sub-menu-${index}`);
        // Add matching id for next sub-sub-menu.
        if (subSubNav.nextElementSibling) {
            subSubNav.nextElementSibling.id = `sub-sub-menu-${index}`;
        }

        subToggleButton.className = `${this.settings.subSubToggleButtonClasses}`;
        subToggleButton.type = 'button';

        subToggleButton.innerHTML = `<span class="${this.settings.visuallyHiddenClass}">${this.settings.expandChildNavText}</span>${this.settings.dropDownIcon}`;

        // Add toggle button after anchor.
        subSubNav.after(subToggleButton);
    }, this);

    // Set event listeners.
    this.$toggle.addEventListener('click', this._handleNav, false);
    this.$element.addEventListener('click', this._handleSubNav, false);
    document.addEventListener('keydown', this._handleCloseNav, false);
    this.$element.addEventListener('keydown', this._handleCloseSubNav, false);
    this.$element.addEventListener('keydown', this._handleFocus, false);
    document.addEventListener('click', this._handleDocClick, false);

    /**
     * Called after the component is initialized.
     *
     * @callback onCreate
     */
    if (
        this.settings.onCreate &&
        typeof this.settings.onCreate === 'function'
    ) {
        this.settings.onCreate(this.$element, this.$toggle);
    }

    return this;
};

/**
 * Handle navigation opening and closing.
 *
 * @param {Event} event
 * @return {this} this
 */
Navigation.prototype.handleNav = function (event) {
    // If navigation is closed and we want to open it.
    if (!this.navOpened) {
        updateAria(this.$toggle, 'expanded');

        if (this.settings.toggleNavClass) {
            this.$element.classList.add(this.settings.toggleNavClassValue);
        }

        // Set navigation as opened.
        this.navOpened = true;

        /**
         * Called after the nav is opened.
         *
         * @callback onOpenNav
         */
        if (
            this.settings.onOpenNav &&
            typeof this.settings.onOpenNav === 'function'
        ) {
            this.settings.onOpenNav(this.$element, this.$toggle, event);
        }
    } else {
        updateAria(this.$toggle, 'expanded');

        if (this.settings.toggleNavClass) {
            this.$element.classList.remove(this.settings.toggleNavClassValue);
        }

        // Set focus back to toggle button.
        if (this.$toggle) {
            this.$toggle.focus();
        }

        // Set navigation as closed.
        this.navOpened = false;

        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();

        /**
         * Called after the nav is closed.
         *
         * @callback onCloseNav
         */
        if (
            this.settings.onCloseNav &&
            typeof this.settings.onCloseNav === 'function'
        ) {
            this.settings.onCloseNav(this.$element, this.$toggle, event);
        }
    }

    return this;
};

/**
 * Handle sub navigation opening and closing.
 *
 * @param {Event} event
 * @return {this} this
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
        !target.nextElementSibling.classList.contains(
            this.settings.toggleSubNavClassValue
        ) &&
        !target.matches('[data-meom-nav="sub-sub-toggle"]')
    ) {
        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();
    }

    // Then again, close all sub sub menus when trying to open any other sub sub menu that is not already open.
    // So that only one sub sub menu can be open at current time.
    if (
        !target.nextElementSibling.classList.contains(
            this.settings.toggleSubNavClassValue
        ) &&
        target.matches('[data-meom-nav="sub-sub-toggle"]')
    ) {
        this._closeAllSubSubMenus(target);
        this._closeAllSubSubMenuToggles(target);
    }

    // Update sub toggle ARIA.
    updateAria(target, 'expanded');

    // Toggle class for next <ul> element (sub-menu).
    if (target.nextElementSibling) {
        this._setSubMenu(target.nextElementSibling, event);
    }

    return this;
};

/**
 * Handle closing nav with Esc key.
 *
 * @param {Object} event Event triggered.
 * @return {this} this
 */
Navigation.prototype.handleCloseNav = function (event) {
    // Close nav on Esc key if nav is open.
    if (
        this.navOpened &&
        this.settings.closeNavOnEscKey &&
        ESCAPE_KEY === event.keyCode
    ) {
        this._handleNav(event);
    }

    return this;
};

/**
 * Handle closing sub-nav with Tab or Esc key.
 *
 * @param {Object} event Event triggered.
 * @return {this} this
 */
Navigation.prototype.handleCloseSubNav = function (event) {
    // Set focusable elements inside sub-menu element.
    const openSubMenu = document.querySelector(
        `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );

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
        const parentSubMenu = event.target.closest(
            `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
        );

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
};

/**
 * Handle focus when nav is open.
 *
 * @param {Object} event Event triggered.
 * @return {this} this
 */
Navigation.prototype.handleFocus = function (event) {
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
};

/**
 * Handle closing sub-navs when clicking outside of nav.
 *
 * @param {Object} event Event triggered.
 * @return {this} this
 */
Navigation.prototype.handleDocClick = function (event) {
    // Bail if clicking inside the nav.
    if (event.target.closest('[data-meom-nav="navigation"]')) {
        return this;
    }

    // Bail if `closeNavOnDocClick` setting is not set to true.
    if (!this.settings.closeNavOnDocClick) {
        return this;
    }

    this._closeAllSubMenus();
    this._closeAllSubMenuToggles();

    return this;
};

/**
 * Close all sub menus.
 *
 * @return {this} this
 */
Navigation.prototype.closeAllSubMenus = function () {
    const openSubMenus = document.querySelectorAll(
        `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );

    openSubMenus.forEach(function (openSubMenu) {
        this._setSubMenu(openSubMenu);
    }, this);

    return this;
};

/**
 * Close only same level sub sub menus.
 *
 * @param {Object} target Target triggered.
 * @return {this} this
 */
Navigation.prototype.closeAllSubSubMenus = function (target) {
    const sameLevelParentSubMenu = target.closest(
        `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );

    // Get same level sub sub menus
    const openSubSubMenus = sameLevelParentSubMenu.querySelectorAll(
        `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );

    openSubSubMenus.forEach(function (openSubSubMenu) {
        this._setSubMenu(openSubSubMenu);
    }, this);

    return this;
};

/**
 * Set classes and animate for sub-menu.
 *
 * @param {Node}   submenu Sub menu node.
 * @param {Object} event   Event.
 * @return {this} this
 */
Navigation.prototype.setSubMenu = function (submenu, event) {
    if (!submenu) {
        return this;
    }

    if (!submenu.classList.contains(this.settings.toggleSubNavClassValue)) {
        submenu.classList.add(this.settings.toggleSubNavClassValue);

        // Base animation with class.
        if (this.settings.animateSubNav) {
            animate(submenu, this.settings.animateSubNavClass);
        }

        /**
         * Called after the sub nav is opened.
         *
         * @callback onOpenSubNav
         */
        if (
            this.settings.onOpenSubNav &&
            typeof this.settings.onOpenSubNav === 'function'
        ) {
            this.settings.onOpenSubNav(
                this.$element,
                this.$toggle,
                submenu,
                event
            );
        }
    } else {
        submenu.classList.remove(this.settings.toggleSubNavClassValue);

        /**
         * Called after the sub nav is closed.
         *
         * @callback onCloseSubNav
         */
        if (
            this.settings.onCloseSubNav &&
            typeof this.settings.onCloseSubNav === 'function'
        ) {
            this.settings.onCloseSubNav(
                this.$element,
                this.$toggle,
                submenu,
                event
            );
        }
    }

    return this;
};

/**
 * Close all sub menu toggles.
 *
 * @return {this} this
 */
Navigation.prototype.closeAllSubMenuToggles = function () {
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
};

/**
 * Close all same level sub sub menu toggles.
 *
 * @param {Object} target Target.
 * @return {this} this
 */
Navigation.prototype.closeAllSubSubMenuToggles = function (target) {
    const sameLevelParentSubMenu = target.closest(
        `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );

    const openSubSubMenuToggles = sameLevelParentSubMenu.querySelectorAll(
        '[data-meom-nav="sub-sub-toggle"][aria-expanded="true"]'
    );

    openSubSubMenuToggles.forEach(function (openSubSubMenuToggle) {
        updateAria(openSubSubMenuToggle, 'expanded');
    });

    return this;
};

export default Navigation;
