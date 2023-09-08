const express = require("express");
const app = express();
const ejs = require("ejs");
require("./mssql");
const sql = require("mssql");
const session = require("express-session");
const { LocalStorage } = require("node-localstorage");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "test", saveUninitialized: false, resave: false }));
let userData = [];
let localStorage = new LocalStorage("/index");
app.get("/", (req, res) => {
  res.render("userFind");
});

function veifyData(req, res, next) {
  let veifyData = req.session.user;
  if (veifyData) {
    next();
  } else {
    res.redirect("/");
  }
}

app.post("/", async (req, res) => {
  let { nickname } = req.body;

  let result = await sql.query(
    `USE [Game01]  SELECT [UnitUID],[NickName] FROM [dbo].[GUnitNickName] WHERE [NickName] = N'${nickname}'`
  );
  console.log(result);
  //   判別遊戲名稱有無找到
  if (result.recordset[0]) {
    let userID = result.recordset[0].UnitUID;
    userData.push({ userID, nickname });
    req.session.user = { userID, nickname };
    res.render("index", { nickname, userID });
  } else {
    res.redirect("/");
  }
});

app.get("/index", veifyData, (req, res) => {
  let veifyData = req.session.user;
  res.render("index", {
    userID: veifyData.userID,
    nickname: veifyData.nickname,
  });
});

// 註冊
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post(
  "/signup",
  (req, res) => {
    let { Password, UserID } = req.body;
    sql.query(`USE [Account] INSERT INTO [dbo].[MUser]
  ([UserID]
  ,[Password]
  ,[Gender]
  ,[UserName]
  ,[RegDate]
  ,[DelDate]
  ,[PlayGuide])
VALUES
  ('${UserID}'
  ,'${Password}'
  ,'1'
  ,'123'
  ,'2007-02-15 10:47:00'
  ,'2033-02-15 10:47:00'
  ,0)`);
  },
  (err, result) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }
  }
);

// 功能頁面
app.get("/Utility", veifyData, (req, res) => {
  let veifyData = req.session.user;
  res.render("utility", {
    userID: veifyData.userID,
    nickname: veifyData.nickname,
  });
});

//測試功能用
app.get("/Utility/test/:userid", veifyData, (req, res) => {
  let { userid } = req.params;

  res.redirect("/Utility");
});

