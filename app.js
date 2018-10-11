const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');
var app = express();


var village = {
  lunchSides : [],
  lunchEntree : [],
  dinnerEntree : [],
  dinnerSides : []
}
var duc = {
  delicioso:{
    entree: [],
    sides: [],
  },
  vegatarian:{
    entree:[],
    sides: []
  }
}


//parsing comfort village


const villageRequestInfo = {
  uri: "http://menus.wustl.edu/shortmenu.asp?sName=+&locationNum=60%28b%29&locationName=THE+VILLAGE+-+Comfort&naFlag=1",
  transform: function(body){
    return cheerio.load(body);
  }
};

const ducVegRequestInfo = {
  uri: "http://menus.wustl.edu/shortmenu.asp?sName=+&locationNum=51&locationName=DUC+-+1853+Diner&naFlag=1",
  transform: function(body){
    return cheerio.load(body);
  }
};

const ducComfortRequestInfo = {
  uri: "http://menus.wustl.edu/shortmenu.asp?sName=+&locationNum=51%28c%29&locationName=DUC+-+DeliciOSO&naFlag=1",
  transform: function(body){
    return cheerio.load(body);
  }
};


//parsing village comfort
rp(villageRequestInfo)
  .then(($) => {
    var isLunchEntree = 0;
    var isLunchSide = 0;
    var isDinnerEntree = 0;
    var isDinnerSide = 0;

    //menu items is to avoid repeats
    var menuItems = []
    $("span").each(function(){
      var spanTagText = $(this).text();


      if(spanTagText == "-- EXPRESS LUNCH ENTREE --"){
        isLunchEntree = 1;
        isLunchSide = 0;
      }
      else if(spanTagText == "-- EXPRESS LUNCH SIDE --"){
        isLunchSide = 1;
        isLunchEntree = 0;
      }
      else if(spanTagText == "-- COMFORT ENTREE --"){
        isLunchSide = 0;
        isDinnerEntree = 1;
      }
      else if(spanTagText == "-- COMFORT SIDE --"){
        isDinnerSide = 1;
        isDinnerEntree = 0;
      }

      else if (spanTagText.trim() != "" && !menuItems.includes(spanTagText)){
        menuItems.push(spanTagText);

        if(isLunchEntree){
          village.lunchEntree.push(spanTagText);
        }
        else if(isLunchSide){
          village.lunchSides.push(spanTagText);
        }
        else if(isDinnerSide){
          village.dinnerSides.push(spanTagText);
        }
        else if(isDinnerEntree){
          village.dinnerEntree.push(spanTagText);
        }

      }
    })
  })
  .catch((err) => {
    console.log(err);
  });





//parsing duc vegetarian
rp(ducVegRequestInfo)
  .then(($) => {
    var isLunchEntree = 0;
    var isLunchSide = 0;


    //menu items is to avoid repeats
    var menuItems = []
    $("span").each(function(){
      var spanTagText = $(this).text();


      if(spanTagText == "-- VEGETARIAN ENTREE --"){
        isLunchEntree = 1;
        isLunchSide = 0;
      }
      else if(spanTagText == "-- VEGETARIAN SIDES --"){
        isLunchSide = 1;
        isLunchEntree = 0;
      }
      else if(spanTagText == "-- ENTREE --"){
        isLunchSide = 0;
        isLunchEntree = 0;
      }
      else if (spanTagText.trim() != "" && !menuItems.includes(spanTagText)){
        menuItems.push(spanTagText);

        if(isLunchEntree){
          duc.vegatarian.entree.push(spanTagText);
        }
        else if(isLunchSide){
          duc.vegatarian.sides.push(spanTagText);
        }


      }
    })
  })
  .catch((err) => {
    console.log(err);
  });

//parsing DUC comfort
rp(ducComfortRequestInfo)
.then(($) => {
  var isLunchEntree = 0;
  var isLunchSide = 0;


  //menu items is to avoid repeats
  var menuItems = []
  $("span").each(function(){
    var spanTagText = $(this).text();


    if(spanTagText == "-- COMFORT ENTREE --"){
      isLunchEntree = 1;
      isLunchSide = 0;
    }
    else if(spanTagText == "-- COMFORT SIDES --"){
      isLunchSide = 1;
      isLunchEntree = 0;
    }
    else if(spanTagText == "-- ENTREES --"){
      isLunchSide = 0;
      isLunchEntree = 0;  
    }
    else if (spanTagText.trim() != "" && !menuItems.includes(spanTagText)){
      menuItems.push(spanTagText);

      if(isLunchEntree){
        duc.delicioso.entree.push(spanTagText);
      }
      else if(isLunchSide){
        duc.delicioso.sides.push(spanTagText);
      }


    }
  })

 }) 
.catch((err) => {
  console.log(err);
});


function intervalFunc() {
  //console.log(duc);
}

setInterval(intervalFunc, 150);


function server(){
  app.get('/', function (req, res) {
    res.send(duc);
  });
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
}
setTimeout(server, 1000)