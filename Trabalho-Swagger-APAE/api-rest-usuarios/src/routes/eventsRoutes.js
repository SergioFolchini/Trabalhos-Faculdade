const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: API de gestão de eventos
 */

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Retorna todos os eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos.
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do evento.
 *                 example: Palestra Inclusão
 *               description:
 *                 type: string
 *                 description: Descrição do evento.
 *                 example: Palestra sobre educação inclusiva
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data do evento.
 *                 example: 2025-06-10
 *               time:
 *                 type: string
 *                 description: Hora do evento.
 *                 example: 19:00
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 */
router.route('/')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/events.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de eventos' });
      }
      const events = JSON.parse(data);
      res.json(events);
    });
  })
  .post((req, res) => {
    const filePath = path.join(__dirname, '../db/events.json');
    const { title, description, date, time } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de eventos' });
      }
      const events = JSON.parse(data);
      const newEvent = {
        id: (events.length + 1).toString(),
        title,
        description,
        date,
        time
      };
      events.push(newEvent);

      fs.writeFile(filePath, JSON.stringify(events, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar o novo evento' });
        }
        res.status(201).json(newEvent);
      });
    });
  });

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento encontrado.
 *       404:
 *         description: Evento não encontrado.
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Novo título do evento.
 *                 example: Workshop Arte Terapia
 *               description:
 *                 type: string
 *                 description: Nova descrição do evento.
 *                 example: Oficina de arte terapia para alunos
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Nova data do evento.
 *                 example: 2025-06-20
 *               time:
 *                 type: string
 *                 description: Nova hora do evento.
 *                 example: 15:00
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do evento
 *     responses:
 *       204:
 *         description: Evento removido com sucesso.
 */
router.route('/:id')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/events.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de eventos' });
      }
      const events = JSON.parse(data);
      const event = events.find(e => e.id === id);

      if (!event) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
      res.json(event);
    });
  })
  .put((req, res) => {
    const filePath = path.join(__dirname, '../db/events.json');
    const { id } = req.params;
    const { title, description, date, time } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de eventos' });
      }
      let events = JSON.parse(data);
      const index = events.findIndex(e => e.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }

      events[index] = { id, title, description, date, time };

      fs.writeFile(filePath, JSON.stringify(events, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar o evento' });
        }
        res.json(events[index]);
      });
    });
  })
  .delete((req, res) => {
    const filePath = path.join(__dirname, '../db/events.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de eventos' });
      }
      let events = JSON.parse(data);
      const index = events.findIndex(e => e.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }

      events.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(events, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover o evento' });
        }
        res.status(204).send();
      });
    });
  });

module.exports = router;