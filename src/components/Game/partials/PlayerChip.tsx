import { Chip, Avatar } from "@mui/material"
import React, { FC } from "react"
import { Player } from "../../../types/challenge"
import { UserCircle as UserCircleIcon } from "../../../icons/user-circle"

export const PlayerChip: FC<Props> = ({ player, isWinning }) => {
  return (
    <Chip
      variant="outlined"
      color={isWinning ? "success" : "warning"}
      icon={
        <Avatar
          sx={{
            height: 23,
            width: 23,
          }}
          src={player?.photoURL}
          alt="profile photo"
        >
          <UserCircleIcon sx={{ color: "white" }} fontSize="small" />
        </Avatar>
      }
      label={`${player.displayName}: ${player.score?.timed || 0} | ${
        player.score?.accuracy || 0
      } / ${player.turn}`}
    />
  )
}

interface Props {
  player: Player
  isWinning?: boolean
}
