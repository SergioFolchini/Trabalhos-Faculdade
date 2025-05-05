const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: API de gestão de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário.
 *                 example: João
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
router.route('/')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/usuarios.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
      }
      const usuarios = JSON.parse(data);
      res.json(usuarios);
    });
  })
  .post((req, res) => {
    const filePath = path.join(__dirname, '../db/usuarios.json');
    const { nome } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
      }
      const usuarios = JSON.parse(data);
      const novoUsuario = {
        id: (usuarios.length + 1).toString(),
        nome
      };
      usuarios.push(novoUsuario);

      fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar o novo usuário' });
        }
        res.status(201).json(novoUsuario);
      });
    });
  });

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *       404:
 *         description: Usuário não encontrado.
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do usuário.
 *                 example: Maria
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso.
 */
router.route('/:id')
  .get((req, res) => {
    const filePath = path.join(__dirname, '../db/usuarios.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
      }
      const usuarios = JSON.parse(data);
      const usuario = usuarios.find(u => u.id === id);

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json(usuario);
    });
  })
  .put((req, res) => {
    const filePath = path.join(__dirname, '../db/usuarios.json');
    const { id } = req.params;
    const { nome } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
      }
      let usuarios = JSON.parse(data);
      const index = usuarios.findIndex(u => u.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      usuarios[index] = { id, nome };

      fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
        }
        res.json(usuarios[index]);
      });
    });
  })
  .delete((req, res) => {
    const filePath = path.join(__dirname, '../db/usuarios.json');
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao ler o arquivo de usuários' });
      }
      let usuarios = JSON.parse(data);
      const index = usuarios.findIndex(u => u.id === id);

      if (index === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      usuarios.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao remover o usuário' });
        }
        res.status(204).send();
      });
    });
  });

module.exports = router;