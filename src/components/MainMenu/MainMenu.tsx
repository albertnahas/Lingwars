import React, { FC, useEffect } from "react";
import { useTheme } from "@mui/system";
import { Box, Button, Stack, Typography, Zoom } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChallengeDialog } from "../../molecules/ChallengeDialog/ChallengeDialog";
import firebase from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/userSlice";
import { GameDialog } from "../../molecules/GameDialog/GameDialog";
import { setChallenge } from "../../store/challengeSlice";
import { ChallengeSetup } from "../../types/challenge";

export var MainMenu: FC<Props> = function (props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [challengeId, setChallengeId] = React.useState<string>();
  const [initialSetup, setInitialSetup] = React.useState<ChallengeSetup>();

  const [openLevelsDialog, setOpenLevelsDialog] = React.useState(false);
  const [openChallengeDialog, setOpenChallengeDialog] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  useEffect(() => {
    if (challengeId) {
      setOpenChallengeDialog(true);
    }
  }, [challengeId]);

  useEffect(() => {
    if (initialSetup) {
      setOpenLevelsDialog(true);
    }
  }, [initialSetup]);

  const onCreateGame = (setup?: ChallengeSetup) => {
    setOpenLevelsDialog(false);
    setInitialSetup(undefined);

    if (!setup) return;

    if (setup.level) {
      if (setup.players === 1) {
        dispatch(setChallenge({ ...setup }));
        navigate(`/play`);
      } else {
        createChallenge(setup);
      }
    }
  };

  const createChallenge = (setup?: ChallengeSetup) => {
    firebase
      .firestore()
      .collection("challenges")
      .add({
        uid: user?.uid || null,
        rounds: 10,
        ...setup,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        setChallengeId(docRef.id);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  const onClickSinglePlayer = () => {
    setInitialSetup({ level: 1, players: 1 });
  };

  const onClickMultiplayer = () => {
    setInitialSetup({ level: 1, players: 2 });
  };

  const onStartChallenge = () => {
    navigate(`/play/${challengeId}`);
  };

  return (
    <Box>
      <Zoom in={true}>
        <img
          width="200"
          src="https://r2.community.samsung.com/t5/image/serverpage/image-id/2858216iF966CF430D380489/image-size/large?v=v2&px=999"
        />
      </Zoom>
      <Typography
        variant="h4"
        aria-label="Lingwars"
        color="primary"
        sx={{ mb: 4 }}
      >
        Main Menu
      </Typography>
      <Stack
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        spacing={2}
      >
        <Button
          color="primary"
          aria-label="single player"
          variant="outlined"
          onClick={onClickSinglePlayer}
        >
          Single Player
        </Button>
        <Button
          color="primary"
          aria-label="multi player"
          variant="outlined"
          onClick={onClickMultiplayer}
        >
          Multiplayer
        </Button>
      </Stack>
      {initialSetup && (
        <GameDialog
          setup={initialSetup}
          open={openLevelsDialog}
          onClose={onCreateGame}
        />
      )}
      {challengeId && (
        <ChallengeDialog
          challengeId={challengeId}
          open={openChallengeDialog}
          onClose={onStartChallenge}
        />
      )}
    </Box>
  );
};

interface Props {}
