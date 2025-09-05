const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;
const colors = ['note-yellow', 'note-blue', 'note-pink']; // agregar los colores de los post-it, estaba solo yellow, se pusieron otros colores

function saveNotes() { // no habia funcion para guardar notas, se agregó. Guarda todas las notas actuales (texto y color) en localStorage como JSON para que persistan entre recargas.
    const data = [];
    const noteNodes = notesContainer.querySelectorAll('.note');
    noteNodes.forEach(note => {
    const text = note.textContent.replace('x', '').trim();
    const color = Array.from(note.classList).find(c => c.startsWith('note-'));
    data.push({ text, color });
    });
    localStorage.setItem('notes', JSON.stringify(data));
}

function createNoteElement(text, colorClass) { //funcion que agrega el botton de eliminar y el texto de la nota
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass);
    noteDiv.textContent = text;
    
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';
    noteDiv.appendChild(deleteButton);
    
    return noteDiv;
}

function loadNotes() { // la funcion estaba llamando a un array vacio, se llamo al local storage. recupera las notas guardadas en localStorage y las agrega al contenedor de notas.
    const storedNotes = localStorage.getItem('notes');
    if (!storedNotes) return;
    const notes = JSON.parse(storedNotes);
    notes.forEach(noteData => {
    const newNote = createNoteElement(noteData.text, noteData.color);
    notesContainer.appendChild(newNote);
    });
}

function setInitialTheme() { //aplica el modo oscuro o claro segun el localStorage al iniciar la pagina
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    } else { 
        toggleThemeButton.textContent = 'Modo Oscuro';
    }
}

noteInput.addEventListener('input', () => { //Habilita o deshabilita el botón Agregar según si el campo de texto está vacío o con contenido.
    addButton.disabled = noteInput.value.trim() === '';
});

toggleThemeButton.addEventListener('click', () => { //alterna el modo oscuro o claro al hacer click en el boton de cambio de tema
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

notesContainer.addEventListener('dblclick', (event) => { //permite editar el texto de la nota al hacer doble click en ella
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);

            saveNotes();
        }

        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

addButton.addEventListener('click', () => { // Agregar nota al hacer click en el boton agregar, se elimina error de duplicacion de notas
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

notesContainer.addEventListener('click', (event) => { //elimina la nota al hacer click en el boton de eliminar
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

notesContainer.addEventListener('mouseover', (event) => { //aumenta la sombra de la nota al hacer hover
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

notesContainer.addEventListener('mouseout', (event) => { //restaura la sombra de la nota al hacer hover
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

setInitialTheme();
loadNotes();