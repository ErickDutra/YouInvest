export interface Acoes {
  code: string;
  type: string;
  market: string;
}

export interface BuyRequest {
  acoes: Acoes;
  userId: string;
  quantity: number;
}

export async function buyAsset(request: BuyRequest): Promise<void> {
  const response = await fetch('http://localhost:8082/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Erro ao comprar ativo');
  }
}

export async function sellAsset(request: BuyRequest): Promise<void> {
  const response = await fetch('http://localhost:8082/sell', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Erro ao vender ativo');
  }
}