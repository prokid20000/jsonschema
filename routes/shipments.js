"use strict";

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const orderSchema = require("../schema/orderSchema.json");

const { shipProduct } = require("../shipItApi");

/** POST /shipments
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body.order, orderSchema);
  if(!result.valid){
    let errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }
  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});


module.exports = router;