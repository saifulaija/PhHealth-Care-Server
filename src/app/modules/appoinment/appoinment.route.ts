import express from 'express';

import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { appoinmentControllers } from './appoinment.controller';

const router = express.Router();

router.post('/',auth(UserRole.PATIENT), appoinmentControllers.createAppoinment)




export const appointmentRoutes = router;