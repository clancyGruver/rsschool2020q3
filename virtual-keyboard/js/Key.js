import create from './utils/create.js';

export default class Key{
    constructor ({ small, shift, code, icon }) {
        this.code = code || null;
        this.small = small || null;
        this.shift = shift || null;
        this.icon = icon || null;
        this.classNames = ['keyboard__key'];
        this.createKey();
    }

    setKeyBase ({ small, shift }) {
        this.small = small;
        this.shift = shift;
    }

    updateKey(){
        if (this.shift && this.shift.match(/[^a-zA-Zа-яА-ЯЁё0-9]/)) {
            this.sub.textContent = this.shift;
        } else {
            this.sub.textContent = '';
        }
        this.letter.textContent = this.small;
    }

    isFnKey () {
        const smallMatched = Boolean(this.small.match(/Ctrl|arr|Shift|Tab|Back|Del|Enter|Caps|Win|Alt|done|EnRu/));
        const codeMatched = Boolean(this.code.match(/done|EnRu|sound|mic/));

        return smallMatched || codeMatched;
    }

    createKey () {
        this.isFnKey = this.isFnKey();

        if (this.icon){
            this.iconElement = this.createIconHTML(this.icon);
        }

        if (this.shift && this.shift.match(/[^a-zA-Zа-яА-ЯЁё0-9]/)) {
            this.sub = create('div', 'keyboard__key__sub', this.shift);
        } else {
            this.sub = create('div', 'keyboard__key__sub', '');
        }

        this.letter = create('div', 'letter', this.small);

        if(this.code == 'CapsLock') this.classNames.push('keyboard__key--activatable');
        if(this.code.match(/Shift/)) this.classNames.push('keyboard__key--activatable');
        if(this.isFnKey) this.classNames.push('keyboard__key--functional');

        this.container = create(
            'div', 
            this.classNames, 
            [this.sub, this.iconElement || this.letter], 
            null, 
            ['code', this.code],
            ['fn', this.isFnKey ? true : false]
        );

    }

    createIconHTML(iconName){
        return create('i', 'material-icons', iconName);
    }

    changeSoundIcon(){
        this.icon = this.icon === 'volume_mute' ? 'volume_off' : 'volume_mute';
        this.container.children[1].textContent = this.icon;
    }

    changeMicIcon(){
        this.icon = this.icon === 'mic' ? 'mic_off' : 'mic';
        this.container.children[1].textContent = this.icon;
    }
}