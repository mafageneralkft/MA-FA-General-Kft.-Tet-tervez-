import { RoofMaterialType, RoofColor, RoofModel } from './types';

export const COLORS: RoofColor[] = [
  { id: 'antracit', name: 'Antracit', hex: '#374151' },
  { id: 'teglavoros', name: 'Téglavörös', hex: '#991b1b' },
  { id: 'barna', name: 'Barna', hex: '#451a03' },
];

export const GUTTER_COLORS = [
  { name: 'Horganyzott', hex: '#a1a1aa' },
  { name: 'Antracit', hex: '#374151' },
  { name: 'Hófehér', hex: '#f8fafc' },
  { name: 'Sötétbarna', hex: '#2d1a0a' },
  { name: 'Grafit', hex: '#1e293b' },
  { name: 'Téglavörös', hex: '#991b1b' },
];

export const TILE_MODELS: Record<string, RoofModel[]> = {
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

export const COMPANY_INFO = {
  name: 'MA-FA General Kft.',
  appName: 'Tető látványterv készítő',
  subName: 'by Machek',
  phone: '06303725479',
  phoneDisplay: '+36 30 372 5479',
  email: 'architecturebymachek@gmail.com',
  web: 'www.mafageneral.hu'
};