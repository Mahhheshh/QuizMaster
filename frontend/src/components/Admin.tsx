import React, { useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";
import { CreateProblem } from "./CreateProblem";
import { QuizControls } from "./QuizControls";
import { Link } from "react-router-dom";

export const Admin = () => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [quizId, setQuizId] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const socket = io("http://127.0.0.1:3000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("joinAdmin", {
        password: "ADMIN_PASSWORD",
      });
    });
  }, []);

  if (quizId && socket) {
    return (
      <div className="md:flex flex-row">
        <CreateProblem roomId={quizId} socket={socket} />
        <QuizControls socket={socket} roomId={roomId} />
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
        <div className="mb-8">
          <input
            className="text-center w-full p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
            placeholder="1234 5678"
            style={{ fontSize: "1rem" }}
            type="text"
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          <br />
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
              socket.emit("createQuiz", {
                roomId,
              });
              setQuizId(roomId);
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
