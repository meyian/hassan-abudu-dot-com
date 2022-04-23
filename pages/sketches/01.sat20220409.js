import SongPlayer from "@/components/hassan's/SongPlayer";
import React from "react";

const hash = (string) => {
  return string
    .split("")
    .map((char) => char.charCodeAt(0))
    .reduce((prev, curr) => prev + curr);
};

const rawText = [
  `…smells like what the waitress’s bath soap might smell like. As she walks away and I imagine we’re roommates. Holding my nose over the espresso cup is like I walked into the steamy bathroom she just left; a nod of acknowledgment as we pass each other.`,
  `The mirror is too misted over to tell if my mouth is open or closed, but I brush my yellow teeth in it anyways. I know they’re yellow because they put fluorine in the the water in the Middle Eastern country I grew up in and no amount of brushing will ever change that. It gives me an aggressive smile. “Aren’t we having great fun?” my teeth yell out to you once I bare them in a smile, and the answer must be yes.`,
  `They go well with pink polo shirts. My nickname in high school was Ye, actually. (Kanye West; long story if this confuses you.) I wonder if the waitress will ever call me that. Some of my friends still do.`,
  `I sip at the espresso. Flavor-wise, I’m not sure what’s there, so I keep sipping. Now the tiny espresso cup is half empty and I feel like I’ve only moistened my lips with it. Aside from the floral perfume notes I was huffing when it was full, what it tastes like is a memory I forget even with the sip still in my mouth. I swallow, and look down at a remaining tablespoon or so of drink. It’s cold now; does this thing only taste of anything when it’s hot? What a strange superpower for a food to have. Reminds me of the superpower I’d pick if I could have any I liked; I’ll tell you about it later.`,
  `I walk to the counter with my wallet out and the waitress understands my meaning. “You really shouldn’t be handling money if you’re also handling the food,” I think, but say nothing. It’s not her fault because the guy I ordered my espresso from has disappeared. Poof! Nowhere. She starts fiddling with the register screen. Should I ask her for her name? And you know, when she responds, I could say, “Call me Ye.”  She’ll probably take me seriously because she’s on the wrong socioeconomic rung in Ghana to be familiar with American hip-hop — the kids out here without passports listen to the local kings and queens of the radio. And without a passport, how exactly would she stumble across a “Mercy.1” or a “Gold digger”? `,
  `“Ye.” Lol — only one other dude calls me that. `,
];

const songFile1Acoustic = "https://meyian-public-storage.s3.amazonaws.com/rich_girls.acoustic.mp3";
const songFile2Electric = "https://meyian-public-storage.s3.amazonaws.com/rich_girls.electric.mp3";
const songFileTest = "https://meyian-public-storage.s3.amazonaws.com/Cassio+Kohl+-+Broken.mp3";

export default function Sat20220409() {
  return (
    <div>
      <h1 className="text-xl font-bold">Sketch #1: Fri, 8 Apr, 2022</h1>
      <SongPlayer songFile={songFile2Electric} />
      {rawText.map((text) => (
        <p key={hash(text)} className="mt-4">
          {text}
        </p>
      ))}
    </div>
  );
}
