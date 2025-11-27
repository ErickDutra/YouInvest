import React, { useState, useEffect, useMemo } from "react";
import "../styles/Fiis.css";

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
  variacao_12m: string;
}

const cards: CardData[] = [
  { title: "IFIX", value: "3.250", variation: "+0.85%", variationType: "positivo" },
  { title: "Div. Yield Médio", value: "0,85%", variation: "", variationType: "" },
  { title: "Patrimônio Total", value: "R$ 200 Bi", variation: "", variationType: "" }
];

const Fiis: React.FC = () => {
  const [filtro, setFiltro] = useState("");
  const [fiisData, setFiisData] = useState<FiiData[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem('fiis_cache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        const mappedData: FiiData[] = data.map((fii: unknown, index: number) => {
          const f = fii as { cotacao?: { raw?: string | null; value?: number | null }; dy?: { raw?: string | null; value?: number | null }; pvp?: { raw?: string | null; value?: number | null }; liquidez?: { raw?: string | null; value?: number | null }; variacao_12m?: { raw?: string | null; value?: number | null }; url?: string };
          return {
            nome: extractCodigoFromUrl(f.url) || `FII${index + 1}`,
            preco: formatCurrencyOrRaw({ raw: f.cotacao?.raw || null, value: f.cotacao?.value || null }),
            divYeld: formatNumberOrRaw({ raw: f.dy?.raw || null, value: f.dy?.value || null }),
            pvp: formatNumberOrRaw({ raw: f.pvp?.raw || null, value: f.pvp?.value || null }),
            liquidez: formatCurrencyOrRaw({ raw: f.liquidez?.raw || null, value: f.liquidez?.value || null }),
            variacao_12m: formatNumberOrRaw({ raw: f.variacao_12m?.raw || null, value: f.variacao_12m?.value || null })
          };
        });
        setFiisData(mappedData);
      } catch (error) {
        console.error('Erro ao carregar fiis do cache:', error);
      }
    }
  }, []);

  const fiisFiltrados = useMemo(() =>
    fiisData.filter(
      fii =>
        fii.nome.toLowerCase().includes(filtro.toLowerCase())
    ), [filtro, fiisData]
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
              <th>Variação 12M</th>
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
                <td>{fii.variacao_12m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fiis;