const express = require('express');
const hbs = require('hbs');
const axios = require('axios');

var app = express();
hbs.registerPartials(__dirname + '/views/partials');

app.set('views', __dirname);
app.set('view enginge', 'hbs');

app.use(express.static(__dirname+ '/public'));

hbs.registerHelper('getMoney',()=>{
    return money();
});

hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

hbs.registerHelper('message',(text)=>{
    return text.toUpperCase();
});

app.get('/info',(request,response)=>{
    response.render('about.hbs', {
        title: 'Main page',
        header:'Welcome to my website!',
    });
});

app.get('/me',(request,response)=>{
    response.render('me.hbs', {
        title: 'About page',
        header: 'This page is about me, me, me!',
    });
});

app.get('/currency',(request,response)=>{
        response.render('currency.hbs', {
            title: 'Currency',
            header: 'Conversion Rate:',
        });
});

var money = (async(request,response)=> {
    //Uses API to get currency code
    try{
        var object = await  axios.get('https://restcountries.eu/rest/v2/name/canada?fullText=true');
        var code = object.data[0].currencies[0].code;
        var currency = await  axios.get(`https://api.exchangeratesapi.io/latest?symbols=${code}&base=USD`);
        var x = JSON.stringify(currency.data.rates[`${code}`]);
        console.log(x)
        response.render(x)

    }catch(e){
        if (e === undefined){
            //Country isn't recognized by API
            throw( 'Country isnt recognized by API')
        } else if (e.response.data.status === 404) {
            //Country isn't recognized by API
            throw('Cannot connect to API')
        }else{
            throw('CRITICAL ERROR')
        }
    }
});

app.get('/404',(request,response) => {
    response.send({
        error: 'Page not found'
    })
});

app.listen(8080,()=>{
    console.log('Server is up on the port 8080');
});