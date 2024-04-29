async function diff_language() {
  var country1 = document.getElementById("Country1").value;
  var country2 = document.getElementById("Country2").value;

  const url = `http://localhost:3000/getDiffLang?Country1=${country1}&Country2=${country2}`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

async function diff_languagejoin() {
  var country1 = document.getElementById("Country1").value;
  var country2 = document.getElementById("Country2").value;

  // const data = {country1,country2};

  const url = `http://localhost:3000/getDiffLangJoin?Country1=${country1}&Country2=${country2}`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

async function AAggregate_Countries() {
  var type = document.getElementById("Type").value;
  var countryName = document.getElementById("CountryName").value;

  console.log(type);
  console.log(countryName);

  const url = `http://localhost:3000/aggregateCountries?agg_type=${type}&country_name=${countryName}`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

function aa() {
  var table = document.getElementById("outputTable");
  diff_language().then((response) => {
    for (var i = 0; i < response.length; i++) {
      var row = table.insertRow();
      var languageCell = row.insertCell(0);

      languageCell.innerHTML = response[i].language;
    }
  });
}

function bb() {
  var table = document.getElementById("outputTable2");
  diff_languagejoin().then((response) => {
    for (var i = 0; i < response.length; i++) {
      var row = table.insertRow();
      var languageCell = row.insertCell(0);

      languageCell.innerHTML = response[i].language;
    }
  });
}

function cc() {
  var table = document.getElementById("outputTable3");
  AAggregate_Countries().then((response) => {
    for (var i = 0; i < response.length; i++) {
      var row = table.insertRow();
      var nameCell = row.insertCell(0);

      nameCell.innerHTML = response[i].name;
    }
    // console.log(response);
  });
}
