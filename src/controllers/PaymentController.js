class PaymentController {
  payment(req, res) {
    res.render('payment');
  }
}

module.exports = new PaymentController();