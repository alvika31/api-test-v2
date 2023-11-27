// @ts-check
const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

const resultRandom = Math.random().toString(36).substring(2, 7);

const payloadCustomer = {
  email: `${resultRandom}@example.com`,
  password: `${resultRandom}`,
};

const authCustomer = {
  email: payloadCustomer.email,
  password: payloadCustomer.password,
};

const payloadAdmin = {
  email: `admin@medusa-test.com`, // replace with the correct admin login data
  password: `password`, // replace with the correct admin login data
};

let token;
let tokenAdmin;
let wishlist_name_id;
let wishlist_id;

test.use({
  baseURL: "http://localhost:9000",
  extraHTTPHeaders: {
    Accept: "application/json",
    Authorization: `token ${process.env.API_TOKEN}`,
  },
});

test.beforeAll(async ({ request }) => {
  // Register Customer
  const responseCustomer = await request.post("/store/customers", {
    data: payloadCustomer,
  });
  expect(responseCustomer.ok()).toBeTruthy();

  // Login Customer
  const responseLogin = await request.post("/store/auth/token", {
    data: authCustomer,
  });
  expect(responseLogin.ok()).toBeTruthy();
  const loginResponseBody = await responseLogin.json();
  token = loginResponseBody.access_token;

  // Login Admin
  const responseLoginAdmin = await request.post("/admin/auth/token", {
    data: payloadAdmin,
  });
  expect(responseLoginAdmin.ok()).toBeTruthy();
  const loginResponseAdminBody = await responseLoginAdmin.json();
  tokenAdmin = loginResponseAdminBody.access_token;
});

test.beforeEach(async ({ request }) => {
  const responseWishlist = await request.get(`/store/wishlist/customer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(responseWishlist).toBeTruthy();
  const wishlist = await responseWishlist.json();
  wishlist_name_id = wishlist.wishlist[0]?.id;
});

test("should be able to create a wishlist", async ({ request }) => {
  const payload = {
    title: "play wright",
  };

  const response = await request.post(`/store/wishlist`, {
    data: payload,
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(response.status()).toBe(201);
  expect(response).toBeTruthy();
});

test("should be able to get wishlist by customer", async ({ request }) => {
  const responseWishlist = await request.get(`/store/wishlist/customer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(responseWishlist).toBeTruthy();
  const wishlist = await responseWishlist.json();
});

test("should be able to create a wishlist item", async ({ request }) => {
  const payload = {
    variant_id: `variant_01HG004GJQR58TSZV2HPFW5SA7`,
  };
  const response = await request.post(
    `/store/wishlist/${wishlist_name_id}/wishlist-item`,
    {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  expect(response.status()).toBe(201);
  expect(response).toBeTruthy();
});

test("should be able to update a wishlist", async ({ request }) => {
  const data = {
    title: "Update By Playwright",
  };

  const updateRequest = await request.put(
    `/store/wishlist/${wishlist_name_id}`,
    {
      data,
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  expect(updateRequest.status()).toBe(200);
  expect(updateRequest).toBeTruthy();
});
test("should be able to delete a wishlist item", async ({ request }) => {
  const responseWishlist = await request.get(`/store/wishlist/customer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(responseWishlist).toBeTruthy();
  const wishlist = await responseWishlist.json();
  wishlist_id = wishlist.wishlist[0]?.wishlists[0]?.id;
  const id = wishlist_id;
  const deleteRequest = await request.delete(`/store/wishlist-item/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(deleteRequest.status()).toBe(200);
  expect(deleteRequest).toBeTruthy();
});

test("should be able to delete a wishlist Name", async ({ request }) => {
  const deleteRequest = await request.delete(
    `/store/wishlist/${wishlist_name_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  expect(deleteRequest.status()).toBe(200);
  expect(deleteRequest).toBeTruthy();
});

test("should be able to get all wishlist and wishlist item by admin", async ({
  request,
}) => {
  const customerlist = await request.get(`/admin/customers`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  const customer = await customerlist.json();
  const customer_id = customer.customers[0]?.id;
  const responseWishlist = await request.get(`/admin/${customer_id}/wishlist`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });

  expect(responseWishlist.status()).toBe(200);
  expect(responseWishlist).toBeTruthy();
});

test("should be able to get count product in wishlist customer", async ({
  request,
}) => {
  const productlist = await request.get(`/admin/products`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  const product = await productlist.json();
  const product_id = product.products[0]?.id;

  const responseWishlist = await request.get(
    `/admin/${product_id}/count/wishlist`,
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    }
  );
  expect(responseWishlist.status()).toBe(200);
  expect(responseWishlist).toBeTruthy();
});
