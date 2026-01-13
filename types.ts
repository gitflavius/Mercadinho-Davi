
export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  image?: string;
  price: number;
  costPrice: number;
  stock: number;
  unit: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  customerId?: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  type: 'VISTA' | 'FIADO';
  status: 'PAGO' | 'PENDENTE';
  timestamp: string;
}

export interface CustomerDebt {
  id: string;
  name: string;
  phone: string;
  balance: number;
  history: Transaction[];
}

export interface AIInsight {
  type: 'REPOR' | 'TENDENCIA' | 'FINANCEIRO' | 'CONSELHO';
  message: string;
  priority: 'ALTA' | 'MEDIA' | 'BAIXA';
  impact?: string;
}

export enum AppSection {
  PAINEL = 'PAINEL',
  CATALOGO = 'CATALOGO',
  ESTOQUE = 'ESTOQUE',
  DIVIDAS = 'DIVIDAS',
  INSIGHTS = 'INSIGHTS',
  CONFIGURACOES = 'CONFIGURACOES'
}
