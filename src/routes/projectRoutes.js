import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const projectData = {
    name,
    owner_id: req.user.id,
  };

  if (description !== undefined) {
    projectData.description = description;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select();

  if (error) return res.status(400).json({ error });

  res.status(201).json(data);
});

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', req.user.id);

  if (error) return res.status(400).json({ error });

  res.json(data);
});


router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  // If nothing is sent
  if (name === undefined && description === undefined) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const updateData = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .eq('owner_id', req.user.id)
    .select();

  if (error) return res.status(400).json({ error });

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Project not found or not authorized" });
  }

  res.json(data[0]);
});


router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('owner_id', req.user.id) 
    .select();

  if (error) return res.status(400).json({ error });

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Project not found or not authorized" });
  }

  res.json({ message: "Project deleted successfully" });
});

export default router;