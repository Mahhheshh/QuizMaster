import { useState } from "react";
import { Socket } from "socket.io-client";

export function Quiz({
  quizData,
  socket,
  problemId,
  userId
}: {
  quizData: {
    title: string;
    description?: string;
    options: [{ id: number; title: string }];
  };
  socket: Socket;
  quizId: string;
  userId: string;
  problemId: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState(0);

  function handleSubmission(optionNo: number) {
    setSubmission(optionNo);
  }

  return (
    <div className="bg-gray-150 rounded-lg text-slate-600 shadow-xl px-12 py-6">
      <div className="flex flex-col min-w-64">
        <>
          <SingleQuiz
            choices={quizData.options}
            title={quizData.title}
            selected={submission}
            imageURL={""}
            setSelected={handleSubmission}
          />
          <button
            className="bg-purple-600 w-full text-white py-2 rounded-lg shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
            disabled={submitted}
            onClick={() => {
              setSubmitted(true);
              socket.emit("submit", {
                userId: userId,
                problemId,
                selected: submission
              });
            }}
          >
            Submit
          </button>
        </>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  title: string;
  choices: [{ id: number; title: string }];
  selected: number,
  imageURL?: string;
  setSelected: (optionNo: number) => void;
};
function SingleQuiz({
  title,
  choices,
  selected,
  imageURL,
  setSelected,
}: SingleQuizProps) {
  return (
    <article className="w-full space-y-5">
      <div className="my-4 text-2xl lg:text-4xl font-bold">{title}</div>
      {imageURL && <img src={imageURL} alt="" />}
      {choices.length &&
        choices.map((x, index) => {
          return (
            <div
              key={x.id}
              className={`mb-2 p-4 lg:p-6 rounded-lg lg:rounded-3xl text-left text-black 
                ${selected === index ? 'bg-purple-300 focus:outline-none' : 'hover:outline-purple-300 border hover:border'}
                transition duration-200 ease-in-out flex items-center w-full mt-4 cursor-pointer`}
              onClick={() => {
                setSelected(index);
              }}
            >
              <p className="text-center">{x.title}</p>
            </div>
          );
        })}
      <div className="flex flex-col items-start w-full"></div>
    </article>
  );
}
