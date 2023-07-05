import React from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import './CreateProject.css'

class CreateProject extends React.Component {
    constructor(props) {
        super(props);
        // store the form data in the state
        this.state = {
            formData: {
                title: "",
                description: "",
                url: ""
            }
        };

        // bind the methods to this.
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleUserInput(event) {
        // used this for adding form data to the state: https://stackoverflow.com/questions/70884553/react-saving-inputs-to-state
        this.setState({
            formData: {...this.state.formData, [event.target.name]: event.target.value}
        });
    }

    handleSubmit(event) {
        event.preventDefault();
      
        // check if all the fields have a value
        const hasEmptyValues = Object.values(this.state.formData).some(
          (value) => value === ""
        );
      
        if (hasEmptyValues) {
          alert("Please fill in all the input fields");
        } else {
          // Send the form data to the Express app
          fetch("/api/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.formData)
          })
            .then((response) => response.json())
            .then((data) => {

              // display an alert only if the project already exists
              if (data.message !== 'Project added successfully') {
                alert(data.message);
              }

              // update the screen
              this.props.fetchProjects();
              // Reset the state and input fields
              this.setState({
                formData: {
                  title: "",
                  description: "",
                  url: ""
                }
              });
            });
        }
    }      

  render() {
    // bootstrap form to add a project
    return (
      <div className="form-container">
          <Form onSubmit={this.handleSubmit}>
              <Container>
                <Form.Group>
                    <Form.Label style={{fontWeight: '650'}}>CREATE A NEW PROJECT</Form.Label>
                    <br/>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control style={{width: '350px'}} type="text" id="title" name="title" value={this.state.formData.title} onChange={this.handleUserInput} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description:</Form.Label>
                    <Form.Control style={{width: '350px'}} type="text" id="description" name="description" value={this.state.formData.description} onChange={this.handleUserInput} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>URL:</Form.Label>
                    <Form.Control style={{width: '350px'}} type="text" id="url" name="url" value={this.state.formData.url} onChange={this.handleUserInput} />
                </Form.Group>
                <br/>
                <button type="submit" class="btn btn-primary">Add Project</button>
              </Container>
          </Form>   
      </div>
    );
  }
}

export default CreateProject;