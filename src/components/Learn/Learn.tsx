import { List, ListItemText, ListItemButton } from "@mui/material"
import React, { useEffect, useState } from "react"
import { allLangs, getLanguageInfo } from "../../utils/helpers"
import { Box } from "@mui/system"
import { LanguageInfo } from "../../molecules/LanguageInfo/LanguageInfo"

export const Learn = () => {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [langInfo, setLangInfo] = useState<any>()

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
  }

  useEffect(() => {
    if (!selectedIndex) return
    if (allLangs[selectedIndex]) {
      getLanguageInfo(allLangs[selectedIndex])
        .then((res) => res.json())
        .then((res) => {
          for (const page in res.query.pages) {
            setLangInfo(res.query.pages[page])
          }
        })
    }
  }, [selectedIndex])

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {allLangs.map((value, i) => (
          <ListItemButton
            key={value?.name}
            onClick={(event: any) => handleListItemClick(event, i)}
            disableGutters
            selected={selectedIndex === i}
          >
            <ListItemText primary={`${value?.name}`} />
          </ListItemButton>
        ))}
      </List>
      {selectedIndex && langInfo && (
        <LanguageInfo name={langInfo.title} info={langInfo.extract} />
      )}
    </Box>
  )
}
