import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

const ADMIN_PASSWORD = "ADMIN_PASSWORD";

function generateRandomFloatInRange(min = 1000, max = 9999) {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export class UserManager {
  private quizManager;

  constructor() {
    this.quizManager = new QuizManager
  }

  addUser(socket: Socket) {
    this.createHandlers(socket);
  }

  private createHandlers(socket: Socket) {
    socket.on("join", (data) => {
      const userId = this.quizManager.addUser(data.quizId, data.name);
      socket.emit("init", {
        userId,
        state: this.quizManager.getCurrentState(data.quizId),
      });
      socket.join(data.quizId);
    });

    socket.on("joinAdmin", (data) => {
      if (data.password !== ADMIN_PASSWORD) {
        return;
      }

      socket.on("createQuiz", () => {
        const quizId = generateRandomFloatInRange();
        const quiz = this.quizManager.addQuiz(quizId);
        socket.emit("quizCreated", {
          quizId: quizId
        });
      });

      socket.on("createProblem", (data) => {
        console.log(data);
        this.quizManager.addProblem(data.quizId, data.problem);
      });

      socket.on("next", (data) => {
        this.quizManager.next(data.quizId);
      });

      socket.on("startQuiz", (data) => {
        console.log("start quiz!")
        this.quizManager.start(data.quizId);
      });
    });

    socket.on("submit", (data) => {
      const userId = data.userId;
      const problemId = data.problemId;
      const submission = data.submission;
      const quizId = data.quizId;
      if (
        submission != 0 &&
        submission != 1 &&
        submission != 2 &&
        submission != 3
      ) {
        console.error("issue while getting input " + submission);
        return;
      }
      console.log("submitting");
      this.quizManager.submit(userId, quizId, problemId, submission);
    });
  }
}
