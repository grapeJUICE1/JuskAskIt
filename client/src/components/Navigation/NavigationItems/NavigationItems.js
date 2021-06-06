import React, { useState, useEffect } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { withRouter, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { useAlert } from 'react-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'cloudinary-react';
import socketIOClient from 'socket.io-client';
import * as actions from '../../../store/actions/index';
import { timeSince } from '../../../utils/formatDate';
import styles from './navigationItems.module.scss';

const socket = socketIOClient('http://localhost:7000', {
  withCredentials: true,
});
function NavigationItems(props) {
  const alert = useAlert();
  const [redirect, setRedirect] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeClass, setActiveClass] = useState('');

  const checkUnreadNtfc = (notifications) => {
    let ntfcs = [...notifications];
    const count = ntfcs.reduce(
      (sum, ntfc) => sum + (ntfc.read === false ? 1 : 0),
      0
    );
    return count;
  };

  useEffect(() => {
    if (props.user) {
      socket.emit('join', props.user._id);
      socket.emit('initial_data', props.user._id);
      socket.on('get_data', (feed) => {
        setNotifications(feed);
      });
      socket.on('change_data', () =>
        socket.emit('initial_data', props.user._id)
      );
      return () => {
        socket.disconnect();
      };
    }
  }, [props.user]);

  return (
    <>
      {redirect ? <Redirect to={redirect} /> : ''}
      <Nav className="ml-auto  flex-nowrap">
        {props.user ? (
          <>
            {' '}
            <div className={styles.notification_wrap}>
              <FontAwesomeIcon
                icon={faBell}
                className={styles.bell_icon}
                onClick={() => {
                  if (activeClass === '')
                    socket.emit('check_all_notifications', props.user._id);
                  setActiveClass(activeClass === '' ? 'active' : '');
                }}
              />
              {checkUnreadNtfc(notifications) !== 0 ? (
                <span className={styles.unread_dot}>
                  {checkUnreadNtfc(notifications)}
                </span>
              ) : (
                ''
              )}
              <div className={`${styles.dropdown} ${styles[activeClass]}`}>
                {notifications.length !== 0 ? (
                  notifications.map((ntfc, ind) => {
                    return (
                      <div
                        className={styles.notify_item}
                        key={ind}
                        // onClick={() => props.history.push(ntfc.redirectTo)}
                      >
                        <div className={styles.notify_img}>
                          <Image
                            cloudName="grapecluster"
                            publicId={ntfc.notificationImage}
                            width="50"
                            // height="150"
                            className="rounded-circle"
                            crop="scale"
                          />
                        </div>
                        <div className={styles.notify_info}>
                          <p>
                            <span
                              className={styles.notify_item_link}
                              onClick={() => {
                                props.history.push(
                                  ntfc.userLink
                                    ? ntfc.userLink
                                    : ntfc.redirectTo
                                );
                                setActiveClass('');
                              }}
                            >
                              {ntfc.userNameInTitle
                                ? ntfc.userNameInTitle
                                : ntfc.postNameInTitle}
                            </span>{' '}
                            <span
                              onClick={() => {
                                props.history.push(ntfc.redirectTo);
                                setActiveClass('');
                              }}
                            >
                              {ntfc.title}
                            </span>{' '}
                            {ntfc.userNameInTitle ? (
                              <span
                                className={styles.notify_item_link}
                                onClick={() => {
                                  props.history.push(ntfc.redirectTo);
                                  setActiveClass('');
                                }}
                              >
                                {ntfc.postNameInTitle}
                              </span>
                            ) : (
                              ''
                            )}
                          </p>
                          <span className={styles.notify_time}>
                            {timeSince(ntfc.createdAt)} ago
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <NavDropdown.Item href="#action/3.1">
                    No Notification for now
                  </NavDropdown.Item>
                )}
              </div>
            </div>
            <Nav.Link
              onClick={(e) => props.history.push(`/profile/${props.user._id}`)}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                props.onLogout();
                alert.info('logging out');
                setTimeout(() => {
                  setRedirect('/login');
                }, 1000);
              }}
            >
              Logout
            </Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link onClick={(e) => props.history.push('/login')}>
              Login
            </Nav.Link>
            <Nav.Link onClick={(e) => props.history.push('/signup')}>
              Signup
            </Nav.Link>
          </>
        )}
      </Nav>
    </>
  );
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavigationItems));
