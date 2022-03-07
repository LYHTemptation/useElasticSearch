import ESClient from "./connectES.js";

const scrollData = (scroll_id) =>{
    return ESClient.scroll({
        scroll: '1m',
        scrollId: scroll_id
    });
};

export default scrollData;