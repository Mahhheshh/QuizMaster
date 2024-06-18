import Card from "./Card";

export type LeaderBoardData = {
  points: number;
  name: string;
  image: string;
};

export function LeaderBoard({
  leaderboardData,
}: {
  leaderboardData: LeaderBoardData[];
}) {
  return (
    <div className="bg-opacity-20 bg-white backdrop-blur-5 border border-opacity-30 border-solid border-white p-6 rounded-lg shadow-xl">
      <h1 className="text-2xl text-slate-600 text-center my-4">
        Leaderboard Results 🚀
      </h1>
      <div className="">
        {leaderboardData.map((el, index) => (
          <div className=" flex justify-center">
            <Card
              key={index*el.points}
              sno={index + 1}
              name={el.name}
              points={el.points}
              image={el.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
