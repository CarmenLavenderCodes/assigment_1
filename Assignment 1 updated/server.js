var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/product.data.js');
var products = data.products;


app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();  //used for diagnostics to see whats requests, accepting any requests, next pushes to the next request
});

app.use(myParser.urlencoded({ extended: true }));
app.get("/process_form", function (request, response) {
    let GET = request.query;
    var i = request.url.indexOf('?');
    var query = request.url.substr(i+1);

    function isNonNegInt(q, return_errors = false) {  //this code came from lab12
        errors = []; // assume no errors at first
        if (q == '') q = 0; // handle blank inputs as if they are 0
        if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
        else if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
        else if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
        return return_errors ? errors : (errors.length == 0);
    };
   

    
    //this is a diagnostic
    // validate that the quantities are good, if the quantity is good give them an invoice other wise send them back to products display if each quantity is non negative int
    //in the validation there is 2 things to check, 1 if each quantity txtbox has a non negative int or blank, 2 did they select atleast 1 surfboard
    // process_quantity_form(POST, response)
    // here is a request and a response
    if (typeof GET['purchase_submit'] != 'undefined') {
        has_errors = false; // quantities always valid from the start ((use post instead of params))
        total_qty = 0; //  if the total great than zero
        for (i = 0; i < products.length; i++) {
             if (typeof GET[`quantity${i}`] != 'undefined') {
                a_qty = GET[`quantity${i}`];
            
                
                total_qty += a_qty;
                if (!isNonNegInt(a_qty)) {
                    has_errors = true; // indicates invalid quantity
                   
                };
            };
        };
    };

  //responde to errors
  if (has_errors ) {
    alert("Please use valid quantities!");
} else if (total_qty == 0) { //general alert
    alert("Please choose quantities!");
};
};
}


    // data is valid go back to the invoice, if the data is invalid go back to the products display page
    response.redirect('Products.display.html?'+query);
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));