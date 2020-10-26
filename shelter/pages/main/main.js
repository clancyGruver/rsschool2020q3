//constants

//elements
const menuBtn = document.querySelectorAll('.menu__btn');
const overlay = document.querySelector('.overlay');

//handlers
menuBtn.forEach(el => el.addEventListener('click',menuToggle) );
overlay.addEventListener('click',menuToggle);

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
    } else {
        mainHeader.querySelector(".menu__btn").classList.remove("rotated");
        sideHeader.querySelector(".menu__btn").classList.remove("rotated");
        mainHeader.style.visibility = "visible";
        sideHeader.style.visibility = "hidden";
        document.getElementById("mySidenav").style.width = "0";
        document.querySelector(".overlay").style.visibility = "hidden";
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