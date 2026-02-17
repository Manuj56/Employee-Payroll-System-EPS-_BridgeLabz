const express = require('express');
const app = express();
const fileHandler = require('./modules/fileHandler');

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
    res.render('index', { employees });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', async (req, res) => {

    const name = req.body.name;
    const department = req.body.department;
    const salary = Number(req.body.salary);

    if (!name || salary < 0) {
        return res.send("Please enter valid details");
    }
    const employees = await fileHandler.read();
    const newEmployee = {
        id: Date.now(),
        name: name,
        department: department,
        salary: salary
    };
    employees.push(newEmployee);
    await fileHandler.write(employees);
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);
    const employees = await fileHandler.read();
    const remainingEmployees = [];
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id !== id) {
            remainingEmployees.push(employees[i]);
        }
    }
    await fileHandler.write(remainingEmployees);
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const employees = await fileHandler.read();
    let selectedEmployee = null;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === id) {
            selectedEmployee = employees[i];
            break;
        }
    }
    res.render('edit', { employee: selectedEmployee });
});

app.post('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const name = req.body.name;
    const department = req.body.department;
    const salary = Number(req.body.salary);
    const employees = await fileHandler.read();

    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === id) {
            employees[i].name = name;
            employees[i].department = department;
            employees[i].salary = salary;
            break;
        }
    }
    await fileHandler.write(employees);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log("Server started on http://localhost:3000");
});
