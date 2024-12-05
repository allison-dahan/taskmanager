import { RootRoute, Route, createRouter } from '@tanstack/react-router'
import { SignInPage, SignUpPage } from './components/Auth'
import AuthCallback from './components/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'
import TaskList from './components/TaskList'
import Root from './Root'
import { createElement } from 'react'

const rootRoute = new RootRoute({
  component: Root,
})

// Add OAuth callback routes
const signInCallbackRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/sign-in/sso-callback',
  component: AuthCallback
})

const signUpCallbackRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/sign-up/sso-callback',
  component: AuthCallback
})

// Create the index route
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => createElement(ProtectedRoute, {
    children: createElement(TaskList)
  })
})

// Auth routes
const signInRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/sign-in',
  component: SignInPage
})

const signUpRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: SignUpPage
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute, 
  signInRoute, 
  signUpRoute,
  signInCallbackRoute,
  signUpCallbackRoute
])

// Create and export the router
export const router = createRouter({
  routeTree
})

// Type augmentation
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}