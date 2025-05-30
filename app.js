const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const vulnerableRoutes = require('./routes/vulnerable');
const secureRoutes = require('./routes/secure');

const app = express();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Sessão
app.use(session({
  secret: 'segredo-super-seguro',
 }));

// Rotas
app.use('/', authRoutes);
app.use('/vulnerable', vulnerableRoutes);
app.use('/secure', secureRoutes);

// Inicialização
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
