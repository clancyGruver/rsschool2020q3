import { get, set } from './storage.js';
import create from './utils/create.js';
import language from './langs/index.js';
import Key from './Key.js';

const main = create('main', '');

export default class Keyboard {
    constructor (rowsOrder) {
        this.rowsOrder = rowsOrder;
        this.keyPressed = {};
        this.isCaps = false;
        this.isPlaySound = true;
    }

    init (langCode) {
        this.keyBase = language[langCode];
        this.output = document.querySelector('.keyboard-input');
        this.container = create('div', 'keyboard', null, main, ['language', langCode]);
        document.body.prepend(main);
        this.soundsInit();
        this.hide();
        return this;
    }

    /**
     * @param {Key class} keyObj
     * @param {string(up|down)} eventType
     */
    playSound (keyObj, eventType) {
        const code = keyObj.code;
        let keyType;
        if(code.match(/Shift/)) keyType = 'shift';
        else if(code.match(/Caps/)) keyType = 'capsLock';
        else if(code.match(/Backspace/)) keyType = 'backspace';
        else if(code.match(/Enter/)) keyType = 'enter';
        else keyType = 'key';

        const soundType = `${keyType}${eventType}`;
        if(this.sounds[soundType] && this.isPlaySound){
            this.sounds[soundType].currentTime = 0;
            this.sounds[soundType].play();
        }

    }

    /**
     * звуки при печати в русской и английской раскладке отличаются. 
     * Предусмотрены уникальные звуки для клавиш Shift, CapsLock, Backspace, Enter
     */
    soundsInit () {
        const path = 'sounds/';
        const lang = get('kbLang');
        const soundTypes = [ 'shift', 'capsLock', 'backspace', 'enter', 'key' ];
        const eventTypes = [ 'up', 'down' ];
        this.sounds = {};
        soundTypes.forEach( sound => {
            eventTypes.forEach( event => {
                const fullPath = `${path}${sound === 'key' ? lang + '_' : ''}${sound}${event}.wav`;
                this.sounds[`${sound}${event}`] = create('audio', '', null, null, ['src', fullPath]);
            });
        });

        for(const sound of Object.keys(this.sounds)){
            document.body.prepend(this.sounds[sound]);
        }
    }

    generateLayout () {
        this.keyButtons = [];
        this.rowsOrder.forEach( (row, i) => {
            const rowElement = create('div', 'keyboard__row keyboard__keys', null, this.container, ['row', i+1]);
            rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
            row.forEach( code => {
                const keyObject = this.keyBase.find( key => key.code === code);
                if (keyObject) {
                    const keyButton = new Key(keyObject);
                    this.keyButtons.push(keyButton);
                    rowElement.appendChild(keyButton.container);
                }
            } );
        });

        document.addEventListener('keydown', this.handleEvent);
        document.addEventListener('keyup', this.handleEvent);
        this.container.addEventListener('mousedown', this.prehandleEvent);
        this.container.addEventListener('mouseup', this.prehandleEvent);
    }

    prehandleEvent = (e) => {
        e.stopPropagation();
        const keyDiv = e.target.closest('.keyboard__key');
        if(!keyDiv) return;
        const { dataset: { code } } = keyDiv;
        keyDiv.addEventListener('mouseLeave', this.resetButtonState);
        this.handleEvent({ code, type: e.type });

        const keyObj = this.keyButtons.find( key => key.code === code );
        if(e.type.slice(-2) === 'up') this.playSound(keyObj, 'up');
        else this.playSound(keyObj, 'down');
    }

