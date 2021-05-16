# Backend

Backend of project [healthsys](https://github.com/Ais0n/healthsys).

## Run

```
yarn install
yarn start
```

## Interface

路由和函数的对应关系：

router | get/post | function
:- | :- | :-
/login | post | login
/login | get | getLoginStatus
/register | post | userRegister
/user/updateinfo | post | updateUserInfo
/user/updatepassword | post | updatePassword
/doctor/new | get | queryNewDoctor
/doctor/new | post | approveNewDoctor
/doctor/query | post | queryDoctor
/registration | post | createRegistration
/registration | get | queryRegistrationInfo

## 身份认证

采用 JSON Web Token(JWT) 进行身份认证. 由 login 函数返回一个 token, 有效期暂设为 24h. 在发送后续请求时需要将该 token 放入 req.headers 中，形式为

```json
{ "token": "xxx" }
```

服务器据此进行身份认证.
