const cheerio = require('cheerio');



async function Scrape() {
    const url = 'https://learning.stmichaels.vic.edu.au/timetable';
    const response = await fetch(url);
    const html = await response.text();
    console.log(html)


    const $ = cheerio.load(html);
 
    // const text = $('.timetable-subject').text().trim();

    $('.timetable-subject a').each((i, el) => {
    console.log($(el).text().trim());
});

    // console.log(text);



};
Scrape();
// https://www.example.com

// https://learning.stmichaels.vic.edu.au/timetable

