import React, { useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { useAlert } from 'react-alert';

import { Button, Modal, Form } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import Editor from '../../Editor/Editor';
import styles from './SubmitPostAnswer.module.scss';
import Loader from '../../UI/Loader/Loader';
import { Redirect } from 'react-router';

function SubmitPostAnswer(props) {
  const [redirect, setRedirect] = useState(null);
  const [content, setContent] = useState('');
  const [contentWordCount, setContentWordCount] = useState(0);
  const [title, setTitle] = useState(props.editedTitle || '');
  const [tags, setTags] = useState(props.editedTags || []);

  const blocksFromPrevHTML = htmlToDraft(`${props.editedContent || ''}`);
  const editorContent = ContentState.createFromBlockArray(
    blocksFromPrevHTML.contentBlocks,
    blocksFromPrevHTML.entityMap
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(editorContent)
  );

  const alert = useAlert();

  const handleSubmit = async () => {
    await props.onSubmitPost(
      title,
      DOMPurify.sanitize(content),
      props.userId,
      tags,
      contentWordCount,
      props.type,
      props.postId
    );
  };
  if (props.editSuccessful || props.submitSuccessful) {
    alert.success(
      `${
        props.type === 'answer-edit' || props.type === 'edit'
          ? 'edited'
          : 'posted'
      } Succesfully`
    );
    props.onResetEditSuccess();
    props.handleClose();
  }

  if (props.newPostUrl) {
    alert.success('Post Submitted Succesfully');
    props.onResetEditSuccess();
    setTimeout(() => {
      props.handleClose();
      setRedirect(props.newPostUrl);
    }, 100);
  }

  const addTags = (e) => {
    if (e.target.value.trim() !== '') {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = '';
    }
  };
  const removeTags = (idToRemove) => {
    setTags([...tags.filter((_, id) => id !== idToRemove)]);
  };

  return (
    <>
      {redirect ? <Redirect to={redirect} /> : ''}
      <Modal
        show={props.show}
        onHide={props.handleClose}
        dialogClassName="submitModal"
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>
            <strong>
              {props.type === 'edit'
                ? 'Edit post'
                : props.type === 'answer-edit'
                ? 'Edit Answer'
                : props.type === 'answer'
                ? 'Submit Answer'
                : 'Submit post'}
            </strong>
          </Modal.Title>
        </Modal.Header>

        {props.error &&
          props.error.split('.').map((val, id) => {
            return (
              <h4 key={id} className="text-danger ml-3">
                {val}
              </h4>
            );
          })}

        <Modal.Body>
          {!props.loading ? (
            <Form>
              {props.type !== 'answer' && props.type !== 'answer-edit' && (
                <Form.Group>
                  <Form.Label>Post Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Post title should not exceed 100 words
                  </Form.Text>
                </Form.Group>
              )}
              <br />
              <Form.Group>
                <Form.Label>Content</Form.Label>
                <Editor
                  onChange={(content, contentWordCount) => {
                    setContent(content);
                    setContentWordCount(contentWordCount);
                  }}
                  editorState={editorState}
                  setEditorState={setEditorState}
                />
                <Form.Text className="text-muted">
                  your content should be atleast 25 words
                </Form.Text>
              </Form.Group>
              <br />
              {props.type !== 'answer' && props.type !== 'answer-edit' && (
                <>
                  <Form.Label>Tags</Form.Label>
                  <div className={styles.tags_input}>
                    <ul className={styles.tags}>
                      {tags.map((val, id) => (
                        <li className={styles.tag} key={id}>
                          <span className={styles.tag_title}>{val}</span>
                          <span
                            className={styles.tag_close_icon}
                            onClick={() => removeTags(id)}
                          >
                            X
                          </span>
                        </li>
                      ))}
                    </ul>
                    <input
                      type="text"
                      placeholder="Enter tags"
                      className="border-0"
                      onKeyPress={(e) =>
                        e.key === 'Enter' || e.code === 'Space'
                          ? addTags(e)
                          : null
                      }
                    />
                  </div>

                  <Form.Text className="text-muted">
                    Enter atleast 1 tag , u can enter upto 5 tags at highest
                  </Form.Text>
                </>
              )}
              <br />
              <Button onClick={() => handleSubmit()}>Submit</Button>
            </Form>
          ) : (
            <Loader />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SubmitPostAnswer;
