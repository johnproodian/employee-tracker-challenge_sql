const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'myTantrum7!',
    database: 'tracked_employees'
});

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ]);
};

promptUser()
    .then(({start}) => {
        if (start === 'View all departments') {
            const sql = `SELECT * FROM departments`;
            
            db.query(sql, (err, rows) => {
                console.table(rows);
            });
        } else if (start === 'View all roles') {
            const sql = `SELECT roles.title, roles.id, departments.name AS department_name, roles.salary
                        FROM roles
                        LEFT JOIN departments
                        ON roles.department_id = departments.id`;

            db.query(sql, (err, rows) => {
                console.table(rows);
            });
        } else if (start === 'View all employees') {
            const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS department, roles.salary
                        FROM employees 
                        JOIN roles 
                        ON employees.role_id = roles.id 
                        JOIN departments 
                        ON departments.id = roles.department_id;`

            db.query(sql, (err, rows) => {
                console.table(rows);
            })
        } //else if (start === 'Add a department') {

        // } else if (start === 'Add a role') {

        // } else if (start === 'Add an employee') {

        // } else if (start === 'Update an employee role') {

        // } else {
            
        // }
    });
