import React, { useState } from "react"
import BottomNavigation from "@mui/material/BottomNavigation/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction/BottomNavigationAction"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import InstagramIcon from "@mui/icons-material/Instagram"
import { Tiktok as TiktokIcon } from "../../icons/tiktok"
import { Facebook as FacebookIcon } from "../../icons/facebook"
import { Logo } from "../../icons/logo"
import { Link } from "react-router-dom"

const Footer = () => {
  const [value, setValue] = useState(0)

  return (
    <Box>
      <Container sx={{ py: 6, align: "center" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            flexGrow: 1,
            fontSize: 40,
          }}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(e, newValue) => {
              setValue(newValue)
            }}
            sx={{
              display: { xs: "none", md: "flex" },
              "& > a": {
                minWidth: 150,
                fontWeight: 500,
              },
            }}
          >
            <BottomNavigationAction
              label="Terms &amp; Conditions"
              component={Link}
              to="/terms"
            />
            <BottomNavigationAction
              label="Privacy Policy"
              component={Link}
              to="/privacy"
            />
            <BottomNavigationAction
              label="Contact Us"
              component={Link}
              to="/contact"
            />
          </BottomNavigation>
          <BottomNavigation>
            <BottomNavigationAction
              component="a"
              href="https://www.facebook.com/lingwars"
              target="_blank"
              icon={<FacebookIcon fontSize="small" />}
            />
            <BottomNavigationAction
              component="a"
              href="https://www.instagram.com/lingwars"
              target="_blank"
              icon={<InstagramIcon fontSize="small" />}
            />
            <BottomNavigationAction
              component="a"
              href="https://www.tiktok.com/@lingwars_official"
              target="_blank"
              icon={<TiktokIcon fontSize="small" />}
            />
          </BottomNavigation>
        </Box>
        <Divider />
        <Box
          sx={{
            my: 2,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: { xs: "center", md: "space-between" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "justify-content",
            }}
          >
            <Link to="/">
              <Logo
                sx={{
                  width: { xs: 25, md: 30 },
                  height: { xs: 25, md: 30 },
                  pl: { xs: 0, md: 1 },
                  mr: 2,
                }}
              />
            </Link>
            <Typography
              color="primary"
              sx={{
                fontSize: 16,
                fontWeight: 500,
                display: { xs: "none", md: "block" },
              }}
            >
              Lingwars
            </Typography>
          </Box>
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            align="right"
          >
            &copy; 2022 Lingwars. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
