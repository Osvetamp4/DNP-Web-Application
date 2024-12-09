import Selection from "./Selection/Selection";
import "./Selection/Selection.css"

let newX = 0, newY = 0, startX = 0, startY = 0;

var buttonMap = new Map(); //map the note_obj to a noteFunc object which holds all of the relevant mouse functions

class noteFunc{
    static note_amount = 0;
    constructor(mouse_down_inline){
        this.mouse_down_inline = mouse_down_inline
        this.mouse_move_inline = null
        this.mouse_up_inline = null
        noteFunc.note_amount++;

    }

    set_mouse_move_inline(mouse_move_inline){
        this.mouse_move_inline = mouse_move_inline
    }

    set_mouse_up_inline(mouse_up_inline){
        this.mouse_up_inline = mouse_up_inline
    }
}

//set the zIndex of every note_obj active to 1
function setZ(stringNum){
    let pivot = Number(stringNum)
    for (const note_obj of buttonMap.keys()) {
        let numVal = Number(note_obj.style.zIndex)
        if (numVal > pivot) note_obj.style.zIndex = String(numVal - 1)
    }
}
//call the function when the mouse is pressed down on the html
function mouseDown(e,note_obj){
    let oldZ = note_obj.style.zIndex;
    note_obj.style.zIndex = String(noteFunc.note_amount + 1);
    setZ(oldZ);
    startX = e.clientX
    startY = e.clientY
    let mouse_move_inline = (element) => mouseMove(element,note_obj)
    const note_mapped = buttonMap.get(note_obj)

    note_mapped.set_mouse_move_inline(mouse_move_inline)
    

    document.addEventListener('mousemove',mouse_move_inline)

    let mouse_up_inline = (element) => mouseUp(element,note_obj)

    note_mapped.set_mouse_up_inline(mouse_up_inline)

    document.addEventListener('mouseup',mouse_up_inline)
}


//function to be called when the mouse moves
function mouseMove(e,note_obj){
    newX = startX - e.clientX
    newY = startY - e.clientY

    startX = e.clientX
    startY = e.clientY

    note_obj.style.top = (note_obj.offsetTop - newY) + 'px'
    note_obj.style.left = (note_obj.offsetLeft - newX) + 'px'
}

//remove the eventListeners for mousemouve and mouseup for a specified note_obj and remove their references from the map
function mouseUp(e,note_obj){
    const current_note_obj = buttonMap.get(note_obj)
    const mouse_move = current_note_obj.mouse_move_inline
    const mouse_up = current_note_obj.mouse_up_inline

    document.removeEventListener("mousemove",mouse_move)//remove the eventListeners
    document.removeEventListener("mouseup",mouse_up)

    current_note_obj.set_mouse_move_inline(null)//remove these functions from their mapping
    current_note_obj.set_mouse_up_inline(null)
    
    
    
}

function createEventListener(note_obj){
    const mouse_down_inline = (element) => mouseDown(element,note_obj)
    const mouseFunc = new noteFunc(mouse_down_inline)
    buttonMap.set(note_obj,mouseFunc) //store a mapping of the note object to their mouse functions
    note_obj.style.zIndex = noteFunc.note_amount



    note_obj.addEventListener('mousedown',mouse_down_inline)
    
    
}

//creates a new note
function createNote(){
    console.log("create note")
    const newNote = document.createElement('div')
    newNote.setAttribute('class','notes')
    document.body.append(newNote)
    createEventListener(newNote)
}



//completely removes a note
function deleteNote(note_obj){
    document.removeEventListener('mousedown',buttonMap.get(note_obj).mouse_down_inline)
    buttonMap.delete(note_obj)
    note_obj.remove()
    noteFunc.note_amount--;
}

//completely removes the note with the highest z index
function deleteHighestNote(){
    console.log("delete")
    if (noteFunc.note_amount == 0) return "No notes to delete."
    for (const note_obj of buttonMap.keys()) {
        if (Number(note_obj.style.zIndex) == noteFunc.note_amount) {
            deleteNote(note_obj)
            break;
        }
    }
}

function getInfo(){
    fetch("/api/getuser")
    .then(response => response.json()) //convert the response string to a json file
    .then(response => response.doc)//unpackage the array from the doc json
    .then(doc => doc.forEach(logInfo))
}



function storeAllNotes(){
    console.log("WE ARE STORING IT")
    let colJSON = [];
    const user = "Larry306" //we are defaulting to Larry306

    
    buttonMap.forEach((keys, values) => {
        console.log(values);
        colJSON.push(Note_to_JSON(values.style.zIndex,values.style.left,values.style.top))
    });

    const postData = {
        doc:colJSON,
        username:user
    }
    console.log(postData)

    fetch("/api/setnotes",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(postData)
    })
    .then(response =>{
        if (!response.ok){
            throw new Error('Network response was not ok.')
            
        }
        return response.json()
    })
    .then(response => {
        console.log("Success: ",response.command_type + response.message) //logs the confirmation message from backend
    })
    .catch(error => {
        console.error('Error:', error);      // Handle any errors
      });
}

function Note_to_JSON(layer_index,left,up){
    const postData = {
        layer_index:layer_index,
        pos_left:left,
        post_up:up
    }
    return postData
    
}

async function deleteAllNotes(){
    const iterator = buttonMap.size

    for (let i = 0;i < iterator;i++){
        deleteHighestNote()
    }
    await loadAllNotes()
}

function createNoteSpec(layer_index,pos_left,post_up){
    const newNote = document.createElement('div')
    newNote.setAttribute('class','notes')
    newNote.style.zIndex = layer_index
    newNote.style.left = pos_left
    newNote.style.top = post_up
    document.body.append(newNote)
    createEventListener(newNote)
}

function placeAllNotes(noteList){
    for (let i = 0;i < noteList.length;i++){
        console.log(noteList[i].pos_left,noteList[i].post_up)
        createNoteSpec(noteList[i].layer_index,noteList[i].pos_left,noteList[i].post_up)
    }
}


async function loadAllNotes(){
    const user = "Larry306"
    const postData = {
        username:user
    }
    
    fetch("/api/getnotes",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(postData)
    })
    .then(response =>{
        if (!response.ok){
            throw new Error('Network response was not ok.')
            
        }
        return response.json()
    })
    .then(response=>{
        console.log(response.notes)
        placeAllNotes(response.notes)
    })
    .then(response => {
        console.log("Success GET request") //logs the confirmation message from backend
    })
    .catch(error => {
        console.error('Error:', error);      // Handle any errors
      });
}



function Board(){
    const action = {
        createNote:createNote,
        deleteHighestNote:deleteHighestNote,
        storeAllNotes:storeAllNotes,
        deleteAllNotes:deleteAllNotes
    }
    
    return(
        <>
            <Selection actions={action}></Selection>
        </>
    )
}

export default Board