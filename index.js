// vars and elements
const turn_on = document.querySelector("#turn_on");
const jarvis_intro = document.querySelector("#j_intro");
const time = document.querySelector("#time");
const machine = document.querySelector(".machine");
// const msgs = document.querySelector(".messages");
// whether the recognition is stopiing on my command or automatically
let stopingR = false;
// friday's commands
let fridayComs = [];
fridayComs.push("hi assistant");
fridayComs.push("what are your commands");
fridayComs.push("close this - to close opened popups");
fridayComs.push(
  "change my information - information regarding your accounts and you"
);
fridayComs.push("whats the weather or temperature");
fridayComs.push("show the full weather report");
fridayComs.push("are you there - to check fridays presence");
fridayComs.push("shut down - stop voice recognition");
fridayComs.push("open google");
fridayComs.push('search for "your keywords" - to search on google ');
fridayComs.push("open whatsapp");
fridayComs.push("open youtube");
fridayComs.push('play "your keywords" - to search on youtube ');
fridayComs.push("close this youtube tab - to close opened youtube tab");
fridayComs.push("open netlify");
fridayComs.push("open twitter");
fridayComs.push("open instagram");
fridayComs.push("open github");
fridayComs.push("open linkedin")
fridayComs.push("open facebook")

// youtube window
let ytbWindow;

// create a new message
// function createMsg(who, msg) {
//   let newmsg = document.createElement("p");
//   newmsg.innerText = msg;
//   newmsg.setAttribute("class", who);
//   msgs.appendChild(newmsg);
// }

// show a warn to check for all the commands
console.warn('*to check for the commands speak "what are your commands"');

// date and time
let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

// this is what friday tells about weather
let weatherStatement = "";
let charge, chargeStatus, connectivity, currentTime
chargeStatus = "unplugged"

window.onload = () => {
  turn_on.play();
  turn_on.addEventListener("ended", () => {
    setTimeout(() => {
      // autoJarvis();
      readOut("Ready to go");
      if (localStorage.getItem("jarvis_setup") === null) {
        readOut(
          "Please tell me about your self"
        );
      }
    }, 200);
  });

  fridayComs.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p>#${e}</p><br />`;
  });
  // battery
  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  // internet connectivity

  if (navigator.onLine) {
    document.querySelector("#internet").textContent = "online "
    connectivity = "online"
  } else {
    document.querySelector("#internet").textContent = "offline "
    connectivity = "offline"
  }

  setInterval(() => {
    if (navigator.onLine) {
      document.querySelector("#internet").textContent = "online "
      connectivity = "online"
    } else {
      document.querySelector("#internet").textContent = "offline "
      connectivity = "offline"
    }
  }, 60000);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${(batteryObject.level * 100).toFixed(0)
      }%`;
    charge = batteryObject.level * 100
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${(batteryObject.level * 100).toFixed(0)
        }%Charging`;
      chargeStatus = "plugged in"
    }
  }

  // timer
  // setInterval(() => {
  //   let date = new Date();
  //   let hrs = date.getHours();
  //   let mins = date.getMinutes();
  //   let secs = date.getSeconds();
  //   time.textContent = `${hrs} : ${mins} : ${secs}`;
  // }, 1000);
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  currentTime = strTime
  time.textContent = strTime
}

formatAMPM(date)
setInterval(() => {
  formatAMPM(date)
}, 60000);

// auto quick ai

function autoJarvis() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}

// 
// start jarvis with btn
var voiceImage = document.getElementById("voiceimg")
document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
  voiceImage.src = "Voice.gif"
  recognition.start();
})


document.querySelector("#stop_jarvis_btn").addEventListener("click", () => {
  stopingR = true;
  voiceImage.src = "voicestart.png"
  recognition.stop();
  document.querySelector("#stop_jarvis_btn").style.display = "none"
})

// show waether
function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `${data.name}`;
      weatherCont[1].textContent = `,${data.sys.country}`;
      // weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      // weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[2].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCont[3].textContent = `Temperature : ${ktc(
        data.main.temp
      )} ℃`;
      // weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
      // weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
      // weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
      weatherStatement = `The weather in ${data.name} is ${data.weather[0].description
        } and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather Info Not Found";
    }
  };

  xhr.send();
}

// convert kelvin to celcius
function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

