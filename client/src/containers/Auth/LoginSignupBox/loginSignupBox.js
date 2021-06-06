import React from 'react';
import styles from './loginSignupBox.module.scss';
import { Container } from 'react-bootstrap';
import classnames from 'classnames';
import checkCookie from '../../../utils/checkCookieDisabled';
import updateObj from './../../../utils/updateObj';
import { checkValidity } from '../../../utils/validation';

function loginSignupBox({ data, inputs, title }) {
  const inputChangeHandler = (evt, field) => {
    evt.preventDefault();
    const stateControl = data.state.controls;

    const passConfirmCheckWhenFieldIsPassword =
      field === 'password' && title === 'Signup'
        ? {
            passwordConfirm: updateObj(stateControl.passwordConfirm, {
              valid: checkValidity(
                evt.target.value,
                stateControl.passwordConfirm.validation,
                stateControl.password.value
              ),
              touched: true,
            }),
          }
        : {};

    const updatedControls = updateObj(stateControl, {
      [field]: updateObj(stateControl[field], {
        value: evt.target.value,
        valid:
          title === 'Login' && stateControl[field].valueType !== 'email'
            ? true
            : checkValidity(
                evt.target.value,
                stateControl[field].validation,
                title === 'Signup' &&
                  stateControl[field].validation.passwordConfirm === true
                  ? stateControl.password.value
                  : undefined
              ),
        touched: true,
      }),

      ...passConfirmCheckWhenFieldIsPassword,
    });
    const fields = [];
    for (let field in updatedControls) {
      fields.push(updatedControls[field].valid);
    }

    if (!fields.includes(false)) {
      data.setState({ formIsValid: true });
    } else {
      data.setState({ formIsValid: false });
    }
    data.setState({
      controls: updatedControls,
    });
  };
  const focus = (evt) => {
    evt.preventDefault();
    data.setState({ spanStyle: { opacity: 0 } });
  };
  const blur = (evt) => {
    evt.preventDefault();
    data.setState({ spanStyle: { opacity: 1 } });
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();
    await data.authenticate();

    if (!data.props.error && data.props.isAuthenticated) {
      data.setState({
        submitButtonStyle: {
          background: '#2ecc71',
          borderColor: '#2ecc71',
        },
        feedbackStyle: {
          transition: 'all .4s',
          display: 'block',
          opacity: 1,
          bottom: '-80px',
        },
        inputStyle: { borderColor: '#2ecc71' },
      });
      setTimeout(() => {
        data.props.history.push('/posts');
      }, 1000);
    } else {
      data.setState({
        feedbackStyle: {
          transition: 'all .4s',
          display: 'block',
          opacity: 1,
          bottom: '-80px',
          backgroundColor: 'red',
        },
        inputStyle: { borderColor: 'red' },
      });
    }
  };

  let cookieEnabled = checkCookie();
  return (
    <Container className="d-flex flex-column justify-content-between ml-lg-4 pt-5 mt-5">
      <iframe
        src="https://mindmup.github.io/3rdpartycookiecheck/start.html"
        style={{ display: 'none' }}
        title="cookie_check"
      />
      <form className={styles.login} onSubmit={submitHandler}>
        <fieldset>
          <legend className={styles.legend}>{title}</legend>
          {inputs.map((inp, ind) => (
            <div key={ind} className={styles.input}>
              <input
                style={{
                  ...data.state.inputStyle,
                  borderColor:
                    (inp.touched && !inp.valid) || data.props.error
                      ? 'red'
                      : '#ededed',
                }}
                onFocus={focus}
                onBlur={blur}
                value={inp.value}
                onChange={(evt) => inputChangeHandler(evt, inp.valueType)}
                type={inp.elementConfig.type}
                placeholder={inp.elementConfig.placeholder}
                required
              />
              {inp.touched && !inp.valid ? (
                <small className="text-danger">
                  {inp.validation.validationMsg}
                </small>
              ) : (
                ''
              )}
              <span style={data.state.spanStyle}>
                <i className="far fa-envelope"></i>
              </span>
            </div>
          ))}
          {!cookieEnabled ? (
            <p className="text-warning text-center">
              Cookies are blocked in your browser , authentication may fail for
              that , for best experience , enable cookie in your browser
            </p>
          ) : (
            ''
          )}
          <button
            type="submit"
            disabled={!data.state.formIsValid}
            style={data.state.submitButtonStyle}
            className={styles.submit}
          >
            <i
              className={classnames({
                'fas fa-long-arrow-alt-right': !data.props.isAuthenticated,
                'fas fa-check': data.props.isAuthenticated,
              })}
            ></i>
          </button>
        </fieldset>

        <div className={styles.feedback} style={data.state.feedbackStyle}>
          {data.props.error ? data.props.error.message : 'login successful'}{' '}
          <br />
          {!data.props.error ? 'redirecting...' : null}
        </div>
      </form>
    </Container>
  );
}

export default loginSignupBox;
