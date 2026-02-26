import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const REPO = "olucasandrade/youjustneedpostgres";
const REPO_URL = `https://github.com/${REPO}`;

export function GitHubStars() {
  const { ref, isInView } = useScrollReveal({ margin: "-100px" });
  const [stars, setStars] = useState<number>(0);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-5xl text-text-bright tracking-wide mb-4">
            STAR ON GITHUB.
          </h2>
          <p className="text-text-dim text-sm sm:text-base max-w-lg mx-auto mb-8">
            If this convinced you (or at least made you laugh), star the repo.
            Spread the gospel of the elephant.
          </p>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-dark-border bg-dark-surface hover:border-amber/50 hover:bg-amber/5 transition-all duration-300 group"
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-5 h-5 text-text-dim group-hover:text-text transition-colors"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="font-mono text-sm text-text group-hover:text-text-bright transition-colors">
              {REPO.split("/")[1]}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-bold font-mono">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              <span className="mt-0.5">
                {stars.toLocaleString()}
              </span>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
