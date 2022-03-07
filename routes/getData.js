import express from "express";
import request from "request"
import ESClient from "../js/connectES.js";
import existsIndex from "../js/existsCheck.js";

const router = express.Router();
router.post('/',(req,res)=>{
    const count = req.body.count;
    var url = 'https://api.odcloud.kr/api/15089803/v1/uddi:f2e19df5-046e-47d5-81d0-8aea35ad8a2e';
    var queryParams = '?' + encodeURIComponent('serviceKey') + ''; /* Service Key*/
    queryParams += '&' + encodeURIComponent('page') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('perPage') + '=' + encodeURIComponent(count); /* */
    let status;
    request({
        url: url + queryParams,
        method: 'GET'
    }, (error, response) =>{
      if(error){
        res.status(500).send(error);
      }
        const newsfeed = JSON.parse(response.body);
        const count = newsfeed.currentCount;
        const result = dataProcessing(newsfeed,count);
          status = putNewsfeed(result,count);
          status.then((result)=>{
            if(result == 201){
              res.redirect('/');   
            }
          })
    });
});

function dataProcessing(jsonData,count){
    const objArray = new Array();
    const objDate = new Date(); 
    const year = objDate.getFullYear(); 
    const month = objDate.getMonth() + 1; 
    const date = objDate.getDate();
    const now = `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`; 
    for(let i=0; i<count;i++){
        const data = new Object();
        data.title = jsonData.data[i].기사제목;
        data.subtitle = jsonData.data[i].기사부제목;
        data.createdDate = jsonData.data[i].작성완료일;
        data.category = jsonData.data[i].카테고리;
        if(!data.subtitle){
            data.subtitle = "";
        }else if(!data.createdDate){
            data.adoptDate = now;
        }else if(!data.category){
            data.category = "";
        }
        objArray.push(data); 
    }
    const arrayToJson = JSON.stringify(objArray);
    const parseJson = JSON.parse(arrayToJson);
    return parseJson;
}

  async function putNewsfeed(data,count) {

      await ESClient.indices.create({
        index: 'newsdata',
        body: {
          mappings: {
            properties: {
              title: 
              { type: 'text',
                fields:{
                  keyword:{
                    type: 'text',
                    analyzer: 'keyword'
                },
                  kobrick:{
                    type: 'text',
                    analyzer: 'kobrick'
                  },
                  autocomplete:{
                    type: 'text',
                    analyzer: 'autocomplete'
                  }
                },
              },
              subtitle: 
              { type: 'text',
                fields:{
                  keyword:{
                    type: 'text',
                    analyzer: 'keyword'
                },
                  kobrick:{
                    type: 'text',
                    analyzer: 'kobrick'
                  }
                } 
              },
              createdDate: { type: 'date' },
              category: { type: 'keyword' }
            }
          }
        }
      })
              
      const dataset = data;
    
      const body = dataset.flatMap(doc => [{ index: { _index: 'newsdata' } }, doc])
    
      const bulkresponse = await ESClient.bulk({ refresh: true, body })
      const status = bulkresponse.items[count-1].index.status; 

      return status;

    
    
      // const { body: count } = await ESClient.count({ index: 'newsdata' })
    }
  

export default router;