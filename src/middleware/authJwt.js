const jwt = require('jsonwebtoken');
const config = require('../../config/config')

verifyToken = (req, res) => {
    var token = req.headers['x-access-token'];
    if(!token) {
        return res.status(403).send({ message: 'No token privided'});
    }
    jwt.verify(token, config.token_secret_key, (err, decoded) => {
        if(err) {
            return res.status(401).send({message: "Unauthorized!"});
        }
    });
}
