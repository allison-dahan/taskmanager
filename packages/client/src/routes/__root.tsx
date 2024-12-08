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
          <Link to="/profile" activeProps={activeProps}>
            {({ isActive }) => <>Profile {isActive && "~"}</>}
          </Link>
        </li>
        <li>
          <Link to="/create-task" activeProps={activeProps}>
            Create Task
          </Link>
        </li>
      </ul>
      <Outlet />
    </>
  ),
});