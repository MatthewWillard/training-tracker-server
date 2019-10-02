const express = require('express');
const  {requireAuth} = require('../middleware/jwt-auth');
const logger = require('../logger');
const EmployeesService = require('./employee-service');

const employeeRouter = express.Router();
const jsonBodyParser = express.json();

employeeRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const user_id = req.user.id;
    EmployeesService.getAllEmployees(req.app.get('db'), user_id)
      .then(employees => {
        if (employees) {
          return res.status(200).json(employees);
        } else {
          return res.status(200).json({});
        }
        
      })
      .catch(err => next(err));
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name } = req.body;
    const user_id = req.user.id; 
    
    if (!name) {
      logger.error('Name is required');
      return res.status(400).send('Invalid data');
    }

    const employee = { 
      name: name,
      trainings: '',
      trainings2: '',
      trainings3: '',
      level: '',
      manager_id: user_id,
    };

    EmployeesService.addEmployee(req.app.get('db'), employee)
      .then(employee => {
        logger.info(`Employee with id: ${employee.id} created.`);
        res.status(201)
          .json(employee);
      })
      .catch(err => next(err));
  });

employeeRouter
  .route('/:employeeId')
  .all(requireAuth)
  .delete((req, res, next) => {
    const { employeeId } = req.params;

    EmployeesService.deleteEmployee(req.app.get('db'), employeeId)
      .then(() => {
        logger.info(`Employee with id: ${employeeId} was deleted.`);
        res.status(204).end();
      })
      .catch(err => next(err));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { employeeId } = req.params;
    const { trainings, trainings2, trainings3, level } = req.body;

    if (!employeeId || !trainings || !trainings2 || !trainings3 || !level) {
      logger.error('employeeId, trianings, and level are required');
      return res.status(400).send('Invalid data');
    }

    const updatedEmployee = {
      id: employeeId,
      trainings,
      trainings2,
      trainings3,
      level,
    };

    EmployeesService.updateEmployee(req.app.get('db'), employeeId, updatedEmployee)
      .then(() => {
        logger.info(`Employee with id: ${employeeId} was updated.`);
        res.status(204).end();
      })
      .catch(err => next(err));
  });

module.exports = employeeRouter;