import React, { useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";
import { CreateProblem } from "./CreateProblem";
import { QuizControls } from "./QuizControls";
import { Link } from "react-router-dom";

export const Admin = () => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [quizId, setQuizId] = useState("");

  useEffect(() => {
    const socket = io("http://127.0.0.1:3000");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("joinAdmin", {
        password: "ADMIN_PASSWORD",
      });
    });

    socket.on("quizCreated", (data) => {
      setQuizId(data.quizId);
    });
    
  }, []);

  if (quizId && socket) {
    return (
      <div className="md:flex flex-row">
        <CreateProblem quizId={quizId} socket={socket} />
        <QuizControls socket={socket} quizId={quizId} />
      </div>
    );
  }
  return (
    <>
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2 text-slate-600">
            Create New Room
          </h1>
          <p className="text-gray-600">
            Participants would be able to join using it
          </p>
        </div>
        <div className="flex flex-col">
          <button
            className="bg-purple-600 text-white py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
            style={{ fontSize: "1rem" }}
            onClick={(e: React.FormEvent<HTMLButtonElement>) => {
              e.preventDefault();
              if (!socket) {
                throw new Error("Socket not initilize properly");
              }
              socket.emit("createQuiz", {});
            }}
          >
            Create Room
          </button>
          <Link
            to="/"
            className="mt-5 bg-purple-600 text-white py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
          >
            Go Back
          </Link>
        </div>
      </div>
    </>
  );
};
