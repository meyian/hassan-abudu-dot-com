// Styles for the tap along box

import { css, cx } from "@emotion/css";
import { useEffect, useRef, useState } from "react";

const defaultBorderStyle = {
  borderWidth: "12px",
  borderRadius: "10px",
};

const centeringStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const bpmToMilliseconds = (bpm) => {
  return (1000 * 60) / bpm;
};

const getCyclicalArrayIndex = (count, arrayLength) => {
  return count % arrayLength;
};

const addNewCountDiv = ({ wrapperRef, beatCount, countingArray, animationDuration }) => {
  const newDiv = document.createElement("div");
  const newIndex = getCyclicalArrayIndex(beatCount, countingArray.length);

  newDiv.append(countingArray[newIndex]);
  newDiv.classList.add("beat-count", "next");

  wrapperRef.current.append(newDiv);
  newDiv.classList.add("fade-in");

  setTimeout(() => {
    newDiv.classList.remove("fade-in");
  }, animationDuration);
};

const removeOldCountDiv = ({ wrapperRef, animationDuration }) => {
  const children = [...wrapperRef.current.children];
  children.forEach((child) => {
    if (child.classList.contains("prev")) {
      child.classList.add("fade-out");

      setTimeout(() => {
        child.remove();
      }, animationDuration);
    }
  });
};

const shiftDivs = (wrapperRef) => {
  const children = [...wrapperRef.current.children];

  for (let i = 1; i < children.length; i++) {
    if (children[i].classList.contains("next")) {
      children[i].classList.add("curr");
      children[i].classList.remove("next");
    } else if (children[i].classList.contains("curr")) {
      children[i].classList.add("prev");
      children[i].classList.remove("curr");
    }
  }
};

export default function TapAlong({
  width = 200,
  borderColor = "gray",
  textColorMiss = "#aaa",
  textColorHit = "#000",
  bpm = 60,
  countingString = "1;2;3;4",
  countingStringDelimiter = ";",
}) {
  const [beatCount, setBeatCount] = useState(0);
  const [correctTaps, setCorrectTaps] = useState(0);
  const wrapperRef = useRef(null);

  const countingArray = countingString.split(countingStringDelimiter);

  useEffect(() => {
    const animationDuration = bpmToMilliseconds(bpm);
    const animationDurationInSecs = `${animationDuration / 1000}s`;

    document.documentElement.style.setProperty("--tapalong-box-letter-spacing", `${width}px`);
    document.documentElement.style.setProperty("--tapalong-half-opacity", 0.3);
    document.documentElement.style.setProperty(
      "--tapalong-animation-duration",
      animationDurationInSecs
    );
  }, [width, bpm]);

  useEffect(() => {
    const animationDuration = bpmToMilliseconds(bpm);

    const intervalID = setInterval(() => {
      removeOldCountDiv({ wrapperRef, animationDuration });
      shiftDivs(wrapperRef);
      addNewCountDiv({ wrapperRef, beatCount, countingArray, animationDuration });

      setBeatCount((count) => count + 1);
    }, animationDuration);

    return () => {
      clearInterval(intervalID);
    };
  }, [beatCount, countingArray, bpm]);

  const borderStyle = { ...defaultBorderStyle, borderColor };
  const sizeStyle = { width: `${width}px`, height: `${width}px` };

  return (
    <div
      style={{
        ...sizeStyle,
        ...borderStyle,
        ...centeringStyle,
        boxSizing: "content-box",
      }}
    >
      <div
        style={{
          position: "relative",
          ...centeringStyle,
          left: 0,
          top: 0,
          width: `${width}px`,
          height: `${width}px`,
        }}
        ref={wrapperRef}
      >
        <div className="beat-count next">
          {/* <h1 className="text-xl font-bold">{countingArray[0]}</h1> */}
        </div>
      </div>
    </div>
  );
}

/*

---- Todo ----

+ Hello world
+ styleable border (dimensions)
+ border color
* tempo in bpm
  + pass in a value
  + animate the numbers
    + fade out and fade in
    + shift once, shift twice
    * fade in twice
    * css vars for animation durations
* tolerance + scoring
  * pass in tolerance value
  * score tolerance value 
    * on document capture spacebar
    * on click in the box
    * call the onHit

(Duration 2.5 -> 5 hours)


*/
