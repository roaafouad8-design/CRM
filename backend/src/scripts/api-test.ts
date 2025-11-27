import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

async function testRegister() {
  try {
    console.log("Testing Register...");
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
    console.log("Register Response:", response.data);
    return response.data.data.token;
  } catch (error: any) {
    console.error("Register Error:", error.response?.data || error.message);
  }
}

async function testLogin() {
  try {
    console.log("Testing Login...");
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "123456",
    });
    console.log("Login Response:", response.data);
    return response.data.data.token;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
  }
}

async function testCreateSession(token: string | undefined) {
  try {
    if (!token) {
      console.error("No token provided for creating WhatsApp session");
      return;
    }
    console.log("Testing Create WhatsApp Session...");
    const response = await axios.post(
      `${BASE_URL}/whatsapp/session`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Create Session Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Create Session Error:", error.response?.data || error.message);
  }
}

async function testCheckStatus(token: string | undefined) {
  try {
    if (!token) {
      console.error("No token provided for checking WhatsApp status");
      return;
    }
    console.log("Testing Check WhatsApp Status...");
    const response = await axios.get(`${BASE_URL}/whatsapp/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("WhatsApp Status Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("WhatsApp Status Error:", error.response?.data || error.message);
  }
}

async function runTests() {
  // Try login first in case user exists
  let token = await testLogin();

  // If login fails, try register then login again
  if (!token) {
    token = await testRegister();
    if (token) {
      token = await testLogin();
    }
  }

  if (!token) {
    console.error("Failed to get auth token, aborting further tests");
    return;
  }

  await testCreateSession(token);
  await testCheckStatus(token);

  console.log("API tests completed.");
}

runTests();
