import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../styles/Calculadora.css';

function toNumber(v: string | number) {
  const n = typeof v === 'number' ? v : Number(String(v).replaceAll(/[^0-9.-]+/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function Calculadora() {
  const [principal, setPrincipal] = useState<number>(1000);
  const [monthly, setMonthly] = useState<number>(0);
  const [rate, setRate] = useState<number>(10); // percentual
  const [rateType, setRateType] = useState<'annual' | 'monthly'>('annual');
  const [years, setYears] = useState<number>(5);
  const [showMonthly, setShowMonthly] = useState<boolean>(false);

  const months = Math.max(1, Math.round(years * 12));

  const monthlyRate = useMemo(() => {
    if (rateType === 'monthly') return rate / 100;
    // efetivo mensal a partir de taxa anual (taxa efetiva)
    return Math.pow(1 + rate / 100, 1 / 12) - 1;
  }, [rate, rateType]);

  const series = useMemo(() => {
    const data: { name: string; balance: number; contribution: number }[] = [];
    let balance = principal;
    let totalContrib = principal;
    for (let m = 1; m <= months; m++) {
      const interest = balance * monthlyRate;
      balance = balance + interest + monthly;
      totalContrib += monthly;
      if (showMonthly) {
        data.push({ name: `M${m}`, balance: Number(balance.toFixed(2)), contribution: Number(totalContrib.toFixed(2)) });
      } else if (m % 12 === 0 || m === months) {
        const year = Math.round(m / 12);
        data.push({ name: `Y${year}`, balance: Number(balance.toFixed(2)), contribution: Number(totalContrib.toFixed(2)) });
      }
    }
    return data;
  }, [principal, monthly, monthlyRate, months, showMonthly]);

  const finalBalance = series.length ? series.at(-1)!.balance : principal;
  const totalInvested = principal + monthly * months;
  const interestEarned = Number((finalBalance - totalInvested).toFixed(2));

  return (
    <div className="calculadora-page">
      <div className="calculadora-header">
        <h2>Calculadora de Juros Compostos</h2>
      </div>

      <div className="calc-grid">
        <div className="input-group">
          <div>Valor inicial (R$)</div>
          <input className="input-field" type="number" value={principal} onChange={(e) => setPrincipal(toNumber(e.target.value))} />
        </div>

        <div className="input-group">
          <div>Contribuição mensal (R$)</div>
          <input className="input-field" type="number" value={monthly} onChange={(e) => setMonthly(toNumber(e.target.value))} />
        </div>

        <div className="input-group">
          <div>Taxa ({rateType === 'annual' ? 'ao ano (%)' : 'ao mês (%)'})</div>
          <input className="input-field" type="number" value={rate} onChange={(e) => setRate(toNumber(e.target.value))} step={0.01} />
        </div>

        <div className="input-group">
          <div>Tipo de taxa</div>
          <select className="input-field" value={rateType} onChange={(e) => setRateType(e.target.value as 'annual' | 'monthly')}>
            <option value="annual">Anual</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>

        <div className="input-group">
          <div>Período (anos)</div>
          <input className="input-field small-input" type="number" value={years} onChange={(e) => setYears(Math.max(0, Math.round(toNumber(e.target.value))))} />
        </div>

        <div className="input-group controls-row">
          <div>Mostrar mensal</div>
          <input type="checkbox" checked={showMonthly} onChange={(e) => setShowMonthly(e.target.checked)} />
        </div>
      </div>

      <div className="chart-card">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Line type="monotone" dataKey="balance" stroke="#4f46e5" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="result-card">
        <div className="result-item">
          <strong>Valor final</strong>
          <span>R$ {finalBalance.toLocaleString('pt-BR')}</span>
        </div>
        <div className="result-item">
          <strong>Total investido</strong>
          <span>R$ {totalInvested.toLocaleString('pt-BR')}</span>
        </div>
        <div className="result-item">
          <strong>Juros ganhos</strong>
          <span>R$ {interestEarned.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}

function tooltipFormatter(value: unknown) {
  let v: unknown = value;
  if (Array.isArray(value)) v = value[0];
  return `R$ ${Number(String(v ?? 0)).toLocaleString('pt-BR')}`;
}
