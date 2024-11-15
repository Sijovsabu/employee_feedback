const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importing cors package
const { MongoClient, ObjectId } = require("mongodb");

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string and database name
const uri = "mongodb://127.0.0.1:27017";
const dbName = "companyDB";

// Connect to MongoDB
MongoClient.connect(uri, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    const employeeCollection = db.collection("employees");
    const reviewCollection = db.collection("performanceReviews");

    // CRUD Operations for Employees

    // CREATE: Add a new employee
    app.post("/employees", async (req, res) => {
      try {
        const employee = req.body;
        const result = await employeeCollection.insertOne(employee);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // READ: Get all employees
    app.get("/employees", async (req, res) => {
      try {
        const employees = await employeeCollection.find().toArray();
        res.status(200).json(employees);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // READ: Get an employee by ID
    app.get("/employees/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const employee = await employeeCollection.findOne({
          _id: new ObjectId(id),
        });
        if (employee) {
          res.status(200).json(employee);
        } else {
          res.status(404).send("Employee not found");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // UPDATE: Update an employee's details
    app.put("/employees/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedEmployee = req.body;
        const result = await employeeCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedEmployee }
        );
        if (result.matchedCount > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).send("Employee not found");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // DELETE: Remove an employee
    app.delete("/employees/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await employeeCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount > 0) {
          res.status(200).send("Employee deleted successfully");
        } else {
          res.status(404).send("Employee not found");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // CRUD Operations for Performance Reviews

    // CREATE: Add a new performance review
    app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // READ: Get all reviews
    app.get("/reviews", async (req, res) => {
      try {
        const reviews = await reviewCollection.find().toArray();
        res.status(200).json(reviews);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // READ: Get reviews for a specific employee
    app.get("/employees/:id/reviews", async (req, res) => {
      try {
        const employeeId = req.params.id;
        const reviews = await reviewCollection
          .find({ employeeId: new ObjectId(employeeId) })
          .toArray();
        res.status(200).json(reviews);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // UPDATE: Update a performance review
    app.put("/reviews/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedReview = req.body;
        const result = await reviewCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedReview }
        );
        if (result.matchedCount > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).send("Review not found");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // DELETE: Remove a performance review
    app.delete("/reviews/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await reviewCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount > 0) {
          res.status(200).send("Review deleted successfully");
        } else {
          res.status(404).send("Review not found");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // Start server
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
