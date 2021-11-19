import React from 'react'
import { useQuery } from "@apollo/client"

import PLANTS_TO_CARE_QUERY from './common/plantsToCare'
import Clean from './clean/Clean'
import Water from './water/Water'
import { CARE_TYPES } from './common/constants'

import './App.css'

function App() {
  const { loading, error, data } = useQuery(PLANTS_TO_CARE_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className="App">
      <header className="App-header">Houseplants</header>
      {data && data.plantsToCare?.map((plant, i) =>
        <>
          {plant.careType === CARE_TYPES.WATER && <Water plant={plant} key={i} />}
          {plant.careType === CARE_TYPES.CLEAN && <Clean plant={plant} key={i} />}
        </>
       )}
    </div>
  )
}

export default App
