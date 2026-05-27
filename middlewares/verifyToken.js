const jwt = require('jsonwebtoken');
const SECRET = 'minha_chave_super_secreta';

/* MIDDLEWARE JWT */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Token não enviado'
        });
    }

    /* REMOVE "Bearer " */
    const token = authHeader.split(' ')[1];
    try {
        /* VALIDA TOKEN */
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded)
        /* SALVA DADOS USUÁRIO */
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({
            error: 'Token inválido'
        });
    }
}

module.exports = verifyToken;