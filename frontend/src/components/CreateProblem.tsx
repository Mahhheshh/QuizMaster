import { useState } from "react";
import { Socket } from "socket.io-client";

const mockOptions = [
  {
    id: 0,
    title: "",
  },
  {
    id: 1,
    title: "",
  },
  {
    id: 2,
    title: "",
  },
  {
    id: 3,
    title: "",
  }
]

export const CreateProblem = ({
  socket,
  roomId,
}: {
  socket: Socket;
  roomId: string;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState(mockOptions);

  return (
    <div className="rounded-lg text-slate-700 shadow-xl px-4 py-6">
      <h2 className="text-xl font-medium mb-4">Create Problem</h2>
      <div className="grid grid-cols-1 gap-4">
        <label htmlFor="title" className="flex items-center">
          Problem Title
        </label>
        <input
          id="title"
          className="bg-gray-300 text-center p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800 text-gray-700"
          placeholder=""
          style={{ fontSize: "1rem" }}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <label htmlFor="description" className="flex items-center">
          Description
        </label>
        <textarea
          id="description"
          className="bg-gray-300 text-center p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800 h-24 resize-none"
          style={{ fontSize: "1rem" }}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <div className="mb-4">
          <h3 className="text-base font-medium mb-2">Options</h3>
          {[0, 1, 2, 3].map((optionId) => (
            <div key={optionId} className="flex items-center mb-2">
              <input
                type="radio"
                id={`option-${optionId}`}
                checked={optionId === answer}
                onChange={() => {
                  setAnswer(optionId);
                }}
              />
              <label
                htmlFor={`option-${optionId}`}
                className="text-gray-700 ml-2"
              >
                {optionId}:
              </label>
              <input
                className="bg-gray-300 text-center p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800 ml-2"
                placeholder="Options"
                style={{ fontSize: "1rem" }}
                type="text"
                onChange={(e) => {
                  console.log(`${options}`);
                  setOptions((options) =>
                    options.map((x) => {
                      if (x.id === optionId) {
                        return {
                          ...x,
                          title: e.target.value,
                        };
                      }
                      return x;
                    })
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-purple-600 text-white py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50 w-full"
        style={{ fontSize: "1rem" }}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault();
          socket.emit("createProblem", {
            roomId,
            problem: {
              title,
              description,
              options,
              answer,
            },
          });
          setTitle("");
          setDescription("");
          setOptions(mockOptions);
          setAnswer(0);
        }}
      >
        Add problem
      </button>
    </div>
  );
};
