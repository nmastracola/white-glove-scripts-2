
const { prompt }        = require('enquirer');
const cli               = require("./cli-questions")
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
                        .then((assignments =>{
                            
                            assignments.forEach(assignment=>{
                                throttle(function() {

                                })
                            })
                        })
                    })
                })
            }
        })
    }