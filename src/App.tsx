import { useMemo, useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Clock3, Hourglass, Sparkles, UserRound, BookOpen, FileText, Quote } from "lucide-react";

type Participant = {
  id: number;
  name: string;
  age: number;
  ageLabel: string;
  summary: string;
  keywords: string[];
  color: string;
  psychology: string;
  pedagogy: string;
  philosophy: string;
  excerpt: string;
  image: string | null;
  transcriptImage: string | null;
};

type InterviewAnswer = {
  age: number;
  name: string;
  text: string;
};

type InterviewQuestion = {
  q: string;
  answers: InterviewAnswer[];
};

type SimilarityOption = {
  text: string;
  weights: number[];
};

type SimilarityQuestion = {
  question: string;
  options: SimilarityOption[];
};

type SectionTitleProps = {
  icon: ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  text: string;
};

type PersonDetailDialogProps = {
  selected: Participant | null;
  setSelected: (person: Participant | null) => void;
};

type TranscriptSectionKey = "psychology" | "pedagogy" | "philosophy";

type TranscriptSection = {
  key: TranscriptSectionKey;
  title: string;
  subtitle: string;
};

type DiagramItem = {
  title: string;
  image: string;
  reflection: string;
};

const participants: Participant[] = [
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
      "Langeweile braucht es ihrer Meinung nach nicht & ist eher negativ.",
    philosophy:
      "Für sie ist eine falsche Entscheidung schlimmer als gar keine Entscheidung.",
    excerpt: "Beim Spielen vergeht die Zeit schnell. Manchmal vergeht sie allgemein schnell.",
    image: null,
    transcriptImage: null,
  },
  {
    id: 2,
    name: "Cyrill",
    age: 14,
    ageLabel: "Jugend",
    summary:
      "Spass macht Zeit schnell, Schule langsam. Social Media, Lehrstellendruck & die Angst, etwas zu verpassen, prägen sein Zeiterleben.",
    keywords: ["Schule", "Spass", "Social Media", "FOMO"],
    color: "from-sky-100 to-blue-50",
    psychology:
      "Spass bedeutet für Cyrill: Zeit vergeht schnell. Langeweile in der Schule bedeutet: Zeit vergeht langsam. Seine Lebenszeit wird ihm kaum bewusst, aber etwas zu verpassen findet er schlimmer als älter zu werden.",
    pedagogy:
      "Druck spürtet er besonders im Blick auf die Lehrstelle. Den grössten Timedruck sieht er bei Jugendlichen. Die Idee des richtigen Zeitpunkts kommt für ihn stark von Social Media.",
    philosophy:
      "Zeit ist für ihn eher Ressource als Feind. Vergänglichkeit bedeutet ihm nicht sehr viel. Keine Entscheidung zu treffen findet er schlimmer als eine falsche.",
    excerpt: "Wenn ich Spass habe, vergeht die Zeit schnell. Wenn ich Langeweile habe, zum Beispiel in der Schule, vergeht sie langsam.",
    image: null,
    transcriptImage: null,
  },
  {
    id: 3,
    name: "Arslan",
    age: 19,
    ageLabel: "Junges Erwachsenenalter",
    summary:
      "Zeit erscheint gleichzeitig relativ, bedrängend & existenziell. Zwischen Uni, Aufschieben, verpassten Erfahrungen & Vergänglichkeitsdenken wird Zeit fast zum Gegner.",
    keywords: ["Uni", "ADHS", "Aufschieben", "Vergänglichkeit"],
    color: "from-violet-100 to-fuchsia-50",
    psychology:
      "Im Zug spürtet Arslan Zeit je nach Tätigkeit unterschiedlich: Arbeit zieht sie in die Länge, Musik lässt sie schneller vergehen. Zeit fühlt sich momentan sehr schnell an. Langeweile ist unangenehm & kann zu Gedankenspiralen führen. Die begrenzte Lebenszeit ist ihm praktisch immer bewusst.",
    pedagogy:
      "Deadlines & soziale Vergleiche erzeugen Druck, auch wenn er früher stärker war. Für jüngere Menschen wirken Zeitabschnitte grösser, weil sie einen grösseren Anteil des bisherigen Lebens ausmachen. Den objektiv richtigen Zeitpunkt glaubt er nicht, eher an die ständige Illusion, dass morgen besser wäre.",
    philosophy:
      "Zeit ist für ihn eher Feind als Ressource, weil sie vergeht, während man versucht, sie zu managen. Vergänglichkeit bewertet er nicht negativ, sondern sogar als befreiend. Perfektion & den perfekten Zeitpunkt hält er für absurde Ideen.",
    excerpt: "Zeit ist für mich eher etwas, gegen das man ankämpfen muss.",
    image: "/arslan.jpg",
    transcriptImage: "/arslan-transcript.jpeg",
  },
  {
    id: 4,
    name: "Alexandra",
    age: 40,
    ageLabel: "Erwachsenenalter",
    summary:
      "Zeit ist verdichtet, vollgepackt & eng mit Potenzial verbunden. Zwischen Struktur, Optimierungsdruck & einer fast poetischen Sicht auf Vergänglichkeit entsteht starke Ambivalenz.",
    keywords: ["Potenzial", "Struktur", "Deadlines", "Vergänglichkeit"],
    color: "from-emerald-100 to-teal-50",
    psychology:
      "Für Alexandra vergeht Zeit fast immer zu schnell, weil sie sich zu viel einplant. Langeweile fühlt sich wie innerer Druck an. Die begrenzte Lebenszeit wird ihr durch das Älterwerden bewusster, vor allem als Verlust von Möglichkeiten & Potenzial.",
    pedagogy:
      "Sie arbeitet stark mit Struktur: Post-its, Journals, To-do-Listen. Gesellschaftlicher Druck prägt für sie stark, wann etwas im Leben angeblich rechtzeitig ist. Gleichzeitig sieht sie in Langeweile auch einen wichtigen Raum für Entspannung & mentale Gesundheit.",
    philosophy:
      "Zeit ist für sie kein Feind, sondern Potenzial, wie eine leere Leinwand. Vergänglichkeit findet sie schön, weil Dinge in anderer Form weitergehen können. Begrenzte Zeit verleiht Handlungen Bedeutung.",
    excerpt: "Ich denke nicht an Zeit als Feind. Ich denke, sie ist Potenzial. Sie ist wie eine leere Leinwand (original: blank canvas), die beschrieben werden kann.",
    image: "/alexandra.jpg",
    transcriptImage: "/alexandra-transcript.jpeg",
  },
  {
    id: 5,
    name: "Lyudmila",
    age: 49,
    ageLabel: "Mitte des Lebens",
    summary:
      "Zeit wirkt heute schneller & knapper als früher. Ihre Haltung ist pragmatisch: viel äusserer Druck, klare Pflichten, aber auch nüchterne Akzeptanz von Vergänglichkeit.",
    keywords: ["Pflichten", "äusserer Druck", "Akzeptanz", "Gebrechlichkeit"],
    color: "from-orange-100 to-rose-50",
    psychology:
      "Zeit vergeht für Lyudmila eher schneller. Seit dem Smartphone kennt sie fast keine Langeweile mehr. Die Endlichkeit des Lebens wird ihr vor allem bei Todesfällen oder schlimmen Nachrichten bewusst. Mehr Angst macht ihr das Älterwerden & die mögliche Abhängigkeit als das Verpassen von Chancen.",
    pedagogy:
      "Druck erlebt sie klar von aussen: durch Bürokratie, Fristen & die Beschleunigung des Alltags. Für junge Menschen scheint Zeit offener; mit mehr Verantwortung steigt der Druck, Dinge rechtzeitig zu schaffen.",
    philosophy:
      "Vergänglichkeit ist für sie ein natürlicher Zustand: Etwas vergeht, etwas Neues kommt. Einen perfekten Zeitpunkt gibt es nicht wirklich; er wird meist von aussen diktiert. Unendliche Zeit würde ihr eher Angst machen.",
    excerpt: "Etwas vergeht, etwas Neues kommt.",
    image: "/lyudmila.jpg",
    transcriptImage: "/lyudmila-transcript.jpeg",
  },
  {
    id: 6,
    name: "Emma",
    age: 74,
    ageLabel: "Hohes Alter",
    summary:
      "Zeit vergeht sehr schnell, aber ohne eigentliche Angst. Vertrauen, Gegenwart & Glaube tragen ihre Zeitwahrnehmung stärker als Druck oder Vergänglichkeitsfurcht.",
    keywords: ["Glaube", "Gelassenheit", "Gegenwart", "kein Todesangst"],
    color: "from-stone-100 to-slate-50",
    psychology:
      "In den letzten Jahren vergeht Zeit für Emma sehr schnell. Langeweile kennt sie kaum, weil immer etwas zu tun ist. Vor dem Tod hat sie keine Angst; sie ist mit sich selbst eher zufrieden.",
    pedagogy:
      "Sie sieht grossen Druck besonders auf junge Leute, verstärkt durch Medien. Früher habe es mehr Freiheiten & weniger Zeitstress gegeben. Langeweile empfindet sie zwar als schlecht, aber Ruhe findet sie wichtig.",
    philosophy:
      "Vergänglichkeit gehört zum Leben & macht ihr keine Angst. Gott bleibt für immer. Für alles gibt es einen richtigen Zeitpunkt, aber Menschen können ihn nicht wissen.",
    excerpt: "Weil ich Gott vertraue. Alles wird richtig kommen.",
    image: null,
    transcriptImage: null,
  },
];

