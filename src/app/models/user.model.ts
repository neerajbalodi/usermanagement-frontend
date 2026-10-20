export interface User {
  id?: number;              // set by the backend after saving
  name: string;
  email: string;
  password?: string;        // only sent when registering, never returned
  photoUrl?: string | null; // Day 2: temporary link to the photo in S3 (null = no photo)
}
