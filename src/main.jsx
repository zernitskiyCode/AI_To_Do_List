import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем рефетч при фокусе окна
      refetchOnReconnect: false, // Отключаем рефетч при переподключении
      retry: 2, // Количество попыток при ошибке
      staleTime: 1000 * 60 * 5, // 5 минут - данные считаются свежими
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
  