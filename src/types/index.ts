export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  downloadUrl: string;
  availableResolutions: VideoResolution[];
  downloadedResolutions: VideoResolution[];
  isDownloaded: boolean;
  downloadProgress: number;
  fileSize: {
    [key in VideoResolution]: number;
  };
}

export type VideoResolution = '144p' | '240p' | '360p' | '480p' | '720p' | '1080p';

export interface DownloadSettings {
  preferredResolution: VideoResolution;
  autoDownload: boolean;
  wifiOnly: boolean;
  storageLimit: number; // in MB
}

export interface AIUpscalingSettings {
  enabled: boolean;
  targetResolution: VideoResolution;
  quality: 'fast' | 'balanced' | 'high';
}

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

