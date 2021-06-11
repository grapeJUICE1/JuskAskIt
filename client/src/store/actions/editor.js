import * as actionTypes from './actionTypes';

export const editStart = (data) => {
  return {
    type: actionTypes.EDIT_START,
    title: data.title,
    editedTitle: data.editedTitle,
    editedTags: data.editedTags,
    editedContent: data.editedContent,
  };
};
