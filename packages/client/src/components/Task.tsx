import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash, X, Check } from 'lucide-react';
import { TaskProps, TaskUpdate } from './types';

const Task: React.FC<TaskProps> = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (updates: TaskUpdate) => {
    setIsLoading(true);
    try {
      await onUpdate(task.id, updates);
      if (updates.title) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="flex-1 mr-2"
          disabled={isLoading}
        />
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleUpdate({ title: editedTitle })}
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(false)}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          className="w-4 h-4 rounded border-gray-300"
          onChange={() => handleUpdate({ 
            status: task.status === 'completed' ? 'pending' : 'completed' 
          })}
          disabled={isLoading}
        />
        <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
          {task.title}
        </span>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          disabled={isLoading}
          className="text-red-500 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Task;