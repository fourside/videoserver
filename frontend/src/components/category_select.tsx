import * as React from 'react';

interface SelectProps {
  current: string
  categories: Array<string>
  onChange: (e) => void
}
const select = ({current, categories, onChange} : SelectProps) => (
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

export default select;
