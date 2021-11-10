import React, { useState } from 'react'

import { IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material'
import InfoIcon from '@material-ui/icons/Info'

import './plant.css'

const Plant = ({
  plant
}) => {
  const [open, setOpen] = useState(false)

  const handleInfoOpen = () => setOpen(true)
  const handleInfoClose = () => setOpen(false)

  return (
    <>
      <img className="plant-image" src={plant.imageUrl} alt={plant.name} />
      <h2>{plant.name}</h2>

      <IconButton onClick={handleInfoOpen} aria-label='info'>
        <InfoIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleInfoClose}
      >
        <DialogTitle>{plant.name}</DialogTitle>
        <DialogContent>
          <p>{plant.description}</p>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Plant