// 刪除角色
app.get("/Utility/delete/:userid", veifyData, (req, res) => {
  let { userid } = req.params;
  sql.query(
    `USE [Game01] DELETE FROM [dbo].[GUnit] WHERE [unitUID] = ${userid}`
  ),
    (err) => {
      if (err) {
        console.log(err);
      }
    };
  sql.query(
    `USE [Game01] DELETE FROM [dbo].[GUnitNickName] WHERE [unitUID] = ${userid}`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
});

// 稱號全開
app.get("/Utility/title/:userid", async (req, res) => {
  let { userid } = req.params;
  let { userID, nickname } = req.session.user;

  sql.query(
    `USE [Game01] DELETE FROM [dbo].[GTitle_Complete]`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );

  sql.query(
    `USE [Game01] INSERT INTO [dbo].[GTitle_Complete] ([UnitUID],[TitleID],[EndDate],[IsHang]) VALUES (${userid},10,'2040-12-31 23:59:00','1'),
    (${userid},20,'2040-12-31 23:59:00','1'),
    (${userid},30,'2040-12-31 23:59:00','1'),
    (${userid},40,'2040-12-31 23:59:00','1'),
    (${userid},50,'2040-12-31 23:59:00','1'),
    (${userid},80,'2040-12-31 23:59:00','1'),
    (${userid},90,'2040-12-31 23:59:00','1'),
    (${userid},100,'2040-12-31 23:59:00','1'),
    (${userid},130,'2040-12-31 23:59:00','1'),
    (${userid},140,'2040-12-31 23:59:00','1'),
    (${userid},150,'2040-12-31 23:59:00','1'),
    (${userid},160,'2040-12-31 23:59:00','1'),
    (${userid},170,'2040-12-31 23:59:00','1'),
    (${userid},171,'2040-12-31 23:59:00','1'),
    (${userid},172,'2040-12-31 23:59:00','1'),
    (${userid},173,'2040-12-31 23:59:00','1'),
    (${userid},174,'2040-12-31 23:59:00','1'),
    (${userid},180,'2040-12-31 23:59:00','1'),
    (${userid},190,'2040-12-31 23:59:00','1'),
    (${userid},200,'2040-12-31 23:59:00','1'),
    (${userid},210,'2040-12-31 23:59:00','1'),
    (${userid},220,'2040-12-31 23:59:00','1'),
    (${userid},230,'2040-12-31 23:59:00','1'),
    (${userid},240,'2040-12-31 23:59:00','1'),
    (${userid},250,'2040-12-31 23:59:00','1'),
    (${userid},270,'2040-12-31 23:59:00','1'),
    (${userid},280,'2040-12-31 23:59:00','1'),
    (${userid},290,'2040-12-31 23:59:00','1'),
    (${userid},300,'2040-12-31 23:59:00','1'),
    (${userid},310,'2040-12-31 23:59:00','1'),
    (${userid},320,'2040-12-31 23:59:00','1'),
    (${userid},330,'2040-12-31 23:59:00','1'),
    (${userid},340,'2040-12-31 23:59:00','1'),
    (${userid},350,'2040-12-31 23:59:00','1'),
    (${userid},360,'2040-12-31 23:59:00','1'),
    (${userid},370,'2040-12-31 23:59:00','1'),
    (${userid},380,'2040-12-31 23:59:00','1'),
    (${userid},390,'2040-12-31 23:59:00','1'),
    (${userid},400,'2040-12-31 23:59:00','1'),
    (${userid},410,'2040-12-31 23:59:00','1'),
    (${userid},420,'2040-12-31 23:59:00','1'),
    (${userid},430,'2040-12-31 23:59:00','1'),
    (${userid},440,'2040-12-31 23:59:00','1'),
    (${userid},450,'2040-12-31 23:59:00','1'),
    (${userid},460,'2040-12-31 23:59:00','1'),
    (${userid},470,'2040-12-31 23:59:00','1'),
    (${userid},480,'2040-12-31 23:59:00','1'),
    (${userid},495,'2040-12-31 23:59:00','1'),
    (${userid},505,'2040-12-31 23:59:00','1'),
    (${userid},515,'2040-12-31 23:59:00','1'),
    (${userid},525,'2040-12-31 23:59:00','1'),
    (${userid},535,'2040-12-31 23:59:00','1'),
    (${userid},545,'2040-12-31 23:59:00','1'),
    (${userid},555,'2040-12-31 23:59:00','1'),
    (${userid},565,'2040-12-31 23:59:00','1'),
    (${userid},575,'2040-12-31 23:59:00','1'),
    (${userid},585,'2040-12-31 23:59:00','1'),
    (${userid},595,'2040-12-31 23:59:00','1'),
    (${userid},605,'2040-12-31 23:59:00','1'),
    (${userid},610,'2040-12-31 23:59:00','1'),
    (${userid},611,'2040-12-31 23:59:00','1'),
    (${userid},612,'2040-12-31 23:59:00','1'),
    (${userid},613,'2040-12-31 23:59:00','1'),
    (${userid},614,'2040-12-31 23:59:00','1'),
    (${userid},615,'2040-12-31 23:59:00','1'),
    (${userid},620,'2040-12-31 23:59:00','1'),
    (${userid},630,'2040-12-31 23:59:00','1'),
    (${userid},640,'2040-12-31 23:59:00','1'),
    (${userid},650,'2040-12-31 23:59:00','1'),
    (${userid},660,'2040-12-31 23:59:00','1'),
    (${userid},670,'2040-12-31 23:59:00','1'),
    (${userid},680,'2040-12-31 23:59:00','1'),
    (${userid},5504,'2040-12-31 23:59:00','1'),
    (${userid},5514,'2040-12-31 23:59:00','1'),
    (${userid},10080,'2040-12-31 23:59:00','1'),
    (${userid},10140,'2040-12-31 23:59:00','1'),
    (${userid},10210,'2040-12-31 23:59:00','1'),
    (${userid},10230,'2040-12-31 23:59:00','1'),
    (${userid},10260,'2040-12-31 23:59:00','1'),
    (${userid},10310,'2040-12-31 23:59:00','1'),
    (${userid},10350,'2040-12-31 23:59:00','1'),
    (${userid},10380,'2040-12-31 23:59:00','1'),
    (${userid},10480,'2040-12-31 23:59:00','1'),
    (${userid},10490,'2040-12-31 23:59:00','1'),
    (${userid},10510,'2040-12-31 23:59:00','1'),
    (${userid},10540,'2040-12-31 23:59:00','1'),
    (${userid},10570,'2040-12-31 23:59:00','1'),
    (${userid},10600,'2040-12-31 23:59:00','1'),
    (${userid},10610,'2040-12-31 23:59:00','1'),
    (${userid},10670,'2040-12-31 23:59:00','1'),
    (${userid},10690,'2040-12-31 23:59:00','1'),
    (${userid},10760,'2040-12-31 23:59:00','1'),
    (${userid},11050,'2040-12-31 23:59:00','1'),
    (${userid},11120,'2040-12-31 23:59:00','1'),
    (${userid},11130,'2040-12-31 23:59:00','1'),
    (${userid},15001,'2040-12-31 23:59:00','1'),
    (${userid},15002,'2040-12-31 23:59:00','1'),
    (${userid},20080,'2040-12-31 23:59:00','1'),
    (${userid},20090,'2040-12-31 23:59:00','1'),
    (${userid},20095,'2040-12-31 23:59:00','1'),
    (${userid},20100,'2040-12-31 23:59:00','1'),
    (${userid},20110,'2040-12-31 23:59:00','1'),
    (${userid},20120,'2040-12-31 23:59:00','1'),
    (${userid},20130,'2040-12-31 23:59:00','1'),
    (${userid},20160,'2040-12-31 23:59:00','1'),
    (${userid},20170,'2040-12-31 23:59:00','1'),
    (${userid},20180,'2040-12-31 23:59:00','1'),
    (${userid},20190,'2040-12-31 23:59:00','1'),
    (${userid},20200,'2040-12-31 23:59:00','1'),
    (${userid},20210,'2040-12-31 23:59:00','1'),
    (${userid},20220,'2040-12-31 23:59:00','1'),
    (${userid},20230,'2040-12-31 23:59:00','1'),
    (${userid},20240,'2040-12-31 23:59:00','1'),
    (${userid},20250,'2040-12-31 23:59:00','1'),
    (${userid},20260,'2040-12-31 23:59:00','1'),
    (${userid},30000,'2040-12-31 23:59:00','1'),
    (${userid},30001,'2040-12-31 23:59:00','1'),
    (${userid},30002,'2040-12-31 23:59:00','1'),
    (${userid},30003,'2040-12-31 23:59:00','1'),
    (${userid},30004,'2040-12-31 23:59:00','1'),
    (${userid},30005,'2040-12-31 23:59:00','1'),
    (${userid},30006,'2040-12-31 23:59:00','1'),
    (${userid},30007,'2040-12-31 23:59:00','1'),
    (${userid},30008,'2040-12-31 23:59:00','1'),
    (${userid},30009,'2040-12-31 23:59:00','1'),
    (${userid},30010,'2040-12-31 23:59:00','1'),
    (${userid},30012,'2040-12-31 23:59:00','1'),
    (${userid},30013,'2040-12-31 23:59:00','1'),
    (${userid},30014,'2040-12-31 23:59:00','1'),
    (${userid},30020,'2040-12-31 23:59:00','1'),
    (${userid},30030,'2040-12-31 23:59:00','1'),
    (${userid},30040,'2040-12-31 23:59:00','1'),
    (${userid},30050,'2040-12-31 23:59:00','1'),
    (${userid},30060,'2040-12-31 23:59:00','1'),
    (${userid},30070,'2040-12-31 23:59:00','1'),
    (${userid},30080,'2040-12-31 23:59:00','1'),
    (${userid},30090,'2040-12-31 23:59:00','1'),
    (${userid},30100,'2040-12-31 23:59:00','1'),
    (${userid},30110,'2040-12-31 23:59:00','1'),
    (${userid},30120,'2040-12-31 23:59:00','1'),
    (${userid},30130,'2040-12-31 23:59:00','1'),
    (${userid},30140,'2040-12-31 23:59:00','1'),
    (${userid},30150,'2040-12-31 23:59:00','1'),
    (${userid},30160,'2040-12-31 23:59:00','1'),
    (${userid},30170,'2040-12-31 23:59:00','1'),
    (${userid},30180,'2040-12-31 23:59:00','1'),
    (${userid},30190,'2040-12-31 23:59:00','1'),
    (${userid},30200,'2040-12-31 23:59:00','1'),
    (${userid},30210,'2040-12-31 23:59:00','1'),
    (${userid},30220,'2040-12-31 23:59:00','1'),
    (${userid},30350,'2040-12-31 23:59:00','1'),
    (${userid},30360,'2040-12-31 23:59:00','1'),
    (${userid},30370,'2040-12-31 23:59:00','1'),
    (${userid},30380,'2040-12-31 23:59:00','1'),
    (${userid},30390,'2040-12-31 23:59:00','1'),
    (${userid},30400,'2040-12-31 23:59:00','1'),
    (${userid},30410,'2040-12-31 23:59:00','1'),
    (${userid},30420,'2040-12-31 23:59:00','1'),
    (${userid},30430,'2040-12-31 23:59:00','1'),
    (${userid},30440,'2040-12-31 23:59:00','1'),
    (${userid},30450,'2040-12-31 23:59:00','1'),
    (${userid},30460,'2040-12-31 23:59:00','1'),
    (${userid},30470,'2040-12-31 23:59:00','1'),
    (${userid},30480,'2040-12-31 23:59:00','1'),
    (${userid},30490,'2040-12-31 23:59:00','1'),
    (${userid},30500,'2040-12-31 23:59:00','1'),
    (${userid},30510,'2040-12-31 23:59:00','1'),
    (${userid},30520,'2040-12-31 23:59:00','1'),
    (${userid},30530,'2040-12-31 23:59:00','1'),
    (${userid},30540,'2040-12-31 23:59:00','1'),
    (${userid},30550,'2040-12-31 23:59:00','1'),
    (${userid},30560,'2040-12-31 23:59:00','1'),
    (${userid},30570,'2040-12-31 23:59:00','1'),
    (${userid},30580,'2040-12-31 23:59:00','1'),
    (${userid},30590,'2040-12-31 23:59:00','1'),
    (${userid},30600,'2040-12-31 23:59:00','1'),
    (${userid},30610,'2040-12-31 23:59:00','1'),
    (${userid},30620,'2040-12-31 23:59:00','1'),
    (${userid},30630,'2040-12-31 23:59:00','1'),
    (${userid},30640,'2040-12-31 23:59:00','1'),
    (${userid},30650,'2040-12-31 23:59:00','1'),
    (${userid},30660,'2040-12-31 23:59:00','1'),
    (${userid},30670,'2040-12-31 23:59:00','1'),
    (${userid},30680,'2040-12-31 23:59:00','1'),
    (${userid},30690,'2040-12-31 23:59:00','1'),
    (${userid},35000,'2040-12-31 23:59:00','1'),
    (${userid},35001,'2040-12-31 23:59:00','1'),
    (${userid},35002,'2040-12-31 23:59:00','1'),
    (${userid},35003,'2040-12-31 23:59:00','1'),
    (${userid},35004,'2040-12-31 23:59:00','1'),
    (${userid},35005,'2040-12-31 23:59:00','1'),
    (${userid},35006,'2040-12-31 23:59:00','1'),
    (${userid},35007,'2040-12-31 23:59:00','1'),
    (${userid},35008,'2040-12-31 23:59:00','1'),
    (${userid},35009,'2040-12-31 23:59:00','1'),
    (${userid},35010,'2040-12-31 23:59:00','1'),
    (${userid},35012,'2040-12-31 23:59:00','1'),
    (${userid},35013,'2040-12-31 23:59:00','1'),
    (${userid},35014,'2040-12-31 23:59:00','1'),
    (${userid},35015,'2040-12-31 23:59:00','1'),
    (${userid},35016,'2040-12-31 23:59:00','1'),
    (${userid},35017,'2040-12-31 23:59:00','1'),
    (${userid},35018,'2040-12-31 23:59:00','1'),
    (${userid},35019,'2040-12-31 23:59:00','1'),
    (${userid},35020,'2040-12-31 23:59:00','1'),
    (${userid},35021,'2040-12-31 23:59:00','1'),
    (${userid},35030,'2040-12-31 23:59:00','1'),
    (${userid},35031,'2040-12-31 23:59:00','1'),
    (${userid},35032,'2040-12-31 23:59:00','1'),
    (${userid},35040,'2040-12-31 23:59:00','1'),
    (${userid},35060,'2040-12-31 23:59:00','1'),
    (${userid},35070,'2040-12-31 23:59:00','1'),
    (${userid},35080,'2040-12-31 23:59:00','1'),
    (${userid},35090,'2040-12-31 23:59:00','1'),
    (${userid},35100,'2040-12-31 23:59:00','1'),
    (${userid},35110,'2040-12-31 23:59:00','1'),
    (${userid},35120,'2040-12-31 23:59:00','1'),
    (${userid},35130,'2040-12-31 23:59:00','1'),
    (${userid},35140,'2040-12-31 23:59:00','1'),
    (${userid},35150,'2040-12-31 23:59:00','1'),
    (${userid},35160,'2040-12-31 23:59:00','1'),
    (${userid},35170,'2040-12-31 23:59:00','1'),
    (${userid},35180,'2040-12-31 23:59:00','1'),
    (${userid},35190,'2040-12-31 23:59:00','1'),
    (${userid},35200,'2040-12-31 23:59:00','1'),
    (${userid},35210,'2040-12-31 23:59:00','1'),
    (${userid},35220,'2040-12-31 23:59:00','1'),
    (${userid},35230,'2040-12-31 23:59:00','1'),
    (${userid},40080,'2040-12-31 23:59:00','1'),
    (${userid},40090,'2040-12-31 23:59:00','1'),
    (${userid},40100,'2040-12-31 23:59:00','1'),
    (${userid},40110,'2040-12-31 23:59:00','1'),
    (${userid},40120,'2040-12-31 23:59:00','1'),
    (${userid},40130,'2040-12-31 23:59:00','1'),
    (${userid},40140,'2040-12-31 23:59:00','1'),
    (${userid},40150,'2040-12-31 23:59:00','1'),
    (${userid},40160,'2040-12-31 23:59:00','1'),
    (${userid},40170,'2040-12-31 23:59:00','1'),
    (${userid},100000,'2040-12-31 23:59:00','1'),
    (${userid},100010,'2040-12-31 23:59:00','1'),
    (${userid},100100,'2040-12-31 23:59:00','1'),
    (${userid},100110,'2040-12-31 23:59:00','1'),
    (${userid},100120,'2040-12-31 23:59:00','1'),
    (${userid},100130,'2040-12-31 23:59:00','1'),
    (${userid},100140,'2040-12-31 23:59:00','1'),
    (${userid},100150,'2040-12-31 23:59:00','1'),
    (${userid},100160,'2040-12-31 23:59:00','1'),
    (${userid},100170,'2040-12-31 23:59:00','1')
    `,
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/Utility");
      }
    }
  );
});

