import ESClient from "./connectES.js";

function existsIndex() {
    const results =  ESClient.indices.exists({index: 'newsdata'});
    results.then(result=>{
      console.log(result);
        return result;
    })
  }
  
export default existsIndex;