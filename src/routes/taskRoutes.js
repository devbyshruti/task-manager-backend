import express from 'express';
import supabase from '../supabaseClient.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', auth, async (req, res) => {
  const { title, description, project_id } = req.body;

  
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('owner_id', req.user.id)
    .single();

  if (!project) return res.status(403).json({ message: "Unauthorized to add tasks to this project" });

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title,
    description,
    project_id,
    assigned_to: req.user.id
   }])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});


router.get('/:projectId', auth, async (req, res) => {
  const { projectId } = req.params;

  const { data, error } = await supabase
    .from('tasks')
    .select('*, projects!inner(owner_id)') 
    .eq('project_id', projectId)
    .eq('projects.owner_id', req.user.id); 

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});


export default router;