import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import { getLevelLabel } from "../../utils/helpers"
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  Button,
  Typography,
  TextField,
  ButtonGroup,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Box } from "@mui/system"
import { ChallengeSetup } from "../../types/challenge"
import React, { useEffect, useMemo, useState } from "react"
import { defaultRounds } from "../../utils/constants"

export interface LevelDialogProps {
  open: boolean
  setup?: ChallengeSetup
  onClose: (setup?: ChallengeSetup) => void
}

const LEVELS_COUNT = 5
const ROUNDS_ARRAY = [5, 10, 15]

export function ChallengeSetupDialog(props: LevelDialogProps) {
  const { onClose, setup, open } = props

  const handleClose = () => {
    onClose()
  }

  const formik = useFormik({
    initialValues: {
      ...setup,
    },
    validationSchema: Yup.object({
      players: Yup.number().max(8).min(1).required("players is required"),
      rounds: Yup.number()
        .max(100)
        .min(2)
        .required("number of rounds is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      onClose({ ...values })
    },
  })

  const liveHelpMessage = useMemo(
    () =>
      formik.values.live
        ? "You will be challenging random players live"
        : "You will have a private challenge link to share",
    [formik]
  )

  const [roundsController, setRoundsController] = useState<number | string>(
    defaultRounds
  )
  const [customRoundsInput, setCustomRoundsInput] = useState<boolean>(false)

  useEffect(() => {
    if (roundsController === "custom") {
      setCustomRoundsInput(true)
      formik.setFieldValue("rounds", defaultRounds)
    } else {
      setCustomRoundsInput(false)
      formik.setFieldValue("rounds", roundsController)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundsController])

  return (
    <Dialog
      onClose={handleClose}
      aria-label={"Challenge Setup"}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>New Game</DialogTitle>
      <Container maxWidth="xs">
        <Typography variant="subtitle1">Choose your setup</Typography>
        <form onSubmit={formik.handleSubmit}>
          {setup?.players !== 1 && (
            <>
              <Box sx={{ my: 1 }}>
                <ButtonGroup aria-label="outlined button group">
                  <Button
                    variant={formik.values.live ? "contained" : "outlined"}
                    onClick={() => formik.setFieldValue("live", true)}
                  >
                    Live
                  </Button>
                  <Button
                    variant={!formik.values.live ? "contained" : "outlined"}
                    onClick={() => formik.setFieldValue("live", false)}
                  >
                    Private
                  </Button>
                </ButtonGroup>
              </Box>
              <Typography color="primary" variant="caption">
                {liveHelpMessage}
              </Typography>
              <TextField
                error={Boolean(formik.touched.players && formik.errors.players)}
                helperText={formik.touched.players && formik.errors.players}
                fullWidth
                label="Players"
                margin="normal"
                name="players"
                aria-label="players"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.players}
                variant="outlined"
                type="number"
              />
            </>
          )}
          <FormControl>
            <FormLabel id="rounds-controller-label">Rounds</FormLabel>
            <RadioGroup
              row
              name="roundsController"
              aria-label="rounds-controller"
              value={roundsController}
              onChange={(e) => setRoundsController(e.target.value)}
            >
              {ROUNDS_ARRAY.map((r) => (
                <FormControlLabel
                  key={r}
                  value={r}
                  control={<Radio size="small" />}
                  label={r}
                />
              ))}
              <FormControlLabel
                key="custom"
                value="custom"
                control={<Radio size="small" />}
                label="Custom"
              />
            </RadioGroup>
          </FormControl>
          {customRoundsInput && (
            <TextField
              error={Boolean(formik.touched.rounds && formik.errors.rounds)}
              helperText={formik.touched.rounds && formik.errors.rounds}
              fullWidth
              label="Custom rounds"
              margin="normal"
              name="rounds"
              aria-label="rounds"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.rounds}
              variant="outlined"
              type="number"
            />
          )}
          <FormControl>
            <FormLabel id="level-label">Level</FormLabel>
            <RadioGroup
              name="level"
              aria-label="level"
              value={formik.values.level}
              onChange={formik.handleChange}
            >
              {Array.from({ length: LEVELS_COUNT }, (_, i) => i + 1).map(
                (l) => (
                  <FormControlLabel
                    key={l}
                    value={l}
                    control={<Radio size="small" />}
                    label={getLevelLabel(l)}
                  />
                )
              )}
            </RadioGroup>
          </FormControl>
          <Box sx={{ py: 2 }}>
            <Button
              color="primary"
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              aria-label="submit setup"
              variant="outlined"
            >
              Create
            </Button>
          </Box>
        </form>
      </Container>
    </Dialog>
  )
}
