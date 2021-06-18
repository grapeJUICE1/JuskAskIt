import React, { Component, Fragment } from 'react';
import { Container, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import UploadImage from './uploadImageModal/UploadImage';
import { Image } from 'cloudinary-react';

import Posts from '../Posts/Posts';
import { formatDate } from '../../utils/formatDate';

import './profile.css';
import EditModal from './ProfileEditModal/EditModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faInstagram,
  faFacebook,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../components/UI/Loader/Loader';

class profile extends Component {
  componentDidMount() {
    this.props.onFetchUserData(this.props.match.params.userID);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userID !== this.props.match.params.userID) {
      this.props.onFetchUserData(this.props.match.params.userID);
    }
  }
  state = {
    show: false,
  };
  userInfoToShow = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'workStatus', label: 'occupation' },
    { key: 'company', label: 'Company' },
    { key: 'joinedAt', label: 'Joined At' },
  ];
  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  iconToLink = {
    github: faGithub,
    website: faGlobe,
    facebook: faFacebook,
    twitter: faTwitter,
    instagram: faInstagram,
  };
  render() {
    let profile = (
      <div>
        <div className="container mt-5">
          <div className="row">
            <div className="profile-nav col-lg-3 col-md-4">
              <div className="panel">
                <div className="user-heading round">
                  <a href="#">
                    <Image
                      cloudName="grapecluster"
                      publicId={this.props.profile.photo}
                      width="112"
                      height="112"
                      className="rounded-circle"
                      crop="scale"
                    />
                  </a>
                  <h1>{this.props.profile.name}</h1>
                  <p className="role">{this.props.profile.role}</p>
                </div>
                <ul className="nav nav-pills nav-stacked">
                  <li className="active">
                    <a href="#" className="profile-nav-link">
                      <i className="fa fa-user" /> Profile
                    </a>
                  </li>
                  <li>
                    <a href="#" className="profile-nav-link">
                      <i className="fa fa-calendar" /> Recent Activity{' '}
                    </a>
                  </li>
                  {this.props.profile &&
                  this.props.user?._id === this.props.profile?._id ? (
                    <li>
                      <a href="#" className="profile-nav-link">
                        <i className="fa fa-edit" />
                        <EditModal profile={this.props.profile} />
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
            <div className="profile-info col-lg-9 col-md-8">
              <div className="panel">
                <div className="bio-graph-heading">
                  {this.props.profile.bio}
                </div>
                <div className="panel-body bio-graph-info">
                  <h1>User Info</h1>
                  <div className="row">
                    {this.props.profile
                      ? this.userInfoToShow.map((obj, id) => {
                          return (
                            <div className="bio-row" key={id}>
                              <p>
                                <span>
                                  <strong>{obj.label}</strong>
                                </span>
                                : {'  ' + this.props.profile[obj.key]}
                              </p>
                            </div>
                          );
                        })
                      : ''}
                    <Container>
                      {this.props.profile
                        ? Object.keys(this.props.profile.links).map(
                            (val, id) => {
                              if (this.props.profile.links[val]) {
                                return (
                                  <Fragment key={id}>
                                    <a href={this.props.profile.links[val]}>
                                      <FontAwesomeIcon
                                        icon={this.iconToLink[val]}
                                        style={{
                                          fontSize: '1.3rem',
                                          margin: '0 5px',
                                        }}
                                      />
                                    </a>
                                    &nbsp;
                                  </Fragment>
                                );
                              } else {
                                return null;
                              }
                            }
                          )
                        : 'kkkkkkkkkkkkk'}
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    if (!this.props.error) {
      return profile;
    } else {
      return <h1 className="mt-5 pt-5 text-center">{this.props.error}</h1>;
    }
  }
}
const mapStateToProps = (state) => {
  return {
    profile: state.profile.profile,
    error: state.profile.error,
    loading: state.profile.loading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUserData: (id) => dispatch(actions.getUserData(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(profile);

// let profile = (
//   <Container>
//     {!this.props.loading ? (
//       <div className="main-body">
//         <div className="row gutters-sm">
//           <div className="col-md-4 mb-3">
//             <div className="card">
//               <div className="card-body">
//                 <div className="d-flex flex-column align-items-center text-center">
//                   <Image
//                     cloudName="grapecluster"
//                     publicId={this.props.profile.photo}
//                     width="150"
//                     height="150"
//                     className="rounded-circle"
//                     crop="scale"
//                   />
//                   {this.props.user ? (
//                     this.props.user._id === this.props.profile._id ? (
//                       <UploadImage />
//                     ) : (
//                       ''
//                     )
//                   ) : (
//                     ''
//                   )}

//                   <div className="mt-3">
//                     <h4>{this.props.profile.name}</h4>
//                     <p className="text-secondary mb-1">
//                       {this.props.profile.workStatus}
//                     </p>
//                     <p className="text-secondary mb-1">
//                       {this.props.profile.location}
//                     </p>

//                     <p className="text-secondary mb-1">
//                       Joined at {formatDate(this.props.profile.joinedAt)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <br />
//             <div className="text-center">
//               {this.props.profile.links &&
//                 Object.keys(this.props.profile.links).map((val, id) => {
//                   if (this.props.profile.links[val]) {
//                     return (
//                       <Fragment key={id}>
//                         <Button
//                           as="a"
//                           variant="secondary"
//                           href={this.props.profile.links[val]}
//                         >
//                           <FontAwesomeIcon icon={this.iconToLink[val]} />
//                         </Button>
//                         &nbsp;
//                       </Fragment>
//                     );
//                   }
//                   return '';
//                 })}
//               &nbsp;
//             </div>
//           </div>
//           <div className="col-md-8 ml-0 ">
//             <div className="card mb-3">
//               <div className="card-body">
//                 {['name', 'bio', 'location', 'workStatus'].map(
//                   (val, id) => {
//                     return (
//                       <Fragment key={id}>
//                         {id !== 0 && <hr />}

//                         <div className="row">
//                           <div className="col-sm-3">
//                             <h6 className="mb-0">{val}</h6>
//                           </div>
//                           <div className="col-sm-9 text-secondary">
//                             {this.props.profile[val]}
//                           </div>
//                         </div>
//                       </Fragment>
//                     );
//                   }
//                 )}
//               </div>

//               {this.props.user ? (
//                 this.props.user._id === this.props.profile._id ? (
//                   <EditModal />
//                 ) : (
//                   ''
//                 )
//               ) : (
//                 ''
//               )}
//             </div>
//             {this.props.profile._id &&
//               this.props.match.params.userID === this.props.profile._id && (
//                 <Posts isProfile={true} userId={this.props.profile._id} />
//               )}
//           </div>
//         </div>
//       </div>
//     ) : (
//       <Loader />
//     )}
//   </Container>
// );