// 修改金錢
app.get("/Utility/money/:userid", veifyData, async (req, res) => {
  let { userid } = req.params;
  let { userID, nickname } = req.session.user;
  await sql.query(
    `USE [Game01] UPDATE [dbo].[GUnit] SET [GamePoint] = '1000000000' WHERE [UnitUID] = '${userid}' `,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        res.redirect("/Utility");
      }
    }
  );
});

// 更改職業
app.get("/Utility/job", veifyData, (req, res) => {
  let { userID } = req.session.user;
  res.render("job", { userID });
});

app.post("/Utility/job/:userid", veifyData, (req, res) => {
  let { userid } = req.params;
  let { job } = req.body;
  console.log(job);
  let { userID, nickname } = req.session.user;
  sql.query(
    `USE [Game01] UPDATE [dbo].[GUnit] SET [UnitClass] = ${job} WHERE [UnitUID] = ${userID}`,
    (err, result) => {
      console.log(job);
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        res.redirect("/Utility");
      }
    }
  );
});

// 增加商城物品
app.get("/Utility/addProduct", veifyData, (req, res) => {
  res.render("addProduct");
});

app.post("/Utility/addProduct", (req, res) => {
  let { product, amount, price } = req.body;
  let max_no_array;
  let max_no;
  sql.query(
    `USE [ES_BILLING] SELECT MAX(CD_PRODUCTNO) FROM [dbo].[EB_Product]`,
    (err, result) => {
      max_no_array = Object.values(result.recordset[0]);
      max_no = Number(max_no_array[0]) + 1;

      //     console.log(max_no_array);
      //     console.log(result);
      //     console.log(max_no);
      sql.query(
        `USE [ES_BILLING] INSERT INTO [dbo].[EB_Product] ([DI_ISSALE],[DI_ISEVENT],[DI_ISSHOW],[DI_ISCASHINVENSKIP],[CD_PRODUCTNO],[NO_PRODUCTID],[ST_PRODUCTNAME],[ST_PRODUCTNAME_LOCAL],[CD_CATEGORYNO],[NO_SALEPRICE],[NO_REALPRICE],[NO_PERIOD],[NO_QUANTITY],[DI_ENABLEGIFT],[NO_LIMITLEVEL],[NO_LIMIT_USERUID],[DT_STARTDATE],[DT_ENDDATE])
    VALUES (1,0,1,1,${max_no},${product},N'测试',N'测试',1,1,1,0,${amount},1,0,0,'2023-07-29 20:08:00','2024-07-30 20:08:00')`,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.send(err);
          } else {
            res.redirect("/Utility/addProduct");
          }
        }
      );
    }
  );
});

