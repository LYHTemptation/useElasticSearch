import express from "express";
import ESClient from "../js/connectES.js";

const router = express.Router();

router.post('/',(req,res,next)=>{
    ESClient.indices.delete({
        index:'newsdata'
    },function(err,response){
        if(err){
            console.error(err);
        }else{
            res.redirect(req.get('referer'));
        }
    })
})

export default router;