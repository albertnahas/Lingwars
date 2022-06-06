import React from "react"
import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import { styled } from "@mui/system"

const Link = styled("a")(
  ({ theme }) => `
  text-decoration: none;
  color: ${theme.palette.primary.main};
  cursor: pointer;
`
)

export var Privacy = function () {
  return (
    <>
      <Typography variant="h2" color="primary">
        Privacy Policy
      </Typography>
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h6" color="primary">
          Types of data collected
        </Typography>

        <p>
          When registering on our site, as appropriate, we collect information
          from you in order to provide and improve upon our service.
        </p>

        <p>We also may collect your:</p>

        <ul>
          <li>
            <p>First name</p>
          </li>
          <li>
            <p>Last name</p>
          </li>
          <li>
            <p>Email address</p>
          </li>
          <li>
            <p>Birth date or birth year</p>
          </li>
          <li>
            <p>Gender</p>
          </li>
        </ul>

        <p>
          Additionally, if you register using Facebook or Google, you may be
          asked for further information specific to your Facebook or Google
          account. (Typically this will include your public profile
          information.) It is Facebook and Google&apos;s responsibility that a
          list of this information be shown to you, so that you can accept or
          deny those requests at the time of registration.
        </p>

        <Typography variant="h6" color="primary">
          Purposes of collecting data
        </Typography>

        <p>
          We collect your email address in order to send periodic emails, to
          contact you in regards to your Lingwars account, and to identify your
          account. Do note that you may unsubscribe from our periodic emails at
          any time, using the link at the bottom of any email you&apos;ve
          received from us.
        </p>

        <p>
          We collect your first name, last name, gender, and birth date or year
          in order to customize your experience, and to conduct research.
        </p>

        <p>
          Any actions performed on Lingwars are collected and retained as a core
          function of providing and maintaining our service and may be used
          without identifying information in scientific research.
        </p>

        <Typography variant="h6" color="primary">
          Deletion of personal data
        </Typography>

        <p>
          Account deletion is as laid out in our Terms of Use. To have an
          account registration deleted, use
          <Link href="/contact"> this form </Link>
          to contact the customer service.
        </p>

        <p>
          Some information associated with deleted accounts is retained in order
          to maintain the service for other users, for statistical and
          historical purposes, and for use in scientific research.
        </p>

        <Typography variant="h6" color="primary">
          Data sharing and third-parties
        </Typography>

        <p>
          We do not disclose any information to outside parties except as per
          your request.
        </p>

        <p>
          Except in the case of a merger or acquisition, your information,
          whether public or private, will not be sold, exchanged, transferred,
          or given to any other company for any reason whatsoever, without your
          consent, other than for the express purpose of delivering the
          purchased product or service requested.
        </p>

        <p>
          This does not include trusted third parties who assist us in operating
          our website, conducting our business, or servicing you, so long as
          those parties agree to keep this information confidential. We may also
          release your information when we believe release is appropriate to
          comply with the law, enforce our site policies, or protect our or
          others' rights, property, or safety. However, non-personally
          identifiable visitor information may be provided to other parties for
          marketing, advertising, or other uses.
        </p>

        <Typography variant="h6" color="primary">
          Data protection security controls
        </Typography>

        <p>
          We implement a variety of security measures to maintain the safety of
          your personal information when you submit or access your personal
          information.
        </p>

        <p>
          We offer the use of a secure server. All supplied sensitive/credit
          information is transmitted via Secure Socket Layer (SSL) technology
          and then encrypted into our payment gateway providers database only to
          be accessible by those authorized with special access rights to such
          systems, and are required to keep the information confidential.
        </p>

        <p>
          After a transaction, sensitive information (such as credit card
          numbers) is never stored on our servers.
        </p>
      </Box>
    </>
  )
}
