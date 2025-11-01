import { useNavigate } from 'react-router-dom';
import '../styles/Aprendizado.css';

type Curso = {
	id: string;
	title: string;
	author?: string;
	minutes?: number;
};

const cursosMock: Curso[] = [
	{ id: 'c1', title: 'Fundamentos do Investidor', author: 'YouInvest', minutes: 120 },
	{ id: 'c2', title: 'Análise Fundamentalista', author: 'Erick', minutes: 90 },
	{ id: 'c3', title: 'Renda Variável para Iniciantes', author: 'Time', minutes: 75 },
	{ id: 'c4', title: 'Opções e Estratégias', author: 'Prof. X', minutes: 60 },
];

export default function Cursos() {
	const navigate = useNavigate();

	return (
		<div className="cards">
			{cursosMock.map((c) => (
				<button
					key={c.id}
					className="card"
					onClick={() => navigate(`/curso/${c.id}`)}
					aria-label={`Abrir curso ${c.title}`}
				>
					<div className="card-title">{c.title}</div>
					<div className="card-meta">{c.author} · {c.minutes} min</div>
				</button>
			))}
		</div>
	);
}
