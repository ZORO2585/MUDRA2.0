import React, { useState, useEffect } from 'react';
import { Settings, Key, Save, Eye, EyeOff } from 'lucide-react';

interface ApiConfigProps {
  onApiKeyChange: (apiKey: string, provider: string) => void;
}

const ApiConfig: React.FC<ApiConfigProps> = ({ onApiKeyChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('mudra_api_key');
    const savedProvider = localStorage.getItem('mudra_api_provider') || 'openai';
    if (savedKey) {
      setApiKey(savedKey);
      setProvider(savedProvider);
      onApiKeyChange(savedKey, savedProvider);
      setIsSaved(true);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('mudra_api_key', apiKey.trim());
      localStorage.setItem('mudra_api_provider', provider);
      onApiKeyChange(apiKey.trim(), provider);
      setIsSaved(true);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('mudra_api_key');
    localStorage.removeItem('mudra_api_provider');
    setApiKey('');
    setIsSaved(false);
    onApiKeyChange('', provider);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-lg transition-colors ${
          isSaved 
            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="API Configuration"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">API Configuration</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="openai">OpenAI (Whisper + GPT)</option>
                <option value="huggingface">Hugging Face</option>
                <option value="google">Google Cloud Speech</option>
                <option value="azure">Azure Cognitive Services</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {provider === 'openai' && (
                <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Platform</a></p>
              )}
              {provider === 'huggingface' && (
                <p>Get your API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Hugging Face</a></p>
              )}
              {provider === 'google' && (
                <p>Get your API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a></p>
              )}
              {provider === 'azure' && (
                <p>Get your API key from <a href="https://portal.azure.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Azure Portal</a></p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              {isSaved && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {isSaved && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✓ API key saved and ready to use
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConfig;