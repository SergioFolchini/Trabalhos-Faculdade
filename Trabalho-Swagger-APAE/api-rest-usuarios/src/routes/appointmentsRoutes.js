const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Consultas
 *   description: API de gestão de consultas
 */

/**
 * @swagger
 * /consultas:
 *   get:
 *     summary: Retorna todas as consultas
 *     tags: [Consultas]
 *     responses:
 *       200:
 *         description: Lista de consultas.
 *   post:
 *     summary: Cria uma nova consulta
 *     tags: [Consultas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: string
 *                 description: Nome do paciente.
 *                 example: João Silva
 *               professional:
 *                 type: string
 *                 description: Nome do profissional.
 *                 example: Dr. Clara Mendes
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data da consulta.
 *                 example: 2025-06-15
 *               time:
 *                 type: string
 *                 description: Hora da consulta.
 *                 example: 14:00
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso.
 */
router.route('/')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/appoitments.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de consultas' });
      }
      const appointments = JSON.parse(data);
      res.json(appointments);
    });
  })
  .post((req, res) => {
    const filePath = path.join(__dirname, '../db/appoitments.json');
    const { patient, professional, date, time } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de consultas' });
      }
      const appointments = JSON.parse(data);
      const newAppointment = {
        id: (appointments.length + 1).toString(),
        patient,
        professional,
        date,
        time
      };
      appointments.push(newAppointment);

      fs.writeFile(filePath, JSON.stringify(appointments, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar a nova consulta' });
        }
        res.status(201).json(newAppointment);
      });
    });
  });

/**
 * @swagger
 * /consultas/{id}:
 *   get:
 *     summary: Retorna uma consulta pelo ID
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Consulta encontrada.
 *       404:
 *         description: Consulta não encontrada.
 *   put:
 *     summary: Atualiza uma consulta pelo ID
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: string
 *                 description: Nome atualizado do paciente.
 *                 example: João Silva
 *               professional:
 *                 type: string
 *                 description: Nome atualizado do profissional.
 *                 example: Dr. Clara Mendes
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data atualizada da consulta.
 *                 example: 2025-06-20
 *               time:
 *                 type: string
 *                 description: Hora atualizada da consulta.
 *                 example: 15:00
 *     responses:
 *       200:
 *         description: Consulta atualizada com sucesso.
 *   delete:
 *     summary: Remove uma consulta pelo ID
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da consulta
 *     responses:
 *       204:
 *         description: Consulta removida com sucesso.
 */
router.route('/:id')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/appoitments.json');

    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de consultas' });
      }
      const appointments = JSON.parse(data);
      const appointment = appointments.find(a => a.id === id);

      if (!appointment) {
        return res.status(404).json({ message: 'Consulta não encontrada' });
      }
      res.json(appointment);
    });
  })
  .put((req, res) => {
    const filePath = path.join(__dirname, '../db/appoitments.json');

    const { id } = req.params;
    const { patient, professional, date, time } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de consultas' });
      }
      let appointments = JSON.parse(data);
      const index = appointments.findIndex(a => a.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Consulta não encontrada' });
      }

      appointments[index] = { id, patient, professional, date, time };

      fs.writeFile(filePath, JSON.stringify(appointments, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar a consulta' });
        }
        res.json(appointments[index]);
      });
    });
  })
  .delete((req, res) => {
    const filePath = path.join(__dirname, '../db/appoitments.json');


    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de consultas' });
      }
      let appointments = JSON.parse(data);
      const index = appointments.findIndex(a => a.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Consulta não encontrada' });
      }

      appointments.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(appointments, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover a consulta' });
        }
        res.status(204).send();
      });
    });
  });

module.exports = router;