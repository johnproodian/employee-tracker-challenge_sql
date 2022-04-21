// Future: break up this code!!!

const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password1!',
    database: 'tracked_employees'
});

const promptStart = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ])
        .then(({start}) => {
            if (start === 'View all departments') {
                const sql = `SELECT * FROM departments`;
                
                db.query(sql, (err, rows) => {
                    console.table(rows);
                })
                promptStart();
            } else if (start === 'View all roles') {
                const sql = `SELECT roles.title, roles.id, departments.name AS department_name, roles.salary
                            FROM roles
                            LEFT JOIN departments
                            ON roles.department_id = departments.id`;

                db.query(sql, (err, rows) => {
                    console.table(rows);
                });
                promptStart();
            } else if (start === 'View all employees') {
                // fix manager...
                const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS department, roles.salary, employees.last_name AS manager
                            FROM employees 
                            JOIN roles 
                            ON employees.role_id = roles.id 
                            JOIN departments 
                            ON departments.id = roles.department_id;`

                db.query(sql, (err, rows) => {
                    console.table(rows);
                })
                promptStart();
            } else if (start === 'Add a department') {
                return inquirer.prompt([
                    {
                        type: 'input',
                        name: 'department',
                        message: 'What is the name of the department you would like to add?'
                    }
                ])
                .then(({ department }) => {
                    //const params = department
                    const sql = `INSERT INTO departments (name)
                                VALUES (?)`;
                    db.query(sql, department, (err, result) => {
                        console.log(`Added ${department} to the database`);
                    });
                    promptStart();
                })
            } else if (start === 'Add a role') {
                let deptArr = [];

                db.query(`SELECT * FROM departments`, (err, result) => {
                    if (err) {
                        return err;
                    }
                    for (let i = 0; i < result.length; i++) {
                        deptArr.push(result[i].name);
                    }
                })
                
                return inquirer.prompt([
                    {
                        type: 'input',
                        name: 'roleName',
                        message: 'What is the name of the new role?'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary for this role?'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: deptArr
                    }
                ])
                .then(({ roleName, salary, department }) => {
                    const sql = `SELECT departments.id FROM departments WHERE departments.name = ?`
                    db.query(sql, department, (err, row) => {
                        const sql2 = `INSERT INTO roles (title, salary, department_id)
                                    VALUES (?,?,?)`;
                        params = [roleName, salary, row[0].id];
                        db.query(sql2, params, (err, result) => {
                            if (!err) {
                                console.log(`Added ${roleName} to the database`);
                            }
                        });
                    });
                    promptStart();
                });
            } else if (start === 'Add an employee') { 
                let managerArr = [];
                let roleArr = [];

                db.query(`SELECT * FROM employees`, (err, rows) => {
                    if (err) {
                        return err;
                    }
                    for (let i = 0; i < rows.length; i++) {
                        managerArr.push(rows[i].last_name);
                    }
                });
                
                db.query(`SELECT * FROM roles`, (err, rows) => {
                    if (err) {
                        return err;
                    }
                    for (let i = 0; i < rows.length; i++) {
                        roleArr.push(rows[i].title);
                    }
                });

                return inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: "What is the employee's first name?"
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: "What is the employee's last name?"
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: "What will this employee's role be?",
                            choices: roleArr
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who will this employee's manager be?",
                            choices: managerArr
                        }
                    ])
                    
                    .then(({ firstName, lastName, role, manager }) => {
                        const sqlMan = `SELECT employees.id FROM employees WHERE last_name = ?`;
                        const paramsMan = [manager];
                        let managerID;
                        const sqlRole = `SELECT roles.id FROM roles WHERE title = ?`;
                        const paramsRole = [role];
                        let roleID;

                        db.query(sqlMan, paramsMan, (err, rows) => {
                            if (err) {
                                console.log(err);
                            }
                            managerID = rows[0].id;
                            console.log('managerID: ' + managerID);
                        })

                        db.query(sqlRole, paramsRole, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            roleID = result[0].id;
                            console.log('roleID: ' + roleID)
                        })
                        console.log('outer managerID: ' + managerID);
                        console.log('outer roleID: ' + roleID);

                        const sqlEmployee = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                    VALUES (?,?,?,?)`;
                        const paramsEmployee = [firstName, lastName, roleID, managerID];

                        db.query(sqlEmployee, paramsEmployee, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`${firstName} ${lastName} was added to the database.`)
                        });
                        promptStart();
                        
                    });
            }; // else if (start === 'Update an employee role') {

            // } else {
                
            // }
        })
};


const getDepartments = (answers) => {
    const deptArr = [];

    db.query(`SELECT * FROM departments`, (err, result) => {
        if (err) {
            return err;
        }
        for (let i = 0; i < result.length; i++) {
            deptArr.push(result[i].name);
        }
        return deptArr;
    })
}
const getMan = async () => {
    let managerArr = [];
    
    for (let i = 0; i < rows.length; i++) {
        managerArr.push(rows[i].last_name);
        return managerArr;
    }
}

const getRole = async () => {
    db.query(`SELECT * FROM roles`, (err, rows) => {
        for (let i = 0; i < rows.length; i++) {
            roleArr.push(rows[i].title);
        }
        return roleArr;
    })
}






