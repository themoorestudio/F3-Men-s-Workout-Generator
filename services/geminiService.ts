import { GoogleGenAI } from "@google/genai";
import { WorkoutType } from '../types';

const generatePrompt = (workoutTypes: WorkoutType[]): string => {
  return `
You are an F3 Q, an expert in creating F3-style workouts. Your task is to generate a complete, 45-60 minute outdoor workout plan based on a specific set of types. Use F3 lingo like "Pax," "Q," "Mosey," and the motto "Leave no man behind, but leave no man where you found him." The output must be concise, actionable, and follow the exact structure below using Markdown for formatting headings. EVERY section is mandatory.

Workout Type(s): ${workoutTypes.join(', ')}

**Disclaimer**
You MUST start with this exact text: "This is a free, peer-led workout for men of all fitness levels. You are responsible for your own safety. Modify exercises as needed and consult a doctor if you have any health concerns. I am not a professional, and you are working out at your own risk."

**Warm-Up (5-10 minutes)**
This section is MANDATORY. List 3-5 simple warm-up exercises with repetitions in cadence (IC). Use F3 Exicon names. Example: - Side Straddle Hops x20 IC.

**The Thang (Main Workout, 20-30 minutes)**
This is the main part. Create a circuit, sequence, or set of intervals that combines elements from all requested workout types: ${workoutTypes.join(', ')}. The workout must consist of AT LEAST THREE distinct sets or rounds. Use F3 Exicon names for exercises (e.g., Merkins for push-ups).
- If 'Body Weight Only' is selected: Focus on exercises like Merkins, Squats, Lunges, and Planks.
- If 'Cinder Block Incorporated' is selected: Include exercises like Cinder Block Swings, Overhead Press, Goblet Squats, and carries.
- If 'Flexibility-Focused' is selected: Incorporate dynamic stretches, yoga-inspired poses, and F3 exercises like Good Mornings.
- If 'Cardio-Heavy' is selected: Emphasize running, moseys, sprints, high knees, and butt kickers between exercise stations.
- If 'High-Intensity Interval Training (HIIT)' is selected: Structure as timed intervals, like 45 seconds of work followed by 15 seconds of rest, using exercises like Burpees and Sprints.
- If 'Mixed / Other' is selected: Combine bodyweight exercises with the use of common park features like benches (for dips or step-ups) and pull-up bars.
Provide clear instructions in a list format.

**6 Minutes of Mary (Core Finisher, 5-6 minutes)**
This section is MANDATORY. List 4-6 core/ab exercises. This can be timed or rep-based. Use F3 Exicon names like LBCs (Little Baby Crunches), Flutter Kicks, American Hammers.

**Circle of Trust (COT)**
This section is MANDATORY. Provide one short, non-religious, inclusive motivational thought or quote about perseverance, community, or personal growth.
`;
};

export const generateF3Workout = async (workoutTypes: WorkoutType[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = generatePrompt(workoutTypes);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating workout:", error);
    throw new Error("Failed to generate workout. Please try again.");
  }
};