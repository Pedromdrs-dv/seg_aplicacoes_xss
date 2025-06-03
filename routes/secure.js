const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const xss = require('xss');
const Message = require('../models/Message');

// Formulário de cadastro seguro
router.get('/', requireAuth, async (req, res) => {
  try {
    // Busca todas as mensagens sanitizadas
    const messages = await Message.getAll(true);
    res.render('secure', { messages, error: null });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.render('secure', { messages: [], error: 'Erro ao carregar mensagens' });
  }
});

// Processa cadastro com sanitização
router.post('/register', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;

    // Verifica se há tentativa de injeção de script
    if (/<script.*?>.*?<\/script>/i.test(message)) {
      const messages = await Message.getAll(true);
      return res.render('secure', {
        messages,
        error: 'Erro: Código JavaScript detectado. Inserção bloqueada por segurança.'
      });
    }

    // Sanitiza a entrada antes de salvar
    const sanitizedMessage = xss(message);
    await Message.create(req.session.user.id, sanitizedMessage, true);
    res.redirect('/secure');
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    const messages = await Message.getAll(true);
    res.render('secure', { messages, error: 'Erro ao salvar mensagem' });
  }
});

module.exports = router;
