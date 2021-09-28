const fetch = require('node-fetch')
const dotenv = require('dotenv')
const team = 'random'
const password = 'ciaomare'

const signup = async () => {
  const response = await fetch(
    `http://127.0.0.1:8080/signup?team=${team}&password=${team}`
  )
}

const getCoords = async () => {
  const response = await fetch(`http://127.0.0.1:8080/?format=json`)
  const data = await response.json()
  return data
}

const fire = ([y, x]) => {
  fetch(
    `http://127.0.0.1:8080/fire?x=${x}&y=${y}&team=${team}&password=${team}`
  )
}

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const doMove = async () => {
  const { field } = await getCoords()
  const randomX = Math.floor(Math.random() * 49)
  const randomY = Math.floor(Math.random() * 49)
  console.log(randomY, randomX)
  if (!field[randomY][randomX].hit) {
    fire([randomY, randomX])
    await timeout(1000)
  }
}

signup()
;(async () => {
  while (true) {
    await doMove()
  }
})()
