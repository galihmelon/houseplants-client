import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import PLANTS_TO_CARE_QUERY from './common/plantsToCare'
import {
  CLEAN_PLANT_MUTATION,
  WATER_PLANT_MUTATION,
} from './care/CareAPI'
import { CARE_TYPES } from './common/constants'

import App from './App'

const plantsToCareQueryMock = {
  request: {
    query: PLANTS_TO_CARE_QUERY,
  },
  result: {
    data: {
      plantsToCare: [{
        id: '1',
        name: 'Pancake plant',
        imageUrl: 'https://examples.com/pancake-plant.png',
        description: 'A plant that grows pancakes every morning',
        careType: CARE_TYPES.WATER,
      },
      {
        id: '2',
        name: 'UFO plant',
        imageUrl: 'https://examples.com/pancake-plant.png',
        description: 'A plant that summons aliens',
        careType: CARE_TYPES.CLEAN,
      }]
    }
  }
}

test('renders loading sign during API call', () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <App />
    </MockedProvider>)
  screen.getByText(/Loading.../i)
})

test('renders error sign on query error', async() => {
  const mocks = [{
    request: {
      query: PLANTS_TO_CARE_QUERY,
    },
    error: new Error('An error occured'),
  }]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Error/i))
})

test('renders houseplants to care on success query', async() => {
  const mocks = [plantsToCareQueryMock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Pancake plant/i))
})

test.each([
  [0, /A plant that grows pancakes every morning/i],
  [1, /A plant that summons aliens/i]
])('shows plant description when info icon is pressed', async(plantIndex, expectedDescription) => {
  const mocks = [plantsToCareQueryMock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Pancake plant/i))

  fireEvent.click(screen.getAllByRole('button', { name: /info/i}).at(plantIndex))

  await waitFor(() => screen.getByText(expectedDescription))
})

test.each([
  [/Pancake plant/i, /water/i, /Watered?/i],
  [/UFO plant/i, /clean/i, /Cleaned?/i],
])('shows caring confirmation when checkmark icon is pressed', async(title, buttonName, careQuestion) => {
  const mocks = [plantsToCareQueryMock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(title))

  fireEvent.click(screen.getByRole('button', { name: buttonName}))

  await waitFor(() => screen.getByText(careQuestion))
  await waitFor(() => screen.getByText(/No/i))
  await waitFor(() => screen.getByText(/Yes/i))
})

const waterPlantMutationMock = {
  request: {
    query: WATER_PLANT_MUTATION,
    variables: { plantId: '1' },
  },
  result: {
    data: {
      waterPlant: {
        wateringLog: {
          plant: {
            id: '1'
          },
          nextSuggestedDate: '2021-10-29',
          waterDate: '2021-10-22'
        }
      }
    }
  }
}

const cleanPlantMutationMock = {
  request: {
    query: CLEAN_PLANT_MUTATION,
    variables: { plantId: '2' },
  },
  result: {
    data: {
      cleanPlant: {
        cleaningLog: {
          plant: {
            id: '2'
          },
          nextSuggestedDate: '2021-10-29',
          cleanDate: '2021-10-22'
        }
      }
    }
  }
}

test.each([
  [/Pancake plant/i, /water/i, waterPlantMutationMock],
  [/UFO plant/i, /clean/i, cleanPlantMutationMock],
])('hides plant after caring', async(title, buttonName, mutationMock) => {
  const plantsToCareQueryRefetchMock = {
    request: {
      query: PLANTS_TO_CARE_QUERY,
    },
    result: {
      data: {
        plantsToCare: []
      }
    }
  }

  const mocks = [
    plantsToCareQueryMock,
    mutationMock,
    plantsToCareQueryRefetchMock,
  ]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(title))
  fireEvent.click(screen.getByRole('button', { name: buttonName}))

  await waitFor(() => screen.getByText(/Yes/i))
  fireEvent.click(screen.getByText(/Yes/i))

  await waitForElementToBeRemoved(() => screen.queryByText(title))
})

test.each([
  [/Pancake plant/i, /water/i],
  [/UFO plant/i, /clean/i],
])('does not hide plant if care has not been done', async(title, buttonName) => {
  const mocks = [plantsToCareQueryMock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(title))
  fireEvent.click(screen.getByRole('button', { name: buttonName }))

  await waitFor(() => screen.getByText(/No/i))
  fireEvent.click(screen.getByText(/No/i))

  await waitForElementToBeRemoved(() => screen.queryByText(/No/i))
  await waitFor(() => screen.getByText(title))
})
