import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTasks, useUpdateTaskStatus } from '../hooks/useTasks';
import { Task } from './types';

const TaskManager: React.FC = () => {
  const { 
    data: tasks = [], 
    isLoading, 
    error, 
    refetch 
  } = useTasks();
  const updateTaskStatus = useUpdateTaskStatus();

  // Add console logs for debugging
  console.log('Tasks loaded:', tasks);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  const pendingTasks = tasks.filter((task: Task) => task.status === 'pending');
  const completedTasks = tasks.filter((task: Task) => task.status === 'completed');

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) return;
  
    const sourceList = source.droppableId === 'pending' ? pendingTasks : completedTasks;
    const movedTask = sourceList[source.index];
    const newStatus: 'pending' | 'completed' = destination.droppableId === 'pending' ? 'pending' : 'completed';
    
    try {
      // Call the mutation
      await updateTaskStatus.mutateAsync({
        taskId: movedTask.id,
        status: newStatus
      });
    } catch (err) {
      console.error('Error updating task status:', err);
      // If the update fails, refetch to get the correct state
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load tasks'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Pending Tasks ({pendingTasks.length})
                </h2>
                <Droppable droppableId="pending">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-[200px] bg-gray-50 p-4 rounded-lg"
                    >
                      {pendingTasks.map((task: Task, index: number) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id.toString()} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Link
                              to="/tasks/$taskId"
                              params={{ taskId: task.id.toString() }}
                              className={`block p-4 bg-white rounded-lg shadow-sm 
                                ${snapshot.isDragging ? 'shadow-lg' : ''} 
                                hover:shadow cursor-pointer
                                ${updateTaskStatus.isPending ? 'opacity-50' : ''}`}
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
                <h2 className="text-lg font-semibold mb-2">
                  Completed Tasks ({completedTasks.length})
                </h2>
                <Droppable droppableId="completed">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-[200px] bg-gray-50 p-4 rounded-lg"
                    >
                      {completedTasks.map((task: Task, index: number) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id.toString()} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Link
                              to="/tasks/$taskId"
                              params={{ taskId: task.id.toString() }}
                              className={`block p-4 bg-white rounded-lg shadow-sm 
                                ${snapshot.isDragging ? 'shadow-lg' : ''} 
                                hover:shadow cursor-pointer
                                ${updateTaskStatus.isPending ? 'opacity-50' : ''}`}
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