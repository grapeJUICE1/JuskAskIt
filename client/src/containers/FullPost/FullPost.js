import React, { PureComponent, Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';

import Question from './Question/Question';
import { withRouter } from 'react-router';
import Answers from './Answers/Answers';
import * as actions from '../../store/actions/index';
import Loader from '../../components/UI/Loader/Loader';
import checkAuth from '../../hoc/checkAuth';

class FullPost extends PureComponent {
  state = {
    post: {},
    show: false,
    didUpdate: false,
  };
  componentDidMount() {
    this.props.onFetchFullPost(this.props.match.params.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.onFetchFullPost(this.props.match.params.id);
    }
    if (this.props.answers !== prevProps.answers) {
      if (this.state.didUpdate === false) {
        if (this.props.location.hash) {
          const id = this.props.location.hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView();
            element.classList.add('fade-it');
            this.setState({ didUpdate: true });
          }
        }
      }
    }
    if (this.props.location.hash !== prevProps.location.hash) {
      this.props.onFetchFullPost(this.props.match.params.id);
      this.setState({ didUpdate: false });
    }
  }
  render() {
    let post;
    if (this.props.error) {
      // post = <h1>{this.props.error.message}</h1>;
      if (this.props.post.id) {
        post = <Question post={this.props.post} />;
      } else {
        post = <h1>{this.props.error.message}</h1>;
      }
    } else if (this.props.loading) {
      post = <Loader />;
    } else {
      post = <Question post={this.props.post} />;
    }
    return (
      <Fragment>
        <Container className="d-flex flex-column justify-content-between pt-5 mt-5 mr-lg-4">
          {post}
          <div></div>
          {!this.props.error && (
            <>
              <Answers postId={this.props.match.params.id} />

              <br />
              <br />
            </>
          )}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.fullPost.post,
    answers: state.answers.answers,
    error: state.fullPost.error,
    loading: state.fullPost.loading,

    submitError: state.fullPost.submitError,
    submitLoading: state.fullPost.submitLoading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchFullPost: (id) => dispatch(actions.fetchFullPost(id)),
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
)(withRouter(checkAuth(FullPost)));
