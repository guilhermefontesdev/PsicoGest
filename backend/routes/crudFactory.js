const express = require('express');
const supabase = require('../config/supabase');

function crudFactory(tabela) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const { data, error } = await supabase.from(tabela).select('*').order('criado_em', { ascending: false });
    if (error) return res.status(400).json({ erro: error.message });
    res.json(data);
  });

  router.get('/:id', async (req, res) => {
    const { data, error } = await supabase.from(tabela).select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ erro: error.message });
    res.json(data);
  });

  router.post('/', async (req, res) => {
    const { data, error } = await supabase.from(tabela).insert([req.body]).select().single();
    if (error) return res.status(400).json({ erro: error.message });
    res.status(201).json(data);
  });

  router.put('/:id', async (req, res) => {
    const { data, error } = await supabase.from(tabela).update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(400).json({ erro: error.message });
    res.json(data);
  });

  router.delete('/:id', async (req, res) => {
    const { error } = await supabase.from(tabela).delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ erro: error.message });
    res.json({ mensagem: 'Registro removido' });
  });

  return router;
}

module.exports = crudFactory;
