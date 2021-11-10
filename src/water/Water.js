import React, { useEffect, useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { useMutation } from "@apollo/client"

import PLANTS_TO_CARE_QUERY from '../common/plantsToCare'

import Plant from '../plant/Plant'
import WATER_PLANT_MUTATION from './WaterAPI.js'

const Water = ({plant}) => {
  const [open, setOpen] = useState(false)
  const [waterPlant, { data, loading, error }] = useMutation(WATER_PLANT_MUTATION, {
    refetchQueries: [
      PLANTS_TO_CARE_QUERY,
    ]
  })

  const handleWateredConfirmationOpen = () => setOpen(true)
  const handleWateredConfirmationClose = () => setOpen(false)

  const handleWateredConfirmed = () => {
    waterPlant({ variables: { plantId: plant.id } })
  }

  useEffect(() => {
    if (data && !error) {
      handleWateredConfirmationClose()
    }
  }, [data, error])

  return (
    <>
      <h1>Water time 💧</h1>

      <Plant plant={plant} />

      <IconButton onClick={handleWateredConfirmationOpen} aria-label='water'>
        <CheckCircleIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleWateredConfirmationClose}
      >
        <DialogContent>
          {loading && <p>Loading...</p>}
          {error && <p>Error :(</p>}
          {!loading && !error && <p className="water-confirmation">Watered?</p>}
        </DialogContent>
        {!error && (
          <DialogActions>
            <Button onClick={handleWateredConfirmationClose} disabled={loading}>No</Button>
            <Button onClick={handleWateredConfirmed} disabled={loading}>Yes</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}

export default Water
