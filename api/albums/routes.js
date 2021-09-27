const controllers = require("./controllers.js");
const express = require("express");

const router = express.Router();

router.get("/", controllers.getAll);

router.get("/:albumId", controllers.getOne);

router.post("/", controllers.create);

router.put("/:albumId", controllers.update);

router.delete("/:albumId", controllers.delete);

module.exports = router;