if (localStorage.getItem("jarvis_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
}

// friday information setup

const setup = document.querySelector(".jarvis_setup");
setup.style.display = "none";
if (localStorage.getItem("jarvis_setup") === null) {
  setup.style.display = "block";
  setup.querySelector("button").addEventListener("click", userInfo);
}

function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    bio: setup.querySelectorAll("input")[1].value,
    location: setup.querySelectorAll("input")[2].value
  };

  let testArr = [];

  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value);
  });

  if (testArr.includes("")) {
    readOut("Please enter your complete information");
  } else {
    localStorage.clear();
    localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo));
    setup.style.display = "none";
    weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
  }
}

// speech recognition

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;

var synth = window.speechSynthesis;
// const speech = new SpeechSynthesisUtterance();

recognition.onstart = function () {
  console.log("voice recognition activated");
  document.querySelector("#stop_jarvis_btn").style.display = "flex"
};

// arr of window
let windowsB = []

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  console.log(transcript)
  let userData = JSON.parse(localStorage.getItem("jarvis_setup"));
  // createMsg("usermsg", transcript);
  // commands
  // hi - hello
  if (transcript.includes("hi assistant")||transcript.includes("hi quickai")) {
    readOut(`hello ${userData.name}, how can I assist you?`);
  }
  // some casual commands
  if (transcript.includes("what's the current charge")) {
    readOut(`the current charge is ${charge}`);
  }
  if (transcript.includes("what's the charging status")) {
    readOut(`the current charging status is ${chargeStatus}`);
  }
  if (transcript.includes("current time")) {
    readOut(currentTime);
  }
  if (transcript.includes("connection status")) {
    readOut(`you are ${connectivity} `);
  }
  // jarvis commands
  if (transcript.includes("what are your commands") || transcript.includes("what are your command") || transcript.includes("commands")) {
    readOut("here's the list of commands i can follow");
    if (window.innerWidth <= 400) {
      window.resizeTo(screen.width, screen.height)
    }
    document.querySelector(".commands").style.display = "block";
  }
  if(document.querySelector(".commands").style.display=="block" && document.querySelector(".jarvis_setup").style.display=="block"){
    document.querySelector(".commands").style.display="none"
  }
  // jarvis bio
  if (transcript.includes("tell about yourself") || transcript.includes("who are you") || transcript.includes("tell me about yourself") || transcript.includes("who created you") || transcript.includes("what's your name")) {
    readOut(
      "i am Quick AI a voice asistant created by Izhaar Ashraf. I can do anything which can be done from a browser."
    );
  }

  // close popups
  if (transcript.includes("close this")) {
    readOut("closing the tab");
    document.querySelector(".commands").style.display = "none";
    if (window.innerWidth >= 401) {
      window.resizeTo(250, 250)
    }
    setup.style.display = "none";
  }

  // info change
  if (transcript.includes("change my information")) {
    readOut("Opening the information tab");
    localStorage.clear();
    document.querySelector(".commands").style.display = "none";

    if (window.innerWidth <= 400) {
      window.resizeTo(screen.width, screen.height)
    }
    setup.style.display = "block";
    setup.querySelector("button").addEventListener("click", userInfo);
  }


  // weather report
  if (
    transcript.includes("what's the temperature")
  ) {
    readOut(weatherStatement);
  }

  if (transcript.includes("full weather report")) {
    readOut("opening the weather report");
    let a = window.open(
      `https://www.google.com/search?q=weather+in+${JSON.parse(localStorage.getItem("jarvis_setup")).location
      }`
    );
    windowsB.push(a)
  }
  // availability check
  if (transcript.includes("are you there")) {
    readOut(`yes ${JSON.parse(localStorage.getItem("jarvis_setup")).name}, I am here to assist you!`);
  }
  // close voice recognition
  if (transcript.includes("shut down")||transcript.includes("shutdown")) {
    readOut(`Ok ${JSON.parse(localStorage.getItem("jarvis_setup")).name} i will take a nap`);
    stopingR = true;
    voiceImage.src = "voicestart.png"
    recognition.stop();
    document.querySelector("#stop_jarvis_btn").style.display = "none"
  }

  // whatsapp
  if (transcript.includes("open whatsapp")) {
    readOut("opening whatsapp");
    let a = window.open("https://web.whatsapp.com/");
    windowsB.push(a)
  }
  // netlify
  if (transcript.includes("open netlify")) {
    readOut("opening netlify");
    let a = window.open("https://app.netlify.com/");
    windowsB.push(a)
  }
  // spotify
  if (transcript.includes("open facebook")||transcript.includes("facebook")) {
    readOut("opening facebook");
    let a = window.open("https://www.facebook.com/");
    windowsB.push(a)
  }


  // canva

  if (transcript.includes("open my canva designs")) {
    readOut("opening canva designs");
    window.open("https://www.canva.com/folder/all-designs");
  }

  if (transcript.includes("open canva") || transcript.includes("open camera")) {
    readOut("opening canva");
    window.open("https://www.google.com/");
  }

  // userdata access commands

  if (transcript.includes("what's my name")||transcript.includes("my name")||transcript.includes("do you know me")) {
    readOut(`I know that you are ${JSON.parse(localStorage.getItem("jarvis_setup")).name}`);
  }
  if (transcript.includes("what's my bio") || transcript.includes("my bio")) {
    readOut(`I know that you are ${JSON.parse(localStorage.getItem("jarvis_setup")).bio}`);
  }

  // google

  if (transcript.includes("open google")) {
    readOut("opening google");
    let a = window.open("https://www.google.com/");
    windowsB.push(a)
  }

  if (transcript.includes("search for")||transcript.includes("search")) {
    readOut("here's your result");
    let input = transcript.split("");
    input.splice(0, 11);
    input.pop();
    input = input.join("").split(" ").join("+");
    let a = window.open(`https://www.google.com/search?q=${input}`);
    windowsB.push(a)
  }
  if (transcript.includes("open linkedin")) {
    readOut("opening linkedin");
    let a = window.open("https://www.linkedin.com/");
    windowsB.push(a)
  }

  // youtube
  if (transcript.includes("open youtube")) {
    readOut("opening youtube");
    let a = window.open("https://www.youtube.com/");
    windowsB.push(a)
  }

  if (transcript.includes("play")) {
    let playStr = transcript.split("");
    playStr.splice(0, 5);
    let videoName = playStr.join("");
    playStr = playStr.join("").split(" ").join("+");
    readOut(`searching youtube for ${videoName}`);
    let a = window.open(`https://www.youtube.com/search?q=${playStr}`
    );
    windowsB.push(a)
  }


  // instagram
  if (transcript.includes("open instagram")) {
    readOut("opening instagram");
    let a = window.open("https://www.instagram.com");
    windowsB.push(a)
  }
  // twitter
  if (transcript.includes("open twitter")) {
    readOut("opening twitter");
    let a = window.open(`https://twitter.com/`);
    windowsB.push(a)
  }

  // github
  if (transcript.includes("open github")) {
    readOut("opening github");
    let a = window.open("https://github.com/");
    windowsB.push(a)
  }
  // calendar
  if (transcript.includes("open calendar")) {
    readOut("opening calendar");
    let a = window.open("https://calendar.google.com/");
    windowsB.push(a)
  }
  // close all opened tabs
  if (transcript.includes("close all tabs")) {
    readOut("closing all tabs")
    windowsB.forEach((e) => {
      e.close()
    })

  }

  // translate commmands
  if (transcript.includes("translate")) {
    // ex = translate english to hindi " translation text"
    let x = transcript
    x = x.split("")
    x.pop()
    x.splice(0, 10)
    x = x.join("")
    x = x.split(" ")
    console.log(x);
    let lang1 = keyFromLangName(Languages, firstLetterCap(x[0]))
    console.log(lang1);
    let w = x[2]
    w = w.split("")
    w.pop()
    w = w.join("")
    let lang2 = keyFromLangName(Languages, firstLetterCap(w))
    console.log(lang2);
    let text = x.slice(3, x.length)
    text = text.join("")
    translate(text, lang1, lang2)

  }
}




