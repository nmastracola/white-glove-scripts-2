const { prompt }        = require('enquirer');
const cli               = require("./cli-questions")
const axios             = require("axios")
const style             = require("ansi-styles");
const config            = require ("../../config/config")
const throttledQueue    = require('throttled-queue');
const throttle          = throttledQueue(5, 1000, true);
const token             = config.token


  const rubricFlip = (answers)=>{
    prompt(cli.findQuestions)
    .then(answers =>{

        let domain          = answers.domain
        let courseNumber    = answers.courseNumber
        let rubricID        = answers.rubricID

        
        const getRubric = ()=>{

            let headers = {
                url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/rubrics/${rubricID}`,
                headers: { Authorization: `Bearer ${token}`}
            }

            axios(headers).then(function(response){

                rubric(response.data, domain, courseNumber, rubricID)
    
            }).catch(function(error){console.log("Beep boop " + error)})
        }

        getRubric();

    })
    .catch(function(error){console.log("Boop beep" + error)
    })
  }



  const rubric = (response, domain, courseNumber, rubricID) => {

    let rubrics = response.data
    
    rubrics.forEach(rubric => {
            rubric.ratings.reverse();
            let ratingsMap = new Map(Object.entries(rubric.ratings))
            rubric.ratings = ratingsMap
        }
    )
    
    const rubricHash = new Map(Object.entries(rubrics))

    
    let postHeaders = {
        url: `https://${domain}.instructure.com/api/v1/courses/${courseNumber}/rubrics/`,
        method: "post",
        headers: { Authorization: `Bearer ${token}`},
        data: {
            "rubric[title]": `${response.title} flipped`,
            "rubric[criteria]" : rubricHash
        }
    }

    // console.log(putHeaders)

    axios(postHeaders)
        .then(function(response){
            console.log("ding " + response.status)
            // console.dir(response, {depth: null})
            // if(response.status === 200){
            //     console.log("Success " + response)
            // }
            
        }).catch(function(error){console.log("Oh no " + error)})

}

module.exports = { rubricFlip }


