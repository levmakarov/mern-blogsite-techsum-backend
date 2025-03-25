
const admin = require('firebase-admin')
const serviceKey = require('./firebase-key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceKey)
})

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if(token == undefined)
        console.log("Not authorized")

    if(!token)
        return res.status(401).send("Unauthorized")

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).send("Invalid Token");
    }
}

const checkToken = async (token) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    }
    catch (error) {
        return "";
    }
}

module.exports = {verifyToken, checkToken};