const { prompt }        = require('enquirer');
const csv               = require('csvtojson');
const axios             = require("axios")
const style             = require("ansi-styles")
const cli               = require("./cli-questions");
const throttledQueue    = require('throttled-queue');
const throttle          = throttledQueue(5, 1000, true);
const bulkThrottle      = throttledQueue(1, 1000, true);
const csvInput          = `./logs/bulkFind` 
const config            = require ("../../config/config")
const token             = config.token
const fs                = require("fs");
const Promise           = require("bluebird")


//THIS SCRIPT WILL OUTPUT TO LOGS/FIND. LOOK FOR YOUR OUTPUT FILE THERE.

const pageGet = (answers) => {

    let domain          = answers.domain
    let courseNumber    = answers.courseNumber
    let searchString    = answers.searchString.toLowerCase()
    let pageNumber      = 1

    const get = () => { 

        let headers = {
            url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/pages?per_page=100&page=${pageNumber}`,
            headers: { Authorization: `Bearer ${token}`}
        }

        axios(headers).then(function(response){
            pages(response.data, domain, courseNumber, searchString)
            if(response.data.length === 100){
                pageNumber++
                get()
            }
        }).catch(function(error){console.log(style.color.ansi16m.hex("#FF0000"),`${error.response.data}`,style.color.close)})
    }
    get()
}

const pages = (data, domain, courseNumber, searchString)=>{

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
                let regex = /courses\/(.*)\/pages/;
                let course_number = regex.exec(url);
                
                console.log(`checking page: ${title} on course` + style.color.ansi16m.hex("#ffff00"), `${course_number[1]}`, style.color.close)

                if(body !== null){
                    let searchIndex = body.indexOf(searchString)
                    if(body !== null){
                        let searchIndex = body.indexOf(searchString)
                        if(searchIndex !== -1){
    
                            let searchWord = new RegExp('[^\\s"]*' + searchString + '[^\\s"]*', "g");
                            let matchedWords = body.match(searchWord);
                            console.log(style.color.ansi16m.hex("#E06666"), `Found "${searchString}" at ${url}`, style.color.close)
                            var titleNoComma = title.replace(new RegExp(/,/g), "_") //get rid of the comma for the CSV
                            for (i = 0; i < matchedWords.length; i++){
                                  fs.appendFile(csvOutput, `${searchString}, ${titleNoComma}, ${url}, ${matchedWords[i]}\n`, function(err) {});
                                  console.log(style.color.ansi16m.hex("#E06666"), `${i+1}) ${matchedWords[i]}`, style.color.close)
                            }
                        }
                    }
                }

            }).catch(function(error){console.log(error.status)})
        })
    })//place callback here for excecuting next item of code
  }



const bulk = ( answers ) => {
    prompt(cli.bulkQuestions)
        .then(answers => {
            if(answers.csv_upload_confirm) {

                fs.readdir(csvInput, (err, files) => {

                    files.forEach(file => {

                        let inputFilePath = `./logs/bulkFind/${file}`

                            csv(answers)
                            .fromFile(inputFilePath)
                            .then(courses => {





                               
                            })
                        })
                    })
            } else {
                console.log("\n\nPlease upload the file and run the script again")
                process.exit
            }
    })
}


module.exports = { bulk }

// console.log(style.color.ansi16m.hex("#FF0000"), `SEARCHING THROUGH ${course.canvas_course_id}`, style.color.close)
//                             answers.courseNumber = course.canvas_course_id;
//                             pageGet(answers)