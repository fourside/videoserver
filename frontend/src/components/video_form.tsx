import * as React from 'react';
import styled from 'styled-components';

import CategoryInput from './category_input';
import Client from '../shared/client';

const CheckboxText = styled.span`
  padding-left: 5px;
`;
interface VideoFormProps {
  close: () => void
  notifyHttp: () => void
  category: Array<string>
}
interface VideoFormState {
  url: string
  category: string
  subtitle: boolean
  isValid: boolean
}
export default class VideoForm extends React.Component<VideoFormProps, VideoFormState> {

  urlInput;
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      category: "",
      subtitle: false,
      isValid: false
    };
  }

  componentDidMount() {
    this.urlInput.focus();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.isValid) {
      new Client().postUrl({
        url: this.state.url,
        category: this.state.category,
        subtitle: this.state.subtitle
      }).then(res => {
        this.props.close();
        this.props.notifyHttp();
      }).catch(err => {
        console.log(err);
      });
    }
  }

  handleUrlChange(e) {
    const url = e.target.value;
    this.setState({
      url: url,
      isValid: !!(url) && !!(this.state.category)
    })
  }

  handleCategoryChange(value) {
    this.setState({
      category: value,
      isValid: !!(this.state.url) && !!(value)
    })
  }

  checkSubtitle(e) {
    this.setState({
      subtitle: e.target.checked
    });
  }

  validate() {
    this.setState({
      isValid: !!(this.state.url) && !!(this.state.category)
    })
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <div className="field">
          <label className="label">Video URL</label>
          <div className="control has-icons-left has-icons-right">
            <input className="input" name="url" type="text" placeholder="URL input"
              onChange={(e) => this.handleUrlChange(e)}
              onBlur={() => this.validate()}
              ref={input => {this.urlInput = input}}
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
              onChange={this.handleCategoryChange.bind(this) }
              onBlur={() => this.validate()}
              item={this.props.category}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-tag"></i>
            </span>
          </div>
        </div>

        <div className="field">
          <label className="checkbox">
            <div className="control">
              <input type="checkbox" name="subtitle" onChange={(e) => this.checkSubtitle(e)} />
              <CheckboxText >use subtitle</CheckboxText>
            </div>
          </label>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" disabled={!this.state.isValid} >Submit</button>
          </div>
          <div className="control">
            <button className="button is-link" onClick={this.props.close}>Cancel</button>
          </div>
        </div>
      </form>
    );
  }
}
