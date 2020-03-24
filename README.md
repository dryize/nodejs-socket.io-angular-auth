# nodejs-socket.io-angular-auth

This is a proof of concept product for web socket authentication. 

- NodeJS Typescript project - backend server
- Ionic5/ Angular8 project - fronend client
- Web Socket Authentication - 2 methods are implemented
    1. Authenticate on connect using token in query param
    ![Authenticate on connect](https://github.com/dryize/nodejs-socket.io-angular-auth/raw/master/docs/images/auth%20on%20connect.png)

    2. Authenticate after connected using 'auth' event. Automatically disconnect is not authenticated within x seconds
    ![Authenticate after connect](https://github.com/dryize/nodejs-socket.io-angular-auth/raw/master/docs/images/auth%20after%20connection.png)

# NodeJS Project
- Web Socket connection lifecycle is managed by: src/services/chat.service.ts
- Token generation/ validation managed by: src/services/auth.service.ts

# Angular/ Ionic Project
- Web Socket connection lifecycle is managed by: src/app/services/chat/chat.service.ts
- By default configured to use Auth method 1. Simply remove token from the socket URL for automatic fallback to method 2.


