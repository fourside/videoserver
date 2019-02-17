import * as React from 'react';

import Client from './client';

interface VideoFormProps {
  close: () => void
  notifyHttp: () => void
}
interface VideoFormState {
  url: string
  category: string
  isValid: boolean
}
export default class VideoForm extends React.Component<VideoFormProps, VideoFormState> {

  constructor(props) {
    super(props);
    this.state = {
      url: "",
      category: "",
      isValid: false
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.isValid) {
      new Client().postUrl({
        url: this.state.url,
        category: this.state.category
      }).then(res => {
        this.props.close();
        this.props.notifyHttp();
      }).catch(err => {
        console.log(err);
      });
    }
  }

  handleUrlChange(e) {
    this.setState({
      url: e.target.value
    })
    this.isValid();
  }

  handleCategoryChange(e) {
    this.setState({
      category: e.target.value
    })
    this.isValid();
  }

  isValid() {
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
              onChange={(e) => this.handleUrlChange(e) } />
            <span className="icon is-small is-left">
              <i className="fas fa-download"></i>
            </span>
          </div>
        </div>

        <div className="field">
          <label className="label">Category</label>
          <div className="control has-icons-left has-icons-right">
            <input className="input" name="category" type="input" placeholder="Category input" list="cat"
              onChange={(e) => this.handleCategoryChange(e) } />
            <datalist id="cat">
              <option value="music" />
              <option value="xxx" />
            </datalist>
            <span className="icon is-small is-left">
              <i className="fas fa-tag"></i>
            </span>
          </div>
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
