// const { not } = require("cheerio/lib/api/traversing");
// where address cell of the selected cell is sown in a sheet
let selectedCell = document.querySelector(".selected-cell");
let fontfamilyInput = document.querySelector(".font-family-selector");
let bold_icon = document.querySelector(".icon-bold");
let italic_icon = document.querySelector(".icon-italic");
let underline_icon = document.querySelector(".icon-underline");
let backgroundHInput = document.querySelector(".background_color");
let backgroundInput = document.querySelector(".icon-color-fill");
let textColorHInput = document.querySelector(".text_color");
let textColorInput = document.querySelector(".icon-color-text");
let leftAlign = document.querySelector(".icon-align-left");
let rightAlign = document.querySelector(".icon-align-right");
let centerAlign = document.querySelector(".icon-align-center");
let fontSizeInput = document.querySelector(".font-size-selector");
let formulaInput = document.querySelector(".formula-input");
console.log(db);
    {
        let addSheetBtn = document.querySelector(".icon-add");
        addSheetBtn.click();
    }
    
    // Function to change all selected cell properties  present in input-cell_container/grid/db-2d array 
    inputCellContainer.addEventListener("click",(e) => {
        let element = document.querySelector(".input-cell.selected");
        // already in that 2d grid(inputcellcontainer) we have default selected cell so we remove selected class from that and add selected class to current element
        if(element != null){
            element.classList.remove("selected");
        }
        e.target.classList.add("selected");
        let rid = e.target.getAttribute("rId");
        let cid = e.target.getAttribute("cId");
        rid = parseInt(rid) + 1;
        cid = parseInt(cid) + 1;
        // from the code you get column no.,row no/. to set the address bar
        let ans = "";
            let n = cid;
            while (n > 0) {
                let rem = n % 26;
                if (rem == 0) {
                    ans = "Z" + ans;
                    n = Math.floor(n / 26) - 1;
                } else {
                    ans = String.fromCharCode(rem - 1 + 65) + ans;
                    n = Math.floor(n / 26);
                }
            }
 
        selectedCell.innerText = ans + rid;
        // getRidCidFromAddress
        let cellObj = getRidCidFromAddress(selectedCell.innerText)
        // console.log(cellObj)
          // the selected cell in the input_Cell _Container/grid
       let cellObject = db[cellObj.rid][cellObj.cid]
    //    console.log("rid",rid,"cellObj.rid",cellObj.rid)
//    console.log("cid",cid,"cellObj.cid",cellObj.cid)
//  cellObj.rid=rid-1 cas you have added one in line 31
      
        fontSizeInput.value = cellObject.fontSize
        fontfamilyInput.value = cellObject.fontFamily
        formulaInput.value = cellObject.formula
    // if sheet already have those properties set on different cell then these icons will be added selected classes  then now what we are doing is we are going to remove the highligted
    // and set only if this this current cell has those features
// we are checking if our db array is having that ppty if yes then we set to the html using dom that reflect on ui
        bold_icon.classList.remove("selected")
        italic_icon.classList.remove("selected")
        underline_icon.classList.remove("selected")
        leftAlign.classList.remove("selected")
        rightAlign.classList.remove("selected")
        centerAlign.classList.remove("selected")
        if(cellObject.bold){
            bold_icon.classList.add("selected")
        }

        if(cellObject.italic){
            italic_icon.classList.add("selected")
        }

        if(cellObject.underline){
            underline_icon.classList.add("selected")
        }

        if(cellObject.halign == "left"){
            leftAlign.classList.add("selected")
        }

        if(cellObject.halign == "center"){
            centerAlign.classList.add("selected")
        }

        if(cellObject.halign == "right"){
            rightAlign.classList.add("selected")
        }

    });
    // to make starting cell focussed
    let firstCell = document.querySelector(".input-cell");
    firstCell.click();
    firstCell.focus();
        
    // Function to return rid and cid from the given address
    function getRidCidFromAddress(address) {
        // A-Z, 1-100
        // B
        // ascii value of the address for char at 0 th character
        let AsciiValue = address.charCodeAt(0);
        let cid;
        let rid;
        // checking if AB,or any char is present at second character , if yes then enter
        if(address.charCodeAt(1) >= 65 && address.charCodeAt(1) <= 90){
    // lets say wehave AB ::then cid= 1*26+1=27
            cid = ( (AsciiValue - 65 + 1) * 26 ) + (address.charCodeAt(1) - 65);
            // for eg::AA12 address rid is 12-1=11 so we are accessing substring starting from 2 index in address
            rid =  Number(address.substring(2)) - 1;
        }else{

            cid = AsciiValue - 65;
            rid = Number(address.substring(1)) - 1;
        }
        return {
            rid: rid, cid: cid
        }
        
    }