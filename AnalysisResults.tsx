import React from 'react';
import { AnalysisResult, UserInput } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
  input: UserInput;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, input }) => {
  
  const chartData = [
    {
      name: 'IST-Zustand',
      miete: input.currentColdRent,
      color: '#475569' // Neutral Slate 600 (Secondary/Neutral)
    },
    {
      name: 'Potenzial',
      miete: result.estimatedTotalMarketRent,
      color: '#f5931f' // Primary Orange
    },
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Aktuelle Miete</p>
          <p className="text-3xl font-bold text-slate-700 mt-2">{formatCurrency(input.currentColdRent)}</p>
          <p className="text-xs text-slate-400 mt-1">pro Monat (kalt)</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#f5931f]/20 ring-2 ring-[#f5931f]/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <TrendingUp size={64} className="text-[#f5931f]" />
          </div>
          <p className="text-sm text-[#f5931f] font-bold uppercase tracking-wider">Marktpotenzial</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(result.estimatedTotalMarketRent)}</p>
          <p className="text-xs text-slate-400 mt-1">pro Monat (kalt, geschätzt)</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white">
          <p className="text-sm text-[#f5931f] font-medium uppercase tracking-wider">Möglicher Mehrertrag</p>
          <p className="text-3xl font-bold text-white mt-2">+{formatCurrency(result.potentialYearlyGain)}</p>
          <p className="text-xs text-slate-300 mt-1">pro Jahr</p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-[#f5931f]" size={20} />
            Detaillierte Auswertung
          </h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `€${val}`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Miete']}
                />
                <Bar dataKey="miete" radius={[6, 6, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <ReferenceLine y={result.comparableRentHigh} label="Marktspitze" stroke="#ef4444" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Text Details */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-[#f5931f]" />
                Lagebewertung
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {result.locationAnalysis}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase">Mietspiegel (Ø)</p>
                <p className="font-semibold text-slate-800">
                  {formatCurrency(result.mietspiegelMin)} - {formatCurrency(result.mietspiegelMax)} / m²
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase">Gap-Analyse</p>
                <p className={`font-semibold ${result.rentGapPercentage > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {result.rentGapPercentage > 0 ? `-${result.rentGapPercentage.toFixed(1)}% unter Potenzial` : 'Marktgerecht'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Box */}
      <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f5931f] opacity-10 rounded-full -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Realisieren Sie Ihr Potenzial</h3>
            <p className="text-slate-300 max-w-lg">
              Die Differenz zwischen IST und SOLL ist Ihr verlorener Umsatz. B&W Immobilien Management hilft Ihnen, marktgerechte Mieten durchzusetzen und Ihre Rendite zu maximieren.
            </p>
            <ul className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <li className="flex items-center gap-2 text-sm text-[#f5931f]"><CheckCircle2 size={16} /> Professionelle Verwaltung</li>
              <li className="flex items-center gap-2 text-sm text-[#f5931f]"><CheckCircle2 size={16} /> Rechtssichere Anpassung</li>
            </ul>
          </div>
          
          <a 
            href="https://bundwimmobilien.de/kontaktformular/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="whitespace-nowrap bg-[#f5931f] text-white hover:bg-[#d9821a] px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            Kontakt aufnehmen
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
      
      <p className="text-center text-xs text-slate-500 mt-8 max-w-3xl mx-auto leading-relaxed border-t border-slate-200 pt-4">
        <strong>Haftungsausschluss:</strong> Die dargestellten Ergebnisse basieren auf einer algorithmischen Schätzung (Künstliche Intelligenz) und öffentlich zugänglichen Marktdaten. Sie dienen lediglich als unverbindliche erste Orientierung und stellen keine rechtsverbindliche Wertermittlung, Rechtsberatung oder Investitionsempfehlung dar. B&W Immobilien Management übernimmt keine Haftung für die Richtigkeit, Vollständigkeit oder Aktualität der Angaben sowie für Abweichungen zwischen der Schätzung und der tatsächlich erzielbaren Marktmiete. Jede Immobilienentscheidung sollte durch eine individuelle, professionelle Beratung verifiziert werden.
      </p>
    </div>
  );
};

// Helper Icon
const MapPinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

export default AnalysisResults;
