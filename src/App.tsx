import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ApiKeyGeneration from "./pages/ApiKeyGeneration";
import ApiDocumentation from "./pages/ApiDocumentation";

const App = () => {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <Router>
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="border-b border-gray-200 mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("generate")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "generate"
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Generate API Key
              </button>
              <button
                onClick={() => setActiveTab("docs")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "docs"
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Documentation
              </button>
            </div>
          </nav>

          {activeTab === "generate" ? (
            <ApiKeyGeneration />
          ) : (
            <ApiDocumentation />
          )}
        </div>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
