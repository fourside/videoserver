import * as React from 'react';
import styled from 'styled-components';

interface PagerProps {
  total: number;
  currentPage: number;
  onChange: (e) => void;
}
const itemPerPage = 15;
const visibleItems = 3;

const Pager = ({ total, currentPage, onChange }: PagerProps) => {
  const totalPage = Math.ceil(total / itemPerPage);
  const li = new Array<any>();
  for (let i = 0; i < totalPage; i++) {
    if (i === currentPage) {
      li.push(<CurrentPage index={i} key={i} />);
    } else if (
      i === 0 ||
      i === totalPage - 1 ||
      (currentPage < visibleItems && i <= visibleItems) ||
      (currentPage > totalPage - visibleItems - 1 &&
        i >= totalPage - visibleItems - 1) ||
      i === currentPage + 1 ||
      i === currentPage - 1
    ) {
      li.push(<Page index={i} onChange={onChange} key={i} />);
    } else if (i === 1 || i === totalPage - 2) {
      li.push(<Ellipsis />);
    }
  }

  return (
    <PagerNav
      className="pagination is-small"
      role="navigation"
      aria-label="pagination">
      <ul className="pagination-list">{li}</ul>
    </PagerNav>
  );
};

const CurrentPage = ({ index }) => (
  <li
    className="pagination-link is-current"
    aria-label={`Page ${index}`}
    aria-current="page">
    <span>{index}</span>
  </li>
);

const Page = ({ index, onChange }) => (
  <li>
    <a
      className="pagination-link"
      aria-label={`Goto page ${index}`}
      onClick={() => onChange(index)}>
      {index}
    </a>
  </li>
);

const Ellipsis = () => (
  <li>
    <span className="pagination-ellipsis">&hellip;</span>
  </li>
);

const PagerNav = styled.nav`
  margin: 0.5em 0;
`;

export default Pager;
