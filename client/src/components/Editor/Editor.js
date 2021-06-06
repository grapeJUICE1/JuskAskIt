import React, { useState, useEffect } from 'react';

import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Editor.css';
import draftToHtml from 'draftjs-to-html';
import axios from 'axios';

const MainEditor = (props) => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleEditorChange = (state) => {
    props.setEditorState(state);
  };

  const _uploadImageCallBack = async (file) => {
    let imagesToUpload = uploadedImages;

    const formData = new FormData();
    formData.append('photo', file);
    let res = await axios.post('/users/upload-post-photo', formData);

    const imageObject = {
      file: file,
      localSrc: res.data.data.url,
    };

    imagesToUpload.push(imageObject);

    setUploadedImages(imagesToUpload);

    return new Promise((resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } });
    });
  };
  useEffect(() => {
    let rawContentState = convertToRaw(props.editorState.getCurrentContent());
    let currentContentAsHTML = draftToHtml(rawContentState);

    let contentWordCount = props.editorState
      .getCurrentContent()
      .getPlainText('').length;
    if (props.onChange) {
      props.onChange(currentContentAsHTML, contentWordCount);
    }
  }, [props.editorState]);

  return (
    <>
      <Editor
        editorStyle={{ maxHeight: '80vh' }}
        handlePastedText={() => false}
        editorState={props.editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          image: {
            uploadCallback: _uploadImageCallBack,
            previewImage: true,
            alt: { present: true, mandatory: false },
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
          },
          options: [
            'inline',
            'blockType',
            'fontFamily',
            'list',
            'textAlign',
            'link',
            'colorPicker',
            'emoji',
            'image',
            'remove',
            'history',
          ],
        }}
      />
    </>
  );
};
export default MainEditor;
