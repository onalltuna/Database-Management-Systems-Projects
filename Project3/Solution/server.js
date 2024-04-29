const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

// Enable CORS
app.use(cors());

// Configure body-parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456654321q",
  database: "world",
});

pool.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Connected to database");
});

app.listen("3000", () => {
  console.log("Server started at port 3000");
});

function contains(val, col_name, table_name, callback) {
  pool.query(
    `SELECT * FROM ${table_name} WHERE ${col_name} = '${val}'`,
    function (err, result) {
      if (err) {
        throw err;
      } else if (`${result.length}` >= 2) {
        // console.log("True");
        callback(true);
      } else {
        // console.log("FALSE");
        callback(false);
      }
      // console.log(result);
    }
  );
}

function diff_lang(country1, country2, callback) {
  const query = `
  SELECT language
  FROM countrylanguage 
  JOIN country  on countrylanguage.countrycode = country.code
  WHERE country.name = '${country1}' and countrylanguage.language not in 
  
  (SELECT language
  FROM countrylanguage 
  JOIN country on countrylanguage.countrycode = country.code
  WHERE country.name = '${country2}'
  ); `;

  pool.query(query, (error, response) => {
    if (error) throw error;
    callback(response);
  });
}

function diff_lang_join(country1, country2, callback) {
  const query = `
  SELECT  DISTINCT CL.language
  from countrylanguage CL
  JOIN country C on CL.countrycode = C.code
  LEFT JOIN countrylanguage CL2 on C.code = CL2.countrycode
  LEFT JOIN country C2 on CL2.countrycode = C2.code
  and C2.name = '${country2}'
  WHERE C.name = '${country1}' ;
    `;

  pool.query(query, (error, response) => {
    if (error) throw error;
    callback(response);
  });
}

function aggregate_countries(agg_type, country_name, callback) {
  // console.log(agg_type);
  // console.log(country_name);
  const query = `SELECT name 
  FROM country 
  JOIN 
  (SELECT ${agg_type}(lifeexpectancy) as agg_life_expectancy FROM country) x
  ON country.lifeexpectancy > x.agg_life_expectancy
  WHERE country.lifeexpectancy < (SELECT lifeexpectancy FROM country where name = "${country_name}")
  `;

  pool.query(query, (error, response) => {
    if (error) throw error;
    callback(response);
  });
}

function find_min_max_continent(callback) {
  const query = `SELECT country.continent, 
  min(country.lifeexpectancy) as min_country,
  max(country.lifeexpectancy) as max_country,
  (SELECT name FROM country as C WHERE C.continent = country.continent and C.lifeexpectancy = MIN(country.lifeexpectancy)) as min_country_name,
  (SELECT name FROM country as C2 WHERE C2.continent = country.continent and C2.lifeexpectancy = MAX(country.lifeexpectancy)) as max_country_name
FROM country group by country.continent;`;

  pool.query(query, (error, result) => {
    if (error) throw error;
    // callback(result);

    for (var i = 0; i < result.length - 1; i++) {
      console.log(
        result[i].min_country_name +
          " -- " +
          result[i].continent +
          " -- " +
          result[i].min_country
      );
      // console.log(result[i].continent);
      // console.log(result[i].max_country_name);
    }

    for (var i = 0; i < result.length - 1; i++) {
      console.log(
        result[i].max_country_name +
          " -- " +
          result[i].continent +
          " -- " +
          result[i].max_country
      );
      // console.log(result[i].continent);
      // console.log(result[i].max_country_name);
    }
  });
  // console.log("Hello");
}

function find_country_languages(percentage, language, callback) {
  const query = `
    SELECT country.name, countrylanguage.language, countrylanguage.percentage
    FROM countrylanguage
    INNER JOIN country on countrylanguage.countrycode = country.code
    WHERE countrylanguage.Language = "${language}" and countrylanguage.percentage >= ${percentage};
  `;

  pool.query(query, (error, result) => {
    if (error) throw err;

    for (var i = 0; i < result.length; i++) {
      console.log(
        result[i].name +
          " -- " +
          result[i].language +
          " -- " +
          result[i].percentage
      );
    }
    callback(result);
  });
}

function find_country_count(amount, callback) {
  pool.query(query1, function (err, result) {
    if (err) {
      throw err;
    }
    callback(result);
  });
}

app.get("/getDiffLang", (req, res) => {
  const { Country1, Country2 } = req.query;
  diff_lang(Country1, Country2, (results) => {
    console.log(results);
    res.send(results);
  });
});

app.get("/getDiffLangJoin", (req, res) => {
  const { Country1, Country2 } = req.query;
  diff_lang_join(Country1, Country2, (results) => {
    console.log(results);
    res.send(results);
  });
});

app.get("/aggregateCountries", (req, res) => {
  const { agg_type, country_name } = req.query;
  aggregate_countries(agg_type, country_name, (results) => {
    console.log(results);
    res.send(results);
  });
});

app.get("/contains", (req, res) => {
  res.send(
    contains("AFK", "countryCode", "city", function (response) {
      // console.log(error);
      console.log(response);
    })
  );
  res.send(
    contains("AFG", "countryCode", "city", function (response) {
      // console.log(error);
      console.log(response);
    })
  );
});

app.get("/find_min_max_continent", (req, res) => {
  res.send(
    find_min_max_continent(function (error, response) {
      console.log(error);
      console.log(response);
    })
  );
});

app.get("/find_country_languages", (req, res) => {
  res.send(
    find_country_languages(85, "Turkish", function (response) {
      // console.log(response);
    })
  );
});

app.get("/find_country_count", (req, res) => {
  res.send(
    find_country_count(100, function (response) {
      console.log(response);
    })
  );
});
