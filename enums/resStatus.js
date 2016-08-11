module.exports = {
    // 非业务相关
    apiNotFound: [404, 'apiNotFound', {
        code: 1,
        msg: 'API is NOT found'
    }],
    lackParams: [400, 'lackParams', {
        code: 2,
        msg: 'lack necessary parameters'
    }],

    // 业务路逻辑相关，code 前 2 位数表述功能模块，后 3 位数表述具体错误
    xorParams: [400, 'xorParams', {
        code: 10001,
        msg: 'params must be both void'
    }],

    logoutParams: [200, 'logoutParams', {
        code: 20002,
        msg: 'logout successfully'
    }],
    invalidEmail: [400, 'invalidEmail', {
        code: 20001,
        msg: 'invalid email addr'
    }],
    loginParams: [200, 'loginParams', {
        code: 20003,
        msg: 'login successfully'
    }],
    loginFailParams: [400, 'loginFailParams', {
        code: 20004,
        msg: 'login fail'
    }],
    registerParams: [200, 'registerParams', {
        code: 20005,
        msg: 'register successfully'
    }],
    registerFailParams: [400, 'registerFailParams', {
        code: 20006,
        msg: 'register fail'
    }]

}