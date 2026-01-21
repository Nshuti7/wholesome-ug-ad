export interface HeroImage {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  displayType: 'mobile' | 'desktop-top-left' | 'desktop-top-right' | 'desktop-bottom-left' | 'desktop-bottom-right';
  order: number;
  active: boolean;
  alt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroFormData {
  title: string;
  subtitle?: string;
  image?: File | string;
  displayType: 'mobile' | 'desktop-top-left' | 'desktop-top-right' | 'desktop-bottom-left' | 'desktop-bottom-right';
  order?: number;
  active?: boolean;
  alt?: string;
}


