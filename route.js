// ******************************************************************************
// for GET url => http://localhost:PORT/

// for POST url => http://localhost:PORT/add (include id for new entries)

// for PUT url => http://localhost:PORT/update/:id(can update patientCount,hospitalName,location using the same url just change the body part)
// for PUT url=>http://localhost:PORT/update/byName/:name

// for DELETE url=>http://localhost:PORT//delete/:id
// for DELETE url=> http://localhost:PORT///delete/byName/:name

// *******************************************************************************

const express = require("express");
const router = express.Router();
const fs = require("fs");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// let data = require("./hospitalData.json");
const filePath = "./hospitalData.json";

router.get("/", (req, res) => {
  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }

    //   console.log("File data:", jdata);
    res.send(JSON.parse(jdata));
    // res.send(jdata);
  });
});

router.post("/add", (req, res) => {
  console.log(req.body);

  if (Object.entries(req.body).length === 0) {
    return res.status(422).send("request body cant be empty");
  }

  let keyNames = Object.keys(req.body);
  console.log(keyNames);
  let keyCheck = keyNames.filter(
    (item) =>
      item === "id" ||
      item === "hospitalName" ||
      item === "patientCount" ||
      item === "location"
  );
  console.log(keyCheck);
  if (keyCheck.length !== 4) {
    return res
      .status(422)
      .send(
        "Data not added\n\nInvalid key names in the request body \nKey in the requset should be \n id \n hospitalName \n patientCount \n location"
      );
  }
  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }

    let data = JSON.parse(jdata);
    data.push(req.body);

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error in writting file");
      }
    });

    res.send("Added new item \n" + JSON.stringify(req.body));
  });
});

router.put("/update/:id", (req, res) => {
  let id = parseInt(req.params.id);

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }

    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.id === id);
    let flag = 0;

    if (!hospital) return res.status(404).send("Invalid hospital id");

    if (Object.entries(req.body).length === 0) {
      return res.status(422).send("request body cant be empty");
    } else {
      if (req.body.hospitalName) {
        hospital.hospitalName = req.body.hospitalName;
        flag++;
      }

      if (req.body.patientCount) {
        hospital.patientCount = req.body.patientCount;
        flag++;
      }

      if (req.body.location) {
        hospital.location = req.body.location;
        flag++;
      }
    }

    if (flag !== Object.entries(req.body).length) {
      return res.status(422).send("Check for the field names in the body");
    }

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Updation failed");
      }

      res.send({
        status: "Updated successfully",
        item: hospital,
      });
    });
  });
});

router.put("/update/byName/:name", (req, res) => {
  let name = req.params.name.toString();

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }

    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.hospitalName === name);
    let flag = 0;

    if (!hospital) return res.status(404).send("Invalid hospital name");

    if (Object.entries(req.body).length === 0) {
      return res.status(422).send("request body cant be empty");
    } else {
      if (req.body.hospitalName) {
        hospital.hospitalName = req.body.hospitalName;
        flag++;
      }

      if (req.body.patientCount) {
        hospital.patientCount = req.body.patientCount;
        flag++;
      }

      if (req.body.location) {
        hospital.location = req.body.location;
        flag++;
      }
    }

    if (flag !== Object.entries(req.body).length) {
      return res.status(422).send("Check for the field names in the body");
    }

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Updation failed");
      }

      res.send({
        status: "Updated successfully",
        item: hospital,
      });
    });
  });
});

router.delete("/delete/:id", (req, res) => {
  let id = parseInt(req.params.id);

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }

    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.id === id);

    if (!hospital) return res.status(404).send("Id does not exist");

    let deletedData = data.filter((item) => item.id !== id);

    fs.writeFile(filePath, JSON.stringify(deletedData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Updation failed");
      }

      res.send({
        status: "deleted successfully",
        item: hospital,
      });
    });
  });
});

router.delete("/delete/byName/:name", (req, res) => {
  let name = req.params.name.toString();

  fs.readFile(filePath, (err, jdata) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error in reading data");
    }

    let data = JSON.parse(jdata);
    let hospital = data.find((item) => item.hospitalName === name);

    if (!hospital) return res.status(404).send("Hospital not present");

    let deletedData = data.filter((item) => item.hospitalName !== name);

    fs.writeFile(filePath, JSON.stringify(deletedData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Updation failed");
      }

      res.send({
        status: "deleted successfully",
        item: hospital,
      });
    });
  });
});

module.exports = router;