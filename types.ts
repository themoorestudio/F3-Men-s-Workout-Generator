export enum WorkoutType {
  BODYWEIGHT = 'Body Weight Only',
  CINDER_BLOCK = 'Cinder Block Incorporated',
  FLEXIBILITY = 'Flexibility-Focused',
  CARDIO = 'Cardio-Heavy',
  HIIT = 'High-Intensity Interval Training (HIIT)',
  MIXED = 'Mixed / Other',
}

export interface HistoricalWorkout {
  id: string;
  timestamp: number;
  types: WorkoutType[];
  workout: string;
}
