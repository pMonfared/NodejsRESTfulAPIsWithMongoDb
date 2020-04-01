const helmet = required('helmet');
const compression = required('compression');

module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
}