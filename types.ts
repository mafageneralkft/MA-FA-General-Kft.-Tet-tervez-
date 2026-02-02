
export enum RoofMaterialType {
  CSEREPESLEMEZ = 'Cserepeslemez',
  KORCOLT_LEMEZ = 'Korcolt lemez',
  TONDACH = 'Tondach',
  BRAMAC = 'Bramac',
  TERRAN = 'Terrán'
}

export interface RoofModel {
  name: string;
  image: string;
}

export interface RoofColor {
  id: string;
  name: string;
  hex: string;
}

export interface Configuration {
  material: RoofMaterialType;
  model: string;
  color: string;
  gutterColor: string;
  originalImage?: string;
  visualizedImage?: string;
  technicalDocs: File[];
  structuralPhotos: File[];
}

export interface UserContact {
  name: string;
  phone: string;
  email: string;
}
