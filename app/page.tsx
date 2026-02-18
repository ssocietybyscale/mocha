import Header from "./components/Header";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import { CheckCheck, X } from "lucide-react";

import "./page.css";

export default function HomePage() {
  return (
    <>
      <div className="app-container">
        <Toaster
          position="top-right"
          toastOptions={{
            className: "crisp-toast",
            success: {
              icon: <CheckCheck />,
            },
            error: {
              icon: <X />,
            },
          }}
        />
        <Header />
        <Home />
      </div>
    </>
  );
}
