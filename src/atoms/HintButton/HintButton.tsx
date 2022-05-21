import { Tooltip, IconButton } from "@mui/material"
import React, { FC } from "react"
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates"

export const HintButton: FC<Props> = ({ disabled, onClick }) => {
  return (
    <Tooltip
      title={
        disabled ? "You can only use one hint per round" : "Give me a hint"
      }
      placement="top"
      arrow
    >
      <span>
        <IconButton
          size="large"
          color="primary"
          disabled={disabled}
          sx={{
            cursor: disabled ? "not-allowed !important" : "pointer",
          }}
          onClick={onClick}
        >
          <TipsAndUpdatesIcon />
        </IconButton>
      </span>
    </Tooltip>
  )
}

export interface Props {
  disabled: boolean
  onClick: () => void
}
