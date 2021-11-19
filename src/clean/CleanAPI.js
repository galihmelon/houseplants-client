import { gql } from "@apollo/client"

export default gql`
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