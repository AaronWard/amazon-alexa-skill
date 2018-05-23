var Alexa = require('alexa-sdk');
var https = require('https');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('GetBusses');
  },
  'GetBusses' : function() {
    var responseString = '';
    var mythis = this;

    https.get('https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=4619&format=json', (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        responseString += d;
      });

      res.on('end', function(res) {

        var body = JSON.parse(responseString);
        var result = "";

        //numberofresults will return as 0 if it past half 11
        if(body.numberofresults === 0){
            result = "It's too late for busses mate";
        }
        else{
            var resultCount = 0;
            //Display all the bus routes and due times available
            for( var i = 0; i < 3; i++){
                if(body.results[i].route == "25A" || body.results[i].route == "25B" ){
                    //If the bus is due now, dont display "due in due minutes"
                    if(body.results[i].duetime === "Due"){
                      result +=  body.results[i].route + " to " + body.results[i].destination + " due now.\n";
                        
                    }
                    //Stop 1 minute appearing as "1 minutes"
                    else if(body.results[i].duetime === "1"){
                      result +=  body.results[i].route + " to " + body.results[i].destination + " due in " + body.results[i].duetime 
                        + " minute.\n";
                    }
                    else{
                      result +=  body.results[i].route + " to " + body.results[i].destination + " due in " + body.results[i].duetime 
                        + " minutes.\n";
                    }
                    resultCount++;
                }
            }
            //Check if there is not times available
            if(resultCount === 0){
              result = "There is no times available";
            }
        }

        var speechOutput = result;
        mythis.emit(':tell', 'Here are busses coming soon Aaron: '+ speechOutput);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  },
  'AMAZON.HelpIntent': function () {
      this.emit(':ask', "What can I help you with?", "How can I help?");
  },
  'AMAZON.CancelIntent': function () {
      this.emit(':tell', "Okay!");
  },
  'AMAZON.StopIntent': function () {
      this.emit(':tell', "Goodbye!");
  }
};

/******************************************************************************* */
