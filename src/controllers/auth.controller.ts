import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    public static async Register(req: Request, res: Response): Promise<void> {
        try {
            const serviceRes = await AuthService.register({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                role: req.body.role
            });

            res.status(serviceRes.code).json({
                jwt: serviceRes.jwt,
                message: serviceRes.message
            });
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public static async Authenticate(req: Request, res: Response): Promise<void> {
        try {
            const serviceRes = await AuthService.authenticate({ password: req.body.password, email: req.body.email });
            console.log(serviceRes);
            res.status(serviceRes.code).json({
                jwt: serviceRes.jwt,
                message: serviceRes.message
            });
        } catch (error) {
            console.error('Error during authentication:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
