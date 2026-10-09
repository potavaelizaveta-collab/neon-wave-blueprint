// эти переменные имеет область видимости всего документа
let container
let audioCtx
let oscillator

// оссилятор - не физический объект, который мы куда-либо вывели, он абстрактный, но мы можем к нему прикрепить интерфейс - например, слайдер
function createNewOscillator() {
  // create web audio api context
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // create Oscillator node
  oscillator = audioCtx.createOscillator(); // все после знака = лежит внутри переменной oscillator

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
  oscillator.connect(audioCtx.destination); // подключение оссилятора в колонки, destination - колонки, кот. находятся внутри аудиоконтекста
  oscillator.start();
}

function changeOscillatorFrequency() {
  const slider = document.getElementById('slider')
  oscillator.frequency.setValueAtTime(slider.value, audioCtx.currentTime); // value in hertz
}

function changeOscillatorType(type) {
  oscillator.type = type
}

function createSlider () {
  const slider = document.createElement('input')
  slider.type = 'range'
  slider.min = 0
  slider.max = 1000
  slider.value = 440
  slider.id = 'slider' // айди с помощью приравнивания добавляем
  container.appendChild(slider)

  slider.addEventListener('input', () => {
    changeOscillatorFrequency()
  })
}

function createButton(text, callback, parameter) { // здесь в скобках написан аргумент/параметр/проперти функцииы
  const button = document.createElement('div')
  button.innerText = text
  button.classList.add('button') // класс с помощью функции добалвяем
  container.appendChild(button)

  button.addEventListener('click', () => {
    callback(parameter)
  })
}

function createOscillatorTypeButtons () {
  const types = ['sine', 'square', 'sawtooth', 'triangle']
  types.forEach((type, i) => {
    createButton(type, changeOscillatorType, type)
  })
}

// загрузка аштимэмэля
document.addEventListener('DOMContentLoaded', () => {
  const frame = document.createElement('div')
  frame.innerText = 'Art Design & Coding Community'
  frame.classList.add('frame')

  container = document.getElementById('prototype_2')
  container.appendChild(frame)

  frame.addEventListener('click', () => {
    createNewOscillator()
    createSlider()
    createOscillatorTypeButtons()
  })
  console.log('Yo')
})
