import React, { useState } from "react";
import { Copy, Check, Key, ShieldCheck, Zap, Database } from "lucide-react";
import { motion } from "framer-motion";

interface Plan {
  name: string;
  description: string;
  features: string[];
  gradient: string;
  icon: JSX.Element;
  price: string;
}

const ApiKeyGeneration: React.FC = () => {
  const [tempKey, setTempKey] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const generateTempKey = () => {
    const newKey = "temp_" + Math.random().toString(36).substr(2, 8);
    setTempKey(newKey);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(tempKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            Generate and manage API keys for seamless integration with our
            services. Choose the plan that best fits your needs.
          </p>
        </motion.div>

        {/* Temporary Key Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Try Our API
                </h2>
                <p className="text-gray-600">
                  Generate a temporary key to test our API endpoints
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateTempKey}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Key className="w-5 h-5" />
                Generate Test Key
              </motion.button>
            </div>

            {tempKey && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Your temporary key:
                    </h3>
                    <p className="font-mono text-orange-600 mt-1">{tempKey}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-500" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
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
