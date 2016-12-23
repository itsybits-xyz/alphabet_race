let position = {}
let maxWidth = window.innerWidth

// Register event listeners
window.addEventListener('resize', (e) => {maxWidth = e.target.innerWidth})
window.addEventListener ('keydown', moveTruck)
window.addEventListener('load', drawPage)

function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function pickRandomN (items, n) {
  if (items.length < n) throw new RangeError(`Not enough elemnts to take. Requested: ${n} Available: ${items.length}`)
  selected = new Set()
  while (n) {
    const i = getRandomInt(0, items.length)
    if (!selected.has(items[i])) {
      selected.add(items[i])
      n--
    }
  }
  return Array.from(selected)
}

function getMilestone (letter) {
  return `<div class="milestone">
    <kbd>${letter}</kbd>
    </div>`
}

function getTrack (letter, truck) {
  return `<div class="track">
    ${truck}
    ${getMilestone(letter)}
  </div>`
}

function pickLetters (n) {
  const numbers = ['0', '1', '2', '3','4', '5', '6', '7', '8', '9']
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  return pickRandomN(letters.concat(numbers), n)
}

function buildTrucks (letters, n) {
  const truckImages = pickRandomN([...Array(46).keys()], n).map(x => `images/truck-${x}.png`)
  let trucks = []
  for (let i = 0; i < n ; i++) {
    const truck = `<div data-forward-key="${letters[i].charCodeAt(0)}" data-reverse-key="${letters[i].charCodeAt(0)}" class="truck"><img src="${truckImages[i]}"/></div>`
    trucks.push(truck)
  }
  return trucks
}

function drawPage () {
  const n = 3
  const letters = pickLetters(n * 2)
  const trucks = buildTrucks(letters, n)
  const tracks = document.querySelector(".tracks")
  for (let i = 0; i< n; i++) {
    tracks.innerHTML += getTrack(letters[i], trucks[i])
  }
  const domTrucks = document.querySelectorAll(".truck")
  domTrucks.forEach(truck => truck.addEventListener('transitionend', assignRank))
}

var rank = 0

function assignRank (e) {
  const truck = e.target
  if (truck.rank) {
    debugger
    truck.classList.add('winner')
    truck.innerHTML += `<div class='score'>${truck.rank}</div>`
  }
}

function moveTruck (e) {
  // backspace will reload the page.
  if (e.keyCode === 8) window.location.reload(false)
  const truck = document.querySelector(`.truck[data-forward-key="${e.keyCode}"]`)
  if (!truck || truck.classList.contains('winner')) return
  let pos = position[e.keyCode] || 0
  if (pos >= maxWidth - 200) return
  pos += 200
  // Check for victory
  if (pos >= maxWidth - 200) {
    pos = maxWidth - 200
    truck.rank = ++rank
  }
  truck.style.transform = `translateX(${pos}px)`
  position[e.keyCode] = pos
}