// 強化裝備
app.get("/Utility/refine", (req, res) => {
  let { userID } = req.session.user;
  res.render("refine", { userID });
});

app.post("/Utility/refine/:userid", (req, res) => {
  let { userid } = req.params;
  let { level } = req.body;

  sql.query(
    `USE [Game01] UPDATE [dbo].[GItemEnchant] SET [ELevel] = ${level} WHERE [UnitUID] = ${userid}`,
    (err) => {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        res.redirect("/Utility");
      }
    }
  );
});

// 增加時裝
app.get("/Utility/addSkin", veifyData, (req, res) => {
  let { userID } = req.session.user;
  res.render("addSkin", { userID });
});

app.post("/Utility/addSkin/:userid", veifyData, (req, res) => {
  let { userid } = req.params;
  let { skin, InventoryCategory } = req.body;
  let { userID, nickname } = req.session.user;

  console.log(InventoryCategory);

  switch (InventoryCategory) {
    case "1": {
      sql.query(
        `
  
     
      USE [Game01]
      INSERT INTO [dbo].[GItem]
                 ([UnitUID]
                 ,[ItemID]
                 ,[InventoryCategory]
                 ,[SlotID]
                 ,[UsageType]
                 ,[Quantity]
                 ,[Endurance]
                 ,[ExpandedSocketNum]
                 ,[Inserted]
                 ,[RegDate])
           VALUES
                 (${userid},${skin},2,1,0,0,10000,0,125,'2023-09-03 01:01:01')
  
       `,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.send(err);
          } else {
            return res.redirect("/Utility");
          }
        }
      );
      break;
    }
    case "7":
      sql.query(
        `
    
       
        USE [Game01]
        INSERT INTO [dbo].[GItem]
                   ([UnitUID]
                   ,[ItemID]
                   ,[InventoryCategory]
                   ,[SlotID]
                   ,[UsageType]
                   ,[Quantity]
                   ,[Endurance]
                   ,[ExpandedSocketNum]
                   ,[Inserted]
                   ,[RegDate])
             VALUES
                   (${userid},${skin},7,1,0,0,'-1',0,108,'2023-09-03 01:01:01')
    
         `,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.send(err);
          } else {
            return res.redirect("/Utility");
          }
        }
      );
      break;
    default: {
      res.redirect("/Utility/addSkin");
    }
  }
});

