import React, { useEffect, useState } from "react"
import { allLangs, getLanguageInfo } from "../../utils/helpers"
import {
  Card,
  CardContent,
  Container,
  List,
  ListItemText,
  ListItemButton,
  ListSubheader,
  TextField,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { ControlHeading1, ControlHeading2 } from "../ControlPages/ControlPage"

const adjustLangTitle = (a: string) => {
  return a.length > 0 ? a.replace(/languages|language/, "") : ""
}

export const Learn = () => {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [langInfo, setLangInfo] = useState<any>()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredLangs, setFilteredLangs] = useState(allLangs)

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  useEffect(() => {
    if (!searchTerm) {
      setFilteredLangs(allLangs)
    }
    if (searchTerm) {
      const filtered = allLangs.filter((lang) =>
        lang.name.toLowerCase().startsWith(searchTerm)
      )
      setFilteredLangs(filtered)
    }
  }, [searchTerm])

  useEffect(() => {
    if (filteredLangs[selectedIndex]) {
      getLanguageInfo(filteredLangs[selectedIndex])
        .then((res) => res.json())
        .then((res) => {
          for (const page in res.query.pages) {
            setLangInfo(res.query.pages[page])
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex])

  return (
    <Container>
      <ControlHeading1 variant="h1" color="primary">
        Learn
      </ControlHeading1>
      <ControlHeading2 variant="h2" color="textPrimary">
        Get to know more about selected language
      </ControlHeading2>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mt: 1, mb: 4, fontStyle: "italic" }}
      >
        *Use the search bar to filter the languages.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: { md: "nowrap", xs: "wrap" },
          margin: "auto",
          maxWidth: 1000,
        }}
      >
        <Box sx={{ p: 2, border: "1px dashed grey" }}>
          <Card
            variant="outlined"
            sx={{
              maxWidth: { xs: "90vw", md: 500 },
              minWidth: { xs: "90vw", md: 300 },
              maxHeight: 500,
              margin: "auto",
            }}
          >
            <CardContent>
              <List
                sx={{
                  width: "100%",
                  minWidth: { xs: "100%", md: 400 },
                  bgcolor: "background.paper",
                  overflow: "auto",
                  maxHeight: 450,
                }}
              >
                <ListSubheader>
                  <TextField
                    label="Search language"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={handleChange}
                  />
                </ListSubheader>
                {filteredLangs.map((value, i) => (
                  <ListItemButton
                    key={value?.name}
                    onClick={(event: any) => handleListItemClick(event, i)}
                    disableGutters
                    selected={selectedIndex === i}
                    sx={{ pl: 2 }}
                  >
                    <ListItemText primary={`${adjustLangTitle(value?.name)}`} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ p: 2, border: "1px dashed grey" }}>
          {(selectedIndex || selectedIndex === 0) && langInfo && (
            <Card
              variant="outlined"
              sx={{
                maxWidth: { xs: "90vw", md: 500 },
                width: "100%",
                maxHeight: 500,
                margin: "auto",
              }}
            >
              <CardContent>
                <Typography
                  align="left"
                  sx={{ maxHeight: 470, overflow: "auto" }}
                >
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Selected language
                  </Typography>
                  <Typography variant="h5" component="div" color="primary">
                    {adjustLangTitle(langInfo.title)}
                  </Typography>
                  <Typography
                    sx={{ my: { md: 1.5, xs: 0 } }}
                    color="text.secondary"
                  >
                    Info
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ pr: 2.5, textAlign: "justify" }}
                  >
                    {langInfo.extract}
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Container>
  )
}
