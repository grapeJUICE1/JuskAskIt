import { Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../utils/formatDate';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';
import Loader from '../../../components/UI/Loader/Loader';
//   {
//   id,
//   forDoc,
//   fetchComments,
//   comments,
//   onLikeDislikeComments,
//   onSubmitPost,
// }
const Comments = (props) => {
  const [edit, setEdit] = useState(null);
  const [newCmnt, setNewCmnt] = useState(null);
  const [newCmntContent, setNewCmntContent] = useState(null);
  useEffect(() => {
    if (props.id && props.forDoc) {
      props.fetchComments(props.id, props.forDoc);
    }
  }, [props.id]);

  const alert = useAlert();

  if (props.editSuccessful || props.submitSuccessful) {
    alert.success(
      `comment ${props.editSuccessful ? 'edited' : 'posted'} Succesfully`
    );
    props.onResetEditSuccess();
  }
  return (
    <div>
      {props.user ? (
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setNewCmnt(true);
          }}
        >
          add a comment
        </Button>
      ) : (
        'Login to add comment'
      )}
      {newCmnt ? (
        <>
          <textarea
            // onBlur={() => setEdit(null)}
            value={newCmntContent}
            onChange={(e) => {
              setNewCmntContent(e.target.value);
            }}
          ></textarea>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              props.onSubmitPost(
                undefined,
                newCmntContent,
                undefined,
                undefined,
                undefined,
                'comment',
                props.id,
                'Answer'
              );
            }}
          >
            confirm
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setNewCmnt(null);
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
      {props.comments
        ? props.comments.map((cmnt) => (
            <Fragment key={cmnt._id}>
              {!props.likeDislikeCommentLoading ? (
                <LikeDislikeButtons
                  userDidLike={cmnt.userDidLike}
                  userDidDislike={cmnt.userDidDislike}
                  onLikeDislikePost={props.onLikeDislikeComments}
                  isComment={true}
                  post={cmnt}
                  isSmall={true}
                  // getUsersFormerReactions={getUsersFormerReactionsOnThisPost}
                />
              ) : (
                <Loader isSmall isLoaderFor="comment" />
              )}
              <small id={cmnt._id}>
                {edit && edit._id === cmnt._id ? (
                  <>
                    <textarea
                      // onBlur={() => setEdit(null)}
                      value={edit.content}
                      onChange={(e) => {
                        setEdit({ ...edit, content: e.target.value });
                      }}
                    ></textarea>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        props.onSubmitPost(
                          undefined,
                          edit.content,
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
                        setEdit(null);
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
              <small className="text-muted">{formatDate(cmnt.createdAt)}</small>
              <br />
              {props.user?._id === cmnt.postedBy?._id ? (
                <>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-info text"
                    onClick={() => {
                      setEdit(cmnt);
                    }}
                  >
                    <small>edit</small>
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-info text"
                    onClick={() => {
                      props.onDelete('comment', cmnt._id);
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
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    editSuccessful: state.fullPost.editSuccessful,
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
      forDoc
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
          forDoc
        )
      ),
    onLikeDislikeComments: (id, forDoc, likeordislike) =>
      dispatch(actions.likeDislikeComments(id, forDoc, likeordislike)),
    onDelete: (type, postId) => dispatch(actions.deletePost(type, postId)),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Comments);
