import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('buy pizza with login (API)', async ({ page }) => {
  await page.route('**/version.json', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ version: '20000101.000000' }),
    });
  });
  await page.route('**/api/auth', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      const response = {
        user: {
          name: 'alison honey',
          email: 'alison@gmail.com',
          roles: [{ role: 'diner' }],
          id: 82,
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWxpc29uIGhvbmV5IiwiZW1haWwiOiJhbGlzb25AZ21haWwuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjgyLCJpYXQiOjE3Mzk0ODIyNDl9.sLS12Q-8FSRVAq5PzK29r_kE7yq-vwUe3jiCRQ6rCaM',
      };
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    } else if (method === 'DELETE') {
      const response = {
        message: 'logout successful',
      };
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    } else if (method === 'PUT') {
      const response = {
        user: {
          id: 74,
          name: 'alison honey',
          email: 'alison@gmail.com',
          roles: [{ role: 'diner' }],
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Mzk0ODIyNDl9.l_Izf739ClwEJx70Gu3zKComTomu7uJa2yqbmQpwCFw',
      };
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/order/menu', async (route) => {
    const menuResponse = [
      {
        id: 1,
        title: 'Veggie',
        image: 'pizza1.png',
        price: 0.0038,
        description: 'A garden of delight',
      },
      {
        id: 2,
        title: 'Pepperoni',
        image: 'pizza2.png',
        price: 0.0042,
        description: 'Spicy treat',
      },
      {
        id: 3,
        title: 'Margarita',
        image: 'pizza3.png',
        price: 0.0042,
        description: 'Essential classic',
      },
      {
        id: 4,
        title: 'Crusty',
        image: 'pizza4.png',
        price: 0.0028,
        description: 'A dry mouthed favorite',
      },
      {
        id: 5,
        title: 'Charred Leopard',
        image: 'pizza5.png',
        price: 0.0099,
        description: 'For those with a darker side',
      },
    ];
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(menuResponse),
    });
  });

  await page.route('**/api/franchise', async (route) => {
    const franchiseResponse = [
      {
        id: 1,
        name: 'pizzaPocket',
        stores: [
          {
            id: 1,
            name: 'SLC',
          },
        ],
      },
    ];
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(franchiseResponse),
    });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('alison honey');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('alison@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('abc');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('alison@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('abc');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Pay now' }).click();
});


