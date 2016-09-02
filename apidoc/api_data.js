define({ "api": [
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.body.act",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.body.name",
            "description": ""
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "controllers/user.js",
    "group": "E__Maples7_src_weibo_controllers_user_js",
    "groupTitle": "E__Maples7_src_weibo_controllers_user_js",
    "name": ""
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.query.name",
            "description": ""
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "controllers/user.js",
    "group": "E__Maples7_src_weibo_controllers_user_js",
    "groupTitle": "E__Maples7_src_weibo_controllers_user_js",
    "name": ""
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.query.name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.query.group",
            "description": ""
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "controllers/user.js",
    "group": "E__Maples7_src_weibo_controllers_user_js",
    "groupTitle": "E__Maples7_src_weibo_controllers_user_js",
    "name": ""
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.query.name",
            "description": ""
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "controllers/user.js",
    "group": "E__Maples7_src_weibo_controllers_user_js",
    "groupTitle": "E__Maples7_src_weibo_controllers_user_js",
    "name": ""
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.query.name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.query.group",
            "description": ""
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "controllers/user.js",
    "group": "E__Maples7_src_weibo_controllers_user_js",
    "groupTitle": "E__Maples7_src_weibo_controllers_user_js",
    "name": ""
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.query.name",
            "description": ""
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "controllers/user.js",
    "group": "E__Maples7_src_weibo_controllers_user_js",
    "groupTitle": "E__Maples7_src_weibo_controllers_user_js",
    "name": ""
  },
  {
    "type": "put",
    "url": "/users/delgroup",
    "title": "删除分组",
    "name": "DelUserGroup",
    "group": "User",
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
            "type": "number",
            "optional": false,
            "field": "gid",
            "description": "<p>要被删除的分组id</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/delgroup"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/needmail",
    "title": "发起发送邮箱请求",
    "name": "GetUserEmail",
    "group": "User",
    "permission": [
      {
        "name": "anyone"
      }
    ],
    "version": "0.0.1",
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/needmail"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/info",
    "title": "获取用户信息",
    "name": "GetUserInfo",
    "group": "User",
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
            "optional": false,
            "field": "id",
            "description": "<p>被查询用户id</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/info"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/logout",
    "title": "用户登出",
    "name": "GetUserLogout",
    "group": "User",
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
            "optional": false,
            "field": "name",
            "description": "<p>竟然需要前端传用户名才能登出，也是醉了=_=</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/logout"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/addgroup",
    "title": "用户新建分组",
    "name": "PostUserGroup",
    "group": "User",
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
            "optional": false,
            "field": "name",
            "description": "<p>新分组名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "public",
            "description": "<p>分组公开性</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/addgroup"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/login",
    "title": "用户登录",
    "name": "PostUserLogin",
    "group": "User",
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
            "size": "1..50",
            "optional": false,
            "field": "account",
            "description": "<p>用户名或邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..30",
            "optional": false,
            "field": "password",
            "description": ""
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/login"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/users/register",
    "title": "用户注册",
    "name": "PostUserRegister",
    "group": "User",
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
            "size": "1..20",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..50",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..30",
            "optional": false,
            "field": "password",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "headPic",
            "description": "<p>用户头像</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0",
              "1"
            ],
            "optional": true,
            "field": "sex",
            "description": "<p>性别，0男1女，默认为null</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "0..200",
            "optional": true,
            "field": "bio",
            "description": "<p>用户简介</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/register"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/users/email",
    "title": "用户验证邮箱",
    "name": "PutUserEmail",
    "group": "User",
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
            "optional": false,
            "field": "id",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "act",
            "defaultValue": "modify",
            "description": "<p>,'bind','unbind' 修改/绑定/解绑</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..50",
            "optional": false,
            "field": "email",
            "description": "<p>修改时为新邮箱，绑定/解绑时为旧邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..6",
            "optional": false,
            "field": "code",
            "description": "<p>6位验证码</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/email"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/users/modgroup",
    "title": "修改分组信息",
    "name": "PutUserGroup",
    "group": "User",
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
            "type": "Object",
            "optional": false,
            "field": "group",
            "description": "<p>{&quot;name&quot;: 分组新名, &quot;description&quot;: 分组新描述, &quot;public&quot;: 分组公开性}</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "old",
            "description": "<p>要被修改的分组id</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/modgroup"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/users/info",
    "title": "修改用户信息",
    "name": "PutUserInfo",
    "group": "User",
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
            "size": "1..20",
            "optional": true,
            "field": "name",
            "description": "<p>修改后的用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "headPic",
            "description": "<p>头像URL</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "sex",
            "description": "<p>性别</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "0..200",
            "optional": true,
            "field": "bio",
            "description": "<p>个人简介</p>"
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/info"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/users/password",
    "title": "用户修改密码",
    "name": "PutUserPassword",
    "group": "User",
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
            "size": "6..30",
            "optional": false,
            "field": "password",
            "description": "<p>新密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "6..6",
            "optional": false,
            "field": "code",
            "description": ""
          }
        ]
      }
    },
    "filename": "controllers/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://127.0.0.1:3000/users/password"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"操作成功\",\n  \"status\": {\n    \"code\": 0,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  },
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
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
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
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
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
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
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
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
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
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
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
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
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
        },
        {
          "title": "Bad-Request",
          "content": "HTTP/1.1 200 OK\n{\n  \"data\": \"用户名已被注册\",\n  \"status\": {\n    \"code\": -1,\n    \"msg\": \"request success!\"\n  }\n}",
          "type": "json"
        }
      ]
    }
  }
] });