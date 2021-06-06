# Backend

Backend of project [healthsys](https://github.com/Ais0n/healthsys).

## Available Script

### `yarn install`

Install the dependencies.

### `yarn start`

Run the app on `localhost:3000`.

### `yarn deploy`

Deploy on server using pm2. The app will be daemonized, monitored and kept alive forever.

## Interface

路由和函数的对应关系：

router | get/post | function
:- | :- | :-
/login | post | login
/login | get | getLoginStatus
/logout | get | logout
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

服务端据此进行身份认证.
