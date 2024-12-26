import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Create a client with caching disabled
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data is always considered stale
      gcTime: 0, // Replace cacheTime with gcTime
      refetchOnMount: true, // Always refetch on component mount
      refetchOnWindowFocus: true, // Refetch when window regains focus
      retry: 1,
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)