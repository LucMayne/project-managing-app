Web Projects API:
This is an Express.js API for managing web projects. It uses a JSON file to store project data.

Start Server:
1. Install Node.js
2. Navigate to this projects folder in the command prompt or terminal and type 'npm install'
3. Type 'npm start' to run the server
4. The server will run on port 8080 by default

Usage:
Enter 
The API has the following endpoints-
GET /api/: 
returns an array of projects.
POST /api/?id={id}&title={title}&description={description}&url={url}: 
Adds a new project with the specified ID, title, description, and URL. 
Returns an error if a project with the specified ID already exists.
PUT /api/?id={id}&newTitle={newTitle}&newDescription={newDescription}: 
Updates the title and/or description of the project with the specified ID. 
Returns an error if the project does not exist.
DELETE /api/?id={id}: 
Deletes the project with the specified ID. Returns an error if the project does not exist.

Data Storage:
The API stores project data in a file named web_projects.json. If the file does not exist, 
it will be created automatically when the server starts.

Each project object has the following properties:

id: A unique integer to identify the project.
title: The title of the project.
description: A description of the project.
URL: The URL of the project.

Using Postman:
1. Open Postman and create a new request.
2. Set the request method to GET, POST, PUT, or DELETE, depending on which endpoint you want to use.
3. Enter the request URL as http://localhost:8080/api/, followed by any other parameters required by the endpoint.
4. Click on Send to send the request to the server.

