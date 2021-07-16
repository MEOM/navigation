# MEOM navigation

MEOM navigation component is work in progress. It gives head start for two types of
navigations:

1. "Click" navigation where sub menus open only on click.
1. "Hover" navigation where sub menus open on hover also.

It's designed for WordPress navigation markup but can be tweaked for different use cases.

## Usage

If you’re using a bundler (such as Webpack or Rollup), you can install `@meom/navigation` through npm like any other dependency:

Note, not yet available in NPM!

```bash
npm install @meom/navigation
```

Then you can import the library in your JavaScript and instantiate your navigation.

```js
import { Navigation } from '@meom/navigation';

// Mandatory elements.
const navElement = document.querySelector('.my-nav-wrapper');
const navToggle = document.querySelector('.my-nav-toggle');

// Bail if there is no nav nor toggle button.
if (!navElement || !navToggle) {
    return;
}

new Navigation(navElement, navToggle);
```

You can also import helper functions and use them in your Javascript.

```js
import { Navigation, animate, updateAria } from '@meom/navigation';
```

### Mandatory elements

There are two mandatory elements:

1. `navElement` - Element which is hidden and releaved on smaller screens.
1. `navToggle` - `<button>` element which trickers the `navElement`.

## Options

There are several settings (object) which you can pass in as third argument:

```js
new Navigation(navElement, navToggle, {
    action: 'click',
    toggleNavClass: true,
    navClass: 'is-opened',
    closeNavOnEscKey: true,
    closeNavOnLastTab: false,
    subNavAnchors: '.menu-item-has-children.is-item-level-0 > a',
    subSubNavAnchors: 'ul .menu-item-has-children > a',
    subNavClass: '.sub-menu',
    subToggleButtonClasses: '',
    subSubToggleButtonClasses: '',
    animateSubNav: false,
    animateSubNavClass: '',
    visuallyHiddenClass: 'screen-reader-text',
    expandChildNavText: 'Child menu',
    dropDownIcon:
        '<svg class="icon" aria-hidden="true" focusable="false" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4.793 4.793a1 1 0 001.414 0L12 1" stroke-width="2" stroke-linecap="round"></path></svg>',

    onCreate: null,
    onOpenNav: null,
    onCloseNav: null,
    onOpenSubNav: null,
    onCloseSubNav: null,
});
```