//開啟B欄
app.get("/Utility/B/:userid", veifyData, (req, res) => {
  let { userid } = req.params;
  let { userID, nickname } = req.session.user;
  sql.query(
    `USE [Game01] SELECT [UnitUID] FROM [dbo].[GSkillSlot2_New] WHERE [UnitUID] = '${userid}'`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else if (result.recordset[0]) {
        sql.query(
          `USE [Game01] UPDATE [dbo].[GSkillSlot2_New] SET
                   [UnitUID] = ${userid}
                   ,[Slot01] = 0
                   ,[Slot02] = 0
                   ,[Slot03] = 0 
                   ,[Slot04] = 0
                   ,[PageNumber] = 1
                   ,[EndDate] = '2033-09-03 21:13:00'  
                   WHERE [UnitUID] = N'${userid}'
        `,
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              return res.redirect("/utility");
            }
          }
        );
      } else {
        sql.query(
          `
          USE [Game01]
      INSERT INTO [dbo].[GSkillSlot2_New]
                 ([UnitUID]
                 ,[Slot01]
                 ,[Slot02]
                 ,[Slot03]
                 ,[Slot04]
                 ,[PageNumber]
                 ,[EndDate])
           VALUES
                 (${userID},
                 0,
             0,
             0,
             0,
             1,
                 '2033-09-03 21:13:00')
      
      
      
      `,
          (err, result) => {
            if (err) {
              console.log(err);
              return res.send(err);
            } else {
              res.redirect("/utility");
            }
          }
        );
      }
    }
  );
});

//回復所有疲勞
app.get("/utility/spirit/:userid", veifyData, (req, res) => {
  let { userid } = req.params;
  let { userID, nickname } = req.session.user;

  sql.query(
    `USE [Game01] UPDATE [dbo].[GSpirit]
  SET  [Spirit] = 4800`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        res.redirect("/utility");
      }
    }
  );
});

app.listen(8051, () => {
  console.log("The server is running~");
});
