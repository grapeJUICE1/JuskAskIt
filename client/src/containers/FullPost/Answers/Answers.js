import React, { Fragment, PureComponent } from 'react';
import { Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Image } from 'cloudinary-react';
import { withAlert } from 'react-alert';
import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../utils/formatDate';
import Loader from '../../../components/UI/Loader/Loader';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';
import SubmitPostAnswer from '../../../components/SubmitModals/SubmitPostAnswer/SubmitPostAnswer';

import Comments from '../Comments/Comments';
import styles from './Answers.module.scss';
import SortButtons from '../../../components/SortButtons/SortButtons';
import ReactPaginate from 'react-paginate';

class Answers extends PureComponent {
  PER_PAGE = 5;
  state = {
    ansToEdit: null,
    editQues: false,
    submit: false,
    show: false,
    currentPage: 0,
    sortBy: '-sortBest -voteCount',
  };
  componentDidMount = () => {
    this.props.onFetchAnswers(
      this.props.postId,
      this.state.sortBy,
      this.state.currentPage,
      this.PER_PAGE
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.post !== this.props.post &&
      (prevProps.post.title !== this.props.post.title ||
        this.props.post.fetchAnswers)
    ) {
      this.props.onFetchAnswers(
        this.props.postId,
        this.state.sortBy,
        this.state.currentPage,
        this.PER_PAGE
      );
    }
    if (
      prevState.sortBy !== this.state.sortBy ||
      prevState.currentPage !== this.state.currentPage
    ) {
      this.props.onFetchAnswers(
        this.props.postId,
        this.state.sortBy,
        this.state.currentPage,
        this.PER_PAGE
      );
    }
  };

