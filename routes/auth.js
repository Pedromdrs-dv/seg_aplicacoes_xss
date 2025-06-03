const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');

// Página de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Processa login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Busca o usuário no banco de dados
    const user = await User.findByUsername(username);
    
    if (user && user.password === password) {
      // Não armazena a senha na sessão
      req.session.user = {
        id: user.id,
        username: user.username
      };
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Usuário ou senha inválidos.' });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.render('login', { error: 'Ocorreu um erro ao fazer login. Tente novamente.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Página de registro
router.get('/register', (req, res) => {
  res.render('login', { error: null, register: true });
});

// Processar registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('login', { 
      error: 'Nome de usuário e senha são obrigatórios.', 
      register: true 
    });
  }
  
  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findByUsername(username);
    
    if (existingUser) {
      return res.render('login', { 
        error: 'Este nome de usuário já está em uso.', 
        register: true 
      });
    }
    
    // Cria o novo usuário
    const newUser = await User.create(username, password);
    
    // Login automático após o registro
    req.session.user = {
      id: newUser.id,
      username: newUser.username
    };
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.render('login', { 
      error: 'Ocorreu um erro ao registrar. Tente novamente.', 
      register: true 
    });
  }
});

// Dashboard (protegido)
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    // Carrega informações atualizadas do usuário do banco de dados
    const user = await User.findById(req.session.user.id);
    res.render('dashboard', { user: user || req.session.user });
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    res.render('dashboard', { user: req.session.user });
  }
});

module.exports = router;
