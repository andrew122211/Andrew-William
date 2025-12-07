import React, { useEffect, useState } from 'react';
import { UserProfile, Screening } from '../types';
import { getPreventiveCarePlan } from '../services/geminiService';
import { CalendarCheck, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface PreventiveViewProps {
  profile: UserProfile;
}

const PreventiveView: React.FC<PreventiveViewProps> = ({ profile }) => {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchScreenings = async () => {
    setLoading(true);
    const results = await getPreventiveCarePlan(profile);
    setScreenings(results);
    setLoading(false);
    setHasFetched(true);
  };

  useEffect(() => {
    // Only fetch if we haven't yet, or allow manual refresh
    if (!hasFetched) {
      fetchScreenings();
    }
  }, [profile]); // If profile changes, effect runs? No, usually safer to rely on explicit button or mount if profile is stable. 
  // Given user might update profile, let's auto-fetch if profile changed significantly, or just on mount.
  // For simplicity, we fetch on mount if empty.

  const handleBook = (screeningName: string) => {
    alert(`Redirecting to scheduling for: ${screeningName}\n\nIn a real app, this would open the appointment modal or provider directory.`);
  };

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'Critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'Routine': return 'border-l-4 border-teal-500 bg-white';
      case 'Optional': return 'border-l-4 border-slate-300 bg-slate-50 opacity-80';
      default: return 'bg-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-teal-700 rounded-xl p-6 text-white shadow-md">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <CalendarCheck className="mr-3 h-8 w-8" />
            Your Preventive Care Plan
          </h2>
          <p className="mt-2 text-teal-100">
            Based on your profile: {profile.age} years old, {profile.gender}.
          </p>
        </div>
        <button
          onClick={fetchScreenings}
          disabled={loading}
          className="mt-4 md:mt-0 flex items-center bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Plan
        </button>
      </div>

      {loading && (
        <div className="grid gap-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      )}

      {!loading && screenings.length === 0 && hasFetched && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <CheckCircle2 className="h-12 w-12 text-teal-500 mx-auto mb-4" />
          <p className="text-slate-600">No specific screenings found. You seem to be up to date!</p>
        </div>
      )}

      <div className="grid gap-6">
        {screenings.map((item, idx) => (
          <div key={idx} className={`rounded-xl shadow-sm p-6 border border-slate-200 transition-all hover:shadow-md ${categoryColor(item.category)}`}>
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                  {item.category === 'Critical' && (
                    <span className="ml-3 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                      Due Now
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-500 font-medium mb-3 flex items-center">
                  <span className="uppercase tracking-wider text-xs bg-slate-100 px-2 py-1 rounded mr-3">
                    {item.frequency}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {item.reason}
                </p>
              </div>
              
              <div className="flex-shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => handleBook(item.name)}
                  className="w-full md:w-auto px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                >
                  Schedule Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreventiveView;