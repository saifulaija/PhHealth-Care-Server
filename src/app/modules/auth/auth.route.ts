
import expres from 'express'
import { authControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = expres.Router();

router.post('/login',authControllers.loginUser);

router.post('/refresh-token',authControllers.refreshToken);
router.post('/change-password',auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN), authControllers.changePassword);
router.post('/forget-password',authControllers.forgetPassword)
router.post('/reset-password',authControllers.resetPassword)
export const authRoutes=router

