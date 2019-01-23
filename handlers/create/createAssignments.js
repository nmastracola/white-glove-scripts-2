
const { prompt }        = require('enquirer');
const cli               = require("./cli-questions.js")
const axios             = require("axios")
const style             = require("ansi-styles");
const config            = require ("../../config/config")
const fs                = require("fs");
const throttledQueue    = require('throttled-queue');
const throttle          = throttledQueue(5, 1000, true);
const token             = config.token
const csvInput       = `./logs/assignmentCreation`

    const writeAssignments = (answers) =>{

        prompt(cli.createQuestions)
        .then(answers =>{

            if(answers.confirm){
                fs.readdir(csvInput, (err, files) => {
                    
                    files.forEach(file => {
                        let inputFilePath = `./logs/assignmentCreation/${file}`

                        let domain        = answer.domain

                        csv()
                        .fromFile(inputFilePath)
                        .then((assignments) =>{
                            
                            assignments.forEach(assignment=>{
                                throttle(function() {
                                    
                                    let payload = {
                                        url: `https://${domain}.instructure.com/api/v1/courses/${course.canvas_course_id}/assignments`,
                                        headers: {Authorization: `Bearer ${token}`},
                                        method: "post",
                                        data: assignment
                                    }

                                axios(payload).then(function(response){
                                    if(response.status === 200){
                                        console.log(style.color.ansi16m.hex("#E06666"), `Assignment written to: ${course.canvas_course_id}`, style.color.close)
                                    }
                                }).catch(function(error){console.log(error)})   

                                })
                            })
                        })
                    })
                })
            } else {
                console.log("\n\nPlease upload the file and run the script again")
            }
        })
        .catch(function(error){console.log(error)});
    }

    module.exports = { writeAssignments }