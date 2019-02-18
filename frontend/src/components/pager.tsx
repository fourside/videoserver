import * as React from 'react';
import styled from 'styled-components';

interface PagerProps {
  total: number
  currentPage: number
  onChange: (e) => void
}
const itemPerPage = 30;

export default class Pager extends React.Component<PagerProps, {}> {

  render() {
    const totalPage = Math.ceil(this.props.total / itemPerPage);
    const li = new Array<any>();
    for (let i = 0; i < totalPage; i++) {
      if (i === this.props.currentPage) {
        li.push(<li key={i} className="pagination-link is-current" aria-label={`Page ${i}`} aria-current="page">{i}</li>);
      } else {
        li.push(
          <li key={i} >
            <a className="pagination-link" aria-label={`Goto page ${i}`}
              onClick={() => this.props.onChange(i)}>{i}</a>
          </li>
        );
      }
    }
    return (
      <PagerNav className="pagination is-small" role="navigation" aria-label="pagination">
        <ul className="pagination-list">
          {li}
        </ul>
      </PagerNav>
    )
  }
}
const PagerNav = styled.nav`
  margin: 0.5em 0;
`;
