
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

const usersPath = path.join(__dirname, 'users.json');

app.get('/api/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(usersPath));
    res.json(data);
});

app.post('/api/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(usersPath));
    const newUser = {
        id: String(data.length ? +data[data.length - 1].id + 1 : 1),
        name: req.body.name,
        email: req.body.email
    };
    data.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
    res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(usersPath));
    const user = data.find(u => u.id === req.params.id);
    if (user) {
        user.name = req.body.name;
        user.email = req.body.email;
        fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
        res.json(user);
    } else {
        res.status(404).send("User not found");
    }
});

app.delete('/api/users/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(usersPath));
    data = data.filter(u => u.id !== req.params.id);
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
