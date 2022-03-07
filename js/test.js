import { paging } from "./paging.js";
import ESClient from "./connectES.js";

const results = ESClient.count({
    index: 'my_bookdata',
});
results.then((result)=>{
    const totalCount = result.count;
})
