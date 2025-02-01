import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from '@clerk/clerk-react';
import React from "react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
