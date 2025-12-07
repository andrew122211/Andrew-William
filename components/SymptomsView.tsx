import React, { useState } from 'react';
import { UserProfile, TriageResult } from '../types';
import { analyzeSymptoms } from '../services/geminiService';
import { AlertTriangle, Phone, Video, Stethoscope, ChevronRight, Activity, Send } from 'lucide-react';

interface SymptomsViewProps {
  profile: UserProfile;
}

const SymptomsView: React.FC<SymptomsViewProps> = ({ profile }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTriage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null); // Clear previous
    const triage = await analyzeSymptoms(input, profile);
    setResult(triage);
    setLoading(false);
  };

  const getUrgencyStyles = (level: string) => {
    switch (level) {
      case 'Emergency': return 'bg-red-50 border-red-200 text-red-900';
      case 'Urgent Care': return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'Virtual Visit': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'Self-Care': return 'bg-green-50 border-green-200 text-green-900';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'Emergency': return <AlertTriangle className="h-10 w-10 text-red-600" />;
      case 'Urgent Care': return <Stethoscope className="h-10 w-10 text-orange-600" />;
      case 'Virtual Visit': return <Video className="h-10 w-10 text-blue-600" />;
      default: return <Activity className="h-10 w-10 text-green-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Disclaimer Banner */}
      <div className="bg-red-600 text-white p-4 rounded-lg shadow-sm flex items-start">
        <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0" />
        <p className="text-sm font-medium">
          If you are experiencing a life-threatening emergency (severe chest pain, difficulty breathing, major bleeding), call 911 immediately. This tool is AI-powered and for informational purposes only.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <h2 className="text-2xl font-bold mb-2">Smart Symptom Guide</h2>
          <p className="text-indigo-100">Describe your symptoms in detail. Our AI will guide you to the right level of care.</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I have a sharp pain in my lower right abdomen and a fever of 101..."
              className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
              {input.length} chars
            </div>
          </div>

          <button
            onClick={handleTriage}
            disabled={loading || !input}
            className={`w-full py-4 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
              loading || !input
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transform active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Analyzing Symptoms...
              </>
            ) : (
              <>
                Analyze Symptoms <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="animate-fade-in-up">
          <div className={`rounded-xl border-2 p-6 md:p-8 shadow-md ${getUrgencyStyles(result.urgencyLevel)}`}>
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                {getIcon(result.urgencyLevel)}
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">
                  Recommendation: {result.urgencyLevel}
                </h3>
                <p className="text-lg font-medium opacity-90 mb-6">
                  {result.summary}
                </p>

                <div className="bg-white/60 rounded-lg p-5 backdrop-blur-sm">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <ChevronRight className="h-5 w-5 mr-1" /> Next Steps
                  </h4>
                  <ul className="space-y-3">
                    {result.actionableSteps.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <span className="bg-white text-slate-800 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 shrink-0 shadow-sm mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action based on result */}
                <div className="mt-6 flex flex-wrap gap-4">
                  {result.urgencyLevel === 'Virtual Visit' && (
                    <button className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
                      <Video className="mr-2 h-5 w-5" />
                      Book Telemedicine
                    </button>
                  )}
                  {result.urgencyLevel === 'Urgent Care' && (
                    <button className="flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm">
                      <Phone className="mr-2 h-5 w-5" />
                      Find Urgent Care Near Me
                    </button>
                  )}
                  {result.urgencyLevel === 'Emergency' && (
                    <button className="flex items-center bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm animate-pulse">
                      <Phone className="mr-2 h-5 w-5" />
                      Call 911 Now
                    </button>
                  )}
                </div>

                <div className="mt-8 text-xs opacity-70 border-t border-current pt-4">
                  <strong>IMPORTANT:</strong> {result.disclaimer}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomsView;