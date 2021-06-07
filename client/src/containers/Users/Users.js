import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, FormControl } from 'react-bootstrap';
import * as actions from '../../store/actions/index';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import ReactPaginate from 'react-paginate';
import SortButtons from '../../components/SortButtons/SortButtons';
import checkAuth from '../../hoc/checkAuth';
import Loader from '../../components/UI/Loader/Loader';

class Users extends Component {
  PER_PAGE = 25;
  state = {
    currentPage: 1,
    total: 0,
    sortBy: '-joinedAt',
    filter: {},
    searchBy: '',
  };
  componentDidMount() {
    this.props.onFetchUsers(
      this.state.sortBy,
      this.state.filter,
      this.state.currentPage,
      this.PER_PAGE,
      this.state.searchBy
    );
  }
  componentDidUpdate(_, prevState) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (
      prevState.sortBy !== this.state.sortBy ||
      prevState.filter !== this.state.filter ||
      prevState.currentPage !== this.state.currentPage ||
      prevState.searchBy !== this.state.searchBy
    ) {
      this.props.onFetchUsers(
        this.state.sortBy,
        this.state.filter,
        this.state.currentPage,
        this.PER_PAGE,
        this.state.searchBy
      );
    }
  }
  setDefaultCurrentPage = () => {
    this.setState({ currentPage: 0 });
  };
  handlePageClick = ({ selected }) => {
    this.setState({ currentPage: selected + 1 });
  };

  sortNewest = (e) => {
    this.setState({ sortBy: '-joinedAt' });
    this.setDefaultCurrentPage();
  };
  sortOldest = (e) => {
    this.setState({ sortBy: 'joinedAt' });
    this.setDefaultCurrentPage();
  };

  render() {
    const pageCount = Math.ceil(this.props.totalUsers / this.PER_PAGE);

    return (
      <>
        <Container className="d-flex flex-column  ml-lg-4 pt-5 mt-5 ">
          <Row>
            <Col lg={5}>
              <h2 className="mt-4">All Users</h2>
              <h6 className="ml-auto mr-5 pr-5 mt-4">
                {this.props.totalUsers || 0} users
              </h6>
            </Col>
          </Row>
          <Row>
            <Col lg={5}>
              <FormControl
                size="sm"
                className="mt-3 mb-3"
                style={{ width: '40%' }}
                placeholder="search a user"
                value={this.state.searchBy}
                onChange={(e) =>
                  this.setState({ searchBy: e.target.value, filter: {} })
                }
              />
            </Col>

            <SortButtons
              isUser={true}
              sortNewest={this.sortNewest}
              sortOldest={this.sortOldest}
              // filterUnanswered={this.filterUnanswered}
            />
          </Row>

          <br />
          {!this.props.loading ? (
            <Row>
              {this.props.users ? (
                this.props.users.map((user, id) => {
                  return (
                    <Col xl={3} lg={4} xs={12} md={4} sm={6}>
                      &nbsp;
                      <Row className="no-gutters">
                        <Col className="p-0" lg={2}>
                          <Image
                            cloudName="grapecluster"
                            publicId={user.photo}
                            width="40"
                            height="40"
                            className="rounded-circle"
                            crop="scale"
                          />
                        </Col>
                        <Col className="p-0" lg={7}>
                          <Link to={`/profile/${user._id}`}>{user.name}</Link>
                          <br />
                          <small>{user.location}</small>
                          <br />
                          <small>{user.workStatus}</small>
                        </Col>
                      </Row>
                    </Col>
                  );
                })
              ) : (
                <h1>No Users</h1>
              )}
            </Row>
          ) : (
            <Loader />
          )}
          <ReactPaginate
            previousLabel={'prev'}
            nextLabel={'next'}
            pageCount={pageCount}
            initialPage={
              this.state.currentPage ? this.state.currentPage - 1 : 0
            }
            onPageChange={this.handlePageClick}
            containerClassName={`pagination pb-5 text-center ml-lg-4`}
            previousLinkClassName={`pagination__link`}
            nextLinkClassName={`pagination__link`}
            disabledClassName={`pagination__link__disabled`}
            activeClassName={`pagination__link__active`}
          />
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    total: state.users.total,
    totalUsers: state.users.totalUsers,
    users: state.users.users,
    error: state.users.error,
    loading: state.users.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUsers: (sortBy, filter, currentPage, perPageUsers, searchBy) =>
      dispatch(
        actions.fetchUsers(sortBy, filter, currentPage, perPageUsers, searchBy)
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkAuth(Users));
