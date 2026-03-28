import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from '../Features/Auth/hooks/useAuth'
const App = () => {
  const { fetchMe } = useAuth()
  useEffect(() => {
    fetchMe()
  }, [])
  return (
    <RouterProvider router={router} />
  )
}

export default App