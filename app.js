const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

module.exports = app;

app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const listOfPlayer = `
    SELECT * FROM cricket_team;
    `;
  const playerArray = await db.all(listOfPlayer);
  response.send(playerArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO
  cricket_team(player_name,jersey_number,role)
  VALUES(
      ${player_name},
      ${jersey_number},
      ${role}
  )
  ;`;
  const dbResponse = await db.run(addPlayerQuery);
  const player_id = dbResponse.lastID;
  response.send("Player added to team");
});
