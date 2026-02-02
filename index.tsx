import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
    Camera, Upload, Palette, CheckCircle, ChevronRight, 
    Phone, Mail, Globe, FileText, Loader2, ArrowLeft, 
    Settings2, Info 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- KONSTANSOK ÉS TÍPUSOK ---
enum RoofMaterialType {
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

const TILE_MODELS: Record<string, { name: string; image: string }[]> = {
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

// --- LOGÓ KOMPONENS ---
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

// --- AI SZOLGÁLTATÁS ---
async function visualizeRoof(base64Image: string, material: string, model: string, color: string, gutterColor: string) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const prompt = `Modernize this house roof. 
        1. Replace the existing roof material with exactly ${material} tiles, specifically reproducing the geometry and pattern of the "${model}" model style.
        2. Apply ${color} color to the tiles with a strict MATT finish (no gloss, no reflections).
        3. Change all rain gutters and downspouts to have a matching ${gutterColor} color.
        Ensure the building architecture, walls, and surroundings remain exactly the same. The visualization must be professional, photorealistic, and architectural quality. The new roof and gutters must fit perfectly onto the existing structure with zero distortion.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
                    { text: prompt },
                ],
            },
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("AI Error:", error);
        return null;
    }
}

// --- FŐ ALKALMAZÁS ---
const App = () => {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        material: RoofMaterialType.TONDACH,
        model: 'Twist',
        color: 'Antracit',
        gutterColor: 'Horganyzott',
        originalImage: '',
        visualizedImage: ''
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
        const result = await visualizeRoof(config.originalImage, config.material, config.model, config.color, config.gutterColor);
        if (result) {
            setConfig(prev => ({ ...prev, visualizedImage: result }));
            setStep(2);
        } else {
            alert("Hiba történt a generálás során. Kérjük próbálja újra!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-24 selection:bg-blue-100">
            {/* Indikátor */}
            <div className="flex justify-between px-8 py-5 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-blue-600' : 'bg-slate-100'}`} />
                ))}
            </div>

            {/* Header */}
            <header className="px-8 pt-8 pb-4 flex items-center justify-between">
                <div className="space-y-0.5">
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        {COMPANY_INFO.name}<br/>
                        <span className="text-blue-600 font-black text-sm uppercase tracking-wider">{COMPANY_INFO.appName}</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{COMPANY_INFO.subName}</p>
                </div>
                <div className="w-14 h-14 p-1 rounded-2xl bg-white flex items-center justify-center shadow-xl border border-slate-50">
                    <Logo className="w-10 h-10 text-slate-900" />
                </div>
            </header>

            <main className="px-8 py-4 max-w-lg mx-auto">
                {loading && (
                    <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                        <Loader2 className="w-24 h-24 text-blue-600 animate-spin mb-10" />
                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Látványterv készítése...</h2>
                        <p className="text-slate-500 leading-relaxed font-medium">A MA-FA General Kft. mérnöki pontossággal illeszti az új héjazatot az Ön házára.</p>
                    </div>
                )}

                {/* STEP 0: START */}
                {step === 0 && (
                    <div className="space-y-8 animate-slide-up">
                        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100">
                                    <Camera className="text-slate-900 w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Vizionálja új tetőjét</h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">Készítsen fotót, és mi megmutatjuk a jövőt.</p>
                                </div>
                                <div className="w-full space-y-3">
                                    <label className="block w-full">
                                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                                        <div className="bg-blue-600 text-white font-bold py-5 px-8 rounded-2xl cursor-pointer flex items-center justify-center gap-3">
                                            <Camera className="w-5 h-5" /> Fotó készítése
                                        </div>
                                    </label>
                                    <label className="block w-full">
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        <div className="bg-slate-50 text-slate-900 font-bold py-5 px-8 rounded-2xl cursor-pointer flex items-center justify-center gap-3 border border-slate-100">
                                            <Upload className="w-5 h-5 text-slate-400" /> Kép kiválasztása
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 1: CONFIG */}
                {step === 1 && (
                    <div className="space-y-8 animate-fade-in pb-24">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900">Konfiguráció</h2>
                            <button onClick={() => setStep(0)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100"><ArrowLeft className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Márka</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.values(RoofMaterialType).map((type) => (
                                    <button key={type} onClick={() => setConfig(prev => ({ ...prev, material: type }))}
                                        className={`py-3 px-2 rounded-xl text-[10px] font-black border-2 transition-all ${config.material === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-100'}`}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Típus / Modell</label>
                            <div className="grid grid-cols-2 gap-3 pb-4">
                                {TILE_MODELS[config.material].map((model) => (
                                    <button key={model.name} onClick={() => setConfig(prev => ({ ...prev, model: model.name }))}
                                        className={`relative h-36 rounded-2xl border-2 overflow-hidden transition-all ${config.model === model.name ? 'border-blue-600' : 'border-slate-100'}`}>
                                        <img src={model.image} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <span className="absolute bottom-3 left-3 text-white font-black text-[11px]">{model.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-xl border-t border-slate-100 z-40">
                            <button onClick={startVisualization} className="w-full max-w-lg mx-auto bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3">
                                <Palette className="w-6 h-6" /> Látványterv megtekintése
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: RESULT */}
                {step === 2 && (
                    <div className="space-y-8 animate-fade-in pb-24">
                        <h2 className="text-2xl font-black text-slate-900">Az Ön új tetője</h2>
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/3] bg-slate-100">
                           {config.visualizedImage && <img src={config.visualizedImage} className="w-full h-full object-cover" />}
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-xl border-t border-slate-100 z-40 flex gap-4 max-w-lg mx-auto">
                            <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-2xl">Változtatás</button>
                            <button onClick={() => setStep(3)} className="flex-[2] bg-blue-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3">Hogyan tovább? <ChevronRight className="w-6 h-6" /></button>
                        </div>
                    </div>
                )}

                {/* STEP 3: TECHNICAL */}
                {step === 3 && (
                    <div className="space-y-8 animate-fade-in pb-24">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">Műszaki előkészületek</h2>
                        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                            <div className="space-y-8">
                                <FileText className="w-12 h-12 text-blue-500" />
                                <h3 className="text-3xl font-black leading-tight">Kérjük, készítse elő a ház tervrajzait!</h3>
                                <p className="text-slate-300 font-medium">A precíz árajánlathoz szükségünk lesz a méretekre. Tartsa kéznél őket a híváskor.</p>
                            </div>
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-xl z-40 max-w-lg mx-auto">
                            <button onClick={() => setStep(4)} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3">Kapcsolatfelvétel <ChevronRight className="w-6 h-6" /></button>
                        </div>
                    </div>
                )}

                {/* STEP 4: CONTACT */}
                {step === 4 && (
                    <div className="space-y-10 animate-fade-in text-center">
                        <h2 className="text-3xl font-black text-slate-900">Kapcsolatfelvétel</h2>
                        <div className="grid gap-4">
                            <a href={`tel:${COMPANY_INFO.phone}`} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center gap-6 group hover:border-blue-200 transition-all">
                                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center"><Phone className="w-7 h-7 text-white" /></div>
                                <div className="text-left"><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Hívjon minket</p><p className="text-xl font-black text-slate-900">{COMPANY_INFO.phoneDisplay}</p></div>
                            </a>
                            <a href={`mailto:${COMPANY_INFO.email}`} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center gap-6 group hover:border-blue-200 transition-all">
                                <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center"><Mail className="w-7 h-7 text-white" /></div>
                                <div className="text-left min-w-0"><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">E-mail küldés</p><p className="text-lg font-black text-slate-900 truncate">{COMPANY_INFO.email}</p></div>
                            </a>
                        </div>
                        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-blue-600 font-black flex items-center gap-3 mx-auto py-4 uppercase tracking-[0.2em] text-xs"><ArrowLeft className="w-5 h-5" /> Új tervezés</button>
                    </div>
                )}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);