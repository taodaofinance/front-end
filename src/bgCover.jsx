import React, { useEffect, useRef } from "react";
import { ThemeContext, DARK } from "./themeContext";

import dayVidmp4 from "../daytime.mp4";
import dayVidwebm from "../daytime.webm";
import dayVidPoster from "../bg-light.jpg";

import nightVidmp4 from "../nighttime.mp4";
import nightVidwebm from "../nighttime.webm";
import nightVidPoster from "../bg-dark.jpg";

const BgCover = () => {
  const { theme } = React.useContext(ThemeContext);

  const videoElement = useRef();
  const videoOverlay = useRef();

  function resizeVid(currentVideoElement, currentVideoOverlay) {
    if (!currentVideoElement) {
      return;
    }
    if (!currentVideoOverlay) {
      return;
    }
    const fold = document.querySelector(".above-the-fold");
    currentVideoElement.style.height = `${fold.offsetHeight}px`;
    currentVideoElement.style.width = `${
      fold.offsetWidth + fold.scrollWidth
    }px`;
    currentVideoOverlay.style.height = `${fold.offsetHeight}px`;
    currentVideoOverlay.style.width = `${
      fold.offsetWidth + fold.scrollWidth
    }px`;
  }

  useEffect(() => {
    const resize = debounce(() => {
      resizeVid(videoElement.current, videoOverlay.current);
    }, 200);

    window.addEventListener("resize", resize);

    resize();

    // Hide video element if device is in low power mode
    // https://stackoverflow.com/questions/46670150/low-power-mode-detection-in-javascript-for-ios11
    videoElement?.current.addEventListener("suspend", () => {
      videoElement.current.style.opacity = 0;
    });

    videoElement?.current.addEventListener("play", () => {
      videoElement.current.style.opacity = 1;
    });

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [videoElement, videoOverlay, resizeVid]);

  useEffect(() => {
    videoElement?.current.load();
  }, [theme]);

  return (
    <>
      <div
        ref={videoOverlay}
        style={{ zIndex: "-1" }}
        className="vid-overlay bg-vid-full"
      />
      <div className="bg-vid-full bg-black bg-vid-container">
        {theme === DARK ? (
          <video
            ref={videoElement}
            poster={nightVidPoster}
            style={{ pointerEvents: "none" }}
            prefetch="true"
            className="vid transition-all opacity-0"
            loop
            autoPlay
            playsInline
            muted
          >
            <source type="video/webm" src={nightVidwebm} />
            <source type="video/mp4" src={nightVidmp4} />
            Sorry, your browser doesn't support embedded videos.
          </video>
        ) : (
          <video
            ref={videoElement}
            poster={dayVidPoster}
            style={{ pointerEvents: "none" }}
            prefetch="true"
            className="vid transition-all opacity-0"
            loop
            autoPlay
            playsInline
            muted
          >
            <source type="video/webm" src={dayVidwebm} />
            <source type="video/mp4" src={dayVidmp4} />
            Sorry, your browser doesn't support embedded videos.
          </video>
        )}
      </div>
    </>
  );
};

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export default BgCover;
