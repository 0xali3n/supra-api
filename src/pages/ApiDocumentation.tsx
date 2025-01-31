import React, { useState } from "react";
import {
  Copy,
  Check,
  Shield,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ApiRequestResponse from "../components/ApiRequestResponse";

interface EndpointProps {
  method: string;
  path: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  exampleResponse: object;
}

const ApiDocumentation: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string>("");
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [addressInputs, setAddressInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [responses, setResponses] = useState<{ [key: string]: object | null }>(
    {}
  );

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleExecute = (endpoint: string, exampleResponse: object) => {
    // Simulate API call
    setResponses({
      ...responses,
      [endpoint]: exampleResponse,
    });
  };

  const endpoints: EndpointProps[] = [
    {
      method: "GET",
      path: "/transactions?address={address}",
      description: "Retrieve all transactions for a specific address",
      parameters: [
        {
          name: "address",
          type: "string",
          required: true,
          description: "Wallet address to query",
        },
      ],
      exampleResponse: {
        status: "success",
        data: {
          transactions: [
            {
              hash: "0x123...abc",
              type: "transfer",
              timestamp: "2024-02-01T12:00:00Z",
              amount: "100.5",
              token: "SUPRA",
            },
          ],
        },
      },
    },
    {
      method: "GET",
      path: "/transactions/transfer?address={address}",
      description: "Get transfer-specific transactions for an address",
      parameters: [
        {
          name: "address",
          type: "string",
          required: true,
          description: "Wallet address to query",
        },
      ],
      exampleResponse: {
        status: "success",
        data: {
          transfers: [
            {
              hash: "0x456...def",
              from: "0xabc...",
              to: "0xdef...",
              amount: "50.0",
              token: "SUPRA",
            },
          ],
        },
      },
    },
    {
      method: "GET",
      path: "/tokens/portfolio?address={address}",
      description: "Get token portfolio for a specific address",
      parameters: [
        {
          name: "address",
          type: "string",
          required: true,
          description: "Wallet address to query",
        },
      ],
      exampleResponse: {
        status: "success",
        data: {
          portfolio: [
            {
              token: "SUPRA",
              balance: "1000.5",
              value_usd: "5000.25",
            },
          ],
        },
      },
    },
    {
      method: "GET",
      path: "/tokens/pools",
      description: "Get information about token pools",
      parameters: [],
      exampleResponse: {
        status: "success",
        data: {
          pools: [
            {
              id: "pool1",
              tokenA: "SUPRA",
              tokenB: "ETH",
              liquidity: "10000",
            },
          ],
        },
      },
    },
    {
      method: "GET",
      path: "/tokens/list",
      description: "Get a list of available tokens",
      parameters: [],
      exampleResponse: {
        status: "success",
        data: {
          tokens: [
            {
              symbol: "SUPRA",
              name: "Supra Token",
              decimals: 18,
            },
          ],
        },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
            API Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Access comprehensive blockchain data from the Supra network
            including transactions, assets, pools, and more.
          </p>
        </motion.div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Base URL
            </h2>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <code className="text-orange-600 font-mono">
                https://api.suprascan.fun/api
              </code>
              <button
                onClick={() => copyToClipboard("https://api.suprascan.fun/api")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {copiedText === "https://api.suprascan.fun/api" ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Authentication
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              All API requests require authentication using your API key in the
              headers:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm font-mono">x-api-key: YOUR_API_KEY</code>
            </div>
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() =>
                  setExpandedEndpoint(
                    expandedEndpoint === endpoint.path ? null : endpoint.path
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <code className="text-sm font-mono text-orange-600">
                      {endpoint.method} {endpoint.path}
                    </code>
                    <p className="text-gray-600 mt-2">{endpoint.description}</p>
                  </div>
                  {expandedEndpoint === endpoint.path ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {expandedEndpoint === endpoint.path && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6 space-y-4">
                      {/* API Key Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key
                        </label>
                        <input
                          type="text"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your API key"
                          className="w-full p-2 border border-gray-200 rounded-lg"
                        />
                      </div>

                      {/* Parameters */}
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {param.name}{" "}
                            {param.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={addressInputs[endpoint.path] || ""}
                            onChange={(e) =>
                              setAddressInputs({
                                ...addressInputs,
                                [endpoint.path]: e.target.value,
                              })
                            }
                            placeholder={`Enter ${param.name}`}
                            className="w-full p-2 border border-gray-200 rounded-lg"
                          />
                        </div>
                      ))}

                      {/* Execute Button */}
                      <button
                        onClick={() =>
                          handleExecute(endpoint.path, endpoint.exampleResponse)
                        }
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        <Play className="w-4 h-4" />
                        Execute
                      </button>

                      {/* Request and Response */}
                      {responses[endpoint.path] && (
                        <ApiRequestResponse
                          method={endpoint.method}
                          path={endpoint.path}
                          apiKey={apiKey}
                          addressInput={addressInputs[endpoint.path]}
                          response={responses[endpoint.path]}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
