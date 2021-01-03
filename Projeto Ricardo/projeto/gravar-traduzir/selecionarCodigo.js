var selection; //excerto selecionado
var selectionsArray = []; //array de excertos 
document.onselectionchange = function() {
    selection = document.getSelection().toString(); //obter excerto selecionado
};

function getText() {
    selectedText.textContent = selection; //transcrever o texto selecionado para a textBox
    selectionsArray.push(selection); //array que que guarda todos os excertos confirmados
};
