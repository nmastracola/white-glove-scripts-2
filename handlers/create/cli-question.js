module.exports = {

    createQuestions:[

        {
            type: 'input',
            name: 'domain',
            message: 'What is the school domain?'
           }, 

           {
            type: 'input',
            name: 'courseNumber',
            message: 'What is the course number?'
           }, 

           {
            type: 'confirm',
            name: 'csv_upload_confirm',
            message: 'Did you upload your csv file into "/log/assignmentCreation"?'
           },
    ]
}