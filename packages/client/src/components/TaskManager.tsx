import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Task from './Task';
import { Task as TaskType, TaskUpdate } from './types';



const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const handleUpdateTask = async (taskId: number, updates: TaskUpdate): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const handleDeleteTask = async (taskId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
      throw err;
    }
  };
if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Pending Tasks ({pendingTasks.length})</h2>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <Task 
                  key={task.id} 
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No pending tasks. Great job!
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Completed Tasks ({completedTasks.length})</h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <Task 
                  key={task.id} 
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {completedTasks.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No completed tasks yet.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default TaskManager;