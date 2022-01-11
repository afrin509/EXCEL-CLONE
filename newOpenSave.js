let downloadBtn = document.querySelector(".icon-download");
let openBtn = document.querySelector(".icon-upload");
let openInput = document.querySelector(".open_input");
let newInput = document.querySelector(".icon-open");

downloadBtn.addEventListener("click", function (e) {

      //2d arrayy save file 
      
      const data = JSON.stringify(sheetDB);
      console.log(data);
      // convert it into blob
      // data -> file like object convert
      const blob = new Blob([data], { type: 'application/json' });
      // convert it any type file into url
      const url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      // content in that file
      a.href = url;
      // file download
      a.download = "file.json";
      // anchor click
      a.click();
})
openBtn.addEventListener("click", function (e) {
    openInput.click();
})
openInput.addEventListener("change", function (e) {
  let filesArr = openInput.files;

    // // first file select 
    let file = filesArr[0];
    console.log("file",file)
    // fileReader -> browser inbuilt
    const reader = new FileReader();
    // read as text 
    reader.readAsText(file);
    // console.log("reader.readAs",reader.readAsText(file))
    reader.addEventListener('load', (event) => {
        // img.src = event.target.result;
       // console.log("event.target.result",reader.result)
var stringifyObj = JSON.stringify(reader.result); 
// let sheetArray = JSON.parse(stringifyObj);
     let JSONdata = JSON.parse(reader.result);
     console.log(JSONdata)
        sheetDB = JSONdata
        
        // db = sheetDB[0]
        // console.log(db);
        
        setUI1();
       
        
    });
// let filesArray =openInput.files;
// console.log(filesArray)
// let fileObj = filesArray[0];
// // file reader to read the file
// let fr = new FileReader();
// // read as text 
// fr.readAsText(fileObj);
// fr.onload = function () {
//     // 3 darray
//     console.log(fr.result);
//     // sheet array 
//     var stringifyObj = JSON.stringify(fr.result); 
// let sheetArray = JSON.parse(stringifyObj);
//     sheetDB = sheetArray;
//     // first sheet db get 
//     // setUI1();
//     console.log("hi");
// }

     
})

newInput.addEventListener("click", () => {
    // // Set db to empty
    // db = [];

    // // Set initial Entries
    // createSheetDB();

    // // ui -> map according to new db
    // setUI1();

    let response = confirm("All sheets will be deleted permanently, Are you sure ?")
    if(response == false) return;
    location.reload()
})

function setUI1() {
    for (let i = 0; i < 100; i++) {

        for (let j = 0; j < 100; j++) {
            //    set all the properties on ui with matchiing rid,cid
            let cellObject = db[i][j];
            console.log(cellObject)
            let tobeChangedCell = document.querySelector(`.input-cell[rid='${i}'][cid='${j}']`);
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
}