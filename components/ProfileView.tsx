import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newCondition, setNewCondition] = useState('');

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-teal-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Your Health Profile</h2>
          <p className="text-teal-100 text-sm">This information helps us personalize your care guide.</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chronic Conditions / History</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCondition()}
                className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g., Diabetes, Asthma, High BP"
              />
              <button
                onClick={handleAddCondition}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.conditions.map((condition, index) => (
                <span key={index} className="inline-flex items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm border border-teal-100">
                  {condition}
                  <button onClick={() => handleRemoveCondition(index)} className="ml-2 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {formData.conditions.length === 0 && (
                <span className="text-slate-400 text-sm italic">No conditions added yet.</span>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md hover:shadow-lg transform active:scale-95 duration-200"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon component since it was used but not imported in this specific file context above,
// but for cleaner separation I will import it.
import { X } from 'lucide-react';

export default ProfileView;