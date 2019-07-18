    
const { prompt } = require('enquirer');
const cli = require("./config/cli-questions")

////// HANDLERS //////////
const find            = require("./handlers/find/find.js")
const bulkFind        = require("./handlers/bulkFind/bulkFind.js")
const replace         = require("./handlers/replace/findAndReplace")
const create          = require("./handlers/create/createAssignments")
const settings        = require("./handlers/settings/courseSettings")
const bannerRemove    = require("./handlers/bannerRemove/bannerRemove")
const flip    = require("./handlers/rubricFlip/flip")
 
prompt(cli.questions)

  .then(answers =>{
    
    if(answers.script === 'Find'){
        find.getPages(answers)
    }else if(answers.script === "Bulk Find"){
        bulkFind.bulk(answers)
    }else if(answers.script === "Find and Replace"){
        replace.getPages(answers)
    }else if(answers.script === "Create Assignments") {
        create.writeAssignments(answers)
    }else if(answers.script === "Course Settings"){
        settings.updateCourse(answers)
    }else if(answers.script === "Banner Removal"){
        bannerRemove.getPages(answers)
    }else if(answers.script === "Rubric Flip"){
        flip.rubricFlip(answers)
    }

  })
  .catch(console.error);
