const scrapeIt = require("scrape-it")
const fs = require("fs")

scrapeIt("http://www.imdb.com/name/nm0000115/", {
        movies: {
            listItem: "[id^=actor-]",
            data: {
                url: {
                    selector: 'a:first-child',
                    attr: 'href'
                }
            }
        }
    })
    .then(page => {
        urls = page.movies.map( movie => 'http://www.imdb.com' + movie.url)

        Promise.all(urls.map( url => getPage(url) ))
            .then(result => {
                fs.writeFile('./data.json', JSON.stringify(result, null, 2), 'utf-8', (err) => {
                    if (err) throw err;
                    console.log('Arquivo salvo')
                });
            })

    })
    .catch( err => console.log(err));

var getPage = url => {
    console.log(`extraindo pagina ${url}`)


    return scrapeIt(url, {
        title: "h1",
        summary: "div.summary_text",
        rating: "[itemprop=ratingValue]"
    }).catch(err => console.log(err));
}

//Promise.all([getPage("http://www.imdb.com/title/tt1502404/?ref_=nm_flmg_act_31")]).then(data => console.log(data))