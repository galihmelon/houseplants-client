import { gql } from "@apollo/client"

export default gql`
  {
    plantsToCare {
      id
      name
      imageUrl
      description
      careType
    }
  }`