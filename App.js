const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
// use port 3001
const port = process.env.PORT || 3001

// get data from the body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*',(req, res)=> {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build','index.html'));
    });
}
    
app.use(express.static(path.join(__dirname,'frontend/build')));

// get the projects data from web_projects.json, create the file if it does not exist
function getProjects() {
    try {
      const content = fs.readFileSync('web_projects.json');
      return JSON.parse(content);
    } catch (e) {
      fs.writeFileSync('web_projects.json', '[]');
      return [];
    }
  }

// function to add a new project to the json file
function addProject(newProject) {
    const projects = getProjects()
    projects.push(newProject)

    // update the json file
    fs.writeFileSync('web_projects.json', JSON.stringify(projects))
}

// resets all the project ids when a project is deleted
function resetProjectID() {
    const projects = getProjects()
    projects.map((project, index) => {
        projects[index].id = index
    })

    fs.writeFileSync('web_projects.json', JSON.stringify(projects))
}

// function to delete a project from the json file
function deleteProject(id) {
    const projects = getProjects()
    // use .findIndex to get the project with the specified id
    const index = projects.findIndex(obj => obj.id === id)
    
    // splice it from the array
    projects.splice(index, 1)
    // update the json file
    fs.writeFileSync('web_projects.json', JSON.stringify(projects))
    resetProjectID()
}


// display the array of projects
app.get('/api/', (req, res) => {
    const projects = getProjects()
    res.json(projects)
})  

// add a new project to the list
app.post('/api/', (req, resp) => {
    const projects = getProjects();
    // find the project with the max id and add 1 to it
    const newProjectID = Math.max(...projects.map(project => project.id)) + 1;
    // get the project data from req.body
    const title = req.body.title;
    const description = req.body.description;
    const url = req.body.url;
  
    // create a new project from the requests
    const newProject = { id: newProjectID, title: title, description: description, URL: url };
  
    // call function to update the json file
    addProject(newProject);

    resp.json({ message: 'Project added successfully' });
});

// update a project in the json file
app.put('/api/', (req, resp) => {
    const projects = getProjects()
    // update a project at the id entered
    const projectID = parseInt(req.body.id)
    // request a new title or description
    const newTitle = req.body.title
    const newDescription = req.body.description
    const newURL = req.body.url

    // get the project index
    const projectIndex = projects.findIndex(project => project.id === projectID);

    // if the project at the id exists
    if (projectIndex !== -1) {
        
        // update the title
        if (newTitle) {
            projects[projectIndex].title = newTitle
        }
        // update the description
        if (newDescription) {
            projects[projectIndex].description = newDescription
        }
        // update the URL
        if (newURL) {
            projects[projectIndex].URL = newURL
        }

        // update the json file
        fs.writeFileSync('web_projects.json', JSON.stringify(projects))
        resp.json({ message: "Project updated" })
        
    } else {
        resp.json({ message: "Project not found" })
    }
})


// delete a project from the json file at the given ID
app.delete('/api/', (req, resp) => {
    const projectID = parseInt(req.body.projectID)

    deleteProject(projectID)
    resp.json({ message: 'Deleted Project' })
})


app.listen(port, () => console.log(`Listening engaged at port ${port}`))


// [{"id":1,"title":"ReactGame!","description":"Hangman game created using Create React app.","URL":"https://hang-man-webpage-d5d22e293ec2.herokuapp.com/"},{"id":2,"title":"To Do App","description":"To Do App created with HTML, CSS and JavaScript.","URL":"https://github.com/LucMayne/to-do-react"},{"id":3,"title":"TestTitle","description":"oh yaaa","URL":"yes.com"},{"id":4,"title":"TestTitle","description":"oh yaaa","URL":"yes.com"}]
