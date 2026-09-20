const instroScreen = document.querySelector("#intro-screen");
const galleryScreen = document.querySelector("#gallery-screen");
const letterScreen = document.querySelector("#letter-screen");

const yesButton = document.querySelector("#yes-btn");
const noButton = document.querySelector("#no-btn");
const noMessage = document.querySelector("#no-message");
const messageBox = document.querySelector(".message-box");
const buttonStage = document.querySelector("#button-stage");

const openLetterButton = document.querySelector("#open-letter-btn");
const envelope = document.querySelector("#envelope");
const letterPaper = document.querySelector("#letter-paper");
const finalSurprise = document.querySelector("#final-surprise");
const celebrateButton = document.querySelector("#celebrate-btn");

let noClicks = 0;
let letterOpened = false;

// const birthdayLock = document.querySelector("#birthday-lock");
// const mainWebsite = document.querySelector("main");
// const countdownDays = document.querySelector("#countdown-days");
// const countdownHours = document.querySelector("#countdown-hours");
// const countdownMinutes = document.querySelector("#countdown-minutes");
// const countdownSeconds = document.querySelector("#countdown-seconds");
// const nextBirthdayText = document.querySelector("#next-birthday-text");

// function checkBirthday(){
//     const now = new Date();
//     const month = now.getMonth();
//     const day = now.getDate();

//     if (month ===9 && day ===3){
//         birthdayLock.style.display = "none";
//         mainWebsite.style.display = "";

//         return;
//     }
//     birthdayLock.style.display = "grid";
//     mainWebsite.style.display = "none";

//     let nextBirthdayYear = now.getFullYear();

//     if(month > 9 || (month === 9 && day >3)){
//         nextBirthdayYear++;
//     }
//     const nextBirthday = new Date(nextBirthdayYear, 9,3,0,0,0);
//     const difference = nextBirthday - now;
//     const days = Math.floor(difference /(1000*60*60*24));
//     const hours = Math.floor(difference/(1000*60*60)%24);
//     const minutes = Math.floor(difference/(1000*60)%60);
//     const seconds = Math.floor(difference/1000%60);

//     countdownDays.textContent = days;
//     countdownHours.textContent = hours;
//     countdownMinutes.textContent = minutes;
//     countdownSeconds.textContent= seconds;

//     const birthdayNumber = 18 + (nextBirthdayYear - 2026);

//     nextBirthdayText.textContent = `Until Birthday #${birthdayNumber} ✦ October 3, ${nextBirthdayYear}`;
// }

// checkBirthday();
// setInterval(checkBirthday, 1000)

