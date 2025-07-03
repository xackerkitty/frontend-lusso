import React, { createContext, useContext, ReactNode } from 'react';

// Veri tipleri tanu0131mlaru0131
export interface PlayerType {
  id: number;
  name: string;
  position: string;
  image?: string;
}

export interface EventType {
  id: number;
  day: string;
  month: string;
  title: string;
  location: string;
}

export interface NewsType {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
  category?: string;
  views?: number;
  readTime?: string;
}

export interface TeamSectionType {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface NavLinkType {
  title: string;
  path: string;
}

// Context veri yapu0131su0131
interface WfcNikeLussoContextType {
  players: PlayerType[];
  events: EventType[];
  news: NewsType[];
  teamSections: TeamSectionType[];
  playerLinks: NavLinkType[];
  isScrolled: boolean;
}

// Varsayu0131lan deu011ferler
const defaultContext: WfcNikeLussoContextType = {
  players: [],
  events: [],
  news: [],
  teamSections: [],
  playerLinks: [],
  isScrolled: false
};

// Context oluu015fturma
const WfcNikeLussoContext = createContext<WfcNikeLussoContextType>(defaultContext);

// Context Provider bileu015feni
interface WfcNikeLussoProviderProps {
  children: ReactNode;
  value: WfcNikeLussoContextType;
}

export const WfcNikeLussoProvider: React.FC<WfcNikeLussoProviderProps> = ({ children, value }) => {
  return (
    <WfcNikeLussoContext.Provider value={value}>
      {children}
    </WfcNikeLussoContext.Provider>
  );
};

// Kullanu0131m kolaylu0131u011fu0131 iu00e7in hook
export const useWfcNikeLusso = () => useContext(WfcNikeLussoContext);
