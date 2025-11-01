export type AcaoResult = {
	cotacao: { raw: string | null; value: number | null };
	pvp: { raw: string | null; value: number | null };
	variacao_12m: { raw: string | null; value: number | null };
	pl: { raw: string | null; value: number | null };
	dy: { raw: string | null; value: number | null };
	url: string;
};

const BASE_URL = 'http://localhost:3333/acoes';

/**
 * Retorna um array de `AcaoResult` consultando o site https://investidor10.com.br/acoes
 * Usa uma lista fixa com 10 códigos de ações e faz um fetch para cada um.
 * Se a resposta não puder ser convertida em JSON, será retornado um objeto com valores nulos
 * e a `url` apontando para a página da ação.
 */
export async function getAcoes(): Promise<AcaoResult[]> {
	// Lista fixa com 10 ações populares (apenas os códigos)
	const codigos = [
		'PETR4',
		'VALE3',
		'ITUB4',
		'BBDC4',
		'B3SA3',
		'ABEV3',
		'MGLU3',
		'GGBR4',
		'EGIE3',
		'WEGE3',
	];

	// Função auxiliar para normalizar qualquer resposta em AcaoResult
	const toNumber = (v: unknown): number | null => {
		if (typeof v === 'number') return v;
		if (v == null) return null;
		const n = Number(v as unknown);
		return Number.isFinite(n) ? n : null;
	};

	const normalize = (raw: unknown, url: string): AcaoResult => {
		const r = raw as AcaoResult;
		return {
			cotacao: { raw: r?.cotacao?.raw ?? null, value: toNumber(r?.cotacao?.value) },
			pvp: { raw: r?.pvp?.raw ?? null, value: toNumber(r?.pvp?.value) },
			variacao_12m: { raw: r?.variacao_12m?.raw ?? null, value: toNumber(r?.variacao_12m?.value) },
			pl: { raw: r?.pl?.raw ?? null, value: toNumber(r?.pl?.value) },
			dy: { raw: r?.dy?.raw ?? null, value: toNumber(r?.dy?.value) },
			url,
		};
	};

	const requests = codigos.map(async (codigo) => {
		// Tentamos primeiro enviar como query string ?codigo=XXX
		const urlQuery = `${BASE_URL}/${encodeURIComponent(codigo)}`;
		const urlPath = `${BASE_URL}/${encodeURIComponent(codigo)}`;

		// helper to build fallback empty result
		const emptyResult = (u: string) => ({
			cotacao: { raw: null, value: null },
			pvp: { raw: null, value: null },
			variacao_12m: { raw: null, value: null },
			pl: { raw: null, value: null },
			dy: { raw: null, value: null },
			url: u,
		} as AcaoResult);

		try {
			let resp = await fetch(urlQuery, { headers: { Accept: 'application/json' } });
			if (!resp.ok) {
				// tenta alternativa de path
				resp = await fetch(urlPath, { headers: { Accept: 'application/json' } });
			}

			const contentType = resp.headers.get('content-type') || '';
			if (resp.ok && contentType.includes('application/json')) {
				const data = await resp.json();
				return normalize(data, resp.url || urlQuery);
			}

			// Se veio OK mas não JSON, tenta extrair texto e ver se contém JSON
			if (resp.ok) {
				const txt = await resp.text();
				// tenta encontrar o primeiro objeto JSON no texto
				const firstBrace = txt.indexOf('{');
				if (firstBrace !== -1) {
					try {
						const maybe = JSON.parse(txt.slice(firstBrace));
						return normalize(maybe, resp.url || urlQuery);
					} catch {
						// segue para fallback
					}
				}
                console.log(txt)
			}
			// resposta ruim -> retorna objeto vazio com url de consulta
			return emptyResult(resp.url || urlQuery);
		} catch {
			// erro de rede ou CORS: retornar objeto vazio com url sabia
			return emptyResult(urlQuery);
		}
	});

	const results = await Promise.all(requests);
	return results;
}

export default getAcoes;
