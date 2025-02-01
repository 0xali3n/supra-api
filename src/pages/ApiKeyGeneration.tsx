import React, { useState, useEffect } from "react";
import { Copy, Check, Key, ShieldCheck, Zap, Database, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { ApiKey } from "../types";
import { useUser } from "@clerk/clerk-react";

interface Plan {
  name: string;
  description: string;
  features: string[];
  gradient: string;
  icon: JSX.Element;
  price: string;
}

const ApiKeyGeneration: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch existing API keys
  const fetchApiKeys = async () => {
    if (!isSignedIn || !user) return;
    
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${baseUrl}/api-keys`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          userId: user.id
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.success) {
        setApiKeys(data.data);
      } else {
        setError(data.error || 'Failed to fetch API keys');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error connecting to server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchApiKeys();
    }
  }, [isSignedIn, user?.id]);

  const generateApiKey = async () => {
    if (!isSignedIn || !user) {
      setError('Please sign in to generate API keys');
      return;
    }
  
    setLoading(true);
    setError(null);
    try {
      console.log('Generating key for user:', user.id); // Debug log
      const response = await fetch(`${baseUrl}/generate-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          plan: 'FREE'
        }),
      });
      
      const data = await response.json();
      console.log('Generate key response:', data); // Debug log
      if (data.success) {
        await fetchApiKeys(); // Refresh the list
      } else {
        setError(data.message || 'Failed to generate API key');
      }
    } catch (err) {
      console.error('Generate key error:', err); // Debug log
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // const deactivateKey = async (apiKey: string) => {
  //   if (!isSignedIn || !user) return;

  //   try {
  //     const response = await fetch(`${baseUrl}/deactivate-key`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-api-key': import.meta.env.VITE_API_KEY,
  //       },
  //       body: JSON.stringify({
  //         apiKey,
  //         userId: user.id
  //       }),
  //     });
      
  //     const data = await response.json();
  //     if (data.success) {
  //       await fetchApiKeys(); // Refresh the list
  //     } else {
  //       setError('Failed to deactivate key');
  //     }
  //   } catch (err) {
  //     setError('Error connecting to server');
  //   }
  // };

  const copyToClipboard = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatApiKey = (key: string, isVisible: boolean, isMobile: boolean = false) => {
    if (!isVisible) {
      return `${key.slice(0, 8)}••••••${key.slice(-4)}`;
    }
    if (isMobile && !isVisible) {
      return `${key.slice(0, 6)}•••`;
    }
    if(isMobile && isVisible){
      return `${key.slice(0, 6)}•••`;
    }
    return key;
  };

  // Toggle visibility for a specific key
  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const plans: Plan[] = [
    {
      name: "Free Plan",
      description: "Perfect for testing and personal projects",
      price: "$0/month",
      icon: <Database className="w-6 h-6" />,
      features: [
        "1 API Key",
        "60 requests/minute",
        "Basic endpoints access",
        "1,000 requests/day",
        "Community support",
      ],
      gradient: "from-orange-400 to-red-500",
    },
    {
      name: "Pro Plan",
      description: "Ideal for small businesses and startups",
      price: "$49/month",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "5 API Keys",
        "120 requests/minute",
        "All standard endpoints",
        "10,000 requests/day",
        "Priority email support",
      ],
      gradient: "from-red-400 to-red-600",
    },
    {
      name: "Business Plan",
      description: "For enterprises requiring high-volume access",
      price: "$199/month",
      icon: <ShieldCheck className="w-6 h-6" />,
      features: [
        "20 API Keys",
        "300 requests/minute",
        "Premium endpoints access",
        "100,000 requests/day",
        "24/7 dedicated support",
      ],
      gradient: "from-red-500 to-orange-600",
    },
  ];
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to manage your API keys and access our services.
          </p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
            API Key Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome, {user?.firstName || user?.username}! Generate and manage your API keys here.
          </p>
        </motion.div>

        {/* API Keys List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Your API Keys
                </h2>
                <p className="text-gray-600">
                  Currently on Free Plan (4 keys maximum)
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateApiKey}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <Key className="w-5 h-5" />
                {loading ? 'Generating...' : 'Generate New Key'}
              </motion.button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

          <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {/* Desktop view */}
                        <span className="font-mono text-orange-600 hidden sm:block">
                          {formatApiKey(apiKey.key, !!visibleKeys[apiKey.id])}
                        </span>
                        {/* Mobile view */}
                        <span className="font-mono text-orange-600 block sm:hidden">
                          {formatApiKey(apiKey.key, !!visibleKeys[apiKey.id], true)}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {apiKey.plan}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                      </p>
                      {apiKey.lastUsed && (
                        <p className="text-sm text-gray-500">
                          Last Used: {new Date(apiKey.lastUsed).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={visibleKeys[apiKey.id] ? "Hide API Key" : "Show API Key"}
                      >
                        {visibleKeys[apiKey.id] ? (
                          <EyeOff className="w-5 h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-500" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Copy to Clipboard"
                      >
                        {copied === apiKey.key ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-500" />
                        )}
                      </motion.button>
                      {/* <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deactivateKey(apiKey.key)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-500"
                        title="Delete API Key"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button> */}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {apiKeys.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No API keys generated yet
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={`relative bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                selectedPlan === index ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => setSelectedPlan(index)}
            >
              <div
                className={`absolute inset-x-0 h-2 top-0 rounded-t-xl bg-gradient-to-r ${plan.gradient}`}
              />
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {plan.name}
                    </h2>
                    <p className="text-gray-600 mt-1">{plan.description}</p>
                  </div>
                  <div
                    className={`p-2 rounded-full bg-gradient-to-r ${plan.gradient} text-white`}
                  >
                    {plan.icon}
                  </div>
                </div>

                <p className="text-2xl font-bold text-gray-900 mb-6">
                  {plan.price}
                </p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center text-gray-700"
                      whileHover={{ x: 2 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-red-400 mr-2" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${plan.gradient} text-white px-4 py-3 rounded-lg hover:shadow-md transition-all duration-300`}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGeneration;
