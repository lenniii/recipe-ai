import Replicate from 'replicate';
import { REPLICATE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import {
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_CLOUD_NAME
} from '$env/static/private';

const replicate = new Replicate({
	auth: REPLICATE_API_KEY
});

cloudinary.config({
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	cloud_name: CLOUDINARY_CLOUD_NAME,
	secure: true
});

export const POST = async ({ request }) => {
	const { prompt } = await request.json();

	/* const output = (await replicate.run(
		'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
		{
			input: {
				prompt: prompt,
				image_dimensions: '512x512',
				scheduler: 'K_EULER'
			},
			wait: true
		}
	)) as string[]; */

	const upload = await cloudinary.uploader.upload(
		'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
		{ public_id: prompt }
	);

	return json({ image: upload.url });
};
