
const { prompt }        = require('enquirer');
const cli               = require("./cli-questions")
const axios             = require("axios")
const style             = require("ansi-styles");
const config            = require ("../../config/config")
const throttledQueue    = require('throttled-queue');
const throttle          = throttledQueue(5, 1000, true);
const token             = config.token
const csvOutput         = `./logs/find/output.csv`;
const fs                = require("fs");


  const getPages = (answers)=>{
    prompt(cli.findQuestions)
    .then(answers =>{

        let domain          = answers.domain
        let courseNumber    = answers.courseNumber
        let searchString    = answers.searchString.toLowerCase()
        let pageNumber      = 1

        const getPages=()=>{

            let headers = {
                url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/pages?per_page=100&page=${pageNumber}`,
                headers: { Authorization: `Bearer ${token}`}
            }

            axios(headers).then(function(response){
                pages(response.data, domain, courseNumber, searchString)
                if(response.data.length ===100){
                    pageNumber++
                    getPages()
                }
            }).catch(function(error){console.log(error.status)})
        }

        getPages()

    })
    .catch(function(error){console.log(error)});
  }


  const pages =(data, domain, courseNumber, searchString)=>{

    let pages = data

    pages.forEach(page=>{

        let pageId = page.url

        let headers = {
            url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/pages/${pageId}`,
            headers: {Authorization: `Bearer ${token}`}
        }

        throttle(function() {
            axios(headers).then(function(response){

                let body = response.data.body.toLowerCase()
                let title = response.data.title
                let url = response.data.html_url

                console.log(`checking page: ${title}`)

                if(body !== null){
                    let searchIndex = body.indexOf(searchString)
                    if(searchIndex !== -1){

                        let searchWord = new RegExp('[^\\s"]*' + searchString + '[^\\s"]*', "g");
                        let matchedWords = body.match(searchWord);
                        console.log(style.color.ansi16m.hex("#E06666"), `Found "${searchString}" at ${url}`, style.color.close)
                        var titleNoComma = title.replace(new RegExp(/\,g), "_") //get rid of the comma for the CSV
                        for (i = 0; i < matchedWords.length; i++){
                              fs.appendFile(csvOutput, `${searchString}, ${titleNoComma}, ${url}, ${matchedWords[i]}\n`, function(err) {});
                              console.log(style.color.ansi16m.hex("#E06666"), `${i+1}) ${matchedWords[i]}`, style.color.close)
                        }
                    }
                }

            }).catch(function(error){console.log(error.status)})
        })
    })
  }




  module.exports = { getPages }
