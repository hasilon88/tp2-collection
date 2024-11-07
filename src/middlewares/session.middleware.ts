import session from 'express-session';
import { config } from '../config/config';

export const sessionMiddleware = session({
  secret: config.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.ENV === 'production' }
});
