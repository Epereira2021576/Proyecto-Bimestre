import Product from '../products/products.model.js';
import Bill from './bill.model.js';
import User from '../users/user.model.js';
import Cart from '../cart/cart.model.js';
import jwt from 'jsonwebtoken';
import pdf from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const buyBill = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOne({ name: name });

    if (!user) {
      res.status(404).json({ msg: 'User not found' });
    }

    const secretWord = process.env.JWT_SECRET;
    const xtoken = req.headers.token;
    const token = jwt.verify(xtoken, secretWord);
    const userToken = token.uid;

    if (userToken !== user._id.toString()) {
      res.status(401).json({ msg: 'Unauthorized' });
    }
    const userId = user._id;
    let cartCreate = await Cart.find({ user: userId, status: 'EXISTS' });

    if (cartCreate.length === 0) {
      res.status(400).json({ msg: 'No bills to generate' });
    }

    const billArray = [];
    var Payment = 0;

    for (const carts of cartCreate) {
      Payment = 0;
      const product = await Product.findById(carts.product);
      if (!product) {
        res.status(400).json({ msg: 'Product not found' });
      }
      if (parseInt(carts.quantity) > parseInt(product.stock)) {
        return res
          .status(400)
          .send({ message: `Insufficient stock for product: ${product.name}` });
      }
      const totalProduct = parseInt(carts.quantity) * parseInt(product.price);

      const bill = new Bill({
        emissionDate: new Date(),
        cartData: carts._id,
        totalPrice: totalProduct,
      });
      await bill.save();

      product.stock = parseInt(product.stock) - parseInt(carts.quantity);
      await product.save();

      carts.status = 'PAID';
      await carts.save();

      billArray.push(bill);
      Payment = Payment + parseInt(totalProduct);
    }

    const checkInvoice = './checks';
    if (!fs.existsSync(checkInvoice)) {
      fs.mkdirSync(checkInvoice);
    }
    const checkPath = path.resolve(checkInvoice, `bills_${user.name}.pdf`);
    const check = new pdf();
    check.pipe(fs.createWriteStream(checkPath));

    check
      .font('Times-Roman')
      .fontSize(25)
      .text('Product Billing', { align: 'center' })
      .moveDown();

    for (const billGen of billArray) {
      const cart = await Cart.findById(billGen.cartData).populate('product');
      const total = billGen.totalPrice;

      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();

      check.fontSize(16).text(`Purchase ID: ${cart._id}`).moveDown();
      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();
      check.fontSize(20).text('Products');
      check.moveDown();
      const product = await Product.findById(cart.product);
      check.fontSize(14).text(`Name: ${product.name}`);
      check.moveDown();
      check.fontSize(14).text(`Quantity: ${parseInt(cart.quantity)}`);
      check.moveDown();
      check.fontSize(14).text(`Price: Q.${parseInt(product.price)}`);
      check.moveDown();
      check
        .fontSize(16)
        .text(`Emission Date: ${billGen.emissionDate.toLocaleDateString()}`)
        .moveDown();
      check.moveDown();
      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();
      check.fontSize(16).text(`Grand total: Q.${total}`).moveDown();

      check.moveDown();
    }

    check.fontSize(16).text(`Payment Total: Q.${Payment}`).moveDown();

    check.end();
    res.status(200).sendFile(checkPath);
  } catch (e) {
    console.log('Unexpected error: ', e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const updateBilling = async (req, res) => {
  try {
    const { id } = req.params;
    const { cartQuant } = req.body;
    if (!cartQuant) {
      res.status(400).json({ msg: 'No quantity in request' });
    }

    const bill = await Bill.findById(id);
    if (!bill) {
      res.status(404).json({ msg: 'Bill not found' });
    }
    bill.cartData = bill.cartData.toString();
    const cart = bill.cartData;
    const cartBill = await Cart.findById(cart).populate('product');
    if (!cartBill) {
      res.status(404).json({ msg: 'Cart asociated to this bill not found' });
    }

    const newQuant = cartQuant;
    cartBill.quantity = newQuant;

    await cartBill.save();

    const prodBill = cartBill.product;
    if (newQuant > 0) {
      if (prodBill.stock < newQuant) {
        res.status(400).json({ msg: 'Insufficient stock' });
      }
      prodBill.stock = parseInt(prodBill.stock) - newQuant;
    } else if (newQuant <= 0) {
      prodBill.stock = parseInt(prodBill.stock) - newQuant;
    }

    const newPrice = parseInt(prodBill.price) * parseInt(cartBill.quantity);
    bill.totalPrice = newPrice;
    bill.emissionDate = new Date();

    await prodBill.save();
    await bill.save();

    res.status(201).json({ msg: 'Bill updated', bill });
  } catch (e) {
    console.log('Unexpected error: ', e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const userBillings = async (req, res) => {
  try {
    const { userId } = req.params;

    const userCarts = await Cart.find({ user: userId });

    if (!userCarts) {
      res.status(404).json({ message: 'No carts found' });
    }
    const mapCarts = userCarts.map((carts) => carts._id);

    const checks = await Bill.find({ cartData: mapCarts });

    if (!checks) {
      res.status(404).send({ message: 'Bills don`t  exist' });
    }

    res.status(200).json({ msg: 'Billings found for user', checks });
  } catch (e) {
    console.log('Unexpected error: ', e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
