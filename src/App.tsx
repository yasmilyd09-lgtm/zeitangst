import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Clock3, Hourglass, Sparkles, UserRound, BookOpen, FileText, Quote } from "lucide-react";

const participants = [
  // Wenn du die Bilder lokal einfügst, lege sie im public-Ordner ab:
  // /arslan.jpg, /alexandra.jpg, /lyudmila.jpg
  // Dann werden sie hier automatisch angezeigt.
  {
    id: 1,
    name: "Aurora",
    age: 8,
    ageLabel: "Kindheit",
    summary:
      "Zeit wird sehr direkt erlebt: Beim Spielen vergeht sie schnell, Langeweile ist doof. Zeit wird vor allem über unmittelbare Gefühle wahrgenommen.",
    keywords: ["Spielen", "Langeweile", "Kindheit"],
    color: "from-pink-100 to-amber-50",
    psychology:
      "Beim Spielen vergeht Zeit schnell. Momentan fühlt sich Zeit eher langsam an. Langeweile ist doof; wenn sie aufkommt, isst Aurora Süssigkeiten.",
    pedagogy:
      "Langeweile braucht es ihrer Meinung nach nicht und ist eher negativ.",
    philosophy:
      "Für sie ist eine falsche Entscheidung schlimmer als gar keine Entscheidung.",
    excerpt: "Beim Spielen vergeht Zeit schnell.",
    image: null,
  },
  {
    id: 2,
    name: "Cyrill",
    age: 14,
    ageLabel: "Jugend",
    summary:
      "Spass macht Zeit schnell, Schule langsam. Social Media, Lehrstellendruck und die Angst, etwas zu verpassen, prägen sein Zeiterleben.",
    keywords: ["Schule", "Spass", "Social Media", "FOMO"],
    color: "from-sky-100 to-blue-50",
    psychology:
      "Spass bedeutet für Cyrill: Zeit vergeht schnell. Langeweile in der Schule bedeutet: Zeit vergeht langsam. Seine Lebenszeit wird ihm kaum bewusst, aber etwas zu verpassen findet er schlimmer als älter zu werden.",
    pedagogy:
      "Druck spürt er besonders im Blick auf die Lehrstelle. Den grössten Timedruck sieht er bei Jugendlichen. Die Idee des richtigen Zeitpunkts kommt für ihn stark von Social Media.",
    philosophy:
      "Zeit ist für ihn eher Ressource als Feind. Vergänglichkeit bedeutet ihm nicht sehr viel. Keine Entscheidung zu treffen findet er schlimmer als eine falsche.",
    excerpt: "Spass = schnell, Langeweile in der Schule = langsam.",
    image: null,
  },
  {
    id: 3,
    name: "Arslan",
    age: 19,
    ageLabel: "Junges Erwachsenenalter",
    summary:
      "Zeit erscheint gleichzeitig relativ, bedrängend und existenziell. Zwischen Uni, Aufschieben, verpassten Erfahrungen und Vergänglichkeitsdenken wird Zeit fast zum Gegner.",
    keywords: ["Uni", "ADHS", "Aufschieben", "Vergänglichkeit"],
    color: "from-violet-100 to-fuchsia-50",
    psychology:
      "Im Zug spürt Arslan Zeit je nach Tätigkeit unterschiedlich: Arbeit zieht sie in die Länge, Musik lässt sie schneller vergehen. Zeit fühlt sich momentan sehr schnell an. Langeweile ist unangenehm und kann zu Gedankenspiralen führen. Die begrenzte Lebenszeit ist ihm praktisch immer bewusst.",
    pedagogy:
      "Deadlines und soziale Vergleiche erzeugen Druck, auch wenn er früher stärker war. Für jüngere Menschen wirken Zeitabschnitte grösser, weil sie einen grösseren Anteil des bisherigen Lebens ausmachen. Den objektiv richtigen Zeitpunkt glaubt er nicht – eher an die ständige Illusion, dass morgen besser wäre.",
    philosophy:
      "Zeit ist für ihn eher Feind als Ressource, weil sie vergeht, während man versucht, sie zu managen. Vergänglichkeit bewertet er nicht negativ, sondern sogar als befreiend. Perfektion und den perfekten Zeitpunkt hält er für absurde Ideen.",
    excerpt: "Zeit ist für mich eher etwas, gegen das man ankämpfen muss.",
    image: "/arslan.jpg",
  },
  {
    id: 4,
    name: "Alexandra",
    age: 40,
    ageLabel: "Erwachsenenalter",
    summary:
      "Zeit ist verdichtet, vollgepackt und eng mit Potenzial verbunden. Zwischen Struktur, Optimierungsdruck und einer fast poetischen Sicht auf Vergänglichkeit entsteht starke Ambivalenz.",
    keywords: ["Potenzial", "Struktur", "Deadlines", "Vergänglichkeit"],
    color: "from-emerald-100 to-teal-50",
    psychology:
      "Für Alexandra vergeht Zeit fast immer zu schnell, weil sie sich zu viel einplant. Langeweile fühlt sich wie innerer Druck an. Die begrenzte Lebenszeit wird ihr durch das Älterwerden bewusster, vor allem als Verlust von Möglichkeiten und Potenzial.",
    pedagogy:
      "Sie arbeitet stark mit Struktur: Post-its, Journals, To-do-Listen. Gesellschaftlicher Druck prägt für sie stark, wann etwas im Leben angeblich rechtzeitig ist. Gleichzeitig sieht sie in Langeweile auch einen wichtigen Raum für Entspannung und mentale Gesundheit.",
    philosophy:
      "Zeit ist für sie kein Feind, sondern Potenzial – wie eine leere Leinwand. Vergänglichkeit findet sie schön, weil Dinge in anderer Form weitergehen können. Begrenzte Zeit verleiht Handlungen Bedeutung.",
    excerpt: "Zeit ist Potenzial. Sie ist wie eine leere Leinwand.",
    image: "/alexandra.jpg",
  },
  {
    id: 5,
    name: "Lyudmila",
    age: 49,
    ageLabel: "Mitte des Lebens",
    summary:
      "Zeit wirkt heute schneller und knapper als früher. Ihre Haltung ist pragmatisch: viel äusserer Druck, klare Pflichten, aber auch nüchterne Akzeptanz von Vergänglichkeit.",
    keywords: ["Pflichten", "äusserer Druck", "Akzeptanz", "Gebrechlichkeit"],
    color: "from-orange-100 to-rose-50",
    psychology:
      "Zeit vergeht für Lyudmila eher schneller. Seit dem Smartphone kennt sie fast keine Langeweile mehr. Die Endlichkeit des Lebens wird ihr vor allem bei Todesfällen oder schlimmen Nachrichten bewusst. Mehr Angst macht ihr das Älterwerden und die mögliche Abhängigkeit als das Verpassen von Chancen.",
    pedagogy:
      "Druck erlebt sie klar von aussen: durch Bürokratie, Fristen und die Beschleunigung des Alltags. Für junge Menschen scheint Zeit offener; mit mehr Verantwortung steigt der Druck, Dinge rechtzeitig zu schaffen.",
    philosophy:
      "Vergänglichkeit ist für sie ein natürlicher Zustand: Etwas vergeht, etwas Neues kommt. Einen perfekten Zeitpunkt gibt es nicht wirklich; er wird meist von aussen diktiert. Unendliche Zeit würde ihr eher Angst machen.",
    excerpt: "Etwas vergeht, etwas kommt neu.",
    image: "/lyudmila.jpg",
  },
  {
    id: 6,
    name: "Nonna",
    age: 74,
    ageLabel: "Hohes Alter",
    summary:
      "Zeit vergeht sehr schnell, aber ohne eigentliche Angst. Vertrauen, Gegenwart und Glaube tragen ihre Zeitwahrnehmung stärker als Druck oder Vergänglichkeitsfurcht.",
    keywords: ["Glaube", "Gelassenheit", "Gegenwart", "kein Todesangst"],
    color: "from-stone-100 to-slate-50",
    psychology:
      "In den letzten Jahren vergeht Zeit für Nonna sehr schnell. Langeweile kennt sie kaum, weil immer etwas zu tun ist. Vor dem Tod hat sie keine Angst; sie ist mit sich selbst eher zufrieden.",
    pedagogy:
      "Sie sieht grossen Druck besonders auf junge Leute, verstärkt durch Medien. Früher habe es mehr Freiheiten und weniger Zeitstress gegeben. Langeweile empfindet sie zwar als schlecht, aber Ruhe findet sie wichtig.",
    philosophy:
      "Vergänglichkeit gehört zum Leben und macht ihr keine Angst. Gott bleibt für immer. Für alles gibt es einen richtigen Zeitpunkt, aber Menschen können ihn nicht wissen.",
    excerpt: "Gott vertrauen. Alles wird richtig kommen.",
    image: null,
  },
];

