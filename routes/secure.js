const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const xss = require('xss');

// Simulação de banco de dados em memória
const users = [];

// Formulário de cadastro seguro
router.get('/', requireAuth, (req, res) => {
  res.render('secure', { users });
});

// Processa cadastro com sanitização
router.post('/register', requireAuth, (req, res) => {
  const { name } = req.body;

  // Verifica se há tentativa de injeção de script
  if (/<script.*?>.*?<\/script>/i.test(name)) {
    return res.render('secure', {
      users,
      error: 'Erro: Código JavaScript detectado. Inserção bloqueada por segurança.'
    });
  }

  const sanitizedName = xss(name);
  users.push({ name: sanitizedName });
  res.redirect('/secure');
});


module.exports = router;
