// @ts-nocheck - MedusaService
import { MedusaService } from '@medusajs/framework/utils';
import type { SubmitQuizInput, SubmitQuizResult, QuizQuestion } from '@realizah/types';

class QuizManagerService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Lesson: require('../models/lesson').default,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LessonProgress: require('../models/lesson-progress').default,
}) {
  async submitQuiz(
    enrollmentId: string,
    lessonId: string,
    data: SubmitQuizInput,
  ): Promise<SubmitQuizResult> {
    // Get lesson
    const lesson = await this.retrieveLesson(lessonId);
    if (!lesson) {
      throw new Error(`Lesson with id ${lessonId} not found`);
    }

    if (lesson.type !== 'quiz') {
      throw new Error('Lesson is not a quiz');
    }

    const questions = lesson.content.questions as QuizQuestion[];
    if (!questions || questions.length === 0) {
      throw new Error('Quiz has no questions');
    }

    // Validate answers
    const feedback: SubmitQuizResult['feedback'] = [];
    let correctAnswers = 0;

    for (const question of questions) {
      const userAnswer = data.answers[question.id];
      const isCorrect = this.checkAnswer(question, userAnswer);

      if (isCorrect) {
        correctAnswers++;
      }

      feedback.push({
        questionId: question.id,
        correct: isCorrect,
        explanation: question.explanation,
      });
    }

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70;

    // Get or create progress
    const progresses = await this.listLessonProgresses({
      enrollmentId,
      lessonId,
    });

    let progress = progresses[0];

    if (!progress) {
      progress = await this.createLessonProgresses({
        enrollmentId,
        lessonId,
        status: 'not_started',
        quizAttempts: 0,
      });
    }

    // Update progress
    await this.updateLessonProgresses(progress.id, {
      quizScore: score,
      quizAttempts: progress.quizAttempts + 1,
      status: passed ? 'completed' : 'in_progress',
      completedAt: passed ? new Date() : undefined,
    });

    return {
      score,
      passed,
      correctAnswers,
      totalQuestions: questions.length,
      feedback,
    };
  }

  private checkAnswer(question: QuizQuestion, userAnswer: string | string[]): boolean {
    const correctAnswer = question.correctAnswer;

    if (Array.isArray(correctAnswer)) {
      if (!Array.isArray(userAnswer)) {
        return false;
      }

      if (correctAnswer.length !== userAnswer.length) {
        return false;
      }

      const sortedCorrect = [...correctAnswer].sort();
      const sortedUser = [...userAnswer].sort();

      return sortedCorrect.every((val, idx) => val === sortedUser[idx]);
    }

    return correctAnswer === userAnswer;
  }

  async getQuizAttempts(enrollmentId: string, lessonId: string) {
    const progresses = await this.listLessonProgresses({
      enrollmentId,
      lessonId,
    });

    const progress = progresses[0];

    if (!progress) {
      return {
        attempts: 0,
        bestScore: null,
        lastScore: null,
        passed: false,
      };
    }

    return {
      attempts: progress.quizAttempts,
      bestScore: progress.quizScore,
      lastScore: progress.quizScore,
      passed: progress.status === 'completed',
    };
  }

  validateQuizStructure(questions: QuizQuestion[]): boolean {
    if (!Array.isArray(questions) || questions.length === 0) {
      return false;
    }

    for (const question of questions) {
      if (!question.id || !question.question || !question.type) {
        return false;
      }

      if (question.type === 'multiple_choice' && !question.options) {
        return false;
      }

      if (!question.correctAnswer) {
        return false;
      }
    }

    return true;
  }
}

export default QuizManagerService;
