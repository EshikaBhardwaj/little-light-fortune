export type CardId = "sun" | "lotus" | "star" | "elephant" | "diya";

export interface FortuneCard {
  id: CardId;
  numeral: string;
  name: string;
  theme: string;
  accent: string; // css var name
  categories: Category[];
}

export type Category =
  | "Love & Relationships"
  | "Growth & Success"
  | "Abundance & Prosperity"
  | "Happiness & Joy"
  | "Courage & Confidence"
  | "New Beginnings"
  | "Peace & Well-being"
  | "Creativity & Inspiration"
  | "Unexpected Opportunities"
  | "Gratitude & Fulfilment";

export const CARDS: FortuneCard[] = [
  { id: "sun", numeral: "I", name: "The Sun", theme: "New Beginnings", accent: "var(--saffron)", categories: ["New Beginnings", "Courage & Confidence"] },
  { id: "lotus", numeral: "II", name: "The Lotus", theme: "Growth & Flourishing", accent: "var(--vermilion)", categories: ["Growth & Success", "Peace & Well-being"] },
  { id: "star", numeral: "III", name: "The Star", theme: "Dreams & Possibilities", accent: "var(--champagne)", categories: ["Creativity & Inspiration", "Unexpected Opportunities"] },
  { id: "elephant", numeral: "IV", name: "The Elephant", theme: "Wisdom & Good Fortune", accent: "var(--gold)", categories: ["Abundance & Prosperity", "Gratitude & Fulfilment"] },
  { id: "diya", numeral: "V", name: "The Diya", theme: "Light & Happiness", accent: "var(--saffron)", categories: ["Happiness & Joy", "Love & Relationships"] },
];

