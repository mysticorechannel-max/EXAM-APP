export interface SubmissionAnswer {
    questionId: string;
    answerId: string;
}

export interface SubmitExamRequest {
    examId: string;
    answers: SubmissionAnswer[];
    startedAt: string; // ISO date string
}

export interface Submission {
    id: string;
    userId: string;
    examId: string;
    examTitle: string;
    exam: { id: string; title: string; duration: number };
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    startedAt: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface AnalyticsItem {
    questionId: string;
    questionText: string;
    selectedAnswer: { id: string; text: string } | null;
    isCorrect: boolean;
    correctAnswer: { id: string; text: string };
}

export interface SubmitExamResponse {
    status: boolean;
    code: number;
    payload: {
        submission: Submission;
        analytics: AnalyticsItem[];
    };
}
