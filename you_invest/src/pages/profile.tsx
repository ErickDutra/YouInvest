import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();

  // mock data — você pode ligar a uma API/Context depois
  const invested = 45230.75;
  const points = 1280;
  const books = 6;
  const monthlyYield = 1.8; // percent

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h2>Meu Perfil</h2>
        <p className="profile-sub">Visão geral da sua conta</p>
      </header>

      <section className="profile-cards">
        <article className="profile-card">
          <div className="card-label">Valor investido</div>
          <div className="card-value">R$ {invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </article>

        <article className="profile-card">
          <div className="card-label">Pontos</div>
          <div className="card-value">{points}</div>
        </article>

        <article className="profile-card">
          <div className="card-label">Livros lidos</div>
          <div className="card-value">{books}</div>
        </article>

        <article className="profile-card">
          <div className="card-label">Rendimento mensal</div>
          <div className="card-value">{monthlyYield}%</div>
        </article>
      </section>

      <section className="profile-actions">
        <button className="btn-primary" onClick={() => navigate('/aprendizado')}>Meus Cursos</button>
        <button className="btn-primary" onClick={() => navigate('/carteira')}>Minhas Ações</button>
        <button className="btn-logout" onClick={() => alert('Saindo...')}>Sair</button>
      </section>
    </div>
  );
}
