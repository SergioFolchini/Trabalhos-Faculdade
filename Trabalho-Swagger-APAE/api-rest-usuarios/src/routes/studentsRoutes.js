const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profissionais
 *   description: API de gestão de profissionais
 */

/**
 * @swagger
 * /profissionais:
 *   get:
 *     summary: Retorna todos os profissionais
 *     tags: [Profissionais]
 *     responses:
 *       200:
 *         description: Lista de profissionais.
 *   post:
 *     summary: Adiciona um novo profissional
 *     tags: [Profissionais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do profissional.
 *                 example: Dr. Silva
 *               specialty:
 *                 type: string
 *                 description: Especialidade do profissional.
 *                 example: Pediatra
 *     responses:
 *       201:
 *         description: Profissional adicionado com sucesso.
 */
router.route('/')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/professionals.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de profissionais' });
      }
      const professionals = JSON.parse(data);
      res.json(professionals);
    });
  })
  .post((req, res) => {
    const filePath = path.join(__dirname, '../db/professionals.json');
    const { name, specialty, contact, phone_number, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de profissionais' });
      }
      const professionals = JSON.parse(data);
      const newProfessional = {
        id: (professionals.length + 1).toString(),
        name,
        specialty,
        contact,
        phone_number,
        status
      };
      professionals.push(newProfessional);

      fs.writeFile(filePath, JSON.stringify(professionals, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar o novo profissional' });
        }
        res.status(201).json(newProfessional);
      });
    });
  });

/**
 * @swagger
 * /profissionais/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Profissional encontrado.
 *       404:
 *         description: Profissional não encontrado.
 *   put:
 *     summary: Atualiza um profissional pelo ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome atualizado do profissional.
 *                 example: Dr. Silva
 *               specialty:
 *                 type: string
 *                 description: Especialidade atualizada.
 *                 example: Cardiologista
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso.
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       204:
 *         description: Profissional removido com sucesso.
 */
router.route('/:id')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/professionals.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de profissionais' });
      }
      const professionals = JSON.parse(data);
      const professional = professionals.find(p => p.id === id);

      if (!professional) {
        return res.status(404).json({ message: 'Profissional não encontrado' });
      }
      res.json(professional);
    });
  })
  .put((req, res) => {
    const filePath = path.join(__dirname, '../db/professionals.json');
    const { id } = req.params;
    const { name, specialty, contact, phone_number, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de profissionais' });
      }
      let professionals = JSON.parse(data);
      const index = professionals.findIndex(p => p.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Profissional não encontrado' });
      }

      professionals[index] = { id, name, specialty, contact, phone_number, status };

      fs.writeFile(filePath, JSON.stringify(professionals, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar o profissional' });
        }
        res.json(professionals[index]);
      });
    });
  })
  .delete((req, res) => {
    const filePath = path.join(__dirname, '../db/professionals.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de profissionais' });
      }
      let professionals = JSON.parse(data);
      const index = professionals.findIndex(p => p.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Profissional não encontrado' });
      }

      professionals.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(professionals, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover o profissional' });
        }
        res.status(204).send();
      });
    });
  });

module.exports = router;