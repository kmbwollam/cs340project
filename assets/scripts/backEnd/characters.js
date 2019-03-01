module.exports = function(){

    var express = require('express');

    var router = express.Router();

 

               

//gets a list of characters and all feilds for form

                function getCharacters(res, mysql, context, complete){

        mysql.pool.query("SELECT Player_First_Name, Player_Last_Name, Character_Name, Race, Class.Class_name, Armor.Name, Armor_Equipped, Shield_Equipped, Level, Wealth FROM Characters INNER JOIN Class ON Characters.Class = Class.Class_ID INNER JOIN Armor ON Characters.Armor = Armor.Armor_ID",

                                function(error, results, fields){

            if(error){

                res.write(JSON.stringify(error));

                res.end();

            }

            context.characters = results;

            complete();

        });

    }

 

//gets a list of Armor available for drop down

                function getArmor(res, mysql, context, complete){

        mysql.pool.query("SELECT Armor_ID, Name FROM Armor", function(error, results, fields){

            if(error){

                res.write(JSON.stringify(error));

                res.end();

            }

            context.armor  = results;

            complete();

        });

    }

 

//gets a list of Classes available for drop down

                function getClass(res, mysql, context, complete){

        mysql.pool.query("SELECT Class_ID, Class_Name FROM Class", function(error, results, fields){

            if(error){

                res.write(JSON.stringify(error));

                res.end();

            }

            context.class  = results;

            complete();

        });

    }

 

//gets a list of player first name for filer selection            

                function getPlayer(res, mysql, context, complete){

        mysql.pool.query("SELECT Player_First_Name FROM Characters", function(error, results, fields){

            if(error){

                res.write(JSON.stringify(error));

                res.end();

            }

            context.class  = results;

            complete();

        });

    }

               

               

// for filtering

                function getCharactersbyPlayer(req, res, mysql, context, complete){

      var query = "SELECT Player_First_Name, Player_Last_Name, Character_Name, Race, Class.Class_name, Armor.Name, Armor_Equipped, Shield_Equipped, Level, Wealth FROM Characters INNER JOIN Class ON Characters.Class = Class.Class_ID INNER JOIN Armor ON Characters.Armor = Armor.Armor_ID WHERE Characters.Player_First_Name = ?";

      console.log(req.params)

      var inserts = [req.params.Player_First_Name]

                                mysql.pool.query(query, inserts, function(error, results, fields){

            if(error){

                res.write(JSON.stringify(error));

                res.end();

            }

            context.characters = results;

            complete();

        });

    }

 

 

//display all characters. Requires web based javascript to delete users with AJAX

 

    router.get('/', function(req, res){

        var callbackCount = 0;

        var context = {};

        context.jsscripts = ["deletecharacter.js","filtercharacters.js",];

        var mysql = req.app.get('mysql');

        getCharacters(res, mysql, context, complete);

        getClasses(res, mysql, context, complete);

                                getArmor(res, mysql, context, complete);

        function complete(){

            callbackCount++;

            if(callbackCount >= 3){

                res.render('people', context);

            }

 

        }

    });

 

//Display all characters from a given player first name. Requires web based javascript to delete users with AJAX

    router.get('/filter/:Player_First_Name', function(req, res){

        var callbackCount = 0;

        var context = {};

        context.jsscripts = ["deletecharacter.js","filtercharacters.js",];

        var mysql = req.app.get('mysql');

        getCharactersbyPlayer(req,res, mysql, context, complete);

        getArmor(res, mysql, context, complete);

                                getClass(res, mysql, context, complete);

        function complete(){

            callbackCount++;

            if(callbackCount >= 3){

                res.render('people', context);

            }

 

        }

    });      

 

 

// Display one character for the specific purpose of updating people

 

    router.get('/:id', function(req, res){

        callbackCount = 0;

        var context = {};

        context.jsscripts = ["updatecharacter.js"];

        var mysql = req.app.get('mysql');

        getCharactersbyPlayer(req,res, mysql, context, complete);

        getArmor(res, mysql, context, complete);

                                getClass(res, mysql, context, complete);

        function complete(){

            callbackCount++;

            if(callbackCount >= 3){

                res.render('update-person', context);

            }

 

        }

    });

 

 

    /* Adds a character, redirects to the character page after adding */

 

    router.post('/', function(req, res){

        //?  console.log(req.body.homeworld)

        console.log(req.body)

        var mysql = req.app.get('mysql');

        var sql = "INSERT INTO Characters (Player_First_Name, Player_Last_Name, Character_Name, Race, Class, Armor, Armor_Equipped, Shield_Equipped, Level, Wealth) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?)";

        var inserts = [req.body.fname, req.body.lname, req.body.charname, req.body.race, req.body.class, req.body.armor, req.body.aequip, req.body.sequip, req.body.level, req.body.wealth];

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){

            if(error){

                console.log(JSON.stringify(error))

                res.write(JSON.stringify(error));

                res.end();

            }else{

                res.redirect('/characters');

            }

        });

    });

               

/* The URI that update data is sent to in order to update a character - PLACE HOLDER CODE

 

    router.put('/:id', function(req, res){

        var mysql = req.app.get('mysql');

        console.log(req.body)

        console.log(req.params.id)

        var sql = "UPDATE bsg_people SET fname=?, lname=?, homeworld=?, age=? WHERE character_id=?";

        var inserts = [req.body.fname, req.body.lname, req.body.homeworld, req.body.age, req.params.id];

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){

            if(error){

                console.log(error)

                res.write(JSON.stringify(error));

                res.end();

            }else{

                res.status(200);

                res.end();

            }

        });

    });

                */

               

                    /* Route to delete a character, simply returns a 202 upon success. Ajax will handle this.

                                ---Place holder code

 

    router.delete('/:id', function(req, res){

        var mysql = req.app.get('mysql');

        var sql = "DELETE FROM bsg_people WHERE character_id = ?";

        var inserts = [req.params.id];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){

            if(error){

                res.write(JSON.stringify(error));

                res.status(400);

                res.end();

            }else{

                res.status(202).end();

            }

        })

    })

 

    return router;

}()

                */

               