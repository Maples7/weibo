// ------------------------------------------------------------------------------------------
// General apiDoc documentation blocks and old history blocks.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Success.
// ------------------------------------------------------------------------------------------

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
 */

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



