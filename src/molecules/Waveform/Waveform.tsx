import { styled } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

export const WaveformContianer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background: transparent;
`;

export const Wave = styled("div")`
  width: 100%;
  height: 90px;
`;

export const PlayButton = styled("button")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  background: #efefef;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  margin-right:5px;
  &:hover {
    background: #ddd;
  }
`;

export const Waveform = ({ url }: { url: string }) => {
  const [playing, setPlaying] = useState(false);
  const waveform = useRef<WaveSurfer>();
  const waveformRef = useRef<HTMLMediaElement>(null);

  useEffect(() => {
    const track = document.querySelector("#track");

    waveform.current = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: "#waveform",
      backend: "WebAudio",
      height: 80,
      progressColor: "#2D5BFF",
      responsive: true,
      waveColor: "#EFEFEF",
      cursorColor: "transparent",
    });

    waveform.current?.load(waveformRef.current || "");
    setPlaying(false)

    return () => {
      waveform.current?.destroy();
    };
  }, [url]);

  const handlePlay = () => {
    setPlaying((p) => !p);
    waveform.current?.playPause();
  };

  return (
    <WaveformContianer>
      <PlayButton onClick={handlePlay}>
        {!playing ? <PlayArrowIcon color="primary" /> : <PauseIcon />}
      </PlayButton>
      <Wave id="waveform" />
      <audio ref={waveformRef} id="track" src={url} />
    </WaveformContianer>
  );
};
