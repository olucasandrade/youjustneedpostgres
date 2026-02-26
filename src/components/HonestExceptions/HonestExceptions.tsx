import { motion } from "framer-motion";

export function HonestExceptions() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  const timeStr = `${h12}:${m} ${period}`;

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright tracking-wide mb-8 text-center">
          THE HONEST EXCEPTIONS.
        </h2>
        <div className="border border-dark-border rounded-xl p-6 sm:p-10 bg-dark-card/30 space-y-5 text-sm sm:text-base text-text-dim leading-relaxed">
          <p>
            Fine. There are edge cases.
          </p>
          <p>
            If you're <strong className="text-text-bright">Spotify</strong> and
            doing petabytes of event streaming? Yeah, get Kafka. If you're{" "}
            <strong className="text-text-bright">Google</strong> and serving 10
            billion vector queries a day? Pinecone might make sense.
          </p>
          <p>
            But you're not Spotify. And you're definitely not Google.
          </p>
          <p className="text-electric font-medium">
            You're reading a rant website at {timeStr}. Just use Postgres.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
