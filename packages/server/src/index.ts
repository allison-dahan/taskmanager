import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { cors } from 'hono/cors';
import taskRouter from './routes/tasks';

const app = new Hono();

// CORS Middleware
app.use('*', cors({
  origin: ['http://localhost:5173'], // Allow frontend origin
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Authorization', 'Content-Type'],
}));

// Clerk Middleware: Protect All Routes
app.use('*', clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));

app.use('*', async (c, next) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.'
    }, 401);
  }
  // Set userId in the context
  c.set('userId', auth.userId);
  await next();
});





// Protected API Routes
app.route('/api/tasks', taskRouter);

// Export for Bun
export default {
  port: parseInt(process.env.PORT || '3000', 10),
  fetch: app.fetch,
};
