const express = require('express');
const hbs = require('hbs');
const axios = require('axios');
const fs = require('fs');

var app = express();
hbs.registerPartials(__dirname + '/views/partials');

app.set('views', __dirname);
app.set('view enginge', 'hbs');

app.use(express.static(__dirname+ '/public'));

hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

app.use((request,response,next)=>{
    var time = new Date().toString();
    // console.log(`${time}: ${request.method} ${request.url}`);
    var log = `${time}: ${request.method} ${request.url}`;
    fs.appendFile('server.log',log+'\n', (error)=>{
        if (error){
            console.log('unable to log message');
        }
    });
    next();
});


hbs.registerHelper('message',(text)=>{
    return text.toUpperCase();
});

app.get('/info',(request,response)=>{
    response.render('public/about.hbs', {
        title: 'Main page',
        header:'Welcome to my website!',
    });
});

app.get('/me',(request,response)=>{
    response.render('public/me.hbs', {
        title: 'About page',
        header: 'This page is about me, me, me!',
    });
});

app.get('/currency',async(request,response)=> {
    //Uses API to get currency code
    try{
        var object = await  axios.get('https://restcountries.eu/rest/v2/name/canada?fullText=true');
        var code = object.data[0].currencies[0].code;
        var currency = await  axios.get(`https://api.exchangeratesapi.io/latest?symbols=${code}&base=USD`);
        var x = JSON.stringify(currency.data.rates[`${code}`]);

        response.render('public/currency.hbs', {
            title: 'Currency',
            header: 'Conversion Rate:',
            money: `1 USD is worth ${x} CAD`
        });
    }catch(e){
        if (e === undefined){
            //Country isn't recognized by API
            response.render('public/currency.hbs', {
                title: 'Currency',
                header: 'Conversion Rate:',
                money: `1 USD is worth ${x} CAD`
            });
        } else if (e.response.data.status === 404) {
            //Country isn't recognized by API
            response.render('publiccurrency.hbs', {
                title: 'Currency',
                header: 'Conversion Rate:',
                money: 'Error: Rest Country does not recognize the country. '
            });
        }else{
            response.render('public/currency.hbs', {
                title: 'Currency',
                header: 'Conversion Rate:',
                money: 'Error: Exchange Rate does not recognize the country code. '
            });
        }
    }
});

app.use((request,response) => {
    //error page renders if the get URL doesnt match any of the above
    response.render('public/error.hbs', {
        title: 'Oh no!',
        header: 'This page is BROKEN',
    });
});
app.listen(8080,()=>{
    console.log('Server is up on the port 8080');
});