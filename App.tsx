import React, { useState, useEffect } from 'react';
import { 
  Camera, Upload, Palette, CheckCircle, ChevronRight, 
  Phone, Mail, Globe, FileText, Loader2, ArrowLeft, 
  Settings2, Info 
} from 'lucide-react';
import { visualizeRoof } from './services/geminiService';

// --- TYPES & CONSTANTS ---
export enum RoofMaterialType {
  CSEREPESLEMEZ = 'Cserepeslemez',
  KORCOLT_LEMEZ = 'Korcolt lemez',
  TONDACH = 'Tondach',
  BRAMAC = 'Bramac',
  TERRAN = 'Terrán'
}

const COLORS = [
  { id: 'antracit', name: 'Antracit', hex: '#374151' },
  { id: 'teglavoros', name: 'Téglavörös', hex: '#991b1b' },
  { id: 'barna', name: 'Barna', hex: '#451a03' },
];

const GUTTER_COLORS = [
  { name: 'Horganyzott', hex: '#a1a1aa' },
  { name: 'Antracit', hex: '#374151' },
  { name: 'Hófehér', hex: '#f8fafc' },
  { name: 'Sötétbarna', hex: '#2d1a0a' },
  { name: 'Grafit', hex: '#1e293b' },
  { name: 'Téglavörös', hex: '#991b1b' },
];

