import React, { useState, useRef, useEffect } from 'react';
// FIX: Removed '/components/' because files are in the root
import InputForm from './InputForm';
import AnalysisResults from './AnalysisResults';
import { UserInput, AnalysisResult } from './types';
// FIX: Removed '/services/' because the file is in the root
import { analyzePotential } from './geminiService';
import { LineChart } from 'lucide-react';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  // WordPress Integration: Send height to parent window to avoid scrollbars
  useEffect(() => {
    const sendHeight = () => {
      if (appRef.current) {
        const height = appRef.current.scrollHeight;
        window.parent.postMessage({ type: 'setHeight', height }, '*');
      }
    };

    // Send height on load, resize, and when content changes (like showing results)
    sendHeight();
    window.addEventListener('resize', sendHeight);
    
    const observer = new ResizeObserver(sendHeight);
    if (appRef.current) {
      observer.observe(appRef.current);
    }

    return () => {
      window.removeEventListener('resize', sendHeight);
      observer.disconnect();
    };
  }, [result, userInput]); // Re-run when results appear

  const handleAnalysis = async (data: UserInput) => {
    setIsLoading(true);
    setUserInput(data);
    setResult(null); // Reset previous result

    try {
      const analysis = await analyzePotential(data);
      setResult(analysis);
      
      // Smooth scroll to results after a short delay to ensure render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error) {
      alert("Es gab ein Problem bei der Analyse. Bitte prüfen Sie Ihre Eingaben oder versuchen Sie es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={appRef} className="w-full bg-slate-50 text-slate-900 font-sans min-h-screen overflow-hidden">
      {/* Hero Section with Real Estate Background */}
      <div className="relative bg-slate-900 pt-20 pb-32 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
            alt="Real Estate Background" 
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/95"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Logo Implementation - Adjusted Scale */}
          <div className="mb-8 h-24 md:h-28 w-auto aspect-[1.2/1] relative">
             <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                {/* Center Building */}
                <path d="M45 15 L75 5 L75 95 H45 V15 Z" fill="#f5931f" />
                <path d="M45 25 L75 15" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 40 L75 30" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 55 L75 45" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 70 L75 60" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 85 L75 75" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                
                {/* Left Building */}
                <path d="M15 35 L40 30 V95 H15 V35 Z" fill="#f5931f" />
                <path d="M22 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M33 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />

                {/* Right Building */}
                <path d="M80 30 L105 35 V95 H80 V30 Z" fill="#f5931f" />
                <path d="M88 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M97 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                
                {/* Base Line */}
                <rect x="10" y="95" width="100" height="5" fill="#f5931f" />
             </svg>
             <div className="flex flex-col items-center mt-2 w-full">
                <span className="text-2xl font-serif font-bold text-white leading-none tracking-tight">B & W</span>
                <span className="text-[0.55rem] font-sans font-bold text-slate-300 tracking-[0.2em] uppercase mt-1">Immobilien Management</span>
             </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <LineChart className="text-[#f5931f] w-4 h-4" />
            <span className="text-white/90 text-sm font-medium">KI-gestützte Mietanalyse</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
            Verschwenden Sie kein Potenzial. <br/>
            <span className="text-[#f5931f]">
              Optimieren Sie Ihre Rendite.
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Ermitteln Sie in wenigen Sekunden das faire Marktpotenzial Ihrer Immobilie. 
            Wir vergleichen Ihre aktuellen Mieteinnahmen mit dem lokalen Mietspiegel und ähnlichen Objekten.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 pb-16 space-y-12 relative z-20">
        {/* Input Form Section */}
        <InputForm isLoading={isLoading} onSubmit={handleAnalysis} />

        {/* Results Section */}
        <div ref={resultsRef}>
          {result && userInput && (
            <AnalysisResults result={result} input={userInput} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
