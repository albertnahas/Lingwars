import { FC } from "react"
import { Box, Button, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { keyframes } from "@emotion/react"
import { useTheme } from "@mui/system"

const rotate = keyframes`
0% {
  transform: rotate(360deg);

}
	100% {
		transform: rotate(0deg);
	}

  `

const EarthImg = styled("img")`
  width: 100%;
  margin: 0 auto;
  transition: all 1s ease;
  animation: ${rotate} 25000ms infinite linear;
  &:hover {
    width: 110%;
  }
  &:active {
    width: 120%;
  }
`

const EarthWrapper = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  width: 300px;
  @media (max-width: 767px) {
    width: 250px;
  }
  margin: auto;
  &:after,
  &:before {
    pointer-events: none;
    content: "";
    background: url("/assets/imgs/clouds.png");
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }
  &:after {
    animation: ${rotate} 18000ms infinite linear;
    background-size: 70%;
    z-index: 10;
    filter: drop-shadow(-10px 20px 15px rgba(0, 0, 0, 0.3));
  }
  &:before {
    animation: ${rotate} 35000ms infinite linear;
  }
`

export var Landing: FC<Props> = function (props) {
  const theme = useTheme()
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
        backgroundImage: `url('/assets/imgs/${
          theme.palette.mode === "dark" ? "world-dark" : "world"
        }.svg') !important`,
      }}
    >
      <EarthWrapper sx={{ m: 0 }}>
        <EarthImg
          alt="Spinning Earth"
          title="Earth"
          src="/assets/imgs/earth.png"
        />
      </EarthWrapper>
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
