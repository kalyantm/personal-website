import Layout from "~/components/Layout";
import NowCard from "./NowCard";
import { useLoaderData } from "@remix-run/react";
import { getCurrentlyListening } from "~/currently-listening";
import { ArrowRight, Droplet, Heart } from "react-feather";
import Spacer from "~/components/Spacer";
import blrImg from "../../assets/blr.jpeg";
import { getCurrentFitness } from "~/current-fitness";
import countryIcon from "../../assets/in.svg";
import FitnessRings from "~/components/common/FitnessRings";

// CHANGE THESE AS YOU NEED
const TZ = "Asia/Kolkata";
const COUNTRY = "in";

// const countryIcon = require(`../../assets/${COUNTRY}.svg`);
// import countryIcon from `../../assets/${COUNTRY}.svg`

export const loader = async () => {
  const playingResponse = await getCurrentlyListening();
  const fitnessResponse = await getCurrentFitness();
  return {
    playingResponse,
    fitnessResponse,
  };
};

const options = {
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "numeric",
  timeZone: TZ,
};

export default function Posts() {
  const { playingResponse, fitnessResponse } = useLoaderData();
  const date = new Intl.DateTimeFormat("en-US", options).format(new Date());
  console.log("data", playingResponse, fitnessResponse);
  return (
    <Layout>
      <section className="px-8">
        <h2 className="my-8 block text-center md:hidden">About Me</h2>
        <div className="relative my-16 flex flex-col rounded-lg bg-main-bg p-8 text-primary shadow-card dark:bg-grey-500">
          <img
            className="absolute left-[calc(50%-37.5px)] top-[calc(-37.5px)] rounded-full shadow-card"
            src="https://picsum.photos/75/75"
            alt=""
          />
          <span className="mt-8 text-base">
            My first real experience with software engineering was right out
            college at a startup where I worked as a junior web engineer, and I
            got hooked. I've been an avid follower of the web ecosystem,
            including React, Node, Typescript. I am also a big fan of functional
            programming, which is how I write JS. I am currently building
            proton.ai, working on improving our React Native application.
          </span>
          <span className="mt-8 text-base">
            I am a big fan of remote work. In fact, I've worked in a remote
            setting long before the pandemic. I love that I get to structure
            work around my life, and not the other way around. But my favorite
            thing about working remote has to be the ability to work from
            anywhere. I love to travel and search for incredible views and
            remote work has definitely opened up so many doors for me.
          </span>
          <span className="mt-8 text-base">
            When I'm not working, I'm usually tuned into a football game
            (#ktbffh), travelling around or just looking at random things on the
            internet.
          </span>
        </div>
      </section>
      <section className="px-8">
        <h2 className="my-8 block">Right now</h2>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-4">
          <NowCard
            type="location"
            outline="outline-location-blue"
            coverImg={blrImg}
          >
            <div className="flex flex-col">
              <p className="max-w-[240px] truncate text-xl">Bangalore, IN</p>
              <Spacer height={16} />
              <p className="font-light truncate text-sm md:max-w-[240px]">
                {date.replace(",", " • ")}
              </p>
              <img
                src={countryIcon}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          </NowCard>
          <NowCard
            type="music"
            outline="outline-spotify-green"
            coverImg={playingResponse.currentlyPlaying.albumImageUrl}
          >
            <a
              href={playingResponse.currentlyPlaying.songUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col"
            >
              <p className="truncate text-xl md:max-w-[240px]">
                {playingResponse.currentlyPlaying.title}
              </p>
              <Spacer height={16} />
              <p className="font-light truncate text-sm md:max-w-[240px]">
                {playingResponse.currentlyPlaying.artist} •{" "}
                {playingResponse.currentlyPlaying.album}
              </p>
              <Spacer height={32} />
              <span className="flex items-center">
                <p className="font-light hover:accent text-xs uppercase">
                  View song
                </p>
                <Spacer width={4} />
                <ArrowRight size={16} />
              </span>
            </a>
          </NowCard>
          <NowCard type="read" outline="outline-book-red" />
          <NowCard
            type="fitness"
            outline="outline-sc-yellow"
            coverImg={
              <FitnessRings
                move={fitnessResponse.move}
                exercise={fitnessResponse.exercise}
                heart={fitnessResponse.heart}
                step={fitnessResponse.step}
              />
            }
          >
            <span className="flex items-baseline">
              <Heart size={16} />
              <Spacer width={8} />
              <p className="text-xl">{fitnessResponse.heart}</p>
              <Spacer width={4} />
              <span className="font-light text-sm">heart points</span>
            </span>
            <Spacer height={8} />
            <span className="flex items-baseline">
              <Heart size={16} />
              <Spacer width={8} />
              <p className="text-xl">{fitnessResponse.step}</p>
              <Spacer width={4} />
              <span className="font-light text-sm">steps</span>
            </span>
            <Spacer height={8} />
            <span className="flex items-baseline">
              <Droplet size={16} />
              <Spacer width={8} />
              <p className="text-xl">{parseInt(fitnessResponse.move, 10)}</p>
              <Spacer width={4} />
              <span className="font-light text-sm">kCal burned</span>
            </span>
          </NowCard>
        </div>
      </section>
    </Layout>
  );
}
