import React, { useState } from 'react';
import { HealthResource } from '../types';
import { searchHealthResources } from '../services/geminiService';
import { Search, BookOpen, Tag, ArrowRight } from 'lucide-react';

const PRESET_TOPICS = ['Diabetes Management', 'Heart Health', 'Stress & Anxiety', 'Seasonal Flu', 'Nutrition Basics'];

const ResourcesView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<HealthResource[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return;
    setQuery(searchTerm);
    setLoading(true);
    const results = await searchHealthResources(searchTerm);
    setResources(results);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Health Knowledge Center</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Trusted information simplified. Ask about conditions, treatments, or wellness tips.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Search for a topic (e.g., 'How to lower cholesterol')..."
          className="w-full px-6 py-4 pl-12 rounded-full border border-slate-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
        <button
          onClick={() => handleSearch(query)}
          className="absolute right-2 top-2 bottom-2 bg-teal-600 text-white px-6 rounded-full font-medium hover:bg-teal-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Suggested Topics */}
      {resources.length === 0 && !loading && (
        <div className="text-center mt-8">
          <p className="text-sm text-slate-400 font-medium mb-4 uppercase tracking-wider">Popular Topics</p>
          <div className="flex flex-wrap justify-center gap-3">
            {PRESET_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => handleSearch(topic)}
                className="bg-white border border-slate-200 px-4 py-2 rounded-full text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all shadow-sm"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg truncate" title={res.topic}>
                {res.topic}
              </h3>
              <BookOpen className="h-5 w-5 text-teal-500" />
            </div>
            
            <div className="p-6 flex-grow">
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {res.summary}
              </p>
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Advice</h4>
                <ul className="space-y-2">
                  {res.keyAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 mr-2 shrink-0"></div>
                      {advice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex flex-wrap gap-2 border-t border-slate-100">
              {res.relatedTags.map((tag, i) => (
                <span key={i} className="flex items-center text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                  <Tag className="h-3 w-3 mr-1" /> {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesView;