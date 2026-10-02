const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  const [{ count: pacientes }, { count: sessoes }, { data: financeiro }, { data: prontuarios }] = await Promise.all([
    supabase.from('pacientes').select('*', { count: 'exact', head: true }),
    supabase.from('agendamentos').select('*', { count: 'exact', head: true }),
    supabase.from('financeiro').select('*'),
    supabase.from('prontuarios').select('*')
  ]);

  const receita = (financeiro || []).filter(i => i.tipo === 'receita').reduce((t, i) => t + Number(i.valor), 0);
  const despesa = (financeiro || []).filter(i => i.tipo === 'despesa').reduce((t, i) => t + Number(i.valor), 0);

  res.json({ pacientes, sessoes, receita, despesa, lucro: receita - despesa, prontuarios: prontuarios?.length || 0 });
});

router.get('/financeiro-mensal', async (req, res) => {
  const { data, error } = await supabase.from('financeiro').select('*');
  if (error) return res.status(400).json({ erro: error.message });

  const meses = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, receita: 0, despesa: 0 }));
  data.forEach(item => {
    const mes = new Date(item.data_pagamento).getMonth();
    meses[mes][item.tipo] += Number(item.valor);
  });
  res.json(meses);
});

module.exports = router;
