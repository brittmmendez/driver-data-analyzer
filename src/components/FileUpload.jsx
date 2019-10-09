import React from 'react';
import PropTypes from 'prop-types';
import img from '../static/illustration@2x.png'

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
    <div className="columns">
      <div className="column has-text-centered">
        <img src={img} width="500" alt="group of toolkit items" />
        <label className="fileContainer button" htmlFor="file">
          Upload File
            <div className="control">
            <div className='upload-expense' data-cy="upload-data-btn">
              <input type='file'
                id='file'
                className='input-file'
                accept='.txt'
                onChange={e => handleFileChosen(e.target.files[0])}
              />
            </div>
          </div>
        </label>
      </div>
      <div className="column" data-cy="analyze-directions">
        To get started:
        <ol>
          <li> Click the <strong> Upload File </strong> button</li>
          <li> Select A text file only</li>
        </ol>
      </div>
    </div >
  );
}

ImportFromFileBodyComponent.propTypes = {
  shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
}

export default ImportFromFileBodyComponent;