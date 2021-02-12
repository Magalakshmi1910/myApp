//require express for easy routing
var express = require('express');
var app = express();

//bodyparser is required for getting values from user
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({
      extended:true
    }));

//make node  aware of ejs files
app.set('view engine','ejs');

app.route('/')
  //display main page
  .get((req,res)=>{
    res.render('index',{hours:false,totalMinutes:false,extraMinutes:false,totalHours:false});
    })

  .post((req,res)=>{
    var items = [];
    //get the input from user
    var input = req.body.time;
    //store the input into array
    items = input.split('\r\n');

    //find total hours and minutes
    var hours = findTotalHours(items);
    var totalMinutes = findTotalMinutes(items);

    if(totalMinutes>59){
      //To convert extra minutes to hours
      var minutesToHours = totalMinutes/60;
      var extraHours = parseInt(minutesToHours);

      //add the extra hours to already calculated hours
      var totalHours = parseInt(hours)+parseInt(extraHours);

      //check if the result after divided by 1 hour is a round number or decimal. if decimal then, convert
      //that value to hours
      if(!(Number(minutesToHours) === minutesToHours && minutesToHours % 1 === 0))
           var extraMinutes = convertMinutesToHours(minutesToHours);
      else
          var extraMinutes = 0 ;
    }
    else
    {
      totalHours = hours;
       extraMinutes = totalMinutes;
    }

    res.render('index',{hours:hours,totalMinutes:totalMinutes,extraMinutes:extraMinutes,totalHours:totalHours});
    })


//app.listen(3000);

//to find total hours
function findTotalHours(items)
{
  var total = 0;
  for(var i in items)
  {
    //to get only the hours
    var intvalue = Math.trunc(items[i]);
    total += (isNaN(intvalue) || intvalue=="") ? 0 : parseInt(intvalue);
  }
  return total;
}

//to find total minutes
function findTotalMinutes(items){
    var totalminutes = 0;

    for(var i in items)
    {
      var number = items[i];
      //to get the values after the decimal point
      number = number.toString().substring(number.toString().indexOf(".")).substring(1);
      totalminutes += (isNaN(number) || number=="") ? 0 : parseInt(number);
    }

    return totalminutes;
}

function convertMinutesToHours(convert)
{
  convert = convert.toFixed(2);
  afterDecimal = convert.toString().substring(convert.toString().indexOf(".")).substring(1);
  var result = (afterDecimal/100)*60;
  return Math.round(result);
}
