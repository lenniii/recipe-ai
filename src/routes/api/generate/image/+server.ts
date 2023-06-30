import Replicate from 'replicate';
import { REPLICATE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

const replicate = new Replicate({
	auth: REPLICATE_API_KEY
});

export const POST = async ({ request }) => {
	const { prompt } = await request.json();

	const output = (await replicate.run(
		'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
		{
			input: {
				prompt: prompt,
				image_dimensions: '512x512',
				scheduler: 'K_EULER'
			},
			wait: true
		}
	)) as string[];

	return json({ image: output[0] });
};
