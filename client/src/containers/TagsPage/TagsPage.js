import React, { Component } from 'react';
import { Container, Row, Col, FormControl, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import SortButtons from '../../components/SortButtons/SortButtons';
import * as actions from '../../store/actions/index';
import checkAuth from '../../hoc/checkAuth';
import Loader from '../../components/UI/Loader/Loader';

class TagsPage extends Component {
  PER_PAGE = 24;
  state = {
    currentPage: 0,
    total: 0,
    sortBy: '-createdAt',
    filter: {},
    searchBy: '',
  };
  componentDidMount() {
    this.props.onFetchTags(
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
      this.props.onFetchTags(
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
    this.setState({ sortBy: '-createdAt' });
    this.setDefaultCurrentPage();
  };
  sortOldest = (e) => {
    this.setState({ sortBy: 'createdAt' });
    this.setDefaultCurrentPage();
  };
  sortByPopularity = (e) => {
    this.setState({ sortBy: '-postCount' });
    this.setDefaultCurrentPage();
  };
  render() {
    const pageCount = Math.ceil(this.props.totalTags / this.PER_PAGE);
    return (
      <Container className="d-flex flex-column ml-lg-4 pt-5 mt-5 ">
        <Row>
          <Col lg={5}>
            <h2 className="mt-4">All Tags</h2>
            <h6 className="ml-auto mr-5 pr-5 mt-4">
              {this.props.totalTags} tags
            </h6>
          </Col>
        </Row>
        <Row>
          <Col lg={5}>
            <FormControl
              size="sm"
              className="mt-3 mb-3"
              style={{ width: '40%' }}
              placeholder="search a tag"
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
            sortByPopularity={this.sortByPopularity}
          />
        </Row>
        <br />
        {!this.props.loading ? (
          <Row>
            {this.props.tags ? (
              this.props.tags.map((tag, id) => {
                return (
                  <Col xl={3} lg={4} xs={12} md={4} sm={6}>
                    &nbsp;
                    <Row className="no-gutters">
                      <Col className="p-0" lg={7}>
                        <Card
                          border="primary"
                          style={{ maxWidth: '15rem' }}
                          bg="secondary"
                          text="light"
                        >
                          <Card.Header>
                            <Link
                              style={{ color: 'white' }}
                              to={`/posts?tag=${encodeURIComponent(tag.name)}`}
                            >
                              {tag.name}
                            </Link>
                          </Card.Header>
                          <Card.Body>
                            <Card.Subtitle>
                              {tag.postCount} questions
                            </Card.Subtitle>
                          </Card.Body>
                        </Card>
                        <small></small>
                      </Col>
                    </Row>
                  </Col>
                );
              })
            ) : (
              <h1>No Tags</h1>
            )}
          </Row>
        ) : (
          <Loader />
        )}
        <ReactPaginate
          previousLabel={'prev'}
          nextLabel={'next'}
          pageCount={pageCount}
          initialPage={this.state.currentPage ? this.state.currentPage - 1 : 0}
          onPageChange={this.handlePageClick}
          containerClassName={`pagination pb-5 text-center ml-lg-4`}
          previousLinkClassName={`pagination__link`}
          nextLinkClassName={`pagination__link`}
          disabledClassName={`pagination__link__disabled`}
          activeClassName={`pagination__link__active`}
        />
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    total: state.tags.total,
    totalTags: state.tags.totalTags,
    tags: state.tags.tags,
    error: state.tags.error,
    loading: state.tags.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchTags: (sortBy, filter, currentPage, perPageTags, searchBy) =>
      dispatch(
        actions.fetchTags(sortBy, filter, currentPage, perPageTags, searchBy)
      ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(checkAuth(TagsPage));
