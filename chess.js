const fetch = require('node-fetch')
const team = 'random'
const password = 'ciaomare'

const signup = async () => {
  const response = await fetch(
    `http://127.0.0.1:8080/signup?team=${team}&password=${password}`
  )
}

const getCoords = async () => {
  const response = await fetch(`http://127.0.0.1:8080/?format=json`)
  const data = await response.json()
  return data
}

const fire = ([y, x]) => {
  fetch(
    `http://127.0.0.1:8080/fire?x=${x}&y=${y}&team=${team}&password=${password}`
  )
}

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const doMove = async () => {
  const { field } = await getCoords()

  let pari = true
  for (asseY of field) {
    for (blocco of asseY) {
      if (!blocco.hit) {
        if (blocco.x % 2 == 0 && pari) {
          fire([blocco.y, blocco.x])
          await timeout(1000)
        }
        if (blocco.x % 2 == 1 && !pari) {
          fire([blocco.y, blocco.x])
          await timeout(1000)
        }
      }
    }
    pari = !pari
    console.log(pari)
  }
}

signup()
;(async () => {
  while (true) {
    await doMove()
  }
})()
