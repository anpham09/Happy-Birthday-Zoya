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
    "The No butotn is feeling a little insecure now...",
    "Bestie! We both know there is only one correct answer.",
    "Okay, I am making this button smaller for legal reasons.😭",
    "You are REALLY saying no, huh?",
    "Last chance. The button is fighting for its life.🥺",
    "No privileges have officially been revoked 💙"
];

noButton.addEventListener("click", ()=>{
    noClicks++;

    const scale = Math.max(0.08, 1-noClicks*0.135);
    noButton.style.transform = `scale (${scale}) rotate(${noClicks % 2 ? -4 : 4}deg)`;

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

    if (noClicks >=7){
        noButton.style.opacity = "0.16";
        noButton.style.pointerEvents = "none";
        noButton.style.filter = "blur(1px)";
        noMessage.textContent = "No button privileges revoked. You know what to do bae 😌"
    }
});

function moveNoButton(){
    const stageRect = buttonStage.getBoundingClientRect();
    const buttonRect = noButton.getBoundingClientRect();

    const maxX = Math.max(20, stageRect.width * 0.2);
    const maxY = 25;

    const x = (Math.random() *2 -1) * maxX;
    const y = (Math.random() *2 -1) * maxY;

    const currentScale = Math.max(0.08, 1- noClicks * 0.135);
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

    const.markMissing = () => {
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
