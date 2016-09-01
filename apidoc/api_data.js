define({ "api": [
  {
    "type": "delete",
    "url": "/comments/:cmId/favor",
    "title": "给某评论消赞",
    "name": "DeleteCommentFavor",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/comments/:cmId/favor"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/weibos/:wbId",
    "title": "删除微博",
    "name": "DeleteWeibo",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/weibos/:wbId"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/weibos/:wbId/favor",
    "title": "给微博消赞",
    "name": "DeleteWeiboFavor",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/weibos/:wbId/favor"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/weibos/:wbId/comments",
    "title": "获取某一微博的评论列表",
    "name": "GetComments",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "description": "<p>注意：只有当offset为0时才会获取热门评论</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "limit",
            "defaultValue": "20",
            "description": "<p>对于所有评论的单次请求条数</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "offset",
            "defaultValue": "0",
            "description": "<p>对于所有评论的偏移量</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "hotLimit",
            "defaultValue": "5",
            "description": "<p>对于热门评论的单次请求条数</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "hotOffset",
            "description": "<p>对于热门评论的偏移量</p>"
          }
        ]
      }
    },
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/weibos/:wbId/comments"
      }
    ]
  },
  {
    "type": "get",
    "url": "/weibos/:wbId",
    "title": "获取微博详情",
    "name": "GetWeiboDetail",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0",
              "1"
            ],
            "optional": true,
            "field": "needUserDetail",
            "description": "<p>是否需要微博作者详情</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0",
              "1"
            ],
            "optional": true,
            "field": "needOriginalWeiboDetail",
            "description": "<p>是否需要原微博详情</p>"
          }
        ]
      }
    },
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/weibos/:wbId"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": {\n    \"id\": 4,\n    \"author\": \"Maples7\",\n    \"content\": \"这里是Postman！\",\n    \"forwardId\": null,\n    \"originalId\": null,\n    \"from\": \"Postman\",\n    \"favorCount\": 0,\n    \"forwardCount\": 0,\n    \"commentCount\": 0,\n    \"readCount\": 0,\n    \"creatTime\": 1472729983964,\n    \"deleteTime\": 0\n  },\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/weibos/:wbId/comments",
    "title": "发表评论",
    "name": "PostComment",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "content",
            "description": "<p>评论内容</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..50",
            "optional": false,
            "field": "from",
            "description": "<p>“来自于”，客户端信息</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "replyId",
            "description": "<p>被回复评论的Id，不传值表明为简单评论</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0",
              "1"
            ],
            "optional": true,
            "field": "forwardSync",
            "description": "<p>是否同时“转发”</p>"
          }
        ]
      }
    },
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/weibos/:wbId/comments"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/comments/:cmId/favor",
    "title": "给某评论点赞",
    "name": "PostCommentFavor",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/comments/:cmId/favor"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/weibos",
    "title": "发表/转发微博",
    "name": "PostWeibo",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..500",
            "optional": false,
            "field": "content",
            "description": "<p>微博内容；如果是转发，则为转发部分的内容</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..50",
            "optional": false,
            "field": "from",
            "description": "<p>“来自于”，客户端信息</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "forwardWbId",
            "description": "<p>转发微博时，直接被转发微博的Id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "originalWbId",
            "description": "<p>转发链顶端的微博id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0",
              "1"
            ],
            "optional": true,
            "field": "commentSync",
            "description": "<p>是否转发微博的同时评论，1是0否</p>"
          }
        ]
      }
    },
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/weibos"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/weibos/:wbId/favor",
    "title": "给微博点赞",
    "name": "PostWeiboFavor",
    "group": "Weibo",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "filename": "controllers/weibo.js",
    "groupTitle": "Weibo",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/weibos/:wbId/favor"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  }
] });