test('admin (UI)', async ({ page }) => {
  await page.route('**/version.json', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ version: "20000101.000000" }),
    });
  });

  await page.route('**/api/auth', async (route, request) => {
    if (request.method() === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            name: "常用名字",
            email: "a@jwt.com",
            roles: [{ role: "admin" }],
          },
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzM5NTAyMTI4fQ.vtD89snrouqE7IUPttOWqmzBTDPI4ENbU-Xp03xnj3U",
        }),
      });
    } else {
      route.continue();
    }
  });

  await page.route('**/api/order', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        dinerId: 1,
        orders: [
          {
            id: 1,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-14T20:20:31.000Z",
            items: [
              { id: 1, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
          {
            id: 2,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-14T20:20:54.000Z",
            items: [
              { id: 2, menuId: 3, description: "Margarita", price: 0.0042 },
              { id: 3, menuId: 1, description: "Veggie", price: 0.0038 },
              { id: 4, menuId: 2, description: "Pepperoni", price: 0.0042 },
            ],
          },
          {
            id: 3,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-15T03:37:06.000Z",
            items: [
              { id: 5, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
          {
            id: 4,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-15T03:38:13.000Z",
            items: [
              { id: 6, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
          {
            id: 5,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-15T03:51:15.000Z",
            items: [
              { id: 7, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
          {
            id: 6,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-15T03:52:43.000Z",
            items: [
              { id: 8, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
          {
            id: 7,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-15T03:55:11.000Z",
            items: [
              { id: 9, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
          {
            id: 8,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-15T03:58:19.000Z",
            items: [
              { id: 10, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
          {
            id: 9,
            franchiseId: 1,
            storeId: 1,
            date: "2025-01-15T04:02:13.000Z",
            items: [
              { id: 11, menuId: 1, description: "Veggie", price: 0.0038 },
            ],
          },
        ],
        page: 1,
      }),
    });
  });

  // Mock GET and POST /api/franchise
  await page.route('**/api/franchise', async (route, request) => {
    if (request.method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    } else if (request.method() === 'POST') {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          message: "unknown user for franchise admin apple@gmail.com provided",
          stack: "Error: unknown user for franchise admin apple@gmail.com provided\n    at DB.createFranchise (/Users/alexanderueda/Desktop/cs329/jwt-pizza-service/src/database/database.js:166:17)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async /Users/alexanderueda/Desktop/cs329/jwt-pizza-service/src/routes/franchiseRouter.js:91:14",
        }),
      });
    } else {
      route.continue();
    }
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('apple');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('apple@gmail.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'About' }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await page.getByRole('link', { name: 'History' }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByText('Awesome is a click away').click();
});


test('Franchise (UI)', async ({ page }) => {
  await page.route('**/version.json', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ version: "20000101.000000" }),
    });
  });

  await page.route('**/api/auth', async (route, request) => {
    if (request.method() === 'PUT') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 2,
            name: "Franchise User",
            email: "f@jwt.com",
            roles: [{ role: "franchisee", objectId: "1" }],
          },
          token: "fake-franchisee-token",
        }),
      });
    } else {
      route.continue();
    }
  });

  await page.route('**/api/franchise', async (route, request) => {
    if (request.method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: "1",
            name: "Franchise A",
            admins: [{ name: "Franchise Admin" }],
            stores: [
              { id: "3", name: "SLC", totalRevenue: 0 },
              { id: "4", name: "OREM", totalRevenue: 0 }
            ]
          }
        ]),
      });
    } else if (request.method() === 'POST') {
      const postData = await request.postDataJSON();
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: postData.name === 'SLC' ? "3" : "4",
          name: postData.name,
          totalRevenue: 0,
        }),
      });
    } else {
      route.continue();
    }
  });
  await page.route('**/api/menu', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, title: "Veggie", description: "Image Description Veggie", price: 0.0038, image: "veggie.png" },
        { id: 2, title: "Pepperoni", description: "Image Description Pepperoni", price: 0.0042, image: "pepperoni.png" },
        { id: 3, title: "Margarita", description: "Image Description Margarita", price: 0.0040, image: "margarita.png" }
      ]),
    });
  });
  await page.route('**/api/order', async (route, request) => {
    if (request.method() === 'POST') {
      const orderRequest = await request.postDataJSON();
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          order: { ...orderRequest, id: 123 },
          jwt: "fake-order-jwt",
        }),
      });
    } else {
      route.continue();
    }
  });
  await page.route('**/api/logout', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: "Logged out" }),
    });
  });
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});


  test('purchase with login', async ({ page }) => {
    await page.route('*/**/api/order/menu', async (route) => {
      const menuRes = [
        { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
        { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: menuRes });
    });
  
    await page.route('*/**/api/franchise', async (route) => {
      const franchiseRes = [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    });
  
    await page.route('*/**/api/auth', async (route) => {
      const loginReq = { email: 'd@jwt.com', password: 'a' };
      const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
      expect(route.request().method()).toBe('PUT');
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    });
  
    await page.route('*/**/api/order', async (route) => {
      const orderReq = {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
      };
      const orderRes = {
        order: {
          items: [
            { menuId: 1, description: 'Veggie', price: 0.0038 },
            { menuId: 2, description: 'Pepperoni', price: 0.0042 },
          ],
          storeId: '4',
          franchiseId: 2,
          id: 23,
        },
        jwt: 'eyJpYXQ',
      };
      expect(route.request().method()).toBe('POST');
      expect(route.request().postDataJSON()).toMatchObject(orderReq);
      await route.fulfill({ json: orderRes });
    });
  
    await page.goto('/');
  
    await page.getByRole('button', { name: 'Order now' }).click();
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();
  
    await expect(page.getByText('0.008')).toBeVisible();
  });

  test('register new user', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
      const requestData = await route.request().postDataJSON();
      
      const mockResponse = {
        user: {
          id: 100,
          name: 'fakename',
          email: 'fake@jwt.com',
          roles: [{ role: 'diner' }]
        },
        token: 'fake'
      };
  
      if (route.request().method() === 'POST') {
        expect(requestData).toMatchObject({
          name: 'fakename',
          email: 'fake@jwt.com',
          password: 'fake'
        });
  
        await route.fulfill({ json: mockResponse });
      } else {
        await route.continue();
      }
    });
  
    await page.goto('http://localhost:5173/');
    
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('fakename');
    await page.getByRole('textbox', { name: 'Email address' }).fill('fake@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('fake');
    await page.getByRole('button', { name: 'Register' }).click();
  
    await page.getByRole('link', { name: 'f', exact: true }).click();
    await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
    await expect(page.getByRole('main')).toContainText('name:');
    await expect(page.getByRole('main')).toContainText('fake');
    await expect(page.getByRole('main')).toContainText('email:');
    await expect(page.getByRole('main')).toContainText('fake@jwt.com');
    await expect(page.getByRole('main')).toContainText('role:');
    await expect(page.getByRole('main')).toContainText('diner');
    await expect(page.getByRole('main')).toContainText('How have you lived this long without having a pizza? Buy one now!');
    await page.getByRole('link', { name: 'Buy one' }).click();
  });

