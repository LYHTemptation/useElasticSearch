import ESClient from "../js/connectES.js";

async function groupCategory(){
    try{
        const result = await ESClient.search({
            index: 'newsdata',
            body:{
                query:{
                    match_all:{}
                },
                aggs:{
                    status_terms:{
                        terms:{
                            field:"category",
                            size:1000
                        }
                    }
                }
            }
        })
        return result;
    }catch(err){
        console.error(err);
    }
}
export default groupCategory;