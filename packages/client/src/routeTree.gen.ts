// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes
import { Route as rootRoute } from './routes/__root';
// import { Route as HomeRouteImport } from './routes/index';
import { Route as CreateTaskRouteImport } from './routes/create-task';
import {Route as ViewAllTasksImport} from "./routes/tasks";
import {Route as TaskDetailsImport} from "./routes/tasks.$taskId"
import { Route as SignOutRouteImport } from "./routes/sign-out";
// Add more route imports as needed

// Create/Update Routes
// const HomeRoute = HomeRouteImport.update({
//   path: '/',
//   getParentRoute: () => rootRoute,
// } as any);

const CreateTaskRoute = CreateTaskRouteImport.update({
  path: '/create-task',
  getParentRoute: () => rootRoute,
} as any);

const ViewAllTasksRoute = ViewAllTasksImport.update({
  path: '/tasks',
  getParentRoute: () => rootRoute,
} as any);

const TaskDetailsRoute = TaskDetailsImport.update({
  path: '/tasks/$taskId',
  getParentRoute: () => rootRoute,
} as any);

const SignOutRoute = SignOutRouteImport.update({
  path: '/sign-out',
  getParentRoute: () => rootRoute,
} as any);


// Populate the FileRoutesByPath interface
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    // '/': {
    //   preLoaderRoute: typeof HomeRouteImport;
    //   parentRoute: typeof rootRoute;
    // };
    '/create-task': {
      preLoaderRoute: typeof CreateTaskRouteImport;
      parentRoute: typeof rootRoute;
    };
    '/tasks': {
      preLoaderRoute: typeof ViewAllTasksImport;
      parentRoute: typeof rootRoute;
    };
    '/tasks/$taskId': {
      preLoaderRoute: typeof TaskDetailsImport;
      parentRoute: typeof rootRoute;
    };
    '/sign-out': {  // Add this interface
      preLoaderRoute: typeof SignOutRouteImport;
      parentRoute: typeof rootRoute;
    }
    // Add more routes to the interface as needed
  }
}

// Create and export the route tree
export const routeTree = rootRoute.addChildren([
  // HomeRoute,
  CreateTaskRoute,
  ViewAllTasksRoute,
  TaskDetailsRoute,
  SignOutRoute
  
]);

/* prettier-ignore-end */
import { createRouter } from '@tanstack/react-router';

export const router = createRouter({
  routeTree,
});