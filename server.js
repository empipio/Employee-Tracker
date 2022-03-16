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
  console.log(`Connected to the company_db database.`)
);

// Bonus
// Fulfilling any of the following can add up to 20 points to your grade.
//Note that the highest grade you can achieve is still 100:

// Application allows users to update employee managers (2 points).

// Application allows users to view employees by manager (2 points).

// Application allows users to view employees by department (2 points).

// Application allows users to delete departments, roles, and employees (2 points for each).

// Application allows users to view the total utilized budget of a department—in other words, the combined salaries of all
//employees in that department (8 points).
