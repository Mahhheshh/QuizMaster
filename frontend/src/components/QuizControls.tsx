import { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

export const QuizControls = ({
  socket,
  quizId,
}: {
  socket: Socket;
  quizId: string;
}) => {
  const location = useLocation();

  return (
    <div className="rounded-lg shadow-xl px-4 py-6 lg:mx-5 mt-5">
      <div className="text-slate-600 flex flex-col">
        <h2 className="text-xl font-medium mb-2">Quiz Controls</h2>
        <p className="text-sm">RoomId</p>
        <div className="p-4 mb-2 outline-purple-300 focus-within:outline rounded-md border">
          {quizId}
        </div>
        {location.pathname === "/createQuiz" ? (
          <button
            className="bg-purple-600 text-white py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50 mb-5"
            style={{ fontSize: "1rem" }}
            onClick={(e: React.FormEvent<HTMLButtonElement>) => {
              e.preventDefault();
              socket.emit("startQuiz", {
                quizId,
              });
            }}
          >
            Start Quiz
          </button>
        ) : (
          <button
            className="bg-purple-600 text-white py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50 mb-5"
            onClick={() => {
              socket.emit("next", {
                quizId,
              });
            }}
          >
            Next problem
          </button>
        )}
      </div>
    </div>
  );
};
