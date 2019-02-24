import * as React from 'react';

export default ({current, categories, onChange}) => (
  <div className="control has-icons-left">
    <div className="select is-small">
      <select onChange={onChange} value={current}>
        <option value="">all</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
    <div className="icon is-small is-left">
      <i className="fas fa-tag"></i>
    </div>
  </div>
);
