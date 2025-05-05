const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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
    const { name, specialty, email, phone, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de profissionais' });
      }
      const professionals = JSON.parse(data);
      const newProfessional = {
        id: (professionals.length + 1).toString(),
        name: name || '',
        specialty: specialty || '',
        email: email || '',
        phone: phone || '',
        status: status || 'active'
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
    const { name, specialty, email, phone, status } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de profissionais' });
      }
      let professionals = JSON.parse(data);
      const index = professionals.findIndex(p => p.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Profissional não encontrado' });
      }

      // Atualiza apenas os campos enviados, mantendo os existentes
      professionals[index] = {
        ...professionals[index],
        name: name || professionals[index].name,
        specialty: specialty || professionals[index].specialty,
        email: email || professionals[index].email,
        phone: phone || professionals[index].phone,
        status: status || professionals[index].status
      };

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