import express from "express";
import resultclass from "../js/defResult.js";
import defCategory from "../js/groupCategory.js";
import GetNextPageController from "../js/GetNextPageController.js";

const router = express.Router();

router.get('/',(req,res)=>{
    const results = resultclass.defResult();
    let hits, count, category, scroll_id;
    results.then((result)=>{
        if(result != undefined){
            scroll_id = result._scroll_id;
            hits = result.hits.hits;
            count = result.hits.total.value;
        }else{
            hits ={'_source':{'title':'데이터가 없습니다.'}};
        }
    }).then(()=>{
        const categoryResults = defCategory();
        categoryResults.then((result)=>{
            if(result != undefined){
                category = result.aggregations.status_terms.buckets;
            }
            res.render('main',{
                title: 'NodeBird',
                twist: hits,
                category: category,
                count: count,
                scrollId: scroll_id
            })
        })
    }).catch((err)=>{
        console.error(err);
    })
})
router.post('/moreView',(req,res)=>{
    GetNextPageController.getNextPage(req.body.scrollId,res);
});
    

router.get('/book',(req,res,next)=>{
    let page = req.query.page;
    if(!page){
        page=1;
    }
    const results = resultclass.bookResult(page);
    let hits, count, category, scroll_id;
    results.then((result)=>{
        if(result != undefined){
            scroll_id = result._scroll_id;
            hits = result.hits.hits;
            count = result.hits.total.value;
            res.render('bookmain',{
                title: 'NodeBird',
                twist: hits
            })
        }else{
            hits ={'_source':{'title':'데이터가 없습니다.'}};
        }
    })
  })

export default router;