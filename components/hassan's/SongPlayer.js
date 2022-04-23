// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
// /** @jsx jsx */
// import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import webAudioPlayer from "web-audio-player";

let audio;

const StyledButton = styled.button`
  border-radius: 50px;
  background-color: white;
  color: black;
  border: 2px solid black;
  transition: all 0.2s;
  padding: 5px 2rem;

  &:hover {
    background-color: black;
    color: white;
  }
`;

export default function SongPlayer({ songFile }) {
  const [hasAudioFileLoaded, setHasAudioFileLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playButton = (
    <StyledButton
      onClick={() => {
        audio.play();
        setIsPlaying(true);
      }}
    >
      Play
    </StyledButton>
  );

  const pauseButton = (
    <StyledButton
      onClick={() => {
        audio.pause();
        setIsPlaying(false);
      }}
    >
      Pause
    </StyledButton>
  );

  const playOrPauseButton = isPlaying ? pauseButton : playButton;
  const loadingOrPlayOrPauseButton = hasAudioFileLoaded ? playOrPauseButton : <h1>Loading Song</h1>;

  useEffect(() => {
    audio = webAudioPlayer(songFile, { crossOrigin: "anonymous" });

    audio.on("load", () => {
      setHasAudioFileLoaded(true);
      audio.node.connect(audio.context.destination);
    });
  }, []);

  return <div>{loadingOrPlayOrPauseButton}</div>;
}
