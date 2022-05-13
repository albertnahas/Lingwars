import React, { FC } from "react";
import { useTheme } from "@mui/system";
import { Box, Button, Typography } from "@mui/material";
import { Logo } from "../../icons/logo";

export var Landing: FC<Props> = function (props) {
  const theme = useTheme();
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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "calc( 100vh - 64px )",
        backgroundImage: `url('https://images.ctfassets.net/3viuren4us1n/3ZmnN0u53aCn5hiREoyAqW/e4962956cdda9da01d9eb090cf93ad6d/2020-09-03_nlp-non-english-language.webp') !important`,
      }}
    >
      <img src="https://r2.community.samsung.com/t5/image/serverpage/image-id/2858216iF966CF430D380489/image-size/large?v=v2&px=999" />
      <Typography
        sx={{ fontWeight: "400", fontSize: "4em" }}
        variant="h1"
        aria-label="Lingwars"
        color="primary.light"
      >
        Lingwars
      </Typography>
      <Typography
        sx={{ m: 2, fontSize: "18px" }}
        variant="h3"
        color="text.secondary"
      >
        The best language identifing and guessing game
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
  );
};

interface Props {
  login: () => void;
}
