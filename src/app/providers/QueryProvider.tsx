import { QueryClient, QueryClientProvider, keepPreviousData } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Mantiene los datos anteriores mientras cambia un filtro/búsqueda.
      // Evita que los componentes de la página se desmonten durante la petición.
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
    },
  },
})

export const QueryProvider = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)