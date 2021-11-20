import { gql } from "@apollo/client"

export const CLEAN_PLANT_MUTATION = gql`
mutation CleanPlant($plantId: ID!){
  cleanPlant(plantId: $plantId) {
    cleaningLog {
      plant {
        id
      }
      nextSuggestedDate
      cleanDate
    }
  }
}`

export const WATER_PLANT_MUTATION = gql`
mutation WaterPlant($plantId: ID!){
  waterPlant(plantId: $plantId) {
    wateringLog {
      plant {
        id
      }
      nextSuggestedDate
      waterDate
    }
  }
}`
