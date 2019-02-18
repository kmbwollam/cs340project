function searchByPlayerName() {
  var input = document.getElementById("searchTerms");
  var table = document.getElementById("characterTable");
  var searchText = input.value.toLowerCase();
  var rows = table.getElementsByTagName("tr");

  var column, i, columnText;
  for (i = 0; i < rows.length; i++) {
    column = rows[i].getElementsByClassName("playerLastName")[0];
    if (column) {
      columnText = column.innerText;
      if (columnText.toLowerCase().indexOf(searchText) > -1)
        rows[i].classList.remove("hideRow");
      else
        rows[i].classList.add("hideRow");
    }
  }
}
