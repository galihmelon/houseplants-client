import React from 'react'
import { useQuery } from "@apollo/client"

import PLANTS_TO_CARE_QUERY from './common/plantsToCare'
import Care from './care/Care'

import './App.css'

function App() {
  const { loading, error, data } = useQuery(PLANTS_TO_CARE_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className="App">
      <header className="App-header">Houseplants</header>
      {data && data.plantsToCare?.map(
        (plant, i) => <Care plant={plant} careType={plant.careType} key={i} />
      )}
    </div>
  )
}

export default App
