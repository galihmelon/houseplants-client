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
import { CLEAN_PLANT_MUTATION, WATER_PLANT_MUTATION } from './CareAPI'

export const CARE_TYPES = {
  WATER: 'WATER',
  CLEAN: 'CLEAN',
}

const CARE_TYPE_DATA =  {
  [CARE_TYPES.WATER]: {
    mutation: WATER_PLANT_MUTATION,
    heading: 'Water time',
    emoji: '💧',
    emojiLabel: 'droplet',
    confirmationText: 'Watered?',
  },
  [CARE_TYPES.CLEAN]: {
    mutation: CLEAN_PLANT_MUTATION,
    heading: 'Clean time',
    emoji: '🧤',
    emojiLabel: 'gloves',
    confirmationText: 'Cleaned?',
  },
}

const Care = ({plant, careType}) => {
  const [open, setOpen] = useState(false)

  const [waterPlant, { data, loading, error }] = useMutation(
    CARE_TYPE_DATA[careType].mutation,
    { refetchQueries: [ PLANTS_TO_CARE_QUERY ] },
  )

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
      <h1>
        {CARE_TYPE_DATA[careType].heading}&nbsp;
        <span role="img" aria-label={CARE_TYPE_DATA[careType].emojiLabel}>
          {CARE_TYPE_DATA[careType].emoji}
        </span>
      </h1>

      <Plant plant={plant} />

      <IconButton className="care-icon" onClick={handleWateredConfirmationOpen} aria-label={careType}>
        <CheckCircleIcon />
      </IconButton>

      <Dialog
        className="care-confirmation-dialog"
        open={open}
        onClose={handleWateredConfirmationClose}
      >
        <DialogContent>
          {loading && <p>Loading...</p>}
          {error && <p>Error :(</p>}
          {!loading && !error && <p className="care-confirmation">{CARE_TYPE_DATA[careType].confirmationText}</p>}
        </DialogContent>
        {!error && (
          <DialogActions>
            <Button onClick={handleWateredConfirmationClose} disabled={loading}>No</Button>
            <Button id="yes-button" onClick={handleWateredConfirmed} disabled={loading}>Yes</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}

export default Care
