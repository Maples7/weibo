### /users/register
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

### /users/login
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

## /users/logout
登出 - GET

返回：
{
  "data": "登出成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/info
获取用户信息 - GET

传入(query):    
uid: 被查询用户uid Number

返回：
{
  "data": {
    "uid": 1,
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

## /users/needmail    
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

返回：    
{
  "data": "微博计数更新成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/addgroup    
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

## /users/modgroup    
修改分组信息 - PUT    
（需要登录）

传入(body)：    
old: 要被修改的分组id Number
group: {"name": 分组新名, "description": 分组新描述, "public": 分组公开性}

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

## /users/delgroup    
删除分组 - GET    
（需要登录）

传入（query）：    
gid: 要被删除的分组id Number    

返回：
{
  "data": "删除分组成功",
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/groupdetail    
分组信息 - GET

传入(query):    
gid: 被查询的分组id Number

返回：    
{
  "data": {
    "gid": 3,
    "creator": 1
    "name": "老同学",
    "description": "bob的老同学",
    "public": false,
    "createAt": 2016-08-31 19:00:00,
    "updateAt": 2016-08-31 19:00:00,
    "deleteAt": 0
  },
  "status": {
    "code": 0,
    "msg": "request success!"
  }
}

## /users/groups
全部分组 - GET 

传入