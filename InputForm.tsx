import React, { useState } from 'react';
import { PropertyType, Condition, UserInput } from '../types';
import { Calculator, MapPin, Ruler, Home, Coins } from 'lucide-react';

interface InputFormProps {
  isLoading: boolean;
  onSubmit: (data: UserInput) => void;
}

const InputForm: React.FC<InputFormProps> = ({ isLoading, onSubmit }) => {
  const [formData, setFormData] = useState<UserInput>({
    address: '',
    propertyType: PropertyType.APARTMENT,
    sizeSqm: 60,
    rooms: 2,
    yearBuilt: 1990,
    condition: Condition.WELL_KEPT,
    currentColdRent: 500,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sizeSqm' || name === 'rooms' || name === 'yearBuilt' || name === 'currentColdRent' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Calculator className="text-[#f5931f]" />
          Ihre Immobilien-Daten
        </h2>
        <p className="text-slate-400 text-sm mt-1">Geben Sie Ihre Objektdaten ein für eine kostenlose KI-Analyse.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Adresse der Immobilie</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
            <input
              type="text"
              name="address"
              required
              placeholder="Musterstraße 1, 10115 Berlin"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f5931f] focus:border-[#f5931f] transition-colors outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Objektart</label>
            <div className="relative group">
                <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f5931f] focus:border-[#f5931f] bg-white outline-none appearance-none transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[#f5931f] hover:-translate-y-0.5 cursor-pointer"
                >
                {Object.values(PropertyType).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-[#f5931f] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Zustand</label>
            <div className="relative group">
                <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f5931f] focus:border-[#f5931f] bg-white outline-none appearance-none transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[#f5931f] hover:-translate-y-0.5 cursor-pointer"
                >
                {Object.values(Condition).map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-[#f5931f] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Wohnfläche (m²)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
              <input
                type="number"
                name="sizeSqm"
                min="10"
                required
                value={formData.sizeSqm}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none"
              />
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Zimmer</label>
            <div className="relative">
              <Home className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
              <input
                type="number"
                name="rooms"
                min="1"
                step="0.5"
                required
                value={formData.rooms}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none"
              />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Baujahr</label>
            <input
              type="number"
              name="yearBuilt"
              min="1800"
              max={new Date().getFullYear()}
              required
              value={formData.yearBuilt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none"
            />
          </div>

          {/* Current Rent */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Aktuelle Kaltmiete (€)</label>
            <div className="relative">
              <Coins className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
              <input
                type="number"
                name="currentColdRent"
                min="0"
                required
                value={formData.currentColdRent}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#f5931f] focus:border-[#f5931f] outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5 
            ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#f5931f] hover:bg-[#d9821a]'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyse läuft...
            </span>
          ) : (
            'Potenzial jetzt berechnen'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;