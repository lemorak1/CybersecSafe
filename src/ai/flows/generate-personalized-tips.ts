'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized cybersecurity tips based on user role and current threat landscape.
 *
 * - generatePersonalizedTips - A function that generates personalized cybersecurity tips.
 * - PersonalizedTipsInput - The input type for the generatePersonalizedTips function.
 * - PersonalizedTipsOutput - The return type for the generatePersonalizedTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTipsInputSchema = z.object({
  role: z
    .enum(['worker', 'admin'])
    .describe('The role of the user (worker or admin).'),
  currentThreats: z
    .string()
    .describe('A description of the current cybersecurity threat landscape.'),
});
export type PersonalizedTipsInput = z.infer<typeof PersonalizedTipsInputSchema>;

const PersonalizedTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of personalized cybersecurity tips.'),
});
export type PersonalizedTipsOutput = z.infer<typeof PersonalizedTipsOutputSchema>;

export async function generatePersonalizedTips(
  input: PersonalizedTipsInput
): Promise<PersonalizedTipsOutput> {
  return generatePersonalizedTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedTipsPrompt',
  input: {schema: PersonalizedTipsInputSchema},
  output: {schema: PersonalizedTipsOutputSchema},
  prompt: `You are a cybersecurity expert. Generate a list of personalized cybersecurity tips for a user based on their role and the current threat landscape.

Role: {{{role}}}
Current Threats: {{{currentThreats}}}

Tips:`, // Use triple curly braces for Handlebars
});

const generatePersonalizedTipsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedTipsFlow',
    inputSchema: PersonalizedTipsInputSchema,
    outputSchema: PersonalizedTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
