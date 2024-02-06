export interface Moeda {
  code: string;
  codeIn: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export type MoedasData = Moeda[];
