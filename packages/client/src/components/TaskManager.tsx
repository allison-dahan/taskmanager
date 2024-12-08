import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

import { Task as TaskType } from './types';
import { Link } from '@tanstack/react-router';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Get the task being dragged
    const taskList = source.droppableId === 'pending' ? pendingTasks : completedTasks;
    const [movedTask] = taskList.splice(source.index, 1);
    
    // Update task status based on destination
    const newStatus = destination.droppableId === 'pending' ? 'pending' : 'completed';
    
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${movedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task:', err);
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
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Pending Tasks ({pendingTasks.length})</h2>
                <Droppable droppableId="pending">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-[200px] bg-gray-50 p-4 rounded-lg"
                    >
                      {pendingTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <Link
                              to="/tasks/$taskId"
                              params={{ taskId: task.id.toString() }}
                              className={`block p-4 bg-white rounded-lg shadow-sm 
                                ${snapshot.isDragging ? 'shadow-lg' : ''} 
                                hover:shadow cursor-pointer`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.title}
                            </Link>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {pendingTasks.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No pending tasks
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Completed Tasks ({completedTasks.length})</h2>
                <Droppable droppableId="completed">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-[200px] bg-gray-50 p-4 rounded-lg"
                    >
                      {completedTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <Link
                              to="/tasks/$taskId"
                              params={{ taskId: task.id.toString() }}
                              className={`block p-4 bg-white rounded-lg shadow-sm 
                                ${snapshot.isDragging ? 'shadow-lg' : ''} 
                                hover:shadow cursor-pointer`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.title}
                            </Link>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {completedTasks.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No completed tasks
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManager;