module.exports = {

    courseSettingsQuestions: [

          {
            type: 'input',
            name: 'domain',
            message: 'What is the school domain?'
           }, 

           {
            type: 'confirm',
            name: 'student_wiki_edits',
            message: 'Allow Student Wiki Edits?'
           }, 

           {
            type: 'confirm',
            name: 'allow_student_forum_attachments',
            message: 'Allow Student Forum Attachments?'
           }, 

           {
            type: 'confirm',
            name: 'hide_final_grades',
            message: 'Hide Final Grades?'
           }, 

           {
            type: 'confirm',
            name: 'apply_assignment_group_weights',
            message: 'Apply Assignment Group Weights?'
           },

           {
            type: 'Numeral',
            name: 'storage_quota_mb',
            message: 'Course Storage Quote in MBs'
           }, 

           {
            type: 'confirm',
            name: 'confirm',
            message: 'have you placed the courses file to the "input" directory located in ./logs/courseSettings/input ?'
           },
           
    ]

}