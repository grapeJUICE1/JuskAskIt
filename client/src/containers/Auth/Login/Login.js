import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import loginSignupBox from '../LoginSignupBox/loginSignupBox';
import * as actions from '../../../store/actions/index';

class Login extends Component {
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
        },
        valid: true,
        touched: false,
      },
    },
    formIsValid: false,
  };
  authenticate = async () => {
    await this.props.onLogin({
      email: this.state.controls.email.value,
      password: this.state.controls.password.value,
    });
  };

  render() {
    let data = this;
    return loginSignupBox({
      data,
      inputs: [this.state.controls.email, this.state.controls.password],
      title: 'Login',
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
    onLogin: (data) => dispatch(actions.login(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
