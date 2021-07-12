/**
 * Apply a CSS animation to an element
 *
 * @param {Node}    elem      The element to animate.
 * @param {string}  animation Class name for animation.
 * @param {boolean} hide      Class name for hiding animated element.
 */
const animate = (elem, animation, hide) => {
    // If there's no element or animation, do nothing.
    if (!elem || !animation) {
        return;
    }

    // Apply the animation.
    elem.classList.add(animation);

    // Detect when the animation ends.
    elem.addEventListener(
        'animationend',
        function endAnimation() {
            // Remove the animation class.
            elem.classList.remove(animation);

            // If the element should be hidden, hide it.
            if (hide) {
                elem.classList.remove(hide);
            }

            // Remove this event listener.
            elem.removeEventListener('animationend', endAnimation, false);
        },
        false
    );
};

export default animate;
