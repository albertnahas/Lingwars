import React from "react"
import { Box, Container, Typography } from "@mui/material"
import { PageNotFoundImg } from "../../../icons/PageNotFound/PageNotFoundImg"

const PageNotFound = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        maxWidth: "500px !important",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <PageNotFoundImg />
      </Box>
      <Typography
        variant="h1"
        color="primary"
        sx={{ mt: 4, fontSize: "1.75em", fontWeight: 500 }}
      >
        Oops, the page you are looking for, does not exist.
      </Typography>
    </Container>
  )
}

export default PageNotFound
