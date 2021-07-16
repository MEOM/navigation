/**
 * Update ARIA.
 *
 * @param {Object} el Element.
 * @param {string} aria ARIA to change.
 */
function updateAria( el, aria ) {
    if ( 'undefined' === typeof el || 0 >= aria.length ) {
        return;
    }

    const hiddenEl =
        'true' === el.getAttribute( `aria-${ aria }` ) ? 'false' : 'true';
    el.setAttribute( `aria-${ aria }`, hiddenEl );
}

export default updateAria;
