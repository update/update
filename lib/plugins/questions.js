
var lib = require('../');
var utils = lib.utils;

module.exports = function (options) {
  return function (app) {
    var opts = utils.merge({}, options, app.get('options.questions'));
    this.questions = utils.questions(opts);

    /**
     * Ask a question, or use a pre-existing value
     * to populate the answer.
     */

    this.ask = function (locals) {
      var ctx = utils.merge({}, this.cache.data, locals || {});
      return utils.ask({
        questions: this.questions,
        store: this.store,
        data: ctx
      });
    };

    /**
     * Set a question to ask at a later point.
     */

    this.question = function () {
      this.questions.set.apply(this.questions, arguments);
      return this;
    };
    return this;
  };
};
