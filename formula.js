let AllGridCells = document.querySelectorAll(".input-cell");
// let cell = document.querySelector(".input-cell");

// cell -> formula remove / value set
for (let i = 0; i < AllGridCells.length; i++) {
    // to save the user enetered value into db for later use
    AllGridCells[i].addEventListener("blur", function () {
        let content = AllGridCells[i].textContent;
        // selectedCell equal to addressInput
        let address = selectedCell.innerText;
        let {rid, cid} = getRIDCIDfromAddress(address);
        let cellObject = db[rid][cid];
        
       // cell click -> no change
    //    if (cellObject.value == content) {
    //     return;
    // } 
         // formula -> manual set
         let cFormula = formulaInput.value;

         let isCycle = checkCycle(address, cFormula);
         if (isCycle == true) {
             console.log("Cycle Detected");
             return;
         }
         console.log("Cycle Not Detected");
        if(content != cellObject.value){
            if(cellObject.formula){
                removeFormula(address, cellObject.formula);
                cellObject.formula = "";
            }
        }
        updateChildren(content, rid, cid)
    })
}
function checkCycle(address, newFormula) {
    let formulaTokens = newFormula.split(" ");

    let { rid, cid } = getRIDCIDfromAddress(address);
    let cellObject = db[rid][cid];
    let myChildren = cellObject.children;

    for (let i = 0; i < myChildren.length; i++) {
        let childAddress = myChildren[i];
        for (let i = 0; i < formulaTokens.length; i++) {
            let firstCharofToken = formulaTokens[i].charCodeAt(0);
            if (firstCharofToken >= 65 && firstCharofToken <= 90) {
                let parentAddress = formulaTokens[i]; // A1

                if (parentAddress == childAddress) {
                    alert("Cycle Detected!!");
                    return true;
                }
            }
        }

        return checkCycle(childAddress, newFormula);
    }
    return false;
}
// Formula bar
// Set formula / Update formula
formulaInput.addEventListener("keydown", function(e){
    if(e.key == "Enter" && formulaInput.value != ""){
        // Formula get
          // user input formula
        let cFormula = formulaInput.value;
        let address = selectedCell.innerText;
        let {rid, cid} = getRIDCIDfromAddress(address);
        let cellObject = db[rid][cid];
            if(cellObject.formula != cFormula){
                removeFormula(address, cellObject.formula)
            }
 // formula -> value get
 let value = evaluateFormula(cFormula);
 // KOTHA FORMULA VALUE CALUCTE CHEYYU
// let address = selectedCell.innerText;
 // KOTTHA FORMULA AA CELL MEEDA PDEINDO CALUCLATE CHEYYU
 // given for which we are setting the formula -> ui,db update 
 // jis cell ke liye formula apply kar rhe hai (address bar wala cell)
 //  ui-> value update
 // ,db-> value,formula update 
 setCell(value, cFormula);
 // AA KOTHA FORMLA NI UI AND DB MEEDA SET Chesesavu
 //    formula is equation -> hold true
 // formula cell -> cell object -> name add 
 // AA KOTHA FORMLA LONI OPERANDS(PARENT) LO NUVVU AS A CHILD LAGA VELLI ADD AVVU
 setParentCHArray(cFormula, address);
 // OKAVELA NUVVU NEE KOTHA FORMULA USE CHESI AVAITHE VARIABLE MEEDA DEPEND AVUTAVO AVI CHANGE AVUTHEY NUVVU KOODA CHANGE AVUTAVU KAANI NEE MEEDA DEPEND AAYE BIDDALU CHANGE AVVADANIKI NUVVU II KINDA FUN NI CALL CHEYYYALI
 updateChildren(cellObject);
       
    }
})
function setCell(value, formula) {
    let uicellElem = findUICellElement();
    //  html ele update overall ui updata
    uicellElem.innerText = value;
    // db update 
    let { rid, cid } = getRIDCIDfromAddress(selectedCell.innerText);
    db[rid][cid].value = value;
    db[rid][cid].formula = formula;
}
function findUICellElement() {
    let address = selectedCell.innerText;
    let ricidObj = getRIDCIDfromAddress(address);
    let rid = ricidObj.rid;
    let cid = ricidObj.cid;
    let uiCellElement =document.querySelector(`.input-cell[rid="${rid}"][cid="${cid}"]`)
    return uiCellElement;
}
// register yourself as children of the parent(cells that are appearing in the formula)
function setParentCHArray(formula, chAddress) {
    // B=(A1 +A2 )
    // let B go and become child in A1 and A2
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = db[rid][cid];
            parentObj.children.push(chAddress);
        }
    }
}
function evaluateFormula(formula){

    let formulaEntities = formula.split(" ");
    // [(,A1,+,A2,)]
    for (let i = 0; i < formulaEntities.length; i++) {
        let ascii = formulaEntities[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            // address -> rid cId
            let cellrcObj =
            getRIDCIDfromAddress(formulaEntities[i]);
            // db -> value
            let value = db[cellrcObj.rid][cellrcObj.cid].value;
            // replace in formula that is change appered in db not on the sheet value did not get updated
            formulaEntities[i] = value;
        }
    }
    // [(,10,+,20,)]
    // (10+20)=30
    let evaluatedFormula = formulaEntities.join(" ");
    // eval -> evaluate-> inbuilt 

    let result = eval(evaluatedFormula); 
    return result;
}

