import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ProfileView from './components/ProfileView';
import PreventiveView from './components/PreventiveView';
import SymptomsView from './components/SymptomsView';
import ResourcesView from './components/ResourcesView';
import { AppView, UserProfile } from './types';
import { ArrowRight, Shield, Activity, Search } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Guest User',
  age: 45,
  gender: 'Female',
  conditions: []
};

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    // Load profile from local storage if available
    const saved = localStorage.getItem('vitalguide_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profile");
      }
    }
  }, []);

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('vitalguide_profile', JSON.stringify(profile));
    // Optional: navigate to preventive view after saving profile if coming from dashboard setup
    alert("Profile saved successfully!");
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.PROFILE:
        return <ProfileView profile={userProfile} onSave={handleSaveProfile} />;
      case AppView.PREVENTIVE:
        return <PreventiveView profile={userProfile} />;
      case AppView.SYMPTOMS:
        return <SymptomsView profile={userProfile} />;
      case AppView.RESOURCES:
        return <ResourcesView />;
      case AppView.DASHBOARD:
      default:
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-10">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Your Health, <span className="text-teal-600">Proactively Managed</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                VitalGuide empowers you with personalized screenings, intelligent symptom checking, and reliable medical resources.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setCurrentView(AppView.PREVENTIVE)}
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold shadow-lg hover:bg-teal-700 transition-all flex items-center"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <div 
                onClick={() => setCurrentView(AppView.PREVENTIVE)}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="bg-teal-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
                  <Shield className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Preventive Care</h3>
                <p className="text-slate-600">
                  Stay ahead of issues with a personalized screening schedule based on your age, gender, and history.
                </p>
              </div>

              <div 
                onClick={() => setCurrentView(AppView.SYMPTOMS)}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                  <Activity className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Symptom Checker</h3>
                <p className="text-slate-600">
                  Not feeling well? Get instant, AI-driven triage advice to decide if you need a doctor or self-care.
                </p>
              </div>

              <div 
                onClick={() => setCurrentView(AppView.RESOURCES)}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <Search className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Knowledge Center</h3>
                <p className="text-slate-600">
                  Access plain-language summaries of medical conditions, treatments, and wellness tips.
                </p>
              </div>
            </div>
            
            {/* Stats / Trust */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl font-bold mb-6">Trusted by Patients</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
                <div className="pt-4 md:pt-0">
                  <div className="text-4xl font-bold text-teal-400 mb-2">24/7</div>
                  <div className="text-slate-400">Availability</div>
                </div>
                <div className="pt-4 md:pt-0">
                  <div className="text-4xl font-bold text-teal-400 mb-2">Secure</div>
                  <div className="text-slate-400">Data Encryption</div>
                </div>
                <div className="pt-4 md:pt-0">
                  <div className="text-4xl font-bold text-teal-400 mb-2">AI</div>
                  <div className="text-slate-400">Powered Insights</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
}

export default App;