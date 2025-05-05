const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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
    const { title, date, location, description, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de eventos' });
      }
      const events = JSON.parse(data);
      const newEvent = {
        id: (events.length + 1).toString(),
        title: title || '',
        date: date || '',
        location: location || '',
        description: description || '',
        status: status || 'scheduled'
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
    const { title, date, location, description, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de eventos' });
      }
      let events = JSON.parse(data);
      const index = events.findIndex(e => e.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }

      // Atualiza apenas os campos enviados, mantendo os existentes
      events[index] = {
        ...events[index],
        title: title || events[index].title,
        date: date || events[index].date,
        location: location || events[index].location,
        description: description || events[index].description,
        status: status || events[index].status
      };

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