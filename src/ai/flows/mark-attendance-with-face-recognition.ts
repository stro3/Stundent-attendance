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

Analyze the provided photo and identify the students present. Provide a list of the students who are present in the 'attendedStudents' field.
If there are any unidentified faces, list them in the 'unidentifiedStudents' field. Only use names of known students.

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
