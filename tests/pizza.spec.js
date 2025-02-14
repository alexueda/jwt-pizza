import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('buy pizza with login (API)', async ({ page }) => {
  // version.json のモック
  await page.route('**/version.json', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ version: '20000101.000000' }),
    });
  });

  // /api/auth のモック（メソッドに応じたレスポンスを返す）
  await page.route('**/api/auth', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      // Register 時の認証
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
      // Logout のモック
      const response = {
        message: 'logout successful',
      };
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    } else if (method === 'PUT') {
      // Login のモック
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
      // 他のメソッドの場合はそのまま通す
      await route.continue();
    }
  });

  // /api/order/menu のモック
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

  // /api/franchise のモック
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

  // テスト開始：各操作を実行
  await page.goto('http://localhost:5173/');

  // Register フロー
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('alison honey');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('alison@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('abc');
  await page.getByRole('button', { name: 'Register' }).click();

  // Logout フロー
  await page.getByRole('link', { name: 'Logout' }).click();

  // Login フロー
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('alison@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('abc');
  await page.getByRole('button', { name: 'Login' }).click();

  // Order フロー
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Pay now' }).click();
});


test('admin (UI)', async ({ page }) => {
  // Mock version.json
  await page.route('**/version.json', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ version: "20000101.000000" }),
    });
  });

  // Mock PUT /api/auth for login
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

  // Mock GET /api/order (order history)
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

  // Now run your UI actions.
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
  // Optionally, if the UI requires a second click on Create (for example, a confirmation)
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
  // --- MOCK ENDPOINTS ---

  // version.json
  await page.route('**/version.json', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ version: "20000101.000000" }),
    });
  });

  // Login: PUT /api/auth for franchisee credentials
  await page.route('**/api/auth', async (route, request) => {
    if (request.method() === 'PUT') {
      // If login credentials match franchisee, return a franchisee user
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 2,
            name: "Franchise User",
            email: "f@jwt.com",
            // Include an objectId (franchise id) for franchisee users
            roles: [{ role: "franchisee", objectId: "1" }],
          },
          token: "fake-franchisee-token",
        }),
      });
    } else {
      route.continue();
    }
  });

  // GET /api/franchise: Return the franchise details including stores
  await page.route('**/api/franchise', async (route, request) => {
    if (request.method() === 'GET') {
      // Return a franchise with two stores: SLC and OREM
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: "1",
            name: "Franchise A",
            admins: [{ name: "Franchise Admin" }],
            stores: [
              // We'll simulate that after store creation, these stores exist.
              { id: "3", name: "SLC", totalRevenue: 0 },
              { id: "4", name: "OREM", totalRevenue: 0 }
            ]
          }
        ]),
      });
    } else if (request.method() === 'POST') {
      // POST for store creation
      // (In a real app, you'd inspect the request body. Here we return a success response.)
      const postData = await request.postDataJSON();
      // For example, if the store name is SLC, return id "3", else "4".
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

  // GET /api/menu: Return a sample menu with a few pizzas
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

  // POST /api/order: Simulate a successful order checkout
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

  // GET /api/logout: Simulate logging out
  await page.route('**/api/logout', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: "Logged out" }),
    });
  });

  // --- UI ACTIONS ---

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  // Click the Franchise link (assumed to be inside a Global navigation container)
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  // Go to the Order page and select a store from the combobox
  await page.getByRole('link', { name: 'Order' }).click();

  // Finally, log out
  await page.getByRole('link', { name: 'Logout' }).click();
});


