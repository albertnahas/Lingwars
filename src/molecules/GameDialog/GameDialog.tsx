import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { getLevelLabel } from "../../utils/helpers";
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
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/system";
import { ChallengeSetup } from "../../types/challenge";

export interface LevelDialogProps {
  open: boolean;
  setup?: ChallengeSetup;
  onClose: (setup?: ChallengeSetup) => void;
}

const LEVELS_COUNT = 5;

export function GameDialog(props: LevelDialogProps) {
  const { onClose, setup, open } = props;

  const handleClose = () => {
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      ...setup,
    },
    validationSchema: Yup.object({
      players: Yup.number().max(8).min(1).required("players is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      onClose({ ...values });
    },
  });

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>New Game</DialogTitle>
      <Container>
        <Typography variant="subtitle1">Choose your setup</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            error={Boolean(formik.touched.players && formik.errors.players)}
            helperText={formik.touched.players && formik.errors.players}
            fullWidth
            label="Players"
            margin="normal"
            name="players"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.players}
            variant="outlined"
            type="number"
          />
          <FormControl>
            <FormLabel id="level-label">Level</FormLabel>
            <RadioGroup
              name="level"
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
              variant="outlined"
            >
              Create
            </Button>
          </Box>
        </form>
      </Container>
    </Dialog>
  );
}