const interviewQuestions: InterviewQuestion[] = [
  {
    q: "Wann spürst du besonders stark, dass Zeit schnell oder langsam vergeht?",
    answers: [
      { age: 8, name: "Aurora", text: "Beim Spielen vergeht die Zeit schnell. Manchmal vergeht sie allgemein schnell." },
      { age: 14, name: "Cyrill", text: "Wenn ich Spass habe, vergeht die Zeit schnell. Wenn ich Langeweile habe, zum Beispiel in der Schule, vergeht sie langsam." },
      { age: 19, name: "Arslan", text: "Spontan merke ich das gerade bei der Uni. Wenn ich zur Uni fahren muss, ist das ein interessanter Fall, weil es grundsätzlich zwei Stunden im Zug sind. Je nachdem, wie ich diese zwei Stunden verbringe, fühlen sie sich sehr unterschiedlich an. Wenn ich versuche, etwas zu arbeiten, dann fühlt sich die Zeit ziemlich lang an, was eigentlich vorteilhaft ist. Meistens heisst das aber auch, dass ich nicht sehr viel Spass an der Arbeit habe. Wenn ich dagegen Musik höre, dann vergeht die Zeit relativ schnell, dann fühlt es sich eher wie eine Stunde an. Ein anderes Beispiel sind die Vorlesungen. Die Vorlesungen an der Uni sind zwei 45-Minuten-Lektionen. Oft schaue ich sie mir aber einfach zu Hause in doppelter Geschwindigkeit an. Trotzdem fühlt sich diese eine 45-Minuten-Lektion meistens so an wie die gesamte 90-Minuten-Lektion in der Uni..." },
      { age: 40, name: "Alexandra", text: "Für mich vergeht Zeit immer zu schnell. Ich plane mir zu viel ein, deshalb bin ich immer am Rennen & Hetzen auf eine Deadline hin. Ich glaube, ich bin nicht besonders gut mit Zeit & Raum, deshalb langweile ich mich eigentlich nie wirklich." },
      { age: 49, name: "Lyudmila", text: "Ich kann nicht genau benennen, wann, aber manchmal geht es schneller. Ich bin selbst schockiert, dass es schon Montag ist... Wahrscheinlich vergeht die Zeit schneller, wenn man frei hat." },
      { age: 74, name: "Emma", text: "In den letzten Jahren geht die Zeit sehr schnell vorbei." },
    ],
  },
  {
    q: "Fühlt sich Zeit momentan in deinem Leben eher schnell oder langsam an?",
    answers: [
      { age: 8, name: "Aurora", text: "Eher langsam." },
      { age: 14, name: "Cyrill", text: "Es ist unterschiedlich. Manchmal fühlt es sich mittel an & manchmal verschieden." },
      { age: 19, name: "Arslan", text: "Im Moment fühlt sie sich schon sehr schnell an. Ich bin erst seit etwa einem halben Jahr nicht mehr an der Kanti & was überraschend ist, weil sich die Kanti wie eine Ewigkeit entfernt anfühlt. Dabei ist es eigentlich noch gar nicht so lange her. Es fühlt sich so an, als wäre ich seit Ewigkeiten an der Uni, aber eigentlich habe ich erst ein Semester hinter mir. Bestimmte Abschnitte, wie meine frühe Kindheit in Deutschland, kann ich mir fast gar nicht mehr richtig relativ vorstellen. Die Kanti fühlte sich aber auch wie ein sehr langer Zeitabschnitt an, länger als die Primarschule, interessanterweise." },
      { age: 40, name: "Alexandra", text: "Zeit fühlt sich in meinem Leben eher schnell an. Ich habe immer das Gefühl, dass es nicht genug Zeit gibt, weil ich so viel in sie hineinpacke." },
      { age: 49, name: "Lyudmila", text: "Eher schneller." },
      { age: 74, name: "Emma", text: "Sehr schnell." },
    ],
  },
  {
    q: "Wie fühlt es sich an, wenn du Langeweile verspürst?",
    answers: [
      { age: 8, name: "Aurora", text: "Langeweile ist doof." },
      { age: 14, name: "Cyrill", text: "Es fühlt sich nicht gut aber auch nicht ganz schlecht an. Es ist eher neutral bis schlecht." },
      { age: 19, name: "Arslan", text: "Grundsätzlich würde ich sagen, es ist unangenehm. Vorallem durch mein ADHS. Ich fange dann schnell an, in Gedanken zu spiralisieren, wenn ich mich nicht mit irgendetwas ablenke. Und meistens kann ich selber nicht kontrollieren, was das für Gedanken sind." },
      { age: 40, name: "Alexandra", text: "Es fühlt sich wie ein innerer Druck an. Ich will dann einfach, dass es aufhört. Es ist nicht entspannend & nicht angenehm. Ich erinnere es als ein angespanntes Gefühl." },
      { age: 49, name: "Lyudmila", text: "Mit dem Internet verspüre ich gar keine Langeweile mehr. Früher traff sie ein, wenn ich kein gutes Buch zur Hand hatte. Aber wenn ich ein gutes Buch zur Hand hatte, hatte ich nie Langeweile in meinem Leben. Ich erinnere mich aber schon an Situationen, zum Beispiel bei meiner Oma im Dorf manchmal, weil ich keine Unterhaltung hatte. Das war eher unangenehm." },
      { age: 74, name: "Emma", text: "Ich habe keine Langeweile, weil ich immer etwas zu tun habe. Mein Hobby ist zum Beispiel Lesen." },
    ],
  },
  {
    q: "Gibt es Lebensphasen, in denen Langeweile wichtig ist, zum Beispiel für Entwicklung oder Kreativität? Oder ist sie eher negativ?",
    answers: [
      { age: 8, name: "Aurora", text: "Langeweile braucht es nicht & sie ist doof." },
      { age: 14, name: "Cyrill", text: "Langeweile ist unnötig & negativ." },
      { age: 19, name: "Arslan", text: "Wenn du dich 24/7 von irgendetwas beschallen lässt, also mit Musik & Videos & so weiter, dann ist das sicher auch nicht gut. Wir leben in einer sehr rasanten & hyper-stimulierten Gesellschaft. Aber ehrlich gesagt würde ich nicht sagen, dass man unbedingt Langeweile braucht, sondern eher, dass man darüber nachdenken sollte, auf welche Art man Langeweile fernhält. Denn streng genommen verdrängst du Langeweile auch dann, wenn du ein Buch liest... Genauso wie wenn du Musik hörst, während du ein YouTube-Video schaust & im Hintergrund noch eine Netflix-Serie läuft." },
      { age: 40, name: "Alexandra", text: "Ich denke, Langeweile ist oft auch wichtig, besonders für die mentale Gesundheit & zur Entspannung. Auch wenn ich Langeweile als Druck beschreibe, hat sie zwei Seiten & muss nicht nur negativ sein." },
      { age: 49, name: "Lyudmila", text: "Wenn einem langweilig ist & man dann etwas sucht, das Kreativität fordert, dann ist einem nicht mehr langweilig. Vielleicht kommt Kreativität sogar aus der Langeweile. Man war gelangweilt, aber hat sich dann beschäftigt & gesucht. Von dem her denke ich schon." },
      { age: 74, name: "Emma", text: "Langeweile ist etwas Schlechtes. Gut ist nur, wenn man zur Ruhe kommt & nicht immer aktiv sein muss. Langeweile sollte es aber nicht geben." },
    ],
  },
  {
    q: "Was ist schlimmer: eine falsche Entscheidung zu treffen oder gar keine Entscheidung zu treffen?",
    answers: [
      { age: 8, name: "Aurora", text: "Eine falsche Entscheidung ist schlimmer." },
      { age: 14, name: "Cyrill", text: "Gar keine Entscheidung zu treffen ist schlimmer." },
      { age: 19, name: "Arslan", text: "Das ist situationsabhängig. Manchmal ist eine falsche Entscheidung deutlich schlimmer als gar keine Entscheidung & manchmal ist gar keine Entscheidung deutlich schlimmer als eine falsche Entscheidung." },
      { age: 40, name: "Alexandra", text: "Ich denke, beides kann gleich schlimm sein. Es gibt falsche Entscheidungen, besonders wenn sie negative Folgen für andere oder für mich selbst haben. Aber gar nichts zu tun kann genauso schlimm sein." },
      { age: 49, name: "Lyudmila", text: "Beides ist schlimm. Aber eine Entscheidung nicht zu treffen, bedeutet auch die falsche Entscheidung zu treffen." },
      { age: 74, name: "Emma", text: "Gar keine Entscheidung zu treffen ist schlimmer." },
    ],
  },
];

const transcriptQuestionTemplate: Record<TranscriptSectionKey, string[]> = {
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
    "Gibt es Entscheidungen, bei denen du zu lange gewartet hast — & warum?",
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
    "Was bedeutet Langeweile für dich persönlich?",
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
    "Was macht einen Moment für dich „richtig“: Gefühl, Logik, Mut, äussere Umstände?",
  ],
};