const interviewQuestions = [
  {
    q: "Wann spürst du besonders stark, dass Zeit schnell oder langsam vergeht?",
    answers: [
      { age: 8, name: "Aurora", text: "Beim Spielen vergeht Zeit schnell." },
      { age: 14, name: "Cyrill", text: "Spass = schnell, Langeweile in der Schule = langsam." },
      { age: 19, name: "Arslan", text: "Im Zug: Arbeit macht Zeit lang, Musik lässt sie schnell vergehen." },
      { age: 40, name: "Alexandra", text: "Eigentlich immer zu schnell, weil ich mir zu viel einplane." },
      { age: 49, name: "Lyudmila", text: "Eher schneller – manchmal merkt man plötzlich: Heute ist schon Montag?" },
      { age: 74, name: "Nonna", text: "In den letzten Jahren geht Zeit sehr schnell vorbei." },
    ],
  },
  {
    q: "Wie fühlt sich Langeweile an – und wie gehst du mit ihr um?",
    answers: [
      { age: 8, name: "Aurora", text: "Langeweile ist doof. Dann esse ich Süssigkeiten." },
      { age: 14, name: "Cyrill", text: "Neutral bis schlecht. Dann gehe ich ans Handy." },
      { age: 19, name: "Arslan", text: "Unangenehm, mit Gedankenspiralen. Manchmal lenke ich mich mental selbst ab." },
      { age: 40, name: "Alexandra", text: "Wie innerer Druck. Ich plane Dinge, nehme ein Buch mit oder fülle die Wartezeit." },
      { age: 49, name: "Lyudmila", text: "Heute fast nie mehr, wegen Internet, Hörbuch, Nachrichten oder Kochen." },
      { age: 74, name: "Nonna", text: "Eigentlich habe ich keine Langeweile, es ist immer etwas zu tun." },
    ],
  },
  {
    q: "Gibt es für dich den perfekten oder richtigen Zeitpunkt?",
    answers: [
      { age: 8, name: "Aurora", text: "Nicht ausdrücklich thematisiert." },
      { age: 14, name: "Cyrill", text: "Eher eine Idee, die stresst." },
      { age: 19, name: "Arslan", text: "Nein – eher die Hoffnung, dass morgen günstiger ist als heute." },
      { age: 40, name: "Alexandra", text: "Grösstenteils ein Konstrukt, das uns stressen kann." },
      { age: 49, name: "Lyudmila", text: "Nein, er wird von Leben, Gesellschaft und Umständen diktiert." },
      { age: 74, name: "Nonna", text: "Ja, es gibt ihn – aber Menschen können nicht wissen, wann er ist." },
    ],
  },
  {
    q: "Was macht dir mehr Angst: Älterwerden oder etwas zu verpassen?",
    answers: [
      { age: 8, name: "Aurora", text: "Nicht ausdrücklich beantwortet." },
      { age: 14, name: "Cyrill", text: "Etwas zu verpassen." },
      { age: 19, name: "Arslan", text: "Etwas zu verpassen – vor allem Erfahrungen, die andere längst gemacht haben." },
      { age: 40, name: "Alexandra", text: "Vor allem Potenzial und Möglichkeiten zu verpassen." },
      { age: 49, name: "Lyudmila", text: "Älterwerden und Gebrechlichkeit machen mehr Angst." },
      { age: 74, name: "Nonna", text: "Eigentlich keines von beidem stark – sie wirkt eher zufrieden und gelassen." },
    ],
  },
];

