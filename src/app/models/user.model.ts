export interface User {
  id?: number;        // set by the backend after saving
  name: string;
  email: string;
  password?: string;  // only sent when registering, never returned
}
