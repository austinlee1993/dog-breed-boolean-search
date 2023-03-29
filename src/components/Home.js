import React, {useState} from 'react'
import Papa from 'papaparse';
import DogInfo from './DogInfo';

const Home = () => {
 
 const [isVisible, setIsVisible] = useState(false);
 const [operator, setOperator] = useState('AND');
 const [parsedCsvData, setParsedCsvData] = useState([]);
 const [searchTerms, setSearchTerms] = useState([
    { term: '', field: 'all' },
    { term: '', field: 'all' }
  ]);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setSearchTerms(prevSearchTerms => {
      const updatedSearchTerms = [...prevSearchTerms];
      updatedSearchTerms[index][name] = value;
      return updatedSearchTerms;
    });
  };
    
  const [modalOpen, setModalOpen] = useState(null);

  const openModal = (id) => {     
    setModalOpen(id); // open the modal
  };

  const closeModal = () => {
    setModalOpen(null); // close the modal
  };

  //Fired upon user enters search result - create search query
  const handleSubmit = e => {
    e.preventDefault();
    setIsVisible(true);
    let searchQuery = '';
    searchTerms.forEach((term, index) => {
        const { field, term: searchTerm } = term;
        if (searchTerm) {              
          const formattedSearchTerm = `"${field}":${searchTerm}`
          searchQuery += `${index > 0 ? ` ${operator} ` : ''}${formattedSearchTerm}`;
        }
      });
    getData(searchQuery);
 };
    
 async function getData(searchInput){        
        
    // parse string query more into object from
    const searchObject = parseSearchString(searchInput);       
    
    // parse local CSV file
    const response = await fetch("../../dog_breeds.csv");           
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    const results = Papa.parse(csv, { header: true, }); // object with { data, errors, meta }
        
    //Filter CSV Data based on search query/object 
    const filteredData = results.data.filter(item => {  
        
        let found = false;                        
        for (let field in searchObject) {  
        
        //Field is numerical (i.e Height/Longevity)
        if (field === "Height" || field === "Longevity" || field === "Longevity-1" || field ==="Height-1"){ 
            const current_val = parseInt(searchObject[field]);
            // in case same field was chosen twice
            if (field.includes("-")){                   
                const fields = field.split("-");
                field = fields[0]                       
            }       
            let [min, max] = item[field].split("-");            
            found = (min <= current_val && max >= current_val);
        }
        //Field chosen is "All Fields"
        else if (field.includes("all")){                           
            const keyword = searchObject[field].toLowerCase();
            const dogTerms = Object.values(item).toString().toLowerCase().replace(/,/g, " ").split(' ') 
            found = dogTerms.includes(keyword);   
        }
        else {       
            const fieldTerms = [searchObject[field].toLowerCase()];
            // in case same field was chosen twice
            if (field.includes("-")){                    
                const fields = field.split("-");
                field = fields[0]                       
            }      
            const itemTerms = item[field].toString().toLowerCase().replace(/,/g, " ").split(' ');
            found = fieldTerms.some(term => itemTerms.includes(term))
        }
        
            //Break Loop if one true result if found on OR or one false result on AND
            if (operator === "OR" && found){                
                    break
            }
            else if (operator === "AND" && !found){                 
                    break
            }             
        }
        return found;
    }); 
    //return data that fits the query, sort alphabetically
    setParsedCsvData(filteredData.sort((a,b)=> a['Breed'].localeCompare(b["Breed"])))
}

    //convert search query string into search object
    function parseSearchString(searchString) {
        
        // Regular expression to match the field name and value
        const fieldRegex = /"([\w\s]+)":([\w\d]+)/g;
        const fields = {};
         
        // Loop through each match
        let match;
        while ((match = fieldRegex.exec(searchString))) {
            const fieldName = match[1];
            const value = match[2];
            let idx = 1;
            //in case fields are the same - add a "-1" so no duplicate keys
            if (fieldName in fields){            
                fields[fieldName + `-${idx}`] =`${value}`;            
            } else{
            // Add the field and value to the object
            fields[fieldName] = value;
            }
        }
        return fields
      }
    

    return (
        <div className="container">   
        <div className="search-panel">
            <h2 className="text-center m-3">Dog Breed Boolean Search</h2>
      
      <form>
         <div className="input-row">              
            <label htmlFor="searchTerm1" className="keyword-group-label fw-bold">Keyword</label>
            <input type="text" name="term" className="form-control form-control-sm query-1-input" value={searchTerms[0].term} onChange={event => handleInputChange(event, 0)} />  
            <select id="searchFields" className="form-select form-select-sm query-1-input" value={searchTerms[0].field} onChange={event => handleInputChange(event, 0)} name="field">
            <option value="all">All Fields</option>
            <option value="Country of Origin">Country of Origin</option>
            <option value="Fur Color">Fur Color</option>
            <option value="Height">Height (in)</option>
            <option value="Color of Eyes">Color of Eyes</option>
            <option value="Longevity">Longevity (yrs) </option>
            <option value="Character Traits">Character Traits</option>
            <option value="Common Health Problems">Common Health Problems</option>
            </select>
        </div> 
       
        <div className="input-row">
        <label htmlFor="searchTerm2" className="keyword-group-label fw-bold"> Second Keyword</label>
        <select id="searchFields" value={operator} onChange={(e) => setOperator(e.target.value)} className="form-select form-select-sm query-1-input">
          <option value="AND">AND</option>
          <option value="OR">OR</option>             
        </select>
        <input type="text" name="term" className = "form-control form-control-sm query-1-input" value={searchTerms[1].term} onChange={event => handleInputChange(event, 1)} />
        <select id="searchFields" value={searchTerms[1].field} onChange={event => handleInputChange(event, 1)} name="field" className="form-select form-select-sm query-1-input">
          <option value="all">All Fields</option>
          <option value="Country of Origin">Country of Origin</option>
          <option value="Fur Color">Fur Color</option>
          <option value="Height">Height (in)</option>
          <option value="Color of Eyes">Color of Eyes</option>
          <option value="Longevity">Longevity (yrs) </option>
          <option value="Character Traits">Character Traits</option>
          <option value="Common Health Problems">Common Health Problems</option>
        </select>
        </div>
        <button type="button" onClick={handleSubmit} className = "btn btn-danger">Submit Boolean Search</button>
      </form>
    </div>

  
    <p className={`fw-bold results-count ${isVisible ? 'visible' : 'd-none'}`}>
      { parsedCsvData.length === 0 ? "0 dog breeds found:(" : parsedCsvData.length === 1 
      ? "Displaying 1 Dog Breed:" : "Displaying " + parsedCsvData.length +" dog breeds:"}
    </p>
    
    <div className="search-results">
          {parsedCsvData && 
                parsedCsvData.map((parsedData, index) => (  
                    <div key={index} className='search-result'>
                    <DogInfo isOpen={modalOpen === index} onClose={closeModal}>
                    <h2 className="text-center">{parsedData.Breed} Information</h2> 
                    <hr/>
                    <p><span>Country of Origin: </span>{parsedData['Country of Origin']}</p>
                    <p><span>Fur Color: </span>{parsedData['Fur Color']}</p>
                    <p><span>Height:</span> {parsedData['Height']}(in)</p>
                    <p><span>Color of Eyes:</span> {parsedData['Color of Eyes']}</p>
                    <p><span>Longevity:</span> {parsedData['Longevity']}yrs</p>  
                    <p><span>Character Traits: </span> {parsedData['Character Traits']}</p> 
                    <p><span>Common Health Problems: </span>{parsedData['Common Health Problems']}</p>                  
                    </DogInfo>                    
                    <div className = "dog-card" onClick={() => openModal(index)}>Breed: {parsedData.Breed}
                   
                    </div>                              
                    </div>
                    ))                    
            }                               
        </div>
        </div>
    )
}

export default Home
