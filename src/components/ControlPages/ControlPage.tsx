import React, { FC } from "react"
import { Container } from "@mui/material"
import { styled } from "@mui/system"
import { Link } from "react-router-dom"

export var ControlLink = styled(Link)(
  ({ theme }) => `
  text-decoration: none;
  color: ${theme.palette.primary.main};
  cursor: pointer;
`
)

export var ControlPage: FC<Props> = function ({ children }) {
  return (
    <Container
      sx={{ py: 6, px: 4, flexGrow: 1, "& p": { color: "text.secondary" } }}
    >
      {children}
    </Container>
  )
}
interface Props {
  children?: JSX.Element
}
