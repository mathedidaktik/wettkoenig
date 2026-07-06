(function () {
    // Nur aktiv, wenn die Seite tatsächlich in einem iframe eingebettet ist
    if (window.self === window.parent) {
        return;
    }

    var container = document.querySelector('.container');
    var footer = document.getElementById('footer');

    function getContentHeight() {
        var containerHeight = container ? container.getBoundingClientRect().height : document.documentElement.scrollHeight;
        var footerHeight = 0;

        if (footer) {
            // #footer ist "position: fixed" und zählt daher nicht zur
            // scrollHeight des Dokuments -> Höhe + Abstand manuell dazurechnen
            var footerBottomGap = parseFloat(getComputedStyle(footer).bottom) || 0;
            footerHeight = footer.getBoundingClientRect().height + footerBottomGap;
        }

        return Math.ceil(containerHeight + footerHeight);
    }

    var lastHeight = 0;

    function sendHeight() {
        var height = getContentHeight();
        if (height === lastHeight) {
            return;
        }
        lastHeight = height;
        window.parent.postMessage({ type: 'wettkoenig:resize', height: height }, '*');
    }

    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);

    if ('ResizeObserver' in window) {
        new ResizeObserver(sendHeight).observe(document.body);
    }

    sendHeight();
})();