  handleClose = () => {
    this.setState({ show: false });
    this.setState({ ansToEdit: null });
    this.setState({ submit: false });
    this.setState({ editQues: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  setDefaultCurrentPage = () => {
    this.setState({ currentPage: 0 });
  };
  handlePageClick = ({ selected }) => {
    console.log(selected, selected + 1);
    this.setState({ currentPage: selected + 1 });
  };
  sortBest = (e) => {
    this.setState({ sortBy: '-sortBest -voteCount' });
    this.setDefaultCurrentPage();
  };
  sortByVotes = (e) => {
    this.setState({ sortBy: '-voteCount' });
    this.setDefaultCurrentPage();
  };
  sortNewest = (e) => {
    this.setState({ sortBy: '-createdAt' });
    this.setDefaultCurrentPage();
  };
  sortOldest = (e) => {
    this.setState({ sortBy: 'createdAt' });
  };
  render() {
    let sortButtons = (
      <>
        <SortButtons
          sortBest={this.sortBest}
          sortNewest={this.sortNewest}
          sortOldest={this.sortOldest}
          sortByVotes={this.sortByVotes}
          isAnswers
        />
      </>
    );
    let answers;
    if (this.props.error) {
      this.props.alert.error('OOps .... Error occured ... try again later');
      answers = <h3>OOps .... Error occured ... try again later</h3>;
    } else if (this.props.loading) {
      answers = <Loader />;
    } else {
      answers = this.props.answers.map((ans) => {
        return (
          <Fragment key={ans._id}>
            {(this.props.post.postedBy?._id === this.props.user?._id ||
              this.props.post.bestAnswer === ans._id) && (
              <span style={{ position: 'relative', top: '9.375rem' }}>
                <OverlayTrigger
                  key={'right'}
                  placement={'right'}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      {this.props.post.bestAnswer === ans._id
                        ? 'You accepted this answer'
                        : 'Make this answer the best answer if it solved your problem or was the most useful answer of all the answers'}
                    </Tooltip>
                  }
                >
                  <button
                    onClick={() => {
                      if (
                        this.props.post.postedBy?._id === this.props.user?._id
                      ) {
                        this.props.onSubmitPost(
                          undefined,
                          undefined,
                          undefined,
                          undefined,
                          undefined,
                          'edit',
                          this.props.post._id,
                          undefined,
                          this.props.post.bestAnswer === ans._id
                            ? null
                            : ans._id
                        );
                      }
                    }}
                  >
                    <i
                      className="fas fa-check"
                      style={{
                        fontSize: '1.6rem',
                        color: `${
                          this.props.post.bestAnswer === ans._id
                            ? 'green'
                            : 'grey'
                        }`,
                      }}
                    ></i>
                  </button>
                </OverlayTrigger>
              </span>
            )}
            {!this.props.likeDislikeAnswerLoading ? (
              <LikeDislikeButtons
                userDidLike={ans.userDidLike}
                userDidDislike={ans.userDidDislike}
                onLikeDislikePost={this.props.onLikeDislikeAnswer}
                post={ans}
              />
            ) : (
              <Loader isSmall isLoaderFor="answer" />
            )}

            <div
              id={ans._id}
              className={`ml-5 pl-2 ${styles.ans_content} mb-5`}
              dangerouslySetInnerHTML={{ __html: `${ans.content}` }}
            ></div>

            <br />
            <span className="ml-auto">
              <p
                style={{
                  fontWeight: 'bold',
                  color: 'rgb(59, 59, 85)',
                  fontSize: '0.8rem',
                }}
              >
                answered {formatDate(ans.createdAt)}
              </p>
              <Image
                cloudName="grapecluster"
                publicId={ans.postedBy.photo}
                width="30"
                height="30"
                className="rounded-circle"
                crop="scale"
              />

              <Button
                className="mr-0 mt-0 pt-0 ml-auto"
                variant="link"
                size="sm"
              >
                <Link to={`/profile/${ans.postedBy._id}`}>
                  {ans.postedBy.name}
                </Link>
              </Button>
            </span>
            <div>
              {this.props.user && this.props.user._id === ans.postedBy._id && (
                <>
                  <br />
                  <br />
                  <Button
                    size="sm"
                    className="ml-3"
                    variant="outline-secondary"
                    onClick={() => {
                      this.setState({ ansToEdit: ans });
                      this.handleShow();
                    }}
                  >
                    edit
                  </Button>
                  <Button
                    size="sm"
                    className="ml-3"
                    variant="outline-danger"
                    onClick={() => this.props.onDelete('answer', ans._id)}
                  >
                    delete
                  </Button>
                </>
              )}
            </div>
            <br />
            <Comments
              id={ans._id}
              comments={ans.comments}
              forDoc="answer"
              fetchComments={this.props.onFetchComments}
            />

            <hr />
          </Fragment>
        );
      });
    }

    if (this.props.deleteSuccessful) {
      this.props.alert.success('deleted Successfully');
      this.props.onResetEditSuccess();
      if (this.props.deleteSuccessful === 'post') {
        this.props.history.push('/posts');
      }
    }
    const pageCount = Math.ceil(this.props.totalAnswers / this.PER_PAGE);
    return (
      <>
        <div>
          {this.props.user?._id === this.props?.post?.postedBy?._id ? (
            <>
              <Button
                size="sm"
                className="ml-3"
                variant="outline-secondary"
                onClick={() => {
                  this.setState({ editQues: true });
                  this.handleShow();
                }}
              >
                edit
              </Button>
              <Button
                size="sm"
                className="ml-3"
                variant="outline-danger"
                onClick={() => {
                  this.props.onDelete('post', this.props.post._id);
                }}
              >
                delete
              </Button>
            </>
          ) : (
            ''
          )}
        </div>
        <Container className="d-flex flex-column justify-content-between pt-5">
          <h3>
            <strong>
              {this.props.totalAnswers}{' '}
              {this.props.totalAnswers > 1 ? 'Answers' : 'Answer'}
            </strong>
            <br />
            <br />
            {this.props.user ? (
              <div>
                <Button
                  variant="dark"
                  size="lg"
                  onClick={() => {
                    this.setState({ submit: true });
                    this.handleShow();
                  }}
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <small>Login to submit answer</small>
            )}
            {sortButtons}
            <ReactPaginate
              previousLabel={'prev'}
              nextLabel={'next'}
              pageCount={pageCount}
              initialPage={this.state.currentPage ? this.state.currentPage : 0}
              onPageChange={this.handlePageClick}
              containerClassName={`pagination pb-5 text-center ml-auto`}
              previousLinkClassName={`pagination__link`}
              nextLinkClassName={`pagination__link`}
              disabledClassName={`pagination__link__disabled`}
              activeClassName={`pagination__link__active`}
            />
            <br />
            <hr />
          </h3>

          {answers}
          {(this.props.user && this.state.ansToEdit) ||
          (this.props.user && this.state.submit) ||
          (this.props.user && this.state.editQues) ? (
            <SubmitPostAnswer
              type={
                this.state.ansToEdit
                  ? 'answer-edit'
                  : this.state.editQues
                  ? 'edit'
                  : this.state.submit
                  ? 'answer'
                  : null
              }
              postId={
                this.state.ansToEdit
                  ? this.state.ansToEdit._id
                  : this.props.post._id
              }
              editedTitle={this.state.editQues ? this.props.post.title : null}
              editedTags={this.state.editQues ? this.props.post.tags : null}
              editedContent={
                // this.props.post.content
                this.state.editQues
                  ? this.props.post.content
                  : this.state.ansToEdit
                  ? this.state.ansToEdit.content
                  : ''
              }
              show={this.state.show}
              handleShow={this.handleShow}
              handleClose={() => this.handleClose()}
              editSuccessful={
                !this.state.submit ? this.props.editSuccessful : null
              }
              submitSuccessful={
                !this.state.ansToEdit && !this.state.editQues
                  ? this.props.submitSuccessful
                  : null
              }
              onSubmitPost={this.props.onSubmitPost}
              error={this.props.submitError}
              loading={this.props.submitLoading}
              onResetEditSuccess={this.props.onResetEditSuccess}
            />
          ) : null}
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    answers: state.answers.answers,
    error: state.answers.error,
    post: state.fullPost.post,
    loading: state.answers.loading,
    totalAnswers: state.answers.totalAnswers,
    likeDislikeAnswerLoading: state.answers.likeDislikeAnswerLoading,
    editSuccessful: state.fullPost.editSuccessful,
    submitSuccessful: state.fullPost.submitSuccessful,
    submitError: state.fullPost.submitError,
    submitLoading: state.fullPost.submitLoading,
    deleteError: state.fullPost.deleteError,
    deleteSuccessful: state.fullPost.deleteSuccessful,
    deleteLoading: state.fullPost.deleteLoading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAnswers: (id, sortBy, currentPage, perPagePosts) =>
      dispatch(actions.fetchAnswers(id, sortBy, currentPage, perPagePosts)),
    onLikeDislikeAnswer: (id, likeordislike) =>
      dispatch(actions.LikeDislikeAnswer(id, likeordislike)),
    onFetchComments: (id, forDoc) =>
      dispatch(actions.fetchComments(id, forDoc)),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
    onDelete: (type, postId) => dispatch(actions.deletePost(type, postId)),
    onSubmitPost: (
      title,
      content,
      userId,
      tags,
      contentWordCount,
      type,
      postId,
      forDoc,
      bestAnswer
    ) =>
      dispatch(
        actions.submitPost(
          title,
          content,
          userId,
          tags,
          contentWordCount,
          type,
          postId,
          forDoc,
          bestAnswer
        )
      ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAlert()(Answers)));
