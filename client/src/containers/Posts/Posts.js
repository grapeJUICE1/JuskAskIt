import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Button, FormControl } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import SortButtons from '../../components/SortButtons/SortButtons';
import Post from '../../components/Post/Post';
import { connect } from 'react-redux';
import queryString from 'query-string';

import * as actions from '../../store/actions/index';
import Loader from '../../components/UI/Loader/Loader';
import checkAuth from '../../hoc/checkAuth';
import classNames from 'classnames';

class Posts extends Component {
  PER_PAGE = this.props.isProfile ? 5 : 10;
  queryTag = queryString.parse(this.props.location?.search)?.tag;

  state = {
    currentPage: 1,
    total: 0,
    sortBy: '-createdAt',
    filter: { tags: this.queryTag },
    show: false,
    showInfo: this.queryTag ? true : false,
    searchBy: '',
  };
  componentDidMount() {
    this.props.onResetEditSuccess();
    this.props.onFetchPosts(
      this.state.sortBy,
      this.state.filter,
      this.state.currentPage,
      this.PER_PAGE,
      this.props.userId,
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
      prevState.searchBy !== this.state.searchBy ||
      prevState.currentPage !== this.state.currentPage
    ) {
      this.props.onFetchPosts(
        this.state.sortBy,
        this.state.filter,
        this.state.currentPage,
        this.PER_PAGE,
        this.props.userId,
        this.state.searchBy
      );
    }
  }

  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  setDefaultCurrentPage = () => {
    this.setState({ currentPage: 0 });
  };
  handlePageClick = ({ selected }) => {
    this.setState({ currentPage: selected + 1 });
  };
  removeFilter = (e) => {
    this.setState({ filter: {}, showInfo: false });
  };
  sortByViews = (e) => {
    this.setState({ sortBy: '-views', showInfo: false });
    this.setDefaultCurrentPage();
  };
  sortByVotes = (e) => {
    this.setState({ sortBy: '-voteCount', showInfo: false });
    this.setDefaultCurrentPage();
  };
  sortNewest = (e) => {
    this.setState({ sortBy: '-createdAt', showInfo: false });
    this.setDefaultCurrentPage();
  };
  sortOldest = (e) => {
    this.setState({ sortBy: 'createdAt', showInfo: false });
    // this.setDefaultCurrentPage();
  };
  filterUnanswered = (e) => {
    this.setDefaultCurrentPage();
    this.setState({
      filter: { answerCount: 0 },
      showInfo: true,
      sortBy: '-createdAt',
    });
  };
  filterByTag = (tag) => {
    this.setState({
      filter: { tags: tag },
      showInfo: true,
      sortBy: '-createdAt',
    });
  };

  render() {
    const pageCount = Math.ceil(this.props.totalPosts / this.PER_PAGE);
    let posts;
    let title;
    let sortButtons = (
      <>
        <SortButtons
          isProfile={this.props.isProfile}
          removeFilter={this.removeFilter}
          sortNewest={this.sortNewest}
          sortOldest={this.sortOldest}
          filterTag={this.state.filter?.tags}
          sortByViews={this.sortByViews}
          sortByVotes={this.sortByVotes}
          filterUnanswered={this.filterUnanswered}
          showInfo={this.state.showInfo}
        />
      </>
    );
    if (this.state.filter.tags) {
      title = (
        <h2 className="mt-4">
          Questions tagged with: [{this.state.filter.tags}]
        </h2>
      );
    } else if (this.state.filter.answerCount === 0) {
      title = <h2 className="mt-4">Unanswered Questions</h2>;
    } else if (this.props.isProfile) {
      title = <h4 className="mt-4">Questions asked by the user</h4>;
    } else {
      title = <h2 className="mt-4">All Questions</h2>;
    }
    if (this.props.error) {
      posts = <h1 className="text-center py-5">{this.props.error.message}</h1>;
    } else if (this.props.loading) {
      posts = <Loader />;
    } else if (this.props.isProfile && this.props.posts.length === 0) {
      posts = <h4 className="mt-4">No questions asked yet</h4>;
    } else {
      posts = (
        <Fragment>
          <Row
            className={classNames({
              'ratio ': true,
              profilePostsMarginRight: this.props.isProfile,
            })}
          >
            <Col lg={9} className=" mt-4  ml-0 ">
              {this.props.posts.map((post) => {
                return (
                  <Post
                    key={post.id}
                    post={post}
                    onFilterTag={(tag) => this.filterByTag(tag)}
                  />
                );
              })}
            </Col>
          </Row>
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
        </Fragment>
      );
    }

    return (
      <Container
        className={classNames({
          'd-flex flex-column  ': true,
          'ml-lg-4 pt-5 mt-5 ': !this.props.isProfile,
          paddingLeftImportant: this.props.isProfile,
        })}
      >
        {!this.props.error && (
          <Row>
            <Col lg={5}>
              {title}
              <h6 className="mt-4">{this.props.totalPosts} questions</h6>

              {!this.props.isProfile && (
                <FormControl
                  size="lg"
                  className="mt-3 mb-3"
                  style={{ width: '60%' }}
                  placeholder="search a post"
                  value={this.state.searchBy}
                  onChange={(e) =>
                    this.setState({ searchBy: e.target.value, filter: {} })
                  }
                />
              )}
            </Col>
            {sortButtons}
          </Row>
        )}
        {posts}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    total: state.posts.total,
    totalPosts: state.posts.totalPosts,
    posts: state.posts.posts,
    error: state.posts.error,
    loading: state.posts.loading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchPosts: (
      sortBy,
      filter,
      currentPage,
      perPagePosts,
      userId,
      searchBy
    ) =>
      dispatch(
        actions.fetchPosts(
          sortBy,
          filter,
          currentPage,
          perPagePosts,
          userId,
          searchBy
        )
      ),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkAuth(Posts));
