import React from "react";
import "../styles/VisaoGeral.css";

interface CardData {
  title: string;
  value: string;
  variation: string;
  variationType: string;
}

const cardsLinha1: CardData[] = [
  {
    title: "Ibovespa",
    value: "128.450",
    variation: "+2.45%",
    variationType: "positivo"
  },
  {
    title: "Dólar",
    value: "5,25",
    variation: "-0.80%",
    variationType: "negativo"
  },
  {
    title: "S&P 500",
    value: "5.350",
    variation: "+1.12%",
    variationType: "positivo"
  },
  {
    title: "Bitcoin",
    value: "R$ 350.000",
    variation: "+3.20%",
    variationType: "positivo"
  }
];

const cardsLinha2: CardData[] = [
  {
    title: "Carteira Total",
    value: "R$ 50.000,00",
    variation: "+1.75%",
    variationType: "positivo"
  },
  {
    title: "Rendimento Mensal",
    value: "R$ 1.200,00",
    variation: "+0.95%",
    variationType: "positivo"
  }
];

const VisaoGeral: React.FC = () => {
  return (
    <div className="visao-geral-grid">
      <div className="row row-1">
        {cardsLinha1.map((card) => (
          <div className="card" key={card.title}>
            <span className="card-title">{card.title}</span>
            <span className="card-value">{card.value}</span>
            <span className={`card-variation ${card.variationType}`}>{card.variation}</span>
          </div>
        ))}
      </div>
      <div className="row row-2">
        {cardsLinha2.map((card) => (
          <div className="card card-large" key={card.title}>
            <span className="card-title">{card.title}</span>
            <span className="card-value">{card.value}</span>
            <span className={`card-variation ${card.variationType}`}>{card.variation}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(VisaoGeral);