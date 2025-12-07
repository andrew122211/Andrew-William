import React from 'react';
import { Activity, ShieldCheck, Search, User, HeartPulse, Menu, X } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { view: AppView.PREVENTIVE, label: 'Preventive Care', icon: ShieldCheck },
    { view: AppView.SYMPTOMS, label: 'Symptom Checker', icon: Activity },
    { view: AppView.RESOURCES, label: 'Resources', icon: Search },
    { view: AppView.PROFILE, label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => onChangeView(AppView.DASHBOARD)}
            >
              <div className="bg-teal-600 p-2 rounded-lg mr-3">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">VitalGuide</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onChangeView(item.view)}
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                    currentView === item.view
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-500 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onChangeView(item.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center px-3 py-4 text-base font-medium rounded-md ${
                    currentView === item.view
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-500 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-4 text-sm">
            <span className="font-semibold text-white">Disclaimer:</span> The content on VitalGuide is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
          </p>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} VitalGuide Health. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;