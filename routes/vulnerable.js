const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Message = require('../models/Message');

// Formulário de cadastro vulnerável
router.get('/', requireAuth, async (req, res) => {
  try {
    // Busca todas as mensagens não sanitizadas
    const messages = await Message.getAll(false);
    res.render('vulnerable', { messages, error: null });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.render('vulnerable', { messages: [], error: 'Erro ao carregar mensagens' });
  }
});

// Processa cadastro (sem sanitização)
router.post('/register', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    // Armazena diretamente o valor inserido sem sanitização (vulnerável a XSS)
    await Message.create(req.session.user.id, message, false);
    res.redirect('/vulnerable');
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    const messages = await Message.getAll(false);
    res.render('vulnerable', { messages, error: 'Erro ao salvar mensagem' });
  }
});

module.exports = router;
