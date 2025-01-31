import React from "react";

interface ApiRequestResponseProps {
  method: string;
  path: string;
  apiKey: string;
  addressInput: string;
  response: object | null;
}

const ApiRequestResponse: React.FC<ApiRequestResponseProps> = ({
  method,
  path,
  apiKey,
  addressInput,
  response,
}) => {
  const baseUrl = "https://api.suprascan.fun/api";
  const requestUrl = path.replace("{address}", addressInput || "");

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Request Sent</h4>
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`curl -X ${method} \\\n` +
            `'${baseUrl}${requestUrl}' \\\n` +
            `-H 'accept: application/json' \\\n` +
            `-H 'x-api-key: ${apiKey}'`}
        </code>
      </pre>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Request URL</h4>
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">{`${baseUrl}${requestUrl}`}</code>
      </pre>

      {/* Response */}
      {response && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Response</h4>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">{JSON.stringify(response, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiRequestResponse;
