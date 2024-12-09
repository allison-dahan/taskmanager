//packages/server/src/routes/tasks.ts
import { Hono } from 'hono';
import { TaskService } from '../services/task.service';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

// Define your environment and types
type TaskEnv = {
  Variables: {
    userId: string;
  };
};

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  status: z.string().default('pending'),
});

const updateTaskSchema = createTaskSchema.partial();

// Create router with environment type
const taskRouter = new Hono<TaskEnv>();
const taskService = new TaskService();


// Routes
taskRouter.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    console.log('Fetching tasks for user:', userId); // Add logging

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const tasks = await taskService.getAllTasks(userId);
    console.log('Tasks fetched:', tasks); // Add logging
    return c.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
taskRouter.get('/:id', async (c) => {
  const userId = c.get('userId');
  const id = Number(c.req.param('id'));
  const task = await taskService.getTaskById(id, userId);
  
  if (!task) {
    return c.json({ error: 'Task not found' }, 404);
  }
  
  return c.json(task);
});

taskRouter.post('/', zValidator('json', createTaskSchema), async (c) => {
  try {
    const userId = c.get('userId');
    console.log('Creating task for user:', userId); // Add logging

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskData = await c.req.valid('json');
    console.log('Task data received:', taskData); // Add logging

    const task = await taskService.createTask({
      ...taskData,
      userId,
    });
    console.log('Task created:', task); // Add logging

    return c.json(task, 201);
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

taskRouter.patch('/:id', zValidator('json', updateTaskSchema), async (c) => {
  const userId = c.get('userId');
  const id = Number(c.req.param('id'));
  const taskData = await c.req.valid('json');
  const task = await taskService.updateTask(id, userId, taskData);
  
  if (!task) {
    return c.json({ error: 'Task not found' }, 404);
  }
  
  return c.json(task);
});

taskRouter.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = Number(c.req.param('id'));
  await taskService.deleteTask(id, userId);
  return c.json({ success: true });
});

export default taskRouter;