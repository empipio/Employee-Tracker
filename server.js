//NEED TO DO SEEDS

// 1. INQUIRER PROMPTS
// CHECKBOX-what would you like to do?
//view all departments
//view all roles
//view all employees
//add a department
//add a role
//add an employee
//update an employee role

//VIEW ALL DEPARTMENTS -> table with department names and IDs (use console.table?)

//VIEW ALL ROLES -> table with job title, role id, the department that role belongs to, and the salary for that role

//VIEW ALL EMPLOYEES -> employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

//ADD A DEPARTMENT -> enter department name, and it is added to database

//ADD A ROLE -> enter the name, salary, and department for the role and that role is added to the database

//ADD AN EMPLOYEE -> enter the first name, last name, role, and manager, and that employee is added to the database

//UPDATE EMPLOYEE ROLE -> select an employee to update and their new role and this information is updated in the database
// pick name and role from list?

const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
const consoleTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "P0ta55ium",
    database: "company_db",
  },
  console.log(`Connected to the company_db database. Welcome!`)
);

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
      // if (answer.options == "Add a role") {
      //   addRole();
      // }
      // if (answer.options == "Add an employee") {
      //   addEmployee();
      // }
      // if (answer.options == "Update an employee role") {
      //   updateEmployee();
      // }
      if (answer.options == "Exit the app") {
        exitApp();
      }
    });
};

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("Department information:");
    console.table(results);
    askUser();
  });
}

function viewRoles() {
  db.query(
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

function viewEmployees() {
  db.query(
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
          askUser();
        }
      );
    });
}

//HOW TO GET DEPARTMENT ID FROM ENTERED DEPARTMENT???
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
      {
        type: "checkbox",
        name: "roleDepartment",
        message: "Please select the department that the new role belongs to:",
        choices: [
          "Accounts and Finance",
          "Sales and Marketing",
          "Product Development",
          "HR",
          "Legal",
        ],
      },
    ])
    .then((answers) => {
      db.query(
        `INSERT into role (title, salary, department_id) VALUES (?, ?)`,
        answers.roleName,
        answers.salary,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`added ${answers.roleName} to database!`);
          askUser();
        }
      );
    });
}

function addEmployee() {
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
      {
        type: "checkbox",
        name: "employeeRole",
        message: "Please select the role of the new employee:",
        choices: [
          "Accounts Manager",
          "Accountant",
          "Sales Executive",
          "Sales Intern",
          "Lead Engineer",
          "Software Engineer",
          "Software Intern",
          "HR Manager",
          "Legal Lead",
          "Lawyer",
        ],
      },
    ])
    .then((answers) =>
      db.query(
        "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        JSON.stringify(answers.firstName),
        JSON.stringify(answers.lastName),
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(
            `added ${JSON.stringify(
              answers.firstName,
              answers.lastName
            )} to database!`
          );
          askUser();
        }
      )
    );
}

function updateEmployee() {
  //select employee to edit from a list of employees
  //select role from a list?
  //UPDATE employee
  //SET role_id = x
  //WHERE first_name = y and last_name = z
}

function exitApp() {
  db.end();
}

function init() {
  askUser();
}

init();

// Bonus
// Fulfilling any of the following can add up to 20 points to your grade.
//Note that the highest grade you can achieve is still 100:

// Application allows users to update employee managers (2 points).

// Application allows users to view employees by manager (2 points).

// Application allows users to view employees by department (2 points).

// Application allows users to delete departments, roles, and employees (2 points for each).

// Application allows users to view the total utilized budget of a department—in other words, the combined salaries of all
//employees in that department (8 points).
