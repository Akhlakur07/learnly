require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Enable simple CORS for all domains
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oijxnxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoClient setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("learnlyDB").collection("users");
    const courseCollection = client.db("learnlyDB").collection("courses");

    // ===== USERS =====
    app.post("/users", async (req, res) => {
      const user = req.body;
      const existingUser = await userCollection.findOne({ email: user.email });
      if (existingUser)
        return res.status(409).send({ message: "User already exists" });

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
      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(user);
    });

    app.get("/users/email/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email });
      if (!user) return res.status(404).send({ message: "User not found" });
      res.send(user);
    });

    app.patch("/users/enroll", async (req, res) => {
      const { email, courseId } = req.body;
      if (!email || !courseId)
        return res
          .status(400)
          .send({ message: "email and courseId are required" });

      try {
        const result = await userCollection.updateOne(
          { email },
          { $addToSet: { enrolledCourses: courseId } }
        );
        res.send({ ok: true, modifiedCount: result.modifiedCount });
      } catch (e) {
        res.status(500).send({ message: "Failed to enroll", error: e.message });
      }
    });

    app.patch("/users/progress", async (req, res) => {
      const { email, courseId, progress } = req.body;
      if (!email || !courseId || !progress)
        return res
          .status(400)
          .send({ message: "email, courseId, progress required" });
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

    function makeCertId(email = "", courseId = "") {
      const name = (email.split("@")[0] || "USER").slice(0, 4).toUpperCase();
      const tail = String(courseId).slice(-4).toUpperCase();
      const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
      return `LEARNLY-${name}-${tail}-${rand}`;
    }

    app.patch("/users/completeCourse", async (req, res) => {
      const { email, courseId, mark } = req.body;
      if (!email || !courseId)
        return res.status(400).send({ message: "email and courseId required" });

      try {
        const user = await userCollection.findOne(
          { email },
          { projection: { completedCourseMeta: 1 } }
        );
        const hasMeta = !!user?.completedCourseMeta?.[courseId];
        const now = new Date().toISOString();
        const safeMark = Number(mark) || 0;

        const update = {
          $addToSet: { completedCourses: courseId },
          $set: { [`completedCourseMarks.${courseId}`]: safeMark },
        };

        if (!hasMeta) {
          update.$set[`completedCourseMeta.${courseId}`] = {
            mark: safeMark,
            completedAt: now,
            certId: makeCertId(email, courseId),
          };
        }

        const result = await userCollection.updateOne({ email }, update);
        res.send({ ok: true, modifiedCount: result.modifiedCount });
      } catch (e) {
        res
          .status(500)
          .send({ message: "Failed to complete course", error: e.message });
      }
    });

    app.get("/users/cert/:email/:courseId", async (req, res) => {
      const { email, courseId } = req.params;
      try {
        const user = await userCollection.findOne(
          { email },
          {
            projection: {
              name: 1,
              completedCourseMarks: 1,
              completedCourseMeta: 1,
            },
          }
        );
        if (!user) return res.status(404).send({ message: "User not found" });

        const course = await courseCollection.findOne(
          { _id: new ObjectId(courseId) },
          { projection: { title: 1 } }
        );
        if (!course)
          return res.status(404).send({ message: "Course not found" });

        const mark = user.completedCourseMarks?.[courseId] ?? null;
        const meta = user.completedCourseMeta?.[courseId] ?? {};
        res.send({
          name: user.name,
          courseTitle: course.title,
          mark,
          completedAt: meta.completedAt || null,
          certId: meta.certId || null,
        });
      } catch (e) {
        res
          .status(500)
          .send({ message: "Failed to fetch certificate", error: e.message });
      }
    });

    // ===== COURSES =====
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
      if (!allowed.includes(difficulty))
        return res.status(400).send({ message: "Invalid difficulty value" });

      const cats = Array.isArray(categories)
        ? [...new Set(categories.map((c) => String(c).trim()).filter(Boolean))]
        : [];

      const courseDoc = {
        title,
        description,
        instructorEmail,
        difficulty,
        categories: cats,
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
        if (difficulty) query.difficulty = difficulty;
        if (category) query.categories = category;

        const courses = await courseCollection.find(query).toArray();
        res.json(courses);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Server error while fetching courses" });
      }
    });

    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const course = await courseCollection.findOne({ _id: new ObjectId(id) });
      res.send(course);
    });

    app.delete("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const result = await courseCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.patch("/users/email/:email", async (req, res) => {
      const email = req.params.email;
      const { name, bio, photo } = req.body;

      const update = {};
      if (name !== undefined) update.name = name;
      if (bio !== undefined) update.bio = bio;
      if (photo !== undefined) update.photo = photo;

      const result = await userCollection.updateOne(
        { email },
        { $set: update }
      );
      res.send({ ok: true, modifiedCount: result.modifiedCount });
    });

    console.log("MongoDB initialized.");
  } finally {
    // Do not close client because server should keep running
  }
}
run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  res.send("Learnly is Learning!!!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
