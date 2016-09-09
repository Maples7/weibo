// ------------------------------------------------------------------------------------------
// General apiDoc documentation blocks and old history blocks.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Success.
// ------------------------------------------------------------------------------------------

/** 
 * @apiDefine OperationSuccess
 * @apiVersion 0.0.1
 * 
 * @apiSuccessExample {json} Success-Response
 *      HTTP/1.1 200 OK
 *      {
 *        "data": "操作成功",
 *        "status": {
 *          "code": 0,
 *          "msg": "request success!"
 *        }
 *      }
 * @apiSuccessExample {json} Bad-Request
 *      HTTP/1.1 200 OK
 *      {
 *        "data": "用户名已被注册",
 *        "status": {
 *          "code": -1,
 *          "msg": "request success!"
 *        }
 *      }
 */

/**
 * @apiDefine GetWeiboDetailSuccess
 * @apiVersion 0.0.1
 * 
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "data": {
 *          "id": 4,
 *          "author": "Maples7",
 *          "content": "这里是Postman！",
 *          "forwardId": null,
 *          "originalId": null,
 *          "from": "Postman",
 *          "favorCount": 0,
 *          "forwardCount": 0,
 *          "commentCount": 0,
 *          "readCount": 0,
 *          "creatTime": 1472729983964,
 *          "deleteTime": 0
 *        },
 *        "status": {
 *          "code": 0,
 *          "msg": "request success!"
 *        }
 *      }
 *      
 *      HTTP/1.1 200 OK
 *      {
 *        "data": {
 *          "id": 15,
 *          "author": {
 *            "id": 1,
 *            "name": "Maples7",
 *            "email": "maples7@163.com",
 *            "password": "e10adc3949ba59abbe56e057f20f883e",
 *            "headPic": "",
 *            "sex": null,
 *            "bio": "这家伙很懒，什么也没写",
 *            "fansCount": 0,
 *            "followCount": 0,
 *            "weiboCount": 5,
 *            "createTime": 1472702757874,
 *            "emailConfirm": true
 *          },
 *          "content": "这里是Postman转发！",
 *          "forwardId": 4,
 *          "originalId": 4,
 *          "from": "Postman",
 *          "favorCount": 0,
 *          "forwardCount": 0,
 *          "commentCount": 0,
 *          "readCount": 0,
 *          "creatTime": 1472784060949,
 *          "deleteTime": 0,
 *          "originalWeibo": {
 *            "id": 4,
 *            "author": "Maples7",
 *            "content": "这里是Postman！"
 *          }  // 当原微博已被删除时，此字段返回字符串“原微博已删除”
 *        },
 *        "status": {
 *          "code": 0,
 *          "msg": "request success!"
 *        }
 *      }
 */

/**
 * @apiDefine GetCommentsSuccess
 * @apiVersion 0.0.1
 * 
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *        "data": {
 *          "hotComments": [],
 *          "allComments": [
 *            {
 *              "id": 1,
 *              "author": "Maples7",
 *              "weiboId": 4,
 *              "replyId": null,
 *              "content": "这里是Postman转发！",
 *              "favorCount": 0,
 *              "createTime": 1472784061008,
 *              "deleteTime": 0
 *            }
 *          ]
 *        },
 *        "status": {
 *          "code": 0,
 *          "msg": "request success!"
 *        }
 *      }
 */

// ------------------------------------------------------------------------------------------
// Current Errors.
// ------------------------------------------------------------------------------------------

/**
 * @apiIgnore
 * @apiDefine RequestError
 * @apiVersion 0.0.1
 * 
 * @apiError 
 */


// ------------------------------------------------------------------------------------------
// History.
// ------------------------------------------------------------------------------------------



