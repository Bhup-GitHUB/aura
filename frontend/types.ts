export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface PropertyFeature {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  label: string;
  alignment: 'left' | 'right';
}

export interface Statistic {
  value: string;
  label: string;
}

export interface ClientLogo {
  name: string;
  url: string;
}

export type Page = 'home' | 'login' | 'signup';

export interface NavigationProps {
  onNavigate: (page: Page) => void;
}