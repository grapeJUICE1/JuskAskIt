import React, { useEffect, useState } from 'react';
import axios from '../axios-main';
import { useAlert } from 'react-alert';
import { connect } from 'react-redux';

import * as actions from '../store/actions/index';
import { setLocale } from 'faker';

const checkAuth = (Wrapped) => {
  function CheckAuth(props) {
    const alert = useAlert();
    const [polling, setPolling] = useState('lol');
    useEffect(() => {
      let i = 0;
      const resInt = axios.interceptors.response.use(
        (response) => {
          // Do something with response data
          return response;
        },
        async (error) => {
          switch (error.response.status) {
            case 401:
              i++;
              console.log(i + 1);
              alert.error(error.response.data.message);
              if (props.user) {
                await props.onLogout();
              }
              break;
            case 500:
              alert.error('OOps .... Error occured ... try again later');
              break;
            default:
              if (error.response.data.message)
                alert.error(error.response.data.message);
              else alert.error('OOps .... Error occured ... try again later');
          }
          return Promise.reject(error);
        }
      );

      return function cleanup() {
        axios.interceptors.response.eject(resInt);
      };
    }, [Wrapped]);

    return <Wrapped {...props} />;
  }
  const mapStateToProps = (state) => {
    return {
      user: state.auth.user,
    };
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      onLogout: () => dispatch(actions.logout()),
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(CheckAuth);
};

export default checkAuth;
