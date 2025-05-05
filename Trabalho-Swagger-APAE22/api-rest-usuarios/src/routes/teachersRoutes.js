const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: API de gestão de professores
 */

/**
 * @swagger
 * /professores:
 *   get:
 *     summary: Retorna todos os professores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Lista de professores.
 *   post:
 *     summary: Adiciona um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do professor.
 *                 example: Carlos Oliveira
 *               subject:
 *                 type: string
 *                 description: Matéria ensinada.
 *                 example: Matemática
 *               email:
 *                 type: string
 *                 description: Email do professor.
 *                 example: carlos.oliveira@example.com
 *               phone:
 *                 type: string
 *                 description: Telefone do professor.
 *                 example: '11987654321'
 *               status:
 *                 type: string
 *                 description: Status do professor.
 *                 example: active
 *     responses:
 *       201:
 *         description: Professor adicionado com sucesso.
 */
router.route('/')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/teachers.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de professores' });
      }
      const teachers = JSON.parse(data);
      res.json(teachers);
    });
  })
  .post((req, res) => {
    const filePath = path.join(__dirname, '../db/teachers.json');
    const { name, subject, email, phone, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de professores' });
      }
      const teachers = JSON.parse(data);
      const newTeacher = {
        id: (teachers.length + 1).toString(),
        name: name || '',
        subject: subject || '',
        email: email || '',
        phone: phone || '',
        status: status || 'active'
      };
      teachers.push(newTeacher);

      fs.writeFile(filePath, JSON.stringify(teachers, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar o novo professor' });
        }
        res.status(201).json(newTeacher);
      });
    });
  });

/**
 * @swagger
 * /professores/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor encontrado.
 *       404:
 *         description: Professor não encontrado.
 *   put:
 *     summary: Atualiza um professor pelo ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome atualizado do professor.
 *                 example: Carlos Oliveira
 *               subject:
 *                 type: string
 *                 description: Matéria atualizada.
 *                 example: Física
 *               email:
 *                 type: string
 *                 description: Email atualizado do professor.
 *                 example: carlos.oliveira@example.com
 *               phone:
 *                 type: string
 *                 description: Telefone atualizado do professor.
 *                 example: '11987654321'
 *               status:
 *                 type: string
 *                 description: Status atualizado do professor.
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso.
 *   delete:
 *     summary: Remove um professor pelo ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: Professor removido com sucesso.
 */
router.route('/:id')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/teachers.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de professores' });
      }
      const teachers = JSON.parse(data);
      const teacher = teachers.find(t => t.id === id);

      if (!teacher) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }
      res.json(teacher);
    });
  })
  .put((req, res) => {
    const filePath = path.join(__dirname, '../db/teachers.json');
    const { id } = req.params;
    const { name, subject, email, phone, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de professores' });
      }
      let teachers = JSON.parse(data);
      const index = teachers.findIndex(t => t.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      // Atualiza apenas os campos enviados, mantendo os existentes
      teachers[index] = {
        ...teachers[index],
        name: name || teachers[index].name,
        subject: subject || teachers[index].subject,
        email: email || teachers[index].email,
        phone: phone || teachers[index].phone,
        status: status || teachers[index].status
      };

      fs.writeFile(filePath, JSON.stringify(teachers, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar o professor' });
        }
        res.json(teachers[index]);
      });
    });
  })
  .delete((req, res) => {
    const filePath = path.join(__dirname, '../db/teachers.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de professores' });
      }
      let teachers = JSON.parse(data);
      const index = teachers.findIndex(t => t.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }

      teachers.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(teachers, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover o professor' });
        }
        res.status(204).send();
      });
    });
  });

module.exports = router;