import { useState } from 'react';
import '../styles/Aprendizado.css';

const mockCourses = [
  { id: 'c1', title: 'Fundamentos do Investidor', author: 'Equipe YouInvest', minutes: 120 },
  { id: 'c2', title: 'Análise Fundamentalista: passo a passo', author: 'Erick', minutes: 90 },
  { id: 'c3', title: 'Renda Variável para Iniciantes', author: 'Time', minutes: 75 },
];

export default function Aprendizado() {
  const [tab, setTab] = useState<'cursos' | 'livros'>('cursos');

  return (
    <div className="aprendizado-page">
      <div className="mini-appbar">Aprendizado • YouInvest</div>

      <div className="aprendizado-container">
        <div className="tabs">
          <button className={`tab ${tab === 'cursos' ? 'active' : ''}`} onClick={() => setTab('cursos')}>Cursos</button>
          <button className={`tab ${tab === 'livros' ? 'active' : ''}`} onClick={() => setTab('livros')}>Livros</button>
        </div>

        <div className="content">
          {tab === 'cursos' ? (
            <div>
              <h3>Cursos disponíveis</h3>
              <p className="subtitle">Aqui aparecerá a lista de cursos — você pode integrar outra página que retorne os dados.</p>
              <div className="cards">
                {mockCourses.map(c => (
                  <article className="card" key={c.id}>
                    <div className="card-title">{c.title}</div>
                    <div className="card-meta">{c.author} · {c.minutes} min</div>
                    <div className="card-actions">
                      <button className="btn-primary">Abrir</button>
                      <button className="btn-ghost">Mais</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3>Livros</h3>
              <p className="subtitle">Aqui aparecerá a lista de livros. Quando a página de livros estiver pronta, integre o endpoint.</p>
              <div className="books-placeholder">Nenhum livro carregado — adicione a página que retorna a lista.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
