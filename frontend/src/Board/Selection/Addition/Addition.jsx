

function Addition(props){
    return(
        <button id="addition_button" className="button" onClick={props.addNote}>
            <div id="bar1" className="bar"></div>
            <div id="bar2" className="bar"></div>
        </button>
    );
}

export default Addition