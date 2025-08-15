export interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  instructor?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
}