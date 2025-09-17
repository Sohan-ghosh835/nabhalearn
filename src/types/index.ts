// User types
export interface User {
  id: string;
  type: 'student' | 'teacher';
  name: string;
  email?: string;
}

// File transfer types
export interface TransferFile {
  id: string;
  name: string;
  size: number;
  type: 'video' | 'document' | 'image';
  path: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'teacher' | 'student';
  isConnected: boolean;
}

// Progress tracking types
export interface StudentProgress {
  lessonId: string;
  watchedDuration: number;
  completed: boolean;
  lastWatched: Date;
  quizScore?: number;
}

export interface TeacherDashboard {
  totalStudents: number;
  activeStudents: number;
  strugglingStudents: string[];
  popularLessons: string[];
  averageProgress: number;
}


