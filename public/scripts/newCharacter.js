const init = function() {
    document.getElementById("button-submit").addEventListener("click", submit);
    document.getElementById("button-reset").addEventListener("click", reset);
    document.getElementById("button-add-multiclass").addEventListener("click", addMulticlass)
    document.getElementById("button-remove-multiclass").addEventListener("click", removeMulticlass)
};

const submit = function(ev) {
    // ev.preventDefault();
    // // remove unsused classBoxes before submitting
    // for(let i = 0; i < iClassFormBoxes; i++) {
    //     let currClassFormBox = document.getElementById("charClass-" + (i + 1));
    //     if(currClassFormBox.value == "") removeMulticlass(ev);
    // }
    // document.getElementById("createCharacter").submit();
};

const reset = function(ev) {
    ev.preventDefault();
    document.getElementById("createCharacter").reset();
    while(iClassFormBoxes > 0) {
        removeMulticlass(ev);
    }
    
};

let iClassFormBoxes = 0;

const updateNumClassesInput = function() {
    let numClassesInput = document.getElementById("numClasses");
    numClassesInput.value = iClassFormBoxes + 1;
    console.log("The number of ClassBoxes is: " + numClassesInput.value);
};

const addMulticlass = function(ev) {
    ev.preventDefault();
    if(iClassFormBoxes < 11) {    //only 12 charClasses exist
        let firstDiv = document.getElementById("charClass-0");
        let clone = firstDiv.cloneNode(true);
        clone.id = "charClass-" + ++iClassFormBoxes;

        clone.childNodes[3].name = "charClass_" + iClassFormBoxes;
        clone.childNodes[7].name = "subClass_" + iClassFormBoxes;
        clone.childNodes[11].name = "level_" + iClassFormBoxes;
        

        firstDiv.parentNode.appendChild(clone);

        updateNumClassesInput();
        console.log("The counter is at: " + iClassFormBoxes);
    }
};

const removeMulticlass = function(ev) {
    ev.preventDefault();
    if(iClassFormBoxes > 0) {
        let removedDiv = document.getElementById("charClass-" + iClassFormBoxes);
        removedDiv.removeAttribute("id");   //get rid of its id so id can be reused
        removedDiv.remove();
        iClassFormBoxes--;
        updateNumClassesInput();
        console.log("The counter is at: " + iClassFormBoxes);
    }
};

// var i = 0;
// var original = document.getElementById('duplicater');

// function duplicate() {
//     var clone = original.cloneNode(true); // "deep" clone
//     clone.id = "duplicetor" + ++i; // there can only be one element with an ID
//     original.parentNode.appendChild(clone);
// }

document.addEventListener('DOMContentLoaded', init);






