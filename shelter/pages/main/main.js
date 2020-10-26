//constants
const pets = []; // array of pets got from local json file
const slider = []; //current slider elements
let sliderStartPosition = 0; //position from where starts filling
let sliderElements = 3;

//elements
const menuBtn = document.querySelectorAll('.menu__btn');
const overlay = document.querySelector('.overlay'); //side nav overlay
const overlayModal = document.querySelector('.modal-overlay'); // modal overlay
const modal = document.querySelector(".modal"); //modalElement
const closeModalBtn = document.querySelector(".close-modal");
let petCards = document.querySelectorAll('.pet__card'); //

//handlers
menuBtn.forEach(el => el.addEventListener('click',menuToggle) );
overlay.addEventListener('click',menuToggle);
overlayModal.addEventListener('click',toggleModal);
petCards.forEach(el => {
    el.addEventListener('click',toggleModal)
});
closeModalBtn.addEventListener('click', toggleModal);

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

function sliderElements2(){
    const prevSlider = [...slider]
    slider.length = 0;
    for(let i = 0; i < sliderElements; i++){
        let flag = true;
        let candidate;
        while(flag){
            const randInt = getRandomInt(0, pets.length-1);
            candidate = pets[randInt];
            let isDouble = prevSlider.filter( el => el.name === candidate.name).length > 0 ? true : false;
            let inCurrentList = slider.filter( el => el.name === candidate.name).length > 0 ? true : false;
            flag = isDouble || inCurrentList;
        }
        slider.push(candidate);
    }
    renderSlider();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderSlider(){
    petCards.forEach((el,index) => {
        const img = el.querySelector('img');
        const title = el.querySelector('.pet__card-title');
        const btn = el.querySelector('.pet__card_button');
        const currentPet = slider[index];
        el.dataset.petId = index;
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

///modal functions
function toggleModal(event){
    let display = modal.style.display;
    let id;
    if(event.target.parentNode.classList.contains('pet__card')){
        id = event.target.parentNode.dataset.petId;
    } else {
        id = event.target.parentNode.parentNode.dataset.petId;
    }
    const pet = slider[id];
    fillModal(pet);
    modal.style.display = display === 'block' ? 'none' : 'block';
    document.body.style.overflow = display === 'block' ? 'auto' : 'hidden';
    overlayModal.style.display = display === 'block' ? 'none' : 'block';
}

function fillModal(pet){
    if(pet === undefined) return;
    const img = modal.querySelector('.modal-img'),
            name = modal.querySelector('.pet-name'),
            type = modal.querySelector('.breed-type'),
            breed = modal.querySelector('.breed-breed'),
            description = modal.querySelector('.description'),
            age = modal.querySelector('.age'),
            inoculations = modal.querySelector('.inoculations'),
            diseases = modal.querySelector('.diseases'),
            parasites = modal.querySelector('.parasites');
    img.src = pet.img || '';
    name.textContent = pet.name || '';
    type.textContent = pet.type || '';
    breed.textContent = pet.breed || '';
    description.textContent = pet.description || '';
    age.textContent = pet.age || '';
    inoculations.textContent = pet.inoculations || '';
    diseases.textContent = pet.diseases || '';
    parasites.textContent = pet.parasites || '';
}