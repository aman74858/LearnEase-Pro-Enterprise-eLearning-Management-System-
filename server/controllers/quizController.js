import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getCourseQuizzes = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ course: courseId }).populate('lesson', 'title');

    // Also get student's previous attempts for these quizzes
    const attempts = await QuizAttempt.find({
      student: req.user.id,
      course: courseId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      quizzes,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create quiz for course
// @route   POST /api/quizzes
// @access  Private (Instructor, Admin)
export const createQuiz = async (req, res, next) => {
  try {
    const { courseId, lessonId, title, description, passingScorePercentage, questions } = req.body;

    const quiz = await Quiz.create({
      course: courseId,
      lesson: lessonId || undefined,
      title,
      description,
      passingScorePercentage: Number(passingScorePercentage) || 70,
      questions,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully.',
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/:quizId/attempt
// @access  Private (Student)
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { userAnswers } = req.body; // array of { questionIndex, selectedOptionIndex }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    let earnedPoints = 0;
    let totalPoints = 0;
    const evaluatedAnswers = [];

    quiz.questions.forEach((q, idx) => {
      const qPoints = q.points || 10;
      totalPoints += qPoints;

      const userAns = userAnswers.find((a) => a.questionIndex === idx);
      const isCorrect = userAns && userAns.selectedOptionIndex === q.correctOptionIndex;

      if (isCorrect) {
        earnedPoints += qPoints;
      }

      evaluatedAnswers.push({
        questionIndex: idx,
        selectedOptionIndex: userAns ? userAns.selectedOptionIndex : null,
        isCorrect: Boolean(isCorrect),
      });
    });

    const scorePercentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
    const passed = scorePercentage >= (quiz.passingScorePercentage || 70);

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user.id,
      course: quiz.course,
      score: earnedPoints,
      totalPoints,
      scorePercentage,
      passed,
      answers: evaluatedAnswers,
    });

    res.status(200).json({
      success: true,
      message: passed ? '🎉 Congratulations! You passed the quiz!' : 'Keep practicing! You can retake the quiz.',
      attempt,
      correctAnswers: quiz.questions.map((q) => ({
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
      })),
    });
  } catch (error) {
    next(error);
  }
};

