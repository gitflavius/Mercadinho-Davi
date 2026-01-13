
import { Product, CustomerDebt } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Arroz Tipo 1', 
    category: 'Grãos e Cereais', 
    description: 'Arroz branco de qualidade, pacote de 5kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    price: 22.90, 
    costPrice: 15.00, 
    stock: 45, 
    unit: '5kg', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Feijão Carioca', 
    category: 'Grãos e Cereais', 
    description: 'Feijão carioca selecionado, pacote de 1kg',
    image: 'https://images.unsplash.com/photo-1551462147-37885acc3c41?auto=format&fit=crop&w=400&q=80',
    price: 8.50, 
    costPrice: 5.20, 
    stock: 60, 
    unit: '1kg', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '3', 
    name: 'Óleo de Soja', 
    category: 'Óleos e Temperos', 
    description: 'Óleo de soja refinado 900ml',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    price: 6.90, 
    costPrice: 4.80, 
    stock: 30, 
    unit: '900ml', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '4', 
    name: 'Açúcar Cristal', 
    category: 'Açúcar e Sal', 
    description: 'Açúcar cristal refinado 1kg',
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=400&q=80',
    price: 4.20, 
    costPrice: 2.90, 
    stock: 50, 
    unit: '1kg', 
    lastUpdated: new Date().toISOString() 
  },
  { 
    id: '5', 
    name: 'Leite Integral', 
    category: 'Laticínios', 
    description: 'Leite UHT integral 1L',
    image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&w=400&q=80',
    price: 5.50, 
    costPrice: 3.80, 
    stock: 24, 
    unit: '1L', 
    lastUpdated: new Date().toISOString() 
  },
];

export const INITIAL_CUSTOMERS: CustomerDebt[] = [
  { id: 'c1', name: 'João Silva', phone: '+5511999998888', balance: 45.50, history: [] },
  { id: 'c2', name: 'Maria Oliveira', phone: '+5511888887777', balance: 12.00, history: [] },
  { id: 'c3', name: 'Ricardo Santos', phone: '+5511777776666', balance: 0.00, history: [] },
];

export const CATEGORIES = ['Todos', 'Grãos e Cereais', 'Óleos e Temperos', 'Açúcar e Sal', 'Bebidas', 'Massas', 'Laticínios'];
