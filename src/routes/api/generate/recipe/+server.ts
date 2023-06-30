import { OPENAI_API_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai-edge';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const jsonSchema = z.object({ ingredients: z.array(z.string()) });

const apiConfig = new Configuration({
	apiKey: OPENAI_API_KEY
});

const openai = new OpenAIApi(apiConfig);

function buildPrompt(ingredients: string[]) {
	const prompt = `
  I am gonna ask you to suggest me a recipe, sending you a list of ingredients. Return a recipe using ONLY those ingredients.
  The recipe preparation steps should be as extensive as you can.
  Ingredients: ${JSON.stringify(ingredients)}.
  Return the recipe using JSON.
  The shape of the response must be: {"title": string, "ingredients": string[], "steps": string[], "difficulty": 1-5}
  Your response must be exactly what i asked. Don't add anything to your response, answer just with a valid JSON, remove trailing commas.
  Use Italian language in JSON values.
`;

	return prompt.split('\n').map(
		(message) =>
			({
				role: 'user',
				content: message
			} satisfies ChatCompletionRequestMessage)
	);
}

export const POST = (async ({ request }) => {
	// Extract the `prompt` from the body of the request
	const req = jsonSchema.safeParse(await request.json());

	if (!req.success) {
		throw error(400, 'Bad request');
	}

	// Request the OpenAI API for the response based on the prompt
	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages: buildPrompt(req.data.ingredients),
		max_tokens: 500,
		temperature: 0.7,
		top_p: 1,
		frequency_penalty: 1,
		presence_penalty: 1
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);

	// Respond with the stream
	return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
