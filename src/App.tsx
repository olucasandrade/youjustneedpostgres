import { Hero } from "./components/Hero/Hero";
import { CrimeScene } from "./components/CrimeScene/CrimeScene";
import { Manifesto } from "./components/Manifesto/Manifesto";
import { Simulator } from "./components/Simulator/Simulator";
import { ReplaceYourStack } from "./components/ReplaceYourStack/ReplaceYourStack";
import { HonestExceptions } from "./components/HonestExceptions/HonestExceptions";
import { ExtensionsShelf } from "./components/ExtensionsShelf/ExtensionsShelf";
import { GitHubStars } from "./components/GitHubStars/GitHubStars";
import { Closer } from "./components/Closer/Closer";

export default function App() {
  const isMobile = window.innerWidth < 768;
  return (
    <main className="grain-overlay bg-dark min-h-screen overflow-x-hidden">
      <Hero />
      <div className="w-full max-w-5xl mx-auto px-2">
        <hr className="border-dark-border/50" />
      </div>
      {
        isMobile ? (
          null
        ) : (
          <CrimeScene />
        )
      }
      <Manifesto />
      <Simulator />
      <ReplaceYourStack />
      <HonestExceptions />
      <ExtensionsShelf />
      <GitHubStars />
      <Closer />
    </main>
  );
}
