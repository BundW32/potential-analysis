export enum PropertyType {
  APARTMENT = 'Wohnung',
  HOUSE = 'Haus',
  COMMERCIAL = 'Gewerbe'
}

export enum Condition {
  NEW = 'Neubau / Erstbezug',
  MINT = 'Neuwertig',
  MODERNIZED = 'Modernisiert',
  WELL_KEPT = 'Gepflegt',
  NEEDS_RENOVATION = 'Renovierungsbedürftig'
}

export interface UserInput {
  address: string;
  propertyType: PropertyType;
  sizeSqm: number;
  rooms: number;
  yearBuilt: number;
  condition: Condition;
  currentColdRent: number;
}

export interface AnalysisResult {
  estimatedMarketRentPerSqm: number;
  estimatedTotalMarketRent: number;
  mietspiegelMin: number;
  mietspiegelMax: number;
  locationAnalysis: string;
  potentialYearlyGain: number;
  rentGapPercentage: number;
  comparableRentHigh: number;
  comparableRentLow: number;
}
