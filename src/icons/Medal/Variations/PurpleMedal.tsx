import * as React from "react"
import { MedalProps } from "../Medal"
import "./../medal.css"

export const PurpleMedal = ({ label, ...props }: MedalProps) => (
  <svg
    className="animated_badge_svg"
    viewBox="0 0 76 98"
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="badge_ribbon right"
      d="M18 96.2589L18 60C18 59.4477 18.4477 59 19 59H57.3843C57.9366 59 58.3843 59.4477 58.3843 60V96.2334C58.3843 96.9469 57.6586 97.4308 56.9999 97.1566L39.0269 89.6734C38.7859 89.573 38.5153 89.5709 38.2728 89.6674L19.3697 97.188C18.7131 97.4493 18 96.9656 18 96.2589Z"
      fill="#FCC838"
    />
    <path
      className="badge_ribbon right"
      d="M18 96.2589L18 60C18 59.4477 18.4477 59 19 59H57.3843C57.9366 59 58.3843 59.4477 58.3843 60V96.2334C58.3843 96.9469 57.6586 97.4308 56.9999 97.1566L39.0269 89.6734C38.7859 89.573 38.5153 89.5709 38.2728 89.6674L19.3697 97.188C18.7131 97.4493 18 96.9656 18 96.2589Z"
      fill="url(#paint0_linear)"
    />
    <mask
      id="mask0"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="17"
      y="58"
      width="42"
      height="38"
    >
      <path
        d="M18 90.3625V64C18 61.2386 20.2386 59 23 59H53.3843C56.1457 59 58.3843 61.2386 58.3843 64V90.2351C58.3843 93.8024 54.7557 96.2222 51.4624 94.851L40.5301 90.2992C39.3254 89.7977 37.9723 89.7869 36.7599 90.2693L24.8484 95.0083C21.5653 96.3145 18 93.8959 18 90.3625Z"
        fill="#71A1F4"
      />
      <path
        d="M18 90.3625V64C18 61.2386 20.2386 59 23 59H53.3843C56.1457 59 58.3843 61.2386 58.3843 64V90.2351C58.3843 93.8024 54.7557 96.2222 51.4624 94.851L40.5301 90.2992C39.3254 89.7977 37.9723 89.7869 36.7599 90.2693L24.8484 95.0083C21.5653 96.3145 18 93.8959 18 90.3625Z"
        fill="url(#paint1_linear)"
      />
      <path
        d="M18 90.3625V64C18 61.2386 20.2386 59 23 59H53.3843C56.1457 59 58.3843 61.2386 58.3843 64V90.2351C58.3843 93.8024 54.7557 96.2222 51.4624 94.851L40.5301 90.2992C39.3254 89.7977 37.9723 89.7869 36.7599 90.2693L24.8484 95.0083C21.5653 96.3145 18 93.8959 18 90.3625Z"
        stroke="#8C62F5"
      />
    </mask>
    <g className="badge_ribbon right" mask="url(#mask0)">
      <rect
        width="12.9378"
        height="46.9542"
        transform="matrix(0.99996 -0.008926 0.0199657 0.999801 32.0576 65.3011)"
        fill="#FCD977"
      />
    </g>
    <circle
      cx="37.5"
      cy="37.5"
      r="33.5"
      fill="#DBDFE7"
      stroke="#8C62F5"
      stroke-width="8"
    />
    <circle
      className="badge_circle"
      cx="37.5"
      cy="37.5"
      r="29.5"
      fill="#8C62F5"
      stroke="#D1C0FB"
      stroke-width="4"
    />
    {!!label && (
      <text
        x="32"
        y="42"
        className="badge_number"
        style={{ fontSize: "1.3em" }}
        fill="white"
      >
        {label}
      </text>
    )}
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="38.1921"
        y1="59"
        x2="38.1921"
        y2="97.1461"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#DFAC28" />
        <stop offset="1" stop-color="#FCC838" stop-opacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="38.1921"
        y1="59"
        x2="38.1921"
        y2="97.1461"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#27539F" />
        <stop offset="1" stop-color="#71A1F4" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
)
