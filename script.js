/** Conditional list displaying logic. */
const contentChangeLink = document.querySelector('.content-change-link');
contentChangeLink.addEventListener('click', () => {
    document.body.classList.toggle('chess-pieces');
    contentChangeLink.innerHTML = document.body.classList.contains('chess-pieces') ? 'UFC Fighter List' : 'Chess Board';
});

const emptySquare = '<div class="inner-box"></div>';

/** Chess Piece Drag and Drop Logic. */
const boxes = document.querySelectorAll('.draggable-box');
let hoverElement;

const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: '&infin;'
};

const moveSound = new Audio('chess-sounds/move.mp3');
const captureSound = new Audio('chess-sounds/capture.mp3');

boxes.forEach(box => {
    box.addEventListener('dragstart', () => {
        hoverElement = box;
    });

    box.addEventListener('dragover', (e) => {
        e.preventDefault(); // Needed for `drop` event to fire.
        box.classList.add('hovered');
    });

    box.addEventListener('dragleave', () => {
        box.classList.remove('hovered');
    });

    box.addEventListener('drop', async () => {
        box.classList.remove('hovered');

        const hoverElementPiece = hoverElement.querySelector('img')?.alt;
        const dropElementPiece = box.querySelector('img')?.alt;

        if (bothElementsAreTheSameColor(hoverElementPiece, dropElementPiece)) {
            return;
        }

        if (box.innerHTML !== hoverElement.innerHTML && !isSquareEmpty(hoverElement)) {
            const boxInnerHTML = box.innerHTML;
            box.innerHTML = hoverElement.innerHTML;

            if (!dropElementPiece) {
                await playAudio(moveSound);
                hoverElement.innerHTML = boxInnerHTML;
            } else {
                await playAudio(captureSound);
                hoverElement.innerHTML = emptySquare;
            }
        }
    });
});

const isSquareEmpty = (htmlElement) => htmlElement.innerHTML === emptySquare;

const bothElementsAreTheSameColor = (hoverElement, dropElement) => {
    if (hoverElement?.toLowerCase().includes('white') && dropElement?.toLowerCase().includes('white')) {
        return true;
    }

    return hoverElement?.toLowerCase().includes('black') && dropElement?.toLowerCase().includes('black');
};

const stopAndResetAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
};

const playAudio = async (audio) => {
    stopAndResetAudio(audio);
    await audio.play();
};

/** UFC Fighter List Logic. */
const sortableList = document.querySelector('.sortable-list.ufc-fighters');
const items = document.querySelectorAll('.item');

items.forEach(item => {
    item.addEventListener('dragstart', () => setTimeout(() => item.classList.add('dragging')));
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
});

const dragOverAction = (event) => {
    const draggingItem = sortableList.querySelector('.dragging');
    const siblings = [...document.querySelectorAll('.item:not(.dragging)')];

    // Next sibling from the current dragging element.
    // event.clientY: The current mouse vertical coordinate.
    // sibling.offsetTop: The sibling element vertical coordinate from top of the viewport.
    // sibling.offsetHeight: The sibling element height.
    // sibling.offsetTop + sibling.offsetHeight / 2: The vertical coordinates for the element center.
    const nextSibling = siblings.find(sibling => event.clientY <= sibling.offsetTop + sibling.offsetHeight / 2);

    sortableList.insertBefore(draggingItem, nextSibling);
};

sortableList.addEventListener('dragover', dragOverAction);