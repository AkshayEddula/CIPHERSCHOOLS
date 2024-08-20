import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ContextProvider } from './context/context.jsx';
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <ContextProvider>
                <App />
            </ContextProvider>
        </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
