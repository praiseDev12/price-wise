'use client';

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react';

const isValidAmazonProductUrl = (url: string) => {
	try {
		const parsedUrl = new URL(url);
		const hostName = parsedUrl.hostname;

		// check if hostname contains amazon.com

		if (
			hostName.includes('amazon.com') ||
			hostName.includes('amazon.') ||
			hostName.endsWith('amazon')
		) {
			return true;
		}
	} catch (err) {
		return false;
	}
};

const Searchbar = () => {
	const [searchprompt, setSearchprompt] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isValidLink = isValidAmazonProductUrl(searchprompt);

		if (!isValidLink) return alert('Please provide a valid amazon link');

		try {
			setIsLoading(true);

			// scrape the product page
			const product = await scrapeAndStoreProduct(searchprompt);
		} catch (err) {
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
			<input
				type='text'
				onChange={(e) => setSearchprompt(e.target.value)}
				value={searchprompt}
				placeholder='Enter product link'
				className='searchbar-input'
			/>
			<button
				disabled={searchprompt === ''}
				type='submit'
				className='searchbar-btn'>
				{isLoading ? 'searching...' : 'search'}
			</button>
		</form>
	);
};

export default Searchbar;
