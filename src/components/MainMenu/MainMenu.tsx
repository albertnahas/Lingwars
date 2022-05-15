import React, { FC, useEffect } from "react";
import { useTheme } from "@mui/system";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Logo } from "../../icons/logo";
import { useNavigate } from "react-router-dom";
import { ChallengeDialog } from "../../molecules/ChallengeDialog/ChallengeDialog";
import firebase from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/userSlice";
import { LevelDialog } from "../../molecules/LevelDialog/LevelDialog";
import { setChallenge } from "../../store/challengeSlice";

export var MainMenu: FC<Props> = function (props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [challengeId, setChallengeId] = React.useState<string>();
  const [level, setLevel] = React.useState<number>(0);
  const [single, setSingle] = React.useState<boolean>(false);

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
    if (level) {
      if (single) {
        dispatch(setChallenge({ level }));
        navigate(`/play`);
      } else {
        createChallenge(level);
      }
    }
  }, [level, single]);

  const onSelectLevel = (l: number) => {
    setLevel(l);
    setOpenLevelsDialog(false);
  };

  const onClickChallenge = () => {
    setSingle(false);
    setOpenLevelsDialog(true);
  };

  const createChallenge = (cLevel?: number) => {
    firebase
      .firestore()
      .collection("challenges")
      .add({
        uid: user?.uid || null,
        level: cLevel,
        rounds: 10,
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

  const onStartSingle = () => {
    setSingle(true);
    setOpenLevelsDialog(true);
  };

  const onStartChallenge = () => {
    navigate(`/play/${challengeId}`);
  };

  return (
    <Box>
      <img
        width="200"
        src="https://r2.community.samsung.com/t5/image/serverpage/image-id/2858216iF966CF430D380489/image-size/large?v=v2&px=999"
      />
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
          onClick={onStartSingle}
        >
          Single Player
        </Button>
        <Button
          color="primary"
          aria-label="single player"
          variant="outlined"
          onClick={onClickChallenge}
        >
          Multiplayer
        </Button>
      </Stack>
      <LevelDialog
        selectedValue={level}
        open={openLevelsDialog}
        onClose={onSelectLevel}
      />
      <ChallengeDialog
        challengeId={challengeId}
        open={openChallengeDialog}
        onClose={onStartChallenge}
      />
    </Box>
  );
};

interface Props {}
