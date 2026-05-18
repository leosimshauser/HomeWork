const cheerio = require('cheerio');



(async () => {
    const url = 'https://learning.stmichaels.vic.edu.au/timetable';
    const response = await fetch(url);

    const $ = cheerio.load(await response.text());
    // console.log($.html());

    // const title = $('h1').text();
    // const text = $('p').text();
    const link = $('a').attr('href');
    const element = $('.data-timetable-subject').text()

    const text = element.textContent; 



    // console.log(title);
    // console.log(text);
    console.log(element);

})();