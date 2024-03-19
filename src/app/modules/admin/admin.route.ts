import express, { Request, Response } from 'express'
import { adminControllers } from './admin.controller';
const router = express.Router();
router.get('/', adminControllers.getAllADmins);
router.get('/:id', adminControllers.getAdminById);
router.patch('/:id', adminControllers.updateAdminData);
router.delete('/soft/:id', adminControllers.softDeleteAdminData)
router.delete('/:id', adminControllers.deleteAdminData);




export const adminRoutes=router