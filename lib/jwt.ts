import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXPIRES = '7d';

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}
