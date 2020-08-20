const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employeeArray = []; //empty array contains all instances of employee created
const initialQuestion = function () {
    inquirer //ask initial questions
        .prompt([
            {
                type: "list",
                name: "role",
                message: "Who do you want to add to your organization?",
                choices: ["Manager", "Engineer", "Intern"]
            },
            {
                type: "input",
                name: "name",
                message: "What is the person's name?",
                default: "unknown"
            },
            {
                type: "input",
                name: "id",
                message: "What is the person's id?",
                default: "No Id provided"
            },
            {
                type: "input",
                name: "email",
                message: "What is the person's email?",
                validate: (answer) => {
                    if (answer.includes("@") && answer.includes(".")) {
                        return true
                    } else {
                        return "Please use a valid email address"
                    }
                }
            },
        ]).then((data) => {
            let basicInfo = data; // save initial answer into an object
            switch (data.role) { // ask role-specific question
                case "Manager":
                    managerQuestion(basicInfo);
                    break;
                case "Engineer":
                    engineerQuestion(basicInfo);
                    break;
                case "Intern":
                    internQuestion(basicInfo);
                    break;
            }
        })
}
//manager-specific question
const managerQuestion = (basicInfo) => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "officeNumber",
                message: "What is your manager's office number?",
                default: "No office number"
            },
        ]).then((data) => {
            basicInfo.officeNumber = data.officeNumber
            const manager = new Manager(basicInfo.name, basicInfo.id, basicInfo.email, basicInfo.officeNumber);
            employeeArray.push(manager);
            lastQuestion()
        })
}
//engineer-specific question
const engineerQuestion = function (basicInfo) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "github",
                message: "What is your engineer's github username?",
                default: "No github username"
            },
        ]).then((data) => {
            basicInfo.github = data.github
            const engineer = new Engineer(basicInfo.name, basicInfo.id, basicInfo.email, basicInfo.github)
            employeeArray.push(engineer)
            lastQuestion()
        })
}
//intern-specific question
const internQuestion = function (basicInfo) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "school",
                message: "What school does your intern enroll",
                default: "No information"
            },
        ]).then((data) => {
            basicInfo.school = data.school
            const intern = new Intern(basicInfo.name, basicInfo.id, basicInfo.email, basicInfo.school)
            employeeArray.push(intern)
            lastQuestion()
        })
}
//ask if the user want to add another member
const lastQuestion = function () {
    inquirer
        .prompt([
            {
                type: "list",
                name: "continue",
                message: "Would you like to add another member?",
                choices: ["Yes", "No"]
            },
        ]).then((answer)=>{
            if (answer.continue === "Yes"){
                initialQuestion() // continue adding employee
            }
            else if (answer.continue === "No"){
                const html = render(employeeArray) // render html
                fs.writeFile(outputPath,html,function(err) { //write html
                    if (err) {
                      return console.log(err);
                    }
                    console.log("Your employees file has been created");
                })
            }
        })
}


initialQuestion(); // initialize program