const similarityQuiz: SimilarityQuestion[] = [
  {
    question: "Wie fühlt sich für dich ein freier Nachmittag am ehesten an?",
    options: [
      { text: "Ich will einfach spielen oder spontan machen, worauf ich Lust habe.", weights: [3, 0, 0, 0, 0, 0] },
      { text: "Kommt drauf an... Mit spassigen Aktivitäten vergeht er schnell, ohne solche zieht er sich.", weights: [0, 3, 0, 0, 0, 0] },
      { text: "Ich denke schnell daran was ich noch machen sollte, schiebe es auf & kann meine Zeit mit diesen Hintergedanken nicht geniessen.", weights: [0, 1, 3, 0, 0, 0] },
      { text: "Ich fülle ihn mit Projekten, Ideen & ToDo-Listen, damit ich immer etwas zu tun habe.", weights: [0, 0, 1, 3, 0, 0] },
      { text: "Ich erledige lieber direkt andere Projekte die noch anstehen, statt lange zu warten.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Ich nehme ihn eher ruhig, lasse mich leiten & vertraue darauf, dass alles seinen Weg hat.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
  {
    question: "Was löst Langeweile bei dir aus?",
    options: [
      { text: "Sie ist einfach doof & ich will sofort etwas anderes machen, um sie los zu werden.", weights: [3, 0, 0, 0, 0, 0] },
      { text: "Ich greife meist einfach direkt zum Handy.", weights: [0, 3, 0, 0, 0, 0] },
      { text: "Sie ist unangenehm & kann mich gedanklich richtig runterziehen.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Sie fühlt sich wie innerer Druck an. Ich plane dann etwas ein.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Eigentlich kommt sie kaum vor, weil ich mich immer beschäftigen kann.", weights: [0, 0, 0, 0, 3, 1] },
      { text: "Ich kenne sie fast nicht mehr oder deute sie eher als ruhige Zeit für mich.", weights: [0, 0, 0, 0, 1, 3] },
    ],
  },
  {
    question: "Was beschreibt dein Verhältnis zur Zukunft am besten?",
    options: [
      { text: "Ich denke darüber noch nicht so gross nach.", weights: [3, 0, 0, 0, 0, 0] },
      { text: "Wichtiger ist für mich, nichts in der Gegenwart zu verpassen.", weights: [0, 3, 1, 0, 0, 0] },
      { text: "Ich merke stark, dass meine Zeit begrenzt ist & denke viel über verpasste Erfahrungen nach.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Ich will Potenzial nicht verlieren & Dinge nicht zu spät tun.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Ich mache mir eher Sorgen um Abhängigkeit, Pflichten & das Älterwerden.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Ich vertraue darauf, dass alles richtig kommen wird.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
  {
    question: "Welche Aussage über Vergänglichkeit passt am besten zu dir?",
    options: [
      { text: "Darüber denke ich kaum nach.", weights: [2, 1, 0, 0, 0, 0] },
      { text: "Sie ist einfach da... Man kann eh nichts machen.", weights: [0, 2, 1, 0, 0, 0] },
      { text: "Sie ist befreiend, weil sowieso nichts bleibt.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Sie ist traurig & schön zugleich. Ich denke etwas kann in anderer Form weiterleben.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Etwas vergeht, etwas Neues kommt. Das ist normal.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Sie gehört zum Leben, aber ich vertraue dabei auf Gott.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
  {
    question: "Wann stresst dich an Zeit am meisten?",
    options: [
      { text: "Wenn etwas keinen Spass macht oder zu lange dauert.", weights: [2, 1, 0, 0, 0, 0] },
      { text: "Wenn andere weiter sind oder ich etwas verpasse.", weights: [0, 3, 1, 0, 0, 0] },
      { text: "Wenn ich wieder alles bis morgen aufschiebe.", weights: [0, 0, 3, 0, 0, 0] },
      { text: "Wenn ich nie das Gefühl habe, etwas sei wirklich fertig.", weights: [0, 0, 0, 3, 0, 0] },
      { text: "Wenn äussere Umstände, Fristen & Bürokratie den Takt vorgeben.", weights: [0, 0, 0, 0, 3, 0] },
      { text: "Wenn Menschen glauben, sie könnten den richtigen Zeitpunkt ganz kontrollieren.", weights: [0, 0, 0, 0, 0, 3] },
    ],
  },
];

const diagramItems: DiagramItem[] = [
  {
    title: "Wahrnehmung der Geschwindigkeit",
    image: "/diagramm-geschwindigkeit.png",
    reflection: "*insert text*",
  },
  {
    title: "Abfinden mit nicht Erlebtem",
    image: "/diagramm-abfinden.png",
    reflection: "*insert text*",
  },
  {
    title: "Akzeptanz von Vergänglichkeit",
    image: "/diagramm-vergaenglichkeit.png",
    reflection: "*insert text*",
  },
  {
    title: "Bewertung von Langeweile",
    image: "/diagramm-langeweile.png",
    reflection: "*insert text*",
  },
];

function scoreSimilarity(answers: Array<number | null>) {
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

function SectionTitle({ icon: Icon, eyebrow, title, text }: SectionTitleProps) {
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

function PersonDetailDialog({ selected, setSelected }: PersonDetailDialogProps) {
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
                  <CardTitle className="text-lg">Allgemeine Zeitwahrnehmung</CardTitle>
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
  const [selected, setSelected] = useState<Participant | null>(null);

  return (
    <section id="zeitstrahl" className="space-y-8">
      <SectionTitle
        icon={Clock3}
        eyebrow="Visualisierung 1"
        title="Zeitstrahl der Interviewpersonen"
        text={`Wir haben 6 Vertretter verschiedener Alterklassen die selben Fragen zu ihren Wahrnehmungen & Reflexionen über das Vergehen der Zeit gestellt. Auf diesem Zeitstrahl ist eine Übersicht der Auswertung & Hauptschlüsse zu sehen. Beim Anklicken öffnet sich eine Unterteilung in Psychologie, Pädagogik & Philosophie`}
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
        text={`Hier stehen 5 zentrale Fragen unserer Interviews welche grosse Eindrücke in unserer Auswertung erbracht haben. Erst kann man sich selbst Gedanken über die eigenen Antworten machen & dann mit einem Klick, die Antworten der Alterklassen vergleichen`}
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
                      <div className="text-slate-800 mt-1 whitespace-pre-line">{answer.text}</div>
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
  const [answers, setAnswers] = useState<Array<number | null>>(Array(similarityQuiz.length).fill(null));
  const result = useMemo(() => scoreSimilarity(answers), [answers]);
  const answeredCount = answers.filter((entry) => entry != null).length;
  const complete = answeredCount === similarityQuiz.length;

  return (
    <section id="quiz-kandidat" className="space-y-8">
      <SectionTitle
        icon={Brain}
        eyebrow="Visualisierung 4"
        title="Welcher Interviewperson bist du am ähnlichsten?"
        text={`Nach dem Kennenlernen unserer Kandidaten für die jeweiligen Altersgruppen, ist es nun an der Zeit herauszufinden welcher Ansicht man selbst am meisten ähnelt. Durch das Beantworten der Multiple-Choice Fragen findet man es heraus!`}
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
  return (
    <section id="diagramme" className="space-y-8">
      <SectionTitle
        icon={Hourglass}
        eyebrow="Visualisierung 5"
        title="Diagramme zur Auswertung"
        text={`Hier sind vier zentrale Diagramme aus unserer Auswertung zu sehen. Unter jedem Diagramm kann man durch einen Klick auf „Überlege“ eine kurze Deutungsfläche öffnen und dort Gedanken, Beobachtungen oder eine gemeinsame Interpretation einfügen.`}
      />

      <div className="grid gap-8">
        {diagramItems.map((diagram, index) => (
          <Card key={index} className="rounded-3xl shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle>{diagram.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-2xl border bg-slate-50">
                <img
                  src={diagram.image}
                  alt={diagram.title}
                  className="w-full object-contain"
                />
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value={`diagram-${index}`} className="rounded-2xl border bg-white px-5 shadow-sm">
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    Überlege
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-xl bg-slate-50 p-4 border text-slate-700 whitespace-pre-line">
                      {diagram.reflection}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const transcriptAnswers: Record<string, Record<TranscriptSectionKey, string[]>> = {
  Aurora: {
    psychology: [
      `Beim Spielen vergeht die Zeit schnell. Manchmal vergeht sie allgemein schnell.`,
      `Eher langsam.`,
      ``,
      ``,
      `Langeweile ist doof.`,
      `Ich esse dann Süssigkeiten.`,
      ``,
      ``,
      ``,
      ``,
      ``,
    ],
    pedagogy: [
      ``,
      ``,
      ``,
      ``,
      ``,
      `Langeweile braucht es nicht & sie ist doof.`,
      ``,
      ``,
      ``,
    ],
    philosophy: [
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      ``,
      `Eine falsche Entscheidung ist schlimmer.`,
      ``,
    ],
  },

  Cyrill: {
    psychology: [
      `Wenn ich Spass habe, vergeht die Zeit schnell. Wenn ich Langeweile habe, zum Beispiel in der Schule, vergeht sie langsam.`,
      `Es ist unterschiedlich. Manchmal fühlt es sich mittel an & manchmal verschieden.`,
      `Nein, es hat sich nicht verändert.`,
      `Das ist einfach ein Gefühl.`,
      `Es fühlt sich nicht gut aber auch nicht ganz schlecht an. Es ist eher neutral bis schlecht.`,
      `Ich gehe dann ans Handy.`,
      `Nein.`,
      ``,
      `Ich habe mehr Angst davor, etwas zu verpassen.`,
      `Ja.`,
      ``,
    ],
    pedagogy: [
      `Nein.`,
      ``,
      `Ja. Ältere sind besser auf den Tod vorbereitet & merken mehr, dass die Zeit vorbeigeht.`,
      `Nein.`,
      `Weil es etwas Normales ist.`,
      `Langeweile ist unnötig & negativ.`,
      `Diese Idee kommt bei mir von Social Media.`,
      `Ja. Zum Beispiel, wenn es darum geht, eine Lehrstelle zu finden.`,
      `Als Jugendlicher hat man den grössten Druck.`,
    ],
    philosophy: [
      `Sie ist für mich eher eine Ressource.`,
      `Sie bedeutet nicht viel. Sie ist einfach da.`,
      `Ich finde sie langweilig.`,
      `Sie bedeutet für mich nichts.`,
      `Ich finde sie mittel & auch wichtig, weil man nicht für immer leben sollte. Schlecht ist sie dann, wenn etwas früher passiert als gedacht.`,
      `Nein.`,
      `Weil man nichts dagegen machen kann.`,
      `Nein.`,
      `Nein.`,
      `Dann hätte alles die gleiche Bedeutung.`,
      `Ja.`,
      `Es ist eher eine Idee, die uns stresst.`,
      `Gar keine Entscheidung zu treffen ist schlimmer.`,
      `Gefühle.`,
    ],
  },

  Arslan: {
    psychology: [
      `Spontan merke ich das gerade bei der Uni. Wenn ich zur Uni fahren muss, ist das ein interessanter Fall, weil es grundsätzlich zwei Stunden im Zug sind. Je nachdem, wie ich diese zwei Stunden verbringe, fühlen sie sich sehr unterschiedlich an. Wenn ich versuche, etwas zu arbeiten, dann fühlt sich die Zeit ziemlich lang an, was eigentlich vorteilhaft ist. Meistens heisst das aber auch, dass ich nicht sehr viel Spass an der Arbeit habe. Wenn ich dagegen Musik höre, dann vergeht die Zeit relativ schnell, dann fühlt es sich eher wie eine Stunde an. Ein anderes Beispiel sind die Vorlesungen. Die Vorlesungen an der Uni sind zwei 45-Minuten-Lektionen. Oft schaue ich sie mir aber einfach zu Hause in doppelter Geschwindigkeit an. Trotzdem fühlt sich diese eine 45-Minuten-Lektion meistens so an wie die gesamte 90-Minuten-Lektion in der Uni...`,
      `Im Moment fühlt sie sich schon sehr schnell an. Ich bin erst seit etwa einem halben Jahr nicht mehr an der Kanti & was überraschend ist, weil sich die Kanti wie eine Ewigkeit entfernt anfühlt. Dabei ist es eigentlich noch gar nicht so lange her. Es fühlt sich so an, als wäre ich seit Ewigkeiten an der Uni, aber eigentlich habe ich erst ein Semester hinter mir. Bestimmte Abschnitte, wie meine frühe Kindheit in Deutschland, kann ich mir fast gar nicht mehr richtig relativ vorstellen. Die Kanti fühlte sich aber auch wie ein sehr langer Zeitabschnitt an, länger als die Primarschule, interessanterweise.`,
      `Ja. Das hängt auch damit zusammen, dass man immer älter wird & mehr Zeit hinter sich hat & Zeit dadurch anders wahrnimmt. Irgendwann ist ein Jahr nicht mehr ein Achtzehntel deines Lebens, sondern nur noch ein Fünfzigstel.`,
      `Weil man sich mit zunehmendem Alter daran gewöhnt & Zeit anders wahrnimmt, je mehr man schon erlebt hat. Wenn man älter ist, wirkt derselbe Zeitabschnitt einfach kleiner.`,
      `Grundsätzlich würde ich sagen, es ist unangenehm. Vorallem durch mein ADHS. Ich fange dann schnell an, in Gedanken zu spiralisieren, wenn ich mich nicht mit irgendetwas ablenke. Und meistens kann ich selber nicht kontrollieren, was das für Gedanken sind.`,
      `Manchmal schaffe ich es, mich rein mental abzulenken. Ich brauche also nicht unbedingt externe Stimulation, sondern kann mich einfach in Gedanken unterhalten, mir etwas ausdenken oder über irgendeine Idee nachdenken.`,
      `Praktisch immer. Ich bin mir ziemlich klar darüber, dass ich fast schon einen Drittel meines Lebens hinter mir habe. Aber es spielt grundsätzlich nicht immer aktiv eine Rolle. Es ist eher so wie der konstante Fakt, dass wir auf dem Planeten Erde leben. Natürlich weiss das jeder, aber man denkt nicht ständig darüber nach. Wenn ich direkt darauf angesprochen werde, ist das nicht eine neue Realisation.`,
      `Früher war das schwerer. Früher hatte ich ziemlich viele Komplexe darüber, ob mein Leben einen Sinn hatte, wenn ich einmal verstorben bin, oder ob es noch Leute geben wird, die sich an mich erinnern werden & dass ich irgendetwas erreichen muss. Heute ist mir das eigentlich ziemlich gleich. Früher war das einfach eine konstante Angst, vergessen zu werden. Einen besonderen Weg, damit umzugehen, hatte ich damals nicht.`,
      `Älterwerden ist problematisch, weil du schwächer wirst, die Existenz unangenehmer wird & dein Körper immer mehr weh tut. Aber etwas zu verpassen ist für mich eigentlich schlimmer. Das Leben geht so schnell vorbei & ich habe sowieso das Gefühl, dass ich nie solche Kindheitserfahrungen hatte, die andere Leute hatten. Das ist ja auch ein Teil der Angst vor dem Älterwerden: nicht nur, wie es sich anfühlt, alt zu sein, sondern dass man dann bestimmte Dinge auch nicht mehr tun kann.`,
      `Ja. Bei allem, was ich mache, ist es so. Es muss kurz vor der Deadline sein, sonst sage ich mir, dass ich nicht in der Stimmung bin. Oder ich denke: Wenn ich das morgen mache, kann ich länger am Stück daran arbeiten. Und dann mache ich es immer morgen & immer so weiter. Man kommt nie wirklich heraus aus diesem Prozess. Ich denke, das war schon immer so.`,
      `Ich weiss, dass es solche Entscheidungen gibt, weil ich allgemein eine Person bin, die bei so etwas sehr zögerlich ist. Meistens versuche ich, die Entscheidung auf andere Leute abzuwälzen oder alles bis zum letzten Moment hinauszuzögern. Aber mir fällt gerade kein explizites Beispiel ein.`,
    ],
    pedagogy: [
      `Ja, vor allem in der Uni. Einerseits gibt es Deadlines, bei denen ich tatsächlich Dinge abgeben muss, weil ich sonst keine Benotung dafür bekomme. Und gesellschaftlich habe ich manchmal das Gefühl, dass ich bisher nicht viel in meinem Leben erreicht habe. Früher war das stärker, als ich mich mehr für Ruhm & solche Sachen interessiert habe. Damals habe ich mir Sorgen gemacht, dass ich zum Beispiel nie einen Mathewettbewerb gewonnen habe oder dass andere Leute schon so weit sind mit ihrem Wissen. Heutzutage ist das nicht mehr so relevant. Manchmal habe ich nur noch das Gefühl, wenn ich Leute sehe, die talentierter sind als ich & jünger oder im gleichen Alter, dass ich in diesem Bereich vielleicht etwas versagt habe & dass ich das auch hätte können, wenn ich früher damit angefangen hätte. Aber ich mache mir nicht mehr so viel daraus.`,
      `Heutzutage mach ich mir wie gesagt nicht mehr so viele Gedanken darüber.`,
      `Ja. Wenn du mehr Zeit hinter dir hast, dann fühlt sich ein Zeitabschnitt kleiner an. Für einen Zehnjährigen sind fünf Jahre die Hälfte seiner Lebenszeit. Für einen Fünfzigjährigen ist es nur ein Zehntel. Ausserdem haben die Zeitabschnitte in den sensiblen Phasen der Kindheit mehr Eindruck auf uns gemacht & wirken deshalb länger. Deshalb kommen uns fünf Primarschuljahre vielleicht heftiger & länger vor als fünf Jahre in einem 9-to-5-Job.`,
      `Ich würde es nicht als eine gesellschaftliche Angst vor dem Altern bezeichnen. Die meisten Leute haben interessanterweise eher Angst vor dem Tod als vor dem Altern. Es ist ja eigentlich etwas Erwünschtes, dass man lang lebt. Man wünscht sich ein langes Leben & möglichst alt zu werden, bevor man stirbt. Deshalb würde ich eher sagen, es ist das Gegenteil. Die Leute haben nicht direkt Angst davor, aber niemand mag es unbedingt, alt zu werden. Trotzdem ist es etwas, das man erwartet, aus Trotz gegenüber dem Tod sozusagen.`,
      `Weil die Angst vor dem Tod stärker zu sein scheint als die Abneigung gegenüber dem Altern. Man empfindet Altern vielleicht als unangenehm, aber es wird durch den Wunsch, möglichst lange zu leben, gewissermassen abgewogen.`,
      `Wenn du dich 24/7 von irgendetwas beschallen lässt, also mit Musik & Videos & so weiter, dann ist das sicher auch nicht gut. Wir leben in einer sehr rasanten & hyper-stimulierten Gesellschaft. Aber ehrlich gesagt würde ich nicht sagen, dass man unbedingt Langeweile braucht, sondern eher, dass man darüber nachdenken sollte, auf welche Art man Langeweile fernhält. Denn streng genommen verdrängst du Langeweile auch dann, wenn du ein Buch liest... Genauso wie wenn du Musik hörst, während du ein YouTube-Video schaust & im Hintergrund noch eine Netflix-Serie läuft.`,
      `An den richtigen Zeitpunkt glaube ich eigentlich nicht. Ich glaube nur oft, dass der Zeitpunkt im Moment ungünstig ist & morgen vielleicht besser wäre. Ich denke, diese Idee kommt bei mir aus einer intrinsischen Motivation, alles später erledigen zu wollen & irgendwelche Ausreden zu suchen. Denn objektiv gesehen werden die Lagen grundsätzlich nicht besser & darüber bin ich mir auch bewusst. Trotzdem hat man im Moment immer das Gefühl, dass die Zukunft besser geeignet ist als die Gegenwart, weil man die Präsenz anders wahrnimmt als Vergangenheit & Zukunft & in Bezug auf die Zukunft oft zu hoffnungsvoll ist.`,
      `Nicht wirklich. Bei mir sind die Resultate, je nachdem wie ich meine Zeit plane, eigentlich immer gleich. Meistens sind sie sogar besser, je weniger ich plane & je weniger ich für etwas lerne. Ich kann mir aber vorstellen, dass das bei anderen Personen anders ist, wenn Zeitplanung tatsächlich Einfluss auf ihre Leistungen hat. Solange am Ende die Hausaufgabe korrekt & rechtzeitig abgegeben wurde, kommt es eher darauf an, wie gut du ohne Zeitmanagement leben kannst. Wenn man es dir nicht anmerkt, dass du keinen Plan hast, würde es auch niemandem auffallen. Im zwischenmenschlichen Bereich gibt es aber schon Grenzen. Wenn es eine feste Timeline gibt, würde ich niemanden eine Woche auf „read“ lassen, weil das einfach unhöflich wäre. Ein Tag bis ein paar Stunden ist normal, aber sieben Tage hängen dann von mehreren Faktoren ab. Das hat für mich weniger mit Zeit an sich zu tun als damit, dass man ein Versprechen direkt oder indirekt gegeben & dann nicht erfüllt hat.`,
      `Dafür habe ich nicht genügend Eindrücke, um das zu beantworten. Als Hypothese würde ich sagen, dass es wahrscheinlich ähnlich verteilt ist.`,
    ],
    philosophy: [
      `Eher tendenziell ein Feind, weil Ressourcen kann man halbwegs managen. Zeit geht aber, während du sie managst, schon wieder weg. Zeit ist für mich eher etwas, gegen das man ankämpfen muss. Man meint, man hätte sich etwas für einen Tag eingeteilt & dann ist der Tag trotzdem schon wieder vorbei & du kannst nichts mehr dagegen machen.`,
      `Langeweile besteht eigentlich aus den Wörtern „lange“ & „Weile“. Wenn man das so anschaut, lässt sich das darauf zurückführen, dass es ein Zeitraum ist, der sich sehr lang anfühlt, weil man in diesem Zeitraum keine Unterhaltung hat oder sonst nichts zu tun hat. Etwas, das sich ewig ausstreckt. Langeweile ist für mich eher dann da, wenn ich nicht einmal in meinem Kopf etwas habe, womit ich mich unterhalten kann. Ich kann nichts tun & trotzdem kann mir manchmal nicht langweilig sein. Ich kann einfach nur herumliegen & das würde ich schon als Aktivität betrachten. Langeweile ist für mich eher der Mangel an Aktivität.`,
      `Ich würde sie stark über das Empfinden & die Wahrnehmung definieren, nicht über das Objektive. Man kann zum Beispiel eine Minute langweilig im Arztwartezimmer sitzen & das kann sich trotzdem wie eine Stunde anfühlen.`,
      `Memento Mori. Ich glaube sehr daran, dass es absolut nichts in der Welt gibt, das irgendwann noch existieren wird. Alles verschwindet irgendwann. Vergänglichkeit ist für mich der Fakt, dass alles in irgendeiner Form vergessen, zerstört, vernichtet oder verstirbt. Bestimmte Dinge vergehen sicher schneller als andere. Die Menschheit wird sicher lange aussterben, bevor das allgemeine Leben auf der Erde endet & irgendwann wird auch die Erde zerfallen. Und wenn wir irgendwann den Hitzetod des Universums erreicht haben, wird Zeit selber nicht mehr existieren.`,
      `Sie steht mir nicht im Weg. Es ist einfach etwas, das passiert.`,
      `Nein, es ist befreiend.`,
      `Mir persönlich hilft mental Nihilismus & der Gedanke, dass das meiste in irgendeiner Form ohnehin keinen Sinn hat. Deshalb muss ich mir überhaupt keine Sorgen machen, wie alles verläuft. Die Idee, dass alles ohnehin vergänglich ist, egal was ich mache, heisst für mich auch, dass ich mich nicht schlecht fühlen muss, wenn ich nicht viel erreiche.`,
      `Nein, nicht einmal Zeit selber.`,
      `Ich wäre auf jeden Fall sehr viel fauler. Was ich normalerweise an einem Tag machen würde, würde ich wahrscheinlich dann in hundert Jahren erledigen... wenn überhaupt. Ich hatte aber auch schon den Gedanken, dass vielleicht genau das Gegenteil passieren könnte & ich dann einfach alles ausprobieren würde, weil es keine Zeit gäbe, die ich verschwenden könnte. Dann müsste ich mir keine Sorgen machen, wenn ich etwas mache & darin nicht gut bin oder es mir keinen Spass macht. Gerade bei Entscheidungen merke ich das: Ich habe zum Beispiel schon mehr Zeit damit verbracht, zu entscheiden, welche Serie ich schauen will, als ich gebraucht hätte, wenn ich einfach einige davon geschaut hätte. Das liegt daran, dass ich Angst habe, die Zeit nicht optimal zu nutzen.`,
      `Eigentlich hat jetzt schon nichts wirklich Bedeutung & dann auch nicht. Vielleicht sogar noch weniger. Das ist eine interessante Frage, weil dann nichts mehr vergänglich wäre. Aber ohne Vergänglichkeit wäre vielleicht auch wieder alles möglich & wenn alles möglich ist, hätte nichts mehr eine Differenzierung. In beiden Realitäten würde also eine Sinnlosigkeit entstehen, aber auf eine sehr unterschiedliche Art.`,
      `Ich glaube nicht, dass es das überhaupt gibt. Aber ich finde interessant, ob die Wahrnehmung davon noch existieren würde, wenn wir unbegrenzt Zeit hätten. Denn auch dann würden Leute wahrscheinlich immer noch denken, dass es perfekte Umstände gibt, um bestimmte Dinge zu tun & dass diese perfekten Umstände irgendwann eintreffen würden.`,
      `Ich glaube nicht, dass es ihn gibt. Perfektion ist ohnehin eine absurde Idee.`,
      `Das ist situationsabhängig. Manchmal ist eine falsche Entscheidung deutlich schlimmer als gar keine Entscheidung & manchmal ist gar keine Entscheidung deutlich schlimmer als eine falsche Entscheidung.`,
      `Wahrscheinlich eher das Gefühl, wenn ich mich zusammenreisse um etwas zu erledigen. Aber ich denke nicht, dass es von äusseren Umständen definiert wird.`,
    ],
  },

  Alexandra: {
    psychology: [
      `Für mich vergeht Zeit immer zu schnell. Ich plane mir zu viel ein, deshalb bin ich immer am Rennen & Hetzen auf eine Deadline hin. Ich glaube, ich bin nicht besonders gut mit Zeit & Raum, deshalb langweile ich mich eigentlich nie wirklich.`,
      `Zeit fühlt sich in meinem Leben eher schnell an. Ich habe immer das Gefühl, dass es nicht genug Zeit gibt, weil ich so viel in sie hineinpacke.`,
      `Ja, ich glaube, das hat wahrscheinlich in meiner Jugend angefangen. Als Kind hatte ich auch kein richtiges Konzept von Zeit, aber ich habe sie einfach glücklich gefüllt, vor mich hin gelebt & Dinge gemacht. Ich glaube, Langeweile kam vor allem dann, wenn ich auf jemanden warten musste.`,
      `Ich denke, das könnte daran liegen, dass ich früh gelernt habe, wie es sich anfühlt zu warten, ohne zu wissen, wann es endet. Als Kind hatte ich immer das Gefühl auf Erwachsene warten zu müssen & das war wahrscheinlich die Hauptsituation, in der ich Langeweile gespürt habe. Vielleicht ist das der Grund, warum ich mir heute so viel einplane. Vielleicht ist es sogar die Angst vor Langeweile, die mich leitet.`,
      `Es fühlt sich wie ein innerer Druck an. Ich will dann einfach, dass es aufhört. Es ist nicht entspannend & nicht angenehm. Ich erinnere es als ein angespanntes Gefühl.`,
      `Ich zapple wahrscheinlich herum, verändere meine Sitz- oder Beinhaltung, starre ins Leere & wünsche mir, dass es vorbei ist. Ich versuche meist, sie zu vermeiden, indem ich mir extra Dinge einplane, ein Buch mitnehme oder Wartezeit mit etwas fülle. Ich lasse sie also nicht einfach natürlich auf mich wirken.`,
      `Ja, ich glaube, älter zu werden hat mir das in letzter Zeit bewusster gemacht. Ich habe mich eigentlich nie alt gefühlt, bis vor Kurzem & jetzt merke ich, dass es Dinge gibt, die man nicht mehr tun kann. Dadurch werden die Grenzen der Zeit realer.`,
      `Ich denke darüber in Bezug auf Potenzial & Möglichkeiten nach. Wenn man jung ist, ist noch alles Potenzial. Später wird man mehr danach beurteilt, was man getan hat, als danach, was man noch tun könnte. Ich glaube, ich versuche einfach, weiter Dinge zu tun & nicht jemand zu werden, der aufhört.`,
      `Ich würde sagen, ich habe mehr Angst davor, Potenzial & Möglichkeiten zu verpassen. Als Teenager hatte ich wirklich FOMO (original: fear of missing out), weil ich es geliebt habe, immer unter Leuten zu sein. Aber heute denke ich, dass es manchmal auch entspannend sein kann, andere Menschen gerade nicht um mich zu haben. Was ich also mehr fürchte, ist das Verpassen von Chancen & Möglichkeiten.`,
      `Ja. Bei mir geht es aber weniger darum, etwas gar nicht anzufangen, sondern eher darum, mich nie bereit zu fühlen, etwas abzugeben oder zu sagen, dass es fertig ist.`,
      `Ja, ich glaube schon, in dem Sinn, dass ich oft bis ganz zum Schluss an etwas arbeite, weil nichts jemals wirklich fertig ist. Ich habe immer das Gefühl, ich könnte es noch verbessern oder ich wüsste morgen noch etwas mehr. Deshalb warte ich manchmal zu lange.`,
    ],
    pedagogy: [
      `Ja, auf jeden Fall.`,
      `Ja, ich arbeite viel mit Struktur. Ich bin wieder analog geworden: Post-its, Wandkalender, Journals & To-do-Listen. Mein ganzes Leben ist im Prinzip eine grosse To-do-Liste.`,
      `Ja, ich denke, jüngere Menschen spüren die Endgültigkeit von Zeit nicht auf dieselbe Weise. Ich glaube, Kinder denken, dass es immer noch mehr Zeit geben wird.`,
      `Ja, ich glaube, die Gesellschaft erzeugt Druck rund ums Altern, obwohl dieser Druck gar nicht nötig wäre.`,
      `Ich denke, die Gesellschaft schreibt uns bestimmte Zeitpunkte im Leben vor: Eine Zeit, um Kinder zu bekommen, eine Zeit, um zu heiraten, eine Zeit, um auf dem Höhepunkt der Karriere zu sein & sogar eine Zeit, in der man angeblich nicht mehr fähig ist, sich zu verändern. Das erzeugt Angst & Druck. Dabei finde ich Altern eigentlich etwas Schönes & eine Chance.`,
      `Ich denke, Langeweile ist oft auch wichtig, besonders für die mentale Gesundheit & zur Entspannung. Auch wenn ich Langeweile als Druck beschreibe, hat sie zwei Seiten & muss nicht nur negativ sein.`,
      `Ich glaube, diese Idee kommt aus der Gesellschaft. Die Gesellschaft erzeugt Vorstellungen davon, wann der richtige Zeitpunkt für Kinder, Ehe, beruflichen Erfolg oder sogar persönliche Veränderung ist. Ich denke, diese Vorstellung ist stark von aussen vorgegeben.`,
      `Ja, ich denke schon, dass ich danach beurteilt werde & in manchen Situationen auch zurecht. Meine Freunde planen sogar fünfzehn Minuten früher ein, wenn wir uns verabreden, da sie mich so gut kennen. Aber ich bestehe auch darauf, nicht zu hart dafür verurteilt zu werden, weil ich mein Bestes versuche & es nicht aus Faulheit oder bösem Willen passiert.`,
      `Ja, ich glaube schon, weil heute alles strukturiert & durchgetaktet ist. Alle sind ständig online & das Leben ist viel strenger organisiert. Kinder wirken in meiner Vorstellung freier, während Erwachsene & auch jüngere Generationen heute mehr Druck spüren, alles richtig zu planen, zu erledigen & zeitlich passend hinzubekommen.`,
    ],
    philosophy: [
      `Ich denke nicht an Zeit als Feind. Ich denke, sie ist Potenzial. Sie ist wie eine leere Leinwand (original: blank canvas), die beschrieben werden kann.`,
      `Für mich bedeutet Langeweile, daran gehindert zu werden, diese Leinwand auf eine Weise zu nutzen, die mich glücklich macht. Es bedeutet nicht nur, nichts zu tun zu haben, sondern auch, das, was ich tun möchte, nicht tun zu können.`,
      `Ich denke, Langeweile hat zwei Seiten. Sie kann unangenehm & angespannt sein, aber sie kann auch Raum & Entspannung schaffen. Deshalb sehe ich sie nicht nur als etwas Negatives, auch wenn sie mir nicht persönlich gefällt.`,
      `Wenn ich an Vergänglichkeit (original: transience) denke, dann denke ich, dass das Wort recht gut zum Gefühl passt. Es ist eine sehr schöne & vor allem passende Bezeichnung. Es ist nicht Tod & es ist nicht einfach ein Ende. Es fühlt sich fliessend an, fast durchsichtig. Ich denke dabei an meinen Garten, wo Dinge verschwinden & dann in neuer Form zurückkommen. Es ist wie ein Kreislauf, wie etwas, das zurück in das Nichts schmilzt & dann erneuert wieder auftaucht.`,
      `Ich finde Vergänglichkeit schön. Ich finde es schade, dass sie so einen negativen Ruf hat, weil sie für mich auch ein sanftes langsames Verschwinden oder Herausfiltern bedeuten kann & nicht nur Verlust.`,
      `Nicht vollständig. Ich sehe die Traurigkeit darin, besonders bei Menschen & geliebten Personen, aber ich sehe auch etwas Sinnvolles darin.`,
      `Weil selbst dann, wenn etwas in einer Form endet, es in einer anderen Form weitergehen kann. Ich meine das nicht einmal unbedingt spirituell oder religiös. Ein Körper zerfällt & wird zu etwas anderem in der Erde. Auch Ideen leben in anderen Menschen weiter. Deshalb kann etwas, das verschwunden ist, für mich trotzdem in anderer Form bleiben.`,
      `Ich glaube, etwas kann bleiben, solange es erinnert wird oder in anderer Form weitergetragen wird. Ich weiss nicht, ob das wirklich „für immer“ bedeutet, aber ich denke schon, dass Menschen & Dinge in anderen Menschen, in Erinnerungen, in ihrem Einfluss oder in dem was aus ihnen wird, weiterleben können.`,
      `Nein, ich glaube nicht auf eine gute Weise. Ich denke, irgendwann hätte jede Person genug davon. Wenn Zeit langsamer wäre, würde ich sie wahrscheinlich trotzdem genauso vollpacken. Ich glaube, ich würde mich einfach daran anpassen & irgendwann würde es sich wieder gleich anfühlen.`,
      `Ich glaube, es würde an Bedeutung verlieren. Wir bekommen Bedeutung, aber auch den Anstoss, Dinge zu tun, gerade weil Zeit begrenzt ist. Eine begrenzte Zeit, in der wir etwas tun können, gibt diesem Etwas Wert.`,
      `Nein, ich glaube nicht. Wenn es kein Ende gäbe, würde sich die Idee des richtigen oder bedeutsamen Moments einfach ausdehnen & ihre Kraft verlieren. Es wäre dann nicht mehr auf dieselbe Weise möglich.`,
      `Ich denke, es ist grösstenteils ein Konstrukt & etwas Subjektives. Ein Moment fühlt sich dann richtig an, wenn ich mir selbst genug vertraue & wenn die Faktoren zusammenkommen, vielleicht auch, wenn jemand anderes das, was ich tue, gebe oder anbiete, annimmt. Deshalb denke ich auch, dass diese Idee uns stressen kann.`,
      `Ich denke, beides kann gleich schlimm sein. Es gibt falsche Entscheidungen, besonders wenn sie negative Folgen für andere oder für mich selbst haben. Aber gar nichts zu tun kann genauso schlimm sein.`,
      `Zuallererst muss es subjektiv sein. Ein Moment ist dann richtig, wenn ich mir selbst genug vertraue. Aber ich denke auch, dass die Umstände zusammenkommen müssen & manchmal muss auch eine andere Person das, was ich tue, willkommen heissen. Also ist es sowohl inneres Gefühl als auch äussere Umstände.`,
    ],
  },

  Lyudmila: {
    psychology: [
      `Ich kann nicht genau benennen, wann, aber manchmal geht es schneller. Ich bin selbst schockiert, dass es schon Montag ist... Wahrscheinlich vergeht die Zeit schneller, wenn man frei hat.`,
      `Eher schneller.`,
      `Ja.`,
      `Früher sind wir schneller gewachsen & man merkt den Unterschied darin, wie die Zeit verlaufen ist. Jetzt sind wir quasi nicht mehr so schnell im Wachstum. Früher habe ich das Zeitbild & die Dinge in diesem Zeitpunkt anders gesehen. Aber für mich persönlich läuft die Zeit, jetzt schneller. Ich weiss nicht, ob das normal so ist.`,
      `Mit dem Internet verspüre ich gar keine Langeweile mehr. Früher traff sie ein, wenn ich kein gutes Buch zur Hand hatte. Aber wenn ich ein gutes Buch zur Hand hatte, hatte ich nie Langeweile in meinem Leben. Ich erinnere mich aber schon an Situationen, zum Beispiel bei meiner Oma im Dorf manchmal, weil ich keine Unterhaltung hatte. Das war eher unangenehm.`,
      `Ich vermeide sie. Mir wird jetzt nie langweilig, weil ich immer zerstreut bin. Ich kann im Internet sein, ein Hörbuch hören, Nachrichten anschauen oder einfach kochen. Verschiedene Sachen. Ob das unterbewusst ist, weiss ich nicht. Aber seitdem man das Smartphone in der Hand hat, ist es nicht mehr so. Man kann eigentlich keine Langeweile mehr haben mit dem Internet.`,
      `Ja, wenn jemand von den Leuten, die du kennst, stirbt. Und vor allem, wenn man an Anschläge denkt. Vor ein paar Tagen sind wieder Leute friedlich in der Ukraine eingeschlafen & dann gestorben. Ich beginne meinen Tag mit diesen schrecklichen Nachrichten & dann wird einem bewusst, dass das jederzeit passieren kann. Auch hier. Man kann auch einfach falsch auf die Strasse treten...`,
      `Ich lasse es nicht an mich heran. Es passiert, wenn es passiert. Es ist einfach da & ich akzeptiere es. In diesen vielen Jahren bin ich, was das angeht, sehr abgestumpft.`,
      `Vor dem Älterwerden, also dass man gebrechlicher wird. Dass man Dinge nicht mehr allein machen kann, die man früher gemacht hat. Dass man abhängig von jemandem wird.`,
      `Ich weiss es nicht genau. Eher nicht.`,
      `Es ist halt nicht von meinem Willen abhängig, zu lange zu warten, sondern von der Situation & von den Finanzen & so. Ich erledige Dinge eigentlich so schnell, wie ich kann. Ich versuche das immer, weil es mir ein gutes Gefühl macht. Das wurde mir auch von zu Hause so beigebracht, dass man sofort alles machen muss.`,
    ],
    pedagogy: [
      `Ja. Dieser Druck wird eher von aussen ausgeübt, nicht von mir selbst.`,
      `Wenn es mich angeht, würde ich sofort alles erledigen & dann vergessen.`,
      `Wahrscheinlich, schon. Man hat als junger Mensch nicht die Erfahrung. Man denkt, man hat noch sehr viel Zeit für alles. Das ist aber nicht so.`,
      `Manche Leute haben Angst vor dem Alter, zum Beispiel davor, Macht zu verlieren oder gebrechlich zu werden. Ich glaube auch, dass man Angst hat, dass die Gesellschaft älter wird & dass die Jugendlichen dafür bezahlen müssen.`,
      `Von mir aus denke ich, es ist psychologisch. Physiologisch macht es aber auch Sinn.`,
      `Wenn einem langweilig ist & man dann etwas sucht, das Kreativität fordert, dann ist einem nicht mehr langweilig. Vielleicht kommt Kreativität sogar aus der Langeweile. Man war gelangweilt, aber hat sich dann beschäftigt & gesucht. Von dem her denke ich schon.`,
      `Nein, das gibt es nicht. Es entwickelt sich einfach sporadisch & plötzlich. Die Leute, die auf den richtigen Zeitpunkt warten, zum Beispiel um Kinder zu bekommen, für die wird es am Ende sowieso nie der richtige Zeitpunkt sein.`,
      `Meine Gesellschaft nicht, aber der bürokratische Apparat schon. Man wird gezwungen, alles rechtzeitig zu machen, weil es Konsequenzen gibt.`,
      `Mit der Verantwortung ist es mehr Druck. In letzter Zeit gibt es viel mehr Druck. Früher war man nicht so vom Briefkasten abhängig wie jetzt, oder von den Mails mittlerweile. Das Leben läuft viel schneller als früher & man hat mehr Verpflichtungen & muss mehr leisten & tun. Ich denke es hat nicht nur mit dem Älterwerden zu tun, sondern auch mit der Entwicklung.`,
    ],
    philosophy: [
      `Je nachdem. Sie könnte ein Feind sein oder auch eine Ressource. Wenn man in Bedrängnis kommt, dann ist sie bestimmt ein Feind. Aber eine Ressource um Sachen zu machen, ist Zeit schon auch. Egal was man macht, sie reicht jedoch nie.`,
      `Manchmal, wenn man so viel zu tun hat, wünscht man sich Langeweile... Einfach mal abschalten, dass der Kopf leer ist & man nichts zu tun hat. Das würde ich aber nicht als Langeweile bezeichnen, sondern als Ruhe, die man braucht, körperlich & seelisch. Langeweile hatte ich wirklich nur dort, als ich bei meiner Oma im Sommer war, wo nichts zu tun war, wo ich keine Freunde hatte & kein gutes Buch. Da sitzt man herum & denkt: Hoffentlich ist der Tag bald zu Ende.`,
      `Eher negativ. Es ist kein gutes Gefühl. Es ist ein Gefühl, das mit Einsamkeit verbunden ist. Wenn man nicht allein ist, hat man auch keine Langeweile.`,
      `Ein normaler Zustand des Lebens. Etwas komplett Natürliches. Etwas vergeht, etwas Neues kommt.`,
      `Das ist unterschiedlich. Wenn etwas nicht gut war, dann ist es auch gut, wenn es vergeht. Dem Krieg werde ich nicht nachtrauern. Aber dass ich mit meinen Kindern nicht mehr so wie früher auf dem Spielplatz sitze, das ist schon manchmal traurig. Es ist etwas sehr Subjektives.`,
      `Nein, weil etwas Neues kommt. Es läuft doch alles so. Etwas kommt, etwas geht. Das ist eine Tatsache, der ich nicht so viele Gefühle schenke.`,
      `Es ist einfach der Lauf der Dinge.`,
      `Vielleicht die Liebe zu den Kindern. Das bleibt für immer. Vielleicht Liebe allgemein. Aber sonst sehe ich das nicht.`,
      `Ja, das würde mir Angst machen. Ich kann mir das nicht vorstellen. Wenn man für immer leben würde, wäre das sehr unangenehm.`,
      `Man weiss ja nicht, was das Ende ist. Das ist spannend. Du weisst wirklich nicht, was dich am Ende erwartet. Viele Religionen sagen etwas anderes. Ob das wirklich ein Ende ist oder ob das Bewusstsein noch da ist, ohne Körper. Oder ob man dann alles weiter erlebt mit seinen Verwandten & Liebsten. Ich will diese Ängste & Gefühle nicht mehr haben, wenn ich nicht mehr da bin. Ich möchte dann eher gelöst sein von diesen Gefühlen.`,
      `Wahrscheinlich nicht. Wenn man ewig Zeit hätte, könnte man auch immer etwas aufschieben. Dann würde vielleicht nie ein Zeitpunkt kommen. Um diese „richtigen Zeitpunkte“ zu erreichen, sind wir auch von der begrenzten Zeit geprägt.`,
      `Den gibt es nicht wirklich. Der perfekte Zeitpunkt wird von der Gesellschaft, von Werten & Normvorstellungen diktiert. Zum Beispiel mit welchem Alter man ein Haus kaufen sollte, ist von der Kultur vorgeschrieben, nicht der Natur. Dieser perfekte Zeitpunkt wird also von aussen bestimmt. Wirklich gibt es ihn nicht.`,
      `Beides ist schlimm. Aber eine Entscheidung nicht zu treffen, bedeutet auch die falsche Entscheidung zu treffen.`,
      `Logik natürlich. Und auch das, was von aussen diktiert wird. Zum Beispiel bei der Ehe oder dem Umzug in ein anderes Land: Der richtige Zeitpunkt war bei meiner Familie eingetroffen, weil die Kinder noch nicht in die Schule eingebunden waren & noch klein waren. Später wäre es komplizierter gewesen. Das wird von den Umständen diktiert.`,
    ],
  },

  Emma: {
    psychology: [
      `In den letzten Jahren geht die Zeit sehr schnell vorbei.`,
      `Sehr schnell.`,
      `Es hat sich ein bisschen verändert. Es war aber eigentlich immer eher schnell. Langeweile gab es nie.`,
      `Weil immer etwas los ist.`,
      `Ich habe keine Langeweile, weil ich immer etwas zu tun habe. Mein Hobby ist zum Beispiel Lesen.`,
      ``,
      `Nein. Ich habe keine Angst vor dem Tod. Es ist okay.`,
      ``,
      `Eher davor, etwas zu verpassen. Aber eigentlich auch nicht. Ich bin zufrieden mit mir selbst.`,
      `Ich frage mich eher, wann der Zeitpunkt zum Sterben ist & was ich noch machen muss, weil ich noch lebe. Ich frage mich, wofür ich noch da bin & was Gott noch mit mir will.`,
      `Nein. Alles ist von Gott vorbestimmt.`,
    ],
    pedagogy: [
      `Nein.`,
      ``,
      `Nein. Alle denken, dass die Zeit schnell geht.`,
      `Ich verstehe, warum Menschen Angst vor dem Altern haben & auch Angst vor dem Alleinsein. Ich selber habe diese Angst aber nicht.`,
      ``,
      `Langeweile ist etwas Schlechtes. Gut ist nur, wenn man zur Ruhe kommt & nicht immer aktiv sein muss. Langeweile sollte es aber nicht geben.`,
      ``,
      `Nicht immer nur gut, aber vom Umfeld bekomme ich gute Bewertungen.`,
      `Auf junge Leute gibt es grossen Druck. Das ist total falsch & wird vor allem durch die Medien verstärkt. Früher hatte man viele Freiheiten & das war sehr gut. Es gab keinen Druck & keinen Stress. Ich würde nicht mit den Jungen heute tauschen.`,
    ],
    philosophy: [
      ``,
      `Langeweile ist für mich ein schlimmes Gefühl. Dann suche ich Hilfe im Gebet.`,
      `Ich kenne eigentlich keine Langeweile, nur von meinen Enkeln. Früher kannte man das nicht.`,
      `Sie gehört zum Leben & das stimmt so. Man soll im Jetzt leben. Ich habe keine Angst vor Vergänglichkeit.`,
      ``,
      `Nein.`,
      `Weil ich Gott vertraue. Alles wird richtig kommen.`,
      `Gott bleibt für immer. Menschen, die an Gott glauben, bleiben auch. Die Erde wird es für immer geben. Es ist normal, dass es eine Entwicklung gibt.`,
      `Ich frage mich, ob ich das überhaupt möchte.`,
      ``,
      `Man weiss nicht, wann es fertig ist. Durch die Wiederauferstehung ist das eine andere Frage.`,
      `Es gibt für alles den perfekten Zeitpunkt. Aber wann dieser ist, kann man nicht wissen.`,
      `Gar keine Entscheidung zu treffen ist schlimmer.`,
      `Menschen können das nicht wissen. Alles ist von Gott vorbestimmt & man kann es nicht beeinflussen.`,
    ],
  },
};

function TranscriptsSection() {
  const sections: TranscriptSection[] = [
    { key: "psychology", title: "Psychologie", subtitle: "Subjektive Zeitwahrnehmung, Emotionen, Angst" },
    { key: "pedagogy", title: "Pädagogik", subtitle: "Entwicklung, Lebensphasen, gesellschaftlicher Druck" },
    { key: "philosophy", title: "Philosophie", subtitle: "Vergänglichkeit, Endlichkeit, Sinnfragen" },
  ];

  return (
    <section id="transcripts" className="space-y-8">
      <SectionTitle
        icon={FileText}
        eyebrow="Visualisierung 3"
        title="Interviewtranskripte"
        text={`Auf dieser Seite sind die Transkripte unserer Interviews zu finden. Man kann somit einzelne Fragen direkt miteinander vergleichen. Jede Perspektive der Befragten wurde durch ein selbst gemaltes Bild veranschaulicht. Hat man Interesse an einer spezifischen Interviewbefragung, kann durch das Klicken auf einen Namen direkt zu der Person gesprungen werden.`}
      />

      <div className="rounded-3xl border bg-white p-5 shadow-sm space-y-4">
        <div className="text-sm font-medium text-slate-500">Direkt zu einer Person springen</div>
        <div className="flex flex-wrap gap-2">
          {participants.map((person) => (
            <a key={person.id} href={`#transcript-${person.id}`}>
              <Button variant="outline" className="rounded-full">
                {person.name} · {person.age}
              </Button>
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
              <div className="overflow-hidden rounded-2xl border bg-slate-50">
                {person.transcriptImage ? (
                  <img
                    src={person.transcriptImage}
                    alt={`${person.name} gemaltes Transkriptbild`}
                    className="h-[280px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[280px] w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
                    Gemaltes Bild für diese Transkript-Seite hier einfügen
                  </div>
                )}
              </div>

              {sections.map((section) => {
                const answeredEntries = transcriptQuestionTemplate[section.key]
                  .map((question, index) => ({
                    question,
                    answer: transcriptAnswers[person.name]?.[section.key]?.[index] ?? "",
                    index,
                  }))
                  .filter((entry) => entry.answer.trim() !== "");

                if (answeredEntries.length === 0) return null;

                return (
                  <div key={`${person.id}-${section.key}`} className="rounded-2xl border bg-slate-50 p-5 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                      <p className="text-sm text-slate-500">{section.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                      {answeredEntries.map((entry) => (
                        <div
                          key={`${person.id}-${section.key}-${entry.index}`}
                          className="rounded-2xl border bg-white p-4 space-y-3"
                        >
                          <p className="font-medium text-slate-900">
                            {entry.index + 1}. {entry.question}
                          </p>

                          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-700 min-h-[72px] whitespace-pre-line">
                            {entry.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
    if (max === 0) return "“Was ist Zeit? Wenn mir niemand diese Frage stellt, weiss ich es, doch sobald mich jemand fragt, finde ich keine Antwort” - Aurelius Augustinus";
    if (max === lengths[0]) return "Bei dir scheint Erinnerung besonders viel Gewicht zu haben... Vergangenheit wirkt noch stark in die Gegenwart hinein.";
    if (max === lengths[1]) return "Bei dir scheint der Druck der Gegenwart besonders stark zu sein... Zeit fühlt sich eher wie Belastung oder Takt an.";
    return "Bei dir zieht die Zukunft stark... Zeitangst wirkt hier eher wie Erwartung, Sorge oder offener Möglichkeitsdruck.";
  }, [past, present, future]);

  return (
    <section id="reflection" className="space-y-8">
      <SectionTitle
        icon={Sparkles}
        eyebrow="Visualisierung 6"
        title="Deine eigene Zeitangst in drei Momenten"
        text={`Nun ist es an der Zeit sich die Zeit zu nehmen, um die eigene Zeitperspektive zu erkundigen & festzuhalten. Jegliches was dir in den Sinn kommt, kannst du in deinem persönlichen Zeitstrahl mit diesen 3 Fragen festhalten!`}
      />

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
              <div className="text-sm text-slate-500">Vergangenheit</div>
              <h3 className="font-semibold text-slate-900">Welcher Moment aus deiner Vergangenheit fühlt sich heute noch nah an? Hast du eine Idee wieso?</h3>
              <textarea
                value={past}
                onChange={(e) => setPast(e.target.value)}
                placeholder="Schreibe hier ..."
                className="min-h-[140px] w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
              <div className="text-sm text-slate-500">Gegenwart</div>
              <h3 className="font-semibold text-slate-900">Was setzt dich in deiner Gegenwart zeitlich unter Druck & wieso ist dem so? Wie fühlt sich das an?</h3>
              <textarea
                value={present}
                onChange={(e) => setPresent(e.target.value)}
                placeholder="Schreibe hier ..."
                className="min-h-[140px] w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
              <div className="text-sm text-slate-500">Zukunft</div>
              <h3 className="font-semibold text-slate-900">Wovor hast du in deiner Zukunft am meisten Angst? Siehst du eine Korrelation dieser Angst zu deiner gegenwärtigen Situation?</h3>
              <textarea
                value={future}
                onChange={(e) => setFuture(e.target.value)}
                placeholder="Schreibe hier ..."
                className="min-h-[140px] w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 space-y-6">
            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <div className="text-sm text-slate-300 mb-2">Reflexion</div>
              <p className="leading-relaxed">{reflection}</p>
              <p className="mt-3 text-slate-300">Was ist Zeit für dich?</p>
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
              Angst vor Zeit
            </Badge>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
              Wie verändert sich <span className="italic">Zeit</span> über das Leben hinweg?
            </h1>
            <div className="max-w-2xl text-lg text-slate-600 leading-relaxed space-y-2">
              <p>Unsere Website beschöftigt sich mit der Konstellation von Zeitwahrnehmung, Vergänglichkeit & Angst vor Zeit</p>
              <p>Zu finden sind Interviews, Reflexionsfragen & geisteswissenschaftliche Theorien</p>
              <p>Wir wünschen viel Spass beim Eintauchen!</p>
              <p>Aurelia & Yasemin, SPP23</p>
            </div>
          </div>
        </motion.section>

        <Tabs defaultValue="timeline" className="mt-12 space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-6 rounded-2xl bg-white shadow-sm border h-auto p-1">
            <TabsTrigger value="timeline" className="rounded-xl">Zeitstrahl</TabsTrigger>
            <TabsTrigger value="questions" className="rounded-xl">Fragen</TabsTrigger>
            <TabsTrigger value="transcripts" className="rounded-xl">Transkripte</TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-xl">Ähnlichkeitsquiz</TabsTrigger>
            <TabsTrigger value="theory" className="rounded-xl">Diagramme</TabsTrigger>
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