// server/src/middleware/auth.ts
import type { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
})

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader) {
      throw new HTTPException(401, { message: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    
    try {
      const { userId } = await clerk.sessions.getSession(token)
      if (!userId) {
        throw new HTTPException(401, { message: 'Invalid session' })
      }
      c.set('userId', userId)
    } catch (error) {
      throw new HTTPException(401, { message: 'Invalid token' })
    }

    await next()
  } catch (error) {
    throw new HTTPException(401, { message: 'Authentication failed' })
  }
}