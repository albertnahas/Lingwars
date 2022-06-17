import { FC } from "react"
import { Box, Button, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const EarthImg = styled("img")`
  width: 250px;
  @media (max-width: 767px) {
    width: 150px;
  }
`

export var Landing: FC<Props> = function (props) {
  return (
    <Box
      sx={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        flexGrow: 1,
        textAlign: "center",
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        backgroundImage: `url('/assets/imgs/world.svg') !important`,
      }}
    >
      <Box sx={{ m: 3 }}>
        <EarthImg
          alt="Spinning Earth"
          title="Earth"
          src="/assets/imgs/earth.webp"
        />
      </Box>
      <Typography
        sx={{ fontWeight: "400", fontSize: { md: "4em", xs: "3em" } }}
        variant="h1"
        aria-label="Lingwars"
        color="primary.light"
      >
        Lingwars
      </Typography>
      <Typography
        sx={{
          m: 2,
          fontSize: "18px",
          fontWeight: 400,
          px: { xs: "2.5rem", md: 0 },
        }}
        variant="h2"
        color="text.primary"
      >
        The best language identifying and guessing game
      </Typography>
      <Paper elevation={0} sx={{ p: 1 }}>
        <Typography variant="body2" color="textSecondary" align="left">
          &#11088; Discover more than 300 languages
          <br />
          &#11088; Invite your friends
          <br />
          &#11088; Challenge random players
          <br />
          &#11088; Improve your linguistic knowledge
        </Typography>
      </Paper>
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
