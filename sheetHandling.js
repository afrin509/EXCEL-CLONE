let sheetAddBtn = document.querySelector(".icon-add");
let sheetContainer = document.querySelector(".sheet-tab-container");
// left scroll of the scroll bar of sheets
let leftScroll = document.querySelector(".icon-left-scroll");
// right scroll of the scroll bar of sheets
let rightScroll = document.querySelector(".icon-right-scroll");


let sheetDB = [];
// this is the array containing each sheet
    let db = [];
//    2D array of rows col =100,100 is referring to each grid/input_class_Container in each sheet
    // Creating first sheet using javascript
leftScroll.addEventListener("click", () => {
//     element.scrollLeft;
//  is an integer representing the number of pixels that element has been scrolled towards the left edge.
 
    sheetContainer.scrollLeft -= 50;
})

rightScroll.addEventListener("click", () => {
    // Set the number of pixels scrolled
//     element.scrollLeft;
//  is an integer representing the number of pixels that element has been scrolled from the left edge.
    sheetContainer.scrollLeft += 50;
})
// that add icon
sheetAddBtn.addEventListener("click", () =>{
    let newSheet = document.createElement("div");
    let allSheets = document.querySelectorAll(".sheet-tab");
    // sheet tab creation
    newSheet.setAttribute("id",allSheets.length);
    newSheet.setAttribute("class","sheet-tab");
    // sheet is always start from 1 so id+1
    newSheet.innerText = "Sheet-" + (allSheets.length+1) ;
    // inside the sheetcontainer that is where all your sheets are stored in that you add new sheet
    sheetContainer.appendChild(newSheet);
    // The scrollIntoView() method scrolls the specified element into the visible area of the browser window.
    newSheet.scrollIntoView();
    // to create sheet with each cell having set to default values
    createSheetDB();
// 2 way binding
    // go and active the current sheet in the sheet container
    handleSheetActiveness(newSheet);

    newSheet.click();
    handleSheetRemoval(newSheet);
})

function sheetOpenHandler(){
    let newSheet = document.createElement("div");
    let allSheets = document.querySelectorAll(".sheet-tab");
    newSheet.setAttribute("id",allSheets.length);
    newSheet.setAttribute("class","sheet-tab");
    newSheet.innerText = "Sheet-" + (allSheets.length+1) ;
    sheetContainer.appendChild(newSheet);

    newSheet.scrollIntoView();
    // this will click the sheet that you have created
    newSheet.click();
    // this function will activate the sheet you have clicked
    handleSheetActiveness(newSheet);
    console.log(sheet)
    handleSheetRemoval(sheet);
}
// function involving deleting the sheet both in sheetdb and its properties
// <!-- The mousedown event is fired at an Element when a pointing device button is pressed while the pointer is inside the element. -->
// <!-- 0: Main button pressed, usually the left button or the un-initialized state
// 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
// 2: Secondary button pressed, usually the right button
// 3: Fourth button, typically the Browser Back button
// 4: Fifth button, typically the Browser Forward button -->
function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown", (e) => {
        // Right Click
        if(e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-tab");
        if(allSheetFolders.length == 1){
            alert("You need to have atleast one sheet");
            return;
        }

        let response = confirm("Your sheet will be deleted permanently, Are you sure ?")
        if(response == false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));
// this will remove sheet from the sheetdb at index sheetidx going till length 1
        sheetDB.splice(sheetIdx, 1);
    // removes the sheet and reset the sheetdb with id=i and sheet =i+1  
        handleSheetUIRemoval(sheet);
// setting our 2d array/ui to point to starting element
        db = sheetDB[0];

        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet){
    sheet.remove();

    let allSheetFolders = document.querySelectorAll(".sheet-tab");
    for(let i = 0 ; i < allSheetFolders.length; i++){
        allSheetFolders[i].setAttribute("id", i);
        allSheetFolders[i].innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = "lightgray";
}

function createSheetDB(){
    let db = [];

    for(let i = 0;  i < 100; i++){
        let rowArr = []
        for(let j = 0; j < 100 ; j++){
            let cellObj = {
                // default ppts of each cell
                color: "black",
                backgroundColor: "white",
                fontFamily: "Arial",
                fontSize: 14,
                halign: "left",
                italic: false,
                underline: false,
                bold: false,
                value:"",
                formula: "",
                children: []
            }
            rowArr.push(cellObj)
        }
        db.push(rowArr)
    }
    // console.log(db);
    sheetDB.push(db)
    // console.log(sheetDB);
}

function handleSheetActiveness(sheet){
    // when you click on any specific sheet that is already created
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        // two segments::2d-db,html changes stored in 2d db applied to html using dom of each sheet you have clicked on
    //    whichever sheet we have clicked our db array will bepointing to that sheet
    //  you get db inside the html pointing to ths sheet
        handleSheetDB(sheetIdx);
    // and the sheet properties set through dom and set the styling as per in the html element
        handleSheetProperties();
// show it on the ui that which sheet is currently active
 
        handleSheetUI(sheet);
        // console.log(db);
    })
}

function handleSheetDB(sheetIdx){
    // db is representing the  input_Cell_container /grid coresponding to the sheet at index sheetIdx
    db = sheetDB[sheetIdx];
    // console.log(db);
}
// it will handle the html elements proprties based on db ppts using dom that will reflect in ui
function handleSheetProperties(){
    console.log(sheetDB);
    for(let i = 0 ; i < 100 ; i++){
        for(let j = 0 ; j < 100 ; j++){
            // this is each cell in the input_cell_ontainer/grid
            let cellObject = db[i][j];
            // this is the cell proprties you are chagning using dom
            // db is what changing for each sheet then a/c to the db we are changing the ppts of element in html using dom so it will reflect on ui
            let tobeChangedCell = document.querySelector(`.input-cell[rId='${i}'][cId='${j}']`);
            // console.log(cellObject.value);
            // console.log(tobeChangedCell)
            tobeChangedCell.innerText = cellObject.value;
            tobeChangedCell.style.color = cellObject.color;
            tobeChangedCell.style.fontWeight = cellObject.fontWeight;
            tobeChangedCell.style.backgroundColor = cellObject.backgroundColor;
            tobeChangedCell.style.fontFamily = cellObject.fontFamily;
            tobeChangedCell.style.textAlign = cellObject.halign;
            tobeChangedCell.style.textDecoration = cellObject.underline == false ? "none" : "underline";
            tobeChangedCell.style.fontStyle = cellObject.italic == false ? "normal" : "italic";
            tobeChangedCell.style.fontSize = cellObject.fontSize;
        }
    }

    let firstCell = document.querySelector(".input-cell");
    firstCell.click();
    firstCell.focus();
}

function handleSheetUI(sheet){
//  sheets
    let allSheetFolders = document.querySelectorAll(".sheet-tab");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    // one particular sheet that you are currently working on
    sheet.style.backgroundColor = "lightgray";
}