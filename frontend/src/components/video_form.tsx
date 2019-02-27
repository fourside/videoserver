import * as React from 'react';
import { useState, useLayoutEffect } from 'react';
import styled from 'styled-components';

import CategoryInput from './category_input';
import useCategory from '../hooks/use_category';
import Client from '../shared/client';

interface VideoFormProps {
  close: () => void
  notifyHttp: () => void
}
interface FormValues {
  url: string
  category: string
  subtitle: boolean
}
interface ErrMessage {
  message: string
  isError: boolean
}
const VideoForm = (props :VideoFormProps) => {
  let urlInput :HTMLElement | null;
  const [formValues, setFormValues] = useState<FormValues>({
    url: "",
    category: "",
    subtitle: false
  });
  const [isValid, setValid] = useState<boolean>(false);
  const categories = useCategory();
  const [errMessage, setErrMessage] = useState<ErrMessage>({isError: false, message: ""});

  useLayoutEffect(() => {
    if (urlInput) {
      urlInput.focus();
    }
  }, []);

  const handleSubmit = (e :any) :void => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    clearErrorNotification();
    new Client().postUrl(formValues).then((res) => {
      if (res.ok) {
        props.close();
        props.notifyHttp();
      } else {
        res.text().then(text => {
          notifyError(text);
        })
      }
    }).catch(err => {
      notifyError(err);
    });
  }

  const notifyError = (message :string) :void => {
    setErrMessage({isError: true, message: message});
  };

  const clearErrorNotification = () :void => {
    setErrMessage({isError: false, message: ""});
  };

  const handleUrlChange = (e :any) :void => {
    setFormValues({
      ...formValues,
      url: e.target.value
    });
    validate();
  };

  const handleCategoryChange = (e :string) :void => {
    setFormValues({
      ...formValues,
      category: e
    });
    validate();
  };

  const handleSubtitleChange = (e :any) :void => {
    setFormValues({
      ...formValues,
      category: e.target.checked
    });
    validate();
  };

  const validate = () :void => {
    setValid(!!(formValues.url) && !!(formValues.category));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Video URL</label>
        <div className="control has-icons-left has-icons-right">
          <input className="input" name="url" type="text" placeholder="URL input"
            onChange={handleUrlChange}
            onBlur={validate}
            ref={input => {urlInput = input}}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-download"></i>
          </span>
        </div>
      </div>

      <div className="field">
        <label className="label">Category</label>
        <div className="control has-icons-left has-icons-right">
          <CategoryInput className="input" name="category" placeholder="Category input"
            onChange={handleCategoryChange}
            onBlur={validate}
            item={categories}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-tag"></i>
          </span>
        </div>
      </div>

      <div className="field">
        <label className="checkbox">
          <div className="control">
            <input type="checkbox" name="subtitle" onChange={handleSubtitleChange} />
            <CheckboxText >use subtitle</CheckboxText>
          </div>
        </label>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" disabled={!isValid} >Submit</button>
        </div>
        <div className="control">
          <button className="button is-link" onClick={props.close}>Cancel</button>
        </div>

        <div className={`notification is-danger ${errMessage.isError ? "is-shown" : "is-hidden"}`} >
          <button className="delete" onClick={clearErrorNotification}></button>
          {errMessage.message}
        </div>

      </div>
    </form>
  );
};
export default VideoForm;

const CheckboxText = styled.span`
  padding-left: 5px;
`;
