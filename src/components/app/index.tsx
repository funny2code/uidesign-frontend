import App from "./App";
import { OpenAPI } from "../../client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AppWrapperProps {
  api_url: string;
}
const queryClient = new QueryClient();

const AppWrapper = ({ api_url }: AppWrapperProps) => {
  OpenAPI.BASE = api_url;
  return (
    <main className="container-fluid vh-100">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </main>
  );
};

export default AppWrapper;
