(() => {
  // ../dist/index.esm.js
  function animate(elem, animation, hide) {
    if (!elem || !animation) {
      return;
    }
    elem.classList.add(animation);
    elem.addEventListener(
      "animationend",
      function endAnimation() {
        elem.classList.remove(animation);
        if (hide) {
          elem.classList.remove(hide);
        }
        elem.removeEventListener("animationend", endAnimation, false);
      },
      false
    );
  }
  function updateAria(el, aria) {
    if ("undefined" === typeof el || 0 >= aria.length) {
      return;
    }
    const hiddenEl = "true" === el.getAttribute(`aria-${aria}`) ? "false" : "true";
    el.setAttribute(`aria-${aria}`, hiddenEl);
  }
  var TAB_KEY = 9;
  var ESCAPE_KEY = 27;
  function Navigation(element, toggle, options = {}) {
    const defaults = {
      action: "click",
      subNavAnchors: ".js-site-nav-items > .menu-item-has-children > a",
      subSubNavAnchors: ".js-site-nav-items .sub-menu > .menu-item-has-children > a",
      toggleNavClass: true,
      toggleNavClassValue: "is-opened",
      toggleSubNavClassValue: "is-opened",
      closeNavOnEscKey: true,
      closeNavOnLastTab: false,
      subNavClass: ".sub-menu",
      subToggleButtonClasses: "",
      subSubToggleButtonClasses: "",
      animateSubNav: false,
      animateSubNavClass: "",
      visuallyHiddenClass: "screen-reader-text",
      expandChildNavText: "Sub menu",
      dropDownIcon: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path></svg>',
      onCreate: null,
      onOpenNav: null,
      onCloseNav: null,
      onOpenSubNav: null,
      onCloseSubNav: null
    };
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
    const settings = { ...defaults, ...options };
    this.$element = element;
    this.$toggle = toggle;
    this.settings = settings;
    this.navOpened = false;
    this.$subNavs = this.$element.querySelectorAll(this.settings.subNavAnchors);
    this.$subSubNavs = this.$element.querySelectorAll(
      this.settings.subSubNavAnchors
    );
    this.create();
  }
  Navigation.prototype.create = function() {
    this.$toggle.setAttribute("aria-expanded", "false");
    this.$element.setAttribute("data-meom-nav", "navigation");
    this.$subNavs.forEach(function(subNav) {
      if (this.settings.action === "click") {
        subNav.setAttribute("hidden", "");
      }
      const subToggleButton = document.createElement("button");
      subToggleButton.setAttribute("data-meom-nav", "sub-toggle");
      subToggleButton.setAttribute("aria-expanded", "false");
      subToggleButton.className = `${this.settings.subToggleButtonClasses}`;
      subToggleButton.type = "button";
      if (this.settings.action === "click") {
        subToggleButton.innerHTML = `${subNav.textContent}${this.settings.dropDownIcon}`;
      }
      if (this.settings.action === "hover") {
        subToggleButton.innerHTML = `<span class="${this.settings.visuallyHiddenClass}">${this.settings.expandChildNavText}</span>${this.settings.dropDownIcon}`;
      }
      subNav.after(subToggleButton);
    }, this);
    this.$subSubNavs.forEach(function(subSubNav, index) {
      const subToggleButton = document.createElement("button");
      subToggleButton.setAttribute("data-meom-nav", "sub-sub-toggle");
      subToggleButton.setAttribute("aria-expanded", "false");
      subToggleButton.setAttribute("aria-controls", `sub-sub-menu-${index}`);
      if (subSubNav.nextElementSibling) {
        subSubNav.nextElementSibling.id = `sub-sub-menu-${index}`;
      }
      subToggleButton.className = `${this.settings.subSubToggleButtonClasses}`;
      subToggleButton.type = "button";
      subToggleButton.innerHTML = `<span class="${this.settings.visuallyHiddenClass}">${this.settings.expandChildNavText}</span>${this.settings.dropDownIcon}`;
      subSubNav.after(subToggleButton);
    }, this);
    this.$toggle.addEventListener("click", this._handleNav, false);
    this.$element.addEventListener("click", this._handleSubNav, false);
    document.addEventListener("keydown", this._handleCloseNav, false);
    this.$element.addEventListener("keydown", this._handleCloseSubNav, false);
    this.$element.addEventListener("keydown", this._handleFocus, false);
    document.addEventListener("click", this._handleDocClick, false);
    if (this.settings.onCreate && typeof this.settings.onCreate === "function") {
      this.settings.onCreate(this.$element, this.$toggle);
    }
    return this;
  };
  Navigation.prototype.handleNav = function(event) {
    if (!this.navOpened) {
      updateAria(this.$toggle, "expanded");
      if (this.settings.toggleNavClass) {
        this.$element.classList.add(this.settings.toggleNavClassValue);
      }
      this.navOpened = true;
      if (this.settings.onOpenNav && typeof this.settings.onOpenNav === "function") {
        this.settings.onOpenNav(this.$element, this.$toggle, event);
      }
    } else {
      updateAria(this.$toggle, "expanded");
      if (this.settings.toggleNavClass) {
        this.$element.classList.remove(this.settings.toggleNavClassValue);
      }
      if (this.$toggle) {
        this.$toggle.focus();
      }
      this.navOpened = false;
      this._closeAllSubMenus();
      this._closeAllSubMenuToggles();
      if (this.settings.onCloseNav && typeof this.settings.onCloseNav === "function") {
        this.settings.onCloseNav(this.$element, this.$toggle, event);
      }
    }
    return this;
  };
  Navigation.prototype.handleSubNav = function(event) {
    const target = event.target;
    const closestSubButton = target.closest('[data-meom-nav="sub-toggle"]');
    const closestSubSubButton = target.closest(
      '[data-meom-nav="sub-sub-toggle"]'
    );
    if (!closestSubButton && !closestSubSubButton) {
      return this;
    }
    if (!target.nextElementSibling.classList.contains(
      this.settings.toggleSubNavClassValue
    ) && !target.matches('[data-meom-nav="sub-sub-toggle"]')) {
      this._closeAllSubMenus();
      this._closeAllSubMenuToggles();
    }
    if (!target.nextElementSibling.classList.contains(
      this.settings.toggleSubNavClassValue
    ) && target.matches('[data-meom-nav="sub-sub-toggle"]')) {
      this._closeAllSubSubMenus();
      this._closeAllSubSubMenuToggles();
    }
    updateAria(target, "expanded");
    if (target.nextElementSibling) {
      this._setSubMenu(target.nextElementSibling, event);
    }
    return this;
  };
  Navigation.prototype.handleCloseNav = function(event) {
    if (this.navOpened && this.settings.closeNavOnEscKey && ESCAPE_KEY === event.keyCode) {
      this._handleNav(event);
    }
    return this;
  };
  Navigation.prototype.handleCloseSubNav = function(event) {
    const openSubMenu = document.querySelector(
      `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );
    if (openSubMenu) {
      const focusableElements = openSubMenu.querySelectorAll([
        "a[href]",
        "area[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "button:not([disabled])"
      ]);
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      if (TAB_KEY === event.keyCode && !event.shiftKey && event.target === lastFocusableElement) {
        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();
      }
      const subMenuToggle = openSubMenu.previousElementSibling;
      if (subMenuToggle && TAB_KEY === event.keyCode && event.shiftKey && event.target === subMenuToggle) {
        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();
      }
    }
    if (ESCAPE_KEY === event.keyCode) {
      if (event.target.matches(
        '[data-meom-nav="sub-toggle"][aria-expanded="true"]'
      )) {
        this._handleSubNav(event);
        this._closeAllSubMenus();
        this._closeAllSubMenuToggles();
        return this;
      }
      const parentSubMenu = event.target.closest(
        `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
      );
      if (parentSubMenu) {
        const subMenuToggle = parentSubMenu.previousElementSibling;
        if (subMenuToggle) {
          subMenuToggle.focus();
        }
      }
      this._closeAllSubMenus();
      this._closeAllSubMenuToggles();
    }
    return this;
  };
  Navigation.prototype.handleFocus = function(event) {
    if (!this.navOpened) {
      return this;
    }
    if (!this.settings.closeNavOnLastTab) {
      return this;
    }
    const focusableElements = this.$element.querySelectorAll([
      "a[href]",
      "area[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])"
    ]);
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    if (TAB_KEY === event.keyCode && !event.shiftKey && event.target === lastFocusableElement) {
      event.preventDefault();
      this._handleNav(event);
    }
    return this;
  };
  Navigation.prototype.handleDocClick = function(event) {
    if (event.target.closest('[data-meom-nav="navigation"]')) {
      return this;
    }
    this._closeAllSubMenus();
    this._closeAllSubMenuToggles();
    return this;
  };
  Navigation.prototype.closeAllSubMenus = function() {
    const openSubMenus = document.querySelectorAll(
      `${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );
    openSubMenus.forEach(function(openSubMenu) {
      this._setSubMenu(openSubMenu);
    }, this);
    return this;
  };
  Navigation.prototype.closeAllSubSubMenus = function() {
    const openSubSubMenus = document.querySelectorAll(
      `${this.settings.subNavClass} ${this.settings.subNavClass}.${this.settings.toggleSubNavClassValue}`
    );
    openSubSubMenus.forEach(function(openSubSubMenu) {
      this._setSubMenu(openSubSubMenu);
    }, this);
    return this;
  };
  Navigation.prototype.setSubMenu = function(submenu, event) {
    if (!submenu) {
      return this;
    }
    if (!submenu.classList.contains(this.settings.toggleSubNavClassValue)) {
      submenu.classList.add(this.settings.toggleSubNavClassValue);
      if (this.settings.animateSubNav) {
        animate(submenu, this.settings.animateSubNavClass);
      }
      if (this.settings.onOpenSubNav && typeof this.settings.onOpenSubNav === "function") {
        this.settings.onOpenSubNav(
          this.$element,
          this.$toggle,
          submenu,
          event
        );
      }
    } else {
      submenu.classList.remove(this.settings.toggleSubNavClassValue);
      if (this.settings.onCloseSubNav && typeof this.settings.onCloseSubNav === "function") {
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
  Navigation.prototype.closeAllSubMenuToggles = function() {
    const openSubMenuToggles = document.querySelectorAll(
      '[data-meom-nav="sub-toggle"][aria-expanded="true"]'
    );
    openSubMenuToggles.forEach(function(openSubMenuToggle) {
      updateAria(openSubMenuToggle, "expanded");
    });
    const openSubSubMenuToggles = document.querySelectorAll(
      '[data-meom-nav="sub-sub-toggle"][aria-expanded="true"]'
    );
    openSubSubMenuToggles.forEach(function(openSubSubMenuToggle) {
      updateAria(openSubSubMenuToggle, "expanded");
    });
    return this;
  };
  Navigation.prototype.closeAllSubSubMenuToggles = function() {
    const openSubSubMenuToggles = document.querySelectorAll(
      '[data-meom-nav="sub-sub-toggle"][aria-expanded="true"]'
    );
    openSubSubMenuToggles.forEach(function(openSubSubMenuToggle) {
      updateAria(openSubSubMenuToggle, "expanded");
    });
    return this;
  };

  // src/navigation-multiple.js
  var navElement = document.querySelector(".js-site-nav-wrapper");
  var navToggle = document.querySelector(".js-site-nav-toggle");
  new Navigation(navElement, navToggle, {
    subNavAnchors: ".js-site-nav-wrapper > ul > .menu-item-has-children > a",
    subSubNavAnchors: ".js-site-nav-wrapper .sub-menu > .menu-item-has-children > a",
    subToggleButtonClasses: "site-nav__sub-toggle",
    subSubToggleButtonClasses: "site-nav__sub-sub-toggle",
    toggleNavClass: false,
    closeNavOnLastTab: true,
    onOpenNav: function(element) {
      document.documentElement.classList.add("overflow-hidden");
      document.documentElement.classList.add("is-site-nav-opened");
      element.classList.add("is-opened");
      animate(element, "fade-in");
    },
    onCloseNav: function(element) {
      document.documentElement.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("is-site-nav-opened");
      animate(element, "fade-out", "is-opened");
    }
  });
})();
