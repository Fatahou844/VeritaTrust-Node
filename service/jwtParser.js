const jwt = require('jsonwebtoken')
const HOTKEY = "AHDHUDSuieahureuheu322423"

const extractBearer = (req) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        return authHeader.split(' ')[1]
    }
    return null
}

const verifyToken = (req, res, next) => {
        //extract token from header
        const token = extractBearer(req)
        //if token exists, verify token
        if (token) {
            jwt.verify(token, HOTKEY, {algorithm: 'HS256'},(err, decoded) => {
                //if token is invalid, send error
                if (err) {
                    res.status(401).send('Unauthorized')
                }
                //if token is valid, add user to request and continue
                else {
                    req.user = decoded
                    next()
                }
            })
        }
        //if token doesn't exist, send error
        else {
            res.status(401).send('Unauthorized')
        }
}