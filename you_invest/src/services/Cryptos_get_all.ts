export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: undefined;
  last_updated: string;
}



export async function getTop10Cryptos(): Promise<CryptoData[]> {
  try {
    const response = await fetch('http://localhost:3333/cryptos/top');
    if (!response.ok) {
      throw new Error('Erro ao buscar dados da API da CoinGecko');
    }
    const data: CryptoData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar criptos:', error);
    return [];
  }
}

export interface ChartData {
  time: string;
  price: number;
}

export async function getPricesChart(): Promise<ChartData[]> {
  try {
    const response = await fetch('http://localhost:3333/cryptos/chart');
    if (!response.ok) {
      throw new Error('Erro ao buscar gráfico do Bitcoin');
    }
    const data = await response.json();
    const prices: [number, number][] = data.prices;

    // Mapear para o formato desejado, convertendo timestamp para HH:MM
    const chartData: ChartData[] = prices.map(([timestamp, price]) => {
      const date = new Date(timestamp);
      const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      return { time, price: Math.round(price) };
    });

    return chartData;
  } catch (error) {
    console.error('Erro ao buscar gráfico:', error);
    return [];
  }
}

