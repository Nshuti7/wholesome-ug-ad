import api from "@/utils/api";

export interface CompanyContact {
  primaryPhone: string;
  whatsappNumber: string;
  primaryEmail: string;
  planEmail: string;
  legalEmail: string;
  privacyEmail: string;
  officeAddress: string;
  officeHours: string;
  responseTime: string;
}

export interface CompanySocial {
  instagram: string;
  x: string;
  facebook: string;
  linkedin: string;
  tripadvisor: string;
  tiktok: string;
}

export interface CompanyMeta {
  legalName: string;
  foundedYear: string;
  tagline: string;
}

export interface Almanac {
  permitAvailability: string;
  permitStatus: string;
  nextDeparture: string;
  nextDepartureStatus: string;
  guideOnCall: string;
  seasonStatus: string;
  roadsStatus: string;
  waitingListStatus: string;
}

export interface Company {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  contact: CompanyContact;
  social: CompanySocial;
  meta: CompanyMeta;
  almanac: Almanac;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyUpdate {
  name?: string;
  description?: string;
  isActive?: boolean;
  contact?: Partial<CompanyContact>;
  social?: Partial<CompanySocial>;
  meta?: Partial<CompanyMeta>;
  almanac?: Partial<Almanac>;
}

export const getCompany = () => api.get<{ success: boolean; data: Company }>("/company");

export const updateCompany = (payload: CompanyUpdate) =>
  api.put<{ success: boolean; message: string; data: Company }>("/company", payload);
