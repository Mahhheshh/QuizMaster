import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LeaderBoard, LeaderBoardData } from "./leaderboard/LeaderBoard";
import { Quiz } from "./Quiz";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";

export const User = () => {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  if (!submitted) {
    return (
      <>
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2 text-slate-600">
              Enter the code to join
            </h1>
            <p className="text-gray-600">It’s on the screen in front of you</p>
          </div>
          <div className="mb-8">
            <input
              className="text-center w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
              placeholder="1234 5678"
              style={{ fontSize: "1rem" }}
              type="text"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
            <br /> <br />
            <input
              className="text-center w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
              placeholder="Your name"
              style={{ fontSize: "1rem" }}
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col">
            <button
              className="bg-purple-600 text-white w-64 py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
              style={{ fontSize: "1rem" }}
              onClick={() => {
                setSubmitted(true);
              }}
            >
              Join
            </button>
            <Link
              to="/"
              className="mt-5 bg-purple-600 text-white w-64 py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
            >
              Go Back
            </Link>
          </div>
        </div>
      </>
    );
  }

  return <UserLoggedin code={code} name={name} />;
};

export const UserLoggedin = ({
  name,
  code,
}: {
  name: string;
  code: string;
}) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const quizId = code;
  const [currentState, setCurrentState] = useState("NOT_STARTED");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderBoardData[]>([]);
  const [userId, setUserId] = useState("12345");

  useEffect(() => {
    const socket = io("http://127.0.0.1:3001");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("join", {
        quizId,
        name,
      });
    });

    socket.on("init", ({ userId, stateData }) => {
      setUserId(String(userId));

      if (stateData.state == "LEADERBOARD") {
        setLeaderboard(stateData.data);
      }

      if (stateData.state == "QUESTION") {
        setCurrentQuestion(stateData.problem);
      }

      setCurrentState(stateData.state);
    });

    socket.on("leaderboard", ({state, data}) => {
      setCurrentState(state);
      setLeaderboard(data);
    });

    socket.on("problem", ({state, problem}) => {
      setCurrentState(state);
      setCurrentQuestion(problem);
    });

    socket.on("QUIZ_END", (data) => {
      console.log(data);
      setCurrentState("END");
    });

  }, []);


  if (currentState === "NOT_STARTED") {
    return <div className="text-slate-600">This quiz hasnt started yet</div>;
  }

  if (currentState === "QUESTION" && currentQuestion) {
    if (!socket) {
      throw new Error("Unable to Establish connection");
    }
    return (
      <Quiz
        quizId={quizId}
        userId={userId}
        problemId={currentQuestion.id}
        quizData={{
        title: currentQuestion.title,
          description: currentQuestion.description,
          options: currentQuestion.options,
        }}
        socket={socket}
      />
    );
  }

  if (currentState === "LEADERBOARD") {
    return <LeaderBoard leaderboardData={leaderboard} />;
  }

  return <div className="text-slate-600">Quiz has ended</div>;
};