recognition.onend = function () {
  if (stopingR === false) {
    setTimeout(() => {
      recognition.start();
    }, 500);
  } else if (stopingR === true) {
    recognition.stop();
    document.querySelector("#stop_jarvis_btn").style.display = "none"
    voiceImage.src = "voicestart.png"
  }
};

// speak out



function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = message;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("Speaking out");
  // createMsg("jmsg", message);
}

function readOutLang(message, lang) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = lang
  let voices = speechSynthesis.getVoices()
  let z;
  voices.forEach((v) => {
    if (v.lang.includes(lang)) {
      z = v
    }
  })
  speech.voice = z
  speech.text = message;
  speech.volume = 1;
  console.log(message);
  window.speechSynthesis.speak(speech);
  console.log("Speaking out - translated");
  // createMsg("jmsg", message);
}



// small jarvis
// const smallJarvis = document.querySelector("#small_jarvis")

// smallJarvis.addEventListener("click", () => {
//   window.open(`${window.location.href}`,"newWindow","menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0")
//   window.close()
// })



// document.querySelector("#jarvis_start").addEventListener("click", () => {
//   recognition.start()
// })

// calendar

const lang = navigator.language;

let datex = new Date();
let dayNumber = date.getDate();
let monthx = date.getMonth();

let dayName = date.toLocaleString(lang, { weekday: 'short' });
let monthName = date.toLocaleString(lang, { month: 'short' });
let year = date.getFullYear();

