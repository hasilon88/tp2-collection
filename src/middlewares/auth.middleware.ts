import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';
import { UserService } from '../services/user.service';

export default class AuthenticationFilter {
    public async authAndAuthorizeManager(req: any, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, config.SECRET_KEY) as JwtPayload;
            req.user = decoded;

            const user = await UserService.getUserByEmail(req.user?.email);

            if (user?.role === 'manager') {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}