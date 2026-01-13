
import { GoogleGenAI, Type } from "@google/genai";
import { Product, CustomerDebt, AIInsight } from "../types";

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateBusinessInsights(products: Product[], customers: CustomerDebt[]): Promise<AIInsight[]> {
    try {
      const debtContext = customers
        .filter(c => c.balance > 0)
        .map(c => `${c.name}: R$ ${c.balance} (Histórico: ${c.history.length} compras)`)
        .join(', ');

      const prompt = `
        Aja como um analista financeiro de pequenas mercearias. Seu foco é GESTÃO DE DÍVIDAS E COBRANÇA.
        Analise o contexto dos clientes que devem (Fiado): ${debtContext}

        Forneça 4 insights estratégicos focando em:
        1. Clientes com dívidas muito altas que precisam de um lembrete.
        2. Um conselho sobre como abordar os clientes para receber sem perdê-los.
        3. Um insight sobre o fluxo de caixa baseado no que tem a receber.
        4. Identifique se algum cliente está comprando muito no fiado sem pagar.

        RESPONDA EM PORTUGUÊS.
        Retorne os dados estritamente como um array JSON de objetos com as chaves: 
        type (FINANCEIRO, CONSELHO, TENDENCIA, REPOR), message (string), priority (ALTA, MEDIA, BAIXA), impact (string).
      `;

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
                priority: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["type", "message", "priority"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Erro no Insight AI:", error);
      return [{
        type: 'FINANCEIRO',
        message: 'O orquestrador está descansando. Foque nos recebíveis de maior valor hoje!',
        priority: 'MEDIA'
      }];
    }
  }

  generateReceiptText(customer: CustomerDebt, items: {name: string, price: number}[]): string {
    const date = new Date().toLocaleDateString('pt-BR');
    const totalPurchase = items.reduce((acc, item) => acc + item.price, 0);
    
    // Se for apenas lembrete de saldo
    if (items.length === 0) {
      return `Olá, *${customer.name}*! 👋\n\nPassando para atualizar seu extrato aqui na Mercearia.\n\nSeu saldo devedor atual é de *R$ ${customer.balance.toFixed(2)}*.\n\nQualquer dúvida, estamos à disposição! Boas compras. 🛒`;
    }
    
    const itemLines = items.map(i => `- ${i.name}: R$ ${i.price.toFixed(2)}`).join('\n');
    
    return `*Recibo de Compra - Mercearia* 🛒\n\nCliente: *${customer.name}*\nData: ${date}\n\n*Itens:* \n${itemLines}\n\n*Valor desta compra: R$ ${totalPurchase.toFixed(2)}*\n\n--- \n*Saldo Total Acumulado: R$ ${customer.balance.toFixed(2)}*\n\nObrigado pela preferência! 😊`;
  }
}
