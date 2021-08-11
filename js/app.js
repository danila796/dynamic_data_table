// get data by url
function loadData() {
  fetch('https://gist.githubusercontent.com/mariodev12/a923f2b651a005ca3ca7f851141efcbc/raw/39b06a32e4a58fc1fe63c7478a97edccd21138f1/superheroes.json')
    .then(response => response.json())
    .then(data => loadTable(data))
    .catch(error => console.log(error));

}
function updateData() {
  loadData();
}
function loadTable(data) {
  let table = document.getElementsByTagName('table')[0];
  if (table) {
    table.parentNode.removeChild(table);
  }
  createTable(data);
}
function createTable(data) {
  // Extract value from table header.
  let col = [];
  for (let i = 0; i < data.length; i++) {
    for (let key in data[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }
  const table = document.createElement("table");

  // Create table header row using the extracted headers above.
  let tr = table.insertRow(-1);                   // table row.

  for (let i = 0; i < col.length; i++) {
    let th = document.createElement("th");      // table header.
    th.innerHTML = col[i];
    if (i == 0){
      let arrow = document.createElement('p');
      let search = document.createElement('p');
      let input = document.createElement('input');
      input.style.display = 'none';
      input.id = 'input_name';
      input.style.position = 'absolute';
      input.style.bottom = 0;
      input.style.left = 0;
      input.placeholder = "Please enter a search name of hero..";
      input.title = 'Type in a name';
      arrow.title = 'Sort';
      search.title = 'Search';
      arrow.innerHTML = '<i class="fa fa-sort" aria-hidden="true"></i>';
      search.innerHTML = '<i class="fa fa-search"></i>';
      arrow.onclick = () => sortTable();
      search.onclick = () => toggleInput(input);
      input.onkeyup = () => searchValue(input);
      th.style.position = 'relative';
      th.appendChild(arrow);
      th.appendChild(search);
      th.appendChild(input);
    } else if (i == col.length - 1){
      let refresh = document.createElement('p');
      refresh.title = 'Refresh data'
      refresh.style.position = 'absolute';
      refresh.style.top = 0;
      refresh.style.right = 20 + 'px';
      refresh.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
      refresh.onclick = () => updateData();
      th.appendChild(refresh);  
    }
    tr.appendChild(th);
  }

  // add json data to the table as rows.
  for (let i = 0; i < data.length; i++) {
    tr = table.insertRow(-1);
    for (let j = 0; j < col.length; j++) {
        let tabCell = tr.insertCell(-1);
        tabCell.innerHTML = data[i][col[j]];
    }
  }
  // add created table to body
  document.body.appendChild(table);
}
function toggleInput(input) {
  if (input.style.display != 'none'){
    closeInput();
  } else {
    input.style.display = 'block';
  }
}
function sortTable() {
  let table = document.getElementsByTagName("table")[0];
  if (table.classList.contains('descending')){
    let sortedRows = Array.from(table.rows)
    .slice(1)
    .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? 1 : -1);
  
    table.tBodies[0].append(...sortedRows);
    table.classList.remove('descending');
  } else {
    let sortedRows = Array.from(table.rows)
    .slice(1)
    .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? -1 : 1);
  
    table.tBodies[0].append(...sortedRows);
    table.classList.add('descending');
  }
}
function searchValue(input) {
  let filter = input.value.toLowerCase();  
  let table = document.getElementsByTagName("table")[0];
  for (let i = 1; i < table.rows.length; i++){    
    if (table.rows[i].cells[0].innerHTML.toLocaleLowerCase().includes(filter) && filter != ''){
      table.rows[i].classList.add('search_highlight');
    } else {
      table.rows[i].classList.remove('search_highlight');
    }
  }
  
}
document.onkeydown = (evt) => {
  evt = evt || window.event;
  if (evt.key === "Escape") {
    closeInput();
  }
}

function closeInput() {
  let table = document.getElementsByTagName("table")[0];
  let input = document.getElementById('input_name');
  input.value = '';
  input.style.display = 'none';
  for (let i = 1; i < table.rows.length; i++){
    table.rows[i].classList.remove('search_highlight');
  }
}