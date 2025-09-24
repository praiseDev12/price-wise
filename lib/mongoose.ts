import mongoose from 'mongoose';

let isConnected = false; // variable to track connection status

export const connectToDb = async () => {
	mongoose.set('strictQuery', true);

	if (!process.env.MONGODB_URI)
		return console.log('mongo db uri is not defined');

	if (isConnected) return console.log('using existing database connection');

	try {
		await mongoose.connect(process.env.MONGODB_URI);

		isConnected = true;
		console.log('MongoDb connected ✅');
	} catch (error: any) {
		console.log('Mongo connection Error', error);
	}
};
