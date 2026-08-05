export interface Exam {
    id: string;
    title: string;
    description: string;
    duration: number; // minutes
    questionsCount: number;
    diplomaId: string;
    diploma?: { id: string; title: string };
    image?: string;
    immutable?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ExamDetailsResponse {
    exam: Exam;
}
