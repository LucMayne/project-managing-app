import React from 'react';
import { Modal, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateProject.css';

class UpdateProject extends React.Component {
  constructor(props) {
    super(props);
    // show is for the modal, the project id is passed in as a prop
    this.state = {
      show: true,
      formData: {
        id: this.props.projectID,
        title: '',
        description: '',
        url: ''
      }
    };

    // bind the methods to this.
    this.hideModal = this.hideModal.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // hide the modal
  hideModal() {
    this.props.handleHideModal();
  }

  // update the formData
  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({
      formData: {...prevState.formData, [name]: value}
    }));
  }

  // when the user clicks the update project button call handleSubmit
  handleSubmit(event) {
    event.preventDefault();
  
    // use filter to only add values that are not an empty string
    const filteredFormData = Object.fromEntries(
        Object.entries(this.state.formData).filter(([key, value]) => value !== "")
    );

    // Send the form data to the Express app
    fetch("/api/", {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(filteredFormData)
    })
      .then((response) => response.json())
      .then((data) => {
          
          // update the screen
          this.props.fetchProjects();

          // Reset the state and input fields
          this.setState({
          formData: {
              id: "",
              title: "",
              description: "",
              url: ""
          }
          });
      });
    
    this.props.handleHideModal();
  }      

  render() {
    // bootstrap Modal with a form to update a project
    return (
      <>
        <Modal show={this.state.show} onHide={this.hideModal}>
          <div className='modal-form-container'>
            <Form onSubmit={this.handleSubmit}>
              <Container>
                <Form.Group>
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
                <button type="submit" class="btn btn-primary">Update Project</button>
                <button type="button" class="btn btn-secondary" onClick={this.hideModal}>Cancel</button>
              </Container>
            </Form>
          </div>
        </Modal>
      </>
    );
  }
}

export default UpdateProject;
