'use server';

import { revalidatePath } from 'next/cache';
import Product from '../models/Product.model';
import { connectToDb } from '../mongoose';
import { scrapeAmazonProduct } from '../scrapper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';

export async function scrapeAndStoreProduct(productUrl: string) {
	if (!productUrl) return;

	try {
		connectToDb();

		const scrapedProduct = await scrapeAmazonProduct(productUrl);

		if (!scrapedProduct) return;

		let product = scrapedProduct;

		const existingProduct = await Product.findOne({ url: scrapedProduct.url });

		if (existingProduct) {
			const updatedPriceHistory: any = [
				...existingProduct.priceHistory,
				{ price: scrapedProduct.currentPrice },
			];

			product = {
				...scrapedProduct,
				priceHistory: updatedPriceHistory,
				lowestPrice: getLowestPrice(updatedPriceHistory),
				highestPrice: getHighestPrice(updatedPriceHistory),
				averagePrice: getAveragePrice(updatedPriceHistory),
			};
		}

		const newProduct = await Product.findOneAndUpdate(
			{
				url: scrapedProduct.url,
			},
			product,
			{ upsert: true, new: true }
		);

		revalidatePath(`/products/${newProduct._id}`);
	} catch (error: any) {
		throw new Error(`Failded to create/update product: ${error.message}`);
	}
}

export async function getProuctById(productId: string) {
	try {
		connectToDb();

		const product = await Product.findOne({ _id: productId });

		if (!product) return null;

		return product;
	} catch (err: any) {
		console.log(err);
	}
}

export async function getAllProducts() {
	try {
		connectToDb();

		const products = await Product.find();

		return products;
	} catch (err: any) {
		console.log(err);
	}
}

export async function getSimillarProducts(productId: string) {
	try {
		connectToDb();

		const currentProduct = await Product.findById(productId);

		if (!currentProduct) return null;

		const similarProducts = await Product.find({
			_id: { $ne: productId },
		}).limit(3);

		return similarProducts;
	} catch (err: any) {
		console.log(err);
	}
}
