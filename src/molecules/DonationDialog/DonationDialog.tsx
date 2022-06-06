import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { PayPalButtons } from "@paypal/react-paypal-js"

export interface DonationDialogProps {
  open: boolean
  onClose: () => void
}

export function DonationDialog(props: DonationDialogProps) {
  const { onClose, open } = props

  const formik = useFormik({
    initialValues: {
      amount: 1,
    },
    validationSchema: Yup.object({
      amount: Yup.number().max(9999).min(0.5).required("amount is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {},
  })

  const createOrder = (data: any, actions: any) =>
    actions.order.create({
      purchase_units: [
        {
          amount: {
            value: formik.values.amount,
          },
        },
      ],
    })

  const onApprove = (data: any, actions: any) => {
    // data.orderID
    const capture = actions.order.capture()
    onClose()
    return capture
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-label={"donation"}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Donation</DialogTitle>
      <Container maxWidth="xs">
        <Typography variant="subtitle1">
          If you enjoy playing Lingwars, please consider supporting us by making
          a donation. Every single dollar will help Lingwars to reach its full
          potential
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            error={Boolean(formik.touched.amount && formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            fullWidth
            label="Amount"
            margin="normal"
            name="amount"
            aria-label="amount"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.amount}
            variant="outlined"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <Grid container sx={{ my: 2 }}>
            <PayPalButtons
              createOrder={(data: any, actions: any) =>
                createOrder(data, actions)
              }
              onApprove={(data: any, actions: any) => onApprove(data, actions)}
              style={{ layout: "horizontal" }}
            />
          </Grid>
        </form>
      </Container>
    </Dialog>
  )
}
