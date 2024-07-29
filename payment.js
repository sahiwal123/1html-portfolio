document.querySelector('#payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cardName = document.querySelector('#card-name').value;
    const cardNumber = document.querySelector('#card-number').value;
    const cardExpiry = document.querySelector('#card-expiry').value;
    const cardCvc = document.querySelector('#card-cvc').value;

    // Mock payment processing
    const paymentResult = await processPayment(cardNumber, cardExpiry, cardCvc);

    if (paymentResult.success) {
        alert('Payment successful!');
        $('#paymentModal').modal('hide');
        // Optionally, clear the cart and total price
        cart = [];
        document.querySelector('#cart-items').innerHTML = '';
        document.querySelector('#total-price').textContent = '0.00';
    } else {
        alert('Payment failed. Please try again.');
    }
});

async function processPayment(cardNumber, cardExpiry, cardCvc) {
    // Replace with real payment processing logic
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
}
