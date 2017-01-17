/**
 * JWT Acccess Token helper
 */
function JwtHelper()
{
    this.secret = "MvS5oUNm6w3jBBjTTYuiA9qv";

    /**
     * Create a json web token
     */
    this.sign = function(body) {
        base64url(JSON.stringify({"alg": "HS256","typ": "JWT"}));
    }
}