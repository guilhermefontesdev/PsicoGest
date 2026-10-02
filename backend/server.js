const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { authMiddleware, permitir } = require('./middleware/authMiddleware');
const crudFactory = require('./routes/crudFactory');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pacientes', authMiddleware, crudFactory('pacientes'));
app.use('/api/agendamentos', authMiddleware, crudFactory('agendamentos'));
app.use('/api/prontuarios', authMiddleware, permitir('admin', 'psicologo'), crudFactory('prontuarios'));
app.use('/api/financeiro', authMiddleware, permitir('admin'), crudFactory('financeiro'));
app.use('/api/planos', authMiddleware, crudFactory('planos'));
app.use('/api/documentos', authMiddleware, crudFactory('documentos'));
app.use('/api/convenios', authMiddleware, permitir('admin'), crudFactory('convenios'));
app.use('/api/tarefas', authMiddleware, crudFactory('tarefas'));
app.use('/api/salas', authMiddleware, crudFactory('salas'));
app.use('/api/relatorios', authMiddleware, require('./routes/relatoriosRoutes'));

app.get('/', (req, res) => res.redirect('/pages/login.html'));

const PORT = process.env.PORT || 4234;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
