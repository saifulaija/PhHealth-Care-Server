import express from 'express'
import { doctorControllers } from './doctor.controller'
const router=express.Router()

router.patch('/:id', doctorControllers.updateDoctor)
export const doctorRoutes=router