
import { GoogleGenAI, Type } from "@google/genai";
import { Product, CustomerDebt, AIInsight } from "../types";

export class AIService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // No Vite com a config acima, process.env.API_KEY será injetado
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("Gemini API Key não configurada. Os insights automáticos estarão desativados.");
    }
  }

  async generateBusinessInsights(products: Product[], customers: CustomerDebt[]): Promise<AIInsight[]> {
    if (!this.ai) {
      return [{
        type: 'FINANCEIRO',
        message: 'Aguardando configuração da API para gerar insights inteligentes.',
        priority: 'MEDIA'
      }];
    }

    try {
      const debtContext = customers
        .filter(c => c.balance > 0)
        .map(c => `${c.name}: R$ ${c.balance.toFixed(2)}`)
        .join(', ');

      const prompt = `Analise: ${products.length} produtos em estoque. Devedores: ${debtContext}. Gere 3 insights de negócio curtos em JSON com campos: type (REPOR, TENDENCIA, FINANCEIRO, CONSELHO), message, priority (ALTA, MEDIA, BAIXA).`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                message: { type: Type.STRING },
                priority: { type: Type.STRING }
              },
              required: ["type", "message", "priority"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Erro ao buscar insights:", error);
      return [];
    }
  }

  generateReceiptText(customer: CustomerDebt, items: {name: string, price: number}[]): string {
    const date = new Date().toLocaleDateString('pt-BR');
    const balance = customer.balance.toFixed(2);
    
    return `*MERCADINHO DAVI* 🛒\n\nOlá ${customer.name}!\nSeu saldo atualizado em ${date} é de *R$ ${balance}*.\n\nQualquer dúvida, estamos à disposição!`;
  }
}
