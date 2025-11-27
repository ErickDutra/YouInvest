import React, { useEffect, useMemo, useState } from 'react'
import '../styles/Carteira.css'
import { getPortfolio } from '../services/wallet_get_all'
import { buyAsset,sellAsset } from '../services/acoes'

export type FiiResult = {
	cotacao: { raw: string | null; value: number | null };
	pvp: { raw: string | null; value: number | null };
	variacao_12m: { raw: string | null; value: number | null };
	dy: { raw: string | null; value: number | null };
	liquidez: { raw: string | null; value: number | null };
	url: string;
};

export type AcaoResult = {
	cotacao: { raw: string | null; value: number | null };
	pvp: { raw: string | null; value: number | null };
	variacao_12m: { raw: string | null; value: number | null };
	pl: { raw: string | null; value: number | null };
	dy: { raw: string | null; value: number | null };
	url: string;
};

 
type AssetType = 'acao' | 'fii' | 'cripto'

 type PortfolioItem = {
  code: string;
  price: number;
  quantity: number;
  type: string;
}
 type AcaoBuy = {
  code: string;
  type: string;
  market: string;
}

export interface BuyRequest {
  acoes: AcaoBuy;
  userId: string;
  quantity: number;
}


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

function extractCodigoFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const codigo = u.searchParams.get('codigo');
    if (codigo) {
      return codigo.toUpperCase();
    }
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

type BuyForm = {
  tipo: AssetType
  selectedCode: string
  quantidade: number
}

export default function CarteiraPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<BuyForm>({ tipo: 'acao', selectedCode: '', quantidade: 0 })
  const [availableAcoes, setAvailableAcoes] = useState<AcaoResult[]>([])
  const [availableFiis, setAvailableFiis] = useState<FiiResult[]>([])
  const [showSellModal, setShowSellModal] = useState(false)
  const [sellForm, setSellForm] = useState<{ asset: Asset | null; quantidade: number }>({ asset: null, quantidade: 0 })

  useEffect(() => {
    loadAssets()
    loadAvailableAssets()
  }, [])

  async function loadAvailableAssets() {
    const acoesCache = localStorage.getItem('acoes_cache')
    const acoes = acoesCache ? JSON.parse(acoesCache) : []
    console.log('Available acoes from cache:', acoes.length)
    setAvailableAcoes(acoes)

    const fiisCache = localStorage.getItem('fiis_cache')
    const fiis = fiisCache ? JSON.parse(fiisCache) : []
    console.log('Available fiis from cache:', fiis.length)
    setAvailableFiis(fiis)
  }

  async function loadAssets() {
    setLoading(true)
    try {
      const userInfoStr = localStorage.getItem('user_info')
      if (!userInfoStr) {
        console.log('No user info found in cache')
        setAssets([])
        return
      }
      const userInfo = JSON.parse(userInfoStr)
      console.log('userInfo parsed:', userInfo)
      const userId = userInfo.id
      console.log('User ID from parsed user_info:', userId)
      if (!userId) {
        console.log('No user ID in user_info')
        setAssets([])
        return
      }
      const data = await getPortfolio(userId)
      console.log('Portfolio data received:', data)
      const mappedAssets: Asset[] = data.map((item: PortfolioItem) => {
        let tipo: AssetType
        if (item.type === 'ACOES') tipo = 'acao'
        else if (item.type === 'FIIS') tipo = 'fii'
        else tipo = 'cripto'
        return {
          tipo,
          nome: item.code,
          quantidade: item.quantity,
          preco: item.price,
          data: '', 
          id: item.code + item.type 
        }
      })
      console.log('Mapped assets:', mappedAssets)
      setAssets(mappedAssets)
    } catch (error) {
      console.error('Erro ao carregar portfolio:', error)
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e?: React.FormEvent) {
    e?.preventDefault()
    const userInfoStr = localStorage.getItem('user_info')
    if (!userInfoStr) return
    const userInfo = JSON.parse(userInfoStr)
    const userId = userInfo.id
    if (!userId || !form.selectedCode || form.quantidade <= 0) return
    const type = form.tipo === 'acao' ? 'ACOES' : form.tipo === 'fii' ? 'FIIS' : 'CRYPTO'
    const request: BuyRequest = {
      acoes: { code: form.selectedCode, type, market: 'BANCOS' },
      userId,
      quantity: form.quantidade
    }
    try {
      await buyAsset(request)
      loadAssets()
    } catch (error) {
      console.error('Erro ao comprar:', error)
    }
    setShowModal(false)
    setForm({ tipo: 'acao', selectedCode: '', quantidade: 0 })
  }

  async function handleSellConfirm(e: React.FormEvent) {
    e.preventDefault()
    if (!sellForm.asset || sellForm.quantidade <= 0 || sellForm.quantidade > sellForm.asset.quantidade) return
    const userInfoStr = localStorage.getItem('user_info')
    if (!userInfoStr) return
    const userInfo = JSON.parse(userInfoStr)
    const userId = userInfo.id
    if (!userId) return
    const type = sellForm.asset.tipo === 'acao' ? 'ACOES' : sellForm.asset.tipo === 'fii' ? 'FIIS' : 'CRYPTO'
    const request: BuyRequest = {
      acoes: { code: sellForm.asset.nome, type, market: 'BANCOS' },
      userId,
      quantity: sellForm.quantidade
    }
    try {
      await sellAsset(request)
      loadAssets() 
    } catch (error) {
      console.error('Erro ao vender:', error)
    }
    setShowSellModal(false)
    setSellForm({ asset: null, quantidade: 0 })
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
                    <button className="sell" onClick={() => { setSellForm({ asset: a, quantidade: 0 }); setShowSellModal(true) }}>Vender</button>
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
                    <button className="sell" onClick={() => { setSellForm({ asset: a, quantidade: 0 }); setShowSellModal(true) }}>Vender</button>
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
                    <button className="sell" onClick={() => { setSellForm({ asset: a, quantidade: 0 }); setShowSellModal(true) }}>Vender</button>
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
            <h3>Comprar Ativo</h3>
            <label>
              Tipo
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as AssetType, selectedCode: '' })}>
                <option value="acao">Ação</option>
                <option value="fii">FII</option>
                <option value="cripto">Cripto</option>
              </select>
            </label>

            <label>
              Ativo
              <select value={form.selectedCode} onChange={(e) => setForm({ ...form, selectedCode: e.target.value })} required>
                <option value="">Selecione</option>
                {(form.tipo === 'acao' ? availableAcoes : form.tipo === 'fii' ? availableFiis : []).map((item, idx) => {
                  const code = extractCodigoFromUrl(item.url)
                  return <option key={idx} value={code || ''}>{code}</option>
                })}
              </select>
            </label>

            <label>
              Quantidade
              <input required type="number" step="any" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })} />
            </label>

            <div className="modal-actions">
              <button type="button" className="sell" onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="submit" className="primary">Comprar</button>
            </div>
          </form>
        </div>
      )}

      {showSellModal && sellForm.asset && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <form className="modal" onSubmit={handleSellConfirm}>
            <h3>Vender {sellForm.asset.nome}</h3>
            <label>
              Quantidade (máx: {sellForm.asset.quantidade})
              <input required type="number" step="any" min="0" max={sellForm.asset.quantidade} value={sellForm.quantidade} onChange={(e) => setSellForm({ ...sellForm, quantidade: Number(e.target.value) })} />
            </label>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowSellModal(false)}>Cancelar</button>
              <button type="submit" className="primary">Confirmar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}


function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}