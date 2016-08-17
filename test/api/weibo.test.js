const should = require('should');
const request = require('supertest');
const _ = require('lodash');
const app = require('../../app');

const testData = {
    content: '这里是单元测试',
    from: 'Auto Test',
    author: 'Maples7'
};

describe('Weibo APIs', () => {

    let cookie;

    before(done => {
        // 登录测试用户，并保存 cookie
        request(app)
            .post('/users/login')
            .type('form')
            .set('Accept', /application\/json/)
            .set('Content-Type', 'application/json')
            .send({
                name: testData.author,
                password: '123456'
            })
            .expect(200)
            .end((err, res) => {
                cookie = res.headers['set-cookie'];
                done();
            });
    });

    describe('# POST /weibos', () => {
        it('should add a new weibo successfully', done => {
            request(app)
                .post('/weibos')
                .type('form')
                .set('Accept', /application\/json/)
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
                .send(testData)
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(res => {
                    if (res.body.data !== '操作成功') throw new Error('返回值不正确');
                }).end(done);
        });
    });

    describe('# GET /weibos/:wbId', () => {
        it('should get weibo detail by id', done => {
            request(app)
                .get('/weibos/2?needUserDetail=1&needOriginalWeiboDetail=1')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(res => {
                    if (!_.isPlainObject(res.body.data) || res.body.status.code !== 0) {
                        throw new Error('返回值不正确');
                    } 
                }).end(done);

        });
    });

    // describe('# deleteWeibo', () => {
        
    // });

});