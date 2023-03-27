const content = document.querySelector(".note-input");
const priority = document.querySelector(".priority-input");
const noteList = document.querySelector(".note-content-container");
const saveButton = document.querySelector(".save-note");
const select = document.querySelector(".select-filter");
const amountIds = Number.MAX_VALUE;
const KEY_CODE_ENTER = 13;
const KEY_LOCAL_STORAGE = "notesList";
let dbNotes = [];

getNotesLocalStorage();
filterNotes();

//------------Generate Single ID------------

function generateId() {
  return Math.floor(Math.random() * amountIds);
}

function generateId2() {
  return generateSingleId();
}

function generateSingleId() {
  //atribui os li (notes) a variável
  let noteListItem = noteList.children;
  //cria um array vazio
  let generatedIds = [];

  for (i = 0; i < noteListItem.length; i++) {
    //insere o noteListItem[cada indice].id dentro do array
    generatedIds.push(noteListItem[i].id);
  }

  let idCounter = 0;
  //gera um id
  let id = generateId();

  //enquanto contador <= ids disponiveis e o primeiro resultado
  //dos ids gerados forem maior que -1, ele irá gerar um id e somar 1 no contador
  while (idCounter <= amountIds && generatedIds.indexOf(id.toString()) > -1) {
    id = generateId();
    idCounter++;

    if (idCounter >= amountIds) {
      alert("Todos ID's já atribuidos, exclua alguma nota");
      throw new Error("Id's esgotados!");
    }

    return id;
  }
}

//------------Generate Single ID END------------

//------------Add Notes Events------------

select.addEventListener("change", filterNotes);

saveButton.addEventListener("click", (e) => {
  if (content.value) {
    if (priority.checked) {
      priority.value = true;
    } else if (!priority.checked) {
      priority.value = false;
    }
    let note = {
      noteContent: content.value,
      notePriority: priority.value,
      id: generateId2(),
    };
    addNote(note);
  }
});

content.addEventListener("keypress", (e) => {
  if (content.value && e.keyCode == KEY_CODE_ENTER) {
    if (priority.checked) {
      priority.value = true;
    } else if (!priority.checked) {
      priority.value = false;
    }
    let note = {
      noteContent: content.value,
      notePriority: priority.value,
      id: generateId2(),
    };
    addNote(note);
  }
});

//------------Add Notes Events END------------

//------------Functions------------

function filterNotes() {
  const savedNotes = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE));
  console.log(savedNotes);
  const filter = select.value;
  console.log(filter);

  let filteredNotes = [];

  if (filter === "priority") {
    filteredNotes = savedNotes.filter((n) => n.notePriority === "true");
    if (!filteredNotes.length) {
      alert("Não foi localizado notas nessa categoria! :(");
    }
  } else if (filter === "common") {
    filteredNotes = savedNotes.filter((n) => n.notePriority === "false");
    if (!filteredNotes.length) {
      alert("Não foi localizado notas nessa categoria! :(");
    }
  } else if (filter === "all") {
    filteredNotes = savedNotes;
  }

  renderNotesList(filteredNotes);
}

function createLi(note) {
  //cria o elemento li
  const li = document.createElement("li");
  //remove o atributo css listStyle
  li.style.listStyle = "none";

  //atibui o id da li ao id da nota
  li.id = note.id;

  //cria o elemento span
  const span = document.createElement("span");
  //atribui classe note
  span.classList.add("note");
  //caso notePriority for true, adc a classe priority-note
  note.notePriority === "true" ? span.classList.add("priority-note") : "";
  //atribui conteudo noteContent ao innerHTML do span
  span.innerHTML = note.noteContent;

  //cria o elemento button
  const deleteBtn = document.createElement("button");
  //adiciona classe delete-note
  deleteBtn.classList.add("delete-note");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  //seta que ao receber um onclick irá executar a função deleteNote passando o id da nota.
  deleteBtn.setAttribute("onclick", "deleteNote(" + note.id + ")");
  //seta o deleteBtn como filho do span
  span.appendChild(deleteBtn);
  //seta o span como filho da li
  li.appendChild(span);

  return li;
}

function addNote(note) {
  dbNotes.push(note);
  localStorageSaveNotes(dbNotes);
  renderNotesList(dbNotes);
}

function deleteNote(idNote) {
  let confirm = window.confirm("Quer realmente excluir a nota?");
  if (confirm) {
    const noteIndex = getNoteIndexById(idNote);
    dbNotes.splice(noteIndex, 1);
    localStorageSaveNotes();

    let li = document.getElementById("" + idNote + "");
    if (li) {
      noteList.removeChild(li);
    } else {
      alert("Não foi encontrado o elemento! :(");
    }
  }
}

function getNoteIndexById(idNote) {
  const noteIndex = dbNotes.findIndex((t) => t.id == idNote);
  if (noteIndex < 0) {
    throw new Error("Id da nota não localizado", idNote);
  }
  return noteIndex;
}

function renderNotesList(notes) {
  noteList.innerHTML = "";
  for (let i = 0; i < notes.length; i++) {
    let li = createLi(notes[i]);
    noteList.appendChild(li);
  }

  content.value = "";
}

function localStorageSaveNotes() {
  localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(dbNotes));
}

function getNotesLocalStorage() {
  if (localStorage.getItem(KEY_LOCAL_STORAGE)) {
    dbNotes = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE));
  }
}

//------------Functions END------------

//------------Change Color------------
let btnColor = document.querySelector(".btn-color");
const label = document.querySelectorAll(".label");
const note = document.querySelector(".note");
const selectFiter = document.querySelector(".select-filter");
const container = document.querySelector(".container");
const noteHeader = document.querySelector(".note-header");
const colorIcon = document.querySelector(".fa-solid");
let stateClass = true;

btnColor.addEventListener("click", function () {
  if (getState() === true) {
    colorIcon.classList.replace("fa-sun", "fa-moon");
    colorIcon.classList.remove("fa-sun-color");
    colorIcon.classList.add("fa-moon-color");
    changeColor(true);
    holdState(false);
  } else if (getState() === false) {
    colorIcon.classList.replace("fa-moon", "fa-sun");
    colorIcon.classList.remove("fa-moon-color");
    colorIcon.classList.add("fa-sun-color");
    changeColor(false);
    holdState(true);
  }
});

function getState() {
  return stateClass;
}

function holdState(d) {
  stateClass = d;
}

function changeColor(state) {
  if (state === true) {
    container.classList.add("container-light");
    noteHeader.classList.add("note-header-light");
    content.classList.add("note-input-light");
    saveButton.classList.add("save-note-light");
    label.forEach((label) => {
      label.classList.add("label-light");
    });
    selectFiter.classList.add("select-filter-light");
    noteList.classList.add("note-content-container-light");
  } else {
    container.classList.remove("container-light");
    noteHeader.classList.remove("note-header-light");
    content.classList.remove("note-input-light");
    saveButton.classList.remove("save-note-light");
    label.forEach((label) => {
      label.classList.remove("label-light");
    });
    selectFiter.classList.remove("select-filter-light");
    noteList.classList.remove("note-content-container-light");
  }

  stateClass = state;
}

//------------Change Color END------------
