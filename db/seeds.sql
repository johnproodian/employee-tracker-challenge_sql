INSERT INTO departments (name)
VALUES
    ('Marketing'),
    ('Finance'),
    ('Human Resources'),
    ('IT');


INSERT INTO roles (title, salary, department_id)
VALUES
    ('Marketing Specialist', 65810, 1),
    ('Advertising Manager', 133460, 1),
    ('Market Research Analyst', 65810.75, 1),
    ('Chief Financial Officer', 192500, 2),
    ('Treasurer', 185000, 2),
    ('Accountant', 70000, 2),
    ('HR Director', 95032, 3),
    ('HR Analyst', 56982, 3),
    ('Database Administrator', 90070, 4);



INSERT INTO employees (first_name, last_name, role_id)
VALUES
    ('Ronald', 'Firbank', 1),
    ('Virginia', 'Woolf', 4),
    ('Piers', 'Gaveston', 9),
    ('Charles', 'LeRoi', 2),
    ('Katherine', 'Mansfield', 3),
    ('Dora', 'Carrington', 6),
    ('Edward', 'Bellamy', 8),
    ('Montague', 'Summers', 7),
    ('Octavia', 'Butler', 3),
    ('Unica', 'Zurn', 1);
    
