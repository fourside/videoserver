import * as React from 'react';
import Downshift from 'downshift';

export default ({className, name, placeholder, onChange, item}) => {

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
            placeholder={placeholder}
          />
          { isOpen ? (
            <div>
              {item
                .filter(item => !inputValue || item.includes(inputValue))
                .map((item, index) => (
                  <div
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
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
    </Downshift>
  );
}
