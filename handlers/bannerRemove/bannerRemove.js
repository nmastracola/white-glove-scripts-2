
const { prompt }        = require('enquirer');
const cli               = require("./cli-questions")
const axios             = require("axios")
const style             = require("ansi-styles");
const config            = require ("../../config/config")
const throttledQueue    = require('throttled-queue');
const throttle          = throttledQueue(5, 1000, true);
const token             = config.token
const csvOutput         = `./logs/bannerRemove/output.csv`;
const fs                = require("fs");
 

  const getPages = (answers)=>{
    prompt(cli.bannerRemoveQuestions)
    .then(answers =>{

        let domain          = answers.domain
        let courseNumber    = answers.courseNumber
        let searchString    = answers.searchString
        let replaceString   = answers.replaceString
        let pageNumber      = 1

        const getPages=()=>{

            let headers = {
                url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/pages?per_page=100&page=${pageNumber}`,
                headers: { Authorization: `Bearer ${token}`}
            }

            axios(headers).then(function(response){
                pages(response.data, domain, courseNumber, searchString, replaceString)
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


  const pages =(data, domain, courseNumber, searchString, replaceString)=>{

    let pages = data

    pages.forEach(page=>{

        let pageId = page.url

        let headers = {
            url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/pages/${pageId}`,
            headers: {Authorization: `Bearer ${token}`}
        }

        throttle(function() {
            axios(headers).then(function(response){

                let body = response.data.body
                let title = response.data.title
                let url = response.data.html_url
                // let searchStringGlobal = new RegExp('\\b' + searchString + '\\b', "gi");
                let searchStringGlobal = new RegExp(searchString, 'gi');

                console.log(`checking page: ${title}`)

                if(body !== null){
                    // let searchIndex = body.toLowerCase().indexOf(searchString.toLowerCase())
                    // if(searchIndex !== -1){
                    let matchStrings = body.match(searchStringGlobal)
                    if ((match = searchStringGlobal.exec(body)) !== null) {
                        // let replaceMatches = matchStrings[0].match(new RegExp(replaceString, 'i'))
                        
                        // Use this if replacing with a portion of the found item, eg. the UTA banner title
                        // let replaceHTML = replaceMatches[0] 
                        // Same as above except with extra HTML formatting for a new header
                        // let replaceHTML = '<h2><span style="color: #003366;">' + replaceMatches[0] + '</span></h2>\n<hr />'

                        let newBody = body
                        // Use this if replacing with user input
                        newBody = newBody.replace(searchStringGlobal, replaceString)
                        // Use this if replacing with a portion of the found item, eg. the UTA banner title
                        // newBody = newBody.replace(searchStringGlobal, replaceHTML)

                        let putHeaders = {
                            url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/pages/${pageId}`,
                            method: "put",
                            headers: {Authorization: `Bearer ${token}`},
                            data:{"wiki_page": {"body": newBody}}
                        }

                        axios(putHeaders)
                            .then(function(response){
                                if(response.status === 200){
                                    console.log(style.color.ansi16m.hex("#E06666"), `Replaced it here, ${url}`, style.color.close)
                                    fs.appendFile(csvOutput, `${searchString}, ${title}, ${url}\n`, function(err) {});
                                }
                            }).catch(function(error){console.log(error)})
                    }
                    // }
                }

            }).catch(function(error){console.log(error.status)})
        })
    })
  }



  module.exports = { getPages }