'use server';
/**
 * @fileOverview Marks student attendance using facial recognition. 
 *
 * - markAttendanceWithFaceRecognition - A function that handles the attendance marking process.
 * - MarkAttendanceInput - The input type for the markAttendanceWithFaceRecognition function.
 * - MarkAttendanceOutput - The return type for the markAttendanceWithFaceRecognition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarkAttendanceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the students entering the classroom, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  studentRoster: z.array(z.string()).describe("A list of all student names in the class.")
});
export type MarkAttendanceInput = z.infer<typeof MarkAttendanceInputSchema>;

const MarkAttendanceOutputSchema = z.object({
  attendedStudents: z.array(z.string()).describe('List of student names who are present in the photo.'),
  unidentifiedStudents: z.array(z.string()).describe('List of unidentified faces in the photo.'),
});
export type MarkAttendanceOutput = z.infer<typeof MarkAttendanceOutputSchema>;

export async function markAttendanceWithFaceRecognition(input: MarkAttendanceInput): Promise<MarkAttendanceOutput> {
  return markAttendanceWithFaceRecognitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'markAttendanceWithFaceRecognitionPrompt',
  input: {schema: MarkAttendanceInputSchema},
  output: {schema: MarkAttendanceOutputSchema},
  prompt: `You are an AI assistant that identifies students in a classroom photo and marks their attendance.

The official student roster for this class is:
{{#each studentRoster}}
- {{{this}}}
{{/each}}

Analyze the provided photo. Identify which students from the roster are present in the photo.

- In the 'attendedStudents' field, list only the names of students who are on the roster and are clearly visible in the photo.
- If you see faces that you cannot match to a name on the roster, describe them briefly in the 'unidentifiedStudents' field (e.g., "Person in red shirt", "Girl with pigtails"). Do not guess names for unidentified people.

Photo: {{media url=photoDataUri}}`,
});

const markAttendanceWithFaceRecognitionFlow = ai.defineFlow(
  {
    name: 'markAttendanceWithFaceRecognitionFlow',
    inputSchema: MarkAttendanceInputSchema,
    outputSchema: MarkAttendanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
