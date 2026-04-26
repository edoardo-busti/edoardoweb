"use client";
import { Typewriter } from "react-simple-typewriter";

export default function TypeWriterWrapper() {
  return (
    <>
      {" "}
      <Typewriter
        words={["Developer", "Designer"]}
        loop
        cursor
        cursorStyle="_"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1700}
      />
    </>
  );
}
