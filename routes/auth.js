const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// Simulação de banco de dados em memória
const users = [
  { username: 'admin', password: 'admin' } // usuário padrão
];

// Página de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Processa login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Usuário ou senha inválidos.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Dashboard (protegido)
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

module.exports = router;
