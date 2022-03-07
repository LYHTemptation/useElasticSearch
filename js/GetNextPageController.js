import scrollData from "./search.js";

class GetNextPageController{
    async getNextPage(req,res){
        const nextPage = await req;
        try{
            const resp = await scrollData(nextPage);
            
            let produtos= [];
            resp.hits.hits.map(result => {
                produtos.push({
                    id: result._id,
                    data: result._source
                });
            });
            const pro = {};
            pro.next_page = resp._scroll_id;
            pro.data = produtos;

            return res.status(200).send(pro);
        }catch(err){
            console.error(err);
            return res.status(500).send(err);
        }
    }
}

export default new GetNextPageController;