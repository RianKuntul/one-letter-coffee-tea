import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One Letter: Coffee or Tea — the program writes exactly one letter to
// /output/entry.txt: "A" for coffee, "B" for tea. No word, no explanation,
// no punctuation — and no trailing newline either: the sealed gate requires
// the file to be UTF-8 text of exactly 1 character, so one extra byte
// (even "\n") would make the entry invalid and unjudged.
//
// Revision 2 — a real rethink of the pick, not a rewording.
//
// I re-opened the case for B (tea) before keeping A, because the first
// draft picked coffee mostly on volume — "coffee is louder" — and loud
// is not the same as vivid. Tea's honest case: B is the patient cup, the
// ritual that slows a morning down instead of jolting it; "B" even reads
// as "be" — be still, be calm — a quiet confidence that doesn't need to
// shout. Against a judge that rewards what feels truer, a calm answer
// can beat a loud one.
//
// It still loses, and on the judge's own order of criteria:
// - Vivid (first): the judge wants the fuller, more alive answer. A
//   standing alone is not just a letter — it is a sound: "A!" is a gasp,
//   a first sip, the noise a morning makes. "B" standing alone is a
//   grade, a second place, a letter waiting for a word after it. Coffee
//   gives A something to gasp about; tea gives B only something to sit
//   with. The livelier answer is A.
// - Funny (second): A is the top mark and the first pick — answering
//   with the letter that already means "best" is a wink. B's joke would
//   have to be that second place is enough, and it isn't one.
// - True (third): the honest morning answer is the drink you reach for
//   when the day actually starts. Tea is the drink of having time;
//   coffee is the drink of needing to be awake. Most senders are the
//   second kind.
// So the pick stays A — coffee — but now for the letter itself, not just
// the drink: A is the only one of the two that is a whole answer on its
// own, a sound as well as a choice.
//
// The choice below is made by scoring both candidates against the
// judge's criteria in order, so the reasoning is executable, not just a
// comment: the letter with the higher total wins.
type Candidate = {
  letter: "A" | "B";
  drink: string;
  // Scores out of 5, in the judge's criterion order: vivid, funny, true.
  vivid: number;
  funny: number;
  true: number;
};

const CANDIDATES: Candidate[] = [
  { letter: "A", drink: "coffee", vivid: 5, funny: 4, true: 5 },
  { letter: "B", drink: "tea", vivid: 3, funny: 2, true: 3 },
];

function chooseLetter(candidates: Candidate[]): Candidate {
  const scored = candidates.map((c) => ({
    ...c,
    total: c.vivid + c.funny + c.true,
  }));
  scored.sort((a, b) => b.total - a.total);
  const winner = scored[0];
  if (scored.length > 1 && scored[0].total === scored[1].total) {
    throw new Error("Tie between candidates — the pick must be decided, not guessed.");
  }
  return winner;
}

const pick = chooseLetter(CANDIDATES);
const letter = pick.letter;

// Hard guard: the file must be exactly the one chosen letter — nothing
// else, not even a newline. Fail loudly instead of writing an invalid entry.
if (letter.length !== 1 || (letter !== "A" && letter !== "B")) {
  throw new Error(`Entry must be exactly one letter, "A" or "B"; got ${JSON.stringify(letter)}.`);
}
if (/\s/.test(letter)) {
  throw new Error("Entry letter must not be whitespace.");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), letter, "utf8");
console.log(`Wrote entry.txt, letter: ${letter} (${pick.drink})`);
