import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Shield,
  ChevronDown,
  ChevronUp,
  Play,
  AlertCircle,
} from "lucide-react";

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

const ApiDocumentation = () => {
  const [copiedText, setCopiedText] = useState("");
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [addressInputs, setAddressInputs] = useState<{ [key: string]: string }>({});
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleExecute = async (endpoint: string, method: string, path: string) => {
    if (!apiKey) {
      setErrors({ ...errors, [endpoint]: "API key is required" });
      return;
    }

    setLoading({ ...loading, [endpoint]: true });
    setErrors({ ...errors, [endpoint]: "" });

    const baseUrl = "https://api.suprascan.fun/api";
    const requestUrl = path.replace("{address}", addressInputs[endpoint] || "");

    try {
      const response = await fetch(`${baseUrl}${requestUrl}`, {
        method,
        headers: {
          "accept": "application/json",
          "x-api-key": apiKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      setResponses({
        ...responses,
        [endpoint]: data
      });
    } catch (error) {
      setErrors({
        ...errors,
        [endpoint]: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setLoading({ ...loading, [endpoint]: false });
    }
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
      path: "/tokens/pools?address={address}",
      description: "Get information about token pools",
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
      path: "/tokens/list?address={address}",
      description: "Get a list of available tokens",
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

  const RequestResponse = ({ endpoint, method, path }: { endpoint: string, method: string, path: string }) => (
    <div className="mt-4 space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Request Details</h4>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`curl -X ${method} \\\n` +
              `'https://api.suprascan.fun/api${path.replace("{address}", addressInputs[endpoint] || "")}' \\\n` +
              `-H 'accept: application/json' \\\n` +
              `-H 'x-api-key: ${apiKey}'`}
          </code>
        </pre>
      </div>

      {loading[endpoint] && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}

      {errors[endpoint] && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{errors[endpoint]}</span>
          </div>
        </div>
      )}

      {responses[endpoint] && !loading[endpoint] && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Response</h4>
            <button
              onClick={() => copyToClipboard(JSON.stringify(responses[endpoint], null, 2))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {copiedText === JSON.stringify(responses[endpoint], null, 2) ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg">
            <pre className="p-4 overflow-auto max-h-[400px]">
              <code className="text-sm">{JSON.stringify(responses[endpoint], null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );

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
                          <p className="text-sm text-gray-500 mt-1">
                            {param.description}
                          </p>
                        </div>
                      ))}

                      {/* Execute Button */}
                      <button
                        onClick={() => handleExecute(endpoint.path, endpoint.method, endpoint.path)}
                        disabled={loading[endpoint.path]}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        {loading[endpoint.path] ? "Executing..." : "Execute"}
                      </button>

                      {/* Example Response */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Example Response</h4>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm">
                            {JSON.stringify(endpoint.exampleResponse, null, 2)}
                          </code>
                        </pre>
                      </div>

                      {/* Request and Response */}
                      <RequestResponse
                        endpoint={endpoint.path}
                        method={endpoint.method}
                        path={endpoint.path}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
        {/* Footer Documentation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Information
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Rate limits: 100 requests per minute per API key. Please contact support
              for increased limits.
            </p>
            <p>
              All timestamps are returned in ISO 8601 format in UTC timezone.
            </p>
            <p>
              For technical support or questions, please reach out to{" "}
              <a
                href="mailto:api-support@suprascan.fun"
                className="text-orange-600 hover:text-orange-700"
              >
                api-support@suprascan.fun
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApiDocumentation;