import { Button } from 'react-bootstrap';
import React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withAlert } from 'react-alert';
import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../utils/formatDate';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';
import Loader from '../../../components/UI/Loader/Loader';
import { PureComponent } from 'react';

class Comments extends PureComponent {
  PER_PAGE = 5;
  state = {
    edit: '',
    newCmnt: null,
    newCmntContent: null,
    currentPage: 1,
  };
  componentDidMount() {
    if (!this.props.comments)
      this.props.onFetchComments(
        this.props.id,
        'Answer',
        this.state.currentPage,
        this.PER_PAGE
      );
  }
  componentDidUpdate = (prevProps, prevState) => {
    // if (prevProps.id !== this.props.id) {
    //   this.props.onFetchComments(this.props.id, this.props.forDoc);
    // }

    if (prevState.currentPage !== this.state.currentPage) {
      this.props.onFetchComments(
        this.props.id,
        'Answer',
        this.state.currentPage,
        this.PER_PAGE
      );
    }
  };
  render() {
    const pageCount = Math.ceil(this.props.totalNumOfComments / this.PER_PAGE);
    if (this.props.editSuccessful || this.props.submitSuccessful) {
      this.props.alert.success(
        `comment ${this.props.editSuccessful ? 'edited' : 'posted'} Succesfully`
      );
      this.props.onResetEditSuccess();
    }
    return (
      <div>
        {this.props.user ? (
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              this.setState({ newCmnt: true });
            }}
          >
            add a comment
          </Button>
        ) : (
          'Login to add comment'
        )}
        {this.state.newCmnt ? (
          <>
            <textarea
              // onBlur={() => setEdit(null)}
              value={this.state.newCmntContent}
              onChange={(e) => {
                // this.setState({ newCmnt: true });
                this.setState({ newCmntContent: e.target.value });
              }}
            ></textarea>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                this.props.onSubmitPost(
                  undefined,
                  this.state.newCmntContent,
                  undefined,
                  undefined,
                  undefined,
                  'comment',
                  this.props.id,
                  'Answer',
                  this.props.post._id
                );
              }}
            >
              confirm
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                this.setState({ newCmnt: null });
              }}
            >
              cancel
            </Button>
            &nbsp; &nbsp;
          </>
        ) : (
          ''
        )}
        <hr />

        {this.props.comments
          ? this.props.comments.map((cmnt) => (
              <Fragment key={cmnt._id}>
                {!this.props.likeDislikeCommentLoading ? (
                  <LikeDislikeButtons
                    userDidLike={cmnt.userDidLike}
                    userDidDislike={cmnt.userDidDislike}
                    onLikeDislikePost={this.props.onLikeDislikeComments}
                    isComment={true}
                    post={cmnt}
                    isSmall={true}
                    // getUsersFormerReactions={getUsersFormerReactionsOnThisPost}
                  />
                ) : (
                  <Loader isSmall isLoaderFor="comment" />
                )}
                <small id={cmnt._id} className={this.props.newCmntClass}>
                  {this.state.edit && this.state.edit._id === cmnt._id ? (
                    <>
                      <textarea
                        // onBlur={() => setthis.state.Edit(null)}
                        value={this.state.edit.content}
                        onChange={(e) => {
                          this.setState({
                            edit: {
                              ...this.state.edit,
                              content: e.target.value,
                            },
                          });
                        }}
                      ></textarea>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          this.props.onSubmitPost(
                            undefined,
                            this.state.edit.content,
                            undefined,
                            undefined,
                            undefined,
                            'comment-edit',
                            cmnt._id
                          );
                        }}
                      >
                        confirm
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          this.setState({ edit: null });
                        }}
                      >
                        cancel
                      </Button>
                      &nbsp; &nbsp;
                    </>
                  ) : (
                    cmnt.content
                  )}
                </small>

                <Button variant="link" size="sm" className="text-info text">
                  <small>
                    <Link to={`/profile/${cmnt.postedBy._id}`}>
                      {cmnt.postedBy.name}
                    </Link>
                  </small>
                </Button>
                <small className="text-muted">
                  {formatDate(cmnt.createdAt)}
                </small>
                <br />
                {this.props.user?._id === cmnt.postedBy?._id ? (
                  <>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-info text"
                      onClick={() => {
                        this.setState({ edit: cmnt });
                      }}
                    >
                      <small>edit</small>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-info text"
                      onClick={() => {
                        this.props.onDelete('comment', cmnt._id);
                      }}
                    >
                      <small>delete</small>
                    </Button>
                  </>
                ) : (
                  ''
                )}
                <hr />
              </Fragment>
            ))
          : null}
        {this.props.comments &&
        this.props.comments.length <= (pageCount - 1) * this.PER_PAGE ? (
          <Button
            variant="link"
            size="sm"
            className="text-info text"
            onClick={() => {
              this.setState({ currentPage: this.state.currentPage + 1 });
            }}
          >
            {console.log(
              'nandato',
              this.props.id,
              this.state.currentPage,
              pageCount
            )}
            Load More Comments
          </Button>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    editSuccessful: state.fullPost.editSuccessful,
    post: state.fullPost.post,
    likeDislikeCommentLoading: state.answers.likeDislikeCommentLoading,
    submitSuccessful: state.fullPost.submitSuccessful,
    submitError: state.fullPost.submitError,
    submitLoading: state.fullPost.submitLoading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitPost: (
      title,
      content,
      userId,
      tags,
      contentWordCount,
      type,
      postId,
      forDoc,
      postIdForComment
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
          undefined,
          postIdForComment
        )
      ),
    onLikeDislikeComments: (id, forDoc, likeordislike) =>
      dispatch(actions.likeDislikeComments(id, forDoc, likeordislike)),
    onDelete: (type, postId) => dispatch(actions.deletePost(type, postId)),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
    onFetchComments: (id, forDoc, currentPage, perPagePosts) =>
      dispatch(actions.fetchComments(id, forDoc, currentPage, perPagePosts)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(Comments));
