const express = require("express");
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
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
        console.error(err);
        return res.send(500);
      }
    
      res.status(200).json({
        orderID: order.result.id
      });     
});

router.post("/api/paypal/capture-order/:orderID", (req, res) => {
  let captureOrder =  async function(orderId) {
    try {
      request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      let response = await client.execute(request);
      res.send(response);
    } catch (error) {
      res.send(error);
      console.log(error);
    }
}

captureOrder(req.params.orderID); 
});

module.exports = router;