test('franchise create and delete as admin', async ({ page }) => {
    await page.route('**/version.json', async route => {
        await route.fulfill({
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: "20000101.000000"
            })
        });
    });

    await page.route('**/api/auth', async route => {
        await route.fulfill({
            status: 200,
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user": {
                    "id": 100,
                    "name": "testadmin",
                    "email": "testadmin@test.com",
                    "roles": [
                        {
                            "role": "admin"
                        },
                        {
                            "objectId": 10,
                            "role": "franchisee"
                        },
                    ]
                },
                "token": "testadmin"
            })
        });
    });

    let isFirstGet = true;

    await page.route('**/api/franchise', async route => {
        const method = route.request().method();
        
        if (method === 'GET') {
            if (isFirstGet) {
                await route.fulfill({
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                        'Access-Control-Allow-Origin': 'http://localhost:5173',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([
                        {
                            "id": 20,
                            "name": "testfranchise",
                            "admins": [
                                {
                                    "id": 1,
                                    "name": "testadmin",
                                    "email": "testadmin@test.com"
                                }
                            ],
                            "stores": []
                        },
                        {
                            "id": 16,
                            "name": "kitty",
                            "admins": [
                                {
                                    "id": 1,
                                    "name": "testadmin",
                                    "email": "testadmin@test.com"
                                }
                            ],
                            "stores": []
                        }
                    ])
                });
                isFirstGet = false;
            } else {
                await route.fulfill({
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                        'Access-Control-Allow-Origin': 'http://localhost:5173',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([
                        {
                            "id": 21,
                            "name": "mikan",
                            "admins": [
                                {
                                    "id": 100,
                                    "name": "testadmin",
                                    "email": "testadmin@test.com"
                                }
                            ],
                            "stores": []
                        },
                        {
                            "id": 20,
                            "name": "testfranchise",
                            "admins": [
                                {
                                    "id": 1,
                                    "name": "testadmin",
                                    "email": "testadmin@test.com"
                                }
                            ],
                            "stores": []
                        },
                        {
                            "id": 16,
                            "name": "kitty",
                            "admins": [
                                {
                                    "id": 1,
                                    "name": "testadmin",
                                    "email": "testadmin@test.com"
                                }
                            ],
                            "stores": []
                        }
                    ])
                });
            }
        } else if (method === 'POST') {
            await route.fulfill({
                status: 200,
                headers: {
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": "mikan",
                    "admins": [
                        {
                            "email": "testadmin@test.com",
                            "id": 100,
                            "name": "testadmin"
                        }
                    ],
                    "id": 21
                })
            });
        }
    });

    await page.route('**/api/franchise/21', async route => {
        await route.fulfill({
            status: 200,
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "message": "franchise deleted"
            })
        });
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('testadmin@test.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill('mikan');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('testadmin@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('row', { name: 'mikan testadmin Close' }).getByRole('button').click();
    await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
    await expect(page.getByRole('list')).toContainText('close-franchise');
    await page.getByRole('button', { name: 'Close' }).click();
});

test('create a franchise as an admin', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const requestData = await route.request().postDataJSON();
        const mockResponse = {
            user: {
                id: 100,
                name: 'notfake',
                email: 'notfake@jwt.com',
                roles: [{ role: 'admin' }]
            },
            token: 'notfake'
        };

        if (route.request().method() === 'PUT') {
            expect(requestData).toMatchObject({
                email: 'notfake@jwt.com',
                password: 'notfake'
            });
            await route.fulfill({ json: mockResponse });
        } else {
            await route.continue();
        }
    });

    await page.route('**/api/franchises', async (route) => {
        const requestData = await route.request().postDataJSON();
        const mockFranchiseResponse = {
            id: 1,
            name: 'UVU',
            adminEmail: 'notfake@jwt.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (route.request().method() === 'POST') {
            expect(requestData).toMatchObject({
                name: 'notfake',
                adminEmail: 'notfake@jwt.com'
            });
            await route.fulfill({ json: mockFranchiseResponse });
        } else if (route.request().method() === 'GET') {
            await route.fulfill({ json: [mockFranchiseResponse] });
        } else {
            await route.continue();
        }
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page.getByRole('heading')).toContainText('Welcome back');
    await page.getByRole('textbox', { name: 'Email address' }).fill('notfake@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('notfake');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('list')).toContainText('home');
    await page.getByText('The web\'s best pizza', { exact: true }).click();
    await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
    await expect(page.locator('#navbar-dark')).toContainText('Admin');
    await expect(page.getByLabel('Global')).toContainText('n');
    await page.getByRole('link', { name: 'n', exact: true }).click();
    await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
    await expect(page.getByRole('main')).toContainText('notfake');
    await expect(page.getByRole('main')).toContainText('notfake@jwt.com');
    await expect(page.getByRole('main')).toContainText('admin');
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
    await expect(page.locator('thead')).toContainText('Franchise');
    await expect(page.locator('thead')).toContainText('Franchisee');
    await expect(page.locator('thead')).toContainText('Store');
    await expect(page.locator('thead')).toContainText('Revenue');
    await expect(page.locator('thead')).toContainText('Action');
    await expect(page.getByRole('main')).toContainText('Add Franchise');
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await expect(page.getByRole('list')).toContainText('create-franchise');
    await expect(page.getByRole('heading')).toContainText('Create franchise');
    await expect(page.locator('form')).toContainText('Want to create franchise?');
    await page.getByRole('textbox', { name: 'franchise name' }).fill('UVU');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('notfake@jwt.com');
    await expect(page.locator('form')).toContainText('Create');
    await page.getByRole('button', { name: 'Create' }).click();
});
