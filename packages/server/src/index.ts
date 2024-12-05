import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import taskRouter from './routes/tasks';

// Define custom error type
interface HTTPResponseError extends Error {
  status: number;
}

// Define your app environment
type AppEnvironment = {
  Variables: {
    userId: string;
  };
};

const app = new Hono<AppEnvironment>();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Error handling middleware
app.onError((err, c) => {
  const error = err as HTTPResponseError;
  return c.json({
    error: error.message,
    status: error.status || 500
  }, error.status || 500);
});

// Routes
app.route('/api/tasks', taskRouter);

// Health check
app.get('/', (c) => c.json({ status: 'ok' }));

// Start server
const port = process.env.PORT || 3000;
serve({
  fetch: app.fetch,
  port: Number(port)
}, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});