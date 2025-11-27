export type FiiResult = {
	cotacao: { raw: string | null; value: number | null };
	pvp: { raw: string | null; value: number | null };
	variacao_12m: { raw: string | null; value: number | null };
	dy: { raw: string | null; value: number | null };
	liquidez: { raw: string | null; value: number | null };
	url: string;
};

const BASE_URL = 'http://localhost:8082/getMarketFiis';
const CACHE_KEY = 'fiis_cache';
const CACHE_TIMESTAMP_KEY = 'fiis_cache_timestamp';
const CACHE_EXPIRY = 60 * 60 * 1000; 


export async function getFiis(): Promise<FiiResult[]> {
	const cached = localStorage.getItem(CACHE_KEY);
	const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
	if (cached && timestampStr) {
		try {
			const timestamp = Number.parseInt(timestampStr, 10);
			const now = Date.now();
			if (now - timestamp < CACHE_EXPIRY) {
				const data: FiiResult[] = JSON.parse(cached);
				return data;
			}
		} catch {
			// Cache inválido, continuar
		}
	}

	try {
		const resp = await fetch(BASE_URL, { headers: { Accept: 'application/json' } });
		if (resp.ok) {
			const data = await resp.json();
			localStorage.setItem(CACHE_KEY, JSON.stringify(data));
			localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
			return data as FiiResult[];
		} else {
			console.error('Erro na resposta:', resp.status, resp.statusText);
			return [];
		}
	} catch (error) {
		console.error('Erro ao buscar fiis:', error);
		return [];
	}
}

export default getFiis;
