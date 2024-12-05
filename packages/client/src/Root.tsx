// client/src/Root.tsx
import { Outlet } from '@tanstack/react-router'

const Root = () => {
  return (
    <div>
      <header>{/* Add your header/nav */}</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Root