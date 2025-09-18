import React, { useState, useMemo } from "react";
import "../styles/Acao.css";

interface CardData {
  title: string;
  value: string;
  variation: string;
  variationType: string;
}

interface AcaoData {
  score: number;
  nome: string;
  preco: string;
  pe: string;
  pvp: string;
  roe: string;
  divYeld: string;
  margem: string;
  endiv: string;
}

const cards: CardData[] = [
  { title: "Ibovespa", value: "128.450", variation: "+2.45%", variationType: "positivo" },
  { title: "Volume Total", value: "R$ 2.500.000.000", variation: "+1.10%", variationType: "positivo" },
  { title: "Ações em Alta", value: "37", variation: "", variationType: "" },
  { title: "Ações em Baixa", value: "13", variation: "", variationType: "" }
];

const acoesData: AcaoData[] = [
  {
    score: 9.2,
    nome: "PETR4",
    preco: "R$ 38,50",
    pe: "5,2",
    pvp: "1,1",
    roe: "18%",
    divYeld: "7,5%",
    margem: "22%",
    endiv: "0,8"
  },
  {
    score: 8.7,
    nome: "VALE3",
    preco: "R$ 67,20",
    pe: "4,8",
    pvp: "1,3",
    roe: "21%",
    divYeld: "8,2%",
    margem: "25%",
    endiv: "0,6"
  },
  {
    score: 7.9,
    nome: "ITUB4",
    preco: "R$ 29,10",
    pe: "8,1",
    pvp: "1,9",
    roe: "16%",
    divYeld: "5,1%",
    margem: "19%",
    endiv: "1,2"
  }
  // ...adicione mais ações conforme necessário
];

const Acoes: React.FC = () => {
  const [filtro, setFiltro] = useState("");

  const acoesFiltradas = useMemo(() =>
    acoesData.filter(
      acao =>
        acao.nome.toLowerCase().includes(filtro.toLowerCase())
    ), [filtro]
  );

  return (
    <div className="acoes-page">
      <div className="acoes-cards-grid">
        {cards.map((card) => (
          <div className="acoes-card" key={card.title}>
            <span className="acoes-card-title">{card.title}</span>
            <span className="acoes-card-value">{card.value}</span>
            {card.variation && (
              <span className={`acoes-card-variation ${card.variationType}`}>{card.variation}</span>
            )}
          </div>
        ))}
      </div>

      <div className="acoes-table-section">
        <input
          type="text"
          placeholder="Filtrar por ativo..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="acoes-filtro"
          aria-label="Filtrar ações por nome"
        />
        <table className="acoes-table">
          <thead>
            <tr>
              <th>Score</th>
              <th>Ativo</th>
              <th>Preço</th>
              <th>P/L</th>
              <th>P/VP</th>
              <th>ROE</th>
              <th>Div. Yield</th>
              <th>Margem</th>
              <th>Endiv.</th>
            </tr>
          </thead>
          <tbody>
            {acoesFiltradas.map((acao) => (
              <tr key={acao.nome}>
                <td>{acao.score}</td>
                <td>{acao.nome}</td>
                <td>{acao.preco}</td>
                <td>{acao.pe}</td>
                <td>{acao.pvp}</td>
                <td>{acao.roe}</td>
                <td>{acao.divYeld}</td>
                <td>{acao.margem}</td>
                <td>{acao.endiv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Acoes;