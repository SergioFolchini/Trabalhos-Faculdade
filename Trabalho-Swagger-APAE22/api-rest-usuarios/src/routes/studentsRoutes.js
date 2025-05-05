const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/students.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de estudantes' });
      }
      const students = JSON.parse(data);
      res.json(students);
    });
  })
  .post((req, res) => {
    const filePath = path.join(__dirname, '../db/students.json');
    const { name, age, grade, email, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de estudantes' });
      }
      const students = JSON.parse(data);
      const newStudent = {
        id: (students.length + 1).toString(),
        name: name || '',
        age: age || '',
        grade: grade || '',
        email: email || '',
        status: status || 'active'
      };
      students.push(newStudent);

      fs.writeFile(filePath, JSON.stringify(students, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar o novo estudante' });
        }
        res.status(201).json(newStudent);
      });
    });
  });

router.route('/:id')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/students.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de estudantes' });
      }
      const students = JSON.parse(data);
      const student = students.find(s => s.id === id);

      if (!student) {
        return res.status(404).json({ message: 'Estudante não encontrado' });
      }
      res.json(student);
    });
  })
  .put((req, res) => {
    const filePath = path.join(__dirname, '../db/students.json');
    const { id } = req.params;
    const { name, age, grade, email, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de estudantes' });
      }
      let students = JSON.parse(data);
      const index = students.findIndex(s => s.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Estudante não encontrado' });
      }

      // Atualiza apenas os campos enviados, mantendo os existentes
      students[index] = {
        ...students[index],
        name: name || students[index].name,
        age: age || students[index].age,
        grade: grade || students[index].grade,
        email: email || students[index].email,
        status: status || students[index].status
      };

      fs.writeFile(filePath, JSON.stringify(students, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar o estudante' });
        }
        res.json(students[index]);
      });
    });
  })
  .delete((req, res) => {
    const filePath = path.join(__dirname, '../db/students.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de estudantes' });
      }
      let students = JSON.parse(data);
      const index = students.findIndex(s => s.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Estudante não encontrado' });
      }

      students.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(students, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover o estudante' });
        }
        res.status(204).send();
      });
    });
  });

module.exports = router;