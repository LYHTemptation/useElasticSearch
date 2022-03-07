import ESClient from "../js/connectES.js";

class resultclass{
    async defResult(){
        try{
            const result = await ESClient.search({
                index: 'newsdata',
                from: 0,
                size: 10,
                scroll: '30s',
                body: {
                    query: {
                        match_all:{}
                    }
                },
              });
              return result;
        }catch(err){
            console.error(err);
        }
    }
    
    async bookResult(page){
        try{
            const result = await ESClient.search({
                index: 'my_bookdata',
                from: (page - 1) * 10,
                size: 10,
                _source: ["bookName","bookStatus","registrationNumber","publishingHouse","author","publishedYear"],
                body: {
                    query: {
                        match_all:{}
                    }
                },
              });
              return result;
        }catch(err){
            console.error(err);
        }
    }
}

export default new resultclass;