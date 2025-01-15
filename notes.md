# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.tsx           | none              | none         |
| Register new user<br/>(t@jwt.com, pw: test)         | register.tsx       | "/api/auth","POST"| "INSERT INTO user (name, email, password) VALUES (?, ?, ?)" "INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)"            |
| Login new user<br/>(t@jwt.com, pw: test)            | login.tsx          |'/api/auth', 'PUT' |INSERT INTO auth (token, userId) VALUES (?, ?)`              |
| Order pizza                                         | menu.tsx           |'/api/order' 'POST'|INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now()) INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?)             |
| Verify pizza                                        | payment.tsx        |'/api/order/verify', 'POST'|none  |
| View profile page                                   | app.tsx            | none              | none         |
| View franchise<br/>(as diner)                       | franchiseDashboard.tsx| path: string, method: string = 'GET', body?: any| none|
| Logout                                              | logout.tsx         | 'user'            | none         |
| View About page                                     | about.tsx          | none              | none         |
| View History page                                   | history.tsx        | none              | none         |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) | login.tsx          | "/api/auth","POST"| "INSERT INTO auth (token, userId) VALUES (?, ?)"           |
| View franchise<br/>(as franchisee)                  | view.tsx           | "/api/franchise"  | "SELECT id, name FROM franchise", "SELECT id, name FROM store WHERE franchiseId=?"    |
| Create a store                                      | createStore.tsx    | "/api/franchise/${franchise.id}/store`, "POST"  | "INSERT INTO store (franchiseId, name) VALUES (?, ?)" |
| Close a store                                       | closeStore.tsx     |  "/api/franchise/${franchise.id}/store/${store.id}", "DELETE"   | "DELETE FROM store WHERE franchiseId=? AND id=?" |
| Login as admin<br/>(a@jwt.com, pw: admin)           | login.tsx          | '/api/auth', 'PUT'| "INSERT INTO auth (token, userId) VALUES (?, ?)"  |
| View Admin page                                     | adminDashboard.tsx | none              |  none        |
| Create a franchise for t@jwt.com                    | createFranchise.tsx| "/api/franchise", "POST", franchise | "INSERT INTO store (franchiseId, name) VALUES (?, ?)", [franchiseId, store.name]|
| Close the franchise for t@jwt.com                   | closeFranchise.tsx | "/api/franchise/${franchise.id}, "DELETE"| "DELETE FROM store WHERE franchiseId=? AND id=?", [franchiseId, storeId]|
