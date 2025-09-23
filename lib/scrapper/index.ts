import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {
	if (!url) return;

	// BrightData proxy configuration
	const username = String(process.env.BRIGHT_DATA_USERNAME);
	const password = String(process.env.BRIGHT_DATA_PASSWORD);
	const port = 33335;
	const session_id = (1000000 * Math.random()) | 0;

	const options = {
		auth: {
			username: `${username}-session-${session_id}`,
			password: password,
		},
		host: 'brd.superproxy.io',
		port,
		rejectUnauthorized: false,
	};

	try {
		// Fetch product page
		const response = await axios.get(url, options);
		const $ = cheerio.load(response.data);

		// Extract the product title
		const title = $('#productTitle').text().trim();
		const currentPrice = extractPrice(
			$('.priceToPay span.a-price-whole'),
			$('a.size.base.a-color-price'),
			$('.a-button-selected .a-color-base'),
			$('a.size-small')
		);

		const originalPrice = extractPrice(
			$('#priceblock_ourprice'),
			$('.a-price.a-text-price span.a-offscreen'),
			$('#listPrice'),
			$('#pricebook_dealprice'),
			$('.a-size-base.a-color-price')
		);

		console.log(
			'Title:',
			title,
			'Price:',
			currentPrice,
			'Original Price:',
			originalPrice
		);
	} catch (err: any) {
		throw new Error(`Failed to scrape product: ${err.message}`);
	}
}
