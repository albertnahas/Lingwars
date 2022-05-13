import React, { FC } from "react";
import { Container, useTheme } from "@mui/material";

export var ControlPage: FC<Props> = function ({ children }) {
  return (
    <Container
      sx={{ py: 6, px: 4, flexGrow: 1, "& p": { color: "text.secondary" } }}
    >
      {children}
    </Container>
  );
};
interface Props {
  children: JSX.Element;
}
