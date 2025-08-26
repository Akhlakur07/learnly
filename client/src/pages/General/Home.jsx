import React from "react";
import { Link } from "react-router";
import Lottie from "lottie-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  PlayCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
} from "lucide-react";
import bannerLottie from "../../assets/lottie/STUDENT.json";

// Animation helpers
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 * i },
  }),
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-black px-[15%] pt-16">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(250,204,21,0.25),transparent_60%)]" />
        {/* blurred blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-yellow-300/40 blur-3xl" />
        <div className="absolute bottom-0 left-[-5%] h-64 w-64 rounded-full bg-yellow-200/40 blur-2xl" />
        {/* subtle grid */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-[0.08] bg-[linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-10 md:pt-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Copy */}
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-4 w-4" />
                Learnly • Learn by building
              </div>

              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                Learn faster with
                <span className="mx-2 bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                  Learnly
                </span>
              </h1>

              <p className="mt-4 md:text-lg text-black/70 max-w-xl">
                Courses you can actually finish. Watch concise lessons, practice
                with quizzes, and track your progress in real time.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-5 py-3 font-semibold shadow-sm hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition"
                >
                  <PlayCircle className="h-5 w-5" /> Browse Courses
                </Link>
                <Link
                  to="/addCourse"
                  className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-black px-5 py-3 font-semibold shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition"
                >
                  Create a Course <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Quick trust / stats */}
              <div className="mt-8 grid grid-cols-3 max-w-md gap-4">
                <Stat kpi="120+" label="Videos" />
                <Stat kpi="40+" label="Quizzes" />
                <Stat kpi="4.9★" label="Avg. rating" />
              </div>
            </motion.div>

            {/* Lottie visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-yellow-200 bg-gradient-to-b from-yellow-50 to-white p-3 md:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <Lottie
                  animationData={bannerLottie}
                  loop
                  className="w-full h-[320px] md:h-[460px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="container mx-auto px-4 mt-14">
        <div className="grid md:grid-cols-3 gap-6">
          <Feature
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Project-based"
            desc="Build real projects so concepts stick. No fluff."
          />
          <Feature
            icon={<Shield className="h-5 w-5" />}
            title="Structured & reliable"
            desc="Clear paths, quizzes, and progress tracking."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="Instructor-led"
            desc="Learn from experienced instructors who ship."
          />
        </div>
      </section>

      {/* CTA BAND */}
      <section className="container mx-auto px-4 my-16">
        <div className="relative overflow-hidden rounded-3xl border border-yellow-300 bg-yellow-50">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(1200px_200px_at_10%_0%,#000,transparent)]" />
          <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold">
                Start teaching on Learnly
              </h3>
              <p className="mt-2 text-black/70 max-w-2xl">
                Turn your expertise into a world-class course. Upload videos,
                add quizzes, and publish with one click.
              </p>
            </div>
            <Link
              to="/addCourse"
              className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-5 py-3 font-semibold shadow-sm hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition"
            >
              Create a Course <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="pb-10 px-4">
        <div className="container mx-auto text-center text-sm text-black/60">
          © {new Date().getFullYear()} Learnly. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ kpi, label }) => (
  <div className="rounded-2xl border border-yellow-200 bg-white p-4 text-center shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
    <div className="text-2xl font-extrabold">{kpi}</div>
    <div className="text-xs text-black/60 mt-1">{label}</div>
  </div>
);

const Feature = ({ icon, title, desc }) => (
  <div className="group rounded-2xl border border-yellow-200 bg-white p-6 shadow-[0_8px_22px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
    <div className="w-10 h-10 rounded-xl bg-yellow-300 flex items-center justify-center text-black">
      {icon}
    </div>
    <h4 className="mt-4 text-lg font-semibold">{title}</h4>
    <p className="mt-1 text-black/70">{desc}</p>
  </div>
);

export default Home;
