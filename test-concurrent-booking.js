// Test script for concurrent booking (double-booking prevention)
// Run this after starting the server to verify race condition protection

const axios = require('axios');

const API_URL = 'http://localhost:3001/api/bookings';

// Test configuration
const TEST_CONFIG = {
  experienceId: '676a71ae86e4de02ba51afef', // Replace with actual ID from your DB
  date: '2025-01-15',
  time: '09:00 AM',
  simultaneousRequests: 5, // Number of concurrent booking attempts
  spotsPerRequest: 1, // How many spots each request tries to book
};

async function testConcurrentBooking() {
  console.log('🧪 Testing Concurrent Booking Prevention\n');
  console.log('Configuration:');
  console.log(`- Simultaneous requests: ${TEST_CONFIG.simultaneousRequests}`);
  console.log(`- Spots per request: ${TEST_CONFIG.spotsPerRequest}`);
  console.log(`- Total attempted spots: ${TEST_CONFIG.simultaneousRequests * TEST_CONFIG.spotsPerRequest}`);
  console.log(`- Expected: Only available spots should be booked\n`);

  // Create booking payload
  const createBookingPayload = (index) => ({
    experienceId: TEST_CONFIG.experienceId,
    userName: `Test User ${index}`,
    userEmail: `testuser${index}@example.com`,
    date: TEST_CONFIG.date,
    time: TEST_CONFIG.time,
    quantity: TEST_CONFIG.spotsPerRequest,
    totalPrice: 1000 * TEST_CONFIG.spotsPerRequest,
  });

  // Create array of promises for concurrent requests
  const bookingPromises = Array.from(
    { length: TEST_CONFIG.simultaneousRequests },
    (_, index) => {
      const payload = createBookingPayload(index + 1);
      return axios
        .post(API_URL, payload)
        .then((response) => ({
          success: true,
          user: `User ${index + 1}`,
          bookingRef: response.data.bookingRef,
          data: response.data,
        }))
        .catch((error) => ({
          success: false,
          user: `User ${index + 1}`,
          error: error.response?.data?.message || error.message,
        }));
    }
  );

  console.log('🚀 Sending concurrent booking requests...\n');

  try {
    // Execute all requests concurrently
    const results = await Promise.all(bookingPromises);

    // Analyze results
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log('📊 Results:\n');
    console.log(`✅ Successful bookings: ${successful.length}`);
    successful.forEach((result) => {
      console.log(`   - ${result.user}: Booking Ref ${result.bookingRef}`);
    });

    console.log(`\n❌ Failed bookings: ${failed.length}`);
    failed.forEach((result) => {
      console.log(`   - ${result.user}: ${result.error}`);
    });

    console.log('\n🎯 Analysis:');
    if (successful.length > 0 && failed.length > 0) {
      console.log('✅ PASS: Some bookings succeeded, others failed as expected');
      console.log('✅ No double-booking detected!');
    } else if (successful.length === TEST_CONFIG.simultaneousRequests) {
      console.log('⚠️  WARNING: All bookings succeeded');
      console.log('   Check if enough spots were available');
    } else if (successful.length === 0) {
      console.log('❌ FAIL: All bookings failed');
      console.log('   Check if the experience/slot exists and has spots available');
    }

    console.log('\n💡 Recommendation:');
    console.log('   - Verify the database to ensure spotsLeft matches successful bookings');
    console.log('   - Check that no negative spot counts exist');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Additional test: Sequential bookings
async function testSequentialBooking() {
  console.log('\n\n🧪 Testing Sequential Booking\n');

  for (let i = 1; i <= 3; i++) {
    try {
      const payload = {
        experienceId: TEST_CONFIG.experienceId,
        userName: `Sequential User ${i}`,
        userEmail: `sequential${i}@example.com`,
        date: TEST_CONFIG.date,
        time: TEST_CONFIG.time,
        quantity: 1,
        totalPrice: 1000,
      };

      const response = await axios.post(API_URL, payload);
      console.log(`✅ Booking ${i}: Success - Ref ${response.data.bookingRef}`);
    } catch (error) {
      console.log(`❌ Booking ${i}: Failed - ${error.response?.data?.message || error.message}`);
    }

    // Small delay between bookings
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Run tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  DOUBLE-BOOKING PREVENTION TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Test 1: Concurrent booking
    await testConcurrentBooking();

    // Test 2: Sequential booking
    await testSequentialBooking();

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  TESTS COMPLETED');
    console.log('═══════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('Test suite error:', error);
  }
}

// Instructions
console.log('\n⚠️  BEFORE RUNNING THIS TEST:\n');
console.log('1. Make sure the server is running (npm run dev in server folder)');
console.log('2. Update TEST_CONFIG.experienceId with a valid ID from your database');
console.log('3. Ensure the selected date/time slot has limited spots (e.g., 2-3 spots)');
console.log('4. Run: node test-concurrent-booking.js\n');

// Uncomment to run automatically
// runAllTests();

module.exports = { runAllTests, testConcurrentBooking, testSequentialBooking };
