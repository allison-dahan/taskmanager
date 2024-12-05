// packages/server/src/services/task.service.ts
import { TaskRepository } from '../repositories/task.repository';
import type { Task, NewTask } from '../db/schema';
import { HTTPException } from 'hono/http-exception';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findAll(userId);
  }

  async getTaskById(id: number, userId: string): Promise<Task> {
    const task = await this.taskRepository.findById(userId, id);
    if (!task) {
      throw new HTTPException(404, { message: 'Task not found' });
    }
    return task;
  }

  async createTask(taskData: NewTask): Promise<Task> {
    // Add any business logic validation here
    if (!taskData.title.trim()) {
      throw new HTTPException(400, { message: 'Task title is required' });
    }

    return this.taskRepository.create(taskData);
  }

  async updateTask(id: number, userId: string, taskData: Partial<NewTask>): Promise<Task> {
    const existingTask = await this.taskRepository.findById(userId, id);
    if (!existingTask) {
      throw new HTTPException(404, { message: 'Task not found' });
    }

    const updatedTask = await this.taskRepository.update(userId, id, taskData);
    if (!updatedTask) {
      throw new HTTPException(500, { message: 'Failed to update task' });
    }

    return updatedTask;
  }

  async deleteTask(id: number, userId: string): Promise<void> {
    const deleted = await this.taskRepository.delete(userId, id);
    if (!deleted) {
      throw new HTTPException(404, { message: 'Task not found' });
    }
  }
}