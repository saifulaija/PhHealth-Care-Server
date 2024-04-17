import exoress from 'express'
import { metaControllers } from './meta.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';


const router= exoress.Router();

router.get('/',auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.SUPER_ADMIN,UserRole.PATIENT),  metaControllers.fetchDashboardMetaData)
export const metaRoutes=router