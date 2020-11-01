export default class Microphone{
    languages = {
        en: 'en-US',
        ru: 'ru-RU'
    };

    constructor () {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.lastInput = '';
    }

    init (lang) {
        this.recognition.interimResults = true;
        this.recognition.lang = this.languages[lang];
    }

    changeLanguage (lang) {
        this.recognition.lang = this.languages[lang];
    }

    getInput () {
        return this.lastInput;
    }

    stop () {
        this.recognition.removeEventListener('end', this.recognition.start);
        this.recognition.stop();
    }

    record (handler) {
        this.recognition.addEventListener('result', e => this.onResult(e, handler) );

        this.recognition.addEventListener('end', this.recognition.start);
        this.recognition.start();
    }

    onResult (event, handler) {
        const result = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        if (event.results[0].isFinal) {
            console.log(result, handler);
            handler(result);
        }

    }
}