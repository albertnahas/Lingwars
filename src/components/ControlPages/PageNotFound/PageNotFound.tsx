import React from "react"
import { Box, Container, Typography } from "@mui/material"
import { PageNotFoundImg } from "../../../icons/PageNotFound/PageNotFoundImg"

const PageNotFound = () => {
  return (
    <Container>
      <Box>
        <PageNotFoundImg />
      </Box>
      <Typography
        variant="h1"
        color="primary"
        sx={{ fontSize: "2em", fontWeight: 500 }}
      >
        Oops, the page you are looking for, does not exist.
      </Typography>
    </Container>
  )
}

export default PageNotFound
