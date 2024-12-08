import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useAuth } from '@clerk/clerk-react';
import { createTask } from '../api/tasks';
import { z } from 'zod';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { format } from 'date-fns';

// Define schema with Zod
const taskSchema = z.object({
  taskName: z.string().min(3, "Task name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  dueDate: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const CreateTaskForm: React.FC = () => {
  const { getToken, userId } = useAuth();
  const form = useForm<TaskFormValues>({
    defaultValues: { taskName: '', description: '', dueDate: undefined },
    onSubmit: async ({ value }) => {
      
      if (!userId) {
        alert('User is not authenticated.');
        return;
      }
      
      const token = await getToken() || '';
      console.log("user id", userId);
      
      try {
        await createTask({
          title: value.taskName,
          description: value.description,
          userId: userId,
          status: 'pending',
          dueDate: value.dueDate ? new Date(value.dueDate) : undefined,
        }, token);
        alert('Task created successfully!');
      } catch (error) {
        alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-4">
      {/* Card Header */}
      <div className="pb-4 border-b">
        <h1 className="text-xl font-bold">Create Task</h1>
      </div>

      {/* Card Body */}
      <div className="py-4">
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <form.Field
              name="taskName"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Task Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
          </div>
          <div>
            <form.Field
              name="description"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Description</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date || undefined);
                    form.setFieldValue('dueDate', date || undefined);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-500">Fill out all fields to create a new task.</p>
      </div>
    </div>
  );
};

export default CreateTaskForm;
