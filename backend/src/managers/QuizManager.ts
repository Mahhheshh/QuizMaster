import { AllowedSubmissions, Quiz } from "../Quiz";
let globalProblemId = 0;

export class QuizManager {
    private quizes: Quiz[];
    
    constructor() {
        this.quizes = [];
    }

    public start(quizId: string) {
        console.log(`QUizManager: start quiz`)
        const quiz = this.getQuiz(quizId);
        console.log(`quiz: ${quiz}`)
        if (!quiz) {
            return;
        }
        quiz.start();
    }

    public addProblem(quizId: string, problem: {
        title: string;
        description: string;
        image?: string;
        options: {
            id: number;
            title: string;
        }[];
        answer: AllowedSubmissions;
    }) {
        const quiz = this.getQuiz(quizId);
        if(!quiz) {
            return;
        }
        quiz.addProblem({
            ...problem,
            id: (globalProblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: []
        });
    }
    
    public next(quizId: string) {
        const quiz = this.getQuiz(quizId);
        if(!quiz) {
            return;
        }
        quiz.next();
    }

    addUser(quizId: string, name: string) {
        return this.getQuiz(quizId)?.addUser(name);
    }

    submit(userId: string, quizId: string, problemId: string, submission: 0 | 1 | 2 | 3) {
        this.getQuiz(quizId)?.submit(userId, quizId, problemId, submission);   
    }
    
    getQuiz(quizId: string) {
        return this.quizes.find(x => x.quizId === quizId) ?? null;
    }
    
    getCurrentState(quizId: string) {
        const quiz = this.getQuiz(quizId);
        if (!quiz) {
            return null;
        }
        return quiz.getCurrentState();
    }

    addQuiz(quizId: string) {
        console.log(`quiz created: ${quizId}`);
        if (this.getQuiz(quizId)) {
            return;
        }
        const quiz = new Quiz(quizId);
        this.quizes.push(quiz);
        return quiz;
    }   
}