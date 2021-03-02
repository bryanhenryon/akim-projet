const express = require("express");
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

let clientId = "ARrBwGf7HfFOGXrvKTj6-oncPpq_l9ZRkBz4iGfi3KKH2FjvmZaheUK-hesVULH2uTMe2g-9CdEQqbDJ";
let clientSecret = "EOMiHbfANra0mzQ6r9kf3acLnADS7S7rIBlYvLw_MLDzrbMaNHUvoM5LD_ueMc83tCGP6GMAAenqlytL";
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);


router.post("/api/paypal/create-order", async (req, res) => {
      let request = await new paypal.orders.OrdersCreateRequest();
    
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: req.body.price
          },
          payee: {
            email_address: req.body.email
          }
        }]
      });

      let order;
      try {
        order = await client.execute(request);
      } catch (err) {
    
        // 4. Handle any errors from the call
        console.error(err);
        return res.send(500);
      }
    
      // 5. Return a successful response to the client with the order ID
      res.status(200).json({
        orderID: order.result.id
      });     
});

router.post("/api/paypal/capture-order/:orderID", (req, res) => {
  let captureOrder =  async function(orderId) {
    request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    let response = await client.execute(request);
    res.send(response);
}

captureOrder(req.params.orderID); 
});

module.exports = router;