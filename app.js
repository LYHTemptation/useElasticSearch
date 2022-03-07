import express from "express";
import morgan from "morgan";
import path from "path";
import nunjucks from "nunjucks";
import dotenv from "dotenv";

dotenv.config();
import pageRouter from "./routes/page.js";
import getRouter from "./routes/getData.js";
import deleteRouter from "./routes/delete.js";
import searchRouter from "./routes/getESdata.js";

const app = express();


app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

const __dirname = path.resolve();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', pageRouter);

app.use('/getData', getRouter);

app.use('/deleteData',deleteRouter);

app.use('/searchFeed', searchRouter);

app.use((req, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});



// router.get('/page/:page',function(req,res,next)
// {
//     var page = req.params.page;
//     var sql = "select idx, name, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
//         "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate,hit from board";
//     conn.query(sql, function (err, rows) {
//         if (err) console.error("err : " + err);
//         res.render('page', {title: ' 게시판 리스트', rows: rows, page:page, length:rows.length-1, page_num:10, pass:true});
//         console.log(rows.length-1);
//     });
// });

