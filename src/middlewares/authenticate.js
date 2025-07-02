import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Unauthorized

    //verificamos y decodificamos el token
    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Guardamos el usuario decodificado en la solicitud
        next(); // Pasamos al siguiente middleware o ruta
    });
}