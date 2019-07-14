// CSS
import './style.css'


// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

// State
let timer = 60
let units = 'M'
let timerOn = false
let mouseDown = false
let showVerbalTime = false

// Selectors
const startButton = document.getElementById('start')
const switchControlButton = document.getElementById('switch-control')
const addControlButton = document.getElementById('add-control')
const decControlButton = document.getElementById('dec-control')
const resetControlButton = document.getElementById('reset-control')
const countdown = document.getElementById('countdown')
const controls = document.querySelector('.controls')

// Event listeners
switchControlButton.addEventListener('click', () => {
  units = units === 'M' ? 'S' : 'M'
  switchControlButton.textContent = units
})

resetControlButton.addEventListener('click', () => {
  timer = 60
  displayTime(timer)
})

document.addEventListener('mouseup', () => {
  mouseDown = false
})

addControlButton.addEventListener('mousedown', (e) => {
  setTimer(e, 'add')
})

addControlButton.addEventListener('mouseup', (e) => {
  setTimer(e, 'add')
})

decControlButton.addEventListener('mousedown', (e) => {
  setTimer(e, 'dec')
})

decControlButton.addEventListener('mouseup', (e) => {
  setTimer(e, 'dec')
})

// Start the timer.
startButton.addEventListener('click', () => {
  var stopTime = Date.now() + (timer * 1000) + 1000
  timerOn = !timerOn

  function timeChecker () {
    var now = Date.now()
    var secondsLeft = Math.floor((stopTime - now) / 1000)

    if (stopTime <= now) {
      timerOn = false
      displayTime(timer)
      UITimerStopped()
      alert('Time\'s up!')
    } else if (!timerOn) {
      timer = secondsLeft
      UITimerStopped()
    } else {
      displayTime(secondsLeft)
      // Run the function again with a delay of 50 milliseconds.
      setTimeout(timeChecker, 50)
    }
  }

  if (timerOn) {
    UITimerRunning()
    // Start the timeChecker loop with a delay of one second.
    setTimeout(timeChecker, 1000)
  } else {
    startButton.textContent = 'Start'
  }
})

// Change from numbers to cardinal verbals/numerals.
countdown.addEventListener('click', () => {
  showVerbalTime = !showVerbalTime
  countdown.classList.toggle('verbals')
  displayTime(timer)
})

// Sets the timer. takes event and action (add or dec) as arguments.
function setTimer (e, action) {
  function setTime (action) {
    const secondsToChange = units === 'M' ? 60 : 1
    if (action === 'add') {
      if ((timer + secondsToChange) > 3600) return
      timer = timer + secondsToChange
    } else {
      if ((timer - secondsToChange) < 1) return
      timer = timer - secondsToChange
    }
    displayTime(timer)
  }

  if (e.type === 'mousedown') {
    mouseDown = true
    setTime(action)
    var delaySetTimeInterval = setTimeout(function () {
      var setTimeInterval = setInterval(function () {
        if (mouseDown && e.type === 'mousedown') {
          setTime(action)
        } else {
          clearInterval(setTimeInterval)
        }
      }, 100)
    }, 1000)
  } else {
    clearTimeout(delaySetTimeInterval)
  }
}

// Change the user interface
function UITimerRunning () {
  startButton.textContent = 'Stop'
  controls.style.display = 'none'
}

function UITimerStopped () {
  startButton.textContent = 'Start'
  controls.style.display = ''
}

// Format the time and display it on the page
function displayTime (secondsLeft) {
  var minutes
  var seconds
  if (secondsLeft === 3600) {
    minutes = 60
  } else {
    minutes = Math.floor((secondsLeft % 3600) / 60)
  }
  seconds = Math.floor((secondsLeft % 3600) % 60)

  if (showVerbalTime) {
    countdown.textContent = verbalTime(minutes, seconds)
  } else {
    seconds = seconds > 9 ? seconds : '0' + seconds
    minutes = minutes > 9 ? minutes : '0' + minutes
    countdown.textContent = minutes + ':' + seconds
  }
}

function verbalTime (minutes, seconds) {
  const verbals = { 0: '', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty', 30: 'thirty', 40: 'fourty', 50: 'fifty', 60: 'sixty' }

  function getVerbal (number) {
    if (number > 20) {
      const firstNumber = verbals[parseInt(number.toString()[0]) * 10]
      const lastNumber = verbals[parseInt(number.toString()[1])]
      return firstNumber + lastNumber
    } else if (number === 0) {
      return ''
    } else {
      return verbals[number]
    }
  }

  function addS (n) {
    return n === 1 ? '' : 's'
  }

  const minuteText = minutes ? `${getVerbal(minutes)} minute${addS(minutes)}${seconds && minutes ? ' and ' : ''}` : ''
  const secondText = seconds !== 0 ? getVerbal(seconds) + ' second' + addS(seconds) : ''
  return minuteText + secondText
}

// Initial set timer
displayTime(timer)
