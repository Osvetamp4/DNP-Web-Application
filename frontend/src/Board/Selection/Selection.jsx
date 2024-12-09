import Addition from "./Addition/Addition";
import "./Addition/Addition.css"
import Subtraction from "./Subtraction/Subtraction";
import "./Subtraction/Subtraction.css"
import Store from "./Store/Store"
import "./Store/Store.css"
import Load from "./Load/Load"
import "./Load/Load.css"


function Selection(props) {
    return (
        <>
            <div id="selection_bar">
                <Addition addNote={props.actions.createNote}></Addition>
                <Subtraction removeNote={props.actions.deleteHighestNote}></Subtraction>
                <Store storeNote={props.actions.storeAllNotes}></Store>
                <Load deleteNote={props.actions.deleteAllNotes}></Load>
            </div>
        </>
    );
}


export default Selection