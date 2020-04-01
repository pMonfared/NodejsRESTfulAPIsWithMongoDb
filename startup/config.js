module.exports = function (config) {
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FETAL ERROR: jwtPrivateKey is not defined.');
    }
}