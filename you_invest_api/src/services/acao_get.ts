import axios from 'axios';
import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';

const BASE = 'https://investidor10.com.br/acoes';

export type AcaoScrapeResult = {
	cotacao: { raw: string | null; value: number | null };
	pvp: { raw: string | null; value: number | null };
	variacao_12m: { raw: string | null; value: number | null };
	pl: { raw: string | null; value: number | null };
	dy: { raw: string | null; value: number | null };
	url: string;
};

function cleanRaw(elText?: cheerio.Cheerio<AnyNode> | string | null) {
	if (!elText) return null;
	if (typeof elText !== 'string') return String(elText).trim();
	return elText.trim();
}

function parseBRNumber(raw?: string | null) {
	if (!raw) return null;
	const s = raw.replace(/R\$/g, '').replace(/%/g, '').replace(/\s/g, '');
	const normalized = s.replace(/\./g, '').replace(/,/g, '.');
	const n = Number(normalized);
	return Number.isFinite(n) ? n : null;
}

export async function getAcao(ticker: string): Promise<AcaoScrapeResult> {
	const url = `${BASE}/${encodeURIComponent(ticker)}/`;
	const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
	const $ = cheerio.load(res.data);

	const result: AcaoScrapeResult = {
		cotacao: { raw: null, value: null },
		pvp: { raw: null, value: null },
		variacao_12m: { raw: null, value: null },
		pl: { raw: null, value: null },
		dy: { raw: null, value: null },
		url,
	};

				$('#cards-ticker ._card').each((_: number, card: AnyNode) => {
					const headerTitle = $(card).find('._card-header span[title]').attr('title') || $(card).find('._card-header span').text();
		// Get first span in body (most values are inside a span)
		const bodySpan = $(card).find('._card-body span.value');
		const bodySpanAny = bodySpan.length ? bodySpan : $(card).find('._card-body span').first();
		const raw = cleanRaw(bodySpanAny.text());

		if (!headerTitle) return;
		const key = headerTitle.toLowerCase().trim();

		if (key.includes('cotação') || key === 'cotação') {
			result.cotacao.raw = raw;
			result.cotacao.value = parseBRNumber(raw);
		} else if (key.includes('variação') || key.includes('varia')) {
			result.variacao_12m.raw = raw;
			result.variacao_12m.value = parseBRNumber(raw);
		} else if (key === 'p/l' || key.includes('p/l') || key === 'pl') {
			result.pl.raw = raw;
			result.pl.value = parseBRNumber(raw);
		} else if (key === 'p/vp' || key.includes('p/vp') || key === 'pvp') {
			result.pvp.raw = raw;
			result.pvp.value = parseBRNumber(raw);
		} else if (key === 'dy' || key.includes('dy')) {
			result.dy.raw = raw;
			result.dy.value = parseBRNumber(raw);
		}
	});

	return result;
}






