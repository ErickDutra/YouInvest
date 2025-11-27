export type PortfolioItem = {
  code: string;
  price: number;
  quantity: number;
  type: string;
}

const BASE_URL = 'http://localhost:8082/wallet/portfolio';

export async function getPortfolio(id: string): Promise<PortfolioItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return data as PortfolioItem[];
    } else {
      console.error('Erro na resposta:', response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar portfolio:', error);
    return [];
  }
}

export default getPortfolio;