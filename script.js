
/* WINDOW.SPEECHSYNTHESIS
The SpeechSynthesis interface of the Web Speech API is the controller interface for the speech service; this can be used to retrieve 
information about the synthesis voices available on the device, start and pause speech, and other commands besides. Este objeto contiene 
las siguientes propiedades: {pending: false, speaking: false, paused: false, onvoiceschanged: null}. Además el objeto tiene métodos. El más
importante es el siguiente: 

SpeechSynthesis.getVoices() ---> Returns a list of SpeechSynthesisVoice objects representing all the available voices on the current device.
Si se quieren estudiar los demás métodos estan en internet. Otros ejemplos de apis en el objeto window sería location para ver la coordenadas 
del usuario  

SpeechSynthesis.speak()
Adds an utterance to the utterance queue; it will be spoken when any other utterances queued before it have been spoken. */

//Init SpeechSynth API
const synth = window.speechSynthesis;
// console.log(synth)

//DOM Elements
const container = document.querySelector('#second-container-voice');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const speakButton = document.querySelector('#speak-button');
const scratGif = document.querySelector('.scrat-gif');


//Init voices array
let voices = [];

const getAllVoices = () => {
    // SpeechSynthesis.getVoices(). Se usa este método
    voices = synth.getVoices();

    /*Se recorre cada voz de la api creando elementos option para el elemento select. Un error que cometí fue poner el ciclo fuera de la 
    funcion getAllVoices, ya que como se trabaja con funciones asíncronas el array voices esta vacío fuera de ella*/
    voices.forEach((voice) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;

        // Set needed option attributes. SetAttributes has to have 2 arguments ----> Property, Value
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);

        voiceSelect.appendChild(option);
    });
};

// console.log(voices);
/* Cuando mandamos a consola el arreglo donde almacenamos las voces aparece vacío, esto pasa porque la función synth.getVoices(); se 
ejecuta de forma asíncrona. Para que aparezcan las voces en el array tenemos que poner la siguiente condición, la cuál dice que si en la
propiedad del objeto window.speechSynthesis.onvoiceschanged no existe un valor definido, este va a ser igual a la función que nosotros
creamos */
getAllVoices();
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getAllVoices;
}


// ---------------------------------------------------------------------------
/* We first grab a reference to the SpeechSynthesis controller using window.speechSynthesis. After defining some necessary variables, we 
retrieve a list of the voices available using SpeechSynthesis.getVoices() and populate a select menu with them so the user can choose what 
voice they want. Then we use the constructor SpeechSynthesisUtterance to create a new utterance instance containing the text from the text 
<input>, set the utterance's voice to the voice selected in the <select> element, and start the utterance speaking via the 
SpeechSynthesis.speak() method.

SpeechSynthesisUtterance 
Propiedades usadas: voice, rate, pitch
Eventos usados: onend, onstart, error */
const speak = () => {
    // Check if speaking
    if(synth.speaking){
        console.error('Already speaking');
        return;
    }

    // Check it there's any text in the form
    if(textInput.value !== ''){
        /* SpeechSynthesisUtterance 
        It's an interface of the Web Speech API that represents a speech request. It contains the content the speech service should read and 
        information about how to read it (e.g. language, pitch and volume.). Returns a new SpeechSynthesisUtterance object instance. */
        // Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        console.log(speakText);

        /* El objeto SpeechSynthesisUtterance cuenta con diversas propiedades y eventos que podemos utilizar. Algunos eventos ocurren cuando 
        la voz empieza o termina de hablar, cuando es pausada, tiene un error, etc. */
        // Speak end
        speakText.onend = (info) => {
            scratGif.setAttribute("style", "display:none");
            console.log('Finished');
        };

        // Speak start
        speakText.onstart = (info) => {
            scratGif.setAttribute("style","display:flex");
            console.log('Started');
        };

        // Speak error
        speakText.error = info => console.log('Something went wrong');

        // Selected voice
        /* SelectedOptions es una propiedad del elemento/objeto select, esto se puede ver mandando a consola el elemento select para ver
        las propiedades del objeto (Tiene que ser con console.dir). The selectedOptions property of the select element gives the list of 
        options that are currently selected. Each element in this list is a DOM <option> element — so you can use the value and text 
        property to get the value and inside text of the option. En este caso vamos a utilizar el valor, pero para eso el valor sera
        igual al valor de la propiedad data-name, el cual es el nombre de cada voz */
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        /* Luego decimos que si algunas de las voces del arreglo voices es igual a la voz seleccionada en el elemento select, entonces la
        propiedad voice del objeto SpeechSynthesisUtterance que es igual a speakText será igual a esa voz */
        voices.forEach((voice) => {
            if(voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        // Set pitch and rate properties. Estas propiedades serán igual al valor que tengan nuestros elementos rate and pitch en el dom
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        /* Uno de los métodos del objeto window.speechSynthesis es speak, (Investigar en internet si se quiere) al cual se le tiene que pasar
        como argumento un objeto SpeechSynthesisUtterance, en este caso speakText con las propiedades que modificamos */
        synth.speak(speakText);
    }
};

// EVENT LISTENERS

// Button click
speakButton.addEventListener('click', () => {
    speak();
});
// textInput.blur();

// Rate value change
/* El texto del elemento div va a ser igual valor del elemento input cada vez que exista un cambio, así se actualizará constantemente */
rate.addEventListener('change', event => rateValue.textContent = rate.value);

// Pitch value change
/* El texto del elemento div va a ser igual valor del elemento input cada vez que exista un cambio, así se actualizará constantemente */
pitch.addEventListener('change', event => pitchValue.textContent = pitch.value);

// Speak change
/* También cada vez que se use el elemento select queremos ejecutar la funcion speak() para que nos cambie de voz */
voiceSelect.addEventListener('change', speak);



/* JOKES API */
/* -------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------- */
const jokeApiUrl = 'https://v2.jokeapi.dev/joke/Any?lang=es&blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
const jokeButton = document.querySelector('#joke-button');

let jokesRequest = [];
let jokeText = '';
async function getJokes(){
    try{
        const response = await fetch(jokeApiUrl);
        jokesRequest = await response.json();

        if(jokesRequest.setup && jokesRequest.delivery){
            jokeText = `${jokesRequest.setup}. ${jokesRequest.delivery}`;
        }else {
            jokeText = jokesRequest.joke;
        }

    }catch(error){
        console.log(error);
    }
}
getJokes()

const jokeVoice = () => {
    // Check if speaking
    if(synth.speaking){
        console.error('Already speaking');
        return;
    }

    const speakText = new SpeechSynthesisUtterance(jokeText);

     // Speak end
     speakText.onend = (info) => {
        scratGif.setAttribute("style", "display:none");
    };

    // Speak start
    speakText.onstart = (info) => {
        scratGif.setAttribute("style","display:flex");
    };

    // Speak error
    speakText.error = info => console.log('Something went wrong');

    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    voices.forEach((voice) => {
        if(voice.name === selectedVoice) {
            speakText.voice = voice;
        }
    });

    // Set pitch and rate properties
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // Uno de los métodos del objeto window.speechSynthesis es speak
    synth.speak(speakText);
};

// ADD EVENTS
jokeButton.addEventListener('click', jokeVoice);
jokeButton.addEventListener('click', getJokes);
