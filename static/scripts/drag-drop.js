// Script for drag-and-drop functionality
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

        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function stopDrag() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
