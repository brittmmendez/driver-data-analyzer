import React from 'react';
import PropTypes from 'prop-types';

const ImportFromFileBodyComponent = (props) => {
  let fileReader;
  const { shop } = props

  const handleFileRead = (e) => {
    const content = fileReader.result;
    const contentArray = content.split(/(\r\n|\n|\r)/gm)

    shop.analyzeData(contentArray)
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div className='upload-expense'>
      <input type='file'
        id='file'
        className='input-file'
        accept='.txt'
        onChange={e => handleFileChosen(e.target.files[0])}
      />
    </div>
  );
}

ImportFromFileBodyComponent.propTypes = {
  shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
}

export default ImportFromFileBodyComponent;