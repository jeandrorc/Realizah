/**
 * Tipos do Course Module
 */

import type { BaseEntity, Tier } from './common';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'file';

export type EnrollmentStatus = 'active' | 'completed' | 'dropped';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export type VideoProvider = 'youtube' | 'vimeo' | 's3';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuizQuestionType;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface LessonContent {
  videoUrl?: string;
  videoProvider?: VideoProvider;
  text?: string;
  questions?: QuizQuestion[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface Course extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  category: string;
  level: CourseLevel;
  duration: number;
  language: string;
  requiredTier: Tier;
  featureId?: string;
  isPublished: boolean;
  publishedAt?: Date;
  enrollmentCount: number;
  rating?: number;
  ratingCount: number;
  metadata?: Record<string, unknown>;
}

export interface CourseModule extends BaseEntity {
  courseId: string;
  title: string;
  description?: string;
  order: number;
  duration: number;
  isPublished: boolean;
  metadata?: Record<string, unknown>;
}

export interface Lesson extends BaseEntity {
  moduleId: string;
  title: string;
  description?: string;
  type: LessonType;
  content: LessonContent;
  order: number;
  duration: number;
  isPreview: boolean;
  isPublished: boolean;
  metadata?: Record<string, unknown>;
}

export interface Enrollment extends BaseEntity {
  customerId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
  lastAccessedAt?: Date;
  certificateUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface LessonProgress extends BaseEntity {
  enrollmentId: string;
  lessonId: string;
  status: ProgressStatus;
  watchedDuration?: number;
  quizScore?: number;
  quizAttempts: number;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface CourseReview extends BaseEntity {
  courseId: string;
  customerId: string;
  rating: number;
  comment?: string;
  isPublished: boolean;
}

export interface CreateCourseInput {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  category: string;
  level: CourseLevel;
  duration?: number;
  language?: string;
  requiredTier: Tier;
  featureId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCourseInput {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  level?: CourseLevel;
  duration?: number;
  requiredTier?: Tier;
  featureId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateCourseModuleInput {
  courseId: string;
  title: string;
  description?: string;
  order: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateCourseModuleInput {
  title?: string;
  description?: string;
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateLessonInput {
  moduleId: string;
  title: string;
  description?: string;
  type: LessonType;
  content: LessonContent;
  order: number;
  duration?: number;
  isPreview?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateLessonInput {
  title?: string;
  description?: string;
  type?: LessonType;
  content?: LessonContent;
  order?: number;
  duration?: number;
  isPreview?: boolean;
  metadata?: Record<string, unknown>;
}

export interface EnrollInput {
  courseId: string;
}

export interface CompleteLessonInput {
  watchedDuration?: number;
}

export interface SubmitQuizInput {
  answers: Record<string, string | string[]>;
}

export interface SubmitQuizResult {
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  feedback: Array<{
    questionId: string;
    correct: boolean;
    explanation?: string;
  }>;
}

export interface CreateReviewInput {
  courseId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}
