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

// 修改金錢

app.get("/Utility/money/:userid", veifyData, (req, res) => {
  let { userid } = req.params;
  let { userID, nickname } = req.session.user;
  sql.query(
    `USE [Game01] UPDATE [dbo].[GUnit] SET [GamePoint] = '2000000000' WHERE [UnitUID] = '${userid}' `,
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

// 增加時裝
app.get("/Utility/addSkin/:userid", veifyData, (req, res) => {
  let { userid } = req.params;
  let { userID, nickname } = req.session.user;
  sql.query(
    `USE [Game01] SELECT [UnitUID] FROM [dbo].[GSkillSlot2_New] WHERE [UnitUID] = '${userid}'`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        sql.query(`
    
       
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
                   (${userid},81060,7,1,0,0,'-1',0,108,'2023-09-03 01:01:01'),
               (${userid},81061,7,1,0,0,'-1',0,108,'2023-09-03 01:01:01'),
               (${userid},81062,7,1,0,0,'-1',0,108,'2023-09-03 01:01:01'),
               (${userid},81063,7,1,0,0,'-1',0,108,'2023-09-03 01:01:01'),
               (${userid},81064,7,1,0,0,'-1',0,108,'2023-09-03 01:01:01'),
               (${userid},81065,7,1,0,0,'-1',0,108,'2023-09-03 01:01:01');
       
        
        
         `);
      }
    }
  );
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
