//constants
const pets = []; // array of pets got from local json file
const slider = []; //current slider elements
let petCards = document.querySelectorAll('.pet__card'); //
let sliderStartPosition = 0; //position from where starts filling
let sliderElements = 3;

//elements
const menuBtn = document.querySelectorAll('.menu__btn');
const overlay = document.querySelector('.overlay');

//handlers
menuBtn.forEach(el => el.addEventListener('click',menuToggle) );
overlay.addEventListener('click',menuToggle);

window.onload = () => {
    setSliderElements();
    loadPets();
};
window.onresize = () => setSliderElements();

//functions
function menuToggle() {
    const sideHeader = document.querySelector(".side-header");
    const mainHeader = document.querySelector("header.header");
    const isShow = sideHeader.style.visibility !== "visible";

    if(isShow){
        mainHeader.querySelector(".menu__btn").classList.add("rotated");
        sideHeader.querySelector(".menu__btn").classList.add("rotated");
        sideHeader.style.visibility = "visible";
        mainHeader.style.visibility = "hidden";
        document.getElementById("mySidenav").style.width = "32rem";
        document.querySelector(".overlay").style.visibility = "visible";
        document.body.style.overflow = 'hidden';
    } else {
        mainHeader.querySelector(".menu__btn").classList.remove("rotated");
        sideHeader.querySelector(".menu__btn").classList.remove("rotated");
        mainHeader.style.visibility = "visible";
        sideHeader.style.visibility = "hidden";
        document.getElementById("mySidenav").style.width = "0";
        document.querySelector(".overlay").style.visibility = "hidden";
        document.body.style.overflow = 'auto';
    }
}

function aboutHandler(){
    const sideHeader = document.querySelector(".side-header");
    const mainHeader = document.querySelector("header.header");
    const isShow = sideHeader.style.visibility !== "visible";
    console.log(isShow);
    menuToggle();
    console.log(isShow);
    location.href = "#start";
}


//slider functions
function nextSliderElements(){
    slider.length = 0;
    let position = sliderStartPosition;
    for(let i = 0; i < sliderElements; i++){
        if(position < pets.length){
            slider.push(pets[position++]);
        } else {
            position = 0;
            slider.push(pets[position++]);
        }
    }
    renderSlider();
    sliderStartPosition = position;
}

function previousSliderElements(){
    slider.length = 0;
    let position = sliderStartPosition;
    for(let i = 0; i < sliderElements; i++){
        if(position >= 0){
            slider.push(pets[position--]);
        } else {
            position = pets.length - 1;
            slider.push(pets[position--]);
        }
    }
    renderSlider();
    sliderStartPosition = position;
}
function renderSlider(){
    petCards.forEach((el,index) => {
        const img = el.querySelector('img');
        const title = el.querySelector('.pet__card-title');
        const btn = el.querySelector('.pet__card_button');
        const currentPet = slider[index];
        btn.dataset.petId = index;
        img.src = currentPet.img;
        title.textContent = currentPet.name;
    });
}

function setSliderElements(){
/*
    При 1280px <= width в блоке слайда 3 питомца.
    При 768px <= width < 1280px в блоке слайда 2 питомца.
    При width < 768px в блоке слайда 1 питомец.
*/
    const width = window.innerWidth;
    if(width >= 1280){sliderElements = 3;}
    if(width < 1280 && width >= 768){sliderElements = 2;}
    if(width < 768){sliderElements = 1;}
    const cards = document.querySelectorAll('.pet__card');
    petCards = Array.from(cards).filter(el => window.getComputedStyle(el, null).display === 'flex');
}

async function loadPets(){
    let response = await fetch('./pets.json');
    if(response.ok){
        const json = await response.json();
        pets.push(...json);
        nextSliderElements();
    } else {
        alert('При загрузке петсов произошла ошибка');
    }
}