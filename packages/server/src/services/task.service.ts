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

// packages/server/src/services/task.service.ts
async createTask(taskData: NewTask): Promise<Task> {
  console.log('TaskService.createTask called with:', taskData);

  // Validate required fields
  if (!taskData.title?.trim()) {
    console.log('Task creation failed: Missing title');
    throw new HTTPException(400, { message: 'Task title is required' });
  }

  if (!taskData.userId) {
    console.log('Task creation failed: Missing userId');
    throw new HTTPException(400, { message: 'User ID is required' });
  }

  try {
    // Handle optional fields and type conversion
    const validatedTaskData: NewTask = {
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      status: taskData.status || 'pending',
      userId: taskData.userId,
      // Safely handle optional dueDate
      ...(taskData.dueDate ? { 
        dueDate: taskData.dueDate instanceof Date 
          ? taskData.dueDate 
          : new Date(taskData.dueDate) 
      } : {})
    };

    console.log('Creating task with validated data:', validatedTaskData);
    const createdTask = await this.taskRepository.create(validatedTaskData);
    console.log('Task created successfully:', createdTask);
    return createdTask;
  } catch (error) {
    console.error('Repository error creating task:', error);
    throw new HTTPException(500, { message: 'Failed to create task' });
  }
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