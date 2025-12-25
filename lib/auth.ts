import { verifyToken } from './jwt';

export function getTokenFromRequest(req: Request) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(^|;)\s*token=([^;]+)/);
    if (match) return match[2];
    const auth = req.headers.get('authorization');
    if (auth && auth.startsWith('Bearer ')) return auth.split(' ')[1];
    return null;
}

export function requireAdminFromRequest(req: Request) {
    const token = getTokenFromRequest(req);
    if (!token) throw new Error('UNAUTHENTICATED');
    const payload: any = verifyToken(token);
    if (!payload || !payload.id) throw new Error('UNAUTHENTICATED');
    return payload;
}

export function requireUserFromRequest(req: Request) {
    const token = getTokenFromRequest(req);
    if (!token) throw new Error('UNAUTHENTICATED');
    const payload: any = verifyToken(token);
    if (!payload || !payload.id) throw new Error('UNAUTHENTICATED');
    return payload;
}
