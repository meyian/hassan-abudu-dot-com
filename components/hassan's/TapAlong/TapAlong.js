// Styles for the tap along box

import { css, cx } from "@emotion/css";
import { useCallback, useEffect, useRef, useState } from "react";

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
  style,
  width = 200,
  borderColor = "gray",
  textOpacityMiss = "#aaa",
  textOpacityHit = "#000",
  bpm = 60,
  countingString = "1;2;3;4",
  countingStringDelimiter = ";",
}) {
  const HALF_OPACITY = 0.1;

  const [beatCount, setBeatCount] = useState(0);
  const [fullOpacity, setFullOpacity] = useState(HALF_OPACITY);
  const [correctTaps, setCorrectTaps] = useState(0);
  const wrapperRef = useRef(null);

  const countingArray = countingString.split(countingStringDelimiter);

  const setCSSVariables = useCallback(() => {
    const animationDuration = bpmToMilliseconds(bpm);
    const animationDurationInSecs = `${animationDuration / 1000}s`;

    document.documentElement.style.setProperty("--tapalong-box-letter-spacing", `${width}px`);
    document.documentElement.style.setProperty("--tapalong-half-opacity", HALF_OPACITY);
    document.documentElement.style.setProperty("--tapalong-full-opacity", fullOpacity);
    document.documentElement.style.setProperty(
      "--tapalong-animation-duration",
      animationDurationInSecs
    );
  }, [width, bpm, fullOpacity]);

  useEffect(() => {
    setCSSVariables();

    document.addEventListener("keydown", (ev) => {
      if (ev.key === " ") {
        console.log("spacebar down");
        document.documentElement.style.setProperty("--tapalong-full-opacity", 1);
      }
    });
  }, [setCSSVariables]);

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
        ...style,
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
        {/* Do not delete this, please, I don't know why it's needed. :( */}
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
    + fade in twice
    + css vars for animation durations
    + style
      + big text
      * grey / black font
      + blue border
      * 
* tolerance + scoring
  * pass in tolerance value
  * score tolerance value 
    * on document capture spacebar
    * on click in the box
    * call the onHit

(Duration 2.5 -> 5 hours)


*/
