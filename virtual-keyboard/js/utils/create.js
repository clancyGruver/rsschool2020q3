/**
 * @param {string} el
 * @param {string} classNames
 * @param {HTMLElement} children
 * @param {HTMLElement} parent
 * @param {...array} dataAttributes
 */

 export default function create (el, classNames, children, parent, ...dataAttributes) {
    let element = null;
    try {
        element = document.createElement(el);
    } catch (error) {
        throw new Error(`Unable to create HTML element ${el}`);
    }

    if (classNames){
        if(Array.isArray(classNames)) element.classList.add(...classNames);
        else element.classList.add(...classNames.split(' '));
    } 

    if (children && Array.isArray(children)) {
        children.forEach( childElement => childElement && element.append(childElement));
    } else if (children && typeof children == 'object') {
        element.append(children);
    } else if (children && typeof children == 'string') {
        element.innerHTML = children;
    }

    if (parent) {
        parent.appendChild(element);
    }

    if(dataAttributes.length){
        dataAttributes.forEach( ([attributeName, attributeValue]) => {
            if(attributeValue == ''){
                element.setAttribute(attributeName, '');
            } else {
                if (attributeName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck|src/)) {
                    element.setAttribute(attributeName, attributeValue);
                } else {
                    element.dataset[attributeName] = attributeValue;
                }
            }
        });
    }

    return element;
 }