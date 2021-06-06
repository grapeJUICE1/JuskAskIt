import { connect } from 'react-redux';
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Image } from 'cloudinary-react';
import { formatDate, timeSince } from '../../../utils/formatDate';
import styles from './Question.module.scss';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';
import Loader from '../../../components/UI/Loader/Loader';

import * as actions from '../../../store/actions/index';
import { Link, withRouter } from 'react-router-dom';
const Question = (props) => {
  return (
    <>
      {props.post ? (
        <Container className={'d-flex flex-column justify-content-between  '}>
          <h2 className={styles.Question}>
            <strong> {props.post.title} </strong>
          </h2>
          <br />
          <h6>
            Asked <strong>{timeSince(props.post.createdAt)} ago</strong>
            &nbsp; &nbsp; &nbsp; Viewed{' '}
            <strong>{props.post.views} times</strong>
          </h6>
          <hr />
          <div style={{ display: 'flex' }}>
            {!props.likeDislikeLoading ? (
              <LikeDislikeButtons
                userDidLike={props.userDidLike}
                userDidDislike={props.userDidDislike}
                onLikeDislikePost={props.onLikeDislikePost}
                post={props.post}
              />
            ) : (
              <Loader isSmall isLoaderFor="question" />
            )}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <div
              dangerouslySetInnerHTML={{
                __html: `${props.post.content}`,
              }}
            ></div>
          </div>
          <div className="pt-5">
            {props.post.tags?.map((tag) => (
              <div
                key={tag}
                onClick={(e) =>
                  props.history.push(`/posts?tag=${encodeURIComponent(tag)}`)
                }
                className="tag px-1 py-1 mr-1 mb-1"
                role="button"
              >
                {tag}
              </div>
            ))}
          </div>
          <br />
          <span className="ml-auto">
            <p
              style={{
                fontWeight: 'bold',
                color: 'rgb(59, 59, 85)',
                fontSize: '0.8rem',
              }}
            >
              asked {formatDate(props.post.createdAt)}
            </p>
            <Image
              cloudName="grapecluster"
              publicId={props.post.postedBy?.photo}
              width="30"
              height="30"
              className="rounded-circle"
              crop="scale"
            />
            <Button className="mr-0 mt-0 pt-0 ml-auto" variant="link" size="sm">
              <Link to={`/profile/${props.post.postedBy?._id}`}>
                {props.post.postedBy?.name}
              </Link>
            </Button>
          </span>
        </Container>
      ) : (
        ''
      )}
      <br />
      <div></div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userDidLike: state.fullPost.userDidLike,
    userDidDislike: state.fullPost.userDidDislike,
    likeDislikeLoading: state.fullPost.likeDislikeLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLikeDislikePost: (id, likeordislike) =>
      dispatch(actions.LikeDislikePost(id, likeordislike)),
    onFetchComments: (id, forDoc) =>
      dispatch(actions.fetchComments(id, forDoc)),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
    onSubmitPost: (
      title,
      content,
      userId,
      tags,
      contentWordCount,
      type,
      postId
    ) =>
      dispatch(
        actions.submitPost(
          title,
          content,
          userId,
          tags,
          contentWordCount,
          type,
          postId
        )
      ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Question));
