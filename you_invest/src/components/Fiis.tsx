import React, { useState, useMemo } from "react";
import "../styles/Fiis.css";

interface CardData {
  title: string;
  value: string;
  variation: string;
  variationType: string;
}

interface FiiData {
  nome: string;
  preco: string;
  divYeld: string;
  pvp: string;
  liquidez: string;
  segmento: string;
  patrimonio: string;
}

const cards: CardData[] = [
  { title: "IFIX", value: "3.250", variation: "+0.85%", variationType: "positivo" },
  { title: "Div. Yield Médio", value: "0,85%", variation: "", variationType: "" },
  { title: "Patrimônio Total", value: "R$ 200 Bi", variation: "", variationType: "" }
];

const fiisData: FiiData[] = [
  {
    nome: "HGLG11",
    preco: "R$ 180,00",
    divYeld: "0,75%",
    pvp: "0,98",
    liquidez: "R$ 5,2 Mi",
    segmento: "Logístico",
    patrimonio: "R$ 2,5 Bi"
  },
  {
    nome: "MXRF11",
    preco: "R$ 10,50",
    divYeld: "1,05%",
    pvp: "1,02",
    liquidez: "R$ 20,1 Mi",
    segmento: "Recebíveis",
    patrimonio: "R$ 3,2 Bi"
  },
  {
    nome: "VISC11",
    preco: "R$ 110,00",
    divYeld: "0,65%",
    pvp: "0,95",
    liquidez: "R$ 3,8 Mi",
    segmento: "Shoppings",
    patrimonio: "R$ 1,8 Bi"
  }
  // ...adicione mais FIIs conforme necessário
];

const Fiis: React.FC = () => {
  const [filtro, setFiltro] = useState("");

  const fiisFiltrados = useMemo(() =>
    fiisData.filter(
      fii =>
        fii.nome.toLowerCase().includes(filtro.toLowerCase())
    ), [filtro]
  );

  return (
    <div className="fiis-page">
      <div className="fiis-cards-grid">
        {cards.map((card) => (
          <div className="fiis-card" key={card.title}>
            <span className="fiis-card-title">{card.title}</span>
            <span className="fiis-card-value">{card.value}</span>
            {card.variation && (
              <span className={`fiis-card-variation ${card.variationType}`}>{card.variation}</span>
            )}
          </div>
        ))}
      </div>

      <div className="fiis-table-section">
        <input
          type="text"
          placeholder="Filtrar por FII..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="fiis-filtro"
          aria-label="Filtrar FIIs por nome"
        />
        <table className="fiis-table">
          <thead>
            <tr>
              <th>FII</th>
              <th>Preço</th>
              <th>Div. Yield</th>
              <th>P/VP</th>
              <th>Liquidez</th>
              <th>Segmento</th>
              <th>Patrimônio</th>
            </tr>
          </thead>
          <tbody>
            {fiisFiltrados.map((fii) => (
              <tr key={fii.nome}>
                <td>{fii.nome}</td>
                <td>{fii.preco}</td>
                <td>{fii.divYeld}</td>
                <td>{fii.pvp}</td>
                <td>{fii.liquidez}</td>
                <td>{fii.segmento}</td>
                <td>{fii.patrimonio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fiis;