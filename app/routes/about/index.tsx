import Layout from "~/components/Layout";
import pp from "~/assets/pp-final.png";

export default function Posts() {
  return (
    <Layout hideIllustration={false}>
      <section className="px-8">
        <h2 className="my-8 block text-left md:my-0 ">About Me</h2>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8">
          <div className="relative col-span-2 flex flex-col text-primary">
            <span className="mt-8 text-base">
              My first real experience with software engineering was right out
              college at a startup where I worked as a junior web engineer, and
              I got hooked. I've been an avid follower of the web ecosystem,
              including React, Node, Typescript. I am also a big fan of
              functional programming, which is how I write JS. I am currently
              building
              <a
                href="https://www.proton.ai"
                className="font-bold text-accent"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                proton.ai
              </a>
              , working on improving our react native application.
            </span>
            <span className="mt-8 text-base">
              I am a big fan of remote work. In fact, I've worked in a remote
              setting long before the pandemic. I love that I get to structure
              work around my life, and not the other way around. But my favorite
              thing about working remote has to be the ability to work from
              anywhere. I love to travel and am in the constant pursuit of the
              next incredible view
            </span>
            <span className="mt-8 text-base">
              When I'm not working, I'm usually tuned into a football game
              <a
                href="https://twitter.com/ChelseaFC"
                className="font-bold text-accent"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                (#ktbffh)
              </a>
              , travelling around or just looking at random things on the
              internet.
            </span>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <img src={pp} className="rounded-lg" alt="profile pic" />
          </div>
        </div>
      </section>
      {/* <section className="my-16 px-8">
        <h2 className="block">Right now</h2>
        <div className="my-8">
          <a href="https://en.wikipedia.org/wiki/Bangalore">
            <div className="flex items-center space-x-2">
              <MapPin />
              <span className="text-xs font-bold uppercase">Currently in</span>
            </div>
            <Spacer height={4} />
            <span>Bangalore • India</span>
          </a>
          <Spacer height={32} />
          <div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--color-text)"
                className="rounded-full"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2c5.55 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2c-4.395 0-8 3.605-8 8s3.605 8 8 8 8-3.605 8-8c0-4.414-3.573-8-8-8zm3.75 12.65c-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85-.2.3-.55.4-.85.2zm1-2.7c-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1s-.7.5-1.05.25zM6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25C14.7 9 9.35 8.8 6.3 9.75z" />
              </svg>
              <span className="text-xs font-bold uppercase">
                Currently jamming to
              </span>
            </div>
            <Spacer height={4} />
            {playingResponse.currentlyPlaying.isPlaying ? (
              <a href={playingResponse.currentlyPlaying.songUrl}>
                <span>
                  {playingResponse.currentlyPlaying.title} •{" "}
                  {playingResponse.currentlyPlaying.artist}
                </span>
              </a>
            ) : (
              <span>Nothing, it's really quiet right now.</span>
            )}
          </div>
          <Spacer height={32} />
          <a href="https://www.goodreads.com/book/show/39286958-measure-what-matters">
            <div className="flex items-center space-x-2">
              <Book />
              <span className="text-xs font-bold uppercase">
                Currenting reading
              </span>
            </div>
            <Spacer height={4} />
            <span>
              Measure What Matters: OKRs: The Simple Idea that Drives 10x Growth
              • John Doerr
            </span>
          </a>
          <Spacer height={32} />
          <a href="https://www.netflix.com/title/80057281">
            <div className="flex items-center space-x-2">
              <Film />
              <span className="text-xs font-bold uppercase">
                Currenting watching
              </span>
            </div>
            <Spacer height={4} />
            <span>Stranger Things • Season 4</span>
          </a>
        </div>
      </section> */}
    </Layout>
  );
}
