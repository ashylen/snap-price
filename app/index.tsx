import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import Home from "./components/Home";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
};

export default App;
