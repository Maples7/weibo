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

    // 微博相关
    xorParams: [400, 'xorParams', {
        code: 10001,
        msg: 'params must be both void'
    }],

    // 用户相关
    invalidEmail: [400, 'invalidEmail', {
        code: 20001,
        msg: 'invalid email addr'
    }]
}
