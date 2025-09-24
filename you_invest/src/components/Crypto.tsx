import React, { useState, useMemo, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../styles/Crypto.css";
import { getTop10Cryptos, getPricesChart } from '../services/Cryptos_get_all'
import type { CryptoData, ChartData } from '../services/Cryptos_get_all'

interface CardData {
  title: string;
  value: string;
  variation: string;
  variationType: string;
}


const cardsLinha1: CardData[] = [
  { title: "Market Cap Total", value: "$2.5T", variation: "+1.20%", variationType: "positivo" },
  { title: "Volume 24h", value: "$150B", variation: "+0.85%", variationType: "positivo" },
  { title: "BTC Dominance", value: "55%", variation: "-0.50%", variationType: "negativo" },
  { title: "Fear & Greed", value: "Greed", variation: "", variationType: "" }
];

const Crypto: React.FC = () => {
  const [filtro, setFiltro] = useState("");
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]); 
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cryptos, chart] = await Promise.all([
          getTop10Cryptos(),
          getPricesChart()
        ]);
        setCryptoData(cryptos);
        setChartData(chart);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  const cryptoFiltradas = useMemo(() =>
    cryptoData.filter(
      crypto =>
        crypto.name.toLowerCase().includes(filtro.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(filtro.toLowerCase())
    ), [filtro, cryptoData]
  );

  const topMoves = useMemo(() => 
    [...cryptoData]
      .sort((a: CryptoData, b: CryptoData) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5)
      .map((crypto: CryptoData) => ({
        nome: crypto.name,
        variacao: `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`
      })), [cryptoData]
  )

  const minPrice = useMemo(() => Math.min(...chartData.map(d => d.price)) - 2000, [chartData]);
  const maxPrice = useMemo(() => Math.max(...chartData.map(d => d.price)) + 2000, [chartData]);

  if (loading) {
    return <div>Carregando...</div>; 
  }

  return (
    <div className="crypto-page">
      <div className="crypto-grid">
        <div className="row row-1">
          {cardsLinha1.map((card) => (
            <div className="crypto-card" key={card.title}>
              <span className="crypto-card-title">{card.title}</span>
              <span className="crypto-card-value">{card.value}</span>
              {card.variation && (
                <span className={`crypto-card-variation ${card.variationType}`}>{card.variation}</span>
              )}
            </div>
          ))}
        </div>
        <div className="row row-2">
          <div className="crypto-chart">
            <h3>Gráfico Bitcoin 24h</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis 
                  domain={[minPrice, maxPrice]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Preço']}
                  labelFormatter={(label) => `Hora: ${label}`}
                />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="crypto-top-moves">
            <h3>Top Moves</h3>
            <ul>
              {topMoves.map((move: { nome: string; variacao: string }) => (
                <li key={move.nome}>
                  {move.nome}: <span className={move.variacao.startsWith('+') ? 'positivo' : 'negativo'}>{move.variacao}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="crypto-table-section">
        <input
          type="text"
          placeholder="Filtrar por cripto..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="crypto-filtro"
          aria-label="Filtrar criptomoedas por nome ou símbolo"
        />
        <table className="crypto-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Símbolo</th>
              <th>Preço</th>
              <th>Variação 24h</th>
              <th>Market Cap</th>
              <th>Volume 24h</th>
            </tr>
          </thead>
          <tbody>
            {cryptoFiltradas.map((crypto) => (
              <tr key={crypto.id}>
                <td>{crypto.name}</td>
                <td>{crypto.symbol.toUpperCase()}</td>
                <td>${crypto.current_price.toLocaleString()}</td>
                <td className={crypto.price_change_percentage_24h >= 0 ? 'positivo' : 'negativo'}>
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>${crypto.market_cap.toLocaleString()}</td>
                <td>${crypto.total_volume.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Crypto;