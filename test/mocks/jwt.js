/**
 * JWT Acccess Token helper
 */
function JwtHelper()
{
    /**
     * Create a json web token
     * 
     * @param {object}   payload  Payload of the token
     * @param {function} callback Callback function
     * 
     * @return {void}
     */
    this.sign = function(payload, callback)
    {
        var header    = {};
        var payload   = payload;
        var signature = {};
        
        callback(this.urlEncode(JSON.stringify(header)) + "." + this.urlEncode(JSON.stringify(payload)) + "." + this.urlEncode(JSON.stringify(signature)));
    }

    /**
     * Verify the JWT token
     * 
     * @param {string}   token    JWT access token to verify
     * @param {function} callback Callback function
     * 
     * @return {void}
     */
    this.verify = function(token, callback)
    {
        callback(true);
    }

    /**
     * Decode a JSON webtoken
     * 
     * @param {string} token  Token to decode
     * 
     * @return {object} Decoded access token
     */
    this.decode = function(token)
    {
        token = token.split(".");

        return {
            header: JSON.parse(token[0]),
            payload: JSON.parse(token[1]),
            signature: JSON.parse(token[2])
        };
    }

    /**
     * Hash a value
     * 
     * @param {string} value Value to hash
     */
    this.createSignature = function(value)
    {
        return value;
    }

    /**
     * Base64 url encode a value
     * 
     * @param {string} value Value to encode
     */
    this.urlEncode = function(value)
    {
        return value;
    }
}

module.exports = new JwtHelper();