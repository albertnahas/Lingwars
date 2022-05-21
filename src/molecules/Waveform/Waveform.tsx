import { styled } from "@mui/system"
import "./Waveform.css"
import React, { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"

export const WaveformContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  width: 100%;
  background: transparent;
`

export const Wave = styled("div")`
  width: 100%;
  height: 90px;
`

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
  &:hover {
    background: #ddd;
  }
`

export const Waveform = ({ url, onActive }: { url: string; onActive: any }) => {
  const [playing, setPlaying] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const waveform = useRef<WaveSurfer>()
  const waveformRef = useRef<HTMLMediaElement>(null)

  useEffect(() => {
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
    })

    waveform.current?.load(waveformRef.current || "")
    setPlaying(false)

    waveform.current?.on("ready", function () {
      setDisabled(false)
    })

    waveform.current?.on("play", onActive)

    return () => {
      waveform.current?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const handlePlay = () => {
    setPlaying((p) => !p)
    waveform.current?.playPause()
  }

  return (
    <WaveformContainer aria-label="audio container">
      <PlayButton onClick={handlePlay} disabled={disabled}>
        {!playing ? (
          <PlayArrowIcon color={disabled ? "disabled" : "primary"} />
        ) : (
          <PauseIcon />
        )}
      </PlayButton>
      <Wave id="waveform" />
      <audio ref={waveformRef} id="track" src={url} />
    </WaveformContainer>
  )
}
