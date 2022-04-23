export default function AboutSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
      <div className="aspect-h-4 aspect-w-3 rounded-lg bg-main-bg">
        <img
          className="mx-auto rounded-full md:mx-0"
          src="https://picsum.photos/350/350"
          alt=""
        />
      </div>
      <div className="col-span-2 mt-8 flex flex-col justify-around md:mt-0">
        <h1 className="text-3xl">
          👋 Hi, I'm Kalyan. I try to solve interesting problems using software.
        </h1>
        <span className="text-base">
          When I'm not writing code, you can find me sampling various kinds of
          coffee, enjoying a game of football or searching for the next
          incredible view in my travels.
        </span>
      </div>
    </div>
  );
}
