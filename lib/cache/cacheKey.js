 function genKey(...args) {
    return args.join(':');
}

module.exports = {
    weiboDetail(wbId) {
        return genKey('Weibos', 'Detail', wbId);
    }
}
