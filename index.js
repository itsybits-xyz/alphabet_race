let position = {}
let maxWidth = window.innerWidth

// Register event listeners
window.addEventListener('resize', (e) => {maxWidth = e.target.innerWidth})
window.addEventListener ('keydown', moveRacer)
window.addEventListener('load', drawPage)

function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function pickRandomN (items, n) {
  if (items.length < n) throw new RangeError(`Not enough elements to take. Requested: ${n} Available: ${items.length}`)
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
  return `<div class="milestone" data-forward-key="${letter.charCodeAt(0)}">
    <kbd>${letter}</kbd>
    </div>`
}

function getTrack (letter, racer) {
  return `<div class="track">
    ${racer}
    ${getMilestone(letter)}
  </div>`
}

function pickLetters (n) {
  const numbers = ['0', '1', '2', '3','4', '5', '6', '7', '8', '9']
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  return pickRandomN(letters.concat(numbers), n)
  //return pickRandomN(letters, n)
}

function buildRacers (letters, n) {
  const racerImages = pickRandomN([...Array(46).keys()], n).map(x => `images/racer-${x}.png`)
  let racers = []
  for (let i = 0; i < n ; i++) {
    const racer = `<div data-forward-key="${letters[i].charCodeAt(0)}" data-reverse-key="${letters[i].charCodeAt(0)}" class="racer"><img src="${racerImages[i]}"/></div>`
    racers.push(racer)
  }
  return racers
}

function drawPage () {
  const n = 3
  const letters = pickLetters(n * 2)
  const racers = buildRacers(letters, n)
  const tracks = document.querySelector('.tracks')
  for (let i = 0; i< n; i++) {
    tracks.innerHTML += getTrack(letters[i], racers[i])
  }
  window.setTimeout(() => {
    const flash = document.querySelector('.flash')
    flash.style.visibility = 'hidden'
  }, 1500)
  const domRacers = document.querySelectorAll(".racer")
  domRacers.forEach(racer => racer.addEventListener('transitionend', assignRank))
  const domMilestones = document.querySelectorAll(".milestone")
  domMilestones.forEach(milestone => milestone.addEventListener('transitionend', removeTransition))
}

var rank = 0

function assignRank (e) {
  const racer = e.target
  if (racer && racer.rank) {
    racer.classList.add('winner')
    racer.innerHTML += `<div class='score'>${racer.rank}</div>`
    const applause = new Audio(`sounds/applause.wav`)
    applause.currentTime = 0
    applause.play()
  }
}

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('pressed');
}

function moveRacer (e) {
  // backspace will reload the page.
  if (e.keyCode === 8) window.location.reload(false)

  const milestone = document.querySelector(`.milestone[data-forward-key="${e.keyCode}"]`)
  if (milestone) milestone.classList.add('pressed')

  const racer = document.querySelector(`.racer[data-forward-key="${e.keyCode}"]`)
  if (!racer || racer.classList.contains('winner')) return
  const letter = String.fromCharCode(e.keyCode).toLowerCase()
  const letterSound = new Audio(`sounds/${letter}.wav`)
  letterSound.currentTime = 0
  letterSound.play()
  let pos = position[e.keyCode] || 0
  if (pos >= maxWidth - 200) return
  pos += 200
  // Check for victory
  if (pos >= maxWidth - 200) {
    pos = maxWidth - 200
    racer.rank = ++rank
  }
  racer.style.transform = `translateX(${pos}px)`
  position[e.keyCode] = pos
}
