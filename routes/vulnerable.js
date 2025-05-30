const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// Simulação de banco de dados em memória
const users = [];

// Formulário de cadastro vulnerável
router.get('/', requireAuth, (req, res) => {
  res.render('vulnerable', { users });
});

// Processa cadastro (sem sanitização)
router.post('/register', requireAuth, (req, res) => {
  const { name } = req.body;
  users.push({ name }); // Armazena diretamente o valor inserido
  res.redirect('/vulnerable');
});

module.exports = router;