const transcriptQuestionTemplate = {
  psychology: [
    "Wann spürst du besonders stark, dass Zeit schnell oder langsam vergeht?",
    "Fühlt sich Zeit momentan in deinem Leben eher schnell oder langsam an?",
    "Hat sich dein Gefühl für Zeit im Laufe deines Lebens verändert?",
    "Warum denkst du ist das so?",
    "Wie fühlt es sich an, wenn du Langeweile verspürst?",
    "Wie gehst du mit Langeweile um? (Lässt du sie auf dich einwirken?)",
    "Gibt es Situationen, in denen dir deine begrenzte Lebenszeit bewusst wird?",
    "Wie gehst du damit um?",
    "Wovor hast du mehr Angst: vor dem Älterwerden oder davor, etwas zu verpassen?",
    "Kennst du das Gefühl, auf den „perfekten Zeitpunkt“ zu warten, um etwas zu starten oder zu entscheiden?",
    "Gibt es Entscheidungen, bei denen du zu lange gewartet hast — und warum?",
  ],
  pedagogy: [
    "Spürst du Druck, bestimmte Dinge „rechtzeitig“ erreichen zu müssen?",
    "Wie gehst du mit diesem Druck um? (Terminkalender, Wecker, ...)",
    "Denkst du das jemand älteres/jüngeres eine andere Wahrnehmung von Zeit & dessen Vergehen als zu hast?",
    "Glaubst du, dass unsere Gesellschaft Angst vor dem Altern hat oder so diese Normalisiert?",
    "Warum denkst du ist das so?",
    "Gibt es Lebensphasen, in denen Langeweile wichtig ist (für Entwicklung, Kreativität)? Oder ist sie eher „negativ“?",
    "Woher kommt bei dir die Idee, dass es für bestimmte Dinge einen „richtigen Zeitpunkt“ gibt? (Schule, Eltern, Social Media, Freunde, Kultur)",
    "Hast du das Gefühl, deine Umgebung bewertet dich danach, ob du Dinge „rechtzeitig“ machst?",
    "Gibt es bei deiner Generation (oder bei Älteren/Jüngeren) mehr Druck, ständig „richtig“ zu timen? Warum?",
  ],
  philosophy: [
    "Ist die Zeit für dich eher “Feind” oder “Ressource”?",
    "Was bedeuted LAngeweile für dich persönlich?",
    "Wie bewertest du sie?",
    "Was bedeutet Vergänglichkeit für dich persönlich?",
    "Wie bewertest du sie?",
    "Macht dir der Gedanke Angst, dass alles im Leben vergänglich ist?",
    "Warum oder warum nicht?",
    "Gibt es etwas, das deiner Meinung für immer bleibt?",
    "Würde sich dein Leben verändern, wenn Zeit unbegrenzt wäre?",
    "Wenn es kein Ende gäbe: Würde etwas überhaupt noch Bedeutung haben?",
    "Wenn Zeit unbegrenzt wäre: Würde es dann überhaupt noch „Kairos“ geben (einen bedeutsamen Moment)?",
    "Glaubst du, es gibt wirklich „den perfekten Zeitpunkt“ oder ist das eher eine Idee, die uns stresst?",
    "Was ist schlimmer: eine falsche Entscheidung zu treffen oder gar keine Entscheidung zu treffen?",
    "Was macht einen Moment für dich „richtig“: Gefühl, Logik, Mut, äußere Umstände?",
  ],
};

