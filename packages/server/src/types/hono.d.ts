import { ContextVariableMap } from 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    userId: string; // Add custom userId key to the context
  }
}
