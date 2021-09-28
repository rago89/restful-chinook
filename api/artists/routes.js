const controllers = require("./controllers.js");
const express = require("express");

const router = express.Router();

router.get("/", controllers.getAll);

router.get("/:artistId", controllers.getOne);

router.post("/", controllers.create);

router.put("/:artistId", controllers.update);

router.delete("/:artistId", controllers.delete);

module.exports = router;
