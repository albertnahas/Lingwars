import { FC } from "react"
import { Box, Button, Typography } from "@mui/material"

export var Landing: FC<Props> = function (props) {
  return (
    <Box
      sx={{
        backgroundColor: "#eee",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "lighten",
        flexGrow: 1,
        textAlign: "center",
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        backgroundImage: `url('/assets/imgs/world.jpg') !important`,
      }}
    >
      <Box sx={{ m: 8 }}>
        <img
          alt="Spinning Earth"
          title="Earth"
          width="250"
          src="/assets/imgs/earth.webp"
        />
      </Box>
      <Typography
        sx={{ fontWeight: "400", fontSize: "4em" }}
        variant="h1"
        aria-label="Lingwars"
        color="primary.light"
      >
        Lingwars
      </Typography>
      <Typography
        sx={{ m: 2, fontSize: "18px", fontWeight: 400 }}
        variant="h2"
        color="text.secondary"
      >
        The best language identifying and guessing game
      </Typography>
      <Button
        color="primary"
        fullWidth
        size="large"
        onClick={props.login}
        sx={{
          width: 200,
          mt: 3,
        }}
        aria-label="get started"
        variant="contained"
      >
        Get started
      </Button>
    </Box>
  )
}

interface Props {
  login: () => void
}
