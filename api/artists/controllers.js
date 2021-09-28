const db = require("../db-connection");

const controllers = {
  getAll: (req, res) => {
    const sql = `SELECT * FROM artists`;

    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message, stack: err.stack });
        return;
      }
      res.json(rows);
    });
  },
  getOne: (req, res) => {
    const { artistId } = req.params;
    const sql = `SELECT * FROM artists WHERE ArtistId = ${artistId}`;
    db.get(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message, stack: err.stack });
        return;
      }
      if (!rows) {
        res.status(400).json({
          message: `there is not a artist with with the given Id: '${artistId}'`,
        });
      }
      res.json(rows);
    });
  },
  create: (req, res) => {
    const { name } = req.body;
    if (!name) {
      res.status(404).json({ message: "Artist name must be provided" });
      return;
    }
    const sql = `INSERT INTO artists (Name) VALUES('${name}')`;
    db.run(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message, stack: err.stack });
        return;
      }
      res
        .status(200)
        .json({ message: `artist: '${name}' created successfully` });
    });
  },
  update: (req, res) => {
    try {
      const { artistId } = req.params;
      const { name, id } = req.body;
      console.log(typeof id, typeof artistId);

      if (artistId !== id) {
        throw Error("Cannot change channel ID after creation!");
      }
      const queryIdString = `SELECT * FROM artists WHERE artistId = ${artistId}`;

      db.get(queryIdString, (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message, stack: err.stack });
          return;
        }

        if (!row) {
          res.status(401).send(`Cannot update artist, id doesn't exist`);
          return;
        }

        const sql = `UPDATE artists
         SET name = "${name}" 
         WHERE ArtistId = ${artistId}`;

        db.run(sql, (err, row) => {
          if (err) {
            res.status(400).json({ error: err.message, stack: err.stack });
            return;
          }

          res.status(200).json({ message: `artist name updated successfully` });
        });
      });
    } catch (err) {
      res.status(500).json({ error: err.message, stack: err.stack });
      err.message;
    }
  },
  delete: (req, res) => {
    try {
      const { artistId } = req.params;
      const queryIdString = `SELECT * FROM artists WHERE ArtistId = ${artistId}`;
      db.get(queryIdString, (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        if (!row) {
          res.status(400).send("Cannot delete artist id doesn't exist");
          return;
        }

        const { Name } = row;

        const sql = `DELETE FROM artists WHERE ArtistId ='${artistId}'`;
        db.all(sql, (err, rows) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res
            .status(200)
            .json({ message: `artist: '${Name}' is successfully deleted` });
        });
      });
    } catch (err) {
      res.status(400).json({ error: err.message, stack: err.stack });
    }
  },
};

module.exports = controllers;
