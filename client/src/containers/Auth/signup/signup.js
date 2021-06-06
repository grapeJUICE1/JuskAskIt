import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import loginSignupBox from '../LoginSignupBox/loginSignupBox';

import * as actions from '../../../store/actions/index';

class Signup extends Component {
  state = {
    spanStyle: {},
    submitButtonStyle: {},
    feedbackStyle: {},
    inputStyle: {},
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email address',
        },
        valueType: 'email',
        value: '',
        validation: {
          required: true,
          isEmail: true,
          validationMsg: 'Please enter a valid email',
        },
        valid: false,
        touched: false,
      },
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        valueType: 'name',
        value: '',
        validation: {
          required: true,
          minLenght: 3,
          maxLenght: 25,
          validationMsg:
            'Your name should be greater than 3 words and less than 25',
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password',
        },
        valueType: 'password',
        value: '',
        validation: {
          required: true,
          minLenght: 6,
          validationMsg: 'Your password should be atleast 6 words',
        },
        valid: true,
        touched: false,
      },
      passwordConfirm: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Enter your Password again',
        },
        valueType: 'passwordConfirm',
        value: '',
        validation: {
          required: true,
          passwordConfirm: true,
          validationMsg: 'Passwords dont match',
        },
        valid: true,
        touched: false,
      },
    },
    formIsValid: false,
  };

  authenticate = async () => {
    console.log();
    await this.props.onSignup({
      name: this.state.controls.name.value,
      email: this.state.controls.email.value,
      password: this.state.controls.password.value,
      passwordConfirm: this.state.controls.passwordConfirm.value,
    });
  };

  render() {
    let data = this;
    return loginSignupBox({
      data,
      inputs: [
        this.state.controls.name,
        this.state.controls.email,
        this.state.controls.password,
        this.state.controls.passwordConfirm,
      ],
      title: 'Signup',
    });
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignup: (data) => dispatch(actions.signup(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signup));
