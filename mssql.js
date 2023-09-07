const sql = require("mssql");

let connectSettings = {
  user: "sa",
  password: "520134",
  server: "192.168.200.100",

  options: { trustServerCertificate: true },
};
sql.connect(connectSettings, (err) => {
  if (err) {
    console.log(err);
  }
});
