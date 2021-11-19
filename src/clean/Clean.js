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
import CLEAN_PLANT_MUTATION from './CleanAPI.js'

const Clean = ({plant}) => {
  const [open, setOpen] = useState(false)
  const [cleanPlant, { data, loading, error }] = useMutation(CLEAN_PLANT_MUTATION, {
    refetchQueries: [
      PLANTS_TO_CARE_QUERY,
    ]
  })

  const handleCleanedConfirmationOpen = () => setOpen(true)
  const handleCleanedConfirmationClose = () => setOpen(false)

  const handleCleanedConfirmed = () => {
    cleanPlant({ variables: { plantId: plant.id } })
  }

  useEffect(() => {
    if (data && !error) {
      handleCleanedConfirmationClose()
    }
  }, [data, error])

  return (
    <>
      <h1>Clean time <span role="img" aria-label="gloves">🧤</span></h1>

      <Plant plant={plant} />

      <IconButton className="clean-icon" onClick={handleCleanedConfirmationOpen} aria-label='clean'>
        <CheckCircleIcon />
      </IconButton>

      <Dialog
        className="clean-confirmation-dialog"
        open={open}
        onClose={handleCleanedConfirmationClose}
      >
        <DialogContent>
          {loading && <p>Loading...</p>}
          {error && <p>Error :(</p>}
          {!loading && !error && <p className="clean-confirmation">Cleaned?</p>}
        </DialogContent>
        {!error && (
          <DialogActions>
            <Button onClick={handleCleanedConfirmationClose} disabled={loading}>No</Button>
            <Button id="yes-button" onClick={handleCleanedConfirmed} disabled={loading}>Yes</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}

export default Clean
