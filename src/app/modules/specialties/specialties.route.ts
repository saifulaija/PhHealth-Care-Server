import express, { NextFunction, Request, Response } from 'express'

import { fileUpLoader } from '../../../helpers/uploader';
import { specialtiesControllers } from './specialties.controller';
import { specialtiesValidations } from './specialties.validation';

const router = express.Router() 

router.post('/',  fileUpLoader.upload.single("file"),
(req: Request, res: Response, next: NextFunction) => {
  req.body = specialtiesValidations.createSpecialties.parse(JSON.parse(req.body.data))
  return specialtiesControllers.createSpecialties(req, res, next);
})

router.get('/', specialtiesControllers.getAllSpecialties)
router.delete('/:id', specialtiesControllers.deleteSpecialties)


export const specialtiesRoutes = router;