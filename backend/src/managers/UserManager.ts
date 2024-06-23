import { Socket } from "socket.io";
import {
  createProblem,
  createQuiz,
  getQuiz,
  updateQuizState,
  addQuizParticipants,
  getLeaderboard,
  updateProblemTime,
  updateUserPoints,
  updateCurrentProblem,
  getDbProblem
} from "../db";

import { Problem, QuizState } from "../types";
import { IoManager } from "./IoManager";

const ADMIN_PASSWORD = "ADMIN_PASSWORD";
const TIMER = 1000 * 1 * 5;

async function getProblem(quiz: any) {
  try {
    if (quiz.currentProblem >= quiz.problems.length) {
      updateQuizState(quiz.id, QuizState.END);
      IoManager.getIo().to(String(quiz.id)).emit("QUIZ_END", {});
      return;
    }
    console.log("updating quiz state");
    updateQuizState(quiz.id, QuizState.QUESTION);
    IoManager.getIo().to(String(quiz.id)).emit("problem", {
      state: QuizState.QUESTION,
      problem: quiz.problems[quiz.currentProblem],
    })
    console.log("currentProblem", quiz.problems[quiz.currentProblem]);
    await updateProblemTime(quiz.problems[quiz.currentProblem].id);
    setTimeout(async () => {
      await getLeaderboardData(quiz);
    }, TIMER)
  } catch (error) {
    console.error("Error in getProblem:", error);
  }
}

async function startQuiz(quizId: number) {
  try {
    console.log("inside startQUiz", quizId);
    const quiz = await getQuiz(quizId);
    if (!quiz) {
      return new Error("Invalid QUiz id");
    }
    await getProblem(quiz);
  } catch (error) {
    console.error("Error in startQuiz:", error);
  }
}

async function getLeaderboardData(quiz: any) {
  try {
    const nextProblem = quiz.currentProblem++;
    console.log("next problem", nextProblem);
    await updateCurrentProblem(quiz.id, nextProblem);
    await updateQuizState(quiz.id, QuizState.LEADERBOARD);
    const data = await getLeaderboard(quiz.id);
    IoManager.getIo().to(String(quiz.id)).emit("leaderboard", {
      state: QuizState.LEADERBOARD,
      data: data,
    });
    setTimeout(async () => {
      await getProblem(quiz)
    }, TIMER)
  } catch (error) {
    console.error("Error in getLeaderboardData:", error);
  }
}

async function getStateData(quizId: number) {
  try {
    const quiz = await getQuiz(quizId);
    if (!quiz) {
      throw new Error("Not a valid quiz");
    }
    if (quiz.state === QuizState.NOT_STARTED) {
      return {
        state: quiz.state,
        msg: "Quiz yet to be started!",
      };
    } else if (quiz.state === QuizState.END) {
      return {
        state: quiz.state,
        msg: "Quiz Has Ended!",
      };
    } else if (quiz.state === QuizState.QUESTION) {
      const problem = quiz.problems[quiz.currentProblem];
      return {
        state: quiz.state,
        problem: problem,
      };
    } else {
      const data = await getLeaderboard(quiz.id);
      return {
        state: quiz.state,
        data: data,
      };
    }
  } catch (error) {
    console.error("Error in getStateData:", error);
  }
}

export class UserManager {
  addUser(socket: Socket) {
    this.createHandlers(socket);
  }

  private createHandlers(socket: Socket) {
    socket.on(
      "join",
      async ({ quizId, name }: { name: string; quizId: string }) => {
        const participant = await addQuizParticipants({
          name: name,
          quizId: Number(quizId),
          points: 0,
        });
        socket.join(quizId);
        socket.emit("init", {
          userId: participant.id,
          stateData: await getStateData(Number(quizId)),
        });
      }
    );

    socket.on("joinAdmin", async ({ password }: { password: string }) => {
      if (password !== ADMIN_PASSWORD) {
        return;
      }

      socket.on("createQuiz", async () => {
        const quiz = await createQuiz();
        if (!quiz) {
          return;
        }
        socket.emit("quizCreated", {
          quizId: quiz.id,
        });
      });

      socket.on("createProblem", async({quizId, problemData}: {quizId: string, problemData: Problem}) => {
        await createProblem(Number(quizId), problemData);
      })

      socket.on("startQuiz", async ({ quizId }: { quizId: string }) => {
        console.log("quizStarted,", quizId)
        await startQuiz(Number(quizId));
      });

      socket.on("next", async (data) => {});
    });

    socket.on("submit", async ({ userId, problemId, selected }) => {
      const problem = await getDbProblem(Number(problemId));
      if (problem && problem.correctOption === selected) {
        const points = Math.max(Math.floor(1000 - (500 * (new Date().getTime() - problem.startTime) / (20 * 1000))), 0);
        await updateUserPoints(problem.quizId, Number(userId), points);
      }
    });
  }
}
