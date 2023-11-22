// @ts-check
const { test, expect } = require("@playwright/test");

import axios from "axios";

const authCustomer = {
  email: "alvikaajiandrianty@gmail.com",
  password: "alvika123",
};

test("should be able to get wishlist by customer", async ({
  page,
  request,
}) => {
  const response = await request.post(
    "http://localhost:9000/store/auth/token",
    {
      data: authCustomer,
    }
  );
  console.log(await response.json());
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  const token = responseBody.access_token;
  console.log("New Token is: " + token);

  await page.setExtraHTTPHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const responseWishlist = await page.goto(
    `http://localhost:9000/store/wishlist/customer}`
  );
  expect(responseWishlist).toBeTruthy();
});

test("should be able to create a wishlist", async ({ request }) => {
  const loginResponse = await request.post(
    "http://localhost:9000/store/auth/token",
    {
      data: authCustomer,
    }
  );

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody = await loginResponse.json();
  const token = loginResponseBody.access_token;

  expect(token).toBeTruthy();

  const payload = {
    title: "play wright",
    customer_id: "cus_01HFREBVP254QR7E9TQN4G6M8W",
  };

  const response = await axios.post(
    `http://localhost:9000/store/wishlist`,
    payload,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 401) {
    console.log("Unauthorized - Token might be invalid or expired.");
  } else {
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("message", "Success Insert Wishlist");
  }
});

test("should be able to delete a wishlist Name", async ({ request }) => {
  const loginResponse = await request.post(
    "http://localhost:9000/store/auth/token",
    {
      data: authCustomer,
    }
  );

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody = await loginResponse.json();
  const token = loginResponseBody.access_token;

  expect(token).toBeTruthy();

  const wishlistNameId = "wishlistName_01HFVAPG1Z14BX12V7NE4YD2CT";

  try {
    const deleteRequest = await axios.delete(
      `http://localhost:9000/store/wishlist/${wishlistNameId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    expect(deleteRequest.status).toBe(200);
    expect(deleteRequest.statusText).toBe("OK");
    expect(deleteRequest.data).toHaveProperty("message", "Wishlist Deleted");
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    throw error;
  }
});

test("should be able to update a wishlist", async ({ request }) => {
  // Step 1: Login
  const loginResponse = await request.post(
    "http://localhost:9000/store/auth/token",
    {
      data: authCustomer,
    }
  );

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody = await loginResponse.json();
  const token = loginResponseBody.access_token;

  expect(token).toBeTruthy();

  const wishlistNameId = "wishlistName_01HFVASMYQHYFBV6ZFQSMARXM3"; // Change This
  const data = {
    title: "Update By Playwright",
  };

  try {
    const updateRequest = await axios.put(
      `http://localhost:9000/store/wishlist/${wishlistNameId}`,
      data,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    expect(updateRequest.status).toBe(200);
    expect(updateRequest.statusText).toBe("OK");
    expect(updateRequest.data).toHaveProperty("message", "Wishlist Updated");
  } catch (error) {
    console.error("Error updating wishlist:", error);
    throw error;
  }
});

test("should be able to delete a wishlist item", async ({ request }) => {
  const loginResponse = await request.post(
    "http://localhost:9000/store/auth/token",
    {
      data: authCustomer,
    }
  );

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody = await loginResponse.json();
  const token = loginResponseBody.access_token;

  expect(token).toBeTruthy();

  const wishlistItemId = "wishlist_01HFVAG4YFM9YZ8QQ7NZRBAMRR"; // Change This

  try {
    const deleteRequest = await axios.delete(
      `http://localhost:9000/store/wishlist-item/${wishlistItemId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    expect(deleteRequest.status).toBe(200);
    expect(deleteRequest.statusText).toBe("OK");
    const responseBody = deleteRequest.data;
    expect(responseBody).toHaveProperty("message", "Wishlist Item Deleted");
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    throw error;
  }
});

test("should be able to create a wishlist item", async ({ request }) => {
  const loginResponse = await request.post(
    "http://localhost:9000/store/auth/token",
    {
      data: authCustomer,
    }
  );

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const loginResponseBody = await loginResponse.json();
  const token = loginResponseBody.access_token;

  expect(token).toBeTruthy();

  const wishlistNameId = "wishlistName_01HFRGWZA6CVKWW8TG175Y8BQP"; // Change This

  const payload = {
    variant_id: "variant_01HFRFDGZBAR7CM5K3ND9GGJGG",
  };

  try {
    const response = await axios.post(
      `http://localhost:9000/store/wishlist/${wishlistNameId}/wishlist-item`,
      payload,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    expect(response.status).toBe(201);
    const responseBody = response.data;
    expect(responseBody).toHaveProperty(
      "message",
      "Success Insert Wishlist Item"
    );
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    throw error;
  }
});

test("should be able to get all wishlist and wishlist item by admin", async ({
  page,
  request,
}) => {
  const response = await request.post(
    "http://localhost:9000/admin/auth/token",
    {
      data: {
        // change this
        email: "admin@medusa-test.com",
        password: "alvika123",
      },
    }
  );
  console.log(await response.json());
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  const token = responseBody.access_token;
  console.log("New Token is: " + token);

  const customer_id = "cus_01HDVRJGHMVDAMWT73KKHSR9T2"; // change this

  await page.setExtraHTTPHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const responseWishlist = await page.goto(
    `http://localhost:9000/admin/${customer_id}/wishlist`
  );

  expect(responseWishlist).toBeTruthy();
});
