import React from 'react';

//Dog Modal for additonal information
function DogInfo(props) {  
  const { isOpen, onClose, children } = props;  
  if (!isOpen) {
    return null; // if the modal is closed, do not render anything
  }
  return (
    <>
      {
          <div className="modal-nb">
           <div className="overlay"></div>
          <div className="modal-content-nb">
          <button type="button" className="btn-close close-modal" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button> 
            {children}
          </div>
        </div>
       }
      </>
  );
}

export default DogInfo;