function updateChildren(value, rid, cid) {
    let tobeChangedCell = document.querySelector
        (`.input-cell[rId='${rid}'][cid='${cid}']`);
    tobeChangedCell.textContent = value;
    // above we have made changes only in sheet that means we can using dom but we have to store it in db
    db[rid][cid].value=value;
    let childrenArr = db[rid][cid].children;
    console.log(childrenArr)

    for(let i = 0 ; i < childrenArr.length ; i++){
        let childrenObj = getRIDCIDfromAddress(childrenArr[i]);
        let chCellObj = db[childrenObj.rid][childrenObj.cid];
        let newvalueofchild = evaluateFormula(chCellObj.formula);
        SetChildrenCell(newvalueofchild,chCellObj.formula, childrenObj.rid, childrenObj.cid);
        updateChildren(newvalueofchild, childrenObj.rid, childrenObj.cid);
    }
}
function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    // db update 
    let uiCellElement =document.querySelector(`.input-cell[rid="${rid}"][cid="${cid}"]`);
        // document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value;
    db[rid][cid].value = value;
    db[rid][cid].formula = formula;
} 
function setFormula(address, formula){
    let formulaEntities = formula.split(" ");
    // [(,A1,+,A2,)]
    // console.log(formulaEntities);
    for (let i = 0; i < formulaEntities.length; i++) {
        let ascii = formulaEntities[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            // address -> rid cId
            let parentObj = getRIDCIDfromAddress(formulaEntities[i]);
            // db -> value
            let children = db[parentObj.rid][parentObj.cid].children;
            // console.log(parentObj.rid + " " + parentObj.cid)
            // replace in formula
            children.push(address);
        }
    }
}
// inside parent ->chrildren has to be removed
// formula clear 
function removeFormula(address, formula){
        // formula -> parent -> children remove yourself
//    parameter formula=cellObject.formula
 // ( A1 + A2 )
    // split 
    // [(,A1,+,A2,)]
    // a-> z
    let formulaEntities = formula.split(" ");

    for(let i = 0 ; i < formulaEntities.length ; i++){
        let ascii = formulaEntities[i].charCodeAt(0);
        // okavela formula unte it will be having with alphabet
        if(ascii >= 65 && ascii <= 90){
            let parentObj = getRIDCIDfromAddress(formulaEntities[i]);
        
            let children = db[parentObj.rid][parentObj.cid].children;
            // children is an array
            let idx = children.indexOf(address);
            // get the idx of selected cell
            children.splice(idx, 1);
            // remove children from array
        }
    }
}
// Address (string)-> rid /cid
function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
}