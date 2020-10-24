// DOM Elements
const time = document.querySelector('#time'),
greeting = document.querySelector('#greeting'),
name = document.querySelector('#name'),
focus = document.querySelector('#focus'),
city = document.querySelector('#city'),
date = document.querySelector('#date'),
nextImageBtn = document.querySelector('#next-image'),
nextQuoteBtn = document.querySelector('#next-quote'),
blockquote = document.querySelector('#blockquote');

const weatherElements = {
  weatherIcon: document.querySelector('.weather-icon'),
  temperature: document.querySelector('#temperature'),
  windSpeed: document.querySelector('#wind-speed'),
  humidity: document.querySelector('#humidity'),
  weatherDescription: document.querySelector('#weather-description'),
};

//text templates
const fieldTemplates = {
  name: '[Введите имя]',
  city: '[Дефолт сити]',
  focus: '[Введите цель]',
};

// russian dates
const phrases = {
  'morning': 'С добрым утром!',
  'day': 'Добрый день!',
  'evening': 'Добрейший вечерочек!',
  'night': 'Доброй ночи!',
};
const dayOfWeek = {
  0: 'Воскресенье',
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
};
const months = {
  0: 'Января',
  1: 'Февраля',
  2: 'Марта',
  3: 'Апреля',
  4: 'Мая',
  5: 'Июня',
  6: 'Июля',
  7: 'Августа',
  8: 'Сентября',
  9: 'Октября',
  10: 'Ноября',
  11: 'Декабря',
};

//application options
const images = [];
let previousText = '',
    currentImage = 0,
    firstImage = true;


//ShowTime
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    minutes = today.getMinutes(),
    seconds = today.getSeconds();

    // output time
    time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(minutes)}<span>:</span>${addZero(seconds)}`;

    if(isTimeForChangeImage(today)){
      currentImage = hour - 1;
      changeImage();
    }

    showDate();
    setTimeout(showTime, 1000);
}

function showDate(){
  const today = new Date();
  const result = `${dayOfWeek[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  date.textContent = result;
}

//Add zero
function addZero(number) {
  return (parseInt(number, 10) > 9) ? number : '0' + number;
}

//set background and Greeting
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours(),
    period = whatDayPeriod(hour);

  greeting.textContent = phrases[period];

  if (firstImage) {
    firstImage = false;
    document.body.style.backgroundImage = `url(${images[hour-1]})`;
  }
}

//getters

function setFields(){
  const fields = ['name', 'focus', 'city'];
  for (let field of fields){
    const htmlEl = document.querySelector(`#${field}`);
    const localVal = localStorage.getItem(field);
    if(localVal === null || localVal === ''){
      htmlEl.textContent = fieldTemplates[field];
    } else {
      htmlEl.textContent = localVal;
    }
  }
}

//get name
function getName() {
  const localName = localStorage.getItem('name');
  if(localName === null || localName === ''){
    name.textContent = nameTemplate;
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

//get focus
function getFocus() {
  const localFocus = localStorage.getItem('focus');
  if(localFocus === null || localFocus === ''){
    focus.textContent = focusTemplate;
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

//handlers
function focusHandler(event){
  previousText = event.target.textContent;
  clearField(event.target);
}

function blurHandler(event){
  const target = event.target;
  const targetText = event.target.textContent;
  const idName = target.attributes.id.nodeValue;
  if (targetText == ''){
    event.target.textContent = previousText;
  } else {
    localStorage.setItem(idName, event.target.textContent);
    if(idName === 'city'){
      getWeather();
    }
  }
}

//setters
function clearField(target){
  target.textContent = '';
}

//set name
function setField(event){
  if (event.type === 'keypress'){
    if (event.which == 13 || event.keyCode == 13){
      event.target.blur();
    }
  }
}

//additional functions
function isTimeForChangeImage(date){
  minutes = date.getMinutes();
  seconds = date.getSeconds();
  return minutes === 0 && seconds === 0 ? true : false;
}

function changeImage(){
  currentImage = currentImage < 24 ? currentImage : 0;
  const body = document.body;
  const src = images[++currentImage];
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {
    body.style.backgroundImage = `url(${src})`;
  };
}

function fillImages(){
  for(let i = 0; i < 24; i++){
    let number = getRandomInt(1,20);
    number = number > 9 ? number : addZero(number);
    let imageUrl = `./assets/images/${whatDayPeriod(i)}/${number}.jpg`;
    images.push(imageUrl);
  }
}

function whatDayPeriod(hour){
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18) return 'evening';
  if (hour < 6) return 'night';
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextImageClickHandler(){
  changeImage();
}

async function setQuote(){
  const url = 'https://api.adviceslip.com/advice';

  const res = await fetch(
    url, {
      cache: "no-cache", // no-store, reload, no-cache, force-cache или only-if-cached
  });
  if (res.ok) {
    const data = await res.json();
    blockquote.textContent = data.slip.advice;
  } else {
    alert("Ошибка HTTP: " + res.status);
  }
}

async function getWeather() {
  const apiKey = '426976a259e01c3a6c1b4037c2b0f7b3';
  //const apiKey = '08f2a575dda978b9c539199e54df03b0';
  const city = localStorage.getItem('city');
  if(!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    weatherElements.weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    weatherElements.temperature.textContent = `${data.main.temp}°C`;
    weatherElements.humidity.textContent = `${data.main.humidity}%`;
    weatherElements.windSpeed.textContent = `${data.wind.speed} м/с`;
    weatherElements.weatherDescription.textContent = data.weather[0].description;
  } else {
    if(res.status === 404){
      alert(`Для города ${city} нет данных о погоде`);
    } else {
      alert("Ошибка HTTP: " + res.status);
    }
  }
}

name.addEventListener('focus', focusHandler);
name.addEventListener('keypress', setField);
name.addEventListener('blur', blurHandler);

focus.addEventListener('focus', focusHandler);
focus.addEventListener('keypress', setField);
focus.addEventListener('blur', blurHandler);

city.addEventListener('focus', focusHandler);
city.addEventListener('keypress', setField);
city.addEventListener('blur', blurHandler);

nextImageBtn.addEventListener('click', nextImageClickHandler);
nextQuoteBtn.addEventListener('click', setQuote);

//RUN
fillImages();
showTime();
setBgGreet();
setFields();
setQuote();
getWeather();