import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import { AuthProvider } from './provider/auth'

const router = createRouter({
  routeTree,
  context: { auth: undefined! } as any,
  defaultPreload: "intent",
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthApp />
)

function AuthApp() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