const TILE_MODELS = {
  [RoofMaterialType.TONDACH]: [
    { name: 'Twist', image: 'https://images.unsplash.com/photo-1632759162351-140c7e4353c2?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Bolero', image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Rumba', image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'V11', image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=400&auto=format&fit=crop' }, 
  ],
  [RoofMaterialType.BRAMAC]: [
    { name: 'Római', image: 'https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Reviva', image: 'https://images.unsplash.com/photo-1505764761634-1d77b57e1966?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Tectura', image: 'https://images.unsplash.com/photo-1498550744921-75f79806b8a7?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Classic', image: 'https://images.unsplash.com/photo-1449156001533-cb39c731426c?q=80&w=400&auto=format&fit=crop' }, 
  ],
  [RoofMaterialType.TERRAN]: [
    { name: 'Synus', image: 'https://images.unsplash.com/photo-1621814151323-9366e44b9338?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Danubia', image: 'https://images.unsplash.com/photo-1632759162351-140c7e4353c2?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Zenit', image: 'https://images.unsplash.com/photo-1615873968403-89e068628265?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Generon', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=400&auto=format&fit=crop' }, 
  ],
  [RoofMaterialType.CSEREPESLEMEZ]: [
    { name: 'Standard', image: 'https://images.unsplash.com/photo-1628744276229-c83470af10c9?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Hódfarkú', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Modern', image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=400&auto=format&fit=crop' }, 
  ],
  [RoofMaterialType.KORCOLT_LEMEZ]: [
    { name: 'Klikkes', image: 'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?q=80&w=400&auto=format&fit=crop' }, 
    { name: 'Hagyományos', image: 'https://images.unsplash.com/photo-1541824232263-d28f009594a2?q=80&w=400&auto=format&fit=crop' }, 
  ],
};

const COMPANY_INFO = {
  name: 'MA-FA General Kft.',
  appName: 'Tető látványterv készítő',
  subName: 'by Machek',
  phone: '06303725479',
  phoneDisplay: '+36 30 372 5479',
  email: 'architecturebymachek@gmail.com',
  web: 'www.mafageneral.hu'
};

// --- HELPER COMPONENTS ---
const Logo = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 250 L200 100 L350 250 L350 220 L200 70 L50 220 Z" fill="currentColor"/>
    <rect x="280" y="110" width="40" height="80" fill="currentColor"/>
    <circle cx="200" cy="180" r="25" fill="none" stroke="currentColor" strokeWidth="8"/>
    <line x1="175" y1="180" x2="225" y2="180" stroke="currentColor" strokeWidth="4"/>
    <line x1="200" y1="155" x2="200" y2="205" stroke="currentColor" strokeWidth="4"/>
    <text x="200" y="340" fontFamily="Serif, ui-serif" fontSize="95" fontWeight="900" textAnchor="middle" fill="currentColor">MA-FA</text>
    <line x1="40" y1="380" x2="110" y2="380" stroke="currentColor" strokeWidth="2"/>
    <text x="200" y="392" fontFamily="ui-sans-serif, sans-serif" fontSize="26" fontWeight="800" textAnchor="middle" fill="currentColor" letterSpacing="4">GENERAL KFT.</text>
    <line x1="290" y1="380" x2="360" y2="380" stroke="currentColor" strokeWidth="2"/>
    <text x="200" y="440" fontFamily="ui-sans-serif, sans-serif" fontSize="34" fontWeight="700" textAnchor="middle" fill="currentColor" letterSpacing="8">BY MACHEK</text>
  </svg>
);

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<{
    material: RoofMaterialType;
    model: string;
    color: string;
    gutterColor: string;
    originalImage?: string;
    visualizedImage?: string;
  }>({
    material: RoofMaterialType.TONDACH,
    model: 'Twist',
    color: 'Antracit',
    gutterColor: 'Horganyzott',
  });

  useEffect(() => {
    const models = TILE_MODELS[config.material];
    if (models && !models.some(m => m.name === config.model)) {
      setConfig(prev => ({ ...prev, model: models[0].name }));
    }
  }, [config.material]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, originalImage: reader.result as string }));
        setStep(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVisualization = async () => {
    if (!config.originalImage) return;
    setLoading(true);
    const result = await visualizeRoof(
      config.originalImage, 
      config.material, 
      config.model,
      config.color, 
      config.gutterColor
    );
    if (result) {
      setConfig(prev => ({ ...prev, visualizedImage: result }));
      setStep(2);
    } else {
      alert("Hiba történt a generálás során. Kérjük próbálja újra!");
    }
    setLoading(false);
  };

  const StepIndicator = () => (
    <div className="flex justify-between px-8 py-5 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      {[0, 1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-700 ease-out ${step >= i ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-100'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-24 selection:bg-blue-100">
      <StepIndicator />

      <header className="px-8 pt-8 pb-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {COMPANY_INFO.name}<br/>
            <span className="text-blue-600 font-black text-sm uppercase tracking-wider">{COMPANY_INFO.appName}</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{COMPANY_INFO.subName}</p>
        </div>
        <div className="w-14 h-14 p-1 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-slate-100 border border-slate-50 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
          <Logo className="w-10 h-10 text-slate-900" />
        </div>
      </header>

      <main className="px-8 py-4 max-w-lg mx-auto">
        {loading && (
          <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-12 text-center animate-fade-in">
            <div className="relative mb-10 flex items-center justify-center">
               <div className="absolute w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
               <Loader2 className="w-24 h-24 text-blue-600 animate-spin relative z-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">A MA-FA General Kft. dolgozik a látványterven</h2>
            <p className="text-slate-500 max-w-xs leading-relaxed font-medium text-lg">Pontosan illesztjük a választott {config.material} {config.model} héjazatot az Ön épületére, MATT kivitelben...</p>
          </div>
        )}

        {/* STEP 0: START */}
        {step === 0 && (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-white p-8 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-50 group">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center transition-transform group-hover:scale-105 duration-500 border border-slate-100 shadow-inner">
                  <Camera className="text-slate-900 w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Vizionálja új tetőjét</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">Készítsen egy fotót a házáról, és mi megmutatjuk a jövőt.</p>
                </div>
                
                <div className="w-full space-y-3">
                  <label className="block w-full">
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                    <div className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl shadow-blue-100 cursor-pointer flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                      <Camera className="w-5 h-5" />
                      Fotó készítése
                    </div>
                  </label>
                  <label className="block w-full">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <div className="bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold py-5 px-8 rounded-2xl cursor-pointer flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-slate-100">
                      <Upload className="w-5 h-5 text-slate-400" />
                      Kép kiválasztása
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: CONFIGURATION */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in pb-24">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">Konfiguráció</h2>
              <button onClick={() => setStep(0)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Márka kiválasztása</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(RoofMaterialType).map((type) => (
                  <button 
                    key={type}
                    onClick={() => setConfig(prev => ({ ...prev, material: type }))}
                    className={`py-3 px-2 rounded-xl text-[11px] font-black transition-all border-2 ${config.material === type ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Típus / Modell</label>
              <div className="grid grid-cols-2 gap-3 pb-4">
                {TILE_MODELS[config.material].map((model) => (
                  <button 
                    key={model.name}
                    onClick={() => setConfig(prev => ({ ...prev, model: model.name }))}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition-all h-36 flex flex-col ${config.model === model.name ? 'border-blue-600 shadow-xl scale-[1.02]' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <img src={model.image} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={model.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                    <div className="mt-auto p-3 relative z-10">
                       <span className={`text-[11px] font-black tracking-wide ${config.model === model.name ? 'text-blue-400' : 'text-white'}`}>{model.name}</span>
                    </div>
                    {config.model === model.name && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-lg z-20">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Színvilág</label>
              <div className="grid grid-cols-3 gap-3">
                {COLORS.map((c) => (
                  <button 
                    key={c.id}
                    onClick={() => setConfig(prev => ({ ...prev, color: c.name }))}
                    className={`flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all ${config.color === c.name ? 'border-blue-600 bg-white shadow-xl scale-105 z-10' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                  >
                    <div className="w-12 h-12 rounded-xl shadow-inner relative overflow-hidden" style={{ backgroundColor: c.hex }} />
                    <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-xl border-t border-slate-100 z-40">
              <button 
                onClick={startVisualization}
                className="w-full max-w-lg mx-auto bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <Palette className="w-6 h-6" />
                Látványterv megtekintése
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: RESULT */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in pb-24">
            <h2 className="text-2xl font-black text-slate-900">Az Ön új tetője</h2>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/3] bg-slate-100 group">
               {config.visualizedImage && <img src={config.visualizedImage} className="w-full h-full object-cover" alt="Látványterv" />}
            </div>
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 space-y-6">
              <h3 className="font-black text-slate-900 flex items-center gap-3">
                <Settings2 className="w-6 h-6 text-blue-600" />
                Választott paraméterek
              </h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Héjazat</p>
                  <p className="font-bold text-slate-700">{config.material} {config.model}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Szín</p>
                  <p className="font-bold text-slate-700">{config.color} (MATT)</p>
                </div>
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4 max-w-lg mx-auto">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-[1.5rem]">Változtatás</button>
              <button onClick={() => setStep(3)} className="flex-[2] bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-blue-100 flex items-center justify-center gap-3">
                Hogyan tovább?
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TECHNICAL (NO LOGO) */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in pb-24">
            <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">Műszaki előkészületek</h2>
            <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                 <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                   <FileText className="w-10 h-10 text-white" />
                 </div>
                 <div className="space-y-4">
                   <h3 className="text-3xl font-black tracking-tight leading-tight">Kérjük, készítse elő a ház tervrajzait!</h3>
                   <p className="text-slate-300 leading-relaxed font-medium text-lg">
                     A precíz és végleges árajánlathoz szükségünk lesz a tetőszerkezet méreteire és a ház hivatalos terveire. 
                   </p>
                 </div>
               </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-xl border-t border-slate-100 z-40 max-w-lg mx-auto">
              <button onClick={() => setStep(4)} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-blue-100 flex items-center justify-center gap-3">
                Kapcsolatfelvétel választása
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT */}
        {step === 4 && (
          <div className="space-y-10 animate-fade-in pb-20 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Kapcsolatfelvétel</h2>
            <div className="grid gap-4">
              <a href={`tel:${COMPANY_INFO.phone}`} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center gap-6 group hover:border-blue-200 transition-all">
                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-lg"><Phone className="w-7 h-7 text-white" /></div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Telefonáljon most</p>
                  <p className="text-xl font-black text-slate-900">{COMPANY_INFO.phoneDisplay}</p>
                </div>
              </a>
              <a href={`mailto:${COMPANY_INFO.email}`} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center gap-6 group hover:border-blue-200 transition-all">
                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-lg"><Mail className="w-7 h-7 text-white" /></div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Küldjön e-mailt</p>
                  <p className="text-lg font-black text-slate-900 truncate">{COMPANY_INFO.email}</p>
                </div>
              </a>
            </div>
            <button onClick={() => setStep(0)} className="text-slate-400 hover:text-blue-600 font-black flex items-center gap-3 mx-auto py-4 uppercase tracking-[0.2em] text-xs">
              <ArrowLeft className="w-5 h-5" />
              Új tervezés indítása
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;