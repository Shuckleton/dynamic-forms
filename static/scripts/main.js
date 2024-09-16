// main.js

let formArea = document.getElementById('form-area');
let labelTextInput = document.getElementById('label-text');
let componentNameInput = document.getElementById('component-name');
let labelColorInput = document.getElementById('label-color');
let fontSizeInput = document.getElementById('font-size');
let fontStyleSelect = document.getElementById('font-style');
let fontFamilySelect = document.getElementById('font-family');
let selectedElement = null;

// Counter for unique component IDs
let componentIdCounter = 1;

// Allow dragging over form area
function allowDrop(event) {
    event.preventDefault();
    formArea.classList.add('hover');
}

function drop(event) {
    event.preventDefault();
    formArea.classList.remove('hover');

    let dataType = event.dataTransfer.getData('type');
    let x = event.clientX - formArea.getBoundingClientRect().left;
    let y = event.clientY - formArea.getBoundingClientRect().top;
    createFormField(dataType, x, y);
}

// Add dragstart event to each draggable item
document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('type', event.target.getAttribute('data-type'));
    });
});

// Create and insert a form field dynamically
function createFormField(type, x, y, name = '', text = '', color = '', fontSize = '', fontWeight = '', fontStyle = '', fontFamily = '') {
    let field;
    name = name || `Component-${componentIdCounter++}`;

    switch(type) {
        case 'text-input':
            field = `<div class="form-field absolute p-2 bg-white border border-gray-300" style="left: ${x}px; top: ${y}px;" data-id="${name}">
                        <input type="text" placeholder="" class="w-full p-2 border border-gray-300 rounded">
                    </div>`;
            break;
        case 'checkbox':
            field = `<div class="form-field absolute p-2 bg-white border border-gray-300" style="left: ${x}px; top: ${y}px;" data-id="${name}">
                        <input type="checkbox">
                    </div>`;
            break;
        case 'textarea':
            field = `<div class="form-field absolute p-2 bg-white border border-gray-300" style="left: ${x}px; top: ${y}px;" data-id="${name}">
                        <textarea placeholder="" class="w-full p-2 border border-gray-300 rounded"></textarea>
                    </div>`;
            break;
        case 'text-label':
            field = `<div class="form-text absolute p-2" style="left: ${x}px; top: ${y}px; color: ${color}; font-size: ${fontSize}px; font-weight: ${fontWeight}; font-style: ${fontStyle}; font-family: ${fontFamily};" data-id="${name}">
                        ${text || 'Enter your text'}
                    </div>`;
            break;
        default:
            field = '';
    }

    formArea.innerHTML += field;
}

// Event delegation for selecting elements
formArea.addEventListener('mousedown', function(event) {
    if (event.target.classList.contains('form-field') || event.target.classList.contains('form-text')) {
        selectElement(event.target);
        dragElement(event.target, event);
    }
});

