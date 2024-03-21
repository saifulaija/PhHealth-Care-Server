
import expres from 'express'
import { authControllers } from './auth.controller';
const router = expres.Router();

router.post('/refresh-token',authControllers.refreshToken);
router.post('/login',authControllers.loginUser);

export const authRoutes=router

