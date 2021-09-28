const fetch = require('node-fetch')
const dotenv = require('dotenv')
dotenv.config({ path: './private/.env' })
const blacklist = []
//la blacklist serve a non prendere più in considerazione le caselle già esaminate

const signup = async () => {
  const response = await fetch(
    `http://127.0.0.1:8080/signup?team=${process.env.NAME}&password=${process.env.PASSWORD}`
  )
}

const getCoords = async () => {
  const response = await fetch(`http://127.0.0.1:8080/?format=json`)
  const data = await response.json()
  return data
}

//field.length per esempio è 50 ma la posizione parte da 0 perciò ci saranno elementi da 0 a 49

const surroundShip = (field, shipY, shipX) => {
  //se la nave non si trova nel punto Y più in alto o più in basso
  if (shipY + 1 < field.length && shipY > 0) {
    //se è stata colpita una nave sotto
    if (field[shipY + 1][shipX].ship) {
      //se non hanno sparato nella casella sopra
      if (!field[shipY - 1][shipX].hit) {
        //spara alla casella sopra
        return [shipY - 1, shipX]
      }
      //se hanno colpito la nave  in Y e Y+1 ma Y-1 è vuota entra nella blacklist
      blacklist.push([shipY, shipX])
      return null
      //non colpisce nessuna nave e ricomincia il checkfield
    }
    //funzione opposta, se anche sopra ha trovato una nave guarda sotto
    if (field[shipY - 1][shipX].ship) {
      if (!field[shipY + 1][shipX].hit) {
        return [shipY + 1, shipX]
      }
      blacklist.push([shipY, shipX])
      return null
    }
  }

  //se la nave non si trova negli estremi X
  if (shipX < field.length - 1 && shipX > 0) {
    //se X+1 contiene una nave
    if (field[shipY][shipX + 1].ship) {
      //e X-1 non è stato colpito
      if (!field[shipY][shipX - 1].hit) {
        //colpisci X-1
        return [shipY, shipX - 1]
      }
      //altrimenti non colpire nulla e ricomincia con checkfield
      blacklist.push([shipY, shipX])
      return null
    }
    //funzione opposta
    if (field[shipY][shipX - 1].ship) {
      if (!field[shipY][shipX + 1].hit) {
        return [shipY, shipX + 1]
      }
      blacklist.push([shipY, shipX])
      return null
    }
  }

  //i seguenti if sono eseguiti se non c'è nessuna combinazione di navi

  //se la nave non si trova in Y = 0 colpisci sopra se la casella non è stata già colpita
  if (shipY > 0) {
    if (!field[shipY - 1][shipX].hit) {
      return [shipY - 1, shipX]
    }
  }

  //se la nave non si trova nel punto più basso del campo colpisci sotto
  if (shipY < field.length - 1) {
    if (!field[shipY + 1][shipX].hit) {
      return [shipY + 1, shipX]
    }
  }

  //se la nave non si trova ad X=0 colpisci a sinistra
  if (shipX > 0) {
    if (!field[shipY][shipX - 1].hit) {
      return [shipY, shipX - 1]
    }
  }

  //se la nave non si trova all'estremo destro di X colpisci a destra
  if (shipX < field.length - 1) {
    if (!field[shipY][shipX + 1].hit) {
      return [shipY, shipX + 1]
    }
  }

  //non avendo trovato nessuna possibilità di colpire la nave entra nella blacklist
  blacklist.push([shipY, shipX])
  return null
}

const checkField = (field) => {
  for (let asseY = 0; asseY < field.length; asseY++) {
    for (let asseX = 0; asseX < field.length; asseX++) {
      if (
        field[asseY][asseX].ship &&
        !blacklist.some(([shipY, shipX]) => shipY === asseY && shipX === asseX)
      ) {
        const nave = field[asseY][asseX].ship

        if (nave.alive) {
          const target = surroundShip(field, asseY, asseX)

          if (target) {
            console.log(`x: ${target[1]} y:${target[0]} `)
            return target
          }
        }
      }
    }
  }
  return null
}

const fire = ([y, x]) => {
  fetch(
    `http://127.0.0.1:8080/fire?x=${x}&y=${y}&team=${process.env.NAME}&password=${process.env.PASSWORD}`
  )
}

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const doMove = async () => {
  const { field } = await getCoords()
  const target = checkField(field)
  return target
}

signup()
;(async () => {
  while (true) {
    const target = await doMove()
    if (target) {
      fire(target)
      await timeout(1000)
    }
  }
})()
