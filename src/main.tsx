import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { setupInterceptors } from "./interceptors/jwtInterceptor.ts";
import { setupErrorInterceptor } from "./interceptors/errorInterceptor.ts";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { AppProvider } from "./context/AppContext.tsx";

setupInterceptors();
setupErrorInterceptor();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
);
