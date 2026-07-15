import { Router } from 'express';
import { employeeController } from '../controllers/employee.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  listEmployeesQuerySchema,
  employeeParamsSchema,
} from '../validators/employee.validator';

const employeeRouter = Router();

employeeRouter.use(authenticate);

employeeRouter.get('/', validateRequest(listEmployeesQuerySchema, 'query'), (req, res, next) => {
  void employeeController.list(req, res, next);
});

employeeRouter.post('/', validateRequest(createEmployeeSchema, 'body'), (req, res, next) => {
  void employeeController.create(req, res, next);
});

employeeRouter.put(
  '/:id',
  validateRequest(employeeParamsSchema, 'params'),
  validateRequest(updateEmployeeSchema, 'body'),
  (req, res, next) => {
    void employeeController.update(req, res, next);
  },
);

employeeRouter.delete('/:id', validateRequest(employeeParamsSchema, 'params'), (req, res, next) => {
  void employeeController.delete(req, res, next);
});

export default employeeRouter;
