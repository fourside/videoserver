import * as React from 'react';
import Downshift from 'downshift';
import styled from 'styled-components';

export default ({className, name, placeholder, onChange, onBlur, item}) => {

  return (
    <Downshift onChange={onChange}>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
      }) => (
        <div>
          <input {...getInputProps()}
            className={className}
            name={name}
            onBlur={onBlur}
            placeholder={placeholder}
          />
          { isOpen ? (
            <div className="menu">
              <DownshiftUl className="menu-list">
                {item
                  .filter(item => !inputValue || item.includes(inputValue))
                  .map((item, index) => (
                    <DownshiftLi
                      {...getItemProps({
                        key: index,
                        index,
                        item,
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? 'lightgray' : 'white',
                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                        },
                      })}
                    >
                      {item}
                    </DownshiftLi>
                  ))}
              </DownshiftUl>
            </div>
          ) : null}
        </div>
      )}
    </Downshift>
  );
}


const DownshiftUl = styled.ul`
  list-style: none !important;
  margin: 0 !important;
  border-left: 1px solid rgb(219, 219, 219);
  border-right: 1px solid rgb(219, 219, 219);
  border-bottom: 1px solid rgb(219, 219, 219);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;
const DownshiftLi = styled.li`
  padding: 0.5em 0.75em;
`;
