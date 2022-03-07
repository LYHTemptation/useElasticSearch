import express from "express";
import defCategory from "../js/groupCategory.js";
import ESClient from "../js/connectES.js";
import resultclass from "../js/defResult.js";
import { paging } from "../js/paging.js";
  
const router = express.Router();
router.use('/book',(req,res,next)=>{
    let page = req.query.page;
    let bookName;
    const countResults = ESClient.count({
        index: 'my_bookdata',
    });
    countResults.then((result)=>{
        const totalCount = result.count;
        const test = paging(page,totalCount);
        console.log(test);
    })
    if(!page){
        page=1;
    }
    if(req.body.searchTitle){
        bookName = req.body.searchTitle; 
    }else if(req.query.bookName){
        bookName = req.query.bookName;
    }
    const results = ESClient.search({
        index: 'my_bookdata',
        from: (page - 1) * 10,
        size: 10,
        body : {
            query:{
                multi_match:{
                    query:bookName,
                    fields: ['bookName^5','bookName.kobrick']
                }
            }
        }
    })
    results.then((result)=>{
        const resultJson = result;
        let hits,count;
        if(resultJson.hits){
            hits = resultJson.hits.hits;
            count = resultJson.hits.total.value;
        }else if(result.status==404){
            hits = resultJson.type;
        }
        res.render('bookmain',{
            title: 'NodeBird',
            twist: hits,
            bookName : bookName
        })
    })
})

router.post('/', (req, res, next) => {
    const title = req.body.searchTitle;
    const subtitle = req.body.searchSubtitle;
    const category = req.body.category;
    let results, hits, count, categorys, scroll_id;
    if(category=='전체'){
        results = ESClient.search({
            index: 'newsdata',
            body: {
                query: {
                    match_all:{}
                }
            },
            size: 10000
        })
    }else if(isEmpty(title) && isEmpty(subtitle)){
        results = ESClient.search({
            index: 'newsdata',
            from:0,
            size:10,
            scroll: '30s',
            body: {
                query: {
                    bool:{
                        must:[
                            {
                                query_string:{
                                    fields: ['title^5','title.kobrick'],
                                    query: title 
                                }
                            },
                            {
                                query_string:{
                                    fields: ['subtitle^5','subtitle.kobrick'],
                                    query: subtitle 
                                }
                            }
                        ]
                    }
                }
            },
        })
    }
    else if(isEmpty(title) || isEmpty(subtitle) || isEmpty(category)){
        results = ESClient.search({
            index: 'newsdata',
            from:0,
            size:10,
            scroll: '30s',
            body: {
                query: {
                    bool:{
                        should:[
                            {
                                query_string:{
                                    fields: ['title^5','title.kobrick'],
                                    query: title 
                                }
                            },
                            {
                                query_string:{
                                    fields: ['subtitle^5','subtitle.kobrick'],
                                    query: subtitle 
                                }
                            }
                        ]
                    }
                }
            },
        })
    }
    else if(category==false){
        results = resultclass.defResult();
    }
    results.then((result) => {
        const resultJson = result;
        if(resultJson.hits){
            scroll_id = resultJson._scroll_id;
            hits = resultJson.hits.hits;
            count = resultJson.hits.total.value;
        }else if(result.status==404){
            hits = resultJson.type;
        }
    }).then(()=>{
        const categoryResults = defCategory();
        categoryResults.then((result)=>{
            if(result != undefined){
                categorys = result.aggregations.status_terms.buckets;
            }
            res.render('main',{
                title: 'NodeBird',
                twist: hits,
                category: categorys,
                count: count,
                scrollId: scroll_id
            })
        })
    })
});
function isEmpty(value){
    if(value == ''){
        return false
    }else{
        return true;
    }
} 

export default router;