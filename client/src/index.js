import React from 'react';
import ReactDOM from 'react-dom';
import './custom-bootstrap.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import postsReducer from './store/reducers/posts';
import fullPostReducer from './store/reducers/fullPost';
import answersReducer from './store/reducers/answers';
import authReducer from './store/reducers/auth';
import profileReducer from './store/reducers/profile';
import usersReducer from './store/reducers/users';
import tagsReducer from './store/reducers/tags';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:7000/api/v1/';
axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
  posts: postsReducer,
  fullPost: fullPostReducer,
  answers: answersReducer,
  profile: profileReducer,
  auth: authReducer,
  users: usersReducer,
  tags: tagsReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
