/**
 * Composes modules which provide Intent and Entity analysis capabilities, in this case Rasa NLU.
 */

// services
const rasa = require('./rasa.js');

exports.parse = parse;

function parse(question, callback) {
    console.log("Classifier Parse");
    rasa.parse(question, callback);
}
