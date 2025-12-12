import React, { useState } from 'react';
import { ASLFingerspelling } from './ASLHandSigns';
import { BookOpen, Search, Hash, Type } from 'lucide-react';

const ASLReference: React.FC = () => {
  const [fingerspelling] = useState(new ASLFingerspelling());
  const [activeTab, setActiveTab] = useState<'alphabet' | 'numbers'>('alphabet');
  const [searchTerm, setSearchTerm] = useState('');

  const { alphabet, numbers } = fingerspelling.getAllSigns();

  const filteredSigns = activeTab === 'alphabet' 
    ? alphabet.filter(sign => 
        sign.letter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sign.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : numbers.filter(sign => 
        sign.letter.includes(searchTerm) ||
        sign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">ASL Reference</h2>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('alphabet')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'alphabet'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Type className="h-4 w-4" />
            <span>Alphabet</span>
          </button>
          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'numbers'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Hash className="h-4 w-4" />
            <span>Numbers</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Signs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredSigns.map((sign, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 hover:scale-105 border border-blue-100"
          >
            <div className="text-4xl mb-3">
              {sign.emoji}
            </div>
            <div className="text-2xl font-bold text-blue-800 mb-2">
              {sign.letter}
            </div>
            <div className="text-xs text-gray-600 leading-tight">
              {sign.description}
            </div>
            <div className="text-xs text-blue-500 mt-2 font-medium">
              {sign.handShape}
            </div>
          </div>
        ))}
      </div>

      {filteredSigns.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No signs found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <div className="text-center">
            <div className="font-semibold text-blue-600">{alphabet.length}</div>
            <div>Letters</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{numbers.length}</div>
            <div>Numbers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">{filteredSigns.length}</div>
            <div>Showing</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASLReference;