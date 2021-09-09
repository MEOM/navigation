# MEOM navigation

MEOM navigation gives head start for two types of
navigations:

1. "Click" navigation where sub menus open only on click.
1. "Hover" navigation where sub menus open on hover also.

It's designed for WordPress navigation markup but can be tweaked for different use cases.

## Demos
- ["Click" Demo](https://meom.github.io/navigation/demo/).
- ["Hover" Demo](https://meom.github.io/navigation/demo/hover.html).
 - Note that we don't actually open sub menus on hover in the demo. That's because we don't have the logic to close sub menus with Esc-key if they are opened with mouse hover. That's up to you.
- [Multiple navs Demo](https://meom.github.io/navigation/demo/multiple-navs-header.html).
- [Header and Footer navs](https://meom.github.io/navigation/demo/multiple-navs.html).

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

## Markup

Recommended markup is using landmark `nav` with list of links.

```html
<nav class="site-nav js-site-nav">
    <button
    class="site-nav__toggle js-site-nav-toggle" aria-controls="site-nav__items"
    aria-expanded="false"
    >
    Menu
    </button>
    <ul class="site-nav__items js-site-nav-items" id="site-nav__items">
        <li><a href="#">Home</a></li>
        <li class="menu-item-has-children">
            <a href="#">About</a>
            <ul class="sub-menu">
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Company values</a></li>
            <li><a href="#">Staff</a></li>
            <li><a href="#">More info</a></li>
            </ul>
        </li>
        <li class="menu-item-has-children">
            <a href="#">Services</a>
            <ul class="sub-menu">
            <li><a href="#">Design</a></li>
            <li><a href="#">WordPress</a></li>
            <li class="menu-item-has-children"><a href="#">Hosting</a>
                <ul class="sub-menu">
                    <li><a href="#">Premium</a></li>
                    <li><a href="#">Even better</a></li>
                    <li><a href="#">The fastest</a>
                </ul>
            </li>
            <li><a href="#">Helping</a></li>
            </ul>
        </li>
        <li><a href="#">Blog</a></li>
    </ul>
</nav>
```

With this markup our JS would look like this:

```js
import { Navigation } from '@meom/navigation';

// Mandatory elements.
const navElement = document.querySelector('.js-site-nav-items');
const navToggle = document.querySelector('.js-site-nav-toggle');

// Bail if there is no nav nor toggle button.
if (!navElement || !navToggle) {
    return;
}

new Navigation(navElement, navToggle);
```

## Options

There are several settings (object) which you can pass in as third argument:

```js
new Navigation(navElement, navToggle, {
    action: 'click',
    subNavAnchors: '.js-site-nav-items > .menu-item-has-children > a',
    subSubNavAnchors: '.js-site-nav-items .sub-menu > .menu-item-has-children > a',
    toggleNavClass: true,
    toggleNavClassValue: 'is-opened',
    toggleSubNavClassValue: 'is-opened',
    closeNavOnEscKey: true,
    closeNavOnLastTab: false,
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

### action (string)
Accepted values are either `click` or `hover`. Defaults to `click`.

More info in the section [Features and thinking](#features-and-thinking).

### subNavAnchors (string)
Targets **top level anchors** which have sub menus.

In most cases this needs to be changed because it's hard to know classes used in your markup.

Defaults to `.js-site-nav-items > .menu-item-has-children > a`.

### subSubNavAnchors (string)
Targets **sub menu anchors** which have sub menus.

In most cases this needs to be changed because it's hard to know classes used in your markup.

Defaults to `.js-site-nav-items .sub-menu > .menu-item-has-children > a`.


### toggleNavClass (boolean)
If `true`, we toggle class provided in `toggleNavClassValue` in the  element we show and hide on smaller screens.

Defaults to `true`.

### toggleNavClassValue (string)
Class we toggle in the element we show and hide on smaller screens.

Defaults to `is-opened`.

### toggleSubNavClassValue (string)
Class we toggle in the sub menus.

Defaults to `is-opened`.

### closeNavOnEscKey (boolean)
By default script closes navigation when pressing ESC key.

Defaults to `true`.

### closeNavOnLastTab (boolean)
Sometimes it's useful to close to navigation when Tab key is used on the last navigation anchor.

Defaults to `false`.

### animateSubNavClass (string)
Script have basic animation helpers but animations can be done with CSS alone.

Defaults to `''`.

### visuallyHiddenClass (string)
Visually hidden class.

Defaults to `screen-reader-text`.

### expandChildNavText (string)
Text for expanding sub menus.

Default to `Sub menu`.

### dropDownIcon (string)
Icon (SVG) inside buttons which triggeres sub menus.

### onCreate (function)
Runs when script creates it's magic. `navElement` and `navToggle` are passed in as arguments.

Example:

```js
onCreate: function (navElement, navToggle) {
    // Do something
},
```

### onOpenNav (function)
Runs when navigation opens. `navElement`, `navToggle` and `event` are passed in as arguments.

Example:

```js
onOpenNav: function (navElement, navToggle, event) {
    // Do something
},
```

### onCloseNav (function)
Runs when navigation closes. `navElement`, `navToggle` and `event` are passed in as arguments.

Example:

```js
onCloseNav: function (navElement, navToggle, event) {
    // Do something
},
```

### onOpenSubNav (function)
Runs when sub menu opens. `navElement`, `navToggle`, `submenu` and `event` are passed in as arguments.

Example:

```js
onOpenSubNav: function (navElement, navToggle, submenu, event) {
    // Do something
},
```

### onCloseSubNav (function)
Runs when sub menu closes. `navElement`, `navToggle`, `submenu` and `event` are passed in as arguments.

Example:

```js
onCloseSubNav: function (navElement, navToggle, submenu, event) {
    // Do something
},
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
- [In Finnish: How to build accessible navigation](https://www.eficode.com/fi/blog/miten-navigaatiovalikko-toteutetaan-saavutettavasti).
