const should = require('should');
const weiboService = require('../../services/weibo');

const testData = {
    content: '这里是单元测试',
    author: 'Maples7',
    from: 'VSC'
};

describe('services/weibo.js', () => {
    
    describe('#addWeibo', () => {
        it('should add a new weibo successfully', done => {
            weiboService.addWeibo(testData, {
                commentSync: true
            }).then(result => {
                result.should.be.a.String();
                result.should.deepEqual('操作成功');
                done();
            });
        });
    });

    describe('#getWeiboDetail', () => {
        it('should get weibo detail by id', done => {
            weiboService.getWeiboDetail(1, {
                needOriginalWeiboDetail: true
            }).then(result => {
                result.should.be.an.Object();
                result.author.should.equal('Maples7');
                done();
            });
        });
    });
});