const similarityQuiz = [
  {
    question: "Wie fühlt sich ein freier Nachmittag für dich am ehesten an?",
    options: [
      { text: "Ich will einfach spielen oder spontan machen, worauf ich Lust habe.", weights: [3, 0, 0, 0, 0, 0] },
      { text: "Kommt drauf an – mit Spass vergeht er schnell, ohne zieht er sich.", weights: [0, 3, 0, 0, 0, 0] },
      { text: "Ich denke schnell daran, was ich noch machen sollte, und schiebe manches trotzdem auf.", weights: [0, 1, 3, 0, 0, 0] },
      { text: "Ich fülle ihn mit Projekten, Ideen und To-do-Listen.", weights: [0, 0, 1, 3, 0, 0] },
      { text: "Ich erledige lieber direkt, was ansteht, statt lange zu warten.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Ich nehme ihn eher ruhig und vertraue darauf, dass alles seinen Weg hat.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
  {
    question: "Was löst Langeweile bei dir am ehesten aus?",
    options: [
      { text: "Sie ist einfach doof und ich will sofort etwas anderes.", weights: [3, 0, 0, 0, 0, 0] },
      { text: "Ich greife meist einfach direkt zum Handy.", weights: [0, 3, 0, 0, 0, 0] },
      { text: "Sie ist unangenehm und kann mich gedanklich richtig runterziehen.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Sie fühlt sich wie innerer Druck an; ich plane dann etwas ein.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Eigentlich kommt sie kaum vor, weil ich mich immer beschäftigen kann.", weights: [0, 0, 0, 0, 3, 1] },
      { text: "Ich kenne sie fast nicht mehr oder deute sie eher als Ruhefrage.", weights: [0, 0, 0, 0, 1, 3] },
    ],
  },
  {
    question: "Was beschreibt dein Verhältnis zur Zukunft am besten?",
    options: [
      { text: "Ich denke darüber noch nicht so gross nach.", weights: [3, 0, 0, 0, 0, 0] },
      { text: "Wichtiger ist für mich, nichts zu verpassen.", weights: [0, 3, 1, 0, 0, 0] },
      { text: "Ich spüre Endlichkeit stark und denke viel über verpasste Erfahrungen nach.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Ich will Potenzial nicht verlieren und Dinge nicht zu spät tun.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Ich mache mir eher Sorgen um Abhängigkeit, Pflichten und das Älterwerden.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Ich vertraue darauf, dass es richtig kommen wird.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
  {
    question: "Welche Aussage über Vergänglichkeit passt am besten zu dir?",
    options: [
      { text: "Darüber denke ich kaum nach.", weights: [2, 1, 0, 0, 0, 0] },
      { text: "Sie ist einfach da – man kann eh nichts machen.", weights: [0, 2, 1, 0, 0, 0] },
      { text: "Sie ist befreiend, weil sowieso nichts bleibt.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Sie ist traurig und schön zugleich – etwas kann in anderer Form weiterleben.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Etwas vergeht, etwas Neues kommt. Das ist normal.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Sie gehört zum Leben, aber ich vertraue dabei auf etwas Grösseres.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
  {
    question: "Was stresst dich am meisten am falschen Zeitpunkt?",
    options: [
      { text: "Dass etwas keinen Spass macht oder zu lange dauert.", weights: [2, 1, 0, 0, 0, 0] },
      { text: "Dass andere weiter sind oder ich etwas verpasse.", weights: [0, 3, 1, 0, 0, 0] },
      { text: "Dass ich wieder alles bis morgen aufschiebe.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Dass ich nie das Gefühl habe, etwas sei wirklich fertig.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Dass äussere Umstände, Fristen und Bürokratie den Takt vorgeben.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Dass Menschen glauben, sie könnten den richtigen Zeitpunkt ganz kontrollieren.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
];

const theoryQuiz = [
  {
    question: "Wie würdest du Zeit am ehesten verstehen?",
    options: [
      { text: "Als etwas Inneres: Zeit zeigt sich in Erinnerung, Aufmerksamkeit und Erwartung.", theory: "Augustinus" },
      { text: "Als Herausforderung, mit dem Unkontrollierbaren gelassen umzugehen.", theory: "Marcus Aurelius" },
      { text: "Als Struktur, durch die wir Welt überhaupt erleben und ordnen.", theory: "Kant" },
      { text: "Als existenzielle Frage: Wie lebe ich trotz Vergänglichkeit intensiv?", theory: "Nietzsche" },
    ],
  },
  {
    question: "Welche Aussage über Zeitangst spricht dich am meisten an?",
    options: [
      { text: "Zeitangst entsteht, wenn Vergangenheit, Gegenwart und Zukunft innerlich auseinanderdriften.", theory: "Augustinus" },
      { text: "Zeitangst kann gemildert werden, wenn ich mich auf meine Haltung konzentriere.", theory: "Marcus Aurelius" },
      { text: "Zeitangst zeigt, wie stark wir versuchen, Erfahrung überhaupt zu strukturieren.", theory: "Kant" },
      { text: "Zeitangst ist ein Anstoss, mutiger zu leben statt nur zu warten.", theory: "Nietzsche" },
    ],
  },
  {
    question: "Was macht einen bedeutsamen Moment am ehesten aus?",
    options: [
      { text: "Innere Aufmerksamkeit im Jetzt.", theory: "Augustinus" },
      { text: "Eine bewusste, ruhige Haltung.", theory: "Marcus Aurelius" },
      { text: "Die Form, in der Erfahrung für uns überhaupt möglich wird.", theory: "Kant" },
      { text: "Mut, Bejahung und Entscheidung trotz Endlichkeit.", theory: "Nietzsche" },
    ],
  },
  {
    question: "Welche Frage passt am ehesten zu deiner Reflexion?",
    options: [
      { text: "Wie erlebe ich Zeit in meinem Inneren?", theory: "Augustinus" },
      { text: "Was liegt in meiner Macht – und was nicht?", theory: "Marcus Aurelius" },
      { text: "Wie prägt Zeit überhaupt mein Erkennen?", theory: "Kant" },
      { text: "Würde ich mein Leben trotz allem bejahen?", theory: "Nietzsche" },
    ],
  },
];

const theoryDescriptions = {
  Augustinus: {
    title: "Augustinus – Zeit als inneres Erleben",
    text: "Bei Augustinus lebt Zeit im Bewusstsein: Vergangenheit als Erinnerung, Gegenwart als Aufmerksamkeit, Zukunft als Erwartung. Das passt stark zu subjektiver Zeitwahrnehmung und dazu, wie Angst vor Zeit im Inneren entsteht.",
  },
  "Marcus Aurelius": {
    title: "Marcus Aurelius – Haltung statt Kontrolle",
    text: "Die stoische Perspektive fragt, was in unserer Macht liegt. Zeitangst wird nicht geleugnet, aber durch innere Haltung und Akzeptanz bearbeitet. Das passt gut zu Gelassenheit gegenüber dem Unvermeidlichen.",
  },
  Kant: {
    title: "Kant – Zeit als Form der Erfahrung",
    text: "Bei Kant ist Zeit keine Sache draussen in der Welt, sondern eine Form unseres Anschauens. Damit lässt sich zeigen, dass jede Wahrnehmung von Zeit immer schon durch menschliche Erkenntnisbedingungen geprägt ist.",
  },
  Nietzsche: {
    title: "Nietzsche – Vergänglichkeit als Lebensfrage",
    text: "Nietzsche ist stark für euer Thema, weil Zeit hier zur existenziellen Herausforderung wird: Wie lebe ich angesichts von Endlichkeit, Wiederholung und Vergänglichkeit? Zeitangst wird zur Frage nach Lebensbejahung und Mut.",
  },
};

function scoreSimilarity(answers) {
  const totals = new Array(participants.length).fill(0);
  answers.forEach((answerIndex, qIndex) => {
    if (answerIndex == null) return;
    const weights = similarityQuiz[qIndex].options[answerIndex].weights;
    weights.forEach((weight, idx) => {
      totals[idx] += weight;
    });
  });
  const max = Math.max(...totals);
  const winnerIndex = max > 0 ? totals.indexOf(max) : 0;
  return { winner: participants[winnerIndex], totals };
}

function scoreTheory(answers) {
  const totals = {};
  answers.forEach((answerIndex, qIndex) => {
    if (answerIndex == null) return;
    const theory = theoryQuiz[qIndex].options[answerIndex].theory;
    totals[theory] = (totals[theory] || 0) + 1;
  });
  const winner = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "Augustinus";
  return { winner, totals };
}

function SectionTitle({ icon: Icon, eyebrow, title, text }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="max-w-3xl text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function PersonDetailDialog({ selected, setSelected }) {
  return (
    <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selected && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{selected.name} · {selected.age} Jahre</DialogTitle>
              <DialogDescription>{selected.ageLabel}</DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {selected.image && (
                <div className="overflow-hidden rounded-2xl border bg-slate-50">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="h-[360px] w-full object-cover"
                  />
                </div>
              )}

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Verdichtete Zeitwahrnehmung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">{selected.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="rounded-full">{keyword}</Badge>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 border">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Quote className="h-4 w-4" />
                      <span>Prägnantes Zitat</span>
                    </div>
                    <p className="italic text-slate-800">„{selected.excerpt}“</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-5 md:grid-cols-3">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">Psychologie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed text-sm">{selected.psychology}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">Pädagogik</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed text-sm">{selected.pedagogy}</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">Philosophie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed text-sm">{selected.philosophy}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TimelineSection() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="zeitstrahl" className="space-y-8">
      <SectionTitle
        icon={Clock3}
        eyebrow="Visualisierung 1"
        title="Zeitstrahl der Interviewpersonen"
        text="Die sechs Interviews liegen auf einem Lebenszeitstrahl. Beim Anklicken öffnet sich zuerst eine Verdichtung und dann die Ausfaltung in Psychologie, Pädagogik und Philosophie."
      />

      <div className="relative rounded-3xl border bg-white p-6 md:p-8 shadow-sm overflow-hidden">
        <div className="absolute left-6 right-6 top-1/2 hidden md:block h-1 -translate-y-1/2 rounded-full bg-slate-200" />
        <div className="relative grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
          {participants.map((person) => (
            <motion.button
              key={person.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(person)}
              className="relative flex flex-col items-center gap-3 text-center"
            >
              <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-lg">
                <UserRound className="h-6 w-6" />
              </div>
              <div className={`rounded-2xl border bg-gradient-to-b ${person.color} px-3 py-3 shadow-sm w-full min-h-[140px] flex flex-col justify-center overflow-hidden`}>
                {person.image ? (
                  <img src={person.image} alt={person.name} className="mb-3 h-28 w-full rounded-xl object-cover" />
                ) : (
                  <div className="mb-3 flex h-28 w-full items-center justify-center rounded-xl bg-white/60 text-xs text-slate-400">
                    kein Bild
                  </div>
                )}
                <div className="text-xs text-slate-500">{person.ageLabel}</div>
                <div className="font-semibold text-slate-900 text-lg">{person.name}</div>
                <div className="text-sm text-slate-700">{person.age} Jahre</div>
                <div className="text-xs text-slate-600 mt-2 leading-relaxed">{person.excerpt}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <PersonDetailDialog selected={selected} setSelected={setSelected} />
    </section>
  );
}

function QuestionsSection() {
  return (
    <section id="fragen" className="space-y-8">
      <SectionTitle
        icon={BookOpen}
        eyebrow="Visualisierung 2"
        title="Interviewfragen mit Antworten nach Alter"
        text="Hier stehen zuerst die Fragen im Raum. Erst beim Öffnen erscheinen die Antworten – geordnet entlang des Alters und damit entlang verschiedener Lebensphasen."
      />

      <Accordion type="single" collapsible className="space-y-4">
        {interviewQuestions.map((question, idx) => (
          <AccordionItem key={idx} value={`q-${idx}`} className="rounded-2xl border bg-white px-5 shadow-sm">
            <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
              {question.q}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {question.answers
                  .slice()
                  .sort((a, b) => a.age - b.age)
                  .map((answer) => (
                    <div key={`${idx}-${answer.name}-${answer.age}`} className="rounded-xl bg-slate-50 p-4 border">
                      <div className="text-sm text-slate-500">{answer.age} Jahre · {answer.name}</div>
                      <div className="text-slate-800 mt-1">{answer.text}</div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function SimilarityQuizSection() {
  const [answers, setAnswers] = useState(Array(similarityQuiz.length).fill(null));
  const result = useMemo(() => scoreSimilarity(answers), [answers]);
  const answeredCount = answers.filter((entry) => entry != null).length;
  const complete = answeredCount === similarityQuiz.length;

  return (
    <section id="quiz-kandidat" className="space-y-8">
      <SectionTitle
        icon={Brain}
        eyebrow="Visualisierung 3"
        title="Welcher Interviewperson bist du am ähnlichsten?"
        text="Dieses Quiz übersetzt eure Interviewmuster in alltagsnahe Multiple-Choice-Fragen. So werden Besuchende nicht nur Betrachtende, sondern Teil eurer Visualisierung."
      />

      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span>Ähnlichkeits-Quiz</span>
            <div className="w-40">
              <Progress value={(answeredCount / similarityQuiz.length) * 100} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {similarityQuiz.map((question, qIndex) => (
            <div key={qIndex} className="space-y-3">
              <h3 className="font-medium text-slate-900">{qIndex + 1}. {question.question}</h3>
              <div className="grid gap-3">
                {question.options.map((option, oIndex) => {
                  const active = answers[qIndex] === oIndex;
                  return (
                    <button
                      key={oIndex}
                      onClick={() => {
                        const next = [...answers];
                        next[qIndex] = oIndex;
                        setAnswers(next);
                      }}
                      className={`rounded-2xl border p-4 text-left transition ${active ? "border-slate-900 bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <AnimatePresence>
            {complete && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border bg-slate-50 p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 mt-1" />
                  <div className="space-y-2">
                    <div className="text-sm text-slate-500">Dein Ergebnis</div>
                    <h3 className="text-2xl font-semibold">Du passt am ehesten zu {result.winner.name} ({result.winner.age} Jahre).</h3>
                    <p className="text-slate-700 leading-relaxed">{result.winner.summary}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {result.winner.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="rounded-full">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </section>
  );
}

function TheoryQuizSection() {
  const [answers, setAnswers] = useState(Array(theoryQuiz.length).fill(null));
  const result = useMemo(() => scoreTheory(answers), [answers]);
  const complete = answers.every((entry) => entry != null);
  const theory = theoryDescriptions[result.winner];

  return (
    <section id="quiz-theorie" className="space-y-8">
      <SectionTitle
        icon={Hourglass}
        eyebrow="Visualisierung 4"
        title="Welche Zeittheorie passt zu deiner Wahrnehmung?"
        text="Hier geht es nicht mehr um die Interviewpersonen, sondern um philosophische Modelle. So verbindet die Website eigenes Erleben direkt mit Theorie."
      />

      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Zeitangst & Zeitverständnis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {theoryQuiz.map((question, qIndex) => (
            <div key={qIndex} className="space-y-3">
              <h3 className="font-medium text-slate-900">{qIndex + 1}. {question.question}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {question.options.map((option, oIndex) => {
                  const active = answers[qIndex] === oIndex;
                  return (
                    <button
                      key={oIndex}
                      onClick={() => {
                        const next = [...answers];
                        next[qIndex] = oIndex;
                        setAnswers(next);
                      }}
                      className={`rounded-2xl border p-4 text-left transition ${active ? "border-slate-900 bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <AnimatePresence>
            {complete && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border bg-slate-50 p-6 space-y-3">
                <div className="text-sm text-slate-500">Deine Theorie</div>
                <h3 className="text-2xl font-semibold">{theory.title}</h3>
                <p className="text-slate-700 leading-relaxed">{theory.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </section>
  );
}

function TranscriptsSection() {
  const sections = [
    { key: "psychology", title: "Psychologie", subtitle: "Subjektive Zeitwahrnehmung, Emotionen, Angst" },
    { key: "pedagogy", title: "Pädagogik", subtitle: "Entwicklung, Lebensphasen, gesellschaftlicher Druck" },
    { key: "philosophy", title: "Philosophie", subtitle: "Vergänglichkeit, Endlichkeit, Sinnfragen" },
  ];

  return (
    <section id="transcripts" className="space-y-8">
      <SectionTitle
        icon={FileText}
        eyebrow="Visualisierung 5"
        title="Interviewtranskripte – Vorlage zum Ausfüllen"
        text="Hier hat jede Person ihren eigenen Bereich mit allen Fragen. Du kannst die Antworten direkt im Code bei den Platzhaltern ersetzen. Oben kannst du direkt zu einer Person springen."
      />

      <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-4">
        <div className="text-sm font-medium text-slate-500">Direkt zu einer Person springen</div>
        <div className="flex flex-wrap gap-2">
          {participants.map((person) => (
            <a key={person.id} href={`#transcript-${person.id}`}>
              <Button variant="outline" className="rounded-full">{person.name} · {person.age}</Button>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {participants.map((person) => (
          <Card key={person.id} id={`transcript-${person.id}`} className="rounded-3xl shadow-sm scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-3">
                <span>{person.name}</span>
                <Badge variant="secondary" className="rounded-full">{person.age} Jahre</Badge>
                <Badge variant="outline" className="rounded-full">{person.ageLabel}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {person.image && (
                <div className="overflow-hidden rounded-2xl border bg-slate-50">
                  <img src={person.image} alt={person.name} className="h-[280px] w-full object-cover" />
                </div>
              )}

              {sections.map((section) => (
                <div key={`${person.id}-${section.key}`} className="rounded-2xl border bg-slate-50 p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                    <p className="text-sm text-slate-500">{section.subtitle}</p>
                  </div>

                  <div className="space-y-4">
                    {transcriptQuestionTemplate[section.key].map((question, index) => (
                      <div key={`${person.id}-${section.key}-${index}`} className="rounded-2xl border bg-white p-4 space-y-3">
                        <p className="font-medium text-slate-900">{index + 1}. {question}</p>
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-400 min-h-[72px] flex items-center">
                          Antwort hier einfügen ...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ReflectionSection() {
  const [past, setPast] = useState("");
  const [present, setPresent] = useState("");
  const [future, setFuture] = useState("");

  const reflection = useMemo(() => {
    const lengths = [past.trim().length, present.trim().length, future.trim().length];
    const max = Math.max(...lengths);
    if (max === 0) return "Zeit wird erst dann spürbar, wenn wir anfangen, uns selbst darin zu verorten.";
    if (max === lengths[0]) return "Bei dir scheint Erinnerung besonders viel Gewicht zu haben – Vergangenheit wirkt noch stark in die Gegenwart hinein.";
    if (max === lengths[1]) return "Bei dir scheint der Druck der Gegenwart besonders stark zu sein – Zeit fühlt sich eher wie Belastung oder Takt an.";
    return "Bei dir zieht die Zukunft stark – Zeitangst wirkt hier eher wie Erwartung, Sorge oder offener Möglichkeitsdruck.";
  }, [past, present, future]);

  return (
    <section id="reflection" className="space-y-8">
      <SectionTitle
        icon={Sparkles}
        eyebrow="Visualisierung 6"
        title="Deine eigene Zeitangst in drei Momenten"
        text="Diese letzte Seite soll nicht nur informieren, sondern die Besuchenden selbst in die Reflexion hineinziehen. Drei kurze Antworten werden zu einer kleinen persönlichen Zeitlinie."
      />

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
              <div className="text-sm text-slate-500">Vergangenheit</div>
              <h3 className="font-semibold text-slate-900">Welcher Moment aus deiner Vergangenheit fühlt sich heute noch nah an?</h3>
              <textarea
                value={past}
                onChange={(e) => setPast(e.target.value)}
                placeholder="Schreibe hier ..."
                className="min-h-[140px] w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
              <div className="text-sm text-slate-500">Gegenwart</div>
              <h3 className="font-semibold text-slate-900">Was setzt dich in deiner Gegenwart zeitlich unter Druck?</h3>
              <textarea
                value={present}
                onChange={(e) => setPresent(e.target.value)}
                placeholder="Schreibe hier ..."
                className="min-h-[140px] w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
              <div className="text-sm text-slate-500">Zukunft</div>
              <h3 className="font-semibold text-slate-900">Wovor hast du in deiner Zukunft am meisten Angst?</h3>
              <textarea
                value={future}
                onChange={(e) => setFuture(e.target.value)}
                placeholder="Schreibe hier ..."
                className="min-h-[140px] w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 space-y-6">
            <div className="text-sm text-slate-500">Deine Zeitlinie</div>
            <div className="grid gap-4 md:grid-cols-3 md:items-start">
              {[{ label: "Vergangenheit", text: past }, { label: "Gegenwart", text: present }, { label: "Zukunft", text: future }].map((item) => (
                <div key={item.label} className="relative rounded-2xl bg-slate-50 p-4 border min-h-[140px]">
                  <div className="mb-2 text-sm font-medium text-slate-500">{item.label}</div>
                  <p className="text-slate-800 leading-relaxed">{item.text || "Noch leer ..."}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <div className="text-sm text-slate-300 mb-2">Reflexion</div>
              <p className="leading-relaxed">{reflection}</p>
              <p className="mt-3 text-slate-300">Auch du trägst deine eigene Zeitgeschichte in dir.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function ZeitAngstWebsitePrototype() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start"
        >
          <div className="space-y-6">
            <Badge className="rounded-full px-4 py-1 text-sm bg-slate-900 hover:bg-slate-900">
              Interdisziplinäres Projekt · Zeitangst
            </Badge>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
              Wie verändert sich <span className="italic">Zeit</span> über ein Leben hinweg?
            </h1>
            <p className="max-w-2xl text-lg text-slate-600 leading-relaxed">
              Eine interaktive Website über Zeitwahrnehmung, Vergänglichkeit und Angst vor Zeit – mit echten Interviews, Reflexionsfragen und philosophischen Theorien.
            </p>
          </div>

          <Card className="rounded-[2rem] border-0 shadow-xl bg-slate-900 text-white overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Leitidee</div>
              <p className="text-2xl leading-relaxed">
                Die Besuchenden sollen Zeit nicht nur <span className="font-semibold">lesen</span>, sondern in Vergleichen, Entscheidungen und Selbsttests <span className="font-semibold">an sich selbst erleben</span>.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-4">6 Interviewpersonen</div>
                <div className="rounded-2xl bg-white/10 p-4">4 Vergleichsfragen</div>
                <div className="rounded-2xl bg-white/10 p-4">2 interaktive Quizze</div>
                <div className="rounded-2xl bg-white/10 p-4">PPP-Theoriebezug</div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <Tabs defaultValue="timeline" className="mt-12 space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-6 rounded-2xl bg-white shadow-sm border h-auto p-1">
            <TabsTrigger value="timeline" className="rounded-xl">Zeitstrahl</TabsTrigger>
            <TabsTrigger value="questions" className="rounded-xl">Fragen</TabsTrigger>
            <TabsTrigger value="transcripts" className="rounded-xl">Transkripte</TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-xl">Quiz 1</TabsTrigger>
            <TabsTrigger value="theory" className="rounded-xl">Quiz 2</TabsTrigger>
            <TabsTrigger value="reflection" className="rounded-xl">Reflexion</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineSection />
          </TabsContent>
          <TabsContent value="questions">
            <QuestionsSection />
          </TabsContent>
          <TabsContent value="transcripts">
            <TranscriptsSection />
          </TabsContent>
          <TabsContent value="quiz">
            <SimilarityQuizSection />
          </TabsContent>
          <TabsContent value="theory">
            <TheoryQuizSection />
          </TabsContent>
          <TabsContent value="reflection">
            <ReflectionSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
