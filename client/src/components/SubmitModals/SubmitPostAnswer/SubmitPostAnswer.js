import React, { PureComponent } from 'react';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

import { Button, Form, Container } from 'react-bootstrap';
import * as actions from '../../../store/actions/index';
import DOMPurify from 'dompurify';
import Editor from '../../Editor/Editor';
import styles from './SubmitPostAnswer.module.scss';
import Loader from '../../UI/Loader/Loader';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

class SubmitPostAnswer extends PureComponent {
  blocksFromPrevHTML = htmlToDraft(`${this.props.editedContent || ''}`);
  editorContent = ContentState.createFromBlockArray(
    this.blocksFromPrevHTML.contentBlocks,
    this.blocksFromPrevHTML.entityMap
  );
  submitType = this.props.match.params.type;
  postToEditId = this.props.match.params.postId;

  state = {
    redirect: null,
    content: '',
    contentWordCount: 0,
    title: this.props.editedTitle || '',
    tags: this.props.editedTags || [],
    editorState: EditorState.createWithContent(this.editorContent),
  };

  handleSubmit = async () => {
    await this.props.onSubmitPost(
      this.state.title,
      DOMPurify.sanitize(this.state.content),
      this.props.userId,
      this.state.tags,
      this.state.contentWordCount,
      this.submitType,
      this.props.postId
    );
  };

  addTags = (e) => {
    if (e.target.value.trim() !== '') {
      this.setState({ tags: [...this.state.tags, e.target.value.trim()] });
      e.target.value = '';
    }
  };
  removeTags = (idToRemove) => {
    this.setState({
      tags: [...this.state.tags.filter((_, id) => id !== idToRemove)],
    });
  };

  render() {
    if (this.props.editSuccessful || this.props.submitSuccessful) {
      alert.success(
        `${
          this.submitType === 'answer-edit' || this.submitType === 'edit'
            ? 'edited'
            : 'posted'
        } Succesfully`
      );
      this.props.onResetEditSuccess();
    }

    if (this.props.newPostUrl) {
      alert.success('Post Submitted Succesfully');
      this.props.onResetEditSuccess();
      setTimeout(() => {
        this.setState({ redirect: this.props.newPostUrl });
      }, 100);
    }

    return (
      <>
        {console.log(this.props.match.params)}
        {this.state.redirect ? <Redirect to={this.state.redirect} /> : ''}
        <h3 className={styles.heading}>
          <strong>
            {this.submitType === 'edit'
              ? 'Edit post'
              : this.submitType === 'answer-edit'
              ? 'Edit Answer'
              : this.submitType === 'answer'
              ? 'Submit Answer'
              : 'Submit post'}
          </strong>
        </h3>
        <Container id="submitPostAnswerContainer">
          <div className={styles.container}>
            {this.props.submitError &&
              this.props.submitError.split('.').map((val, id) => {
                return (
                  <h4 key={id} className="text-danger">
                    {val}
                  </h4>
                );
              })}
            {!this.props.loading ? (
              <Form>
                {this.submitType !== 'answer' &&
                  this.submitType !== 'answer-edit' && (
                    <Form.Group>
                      <Form.Label>Post Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={this.statetitle}
                        onChange={(e) =>
                          this.setState({ title: e.target.value })
                        }
                      />
                      <Form.Text className="text-muted">
                        Post title should not exceed 100 words
                      </Form.Text>
                    </Form.Group>
                  )}
                <br />

                <Form.Label>Content</Form.Label>
                <Editor
                  onChange={(content, contentWordCount) => {
                    this.setState({ content: content });
                    this.setState({ contentWordCount: contentWordCount });
                  }}
                  editorState={this.state.editorState}
                  setEditorState={this.state.setEditorState}
                />
                <Form.Text className="text-muted">
                  your content should be atleast 25 words
                </Form.Text>

                <br />
                {this.submitType !== 'answer' &&
                  this.submitType !== 'answer-edit' && (
                    <Form.Group>
                      <Form.Label>Tags</Form.Label>
                      <div className={styles.tags_input}>
                        <ul className={styles.tags}>
                          {this.state.tags.map((val, id) => (
                            <li className={styles.tag} key={id}>
                              <span className={styles.tag_title}>{val}</span>
                              <span
                                className={styles.tag_close_icon}
                                onClick={() => this.removeTags(id)}
                              >
                                X
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Form.Control
                          type="text"
                          placeholder="Enter tags"
                          className="border-0"
                          onKeyPress={(e) =>
                            e.key === 'Enter' || e.code === 'Space'
                              ? this.addTags(e)
                              : null
                          }
                        />
                      </div>

                      <Form.Text className="text-muted">
                        Enter atleast 1 tag , u can enter upto 5 tags at highest
                      </Form.Text>
                    </Form.Group>
                  )}
                <br />
                <Button onClick={() => this.handleSubmit()}>Submit</Button>
              </Form>
            ) : (
              <Loader />
            )}
          </div>
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    submitError: state.fullPost.submitError,
    submitLoading: state.fullPost.submitLoading,
    newPostUrl: state.fullPost.newPostUrl,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitPost: (title, content, userId, tags, contentWordCount) =>
      dispatch(
        actions.submitPost(title, content, userId, tags, contentWordCount)
      ),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SubmitPostAnswer);

/* <SubmitPostAnswer
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
    : this.this.props.post._id
}
editedTitle={this.state.editQues ? this.this.props.post.title : null}
editedTags={this.state.editQues ? this.this.props.post.tags : null}
editedContent={
  // this.this.props.post.content
  this.state.editQues
    ? this.this.props.post.content
    : this.state.ansToEdit
    ? this.state.ansToEdit.content
    : ''
}
editSuccessful={
  !this.state.submit ? this.this.props.editSuccessful : null
}
submitSuccessful={
  !this.state.ansToEdit && !this.state.editQues
    ? this.this.props.submitSuccessful
    : null
}
onSubmitPost={this.this.props.onSubmitPost}
error={this.this.props.submitError}
loading={this.this.props.submitLoading}
onResetEditSuccess={this.this.props.onResetEditSuccess}
/> */
