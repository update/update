'use strict';

/**
 * Lazily required module dependencies
 */

var lazy = require('lazy-cache')(require);

// type utils
lazy('mixin-deep', 'merge');
lazy('for-own');

// engine/template utiles
lazy('ask-once', 'ask');
lazy('parser-front-matter', 'matter');
lazy('question-cache', 'questions');
lazy('data-store', 'store');
lazy('resolve-dir', 'resolve');

/**
 * Expose utils
 */

module.exports = lazy;
