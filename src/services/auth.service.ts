import jwt from 'jsonwebtoken';
import RegistrationDTO from '../payloads/dto/register.dto';
import LoginDTO from '../payloads/dto/login.dto';
import AuthenticationResponseObject from '../payloads/response/authResponseObject.vm';
import { config } from "../config/config";
import { logger } from '../utils/logger.utils';
import { UserService } from './user.service'; 
import { verifyPassword } from '../utils/security.utils';

export class AuthService {
    static async register(registrationDto: RegistrationDTO): Promise<AuthenticationResponseObject> {
        try {
            logger.info(`Registering user with email: ${registrationDto.email.trim()}`);

            const isRegistered = await UserService.addUser(registrationDto);

            if (!isRegistered) {
                return {
                    code: 400,
                    jwt: "",
                    message: "Failed to register user.",
                };
            }

            const newUser = await UserService.getUserByEmail(registrationDto.email.trim());
            if (!newUser) {
                return {
                    code: 400,
                    jwt: "",
                    message: "Failed to retrieve the registered user.",
                };
            }

            const token = jwt.sign({ id: newUser.id, email: newUser.email }, config.SECRET_KEY, { expiresIn: '1h' });

            logger.info(`Successfully registered user with ID: ${newUser.id}`);

            return {
                code: 200,
                jwt: token,
                message: "Successfully Registered.",
            };
        } catch (e) {
            logger.error(`Registration error: ${e}`);

            return {
                code: 400,
                jwt: "",
                message: 'An error occurred during registration.'
            };
        }
    }

    static async authenticate(loginDto: LoginDTO): Promise<AuthenticationResponseObject> {
        try {
            logger.info(`Authenticating user with email: ${loginDto.email.trim()}`);

            const user = await UserService.getUserByEmail(loginDto.email.trim());
            if (!user) {
                logger.warn(`User not found: ${loginDto.email.trim()}`);
                return { code: 400, message: 'User not found', jwt: "" };
            }

            const isValidPassword = await verifyPassword(loginDto.password.trim(), user.password);
            if (!isValidPassword) {
                logger.warn(`Incorrect password attempt for user: ${loginDto.email.trim()}`);
                return { code: 400, message: 'Incorrect password', jwt: "" };
            }

            logger.info(`User authenticated successfully: ${loginDto.email.trim()}`);

            const token = jwt.sign({ id: user.id, email: user.email }, config.SECRET_KEY, { expiresIn: '1h' });

            return {
                code: 200,
                message: "Logged in Successfully",
                jwt: token,
            };
        } catch (e) {
            logger.error(`Authentication error: ${e}`);

            return {
                code: 400,
                message: 'An error occurred during authentication.',
                jwt: "",
            };
        }
    }
}
