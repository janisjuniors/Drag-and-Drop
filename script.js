/** Conditional list displaying logic. */
const contentChangeLink = document.querySelector('.content-change-link');
contentChangeLink.addEventListener('click', () => {
    document.body.classList.toggle('chess-pieces');
    contentChangeLink.innerHTML = document.body.classList.contains('chess-pieces') ? 'UFC Fighter List' : 'Chess Pieces';
});

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

        if (box.innerHTML !== hoverElement.innerHTML) {
            const boxInnerHtml = box.innerHTML;
            box.innerHTML = hoverElement.innerHTML;
            hoverElement.innerHTML = boxInnerHtml;
        }

        const firstComparisonPiece = document.querySelector('.first-comparison-container').querySelector('img')?.alt;
        const secondComparisonPiece = document.querySelector('.second-comparison-container').querySelector('img')?.alt;

        const firstComparisonPieceName = document.querySelector('.first-comparison-piece-name');
        const firstComparisonPieceValue = document.querySelector('.first-comparison-piece-worth');

        const secondComparisonPieceName = document.querySelector('.second-comparison-piece-name');
        const secondComparisonPieceValue = document.querySelector('.second-comparison-piece-worth');

        if (!!firstComparisonPiece) {
            firstComparisonPieceName.innerHTML = capitalizeFirstLetter(firstComparisonPiece);
            firstComparisonPieceValue.innerHTML = pieceValues[firstComparisonPiece];
        } else {
            resetElementInnerHTML([firstComparisonPieceName, firstComparisonPieceValue]);
        }

        if (!!secondComparisonPiece) {
            secondComparisonPieceName.innerHTML = capitalizeFirstLetter(secondComparisonPiece);
            secondComparisonPieceValue.innerHTML = pieceValues[secondComparisonPiece];
        } else {
            resetElementInnerHTML([secondComparisonPieceValue, secondComparisonPieceName]);
        }

        if (pieceValues[hoverElementPiece] > pieceValues[dropElementPiece]) {
            await captureSound.play();
        } else {
            await moveSound.play();
        }
    });
});

const capitalizeFirstLetter = (string) => string?.charAt(0).toUpperCase() + string?.slice(1);
const resetElementInnerHTML = (arrayOfElements) => arrayOfElements.forEach(element => element.innerHTML = '');


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