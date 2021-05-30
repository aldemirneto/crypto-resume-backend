var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var cryptoRouter = require('./routes/crypto');
var cryptoResumeRouter = require('./routes/cryptoResume');
var depositsRouter = require('./routes/deposits');
var withdrawalsRouter = require('./routes/withdrawals')
var rewardsRouter = require('./routes/rewards')
var panelRouter = require('./routes/panel')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/', indexRouter);
app.use('/crypto', cryptoRouter);
app.use('/cryptoresume', cryptoResumeRouter)
app.use('/deposits', depositsRouter)
app.use('/withdrawals', withdrawalsRouter)
app.use('/panel', panelRouter)
app.use('/rewards', rewardsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3300, () => {
  console.info('Server funcionando na porta 3300')
})

module.exports = app;