function createStars(){
    const starContainer = document.querySelector("#stars");
    const amount = window.innerWidth < 600 ? 45 :85;

    for(let i = 0; i<amount; i++){
        const star = document.createElement("span");
        star.className = "star";

        if(Math.random()>0.9){
            star.classList.add("star-cute");
        }
        const size = Math.random() *2.7+1;

        star.style.left = `${Math.random()*100}%`;
        star.style.top = `${Math.random()*100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty("--duration", `${2+Math.random() *4}s`);
        star.style.setProperty("--delay", `${Math.random() *4}s`);
        star.style.setProperty("--opacity", `${0.25+Math.random() *0.7}`);

        starContainer.appendChild(star);
    }
}

createStars();

const noMessages = [
    "For real... why did you click that? 😭",
    "Excuse me?? Please reconsider 🥺",
    "The No button is feeling a little insecure now...",
    "Bestie! We both know there is only one correct answer.",
    "Okay, I am making this button smaller for legal reasons.😭",
    "You are REALLY saying no, huh?",
    "Last chance. The button is fighting for its life.🥺",
    "No privileges have officially been revoked 💙"
];

noButton.addEventListener("click", ()=>{
    noClicks++;

    const scale = Math.max(0.08, 1-noClicks*0.11);
    noButton.style.transform = `scale(${scale}) rotate(${noClicks % 2 ? -4 : 4}deg)`;

    const yesScale = Math.min(1.22,1 + noClicks * 0.028);
    yesButton.style.transform = `scale(${yesScale})`;

    if(noClicks >=2&& noClicks<=6){
        moveNoButton();
    }

    noMessage.textContent = noMessages[Math.min(noClicks-1, noMessages.length-1)];

    messageBox.classList.remove("pop");
    void messageBox.offsetWidth;
    messageBox.classList.add("pop");

    makeSparklesFromElement(noButton, 6);
    tinyBeep(220-noClicks * 12, 0.06);

    if (noClicks >=8){
        noButton.style.opacity = "0.16";
        noButton.style.pointerEvents = "none";
        noButton.style.filter = "blur(1px)";
        noMessage.textContent = "No button privileges revoked. You know what to do bae 😘"
    }
});

function moveNoButton(){
    const stageRect = buttonStage.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();

    const maxX = Math.max(20, stageRect.width * 0.2);
    const maxY = 25;

    const x = (Math.random() *2 -1) * maxX;
    const y = (Math.random() *2 -1) * maxY;

    const currentScale = Math.max(0.08, 1- noClicks * 0.11);
    noButton.style.transform =
        `translate(${x}px, ${y}px) scale(${currentScale}) rotate(${noClicks %2 ? -4 : 4}deg)`;

}

yesButton.addEventListener("click", ()=> {
    tinyChime();
    burstConfetti(110);

    noMessage.textContent = "Correct answer detected!!✨";

    setTimeout(()=> {
        switchScreen(instroScreen, galleryScreen);
        initializeGalleryReveal();
    }, 650);

});

function switchScreen(from, to){
    from.classList.remove("screen-active");
    to.classList.add("screen-active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll(".photo-shell img").forEach((image)=>{
    const shell = image.closest(".photo-shell");

    const markMissing = () => {
        shell.classList.add("image-missing");

    };
    image.addEventListener("error", markMissing);
    if (image.complete && image.naturalWidth ===0){
        markMissing();
    }
});

document.querySelectorAll(".memory-card").forEach((card)=>{
    card.addEventListener("click", ()=>{
        card.classList.toggle("is-flipped");
        makeSparklesFromElement(card, 4);
        tinyBeep(card.classList.contains("is-flipped") ? 520 : 420, 0.045);

    });
});

let revealObserver;
function initializeGalleryReveal(){
    const revealItems = document.querySelectorAll("#gallery-screen .reveal");

    revealObserver = new IntersectionObserver(
        (entries)=> {
            entries.forEach((entry)=>{
                if(entry.isIntersecting){
                    entry.target.classList.add("revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {threshold: 0.14}
    );
    revealItems.forEach((item, index)=>{
        item.style.animationDelay = `${Math.min(index* 0.07, 0.25)}s`;
        revealObserver.observe(item);
    });
}

openLetterButton.addEventListener("click", ()=>{
    burstConfetti(65);
    tinyChime();

    switchScreen(galleryScreen, letterScreen);
});

envelope.addEventListener("click", ()=>{
    if(letterOpened) return;
    letterOpened = true;
    envelope.classList.add("open");
    tinyChime();

    setTimeout(()=>{
        letterPaper.classList.add("visible");
        finalSurprise.classList.add("visible");

        setTimeout(()=>{
            letterPaper.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 150);
    }, 900);
});

celebrateButton.addEventListener("click", ()=>{
    burstConfetti(220);
    tinyChime();
    makeSparklesFromElement(celebrateButton, 18);

    celebrateButton.textContent = "HAPPY BIRTHDAY!!! 💙💙💙";
    celebrateButton.disabled = true;

    setTimeout(()=>{
        celebrateButton.disabled = false;
        celebrateButton.textContent = "Again!! ✨";
    }, 2200);
});


function burstConfetti(amount = 100){
    const layer = document.querySelector("#confetti-layer");

    const colors = ["#ffd6e8","#9fc9ff","#d9ccff","#fff5bd","#ffffff","#5f8fd4"];
    for (let i =0; i<amount; i++){
        const piece = document.createElement("span");
        piece.className = "confetti-piece";

        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];

        piece.style.width = `${6+Math.random() * 7}px`;
        piece.style.height = `${9+Math.random() * 11}px`;

        piece.style.borderRadius = Math.random()>0.55?"50%":"2px";

        piece.style.setProperty("--fall-duration", `${2.6 + Math.random() * 2.8}s`);
        piece.style.setProperty("--drift", `${-140 + Math.random() * 280}px`);
        piece.style.setProperty("--spin", `${360 + Math.random() * 900}deg`);

        layer.appendChild(piece);
        setTimeout(()=> piece.remove(), 5800);
    }
}

function makeSparklesFromElement(element, amount = 6){
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;

    for(let i = 0; i < amount; i++){
        const sparkle = document.createElement("span");
        sparkle.className = "click-sparkle";
        sparkle.textContent = Math.random() >0.5? "✦" : "♡";

        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.setProperty("--x", `${-70 + Math.random()*140}px`);
        sparkle.style.setProperty("--y", `${-65 + Math.random()*130}px`);
        sparkle.style.fontSize = `${10 + Math.random() * 10}px`;

        document.querySelector("#sparkle-layer").appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 750);
    }
}

function tinyBeep(frequency = 440, duration = 0.05){
    try{
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+duration);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + duration);

        oscillator.addEventListener("ended", ()=>ctx.close());

    } catch(error){
        //in case the sound doesnt work, the web still works
    }
}

function tinyChime(){
    tinyBeep(523.25, 0.11);

    setTimeout(()=> tinyBeep(659.25, 0.11), 95);
    setTimeout(()=> tinyBeep(783.99, 0.16), 190);
}

document.addEventListener("pointerdown", (event) =>{
    if (event.target.closest("button, .memory-card")) return;

    const sparkle = document.createElement("span");
    sparkle.className = "click-sparkle";
    sparkle.textContent = "✦";
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    sparkle.style.setProperty("--x", `${-20 + Math.random()*40}px`);
    sparkle.style.setProperty("--y", `${-35 - Math.random()*35}px`);

    document.querySelector("#sparkle-layer").appendChild(sparkle);
    setTimeout(()=> sparkle.remove(), 750);
})