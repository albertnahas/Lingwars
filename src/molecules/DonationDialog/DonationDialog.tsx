import React, { useEffect, useState } from "react"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Stack,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { DoneOutline } from "../../icons/DoneOutline"
import { useTheme } from "@mui/system"
import anime from "animejs"

export interface DonationDialogProps {
  open: boolean
  onClose: () => void
}

export function DonationDialog(props: DonationDialogProps) {
  const theme = useTheme()
  const { onClose, open } = props
  const [donated, setDonated] = useState(false)

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
    setDonated(true)
    return capture
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setDonated(false), 500)
  }

  const animation = () => {
    anime({
      targets: "[class*=doneOutline-]",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 500,
      delay: function (el, i) {
        return i * 500
      },
    })
  }

  useEffect(() => {
    if (donated) {
      setTimeout(() => {
        animation()
      }, 500)
    }
    return () => {}
  }, [donated])

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
        {!donated && (
          <>
            <Typography variant="subtitle1">
              If you enjoy playing Lingwars, please consider supporting us by
              making a donation. Every single dollar will help Lingwars to reach
              its full potential &#128522;
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
                  onApprove={(data: any, actions: any) =>
                    onApprove(data, actions)
                  }
                  style={{ layout: "horizontal" }}
                />
              </Grid>
            </form>
          </>
        )}
        {!!donated && (
          <Stack sx={{ alignItems: "center", mb: 3 }} spacing={1}>
            <DoneOutline
              style={{ fontSize: "4em", color: theme.palette.secondary.light }}
            />
            <Typography color="secondary" sx={{ mb: 2 }} variant="h4">
              Thank you!
            </Typography>
            <Typography
              sx={{ display: "flex", justifyContent: "center" }}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              Your contribution is highly valuable for us{"  "}
              <Typography color="red" variant="inherit" sx={{ ml: 0.5 }}>
                &#x2764;
              </Typography>
            </Typography>
          </Stack>
        )}
      </Container>
    </Dialog>
  )
}
