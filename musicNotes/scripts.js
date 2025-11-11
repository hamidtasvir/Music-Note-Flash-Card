const pngs = document.getElementById("pngs");
const notesContainer = document.getElementById("selectNotes");
const answer = document.getElementById("answer");
const inputField = document.getElementById("write");
const cover = document.getElementById("cover");

// Note arrays
const fClefNotes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
const gClefNotes = ['F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E'];

let selectedClef = 'both';

// Create note buttons (A-G)
for (let i = 0; i < 7; i++) {
  const div = document.createElement("div");
  const noteLetter = String.fromCharCode(65 + i);
  div.innerHTML = noteLetter;
  div.dataset.note = noteLetter;
  div.classList.add("selectNotes");
  notesContainer.appendChild(div);
}

// Handle clef selection
document.querySelectorAll('#clefs div').forEach(clefDiv => {
  const selectClef = () => {
    selectedClef = clefDiv.classList[0];
    answer.textContent = "";
    answer.className = "";
    showRandomNote();
  };
  clefDiv.addEventListener('click', selectClef);
  clefDiv.addEventListener('touchstart', e => {
    e.preventDefault();
    selectClef();
  });
});

// Show a random note with fade animation
function showRandomNote() {
  let notesArray, startNum, endNum;

  if (selectedClef === 'fClefs') {
    notesArray = fClefNotes;
    startNum = 1; endNum = 21;
    cover.style.display = "block";
    cover.style.marginTop = "0";
  } else if (selectedClef === 'gClefs') {
    notesArray = gClefNotes;
    startNum = 22; endNum = 42;
    cover.style.display = "block";
    cover.style.marginTop = "144px";
  } else {
    notesArray = [...fClefNotes, ...gClefNotes];
    startNum = 1; endNum = 42;
    cover.style.display = "none";
  }

  const num = Math.floor(Math.random() * (endNum - startNum + 1)) + startNum;
  const padded = String(num).padStart(3, "0");
  const note = notesArray[(num - startNum) % notesArray.length];

  // Fade and scale transition
  pngs.style.opacity = 0;
  pngs.style.transform = "scale(0.95)";

  setTimeout(() => {
    pngs.src = `pix/${padded}${note}.png`;
    pngs.dataset.currentNote = note;

    pngs.onload = () => {
      pngs.style.opacity = 1;
      pngs.style.transform = "scale(1)";
    };
  }, 200);

  console.log(`Current note: ${note} (Image file: ${padded}${note}.png)`);
}

// Handle note button clicks/taps
function handleNoteSelection(clickedNote) {
  const currentNote = pngs.dataset.currentNote;
  if (clickedNote === currentNote) {
    answer.textContent = "Correct!";
    answer.className = "correct";
    playSound(clickedNote);
  } else {
    answer.textContent = "It’s " + currentNote;
    answer.className = "wrong";
  }
  showRandomNote();
}

document.querySelectorAll('.selectNotes').forEach(div => {
  div.addEventListener('click', () => handleNoteSelection(div.dataset.note));
  div.addEventListener('touchstart', e => {
    e.preventDefault();
    handleNoteSelection(div.dataset.note);
  });
});

// Handle keyboard input
inputField.addEventListener('keyup', () => {
  const typedNote = inputField.value.trim().toUpperCase();
  const currentNote = pngs.dataset.currentNote;

  if (typedNote === currentNote) {
    answer.textContent = "Correct!";
    answer.className = "correct";
    playSound(typedNote);
    inputField.value = "";
    showRandomNote();
  } else if (typedNote.length === 1 && /[A-G]/.test(typedNote)) {
    answer.textContent = "Incorrect, try again.";
    answer.className = "wrong";
    inputField.value = "";
  }
});

// Play sound for note
function playSound(note) {
  const audio = new Audio(`notes/${note.toLowerCase()}6.mp3`);
  audio.play().catch(err => console.log("Audio playback failed:", err));
}

// Initial random note
showRandomNote();
