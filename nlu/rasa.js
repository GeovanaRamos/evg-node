/**
 * A wrapper over Rasa NLU's REST API. 
 */

const request = require('request');

exports.parse = parse;

/**
 * Request Rasa NLU to parse a message. Results are provided via the callback.
 */
function parse(question, callback) {
    console.log("Rasa Parse, message: " + question);
    request(createParseRequest(question), function(error, response, body) {
        
        console.log('rasa: response - ', response && response.statusCode);
        
        var string = JSON.stringify(body);
        var objectValue = JSON.parse(string);

        if (error) callback(error);
        if (body) callback(null, objectValue[0].text, question);
        
    });
}


function createParseRequest(message) {
    return {
        method: 'POST',
        uri: 'http://localhost:5005/webhooks/rest/webhook',
        json: true,
        body: {
            'message': message
        }
    }
}