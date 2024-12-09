// packages/server/src/services/task.service.ts
import { TaskRepository } from '../repositories/task.repository';
import type { Task, NewTask } from '../db/schema';
import { HTTPException } from 'hono/http-exception';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(taskData: NewTask): Promise<Task> {
    console.log('TaskService.createTask called with:', taskData);

    try {
      // Validate required fields
      if (!taskData.title?.trim()) {
        console.log('Task creation failed: Missing title');
        throw new HTTPException(400, { message: 'Task title is required' });
      }

      if (!taskData.userId) {
        console.log('Task creation failed: Missing userId');
        throw new HTTPException(400, { message: 'User ID is required' });
      }

      // Format the task data to match schema
      const validatedTaskData: NewTask = {
        title: taskData.title.trim(),
        userId: taskData.userId,
        description: taskData.description?.trim(),
        status: taskData.status || 'pending',
        completed: taskData.status === 'completed' ? true : false,  // Map status to completed boolean
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Creating task with validated data:', validatedTaskData);
      const createdTask = await this.taskRepository.create(validatedTaskData);
      console.log('Task created successfully:', createdTask);
      return createdTask;
    } catch (error) {
      console.error('Repository error creating task:', error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, { message: 'Failed to create task' });
    }
  }

  async updateTask(id: number, userId: string, taskData: Partial<NewTask>): Promise<Task> {
    const existingTask = await this.taskRepository.findById(userId, id);
    if (!existingTask) {
      throw new HTTPException(404, { message: 'Task not found' });
    }

    // If status is being updated, also update the completed field
    if (taskData.status) {
      taskData.completed = taskData.status === 'completed';
    }

    const updatedTask = await this.taskRepository.update(userId, id, {
      ...taskData,
      updatedAt: new Date()
    });

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

  // Add getAllTasks method
  async getAllTasks(userId: string): Promise<Task[]> {
    try {
      if (!userId) {
        throw new HTTPException(400, { message: 'User ID is required' });
      }

      const tasks = await this.taskRepository.findAll(userId);
      console.log('Retrieved tasks for user:', userId, tasks);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, { message: 'Failed to fetch tasks' });
    }
  }


  // Add getTaskById method
  async getTaskById(id: number, userId: string): Promise<Task> {
    try {
      if (!userId) {
        throw new HTTPException(400, { message: 'User ID is required' });
      }

      const task = await this.taskRepository.findById(userId, id);
      if (!task) {
        throw new HTTPException(404, { message: 'Task not found' });
      }

      return task;
    } catch (error) {
      console.error('Error fetching task by id:', error);
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, { message: 'Failed to fetch task' });
    }
  }
}