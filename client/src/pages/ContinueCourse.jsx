import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

// 👇 React-PDF
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const ContinueCourse = () => {
  const { user } = useContext(AuthContext);
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // stored progress (next to do)
  const [currentLesson, setCurrentLesson] = useState(0); // next lesson to watch
  const [currentQuiz, setCurrentQuiz] = useState(0); // next quiz to take
  const [phase, setPhase] = useState("lessons"); // "lessons" | "quizzes" | "done"

  // UI selection in the right panel
  const [selectedType, setSelectedType] = useState("lesson"); // "lesson" | "quiz"
  const [selectedIndex, setSelectedIndex] = useState(0);

  // quiz answer (simple)
  const [picked, setPicked] = useState("");

  // scoring
  const [correctCount, setCorrectCount] = useState(0);
  const [finalMark, setFinalMark] = useState(null);

  // load course + user + hydrate progress
  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
      return;
    }

    Promise.all([
      fetch(
        `https://server-92hoyqb6a-akhlakurs-projects.vercel.app/courses/${courseId}`
      ).then((r) => r.json()),
      fetch(
        `https://server-92hoyqb6a-akhlakurs-projects.vercel.app/users/email/${user.email}`
      ).then((r) => r.json()),
    ])
      .then(([courseData, userData]) => {
        setCourse(courseData || null);
        setMe(userData || null);

        // must be enrolled
        const enrolled = Array.isArray(userData?.enrolledCourses)
          ? userData.enrolledCourses.includes(courseId)
          : false;

        if (!enrolled) {
          Swal.fire({
            icon: "info",
            title: "Not enrolled",
            text: "Please enroll in this course first.",
            confirmButtonColor: "#000000",
          }).then(() => navigate(`/courses/${courseId}`));
          return;
        }

        // progress + counts
        const p = userData?.progress?.[courseId] || {};
        const lessonsN = Array.isArray(courseData?.videos)
          ? courseData.videos.length
          : 0;
        const quizzesN = Array.isArray(courseData?.quizzes)
          ? courseData.quizzes.length
          : 0;

        const toNum = (v) => (typeof v === "number" ? v : Number(v ?? 0)) || 0;

        const lessonIndex = Math.min(
          Math.max(toNum(p.currentLesson), 0),
          Math.max(lessonsN - 1, 0)
        );
        const quizIndex = Math.min(
          Math.max(toNum(p.currentQuiz), 0),
          Math.max(quizzesN - 1, 0)
        );
        const savedCorrect = Math.max(toNum(p.correctCount), 0);

        const isCompleted =
          Array.isArray(userData?.completedCourses) &&
          userData.completedCourses.includes(courseId);

        const savedMark = userData?.completedCourseMarks?.[courseId];

        let nextPhase;
        if (isCompleted || p.phase === "done") {
          nextPhase = "done";
        } else if (p.phase === "quizzes") {
          nextPhase = quizzesN > 0 ? "quizzes" : "done";
        } else if (p.phase === "lessons") {
          nextPhase =
            lessonsN > 0 ? "lessons" : quizzesN > 0 ? "quizzes" : "done";
        } else {
          nextPhase =
            lessonsN > 0 ? "lessons" : quizzesN > 0 ? "quizzes" : "done";
        }

        setPhase(nextPhase);
        setCurrentLesson(lessonIndex);
        setCurrentQuiz(quizIndex);
        setCorrectCount(savedCorrect);

        // preshow
        if (nextPhase === "done") {
          if (typeof savedMark === "number") setFinalMark(savedMark);
          if (quizzesN > 0) {
            setSelectedType("quiz");
            setSelectedIndex(Math.max(0, Math.min(quizIndex, quizzesN - 1)));
          } else if (lessonsN > 0) {
            setSelectedType("lesson");
            setSelectedIndex(Math.max(0, Math.min(lessonIndex, lessonsN - 1)));
          }
        } else if (nextPhase === "quizzes") {
          setSelectedType("quiz");
          setSelectedIndex(quizIndex);
        } else {
          setSelectedType("lesson");
          setSelectedIndex(lessonIndex);
        }
      })
      .finally(() => setLoading(false));
  }, [user?.email, courseId, navigate]);

  // single declaration (do NOT redeclare later)
  const lessons = Array.isArray(course?.videos) ? course.videos : [];
  const quizzes = Array.isArray(course?.quizzes) ? course.quizzes : [];
  const lessonsCount = lessons.length;
  const quizzesCount = quizzes.length;

  // helpers
  const saveProgress = async (next) => {
    await fetch(
      "https://server-92hoyqb6a-akhlakurs-projects.vercel.app/users/progress",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, courseId, progress: next }),
      }
    );
  };

  const correctIndexOf = (quiz) => {
    const map = { A: 0, B: 1, C: 2, D: 3 };
    const key = String(quiz?.correctAnswer || "").toUpperCase();
    return map[key] ?? -1;
  };

  const completeCourse = async () => {
    // compute mark
    const mark =
      quizzesCount > 0 ? Math.round((correctCount / quizzesCount) * 100) : 100;

    setPhase("done");
    setFinalMark(mark);

    // store both: keep completedCourses array, and map of marks
    await fetch(
      "https://server-92hoyqb6a-akhlakurs-projects.vercel.app/users/completeCourse",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, courseId, mark }),
      }
    );

    // also store progress as done
    await saveProgress({
      phase: "done",
      currentLesson,
      currentQuiz,
      correctCount,
    });

    Swal.fire({
      icon: "success",
      title: "Course completed!",
      text: `Your score: ${mark}%`,
      confirmButtonColor: "#000000",
    });
  };

  const canOpenLesson = (i) => {
    if (phase === "lessons") return i <= currentLesson;
    return true;
  };

  const canOpenQuiz = (i) => {
    if (phase === "lessons") return false;
    if (phase === "quizzes") return i <= currentQuiz;
    if (phase === "done") return true;
    return false;
  };

  const statusOfLesson = (i) => {
    if (phase !== "lessons") return "completed";
    if (i < currentLesson) return "completed";
    if (i === currentLesson) return "current";
    return "locked";
  };

  const statusOfQuiz = (i) => {
    if (phase === "lessons") return "locked";
    if (phase === "done") return "completed";
    if (i < currentQuiz) return "completed";
    if (i === currentQuiz) return "current";
    return "locked";
  };

  const selectLesson = (i) => {
    if (!canOpenLesson(i)) {
      Swal.fire({
        icon: "info",
        title: "Locked",
        text: "Finish previous lessons first.",
        confirmButtonColor: "#000000",
      });
      return;
    }
    setSelectedType("lesson");
    setSelectedIndex(i);
    setPicked("");
  };

  const selectQuiz = (i) => {
    if (!canOpenQuiz(i)) {
      Swal.fire({
        icon: "info",
        title: "Locked",
        text: "Finish previous items first.",
        confirmButtonColor: "#000000",
      });
      return;
    }
    setSelectedType("quiz");
    setSelectedIndex(i);
    setPicked("");
  };

  const embedUrl = (url = "") => {
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url;
  };

  const handleMarkLessonWatched = async () => {
    if (
      !(
        phase === "lessons" &&
        selectedType === "lesson" &&
        selectedIndex === currentLesson
      )
    ) {
      return;
    }

    const atLastLesson = currentLesson >= lessonsCount - 1;

    if (!atLastLesson) {
      const next = {
        phase: "lessons",
        currentLesson: currentLesson + 1,
        currentQuiz,
        correctCount,
      };
      setCurrentLesson((n) => n + 1);
      await saveProgress(next);
      setSelectedType("lesson");
      setSelectedIndex(currentLesson + 1);
    } else {
      if (quizzesCount > 0) {
        const next = {
          phase: "quizzes",
          currentLesson,
          currentQuiz: 0,
          correctCount,
        };
        setPhase("quizzes");
        setCurrentQuiz(0);
        await saveProgress(next);
        setSelectedType("quiz");
        setSelectedIndex(0);
      } else {
        await completeCourse();
      }
    }
  };

  const handleSubmitQuizAnswer = async () => {
    if (
      !(
        phase === "quizzes" &&
        selectedType === "quiz" &&
        selectedIndex === currentQuiz
      )
    ) {
      return;
    }
    if (!picked) {
      Swal.fire({
        icon: "info",
        title: "Pick an answer",
        text: "Please choose an option to continue.",
        confirmButtonColor: "#000000",
      });
      return;
    }

    const chosenIdx = Number(picked.split("-")[1]); // "opt-2" => 2
    const correctIdx = correctIndexOf(quizzes[currentQuiz]);
    const isCorrect = chosenIdx === correctIdx;

    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    setCorrectCount(newCorrectCount);

    const atLastQuiz = currentQuiz >= quizzesCount - 1;

    if (!atLastQuiz) {
      const next = {
        phase: "quizzes",
        currentLesson,
        currentQuiz: currentQuiz + 1,
        correctCount: newCorrectCount,
      };
      setCurrentQuiz((n) => n + 1);
      await saveProgress(next);
      setSelectedType("quiz");
      setSelectedIndex(currentQuiz + 1);
      setPicked("");
    } else {
      await saveProgress({
        phase: "quizzes",
        currentLesson,
        currentQuiz,
        correctCount: newCorrectCount,
      });
      await completeCourse();
    }
  };

  if (loading || !course || !me) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-24">
        <div className="h-6 w-56 bg-yellow-100 rounded mb-3" />
        <div className="h-6 w-64 bg-yellow-50 rounded mb-3" />
        <div className="h-6 w-48 bg-yellow-50 rounded" />
      </div>
    );
  }

  // ===== Certificate bits =====
  const certId = makeSimpleCertId(user?.email, courseId);
  const completionDate = new Date().toLocaleDateString();
  const score =
    typeof finalMark === "number"
      ? finalMark
      : me?.completedCourseMarks?.[courseId] ?? null;

  const certificateDoc = (
    <CertificateDoc
      studentName={me?.name || "Student"}
      courseTitle={course?.title || "Course"}
      dateStr={completionDate}
      score={typeof score === "number" ? `${score}%` : "—"}
      certId={certId}
    />
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="rounded-2xl border border-yellow-200 bg-white p-4">
            <h2 className="text-xl font-extrabold text-black">
              {course.title}
            </h2>

            {/* Lessons list */}
            {lessonsCount > 0 && (
              <>
                <h3 className="mt-4 text-sm font-bold text-black/80">
                  Lessons
                </h3>
                <ul className="mt-2 space-y-2">
                  {lessons.map((l, i) => {
                    const st = statusOfLesson(i);
                    const locked = st === "locked";
                    const completed = st === "completed";
                    const current = st === "current";
                    return (
                      <li key={`lesson-${i}`}>
                        <button
                          onClick={() => selectLesson(i)}
                          disabled={!canOpenLesson(i)}
                          className={`w-full text-left rounded-lg px-3 py-2 border ${
                            current
                              ? "border-yellow-400 bg-yellow-50"
                              : "border-yellow-200 bg-white"
                          } ${
                            locked
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:bg-yellow-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-100 text-black">
                              L{i + 1}
                            </span>
                            <span className="flex-1 text-sm text-black">
                              {l?.title || `Lesson ${i + 1}`}
                            </span>
                            <span className="text-xs">
                              {completed ? "✅" : locked ? "🔒" : "▶️"}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {/* Quizzes list */}
            {quizzesCount > 0 && (
              <>
                <h3 className="mt-6 text-sm font-bold text-black/80">
                  Quizzes
                </h3>
                <ul className="mt-2 space-y-2">
                  {quizzes.map((q, i) => {
                    const st = statusOfQuiz(i);
                    const locked = st === "locked";
                    const completed = st === "completed";
                    const current = st === "current";
                    return (
                      <li key={`quiz-${i}`}>
                        <button
                          onClick={() => selectQuiz(i)}
                          disabled={!canOpenQuiz(i)}
                          className={`w-full text-left rounded-lg px-3 py-2 border ${
                            current
                              ? "border-yellow-400 bg-yellow-50"
                              : "border-yellow-200 bg-white"
                          } ${
                            locked
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:bg-yellow-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-100 text-black">
                              Q{i + 1}
                            </span>
                            <span className="flex-1 text-sm text-black">
                              {q?.question
                                ? q.question.slice(0, 60)
                                : `Quiz ${i + 1}`}
                              {q?.question && q.question.length > 60
                                ? "..."
                                : ""}
                            </span>
                            <span className="text-xs">
                              {completed ? "✅" : locked ? "🔒" : "▶️"}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </aside>

        {/* Content panel */}
        <main className="col-span-12 lg:col-span-8">
          <div className="rounded-2xl border border-yellow-200 bg-white p-6">
            {/* Header: progress summary */}
            <p className="text-black/70 text-sm mb-4">
              {phase === "lessons" &&
                `${currentLesson} of ${lessonsCount} lessons completed`}
              {phase === "quizzes" &&
                `${currentQuiz} of ${quizzesCount} quizzes completed`}
              {phase === "done" &&
                (typeof score === "number"
                  ? `Course completed • Score: ${score}%`
                  : "Course completed")}
            </p>

            {/* Lessons view */}
            {selectedType === "lesson" && lessonsCount > 0 && (
              <LessonView
                lesson={lessons[selectedIndex]}
                index={selectedIndex}
                isCurrent={
                  phase === "lessons" && selectedIndex === currentLesson
                }
                embedUrl={embedUrl}
                onMarkWatched={handleMarkLessonWatched}
              />
            )}

            {/* Quizzes view */}
            {selectedType === "quiz" && quizzesCount > 0 && (
              <QuizView
                quiz={quizzes[selectedIndex]}
                index={selectedIndex}
                phase={phase}
                isCurrent={phase === "quizzes" && selectedIndex === currentQuiz}
                picked={picked}
                setPicked={setPicked}
                correctIndexOf={correctIndexOf}
                onSubmit={handleSubmitQuizAnswer}
                finalMark={score}
              />
            )}

            {/* Done view + Certificate */}
            {phase === "done" && (
              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-black">
                  You finished this course
                  {typeof score === "number" ? ` • Score: ${score}%` : ""}. 🎉
                </div>

                {/* Preview the PDF in-page */}
                <div className="rounded-xl border border-yellow-200 overflow-hidden">
                  <PDFViewer style={{ width: "100%", height: 420 }}>
                    {certificateDoc}
                  </PDFViewer>
                </div>

                {/* Download button */}
                <PDFDownloadLink
                  document={certificateDoc}
                  fileName={`Learnly-Certificate-${
                    course?.title?.replace(/\s+/g, "_") || "Course"
                  }.pdf`}
                  className="inline-block rounded-lg bg-black px-4 py-2 text-white text-sm font-semibold hover:opacity-90"
                >
                  {({ loading: pdfLoading }) =>
                    pdfLoading ? "Preparing..." : "Download Certificate"
                  }
                </PDFDownloadLink>

                <div className="flex gap-3">
                  <Link
                    to="/courses"
                    className="rounded-lg bg-yellow-400 px-4 py-2 text-black text-sm font-semibold hover:bg-yellow-300"
                  >
                    Browse more courses
                  </Link>
                  <Link
                    to="/studentProfile"
                    className="rounded-lg bg-white px-4 py-2 text-black text-sm font-semibold border border-yellow-300"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ------- Small presentational helpers to keep file tidy ------- */

const LessonView = ({ lesson, index, isCurrent, embedUrl, onMarkWatched }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-black">Lesson {index + 1}</h3>
      <p className="mt-1 text-black/70">{lesson?.title || "Untitled lesson"}</p>

      {lesson?.url ? (
        lesson.url.includes("youtube.com") ||
        lesson.url.includes("youtu.be") ? (
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-yellow-200">
            <iframe
              className="w-full h-full"
              src={embedUrl(lesson.url)}
              title={lesson?.title || "Lesson"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <a
            href={lesson.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-black underline"
          >
            Open lesson
          </a>
        )
      ) : null}

      {isCurrent && (
        <button
          onClick={onMarkWatched}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white text-sm font-semibold hover:opacity-90"
        >
          Mark lesson as watched
        </button>
      )}
      {!isCurrent && (
        <p className="mt-3 text-xs text-black/60">
          You can rewatch completed lessons anytime.
        </p>
      )}
    </div>
  );
};

const QuizView = ({
  quiz,
  index,
  phase,
  isCurrent,
  picked,
  setPicked,
  correctIndexOf,
  onSubmit,
  finalMark,
}) => {
  const correctIdx = correctIndexOf(quiz);
  const isDone = phase === "done";

  return (
    <div>
      <h3 className="text-lg font-bold text-black">Quiz {index + 1}</h3>
      <p className="mt-1 text-black/80">{quiz?.question || "Untitled quiz"}</p>

      <div className="mt-3 space-y-2">
        {quiz?.options?.map((opt, i) => {
          const isCorrect = i === correctIdx;

          if (isDone) {
            return (
              <div
                key={i}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  isCorrect
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-white border-yellow-200"
                }`}
              >
                <span className="text-black">{opt}</span>
                {isCorrect && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-black">
                    Correct
                  </span>
                )}
              </div>
            );
          }

          return (
            <label
              key={i}
              className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-white px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="answer"
                checked={picked === `opt-${i}`}
                onChange={() => setPicked(`opt-${i}`)}
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>

      {isCurrent ? (
        <button
          onClick={onSubmit}
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white text-sm font-semibold hover:opacity-90"
        >
          Submit and continue
        </button>
      ) : isDone ? (
        <p className="mt-3 text-xs text-black/60">
          Course completed. Showing the answer key
          {typeof finalMark === "number" ? ` • Your score: ${finalMark}%` : ""}.
        </p>
      ) : (
        <p className="mt-3 text-xs text-black/60">
          You can view previous quizzes, but you must answer them in order.
        </p>
      )}
    </div>
  );
};

/* ---------------- Certificate (React-PDF) ---------------- */

// simple, semi-stable cert id for demo
function makeSimpleCertId(email = "", courseId = "") {
  const namePart = (email.split("@")[0] || "USER").slice(0, 4).toUpperCase();
  const coursePart = String(courseId).slice(-4).toUpperCase();
  return `LEARNLY-${namePart}-${coursePart}`;
}

const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  border: {
    borderWidth: 4,
    borderColor: "#FACC15", // yellow-400
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  brand: {
    fontSize: 18,
    color: "#111111",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    color: "#111111",
    marginTop: 6,
    fontWeight: 700,
  },
  body: {
    marginTop: 20,
  },
  label: {
    fontSize: 12,
    color: "#222222",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#000000",
    marginTop: 2,
  },
  bigName: {
    fontSize: 22,
    color: "#000000",
    marginTop: 10,
    fontWeight: 700,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  small: {
    fontSize: 10,
    color: "#555555",
  },
});

const CertificateDoc = ({
  studentName,
  courseTitle,
  dateStr,
  score,
  certId,
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.border}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.brand}>LEARNLY</Text>
          <Text style={pdfStyles.title}>Certificate of Completion</Text>
        </View>

        <View style={pdfStyles.body}>
          <Text style={pdfStyles.label}>This is to certify that</Text>
          <Text style={pdfStyles.bigName}>{studentName}</Text>

          <Text style={pdfStyles.label}>
            has successfully completed the course
          </Text>
          <Text style={pdfStyles.value}>{courseTitle}</Text>

          <Text style={pdfStyles.label}>Completion Date</Text>
          <Text style={pdfStyles.value}>{dateStr}</Text>

          <Text style={pdfStyles.label}>Final Score</Text>
          <Text style={pdfStyles.value}>{score}</Text>
        </View>

        <View style={pdfStyles.footerRow}>
          <Text style={pdfStyles.small}>Certificate ID: {certId}</Text>
          <Text style={pdfStyles.small}>Powered by Learnly</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ContinueCourse;
