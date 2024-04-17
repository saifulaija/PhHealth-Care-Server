import exoress from 'express'
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { reviewControllers } from './review.controller';

const router= exoress.Router();

router.post('/',auth(UserRole.PATIENT),reviewControllers.insertIntoDB)
export const reviewRoutes=router