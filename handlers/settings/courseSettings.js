const { prompt }        = require('enquirer');
const cli               = require("./cli-questions")
const axios             = require("axios")
const style             = require("ansi-styles");
const csv               = require('csvtojson')
const config            = require ("../../config/config")
const fs                = require("fs");
const throttledQueue    = require('throttled-queue');
const throttle          = throttledQueue(5, 1000, true);
const token             = config.token
const inputLocation     = "./logs/courseSettings/input"
const outputLocation    = "./logs/courseSettings/output/output.csv"
 

  const updateCourse = (answers)=>{

    prompt(cli.courseSettingsQuestions)
    .then(answers =>{

        if(answers.confirm){
            fs.readdir(inputLocation, (err, files) => {

                files.forEach(file => {
                let inputFilePath = `./logs/courseSettings/input/${file}`
                let newinputFilePath = `./logs/courseSettings/archive/${file}`


                let domain          = answers.domain

                let settings = {
                    "course": {
                        "student_wiki_edits": answers.student_wiki_edits,
                        "allow_student_forum_attachments": answers.allow_student_forum_attachments,
                        "hide_final_grades": answers.hide_final_grades,
                        "apply_assignment_group_weights": answers.apply_assignment_group_weights,
                    }
                }

                if(answers.storage_quota_mb !== 0){
                    settings.course.storage_quota_mb = answers.storage_quota_mb
                }

                csv()
                .fromFile(inputFilePath)
                .then((courses)=>{

                    courses.forEach(course=>{
                        throttle(function() {

                            let payload ={
                                url: `https://${domain}.instructure.com/api/v1/courses/${course.canvas_course_id}`,
                                headers: {Authorization: `Bearer ${token}`},
                                method: "put",
                                data: settings
                            }

                            axios(payload).then(function(response){
                                if(response.status === 200){
                                    console.log(style.color.ansi16m.hex("#E06666"), `Updated course: ${course.canvas_course_id}`, style.color.close)
                                    fs.appendFile(outputLocation, `courseID: ${course.canvas_course_id}, status_code: ${response.status}\n`, function(err) {});
                                }
                            }).catch(function(error){console.log(error)})
                        })
                    })

                })
                .then(function(){
                    fs.rename(inputFilePath, newinputFilePath, function (err) {});
                })

                .catch(function(error){console.log(error)})
            });
            })
        }else{
            console.log("\n\nPlease upload the file and run the script again.")
        }

    })
    .catch(function(error){console.log(error)});
  }



  module.exports = { updateCourse }



