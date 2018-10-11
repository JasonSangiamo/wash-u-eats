const rp = require('request-promise');
const cheerio = require('cheerio');

const requestInfo = {
  uri: "http://menus.wustl.edu/shortmenu.asp?sName=+&locationNum=60%28b%29&locationName=THE+VILLAGE+-+Comfort&naFlag=1",
  transform: function(body){
    return cheerio.load(body);
  }
};

rp(requestInfo)
  .then(($) => {
    var nextIsEntree = 0;
    var counter = 0;
    $("span", "a").each(function(i, elem){
      counter++;
      if(counter == 9 || counter == 11 || counter == 13){
        console.log($(this).text());
      }

      // var element = $(this).text();
      // if(nextIsEntree){
      //   console.log($(this));
      //   console.log($(this).text());
      //   nextIsEntree = 0;
      // }

      // if(element == "-- COMFORT ENTREE --"){
      //   nextIsEntree  = 1;
      // }
    })
  })
  .catch((err) => {
    console.log(err);
  });

