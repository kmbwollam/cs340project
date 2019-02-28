var express = require('express');
var mysql = require('./dbcon.js'); // allows you to use exported variables from this file
var rootScript = require('../../../index.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// to have images and styles
app.use(express.static(rootScript.rootPath + '/node_modules/bootstrap/dist'));
app.use('/jsBootstrap', express.static(rootScript.rootPath + '/node_modules/bootstrap/dist/js'));
// to use bootstrap js and css
// app.use('/jsJquery', express.static(rootScript.rootPath + '/node_modules/jquery/dist'));
// app.use('/css', express.static(rootScript.rootPath + '/node_modules/bootstrap/dist/css'));
// app.use('/assets', express.static(rootScript.rootPath + '/assets'));

// to use index.html
app.use(express.static(rootScript.rootPath + '/assets'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//update this / set to a variable
app.set('port', 32400);


//// point to index.html
app.get('/',function(req,res,next){
  console.log("Homepage")
  res.sendFile(rootScript.rootPath + '/index.html');
});


// create
//http://flip2.engr.oregonstate.edu:/*port*//insert?id=2&name=The+Task&done=false&due=2015-12-5
app.get('/insert',function(req,res,next){
  console.log("INSERT GETting it")
  var context = {};
  mysql.pool.query("INSERT INTO workouts (`id`,`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?,?)"
  , [req.query.id, req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs]
  , function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId; // this corresponds to a {{results}} var in one of handlebars files. - could stringify(fields) instead if needed more info / formatting
    res.render('home',context);
  });
});

//// read
// show everything in db
app.get('/',function(req,res,next){

  var context = {};
  //
    // DATE_FORMAT(date, "%m/%d/%Y") AS newDatevvvvv
  //
  mysql.pool.query('SELECT `id`,`name`,`reps`,`weight`,DATE_FORMAT(`date`, "%m-%d-%Y") as date,`lbs` FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
      // handlebars if just want a dump of the data <p>{{workouts}}</p>
    //context.workouts = JSON.stringify(rows); // this corresponds to a {{results}} var in one of handlebars files. - could stringify(fields) instead if needed more info / formatting
    context.workouts = rows;
    //console.log("context.workouts: ");
    //console.log(context.workouts);
    //context.workouts = JSON.stringify(rows);

    //console.log("context.workouts: ");
    //console.log(context.workouts);

    //console.log("context.workouts.length: " + context.workouts.length);
    //console.log("rows: " + rows);
    //console.log("fields: " + fields);
    // //var beer: req.beer.toJSON({ virtuals: true })
    // for (var i=0;i<context.workouts.length;i++){
    //     for (var j=0;j<context.workouts.length;j++){
    //     console.log("context.workouts[" + i +"][" + j + "]: " + context.workouts[i][j])
    //   }
    // }
    res.render('home', context);
  });
});

app.get('/', function (req, res, next) {

    var context = {};
    //
    // DATE_FORMAT(date, "%m/%d/%Y") AS newDatevvvvv
    //
    mysql.pool.query('SELECT * FROM workouts', function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        // handlebars if just want a dump of the data <p>{{workouts}}</p>
        //context.workouts = JSON.stringify(rows); // this corresponds to a {{results}} var in one of handlebars files. - could stringify(fields) instead if needed more info / formatting
        //context.workouts = rows;
        //console.log("context.workouts: ");
        //console.log(context.workouts);
        context.workouts = JSON.stringify(rows);
        console.log("context.workouts: ");
        console.log(context.workouts);

        console.log("context.workouts.length: " + context.workouts.length);
        console.log("rows: " + rows);
        console.log("fields: " + fields);
        // //var beer: req.beer.toJSON({ virtuals: true })
        // for (var i=0;i<context.workouts.length;i++){
        //     for (var j=0;j<context.workouts.length;j++){
        //     console.log("context.workouts[" + i +"][" + j + "]: " + context.workouts[i][j])
        //   }
        // }

        //res.render('home', context);
        res.json(
            context.workouts
            //{ user: 'tobi' } // to test if working
        );
    });
    return context.workouts;
});

//// update this way, so don't turn values not being sent into null values
//localhost:3000/safe-update?id=2&name=The+Task&done=false&due=2015-12-5
//http://flip2.engr.oregonstate.edu:32400/safe-update?id=2&name=TheNewGuy&reps=3&weight=50&date=2018-06-07&lbs=1
app.get('/safe-update',function(req,res,next){
  console.log("Update GETting it")
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){ // result returns an array of objects
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      console.log("curVals.id: " + curVals.id);
      mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name,
          req.query.reps || curVals.reps,
          req.query.weight || curVals.weight,
          req.query.date || curVals.date,
          req.query.lbs || curVals.lbs,
          req.query.id], // note that "done" is a bool, but in this case in node.js when we get back the params in the query string, the params are all strings. so a string that has a zero or one, or anything else in it, it will evaluate to true.
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render('home', context);
      });
    }
  });
});


//// delete
//http://flip2.engr.oregonstate.edu:32400/delete?id=2
app.get('/delete',function(req,res,next){
  console.log("DELETE GETting it")
  var context = {};
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){ // these are backticks around `name`, which are for table and column names
    // VALUES (?) makes it so you can't execute the values that are entered, so makes it harder for ppl to hack. Ppl could enter in SQL query like: "var command = "Insert INTO tidi ('name` VALUES ' + "('foo;); SELECT * FROM passwords;'"
    // want to pass it an array of values to insert
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted " + result.changedRows + " rows."; // this corresponds to a {{results}} var in one of handlebars files. - could stringify(fields) instead if needed more info / formatting
    res.render('home',context);
  });
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
