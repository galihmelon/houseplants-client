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
import WATER_PLANT_MUTATION from './water/WaterAPI'

import App from './App'

const plants_to_care_query_mock = {
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
        __typename: 'PlantType',
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
  const mocks = [plants_to_care_query_mock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Pancake plant/i))
})

test('shows plant description when info icon is pressed', async() => {
  const mocks = [plants_to_care_query_mock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Pancake plant/i))

  fireEvent.click(screen.getByRole('button', { name: /info/i}))

  await waitFor(() => screen.getByText(/A plant that grows pancakes every morning/i))
})

test('shows watering confirmation when checkmark icon is pressed', async() => {
  const mocks = [plants_to_care_query_mock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Pancake plant/i))

  fireEvent.click(screen.getByRole('button', { name: /water/i}))

  await waitFor(() => screen.getByText(/Watered?/i))
  await waitFor(() => screen.getByText(/No/i))
  await waitFor(() => screen.getByText(/Yes/i))
})

test('hides plant after watering', async() => {
  const water_plant_mutation_mock = {
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

  const plants_to_care_query_refetch_mock = {
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
    plants_to_care_query_mock,
    water_plant_mutation_mock,
    plants_to_care_query_refetch_mock,
  ]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Pancake plant/i))
  fireEvent.click(screen.getByRole('button', { name: /water/i}))

  await waitFor(() => screen.getByText(/Yes/i))
  fireEvent.click(screen.getByText(/Yes/i))

  await waitForElementToBeRemoved(() => screen.queryByText(/Pancake plant/i))
})

test('does not hide plant without watering', async() => {
  const mocks = [plants_to_care_query_mock]

  render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <App />
    </MockedProvider>)

  await waitFor(() => screen.getByText(/Pancake plant/i))
  fireEvent.click(screen.getByRole('button', { name: /water/i}))

  await waitFor(() => screen.getByText(/No/i))
  fireEvent.click(screen.getByText(/No/i))

  await waitForElementToBeRemoved(() => screen.queryByText(/No/i))
  await waitFor(() => screen.getByText(/Pancake plant/i))
})
