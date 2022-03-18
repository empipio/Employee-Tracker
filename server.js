//IMPORTS
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "P0ta55ium",
    //database to use
    database: "company_db",
  },
  console.log(`Connected to the company_db database. Welcome!`)
);

//user asked to select an option here upon initialisation of app
const askUser = () => {
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
          "Exit the app",
        ],
      },
    ])
    .then((answer) => {
      if (answer.options == "View all departments") {
        viewDepartments();
      }
      if (answer.options == "View all roles") {
        viewRoles();
      }
      if (answer.options == "View all employees") {
        viewEmployees();
      }
      if (answer.options == "Add a department") {
        addDepartment();
      }
      if (answer.options == "Add a role") {
        addRole();
      }
      if (answer.options == "Add an employee") {
        addEmployee();
      }
      if (answer.options == "Update an employee role") {
        updateEmployee();
      }
      if (answer.options == "Exit the app") {
        exitApp();
      }
      if (answer.options == "Delete a department") {
        deleteDepartment();
      }
      if (answer.options == "Delete a role") {
        deleteRole();
      }
      if (answer.options == "Delete an employee") {
        deleteEmployee();
      }
    });
};

//function to view all departments
function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("Department information:");
    //departments presented in a table
    console.table(results);
    //user taken back to opening menu once table generated
    askUser();
  });
}

//function to view all roles
function viewRoles() {
  db.query(
    //role and department tables joined, extra IDs eliminated
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, results) {
      if (err) {
        console.log(err);
      }
      console.log("Role information:");
      console.table(results);
      askUser();
    }
  );
}

//function to view all employees
function viewEmployees() {
  db.query(
    //multiple joins to combine department, role and employee tables
    `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`,
    function (err, results) {
      if (err) {
        console.log(err);
      }
      console.log("Employee information:");
      console.table(results);
      askUser();
    }
  );
}

//function to add a new department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message:
          "Please enter the name of the department you would like to add:",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department (name) VALUES (?)`,
        answer.newDepartment,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`added ${answer.newDepartment} to department list!`);
          viewDepartments();
        }
      );
    });
}

//function to add a new role
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Please enter the name of the role you would like to add:",
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the yearly salary for the role:",
      },
    ])
    .then((answers) => {
      //save input from user in an array
      const newRole = [answers.roleName, answers.salary];
      db.query(`SELECT name, id FROM department`, (err, result) => {
        if (err) {
          console.log(err);
        }
        //map info from department table into new array of objects
        const department = result.map(({ name, id }) => ({
          name: name,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "checkbox",
              name: "roleDept",
              message: "What department does the new role belong in?",
              choices: department,
            },
          ])
          .then((answer) => {
            //add department of new role to newRole array
            //the values inserted into role will come from this array
            newRole.push(answer.roleDept);
            db.query(
              `INSERT into role (title, salary, department_id) VALUES (?, ?, ?)`,
              newRole,
              (err, result) => {
                if (err) {
                  console.log(err);
                }
                console.log("Successfully added role!");
                //viewRoles function called in order to see new role presented in table
                viewRoles();
              }
            );
          });
      });
    });
}

//function to add a new employee
function addEmployee() {
  //user manually inputs the new employee's first and last names
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter the first name of the new employee:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter the surname of the new employee:",
      },
    ])
    .then((answers) => {
      const newEmployee = [answers.firstName, answers.lastName];
      db.query(`SELECT title, id FROM role`, (err, result) => {
        if (err) {
          console.log(err);
        }
        const role = result.map(({ title, id }) => ({
          name: title,
          value: id,
        }));
        //new role and manager are selected from a list by the user
        inquirer
          .prompt([
            {
              type: "checkbox",
              name: "employeeRole",
              message: "What is the new employee's role?",
              choices: role,
            },
          ])
          .then((answer) => {
            newEmployee.push(answer.employeeRole);
            db.query(`SELECT * from employee`, (err, result) => {
              if (err) {
                console.log(err);
              }
              const manager = result.map(({ first_name, last_name, id }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "checkbox",
                    name: "employeeManager",
                    message: "Who is the new employee's manager?",
                    choices: manager,
                  },
                ])
                .then((answer) => {
                  //all info pushed to newEmployee array for use in constructing the new employee row
                  newEmployee.push(answer.employeeManager);
                  db.query(
                    `INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                    newEmployee,
                    (err, result) => {
                      if (err) {
                        console.log(err);
                      }
                      console.log("Successfully added new employee!");
                      viewEmployees();
                    }
                  );
                });
            });
          });
      });
    });
}

//function to update an existing employee
function updateEmployee() {
  //both employee and new role are picked from a list
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const employees = result.map(({ first_name, last_name, id }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "checkbox",
          name: "employeeName",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((answer) => {
        const updateEmployee = [answer.employeeName];
        db.query(`SELECT * FROM role`, (err, result) => {
          const roles = result.map(({ title, id }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "checkbox",
                name: "newRole",
                message: "What is their new role?",
                choices: roles,
              },
            ])
            .then((answer) => {
              updateEmployee.push(answer.newRole);
              console.log(updateEmployee);
              db.query(
                `UPDATE employee SET role_id=? WHERE id=?`,
                //data is saved in updateEmployee array as[employee ID, role ID] hence syntax below
                [updateEmployee[1], updateEmployee[0]],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log("Successfully updated employee role!");
                  viewEmployees();
                }
              );
            });
        });
      });
  });
}

//function to delete department
function deleteDepartment() {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const departments = result.map(({ name, id }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "checkbox",
          name: "deleteDept",
          message: "Which department would you like to delete?",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(
          `DELETE FROM department WHERE id=?`,
          answer.deleteDept,
          (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("Successfully deleted department!");
            viewDepartments();
          }
        );
      });
  });
}

//function to delete role
function deleteRole() {
  db.query(`SELECT * FROM role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const roles = result.map(({ title, id }) => ({
      name: title,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "checkbox",
          name: "deleteRole",
          message: "Which role would you like to delete?",
          choices: roles,
        },
      ])
      .then((answer) => {
        db.query(
          `DELETE FROM role WHERE id=?`,
          answer.deleteRole,
          (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("Successfully deleted role!");
            viewRoles();
          }
        );
      });
  });
}

//function to delete employee
function deleteEmployee() {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const employees = result.map(({ first_name, last_name, id }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "checkbox",
          name: "deleteEmployee",
          message: "Which employee would you like to delete?",
          choices: employees,
        },
      ])
      .then((answer) => {
        db.query(
          `DELETE FROM employee WHERE id=?`,
          answer.deleteEmployee,
          (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("Successfully deleted employee!");
            viewEmployees();
          }
        );
      });
  });
}

//function to exit application
function exitApp() {
  db.end();
}

//function to initialise app
function init() {
  askUser();
}

init();