document.querySelector("#month").innerHTML = monthName
document.querySelector("#day").innerHTML = dayName
document.querySelector("#date").innerHTML = dayNumber
document.querySelector("#year").innerHTML = year

document.querySelector(".calendar").addEventListener("click", () => {
  window.open("https://calendar.google.com/")
})

// translate

function translate(words, lang1, lang2) {

  let x = words
  x = x.split(" ")
  x = x.join("%20")
  console.log(x);

  const data = JSON.stringify({
    "key1": "value",
    "key2": "value"
  });

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
      let text = JSON.parse(this.responseText)
      text = text.translated_text
      console.log(text);
      readOutLang(text, lang2)
      // readOut("translation complete")
    }
  });

  // xhr.open("POST", "https://translo.p.rapidapi.com/translate?text=Hey%2C%20how%20are%20you%20today%3F&to=hi&from=en");
  xhr.open("POST", `https://translo.p.rapidapi.com/translate?text=${x}?&to=${lang2}&from=${lang1}`);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("x-rapidapi-host", "translo.p.rapidapi.com");
  xhr.setRequestHeader("x-rapidapi-key", "ebd2857925mshcc1791ec740c585p1957c7jsn4a5a36b3b9c6");

  xhr.send(data);
}

// translate("hello how are you")

const Languages = {
  "af": "Afrikaans",
  "sq": "Albanian",
  "am": "Amharic",
  "ar": "Arabic",
  "hy": "Armenian",
  "az": "Azerbaijani",
  "bn": "Bengali",
  "bg": "Bulgarian",
  "ca": "Catalan",
  "zh": "Chinese",
  "hr": "Croatian",
  "cs": "Czech",
  "da": "Danish",
  "nl": "Dutch",
  "en": "English",
  "et": "Estonian",
  "fil": "Filipino",
  "fi": "Finnish",
  "fr": "French",
  "ka": "Georgian",
  "de": "German",
  "el": "Greek",
  "gu": "Gujarati",
  "he": "Hebrew",
  "hi": "Hindi",
  "hu": "Hungarian",
  "is": "Icelandic",
  "id": "Indonesian",
  "it": "Italian",
  "ja": "Japanese",
  "kn": "Kannada",
  "kk": "Kazakh",
  "km": "Khmer",
  "ko": "Korean",
  "ky": "Kyrgyz",
  "lo": "Lao",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "mk": "Macedonian",
  "ms": "Malay",
  "ml": "Malayalam",
  "mr": "Marathi",
  "mn": "Mongolian",
  "my": "Myanmar(Burmese)",
  "ne": "Nepali",
  "no": "Norwegian",
  "fa": "Persian",
  "pl": "Polish",
  "pt": "Portuguese",
  "pa": "Punjabi",
  "ro": "Romanian",
  "ru": "Russian",
  "sr": "Serbian",
  "si": "Sinhala",
  "sk": "Slovak",
  "sl": "Slovenian",
  "es": "Spanish",
  "sw": "Swahili",
  "sv": "Swedish",
  "ta": "Tamil",
  "te": "Telugu",
  "th": "Thai",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "uz": "Uzbek",
  "vi": "Vietnamese",
  "zu": "Zulu"
}


function keyFromLangName(object, value) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value)
        return prop;
    }
  }
}


function firstLetterCap(word) {
  let a = word
  a = a.split("")
  let x = a[0]
  a = a.reverse()
  a.pop()

  x = x.toUpperCase()
  a.push(x)
  a = a.reverse()
  a = a.join("")
  console.log(a);
  return a
}