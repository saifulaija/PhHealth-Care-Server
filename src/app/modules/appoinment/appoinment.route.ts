import express from 'express';

import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { appoinmentControllers } from './appoinment.controller';

const router = express.Router();

router.get('/my-appoinment', auth(UserRole.PATIENT,UserRole.DOCTOR),appoinmentControllers.getMyAppoinment)

router.post('/',auth(UserRole.PATIENT), appoinmentControllers.createAppoinment)
router.patch('/status/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.DOCTOR), appoinmentControllers.changeAppointmentStatus)




export const appointmentRoutes = router;
