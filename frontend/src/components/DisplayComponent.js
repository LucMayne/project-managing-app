import React from 'react';
import CreateProject from './CreateProject';
import UpdateProject from './UpdateProject'
import './DisplayComponent.css';

class DisplayComponent extends React.Component {
  constructor(props) {
    super(props);
    // store array of projects, get the current projectID when the user clicks edit
    this.state = {
      error: null,
      isLoaded: false,
      projects: [],
      showModal: false,
      currentProjectID: null
    };

    // bind the methods to this.
    this.fetchProjects = this.fetchProjects.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
  }

  // call fetch projects to load them into the state and display them
  componentDidMount() {
    this.fetchProjects();
  }

  // create a method to fetch the projects from the api
  fetchProjects() {
    fetch('/api/')
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            // set projects to the result from the api
            projects: result,
          });
        },
        // catch an error
        error => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  handleDelete(projectID) {
    // Send a request to the Express.js server to delete the item
    fetch ('/api/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      // send the projectID through the body
      body: JSON.stringify({projectID})
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // update the screen with new data
        this.fetchProjects();
      })
      .catch(error => {
        console.error(error);
      })
  }

  // displays the modal and takes the current projectID
  handleShowModal(projectID) {
    this.setState(
      { showModal: true, currentProjectID: projectID },
      // use a callback function to make sure the project id is updated before editing starts
      () => {
        console.log(this.state.currentProjectID);
      }
    );
  }
  
  // hide the modal
  handleHideModal() {
    this.setState({ showModal: false, selectedProjectId: null });
  }

  render() {
    const { error, isLoaded, projects } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      // map over projects and display each one with 2 buttons to edit or delete
      return (
        <>
          <h2>PROJECTS</h2>
          <br/>
          <div className="project-item-container">
            {projects.map((project) => (
              <div className="project-item" key={project.id}>
                  <h3>{project.title}</h3>
                  <p>Description: {project.description}</p>
                  <a href={project.URL} target='_blank'>Link to Project</a>
                  <div className='button-container'>
                    <button className='edit-button' onClick={() => this.handleShowModal(project.id)}>Edit</button>
                    <button className='delete-button' onClick={() => this.handleDelete(project.id)}>Delete</button>
                  </div>
              </div>
             ))
            }
          </div>
          {/* call UpdateProject if showModal is true */}
          {this.state.showModal && (
            <UpdateProject
              projectID={this.state.currentProjectID}
              fetchProjects={this.fetchProjects}
              handleHideModal={this.handleHideModal}
            />
          )}
          <CreateProject fetchProjects={this.fetchProjects} />
        </>
      );
    }
  }
}

export default DisplayComponent;
