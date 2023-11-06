const menu = document.querySelector("#menu_bars");
const navbar = document.querySelector(".Navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-x");
  navbar.classList.add("active");
  if (!menu.classList.contains("fa-x")) {
    navbar.classList.remove("active");
  }
};
//slider
const carouses = document.querySelectorAll(".carouse1, .carouse2, .carouse3");

carouses.forEach((carouse) => {
  const prevButton = carouse.querySelector("#prev");
  const nextButton = carouse.querySelector("#next");

  let currentCarousel;
  let isDragging = false;
  let startPosition = 0;
  let clickedPosition = 0; // Added to track the clicked position
  const scrollSpeed = 2; // Adjust this value to control the scrolling speed

  const preventTextSelection = () => {
    window.getSelection().removeAllRanges();
  };

  const dragStart = (e) => {
    isDragging = true;
    currentCarousel = e.currentTarget;

    // Update the clickedPosition
    clickedPosition = e.pageX - currentCarousel.offsetLeft;

    // Update the startPosition
    startPosition = clickedPosition - currentCarousel.scrollLeft;

    preventTextSelection();
  };

  const dragEnd = () => {
    isDragging = false;
  };

  const dragging = (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const newPosition = e.pageX - currentCarousel.offsetLeft;
    const scrollDelta = (newPosition - clickedPosition) * scrollSpeed;

    const minScroll = 0;
    const maxScroll = currentCarousel.scrollWidth - currentCarousel.clientWidth;
    const newScrollLeft = Math.max(
      minScroll,
      Math.min(maxScroll, currentCarousel.scrollLeft - scrollDelta)
    );
    currentCarousel.scrollLeft = newScrollLeft;
  };

  carouse.addEventListener("mousedown", dragStart);
  carouse.addEventListener("mouseup", dragEnd);
  carouse.addEventListener("mouseleave", dragEnd);
  carouse.addEventListener("mousemove", dragging);

  prevButton.addEventListener("click", () => {
    currentCarousel.scrollLeft -= 100; // Adjust this value to control navigation distance
  });

  nextButton.addEventListener("click", () => {
    currentCarousel.scrollLeft += 100; // Adjust this value to control navigation distance
  });
});

const links = document.querySelectorAll(".global_button");

links.forEach((link) => {
  const dropdown = link.nextElementSibling;

  link.addEventListener("click", () => {
    dropdown.classList.toggle("show");
    dropdown.classList.add("active");
  });

  document.addEventListener("click", (event) => {
    if (event.target === dropdown) {
      dropdown.classList.remove("show");
      dropdown.classList.remove("active");
    }
  });
});

window.onscroll = function () {
  onScrollFun();
};
function onScrollFun() {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    document.querySelector("#scroll-top").style.display = "block";
  } else {
    document.querySelector("#scroll-top").style.display = "none";
  }
}
//googlesheet
const scriptURL =
  "https://script.google.com/macros/s/AKfycbxbF-lH-COYB-ZYbUxhX552FK3zLwVi00GGwIhbCi4j4zveDjpY3Y1tZKTGiKMe1JdgYA/exec";

const form = document.forms["contact-form"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) =>
      alert("Thank you! your form is submitted successfully.")
    )
    .then(() => {
      window.location.reload();
    })
    .catch((error) => console.error("Error!", error.message));
});
//voiceinput
const voiceToggle = document.getElementById("voice-toggle");
const inputField = document.getElementById("input-field");

let recognition = null;
let isListening = false;

function handleButtonClick(event) {
  inputField.value += event.target.textContent;
}

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    if (!isListening) {
      return;
    }

    const speechResult = event.results[0][0].transcript.toLowerCase().trim();
    if (speechResult.includes("undo")) {
      const words = inputField.value.split(/\s+/); // Split input into words
      words.pop(); // Remove the last word
      inputField.value = words.join(" ");
    } else {
      inputField.value += speechResult;
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  voiceToggle.addEventListener("change", () => {
    isListening = voiceToggle.checked;

    if (isListening) {
      recognition.start();
    } else {
      // Only stop speech recognition when the toggle is switched off
      recognition.stop();
    }
  });
} else {
  console.error("Speech recognition is not supported in this browser.");
  voiceToggle.disabled = true;
}
