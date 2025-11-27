import React, { useState, useMemo, useEffect } from "react";
import "../styles/Acao.css";
import type { AcaoResult } from "../services/acoes_get_all";

interface CardData {
  title: string;
  value: string;
  variation: string;
  variationType: string;
}

const cards: CardData[] = [
  { title: "Ibovespa", value: "128.450", variation: "+2.45%", variationType: "positivo" },
  { title: "Volume Total", value: "R$ 2.500.000.000", variation: "+1.10%", variationType: "positivo" },
  { title: "Ações em Alta", value: "37", variation: "", variationType: "" },
  { title: "Ações em Baixa", value: "13", variation: "", variationType: "" }
];

const Acoes: React.FC = () => {
  const [filtro, setFiltro] = useState("");
  const [acoes, setAcoes] = useState<(AcaoResult & { codigo: string })[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem('acoes_cache');
    if (cached) {
      try {
        const data: AcaoResult[] = JSON.parse(cached);
        const withCodigo = data.map((item) => {
          const codigo = extractCodigoFromUrl(item.url) || "-";
          return { ...item, codigo };
        });
        setAcoes(withCodigo);
      } catch (error) {
        console.error('Erro ao carregar cache:', error);
      }
    }
  }, []);

  const acoesFiltradas = useMemo(() =>
    acoes.filter(acao => acao.codigo.toLowerCase().includes(filtro.toLowerCase()))
  , [acoes, filtro]);

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
                <th>Ativo</th>
                <th>Cotação</th>
                <th>P/VP</th>
                <th>Variação 12m</th>
                <th>P/L</th>
                <th>Div. Yield</th>
              </tr>
            </thead>
            <tbody>
              {acoesFiltradas.map((acao) => (
                <tr key={acao.codigo}>
                  <td>{acao.codigo}</td>
                  <td>{formatCurrencyOrRaw(acao.cotacao)}</td>
                  <td>{formatNumberOrRaw(acao.pvp)}</td>
                  <td>{formatNumberOrRaw(acao.variacao_12m)}</td>
                  <td>{formatNumberOrRaw(acao.pl)}</td>
                  <td>{formatNumberOrRaw(acao.dy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

function extractCodigoFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const codigo = u.searchParams.get('codigo');
    if (codigo) {
      return codigo.toUpperCase();
    }
    // fallback: usar último segmento do path
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length) {
      return parts.at(-1)!.toUpperCase();
    }
    return null;
  } catch {
    // se não for URL válida, tenta extrair texto após '='
    const q = url.split('codigo=')[1];
    if (q) return q.split('&')[0].toUpperCase();
    return null;
  }
}

function formatCurrencyOrRaw(field: { raw: string | null; value: number | null }) {
  if (field.value != null) return `R$ ${field.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  return field.raw ?? '-';
}

function formatNumberOrRaw(field: { raw: string | null; value: number | null }) {
  if (field.value != null) return field.value.toString();
  return field.raw ?? '-';
}

export default Acoes;