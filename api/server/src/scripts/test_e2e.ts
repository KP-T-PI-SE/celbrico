import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Address from '../models/Address';

dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('CELEBRICO END-TO-END AUTOMATED VERIFICATION SUITE');
  console.log('====================================================');

  await connectDB();

  // Drop obsolete legacy indexes if present
  try {
    await mongoose.connection.collection('users').dropIndex('phone_1');
    console.log('Dropped legacy index: phone_1');
  } catch (err) {
    // Index may not exist or already dropped
  }

  // 1. Seed or Verify Customer User
  const custPhone = '9876543210';
  let customer = await User.findOne({ mobileNumber: custPhone });
  if (!customer) {
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash('1234', salt);
    customer = await User.create({
      mobileNumber: custPhone,
      name: 'Dev Customer',
      email: 'dev@celebrico.com',
      pinHash,
      isVerified: true,
      role: 'user',
    });
  } else if (!customer.pinHash) {
    const salt = await bcrypt.genSalt(10);
    customer.pinHash = await bcrypt.hash('1234', salt);
    await customer.save();
  }

  // Seed or Verify Admin User
  const adminPhone = '9999999999';
  let admin = await User.findOne({ mobileNumber: adminPhone });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash('1234', salt);
    admin = await User.create({
      mobileNumber: adminPhone,
      name: 'Super Admin',
      pinHash,
      isVerified: true,
      role: 'admin',
    });
  }

  // 2. HTTP Login as Admin
  console.log('\n[1] Testing Admin Authentication (+91 9999999999)...');
  const adminLoginRes = await fetch(`${API_BASE}/auth/login-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: adminPhone, pin: '1234' }),
  });
  const adminData = await adminLoginRes.json();
  if (!adminData.success || adminData.user.role !== 'admin') {
    throw new Error('Admin login failed: ' + JSON.stringify(adminData));
  }
  const adminToken = adminData.token;
  console.log('  ✓ PASS: Admin logged in successfully with JWT token');

  // 3. HTTP Login as Customer
  console.log('\n[2] Testing Customer Authentication (+91 9876543210)...');
  const custLoginRes = await fetch(`${API_BASE}/auth/login-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: custPhone, pin: '1234' }),
  });
  const custData = await custLoginRes.json();
  if (!custData.success || custData.user.role !== 'user') {
    throw new Error('Customer login failed: ' + JSON.stringify(custData));
  }
  const customerToken = custData.token;
  console.log('  ✓ PASS: Customer logged in successfully with JWT token');

  // 4. Security Check: Customer attempting admin endpoints (403 expected)
  console.log('\n[3] Security Test: Normal customer calling /api/admin/metrics...');
  const forbiddenRes = await fetch(`${API_BASE}/admin/metrics`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  if (forbiddenRes.status === 403) {
    console.log('  ✓ PASS: 403 Forbidden correctly returned to unauthorized user');
  } else {
    throw new Error(`Security violation! Expected 403, got ${forbiddenRes.status}`);
  }

  // 5. Security Check: Unauthenticated request to protected route (401 expected)
  console.log('\n[4] Security Test: Anonymous request calling /api/admin/metrics...');
  const unauthRes = await fetch(`${API_BASE}/admin/metrics`);
  if (unauthRes.status === 401) {
    console.log('  ✓ PASS: 401 Unauthorized correctly returned when token missing');
  } else {
    throw new Error(`Security violation! Expected 401, got ${unauthRes.status}`);
  }

  // 6. Address Management (CRUD with ownership enforcement)
  console.log('\n[5] Testing Address CRUD & User Ownership Isolation...');
  const addAddrRes = await fetch(`${API_BASE}/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      fullName: 'Dev Sharma',
      mobile: '9876543210',
      street: '#108, Temple Bell Way, Malleshwaram',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560003',
      isDefault: true,
    }),
  });
  const addAddrData = await addAddrRes.json();
  if (!addAddrData.success || !addAddrData.data._id) {
    throw new Error('Address creation failed: ' + JSON.stringify(addAddrData));
  }
  const addressId = addAddrData.data._id;
  console.log('  ✓ PASS: Customer address created and marked as default');

  // Test address retrieval
  const getAddrRes = await fetch(`${API_BASE}/addresses`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  const getAddrData = await getAddrRes.json();
  if (!getAddrData.success || getAddrData.count < 1) {
    throw new Error('Failed to retrieve customer addresses');
  }
  console.log(`  ✓ PASS: Retrieved ${getAddrData.count} address(es) for customer`);

  // Test unauthorized address deletion: Admin token cannot delete from customer's personal address route
  const crossDeleteRes = await fetch(`${API_BASE}/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (crossDeleteRes.status === 404) {
    console.log('  ✓ PASS: Cross-account address deletion strictly blocked (ownership enforced)');
  } else {
    throw new Error(`Cross-account security breach! Expected 404, got ${crossDeleteRes.status}`);
  }

  // 7. Security Test: Price Manipulation Attack
  console.log('\n[6] Security Test: Price Tampering Attack during Checkout...');
  const sampleProduct = await Product.findOne({ isActive: true, stock: { $gt: 5 } });
  if (!sampleProduct) throw new Error('No active in-stock product found for testing');

  const expectedUnitPrice =
    sampleProduct.discountPrice && sampleProduct.discountPrice > 0
      ? sampleProduct.discountPrice
      : sampleProduct.price;
  const expectedTotal = expectedUnitPrice + (expectedUnitPrice >= 499 ? 0 : 49);

  // Client attempts to send forged price of ₹1
  const forgedOrderRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      items: [{ productId: sampleProduct._id, quantity: 1, price: 1 }], // Attack: ₹1 forged price
      shippingDetails: {
        fullName: 'Dev Sharma',
        mobile: '9876543210',
        street: '#108, Temple Bell Way',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560003',
      },
      paymentMethod: 'cod',
    }),
  });
  const forgedOrderData = await forgedOrderRes.json();
  if (!forgedOrderData.success) {
    throw new Error('Order creation failed: ' + JSON.stringify(forgedOrderData));
  }

  const createdOrder = forgedOrderData.data;
  if (createdOrder.totalAmount === expectedTotal) {
    console.log(`  ✓ PASS: Client price of ₹1 was REJECTED/IGNORED.`);
    console.log(`  ✓ PASS: Server computed authoritative price: ₹${createdOrder.totalAmount}`);
  } else {
    throw new Error(`Price tampering succeeded! Server charged ₹${createdOrder.totalAmount} instead of ₹${expectedTotal}`);
  }

  // 8. Security Test: Excessive Quantity / Overselling Attack
  console.log('\n[7] Security Test: Stock Overselling Attack (Request > Available Stock)...');
  const oversellRes = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      items: [{ productId: sampleProduct._id, quantity: sampleProduct.stock + 1000 }],
      shippingDetails: {
        fullName: 'Dev Sharma',
        mobile: '9876543210',
        street: '#108, Temple Bell Way',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560003',
      },
      paymentMethod: 'cod',
    }),
  });
  if (oversellRes.status === 400) {
    const errData = await oversellRes.json();
    console.log(`  ✓ PASS: Overselling rejected with message: "${errData.message}"`);
  } else {
    throw new Error(`Overselling succeeded! Expected status 400, got ${oversellRes.status}`);
  }

  // 9. Customer Order History and Details
  console.log('\n[8] Testing Customer Order History & Snapshot Inspection...');
  const myOrdersRes = await fetch(`${API_BASE}/orders/my-orders`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  const myOrdersData = await myOrdersRes.json();
  if (!myOrdersData.success || myOrdersData.count < 1) {
    throw new Error('Failed retrieving customer order history');
  }
  console.log(`  ✓ PASS: Customer successfully fetched ${myOrdersData.count} order(s)`);

  const singleOrderRes = await fetch(`${API_BASE}/orders/${createdOrder.orderNumber}`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  const singleOrderData = await singleOrderRes.json();
  if (!singleOrderData.success || singleOrderData.data.orderNumber !== createdOrder.orderNumber) {
    throw new Error('Failed to retrieve single order by orderNumber');
  }
  console.log(`  ✓ PASS: Order ${createdOrder.orderNumber} retrieved with complete price snapshot`);

  // 10. Admin Order Fulfillment & Status Machine
  console.log('\n[9] Testing Admin Order Management & Lifecycle Transition...');
  const advanceRes = await fetch(`${API_BASE}/admin/orders/${createdOrder._id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'shipped',
      note: 'Dispatched via express temple delivery rider',
    }),
  });
  const advanceData = await advanceRes.json();
  if (!advanceData.success || advanceData.data.orderStatus !== 'shipped') {
    throw new Error('Failed to advance order status: ' + JSON.stringify(advanceData));
  }
  console.log('  ✓ PASS: Admin advanced order status: processing -> shipped');

  // Verify Customer sees the updated status
  const customerUpdatedRes = await fetch(`${API_BASE}/orders/${createdOrder._id}`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  const customerUpdatedData = await customerUpdatedRes.json();
  if (customerUpdatedData.data.orderStatus === 'shipped') {
    console.log('  ✓ PASS: Customer sees real-time status update: "shipped"');
  } else {
    throw new Error(`Status synchronization failure. Status was: ${customerUpdatedData.data.orderStatus}`);
  }

  // 11. Admin Product Management & Storefront Synchronization
  console.log('\n[10] Testing Admin Product Price Update & Storefront Sync...');
  const originalPrice = sampleProduct.price;
  const testNewPrice = originalPrice + 150;

  const updateProductRes = await fetch(`${API_BASE}/admin/products/${sampleProduct._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ price: testNewPrice }),
  });
  const updateProductData = await updateProductRes.json();
  if (!updateProductData.success || updateProductData.data.price !== testNewPrice) {
    throw new Error('Failed updating product price');
  }

  // Customer fetches product
  const customerProdRes = await fetch(`${API_BASE}/products/${sampleProduct._id}`);
  const customerProdData = await customerProdRes.json();
  if (customerProdData.data.price === testNewPrice) {
    console.log(`  ✓ PASS: Customer immediately sees updated price: ₹${testNewPrice}`);
  } else {
    throw new Error(`Price sync failed. Customer saw: ₹${customerProdData.data.price}`);
  }

  // Revert product price back to original
  await fetch(`${API_BASE}/admin/products/${sampleProduct._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ price: originalPrice }),
  });
  console.log(`  ✓ PASS: Restored product price to original ₹${originalPrice}`);

  // 12. Admin Metrics
  console.log('\n[11] Testing Admin KPI Metrics...');
  const metricsRes = await fetch(`${API_BASE}/admin/metrics`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const metricsData = await metricsRes.json();
  if (!metricsData.success) throw new Error('Failed retrieving admin metrics');

  console.log('  ✓ PASS: Admin Metrics successfully calculated from MongoDB:');
  console.log(`     - Total Orders: ${metricsData.data.totalOrders}`);
  console.log(`     - Pending Orders: ${metricsData.data.pendingOrders}`);
  console.log(`     - Completed Orders: ${metricsData.data.completedOrders}`);
  console.log(`     - Active Products: ${metricsData.data.activeProducts}`);
  console.log(`     - Registered Customers: ${metricsData.data.totalCustomers}`);

  // 13. WhatsApp status tracking
  console.log('\n[12] Testing WhatsApp Dispatch Tracking...');
  const waRes = await fetch(`${API_BASE}/orders/${createdOrder._id}/whatsapp-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({ status: 'dispatched' }),
  });
  const waData = await waRes.json();
  if (waData.success && waData.data.whatsappStatus === 'dispatched') {
    console.log('  ✓ PASS: WhatsApp dispatch status recorded as "dispatched"');
  } else {
    throw new Error('WhatsApp status update failed: ' + JSON.stringify(waData));
  }

  console.log('\n====================================================');
  console.log('ALL 12 PRODUCTION & SECURITY TEST SCENARIOS PASSED!');
  console.log('====================================================\n');

  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:', err);
  process.exit(1);
});