const F: Record<Category, string[]> = {
  "Love & Relationships": [
    "The people who light up your days are drawing closer. Let them in a little more this year.",
    "A kind word you offer this season may travel further than you imagine.",
    "Love often arrives quietly — in a shared cup of chai, a remembered birthday, a hand held a moment longer.",
    "An old bond may find new warmth. Be the first to reach out.",
    "Someone is grateful you exist, even if they haven't said it yet.",
    "Make space at your table. The year ahead is generous with good company.",
    "Tenderness is a kind of strength. Lead with it, and watch what blooms.",
    "The light you share with others never leaves you dimmer.",
    "A conversation you've been postponing may become one you'll treasure.",
    "May your home be full of laughter that echoes long after the lamps are dimmed.",
  ],
  "Growth & Success": [
    "Everything you've been nurturing quietly is preparing to find its moment in the sun. Trust the process. Your time to bloom is closer than you think.",
    "Small, steady steps are building something remarkable. Keep walking.",
    "The effort no one sees is the foundation everyone will admire.",
    "This is a year to stretch beyond the familiar. You are more ready than you feel.",
    "Your patience is not waiting — it is ripening.",
    "A skill you've been sharpening is about to open an unexpected door.",
    "Roots grow in the dark before branches reach the light. Yours are deep.",
    "Progress may be quiet, but it is never wasted. Keep tending your garden.",
    "The ladder you're climbing is sturdier than you think. Look up.",
    "Success this season will look a lot like being true to yourself.",
  ],
  "Abundance & Prosperity": [
    "Like the lamps of Diwali, good fortune multiplies when it is shared.",
    "Abundance is gathering at your doorstep. Leave the door a little open.",
    "What you give generously has a way of finding its way back to you.",
    "The year ahead holds more than enough — enough time, enough joy, enough grace.",
    "Prosperity begins with noticing how much you already hold.",
    "A wise decision made calmly may bring rewards for many seasons.",
    "Let Lakshmi find a home that is bright, open and grateful.",
    "Wealth comes in many currencies. You are richer in more of them than you know.",
    "Seeds planted with intention this season may bear fruit for years.",
    "May your granaries be full and your heart fuller still.",
  ],
  "Happiness & Joy": [
    "Joy is not far away. It is in the very next small, beautiful moment.",
    "Let yourself be delighted by ordinary things. They are quietly extraordinary.",
    "Laughter is coming your way — make room for plenty of it.",
    "The brightest light this year may be the one you carry within.",
    "Find the sweetness in each day, the way you find it in a box of mithai.",
    "A happy surprise is tucked somewhere in the months ahead.",
    "Dance a little. Sing a little. The year is listening.",
    "May your days be filled with the warmth of a thousand diyas.",
    "Happiness grows every time you pause long enough to notice it.",
    "The joy you spread this season will return as light on darker days.",
  ],
  "Courage & Confidence": [
    "The voice that says 'try' is worth listening to. Trust it this year.",
    "You have walked through darkness before and carried the light with you.",
    "Bold steps feel uncertain at first. That is how you know they matter.",
    "Your quiet confidence is louder than you think.",
    "This is your season to speak up, stand tall and take up space.",
    "Fear is only a shadow. Step toward the lamp.",
    "What once felt impossible is now simply your next chapter.",
    "Believe in your instincts — they have been right more often than not.",
    "Courage doesn't always roar. Sometimes it simply begins again tomorrow.",
    "The world needs exactly the light only you can bring.",
  ],
  "New Beginnings": [
    "An unexpected opportunity may lead you somewhere beautiful. Stay curious, stay courageous and never underestimate the magic of beginning again.",
    "A fresh page is waiting. Write something wonderful on it.",
    "Every lamp you light this Diwali marks a path forward.",
    "Let go of what dims you. The new year welcomes a lighter you.",
    "The first step of something wonderful is closer than you realise.",
    "Sunrise does not ask permission. Neither should your fresh start.",
    "A door you didn't notice before may soon swing gently open.",
    "Begin before you feel ready. Readiness grows along the way.",
    "The year ahead is unwritten — and full of beautiful possibility.",
    "Like the first flame of the evening, your new beginning will light many others.",
  ],
  "Peace & Well-being": [
    "May this year bring you stillness in the middle of every storm.",
    "Rest is not a pause from life. It is part of living well.",
    "Peace is gathering around you, like the quiet after the fireworks.",
    "Breathe slowly. You are exactly where you need to be.",
    "Be as gentle with yourself as you are with those you love.",
    "A calm mind will reveal answers that a hurried one cannot see.",
    "May your days be soft, your nights restful and your heart at ease.",
    "Wellness blooms where kindness is practised — starting with yourself.",
    "Like the lotus, you can rise serene from any water.",
    "Simplicity will be your quiet luxury this year.",
  ],
  "Creativity & Inspiration": [
    "An idea you've been carrying is ready to take its first breath.",
    "Inspiration is drawn to those who keep showing up. Keep showing up.",
    "Colour outside the lines this year. Rangoli was never meant to be ordinary.",
    "Your imagination is a lamp. Let it lead you somewhere new.",
    "The spark you're looking for may arrive in an unexpected conversation.",
    "Make something just for the joy of making it.",
    "Curiosity will be your finest companion in the months ahead.",
    "Every great creation began as a small, flickering thought.",
    "Let wonder guide you, and the work will follow.",
    "The world is waiting for the beautiful thing only you can make.",
  ],
  "Unexpected Opportunities": [
    "Say yes to the invitation you almost declined. It may change everything.",
    "Something you least expect may become something you'll never forget.",
    "Keep your eyes open — opportunity often wears an unfamiliar face.",
    "A chance meeting may light a path you hadn't imagined.",
    "The detour may turn out to be the destination.",
    "Good fortune favours the curious. Keep wondering.",
    "A surprising message may bring surprisingly good news.",
    "The universe has a habit of rewarding open hearts.",
    "What begins as a small favour may grow into a beautiful partnership.",
    "Stay ready. The right moment rarely announces itself in advance.",
  ],
  "Gratitude & Fulfilment": [
    "Look how far you've come. That alone is worth celebrating.",
    "Gratitude turns what you have into enough — and then into more.",
    "This year, you may find that the best things were here all along.",
    "Thank the people who light your way. Then be that light for someone else.",
    "A quiet sense of contentment is finding its way to you.",
    "Count your blessings like diyas — you'll run out of lamps first.",
    "Fulfilment is not a finish line. It is the way you walk.",
    "May your heart be full in ways that money can't measure.",
    "Every small kindness you've given is woven into your good fortune.",
    "The richest moments ahead are the ones you'll share.",
  ],
};

export interface Fortune {
  id: string;
  category: Category;
  text: string;
}

export const FORTUNES: Fortune[] = (Object.keys(F) as Category[]).flatMap((c) =>
  F[c].map((text, i) => ({ id: `${c}-${i}`, category: c, text })),
);

export function pickFortune(cardId: CardId, seen: Set<string>, rand: () => number = Math.random): Fortune {
  const card = CARDS.find((c) => c.id === cardId)!;
  let pool = FORTUNES.filter((f) => card.categories.includes(f.category) && !seen.has(f.id));
  if (pool.length === 0) pool = FORTUNES.filter((f) => !seen.has(f.id));
  if (pool.length === 0) pool = FORTUNES;
  return pool[Math.floor(rand() * pool.length)]!;
}

export const LINKS = {
  main: "https://www.synergostech.com/",
  work: "https://synergostech.com/portfolio/",
  about: "https://www.synergostech.com/about-us/",
};