function selectElement(element) {
    // Clear previous selection
    document.querySelectorAll('.form-field, .form-text').forEach(el => el.classList.remove('selected'));
    selectedElement = element;
    selectedElement.classList.add('selected');

    if (selectedElement.classList.contains('form-text')) {
        labelTextInput.value = selectedElement.textContent.trim();
        labelColorInput.value = rgbToHex(window.getComputedStyle(selectedElement).color);
        fontSizeInput.value = parseInt(window.getComputedStyle(selectedElement).fontSize, 10);
        fontFamilySelect.value = window.getComputedStyle(selectedElement).fontFamily.replace(/['"]/g, '');

        const fontWeight = window.getComputedStyle(selectedElement).fontWeight;
        fontStyleSelect.value = fontWeight === 'bold' ? 'bold' : fontWeight === 'normal' ? 'normal' : 'italic';

        fontStyleSelect.value = window.getComputedStyle(selectedElement).fontStyle;
    } else {
        labelTextInput.value = '';
        labelColorInput.value = '#000000';
        fontSizeInput.value = '';
        fontStyleSelect.value = '';
        fontFamilySelect.value = '';
    }

    // Populate component name field
    componentNameInput.value = selectedElement.getAttribute('data-id') || '';
}

labelTextInput.addEventListener('input', function() {
    if (selectedElement && selectedElement.classList.contains('form-text')) {
        selectedElement.textContent = labelTextInput.value;
    }
});

labelColorInput.addEventListener('input', function() {
    if (selectedElement && selectedElement.classList.contains('form-text')) {
        selectedElement.style.color = labelColorInput.value;
    }
});

fontSizeInput.addEventListener('input', function() {
    if (selectedElement && selectedElement.classList.contains('form-text')) {
        selectedElement.style.fontSize = fontSizeInput.value ? fontSizeInput.value + 'px' : '';
    }
});

fontStyleSelect.addEventListener('change', function() {
    if (selectedElement && selectedElement.classList.contains('form-text')) {
        let selectedValue = fontStyleSelect.value;
        if (selectedValue === 'bold') {
            selectedElement.style.fontWeight = 'bold';
            selectedElement.style.fontStyle = 'normal'; // Ensure font style is not italic or oblique
        } else if (selectedValue === 'italic') {
            selectedElement.style.fontStyle = 'italic';
            selectedElement.style.fontWeight = 'normal'; // Ensure font weight is not bold
        } else {
            selectedElement.style.fontWeight = 'normal';
            selectedElement.style.fontStyle = 'normal';
        }
    }
});

fontFamilySelect.addEventListener('change', function() {
    if (selectedElement && selectedElement.classList.contains('form-text')) {
        selectedElement.style.fontFamily = fontFamilySelect.value;
    }
});

componentNameInput.addEventListener('input', function() {
    if (selectedElement) {
        // Update data-id attribute to match new name
        let newName = componentNameInput.value.trim();
        selectedElement.setAttribute('data-id', newName);

        // Update name in the properties panel
        selectElement(selectedElement);
    }
});

function dragElement(element, event) {
    event.preventDefault();
    let pos1 = 0, pos2 = 0, pos3 = event.clientX, pos4 = event.clientY;

    document.onmousemove = elementDrag;
    document.onmouseup = stopDrag;

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Move the element
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

// Helper function to convert RGB to HEX
function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }
    return '#000000'; // Default to black
}

function saveFormState(name) {
    const formFields = Array.from(document.querySelectorAll('.form-field, .form-text')).map(el => {
        return {
            type: el.classList.contains('form-text') ? 'text-label' : 'form-field',
            id: el.getAttribute('data-id'),
            x: el.style.left.replace('px', ''),
            y: el.style.top.replace('px', ''),
            text: el.classList.contains('form-text') ? el.textContent : null,
            color: el.classList.contains('form-text') ? window.getComputedStyle(el).color : null,
            fontSize: el.classList.contains('form-text') ? window.getComputedStyle(el).fontSize.replace('px', '') : null,
            fontWeight: el.classList.contains('form-text') ? window.getComputedStyle(el).fontWeight : null,
            fontStyle: el.classList.contains('form-text') ? window.getComputedStyle(el).fontStyle : null,
            fontFamily: el.classList.contains('form-text') ? window.getComputedStyle(el).fontFamily.replace(/['"]/g, '') : null,
        };
    });

    localStorage.setItem(name, JSON.stringify(formFields));
    updateFormList();
}

function loadFormState(name) {
    const savedState = localStorage.getItem(name);
    if (savedState) {
        const formFields = JSON.parse(savedState);
        formArea.innerHTML = ''; // Clear current form
        formFields.forEach(field => {
            createFormField(field.type, parseInt(field.x), parseInt(field.y), field.id, field.text, field.color, field.fontSize, field.fontWeight, field.fontStyle, field.fontFamily);
        });
    }
}

function updateFormList() {
    const formList = document.getElementById('form-list');
    formList.innerHTML = '';
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('form_')) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            formList.appendChild(option);
        }
    });
}

// Event Listeners
document.getElementById('save-btn').addEventListener('click', () => {
    const formName = prompt('Enter a name for this form:');
    if (formName) {
        saveFormState('form_' + formName);
    }
});

document.getElementById('load-btn').addEventListener('click', () => {
    const formName = document.getElementById('form-list').value;
    if (formName) {
        loadFormState(formName);
    }
});

document.getElementById('delete-btn').addEventListener('click', () => {
    const formName = document.getElementById('form-list').value;
    if (formName && confirm('Are you sure you want to delete this form?')) {
        localStorage.removeItem(formName);
        updateFormList();
        formArea.innerHTML = ''; // Clear the form area
    }
});

// Initialize form list on page load
updateFormList();
