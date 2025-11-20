import React, { useEffect, useMemo, useState } from 'react'
import '../styles/Carteira.css'

type AssetType = 'acao' | 'fii' | 'cripto'

type Asset = {
  id?: string
  tipo: AssetType
  nome: string
  quantidade: number
  preco: number
  data: string
}

const colors: Record<AssetType, string> = {
  acao: '#4CAF50',
  fii: '#2196F3',
  cripto: '#FF9800',
}

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function PieChart({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, it) => s + it.value, 0)
  const size = 220
  const r = size / 2
  const cx = r
  const cy = r

  let angle = -90

  const paths = items.map((it, idx) => {
    const value = total === 0 ? 0 : (it.value / total) * 360
    const startAngle = angle
    const endAngle = angle + value
    angle = endAngle

    const large = value > 180 ? 1 : 0

    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)

    const d = [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`, 'Z'].join(' ')

    return <path key={idx} d={d} fill={it.color} stroke="#fff" strokeWidth={1} />
  })

  return (
    <div className="carteira-pie">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{paths}</svg>
      <div className="carteira-legend">
        {items.map((it) => (
          <div className="legend-item" key={it.label}>
            <span className="legend-color" style={{ background: it.color }} />
            <span className="legend-label">{it.label}</span>
            <span className="legend-value">{it.value === 0 ? '-' : formatCurrency(it.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180.0
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export default function CarteiraPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<Asset>({ tipo: 'acao', nome: '', quantidade: 0, preco: 0, data: '' })

  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    setLoading(true)
    try {
      const res = await fetch('/api/ativos')
      if (res.ok) {
        const data = await res.json()
        setAssets(data)
      } else {
        // endpoint talvez não exista ainda; manter vazio
        setAssets([])
      }
    } catch (error) {
        console.log(error)
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e?: React.FormEvent) {
    e?.preventDefault()
    try {
      const res = await fetch('/api/ativos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        const created = await res.json()
        setAssets((s) => [...s, created])
      } else {
        // se endpoint não implementado, adiciona localmente com id temporário
        setAssets((s) => [...s, { ...form, id: String(Date.now()) }])
      }
    } catch (error) {
         console.log(error)
      setAssets((s) => [...s, { ...form, id: String(Date.now()) }])
    }
    setShowModal(false)
    setForm({ tipo: 'acao', nome: '', quantidade: 0, preco: 0, data: '' })
  }

  async function handleDelete(id?: string) {
    if (!id) return
    try {
      const res = await fetch(`/api/ativos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAssets((s) => s.filter((a) => a.id !== id))
      } else {
        setAssets((s) => s.filter((a) => a.id !== id))
      }
    } catch (error) {
        console.log(error)
      setAssets((s) => s.filter((a) => a.id !== id))
    }
  }

  const grouped = useMemo(() => {
    return {
      acoes: assets.filter((a) => a.tipo === 'acao'),
      fiis: assets.filter((a) => a.tipo === 'fii'),
      cryptos: assets.filter((a) => a.tipo === 'cripto'),
    }
  }, [assets])

  const totalByType = useMemo(() => {
    const calc = (list: Asset[]) => list.reduce((s, a) => s + a.quantidade * a.preco, 0)
    return {
      acoes: calc(grouped.acoes),
      fiis: calc(grouped.fiis),
      cryptos: calc(grouped.cryptos),
    }
  }, [grouped])

  const pieItems = [
    { label: 'Ações', value: totalByType.acoes, color: colors.acao },
    { label: 'FIIs', value: totalByType.fiis, color: colors.fii },
    { label: 'Criptos', value: totalByType.cryptos, color: colors.cripto },
  ]

  return (
    <div className="carteira-root">
      <div className="carteira-main">
        <div className="carteira-columns">
          <section className="col">
            <div className="col-header">
              <h3>Ações</h3>
              <button onClick={() => { setShowModal(true); setForm((f) => ({ ...f, tipo: 'acao' })) }}>Adicionar</button>
            </div>
            <div className="col-list">
              {loading ? <div>Carregando...</div> : grouped.acoes.length === 0 ? <div className="empty">Nenhum ativo</div> : grouped.acoes.map((a) => (
                <div className="asset" key={a.id || a.nome + Math.random()}>
                  <div className="asset-info">
                    <div className="asset-name">{a.nome}</div>
                    <div className="asset-meta">{a.quantidade} x {formatCurrency(a.preco)}</div>
                  </div>
                  <div className="asset-actions">
                    <div className="asset-value">{formatCurrency(a.quantidade * a.preco)}</div>
                    <button className="sell" onClick={() => handleDelete(a.id)}>Vender</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="col">
            <div className="col-header">
              <h3>FIIs</h3>
              <button onClick={() => { setShowModal(true); setForm((f) => ({ ...f, tipo: 'fii' })) }}>Adicionar</button>
            </div>
            <div className="col-list">
              {grouped.fiis.length === 0 ? <div className="empty">Nenhum ativo</div> : grouped.fiis.map((a) => (
                <div className="asset" key={a.id || a.nome}>
                  <div className="asset-info">
                    <div className="asset-name">{a.nome}</div>
                    <div className="asset-meta">{a.quantidade} x {formatCurrency(a.preco)}</div>
                  </div>
                  <div className="asset-actions">
                    <div className="asset-value">{formatCurrency(a.quantidade * a.preco)}</div>
                    <button className="sell" onClick={() => handleDelete(a.id)}>Vender</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="col">
            <div className="col-header">
              <h3>Criptos</h3>
              <button onClick={() => { setShowModal(true); setForm((f) => ({ ...f, tipo: 'cripto' })) }}>Adicionar</button>
            </div>
            <div className="col-list">
              {grouped.cryptos.length === 0 ? <div className="empty">Nenhum ativo</div> : grouped.cryptos.map((a) => (
                <div className="asset" key={a.id || a.nome}>
                  <div className="asset-info">
                    <div className="asset-name">{a.nome}</div>
                    <div className="asset-meta">{a.quantidade} x {formatCurrency(a.preco)}</div>
                  </div>
                  <div className="asset-actions">
                    <div className="asset-value">{formatCurrency(a.quantidade * a.preco)}</div>
                    <button className="sell" onClick={() => handleDelete(a.id)}>Vender</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <aside className="carteira-side">
        <h4>Composição da Carteira</h4>
        <PieChart items={pieItems} />
      </aside>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <form className="modal" onSubmit={handleAdd}>
            <h3>Registrar Ativo</h3>
            <label>
              Tipo
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as AssetType })}>
                <option value="acao">Ação</option>
                <option value="fii">FII</option>
                <option value="cripto">Cripto</option>
              </select>
            </label>

            <label>
              Nome
              <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </label>

            <label>
              Quantidade
              <input required type="number" step="any" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} />
            </label>

            <label>
              Preço (un.)
              <input required type="number" step="any" value={form.preco} onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })} />
            </label>

            <label>
              Data
              <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </label>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="submit" className="primary">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
