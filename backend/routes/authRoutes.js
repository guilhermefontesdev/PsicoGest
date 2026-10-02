const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nome, email, senha, perfil } = req.body;
  if (!nome || !email || !senha || !perfil) return res.status(400).json({ erro: 'Preencha todos os campos' });

  const senhaHash = await bcrypt.hash(senha, 10);
  const { data, error } = await supabase.from('usuarios').insert([{ nome, email, senha: senhaHash, perfil }]).select().single();
  if (error) return res.status(400).json({ erro: error.message });
  res.status(201).json({ mensagem: 'Usuário cadastrado', usuario: { id: data.id, nome: data.nome, email: data.email, perfil: data.perfil } });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const { data: usuario, error } = await supabase.from('usuarios').select('*').eq('email', email).single();
  if (error || !usuario) return res.status(401).json({ erro: 'E-mail ou senha inválidos' });

  const senhaOk = await bcrypt.compare(senha, usuario.senha);
  if (!senhaOk) return res.status(401).json({ erro: 'E-mail ou senha inválidos' });

  const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil } });
});

module.exports = router;
