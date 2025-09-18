import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../styles/Crypto.css";

interface CardData {
  title: string;
  value: string;
  variation: string;
  variationType: string;
}

interface TopMove {
  nome: string;
  variacao: string;
}

interface CryptoData {
  nome: string;
  simbolo: string;
  preco: string;
  variacao24h: string;
  marketCap: string;
  volume24h: string;
}

const cardsLinha1: CardData[] = [
  { title: "Market Cap Total", value: "$2.5T", variation: "+1.20%", variationType: "positivo" },
  { title: "Volume 24h", value: "$150B", variation: "+0.85%", variationType: "positivo" },
  { title: "BTC Dominance", value: "55%", variation: "-0.50%", variationType: "negativo" },
  { title: "Fear & Greed", value: "Greed", variation: "", variationType: "" }
];

const topMoves: TopMove[] = [
  { nome: "Ethereum", variacao: "+5.2%" },
  { nome: "Binance Coin", variacao: "+3.8%" },
  { nome: "Cardano", variacao: "-2.1%" },
  { nome: "Solana", variacao: "+7.5%" }
];

const bitcoinData = [
  { time: '00:00', price: 59000 },
  { time: '04:00', price: 59500 },
  { time: '08:00', price: 60000 },
  { time: '12:00', price: 59800 },
  { time: '16:00', price: 60200 },
  { time: '20:00', price: 60000 },
  { time: '24:00', price: 60500 }
];

const cryptoData: CryptoData[] = [
  {
    nome: "Bitcoin",
    simbolo: "BTC",
    preco: "$60,000",
    variacao24h: "+2.45%",
    marketCap: "$1.2T",
    volume24h: "$30B"
  },
  {
    nome: "Ethereum",
    simbolo: "ETH",
    preco: "$4,200",
    variacao24h: "+5.20%",
    marketCap: "$500B",
    volume24h: "$20B"
  },
  {
    nome: "Binance Coin",
    simbolo: "BNB",
    preco: "$550",
    variacao24h: "+3.80%",
    marketCap: "$80B",
    volume24h: "$5B"
  }
  // ...adicione mais criptos conforme necessário
];

const Crypto: React.FC = () => {
  const [filtro, setFiltro] = useState("");

  const cryptoFiltradas = useMemo(() =>
    cryptoData.filter(
      crypto =>
        crypto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        crypto.simbolo.toLowerCase().includes(filtro.toLowerCase())
    ), [filtro]
  );

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
              <LineChart data={bitcoinData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="crypto-top-moves">
            <h3>Top Moves</h3>
            <ul>
              {topMoves.map((move) => (
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
              <tr key={crypto.simbolo}>
                <td>{crypto.nome}</td>
                <td>{crypto.simbolo}</td>
                <td>{crypto.preco}</td>
                <td className={crypto.variacao24h.startsWith('+') ? 'positivo' : 'negativo'}>{crypto.variacao24h}</td>
                <td>{crypto.marketCap}</td>
                <td>{crypto.volume24h}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Crypto;