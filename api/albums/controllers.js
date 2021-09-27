const db = require("../db-connection");

const controllers = {
  getAll: (req, res) => {
    const sql = `SELECT * FROM albums`;
    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      res.json(rows);
    });
  },
  getOne: (req, res) => {
    const { albumId } = req.params;
    const sql = `SELECT * FROM albums WHERE albums.AlbumId = ${albumId}`;
    db.get(sql, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (row === undefined) {
        res
          .status(401)
          .json({ message: `album with the given id doesn't exist` });
        return;
      }

      res.json(row);
    });
  },

  create: async (req, res) => {
    const { title, artistId } = req.body;
    const countAlbumsSql = `SELECT COUNT(*) FROM albums`;
    db.all(countAlbumsSql, async (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const newId = (await row[0]["COUNT(*)"]) + 1;
      const sql = `INSERT INTO albums VALUES("${newId}", "${title}", "${artistId}")`;
      db.run(sql);
      await res.send(`album with id: ${newId} successfully added`);
    });
  },
  update: async (req, res) => {
    try {
      const { albumId } = req.params;
      const { id, title, artistId } = req.body;

      if (id !== albumId) {
        throw Error("Cannot change channel ID after creation!");
      }

      const queryIdString = `SELECT * FROM albums WHERE albums.AlbumId = ${albumId}`;
      db.get(queryIdString, (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        if (row === undefined) {
          res.status(401).send(`Cannot update album, id doesn't exist`);
          return;
        }
        const sql = `
        UPDATE albums
        SET Title = "${title}", 
        ArtistId =  "${artistId}"   
        WHERE AlbumId = ${id}`;

        db.all(sql, async (err, rows) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          await res.send(`album with id: ${id} successfully updated`);
        });
      });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { albumId } = req.params;
      const queryIdString = `SELECT * FROM albums WHERE albums.AlbumId = ${albumId}`;

      db.get(queryIdString, async (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        if (row === undefined) {
          await res.status(400).send("Cannot delete album id doesn't exist");
          return;
        }

        const { Title } = row;

        const sql = `DELETE FROM albums WHERE AlbumId ='${albumId}'`;
        db.all(sql, async (err, row) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          await res
            .status(200)
            .send(`album '${Title}' was successfully deleted`);
        });
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = controllers;