promptStart()
    // .then(({start}) => {
    //     if (start === 'View all departments') {
    //         const sql = `SELECT * FROM departments`;
            
    //         db.query(sql, (err, rows) => {
    //             console.table(rows);
    //         });
    //     } else if (start === 'View all roles') {
    //         const sql = `SELECT roles.title, roles.id, departments.name AS department_name, roles.salary
    //                     FROM roles
    //                     LEFT JOIN departments
    //                     ON roles.department_id = departments.id`;

    //         db.query(sql, (err, rows) => {
    //             console.table(rows);
    //         });
    //     } else if (start === 'View all employees') {
    //         // fix manager...
    //         const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS department, roles.salary, employees.last_name AS manager
    //                     FROM employees 
    //                     JOIN roles 
    //                     ON employees.role_id = roles.id 
    //                     JOIN departments 
    //                     ON departments.id = roles.department_id;`

    //         db.query(sql, (err, rows) => {
    //             console.table(rows);
    //         })
    //     } else if (start === 'Add a department') {
    //         return inquirer.prompt([
    //             {
    //                 type: 'input',
    //                 name: 'department',
    //                 message: 'What is the name of the department you would like to add?'
    //             }
    //         ])
    //         .then(({ department }) => {
    //             //const params = department
    //             const sql = `INSERT INTO departments (name)
    //                         VALUES (?)`;
    //             db.query(sql, department, (err, result) => {
    //                 console.log(`Added ${department} to the database`);
    //             });
    //         })
    //     } else if (start === 'Add a role') {
    //         let deptArr = [];

    //         db.query(`SELECT * FROM departments`, (err, result) => {
    //             if (err) {
    //                 return err;
    //             }
    //             for (let i = 0; i < result.length; i++) {
    //                 deptArr.push(result[i].name);
    //             }
    //         })
            
    //         return inquirer.prompt([
    //             {
    //                 type: 'input',
    //                 name: 'roleName',
    //                 message: 'What is the name of the new role?'
    //             },
    //             {
    //                 type: 'input',
    //                 name: 'salary',
    //                 message: 'What is the salary for this role?'
    //             },
    //             {
    //                 type: 'list',
    //                 name: 'department',
    //                 message: 'Which department does the role belong to?',
    //                 choices: deptArr
    //             }
    //         ])
    //         .then(({ roleName, salary, department }) => {
    //             const sql = `SELECT departments.id FROM departments WHERE departments.name = ?`
    //             db.query(sql, department, (err, row) => {
    //                 const sql2 = `INSERT INTO roles (title, salary, department_id)
    //                             VALUES (?,?,?)`;
    //                 params = [roleName, salary, row[0].id];
    //                 db.query(sql2, params, (err, result) => {
    //                     if (!err) {
    //                         console.log(`Added ${roleName} to the database`);
    //                     }
    //                 });
    //             });
    //         });
    //     } else if (start === 'Add an employee') { 
    //         let managerArr = [];
    //         let roleArr = [];

    //         db.query(`SELECT * FROM employees`, (err, rows) => {
    //             if (err) {
    //                 return err;
    //             }
    //             for (let i = 0; i < rows.length; i++) {
    //                 managerArr.push(rows[i].last_name);
    //             }
    //         });
            
    //         db.query(`SELECT * FROM roles`, (err, rows) => {
    //             if (err) {
    //                 return err;
    //             }
    //             for (let i = 0; i < rows.length; i++) {
    //                 roleArr.push(rows[i].title);
    //             }
    //         });

    //         return inquirer
    //             .prompt([
    //                 {
    //                     type: 'input',
    //                     name: 'firstName',
    //                     message: "What is the employee's first name?"
    //                 },
    //                 {
    //                     type: 'input',
    //                     name: 'lastName',
    //                     message: "What is the employee's last name?"
    //                 },
    //                 {
    //                     type: 'list',
    //                     name: 'role',
    //                     message: "What will this employee's role be?",
    //                     choices: roleArr
    //                 },
    //                 {
    //                     type: 'list',
    //                     name: 'manager',
    //                     message: "Who will this employee's manager be?",
    //                     choices: managerArr
    //                 }
    //             ])
                
    //             .then(({ firstName, lastName, role, manager }) => {
    //                 const sqlMan = `SELECT employees.id FROM employees WHERE last_name = ?`;
    //                 const paramsMan = [manager];
    //                 let managerID;
    //                 const sqlRole = `SELECT roles.id FROM roles WHERE title = ?`;
    //                 const paramsRole = [role];
    //                 let roleID;

    //                 db.query(sqlMan, paramsMan, (err, rows) => {
    //                     if (err) {
    //                         console.log(err);
    //                     }
    //                     managerID = rows[0].id;
    //                     console.log('managerID: ' + managerID);
    //                 })

    //                 db.query(sqlRole, paramsRole, (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                     }
    //                     roleID = result[0].id;
    //                     console.log('roleID: ' + roleID)
    //                 })
    //                 console.log('outer managerID: ' + managerID);
    //                 console.log('outer roleID: ' + roleID);

    //                 const sqlEmployee = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    //                             VALUES (?,?,?,?)`;
    //                 const paramsEmployee = [firstName, lastName, roleID, managerID];

    //                 db.query(sqlEmployee, paramsEmployee, (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                     }
    //                     console.log(`${firstName} ${lastName} was added to the database.`)
    //                 });
    //             });
    //     }; // else if (start === 'Update an employee role') {

    //     // } else {
            
    //     // }
    // })
    //     .then()
