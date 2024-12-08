import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
const activeProps = {
  style: {
    fontWeight: "bold",
  },
};
export const Route = createRootRoute({
  component: () => (
    <>
      <h1>My App</h1>
      <ul>
        <li>
          <Link to="/tasks" activeProps={activeProps}>
            My Tasks
          </Link>
        </li>
        <li>
          <Link to="/create-task" activeProps={activeProps}>
            Create Task
          </Link>
        </li>
        <li>
          <Link to="/sign-out" activeProps={activeProps}>
            Sign out
          </Link>
        </li>
      </ul>
      <Outlet />
    </>
  ),
});