    handleEvent = (e) => {
        if (e.stopPropagation) e.stopPropagation();
        const {code, type } = e;
        const keyObj = this.keyButtons.find( key => key.code === code );
        if(!keyObj) return;
        this.output.focus();
        if (type.match(/keydown|mousedown/)){
            if (type.match(/keydown/)) e.preventDefault();

            keyObj.container.classList.add('keyboard__key--press');

            //functional keys 
            if (code.match(/Control/)) this.ctrlKey = true;
            if (code.match(/Alt/)) this.altKey = true;
            if (code.match(/Shift/)) {
                if (this.shiftKey && type === 'mousedown') this.shiftKey = false;
                else {
                    this.shiftKey = true;
                }
            }
            if (code.match(/Caps/)) this.handleCapsLock(keyObj);

            this.shiftKey ? this.switchUpperCase(true) : this.switchUpperCase(false);
            this.toggleShift();

            //change language
            if (code.match(/EnRu/)) this.switchLanguage();

            //output
            if(!this.isCaps){
                this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small);
            } else if (this.isCaps) {
                if(this.shiftKey){
                    this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small);
                } else {
                    this.printToOutput(keyObj, !keyObj.sub.innerHTML ? keyObj.shift : keyObj.small);
                }
            }
        } else if (type.match(/keyup|mouseup/)) {
            //functional keys 
            if(code.match(/Control/)) this.ctrlKey = false;
            if(code.match(/Alt/)) this.altKey = false;
            if(code.match(/Shift/) && type === 'keyup') {
                this.shiftKey = false;
                this.switchUpperCase(false);
                this.toggleShift();
            }

            keyObj.container.classList.remove('keyboard__key--press');

            if(type === 'mouseup' && this.shiftKey && !code.match(/Shift/)) {
                this.shiftKey = false;
                this.switchUpperCase(false);
            }
        }
    }

    toggleShift () {
        const shiftButtons = this.keyButtons.filter( key => key.code.match(/Shift/) );
        shiftButtons.forEach( btn => {
            this.shiftKey
                ? btn.container.classList.add('keyboard__key--active')
                : btn.container.classList.remove('keyboard__key--active');
        })
    }

    handleCapsLock (keyObj) {
        if(!this.isCaps === true) {
            this.isCaps = true;
            this.switchUpperCase(true);
            keyObj.container.classList.add('keyboard__key--active');
        } else {
            this.isCaps = false;
            this.switchUpperCase(false);
            keyObj.container.classList.remove('keyboard__key--active');
        }
    }

    show () {
        this.container.classList.remove('keyboard--hidden');
    }

    hide () {
        this.output.blur();
        this.container.classList.add('keyboard--hidden');
    }

    switchLanguage = () => {
        const langAbbr = Object.keys(language);
        const currentLangIdx = langAbbr.indexOf(this.container.dataset.language);
        const nextLangIdx = currentLangIdx + 1 < langAbbr.length ? currentLangIdx + 1 : 0;
        const newLang = langAbbr[nextLangIdx];
        this.keyBase = language[newLang];

        this.container.dataset.language = newLang;
        set('kbLang', newLang);

        this.keyButtons.forEach( keyBtn => {
            const keyObject = this.keyBase.find( key => key.code === keyBtn.code );
            if(!keyObject) return;
            keyBtn.setKeyBase(keyObject);
            keyBtn.updateKey();
        })

        this.shiftKey = false;
        this.toggleShift();

        if (this.isCaps) this.switchUpperCase(true);
        this.soundsInit();
    }

    switchUpperCase (isTrue) {
        if(isTrue) {
            this.keyButtons.forEach( button => {
                if (button.sub.innerHTML) {
                    if (this.shiftKey) {
                        button.sub.classList.add('keyboard__key__sub--active');
                        button.letter.classList.add('keyboard__key--inactive');
                    }
                }

                if(!button.isFnKey && this.isCaps && !this.shiftKey && !button.sub.innerHTML){
                    button.letter.textContent = button.shift;
                } else if (!button.isFnKey && this.isCaps && this.shiftKey) {
                    button.letter.textContent = button.small;
                } else if (!button.isFnKey && !button.sub.innerHTML) {
                    button.letter.textContent = button.shift;
                }
            })
        } else {
            this.keyButtons.forEach( button => {
                if (!button.isFnKey && button.sub.innerHTML) {
                    button.sub.classList.remove('keyboard__key__sub--active');
                    button.letter.classList.remove('keyboard__key--inactive');

                    if (!this.isCaps) button.letter.textContent = button.small;
                    else if (this.isCaps) button.letter.textContent = button.shift;
                } else if (!button.isFnKey) {
                    if(this.isCaps) {
                        button.letter.textContent = button.shift;
                    } else {
                        button.letter.textContent = button.small;
                    }

                }
            })
        }

    }

    printToOutput (keyObj, symbol) {
        let cursorPosition = this.output.selectionStart;
        const left = this.output.value.slice(0, cursorPosition);
        const right = this.output.value.slice(cursorPosition);
        let isSelection = false;

        const fnButtonsHandler = {
            Tab: () => {
                this.output.value = `${left}\t${right}`;
                cursorPosition++;
            },
            ArrowLeft: () => {
                if (this.shiftKey) {
                    this.selection(cursorPosition, 'left');
                    isSelection = true;
                } else {
                    cursorPosition -= cursorPosition > 0 ? 1 : 0;
                }
            },
            ArrowRight: () => {
                if (this.shiftKey) {
                    this.selection(cursorPosition, 'right');
                    isSelection = true;
                } else {
                    cursorPosition++;
                }
            },
            ArrowUp: () => {
                const positionFromLeft = this.output.value.slice(0, cursorPosition).match(/(\n).*$(?!\1)/g) || [[1]];
                cursorPosition -= positionFromLeft[0].length;
            },
            ArrowDown: () => {
                const positionFromLeft = this.output.value.slice(0, cursorPosition).match(/(\n).*$(?!\1)/g) || [[1]];
                cursorPosition += positionFromLeft[0].length;
            },
            Enter: () => {
                this.output.value = `${left}\n${right}`;
                cursorPosition++;
            },
            Delete: () => this.output.value = `${left}${right.slice(1)}`,
            Backspace: () => {
                this.output.value = `${left.slice(0, -1)}${right}`;
                cursorPosition--;
            },
            Space: () => {
                this.output.value = `${left} ${right}`;
                cursorPosition++;
            },
            done: () => {
                this.hide();
                return;
            },
            sound: () => {
                keyObj.changeSoundIcon();
                this.isPlaySound = !this.isPlaySound;
                return;
            },
            mic: () => {
                keyObj.changeMicIcon();
                this.record();
                return;
            },
        }

        if (fnButtonsHandler[keyObj.code]) fnButtonsHandler[keyObj.code]();
        else if (!keyObj.isFnKey){
            cursorPosition++;
            this.output.value = `${left}${symbol || ''}${right}`;
        }
        if(!isSelection) this.selection(cursorPosition);
    }

    resetPressedButtons = (targetCode) => {
        if (!this.keysPressed[targetCode]) return;
        if (!this.isCaps) this.keysPressed[targetCode].div.classList.remove('keyboard__key--press');
        this.keysPressed[targetCode].container.removeEventListener('mouseleave', this.resetButtonState);
        delete this.keysPressed[targetCode];
    }

    selection (startPosition, direction = null) {
        if(!direction){
            this.output.setSelectionRange(startPosition, startPosition);
            this.selectionDirection = null;
            return;
        }
        if(direction !== this.selectionDirection){
            this.selectionDirection = direction;
            this.output.selectionStart = startPosition;
            this.output.selectionEnd = startPosition;
        }
        const startSelectionPosition = this.output.selectionStart;
        const endSelectionPosition = this.output.selectionEnd;
        const min = Math.min(startSelectionPosition,endSelectionPosition);
        const max = Math.max(startSelectionPosition,endSelectionPosition);
        if(direction === 'left'){
            this.output.setSelectionRange(min !== 0 ? min - 1 : 0, max);
        }
        if(direction === 'right'){
            this.output.setSelectionRange(min, max + 1);
        }
    }

    record () {

    }
}


//todo: hidekeyboard long press
//todo: selection with ctrl pressed
//todo: selection delete
/**
 * Голосовой ввод текста
 *
 * на виртуальной клавиатуре есть отдельная клавиша, при клике по которой можно включить/отключить голосовой ввод текста. Активное и неактивное состояние клавиши отличаются визуально
 * если голосовой ввод текста включён, в окне для ввода текста выводится текст, который поступает на устройство записи звука (например, микрофон или стереомикшер) указанное в настройках операционной системы
 * язык распознавания голоса en/ru меняется при переключении языка виртуальной клавиатуры
 * голосовой ввод текста продолжается до тех пор, пока активна клавиша голосового ввода
 */