### /register
注册 - POST

传入(body)：    
name: 用户名 String    
email: 邮箱 String    
password: 密码 String

返回：    
{    
  "data": "注册成功",    
  "status": {    
    "code": 0,    
    "msg": "request success!"    
  }    
}    
{    
  "data": "用户名已被注册",    
  "status": {    
    "code": -1,    
    "msg": "api error"    
  }    
}

### /login
登录 - POST

传入(body)：    
account: 用户名/已验证过的邮箱 String    
password: 密码 String

返回：    
{
  "data": "登录成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
{
  "data": "账号或密码错误",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /logout
登出 - GET

返回：
{
  "data": "登出成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/info/:id
通过id获取用户信息 - GET

返回：
{
  "data": {
    "id": 1,
    "name": "bob",
    "email": "bobmingxie@163.com",
    "password": "e10adc3949ba59abbe56e057f20f883e",
    "headPic": "",
    "sex": true,
    "bio": "Hello World",
    "fansCount": 0,
    "followCount": 15,
    "weiboCount": 0,
    "createTime": 1471867541932,
    "emailConfirm": false
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}     
* 若当前用户查询自己关注的用户且设置了备注，则"data"会多出remark属性，值为查询者对被查者的备注、
     及groups属性，值为含分组名及分组id的JSON数组

## /users/name/:name    
通过name获取用户信息 - GET

返回：
{
  "data": {
    "id": 1,
    "name": "bob",
    "email": "bobmingxie@163.com",
    "password": "e10adc3949ba59abbe56e057f20f883e",
    "headPic": "",
    "sex": true,
    "bio": "Hello World",
    "fansCount": 0,
    "followCount": 15,
    "weiboCount": 0,
    "createTime": 1471867541932,
    "emailConfirm": false
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}     
* 若当前用户查询自己关注的用户且设置了备注，则"data"会多出remark属性，值为查询者对被查者的备注

## /users/acc/:acc
通过name或remark获取用户信息(数组) - GET
(需要登录)

传入(query):
range: 查找范围(全站/全部关注/全部粉丝) 'all'（缺省默认） | 'follow' | 'fans'

返回：


## /users/info
修改用户信息 - PUT
（需要登录）

传入(body): 全为可选
name: 修改后的用户名 String（不可为空）    
headPic: 头像URL String | NULL    
sex: 性别 BOOLEAN | NULL    
bio: 个人简介 String | NULL    

返回：
{
  "data": "信息修改成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* 成功会更新req.session.user

## /users/password
修改密码 - PUT    
（需要登录）

传入(body):
password: 新密码 String    
code: 6位验证码 Number    

返回：
{
  "data": "修改密码成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* 成功会更新req.session.password（加密后的）
* 成功会同时更新验证邮箱属性（为真）

## /users/email    
验证/更改邮箱 - PUT    
（需要登录）

传入(body):
act: 指示操作 'modify' | 'bind' | 'unbind'    
email: 新邮箱（修改邮箱时） | 要被操作的邮箱（绑定/解绑时）
code: 6位验证码 Number （绑定/解绑时需要）

返回：
{
  "data": "邮箱修改成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* 未解绑已验证邮箱时会返回错误**'邮箱已绑定，请解绑后修改'**    
{
  "data": "邮箱验证绑定成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
{
  "data": "邮箱验证解绑成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/email    
发送验证邮件 - GET    
（需要登录）

传入(query)：    
email: 需验证的邮箱 String    

返回：    
{
  "data": "邮件发送成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/weibocount    
更新微博计数 - PUT    
（需要登录）

传入(body)：    
act: 发/删微博 'add' | 'del'
time: 最近微博的发布时间，无微博则为0
t: 事务

返回：    
{
  "data": "微博计数更新成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/group    
新建分组 - POST    
（需要登录）

传入(body):
name: 新分组名 String    
[description: 新分组描述 String]    
[public: 分组公开性 Boolean]    


返回：
{
  "data": "新建分组成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* 若新分组名为'未分组'或'黑名单'，则报错 '不可与固定分组重名'
* 若新分组名已被该用户创建过，则报错 '此分组名已存在'

## /users/group/:gid    
修改分组信息 - PUT    
（需要登录）

传入(body)：    
[name: 分组新名 String]    
[description: 分组新描述 String]    
[public: 分组公开性 Boolean]

返回：    
{
  "data": "修改分组信息成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* 新分组名为固定分组，会报错 '不可与固定分组重名'    
* group中属性名请用双引号括起来，否则会报错 '请规范传入的分组信息，不接收单引号，属性名请用双引号引出'

## /users/group/:gid    
删除分组 - DELETE    
（需要登录）

传入（query）：    
无  

返回：
{
  "data": "删除分组成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/group/:gid    
分组信息 - GET    
（需要登录）

传入(query):    
无

返回：    
{
  "data": {
    "gid": 3,
    "creator": 1
    "name": "老同学",
    "description": "bob的老同学",
    "public": false,
    "count": 0,
    "createAt": 2016-08-31 19:00:00,
    "updateAt": 2016-08-31 19:00:00,
    "deleteAt": 0
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/member/:id/:gid    
分组成员 - GET

传入(query):
[page: 页码]

返回:
{
  "data": { 
    "common": [{
      "id": 1,
      "name": "bob",
      "email": "bobmingxie@163.com",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "headPic": "",
      "sex": true,
      "bio": "Hello World",
      "fansCount": 0,
      "followCount": 15,
      "weiboCount": 0,
      "createTime": 1471867541932,
      "emailConfirm": false
    }],
    "total": 1
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* common 为结果数组，total为总共页数
* 若当前用户查询自己关注的用户且设置了备注，则"data"会多出remark属性，值为查询者对被查者的备注、
      及groups属性，值为含分组名及分组id的JSON数组

## /users/groups/:id
全部分组 - GET 

传入(query):
无

返回：    
{
  "data": [{
    "gid": 3,
    "creator": 1
    "name": "老同学",
    "description": "bob的老同学",
    "public": false,
    "count": 0,
    "createAt": 2016-08-31 19:00:00,
    "updateAt": 2016-08-31 19:00:00,
    "deleteAt": 0,
    "mem": []
  }],
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* 看自己的全部分组会包含'未分组'和'黑名单'在内的非公开非组，会有mem属性，内含至多三个元素，为该分组内头三个成员的个人信息
* 看他人的全部分组只会含公开分组，不含mem属性

## /users/relationship
关注、取关、备注、拉黑、移黑、改组、移粉 - POST    
（需要登录）

传入(body):    
act: 指明操作 'follow' | 'unfollow' | 'remark' | 'black' | 'unblack' | 'regroup' | 'remove'
[follow: 关注/取关/备注/拉黑/移黑/改组 的对象用户id Number]    
[fans: 移粉 的对象用户id Number]    
[groups: 关注/改组 的对象分组id组成的数组 Array]    
[remark: 备注 的对象备注名 String]

返回：

## users/relationship
（全部关注/某分组中）批量管理 - PUT
（需要登录）

传入(body):
act: 操作行为（改组/取关） 'regroup' | 'unfollow'
follow: 被操作的用户id Array
[groups: 改组时需要被分配到的新分组id表 Array]

返回：


## /users/follow/:id
全部关注 - GET

传入(query):
[page: 页码 Number]
[sort: 排序方式（关注时间/粉丝数/互相关注/昵称首字母/最近更新） 'time' | 'fans' | 'each' | 'name' | 'update']

返回：
{
  "data":{ 
    "follow": [{
      "id": 1,
      "name": "bob",
      "email": "bobmingxie@163.com",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "headPic": "",
      "sex": true,
      "bio": "Hello World",
      "fansCount": 0,
      "followCount": 15,
      "weiboCount": 0,
      "createTime": 1471867541932,
      "emailConfirm": false,
      "remark": '',
      "groups": [{id: 3, name: '老同学', description:...}]
    }],
    "total": 1
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* follow 为结果数组，total为总共页数

## /users/fans/:id
全部粉丝 - GET

传入(query):
[page: 页码 Number]
[sort: 排序方式（关注时间/粉丝数/互相关注/我未关注） 'time' | 'fans' | 'each' | 'not']
{
  "data":{ 
    "fans": [{
      "id": 1,
      "name": "bob",
      "email": "bobmingxie@163.com",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "headPic": "",
      "sex": true,
      "bio": "Hello World",
      "fansCount": 0,
      "followCount": 15,
      "weiboCount": 0,
      "createTime": 1471867541932,
      "emailConfirm": false
    }],
    "total": 1
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* fans 为结果数组，total为总共页数

## /users/comfollow/:id
共同关注 - GET
（需要登录）

传入(query):
[page: 页码]

返回：
{
  "data":{ 
    "common": [{
      "id": 1,
      "name": "bob",
      "email": "bobmingxie@163.com",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "headPic": "",
      "sex": true,
      "bio": "Hello World",
      "fansCount": 0,
      "followCount": 15,
      "weiboCount": 0,
      "createTime": 1471867541932,
      "emailConfirm": false
    }],
    "total": 1
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* common 为结果数组，total为总共页数
* 若当前用户查询自己关注的用户且设置了备注，则"data"会多出remark属性，值为查询者对被查者的备注、
      及groups属性，值为含分组名及分组id的JSON数组

## /users/comfans/:id
共同粉丝 - GET
[page: 页码]

传入(query):
无

返回：
{
  "data":{ 
    "common": [{
      "id": 1,
      "name": "bob",
      "email": "bobmingxie@163.com",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "headPic": "",
      "sex": true,
      "bio": "Hello World",
      "fansCount": 0,
      "followCount": 15,
      "weiboCount": 0,
      "createTime": 1471867541932,
      "emailConfirm": false
    }],
    "total": 1
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* common 为结果数组，total为总共页数
* 若当前用户查询自己关注的用户且设置了备注，则"data"会多出remark属性，值为查询者对被查者的备注、
      及groups属性，值为含分组名及分组id的JSON数组

## /users/black    
自己的黑名单 - GET    
（需要登录）

传入(query):
[page: 页码]

返回：
{
  "data":{ 
    "balck": [{
      "id": 1,
      "name": "bob",
      "email": "bobmingxie@163.com",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "headPic": "",
      "sex": true,
      "bio": "Hello World",
      "fansCount": 0,
      "followCount": 15,
      "weiboCount": 0,
      "createTime": 1471867541932,
      "emailConfirm": false
    }],
    "total": 1
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}
* black 为结果数组，total为总共页数

