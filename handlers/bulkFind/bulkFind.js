const { prompt }        = require('enquirer');
const csv               = require('csvtojson');
const cli               = require("./cli-questions");
const throttledQueue    = require('throttled-queue');
const throttle          = throttledQueue(5, 1000, true);
const csvInput          = `./logs/bulkFind`
const fs                = require("fs");
const find              = require('../find/find')


//THIS SCRIPT WILL OUTPUT TO LOGS/FIND. LOOK FOR YOUR OUTPUT FILE THERE.

const warning = () => {
    console.log("This script will output to '/logs/find'. Make sure to look for your output file in there")
}

getPages = find.getPages

const bulk = ( answers ) => {
    prompt(cli.bulkQuestions)
    .then(answers => {
        if(answers.csv_upload_confirm) {

            // setTimeout(warning, 3000);

            fs.readdir(csvInput, (err, files) => {

                files.forEach(file => {

                let inputFilePath = `./logs/bulkFind/${file}`

                    csv(answers)
                    .fromFile(inputFilePath)
                    .then((courses) => {

                            courses.forEach( course => {

                                answers.courseNumber = course.canvas_course_id
                                
                                // throttle(function() { 
                                    find.getPages(answers)
                                // })
                            })

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