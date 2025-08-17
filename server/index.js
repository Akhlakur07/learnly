const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oijxnxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("learnlyDB").collection("users");

    const courseCollection = client.db("learnlyDB").collection("courses");

    app.post("/users", async (req, res) => {
      const user = req.body;

      const existingUser = await userCollection.findOne({ email: user.email });
      if (existingUser) {
        return res.status(409).send({ message: "User already exists" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch users", error });
      }
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.get("/users/email/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.send(user);
    });

    app.post("/courses", async (req, res) => {
      const {
        title,
        description,
        instructorEmail,
        videos = [],
        quizzes = [],
        difficulty,
        categories,
      } = req.body;

      const allowed = ["Beginner", "Intermediate", "Advanced"];
      if (!allowed.includes(difficulty)) {
        return res.status(400).send({ message: "Invalid difficulty value" });
      }

      // categories: array of strings, trimmed, unique
      const cats = Array.isArray(categories)
        ? [...new Set(categories.map((c) => String(c).trim()).filter(Boolean))]
        : [];

      const courseDoc = {
        title,
        description,
        instructorEmail,
        difficulty, // "Beginner" | "Intermediate" | "Advanced"
        categories: cats, // e.g. ["DSA", "Algorithms"]
        videos,
        quizzes,
      };

      try {
        const result = await courseCollection.insertOne(courseDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to create course", error });
      }
    });

    app.get("/courses", async (req, res) => {
      try {
        const { instructorEmail, difficulty, category } = req.query;
        const query = {};

        if (instructorEmail) query.instructorEmail = instructorEmail;
        if (difficulty) query.difficulty = difficulty; // "Beginner" | "Intermediate" | "Advanced"
        if (category) query.categories = category; // matches any course with this category

        const courses = await courseCollection.find(query).toArray();
        res.json(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        res
          .status(500)
          .json({ message: "Server error while fetching courses" });
      }
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const courses = await courseCollection.findOne(query);
      res.send(courses);
    });

    app.patch("/users/enroll", async (req, res) => {
      const { email, courseId } = req.body;
      if (!email || !courseId) {
        return res
          .status(400)
          .send({ message: "email and courseId are required" });
      }

      try {
        const result = await userCollection.updateOne(
          { email },
          { $addToSet: { enrolledCourses: courseId } } // prevents duplicates
        );

        // Optional: tell client if it was newly added or already there
        res.send({ ok: true, modifiedCount: result.modifiedCount });
      } catch (e) {
        res.status(500).send({ message: "Failed to enroll", error: e.message });
      }
    });

    // Save per-course progress on the user doc
    // body: { email, courseId, progress: { phase, currentLesson, currentQuiz } }
    app.patch("/users/progress", async (req, res) => {
      const { email, courseId, progress } = req.body;
      if (!email || !courseId || !progress) {
        return res
          .status(400)
          .send({ message: "email, courseId, progress required" });
      }
      try {
        const field = `progress.${courseId}`;
        const result = await userCollection.updateOne(
          { email },
          { $set: { [field]: progress } }
        );
        res.send({ ok: true, modifiedCount: result.modifiedCount });
      } catch (e) {
        res
          .status(500)
          .send({ message: "Failed to save progress", error: e.message });
      }
    });

    // Mark course as completed: adds to completedCourses
    // body: { email, courseId }
    // inside run(), after userCollection defined
    app.patch("/users/completeCourse", async (req, res) => {
      const { email, courseId, mark } = req.body;
      if (!email || !courseId) {
        return res.status(400).send({ message: "email and courseId required" });
      }
      try {
        const result = await userCollection.updateOne(
          { email },
          {
            $addToSet: { completedCourses: courseId }, // keep backward compatibility
            $set: { [`completedCourseMarks.${courseId}`]: Number(mark) || 0 }, // new: id -> mark
          }
        );
        res.send({ ok: true, modifiedCount: result.modifiedCount });
      } catch (e) {
        res
          .status(500)
          .send({ message: "Failed to complete course", error: e.message });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Learnly is Learning!!!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
