const payments = [];

const retryDelays = [2, 5, 10, 20, 30, 60]; // retry delay in minutes

function generateRandomTransaction() {
  const id = Math.floor(Math.random() * 1000);
  const amount = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

  return {
    id,
    amount,
    timestamp: new Date().toISOString(),
    status: 'pending',       // 'pending', 'rejected', 'success'
    attemptCount: 0,         // retry count
    nextAttemptAt: new Date() // ready to process immediately
  };
}

// Simulate incoming transactions every 1 second
setInterval(() => {
  const trx = generateRandomTransaction();
  payments.push(trx);
  console.log("🆕 New transaction added:", trx);
}, 1000);

// Simulate post-success action
function netfeeCustomerRecharge(message) {
  console.log("💸 Recharge processed for trxId:", message.id);
}

// Message processor
function processMessages() {
  const now = new Date();

  // FIFO: Find first eligible message to process
  const nextMessage = payments.find(msg =>
    (msg.status === 'pending' || msg.status === 'rejected') &&
    new Date(msg.nextAttemptAt) <= now
  );

  if (!nextMessage) {
    return; // nothing to process
  }

  const randomNum = Math.floor(Math.random() * 1000);
  console.log(`🔍 Validating trxId: ${nextMessage.id} against random: ${randomNum}`);

  if (nextMessage.id === randomNum) {
    // ✅ Success
    nextMessage.status = 'success';
    console.log("✅ Transaction successful:", nextMessage);
    netfeeCustomerRecharge(nextMessage);
  } else {
    // ❌ Failure - schedule retry
    nextMessage.status = 'rejected';
    nextMessage.attemptCount += 1;

    const delayMinutes = retryDelays[Math.min(nextMessage.attemptCount - 1, retryDelays.length - 1)];
    const retryTime = new Date(Date.now() + delayMinutes * 60 * 1000);
    nextMessage.nextAttemptAt = retryTime;

    console.log(`❌ Validation failed. Retry #${nextMessage.attemptCount} in ${delayMinutes} minutes.`, nextMessage);
  }
}

// Process messages every 3 seconds (demo frequency)
setInterval(processMessages, 3000);
