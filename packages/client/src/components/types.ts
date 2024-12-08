// types.ts
export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    userId: string;
    dueDate?: Date;
  }
  
  export type TaskUpdate = Partial<Omit<Task, 'id' | 'userId'>>;
  
  export interface TaskProps {
    task: Task;
    onDelete: (id: number) => Promise<void>;
    onUpdate: (id: number, updates: TaskUpdate) => Promise<void>;
  }