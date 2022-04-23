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
  const newIndex = getCyclicalArrayIndex(beatCount + 2, countingArray.length);

  newDiv.append(countingArray[newIndex]);
  newDiv.classList.add("beat-count", "next");

  wrapperRef.current.append(newDiv);
  newDiv.classList.add("fade-in");

  setTimeout(() => {
    newDiv.classList.remove("fade-in");
  }, animationDuration);
};

const removeOldCountDiv = ({ wrapperRef, animationDuration }) => {
  // not the first count
  if (wrapperRef.current.children.length >= 2) {
    const elemToRemove = wrapperRef.current.children[0];

    elemToRemove.classList.add("fade-out");

    setTimeout(() => {
      wrapperRef.current.removeChild(elemToRemove);
    }, animationDuration);
  }
};

const shiftDivs = (wrapperRef) => {
  const children = [...wrapperRef.current.children];

  for (let i = 1; i < children.length; i++) {
    if (children[i].classList.contains("shift-left")) {
      children[i].classList.add("shift-left-twice");
      children[i].classList.remove("shift-left");
    } else {
      children[i].classList.add("shift-left");
    }
  }
};

export default function TapAlong({
  width = 200,
  color,
  bpm = 60,
  countingString = "1;2;3;4",
  countingStringDelimiter = ";",
}) {
  const [beatCount, setBeatCount] = useState(0);
  const [correctTaps, setCorrectTaps] = useState(0);
  const wrapperRef = useRef(null);

  const countingArray = countingString.split(countingStringDelimiter);

  useEffect(() => {
    document.documentElement.style.setProperty("--tapalong-box-letter-spacing-pos", `${width}px`);
    document.documentElement.style.setProperty("--tapalong-box-letter-spacing-neg", `-${width}px`);
    document.documentElement.style.setProperty(
      "--tapalong-box-letter-spacing-pos-twice",
      `${width * 2}px`
    );
    document.documentElement.style.setProperty(
      "--tapalong-box-letter-spacing-neg-twice",
      `-${width * 2}px`
    );
  }, [width]);

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

  let borderColor = color || "gray";
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
        <div className="beat-count prev"></div>
        <div className="beat-count current">
          <h1 className="text-xl font-bold">{countingArray[0]}</h1>
        </div>
        <div className="beat-count next">
          <h1 className="text-xl font-bold">{countingArray[1]}</h1>
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
