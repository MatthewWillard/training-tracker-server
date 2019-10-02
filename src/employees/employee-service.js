const EmployeesService = {

    getAllEmployees(db, user_id) {
      return db('employees')
        .select('*')
        .where( 'manager_id', user_id);
    },
  
    addEmployee(db, employee) {
      return db('employees')
        .insert(employee)
        .returning('*')
        .then(rows => {
          return rows[0];
        });
    },
  
    deleteEmployee(db, id) {
      return db('employees')
        .where({ id })
        .delete();
    },
  
    updateEmployee(db, id, updateData) {
      return db('employees')
        .where({ id })
        .update(updateData);
    }
  
    
  };
  
  module.exports = EmployeesService;