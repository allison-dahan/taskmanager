import { createFileRoute } from '@tanstack/react-router';
import TaskDetails from '../components/TaskDetails';

export const Route = createFileRoute('/tasks/$taskId')({
  component: () => {
    const { taskId } = Route.useParams();
    return <TaskDetails taskId={parseInt(taskId, 10)} />;
  },
//   validateSearch: (search: Record<string, unknown>) => ({}),
});