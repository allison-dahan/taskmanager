import { db } from '../db/index';
import { tasks } from '../db/schema';
import type { NewTask, Task } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export class TaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    return await db.select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .execute();
  }

  async findById(userId: string, id: number): Promise<Task | undefined> {
    const results = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .execute();
    return results[0];
  }

  // packages/server/src/repositories/task.repository.ts
  async create(task: NewTask): Promise<Task> {
    try {
      console.log('Repository creating task with data:', task);
      
      const [newTask] = await db.insert(tasks)
        .values({
          ...task,
          createdAt: new Date(),
          updatedAt: new Date(),
          completed: task.status === 'completed'  // Ensure completed matches status
        })
        .returning()
        .execute();

      if (!newTask) {
        throw new Error('Failed to create task - no task returned');
      }

      console.log('Repository created task:', newTask);
      return newTask;
    } catch (error) {
      console.error('Repository error in create:', error);
      throw error;
    }
  }

  async update(userId: string, id: number, task: Partial<NewTask>): Promise<Task | undefined> {
    const [updatedTask] = await db.update(tasks)
      .set({ 
        ...task,
        updatedAt: new Date(),
        completed: task.status === 'completed' ? true : task.completed  // Update completed based on status
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning()
      .execute();
    return updatedTask;
  }


  async delete(userId: string, id: number): Promise<boolean> {
    const [deletedTask] = await db.delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning()
      .execute();
    return !!deletedTask;
  }
}