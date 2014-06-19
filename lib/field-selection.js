(function($, exports, window) {

if (!exports) {
    exports = {};
    if (!$) {
        window.fieldSelection = exports;
    }
}

if ($) {
    /**
     * Extend jQuery's prototype
     * @param {String} [text]
     * @return {Object|jQuery}
     */
    $.fn.fieldSelection = function(text) {
        var ret;

        this.each(function() {
            this.focus();
            ret = text == null ? exports.get(this) : exports.replace(this, text);
        });

        return ret || this;
    };
}

/**
 * Get selection.
 *
 * @param {Object} elem
 * @return {Object}
 */
exports.get = function(elem) {
    var data = {start: 0, end: elem.value.length, length: 0},
        range, textRange, dTextRange;

    // DOM 3
    if (elem.selectionStart >= 0) {
        data.start = elem.selectionStart;
        data.end = elem.selectionEnd;
        data.length = data.end - data.start;
        data.text = elem.value.substr(data.start, data.length);
    // IE
    } else if (elem.ownerDocument.selection) {
        range = elem.ownerDocument.selection.createRange();
        if (!range) return data;
        textRange = elem.createTextRange(),
        dTextRange = textRange.duplicate();
        textRange.moveToBookmark(range.getBookmark());
        dTextRange.setEndPoint('EndToStart', textRange);
        data.start = dTextRange.text.length;
        data.end = dTextRange.text.length + range.text.length;
        data.text = range.text;
        data.length = range.text.length;
    }

    return data;
}

/**
 * Set selection or caret position.
 *
 * @param {Object} elem
 * @param {Integer} start
 * @param {Integer} end
 */
exports.set = function(elem, start, end) {
    end = end || start;
    
    if (elem.createTextRange) {
        var selRange = elem.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end);
        selRange.select();
        field.focus();
    
    } else if (elem.setSelectionRange) {
        elem.focus();
        elem.setSelectionRange(start, end);
    
    } else if (typeof elem.selectionStart != 'undefined') {
        elem.selectionStart = start;
        elem.selectionEnd = end;
        elem.focus();
    }
}

/**
 * Replace selection.
 *
 * @param {Object} elem
 * @param {String} text
 */
exports.replace = function(elem, text) {
    var start, end,
        pos, scrollTop, scrollLeft,
        range;

    // DOM 3
    if (elem.selectionStart >= 0) {
        start = elem.selectionStart;
        end = elem.selectionEnd;
        scrollTop = elem.scrollTop;
        scrollLeft = elem.scrollLeft;
        elem.value = elem.value.substr(0, start) + text + elem.value.substr(end);
        pos = start + text.length;
        elem.selectionStart = pos;
        elem.selectionEnd = pos;

        // Restore scroll position in FF after replacement.
        elem.scrollTop = scrollTop;
        elem.scrollLeft = scrollLeft;
    // IE
    } else if (elem.ownerDocument.selection) {
        range = elem.ownerDocument.selection.createRange();
        range.text = text;
        range.move('character', 0);
        range.select();
    } else {

        // Browser not supported - set at the end.
        elem.value += text;

        // Scroll to the end of textarea to show inserted.
        elem.scrollTop = 100000;
    }
};

}(typeof jQuery != 'undefined' ? jQuery : null,
  typeof exports != 'undefined' ? exports : null,
  window));
