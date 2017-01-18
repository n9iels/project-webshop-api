/**
 * JWT Acccess Token helper
 */
function JwtHelper(cryptolib, base64url)
{
    this.secret    = "MvS5oUNm6w3jBBjTTYuiA9qv";
    this.crypto    = cryptolib;
    this.base64url = base64url;

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
        var header    = {alg:"HS256",typ:"JWT"};
        var payload   = Object.assign(payload, {exp: Math.floor(Date.now() / 1000) + (60 * 60)});
        var signature = this.createSignature(JSON.stringify(header) + JSON.stringify(payload));
        
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
        token = this.decode(token);

        if (token.signature == this.createSignature(JSON.stringify(token.header) + JSON.stringify(token.payload)))
        {
            callback(true);
        }
        else
        {
            callback(false)
        }
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
            header: JSON.parse(this.base64url.decode(token[0])),
            payload: JSON.parse(this.base64url.decode(token[1])),
            signature: JSON.parse(this.base64url.decode(token[2]))
        };
    }

    /**
     * Hash a value
     * 
     * @param {string} value Value to hash
     */
    this.createSignature = function(value)
    {
        return this.crypto.createHmac('sha256', this.secret).update(value).digest("hex");
    }

    /**
     * Base64 url encode a value
     * 
     * @param {string} value Value to encode
     */
    this.urlEncode = function(value)
    {
        return this.base64url(value);
    }
}

module.exports = function(cryptolib, base64url) { 
    return new JwtHelper(cryptolib, base64url);
}