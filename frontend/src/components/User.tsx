import { useEffect, useState } from "react";
import { io } from "socket.io-client";
// import { CurrentQuestion } from "./CurrentQuestion";
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
  const roomId = code;
  const [currentState, setCurrentState] = useState("not_started");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderBoardData[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const socket = io("http://127.0.0.1:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join", {
        roomId,
        name,
      });
    });

    socket.on("init", ({ userId, state }) => {
      setUserId(userId);

      if (state.leaderboard) {
        setLeaderboard(state.leaderboard);
      }

      if (state.problem) {
        setCurrentQuestion(state.problem);
      }

      setCurrentState(state.type);
    });

    socket.on("leaderboard", (data) => {
      setCurrentState("leaderboard");
      console.log(data);
      setLeaderboard(data.leaderboard);
    });
    socket.on("problem", (data) => {
      setCurrentState("question");
      setCurrentQuestion(data.problem);
    });
  }, []);

  if (currentState === "not_started") {
    return <div className="text-slate-600">This quiz hasnt started yet</div>;
  }

  if (currentState === "question") {
    if (!socket) {
      throw new Error("Unable to Establish connection");
    }
    return (
      <Quiz
        roomId={roomId}
        userId={userId}
        problemId={currentQuestion.id}
        quizData={{
          title: currentQuestion.description,
          options: currentQuestion.options,
        }}
        socket={socket}
      />
    );
  }

  if (currentState === "leaderboard") {
    return <LeaderBoard leaderboardData={leaderboard} />;
  }

  return (
    <div className="text-slate-600">
      Quiz has ended
      {currentState}
    </div>
  );
};
