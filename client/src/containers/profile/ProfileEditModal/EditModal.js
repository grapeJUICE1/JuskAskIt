import React, { Component } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Loader from '../../../components/UI/Loader/Loader';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { withAlert } from 'react-alert';

class EditModal extends Component {
  state = {
    show: false,
    editableFields: {
      name: this.props.user.name,
      email: this.props.user.email,
      bio: this.props.user.bio,
      location: this.props.user.location,
      workStatus: this.props.user.workStatus,
      links: this.props.user.links,
    },
  };

  handleShow = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  onSubmit = async () => {
    let name =
      this.state.editableFields.name === this.props.user.name
        ? ''
        : this.state.editableFields.name;
    let email =
      this.state.editableFields.email === this.props.user.email
        ? ''
        : this.state.editableFields.email;
    await this.props.onEditData({ ...this.state.editableFields, name, email });
    if (!this.props.editErr) {
      this.handleClose();
      this.showSuccessAlert();
    }
  };
  showSuccessAlert = () => {
    if (this.props.editSuccessful) {
      this.props.alert.success('Profile Edited Sucessfully');
    }
  };
  render() {
    return (
      <>
        <Button variant="dark" onClick={this.handleShow}>
          Edit Profile
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header
            style={{
              margin: '0 auto',
            }}
          >
            <Modal.Title>
              <strong>Edit Profile</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.modalLoading ? (
              <Loader />
            ) : (
              <Form>
                <Modal.Title>User Data</Modal.Title>
                {this.props.editErr ? (
                  <h4 className="text-danger">{this.props.editErr}</h4>
                ) : (
                  ''
                )}
                <hr />
                {Object.keys(this.state.editableFields).map((val, id) => {
                  const editableFields = this.state.editableFields;
                  if (val !== 'links') {
                    return (
                      <Form.Group controlId={val} key={id}>
                        <Form.Label>{val}</Form.Label>
                        <Form.Control
                          type="text"
                          as={val === 'bio' ? 'textarea' : 'input'}
                          placeholder={`Enter ${val}`}
                          value={editableFields[val]}
                          onChange={(e) =>
                            this.setState({
                              editableFields: {
                                ...editableFields,
                                [val]: e.target.value,
                              },
                            })
                          }
                        />
                      </Form.Group>
                    );
                  } else {
                    return (
                      <Form.Group>
                        <Modal.Title>Links</Modal.Title>
                        {this.props.editErr ? (
                          <h4 className="text-danger">{this.props.editErr}</h4>
                        ) : (
                          ''
                        )}
                        <hr />

                        {editableFields.links
                          ? Object.keys(editableFields.links).map((val, id) => {
                              return (
                                <Form.Row key={id}>
                                  <Form.Label column="sm" lg={2}>
                                    {val}
                                  </Form.Label>
                                  <Col>
                                    <Form.Control
                                      size="sm"
                                      type="url"
                                      list={`${val}URL`}
                                      value={editableFields.links[val]}
                                      onChange={(e) =>
                                        this.setState({
                                          editableFields: {
                                            ...editableFields,
                                            links: {
                                              ...editableFields.links,
                                              [val]: e.target.value,
                                            },
                                          },
                                        })
                                      }
                                      placeholder={`enter your ${val} link`}
                                    />
                                    <datalist id={`${val}URL`}>
                                      <option
                                        value={`https://www.${val}.com/`}
                                        label={val}
                                      />
                                    </datalist>
                                  </Col>
                                </Form.Row>
                              );
                            })
                          : ''}
                      </Form.Group>
                    );
                  }
                })}

                <Button variant="primary" onClick={this.onSubmit}>
                  Submit
                </Button>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    profile: state.profile.profile,
    modalLoading: state.profile.modalLoading,
    editSuccessful: state.profile.editSuccessful,
    editErr: state.profile.editErr,
    error: state.profile.error,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onEditData: (data) => dispatch(actions.editUserData(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(EditModal));
