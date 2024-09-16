// Script for element operations like selection and styling
document.addEventListener('DOMContentLoaded', () => {
    let formArea = document.getElementById('form-area');
    let labelTextInput = document.getElementById('label-text');
    let labelColorInput = document.getElementById('label-color');
    let fontSizeInput = document.getElementById('font-size');
    let fontStyleSelect = document.getElementById('font-style');
    let selectedElement = null;

    formArea.addEventListener('mousedown', function(event) {
        if (event.target.classList.contains('form-field') || event.target.classList.contains('form-text')) {
            selectElement(event.target);
        }
    });

    function selectElement(element) {
        document.querySelectorAll('.form-field, .form-text').forEach(el => el.classList.remove('selected'));
        selectedElement = element;
        selectedElement.classList.add('selected');

        if (selectedElement.classList.contains('form-text')) {
            labelTextInput.value = selectedElement.textContent.trim();
            labelColorInput.value = rgbToHex(window.getComputedStyle(selectedElement).color);
            fontSizeInput.value = parseInt(window.getComputedStyle(selectedElement).fontSize, 10);
            fontStyleSelect.value = window.getComputedStyle(selectedElement).fontWeight === 'bold' ? 'bold' : window.getComputedStyle(selectedElement).fontStyle;
        } else {
            labelTextInput.value = '';
            labelColorInput.value = '#000000';
            fontSizeInput.value = '';
            fontStyleSelect.value = '';
        }

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
            } else {
                selectedElement.style.fontWeight = selectedValue === 'bold' ? 'bold' : 'normal';
                selectedElement.style.fontStyle = selectedValue;
            }
        }
    });

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
});
