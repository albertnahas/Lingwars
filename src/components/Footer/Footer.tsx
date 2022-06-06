import React, { useState, useEffect } from "react"
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

const footerNavLinks = [
  {
    label: "Terms & Conditions",
    path: "/terms",
  },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Contact Us", path: "/contact" },
]

const socialLinks = [
  {
    name: "facebook",
    href: "https://www.facebook.com/lingwars",
    icon: <FacebookIcon fontSize="small" />,
  },
  {
    name: "instagram",
    href: "https://www.instagram.com/lingwars",
    icon: <InstagramIcon fontSize="small" />,
  },
  {
    name: "tiktok",
    href: "https://www.tiktok.com/@lingwars_official",
    icon: <TiktokIcon fontSize="small" />,
  },
]

const Footer = () => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const footerNavPaths = footerNavLinks.map((link) => link.path)

    return () => {
      if (footerNavPaths.some((path) => window.location.href.includes(path))) {
        setValue((e) => 0)
      }
    }
  }, [])

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
            {footerNavLinks.map((link) => {
              return (
                <BottomNavigationAction
                  key={link.label.toLowerCase()}
                  label={link.label}
                  component={Link}
                  to={link.path}
                />
              )
            })}
          </BottomNavigation>
          <BottomNavigation>
            {socialLinks.map((link) => {
              return (
                <BottomNavigationAction
                  key={link.name}
                  component="a"
                  href={link.href}
                  target="_blank"
                  icon={link.icon}
                />
              )
            })}
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
