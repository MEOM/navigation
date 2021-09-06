# MEOM navigation

MEOM navigation component is work in progress. It gives head start for two types of
navigations:

1. "Click" navigation where sub menus open only on click.
1. "Hover" navigation where sub menus open on hover also. Note that we don't actually open sub menus on hover in the demo. That's because we don't have the logic to close sub menus with Esc-key if they are opened with mouse hover. That's up to you.

It's designed for WordPress navigation markup but can be tweaked for different use cases.

## Demos
- ["Click" Demo](https://meom.github.io/navigation/demo/).
- ["Hover" Demo](https://meom.github.io/navigation/demo/hover.html).
- [Multiple navs Demo](https://meom.github.io/navigation/demo/multiple-navs.html).

## Usage

If you’re using a bundler (such as Webpack or Rollup), you can install `@meom/navigation` through npm like any other dependency:

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
    toggleNavClassValue: 'is-opened',
    toggleSubNavClassValue: 'is-opened',
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
    expandChildNavText: 'Sub menu',
    dropDownIcon:
        '<svg class="icon" aria-hidden="true" focusable="false" width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4.793 4.793a1 1 0 001.414 0L12 1" stroke-width="2" stroke-linecap="round"></path></svg>',

    onCreate: null,
    onOpenNav: null,
    onCloseNav: null,
    onOpenSubNav: null,
    onCloseSubNav: null,
    });
```

## Features and thinking
By default navigation script opens sub menus only on click. This happens by adding `<button>` element after `<a>` element and hiding `<a>` with `hidden` attribute.

Without JS kicking in:
```html
<li class="menu-item-has-children">
    <a href="#">About</a>
</li>
```

With JS kicking in:
```html
<li class="menu-item-has-children">
    <a href="#" hidden>About</a>
    <button>About</button>
</li>
```
Script copies link item text (About) to the button text. And there we have the button which triggeres the sub menu.

If list item doesn't have sub menu, nothing happens. Link will stay as link.

### Hover menu
What if all top level items needs to be as links no matter do they have sub menus or not?

With option `action: hover` you can do exactly that.

Without JS kicking in:
```html
<li class="menu-item-has-children">
    <a href="#">About</a>
</li>
```

With JS kicking in:
```html
<li class="menu-item-has-children">
    <a href="#">About</a>
    <button><span class="screen-reader-text">Child menu</span><svg>...</svg></button>
</li>
```
We don't add `hidden` attribute in this case to the link. And `<button>` text is visually hidden and SVG icon is indicating the sub menu.

### Other features
- Close navigation and sub menus by `Esc` key or by clicking outside of the navigation.
- Use `aria-expanded` on buttons to indicate state.
- `aria-controls` is not really supported in assistive tecnology, therefor this is not implemented.

## More reading about navigations
- [Link + Disclosure Widget Navigation](https://adrianroselli.com/2019/06/link-disclosure-widget-navigation.html) by Adrian Roselli.
- [In Praise of the Unambiguous Click Menu](https://css-tricks.com/in-praise-of-the-unambiguous-click-menu/) by Mark Root-Wiley.
