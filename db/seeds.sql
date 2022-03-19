INSERT INTO department (name)
VALUES ("Accounts and Finance"),
("Sales and Marketing"),
("Product Development"),
("HR"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Accounts Manager", 50000, 1), 
("Accountant", 40000, 1), 
("Sales Executive", 60000, 2), 
("Sales Intern", 25000, 2),
("Lead Engineer", 80000, 3),
("Software Engineer", 60000, 3),
("Software Intern", 35000, 3),
("HR Manager", 50000, 4),
("Legal Lead", 70000, 5),
("Lawyer", 55000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Robinson", 1, null),
("Carole", "Roberts", 2, 1),
("Max", "Power", 3, null),
("Homer", "Simpson", 4, 3),
("Harold", "Window", 5, null),
("Frodo", "Baggins", 6, 5),
("Samwise", "Gamgee", 7, 5),
("Sally", "Sampson", 8, null),
("Elle", "Woods", 9, null),
("Barry", "Chuckle", 10, 9);