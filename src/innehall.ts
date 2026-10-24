// Allt innehåll i julkalendern: Teams-länken och uppdragen.
// Luckornas placering i bilden ligger i placering.ts.

/**
 * Länken till kalenderkanalen i Teams. Högerklicka på kanalen i Teams,
 * välj "Hämta länk till kanal" och klistra in den här.
 * Så länge den är tom visar luckorna "Länken kommer snart".
 */
export const KALENDERKANALEN_URL = '';

export type Uppdrag = {
  /** Luckans datum, ÅÅÅÅ-MM-DD. Måste vara en vardag 1–23 december. */
  datum: string;
  emoji: string;
  rubrik: string;
  /** Ett stycke per sträng. */
  beskrivning: string[];
  /** Valfri länk som visas som knapp i luckan, t.ex. en instruktionsvideo. */
  lank?: { text: string; url: string };
  /**
   * 'inlägg' (standard): deltagarna postar egna inlägg i kalenderkanalen.
   * 'startinlägg': deltagarna svarar på arrangörens startinlägg i kalenderkanalen.
   */
  inlamning?: 'inlägg' | 'startinlägg';
};

export const UPPDRAG: Uppdrag[] = [
  {
    datum: '2026-12-01',
    emoji: '🔍',
    rubrik: 'Makro-mysteriet',
    beskrivning: [
      'Ta en extremt inzoomad bild på ett vardagligt föremål – hålslagaren, kaffemaskinens droppgaller, något i köket hemma. Så nära att det knappt går att se vad det är.',
      'Posta bilden och gissa på de andras genom att svara på deras inlägg. Avslöja svaret på din egen bild innan dagen är slut.',
    ],
  },
  {
    datum: '2026-12-02',
    emoji: '🍪',
    rubrik: 'Processkartan för pepparkakan',
    beskrivning: [
      'Rita processen för hur du äter en pepparkaka eller lussebulle – högst fem steg med pilar, på en post-it eller lapp.',
      'Till exempel: Inspektera → Bit av en kant → Doppa i kaffet → Fiska upp den tappade biten → Ät.',
      'Fota lappen och posta. Fotobevis krävs!',
    ],
  },
  {
    datum: '2026-12-03',
    emoji: '✏️',
    rubrik: 'Sex pennor, fyra trianglar',
    beskrivning: [
      'Bygg fyra liksidiga trianglar av exakt sex pennor. Pennorna får inte brytas eller böjas.',
      'Fota din konstruktion och posta. Bilden är beviset – en beskrivning räcker inte.',
    ],
  },
  {
    datum: '2026-12-04',
    emoji: '✍️',
    rubrik: 'Felhandsfredag',
    beskrivning: [
      'Rita en valfri julsymbol och skriv ”Trevlig helg!” på en post-it – med den hand du normalt inte skriver med.',
      'Fota och posta. Ju fulare, desto bättre.',
    ],
  },
  {
    datum: '2026-12-07',
    emoji: '☕',
    rubrik: 'Vem är koppen?',
    beskrivning: [
      'Arrangören har i smyg samlat in bilder på era favoritkoppar. Dagens kopp finns i kalenderkanalen.',
      'Svara på inlägget med vems kopp du tror att det är. Först med rätt gissning vinner äran.',
    ],
    inlamning: 'startinlägg',
  },
  {
    datum: '2026-12-08',
    emoji: '🏺',
    rubrik: 'Skrivbordets äldsta artefakt',
    beskrivning: [
      'Leta fram det äldsta föremålet som just nu ligger på ditt skrivbord, i en låda eller i väskan – ett uråldrigt suddgummi, en bortglömd USB-sticka, ett vykort från 2014.',
      'Fota det och berätta i en mening varför det fortfarande ligger kvar.',
    ],
  },
  {
    datum: '2026-12-09',
    emoji: '📎',
    rubrik: 'Gem-pyntet',
    beskrivning: [
      'Skapa det mest kreativa julpyntet av högst tio gem. Du har tio minuter på dig – sätt en timer!',
      'Fota resultatet och posta.',
    ],
  },
  {
    datum: '2026-12-10',
    emoji: '⌨️',
    rubrik: 'Den mest slitna tangenten',
    beskrivning: [
      'Hitta den mest nötta tangenten på ditt tangentbord – den blankaste ytan eller det mest bortnötta tecknet.',
      'Fota den och posta. Låt de andra gissa vad den avslöjar om dig genom att svara på ditt inlägg.',
    ],
  },
  {
    datum: '2026-12-11',
    emoji: '🌀',
    rubrik: 'Mötesmandalan',
    beskrivning: [
      'Rita runt en kaffekopp på ett papper så att du får en cirkel. Fyll cirkeln med ett mönster under ett möte eller en fikapaus i dag – en stunds avkopplande klotter.',
      'Fota och posta. Snyggast eller mest kaotiska mandala hyllas med flest reaktioner.',
    ],
  },
  {
    datum: '2026-12-14',
    emoji: '💬',
    rubrik: 'Kontorsklyschan',
    beskrivning: [
      'Vilket ord eller uttryck använder vi absolut mest just nu? Synergi? Framåtlutad? Agilt?',
      'Posta ditt förslag och reagera på de andras. Den som föreslagit ordet med flest reaktioner vid dagens slut koras till årets klyschmonark.',
    ],
  },
  {
    datum: '2026-12-15',
    emoji: '🗼',
    rubrik: 'Post-it-tornet',
    beskrivning: [
      'Bygg det högsta fristående tornet av högst tio post-it-lappar. Att vika är tillåtet – tejp, lim och andra hjälpmedel är förbjudna.',
      'Fota tornet bredvid något som visar skalan, till exempel en penna eller kaffekopp, och posta.',
    ],
  },
  {
    datum: '2026-12-16',
    emoji: '🪨',
    rubrik: 'Vardagsfriktionen',
    beskrivning: [
      'Ett litet spaningsuppdrag! Hitta ETT litet moment i din arbetsmiljö i dag som skaver – sladdtrasslet vid skärmen, dörren som alltid kärvar, den krångliga inloggningen.',
      'Fota det som skaver och skriv en mening om varför. Inga lösningar behövs – bara smärtpunkten.',
    ],
  },
  {
    datum: '2026-12-17',
    emoji: '🔊',
    rubrik: 'Ljudpusslet',
    beskrivning: [
      'Spela in fem sekunder av ett vanligt ljud från din arbetsdag – häftapparaten, någon som knappar in en kod, dragkedjan på jackan. En mobilvideo med handen över kameran fungerar utmärkt.',
      'Posta ljudet och gissa på de andras genom att svara på deras inlägg.',
    ],
  },
  {
    datum: '2026-12-18',
    emoji: '⭐',
    rubrik: 'Post-it-stjärnan',
    beskrivning: [
      'Vik en stjärna av post-it-lappar med hjälp av instruktionsvideon (ungefär två minuter).',
      'Sätt stjärnan på din datorskärm, fota den och posta.',
    ],
    // Klistra in länken till instruktionsvideon. Så länge url är tom visas ingen knapp.
    lank: { text: 'Se instruktionsvideon', url: '' },
  },
  {
    datum: '2026-12-21',
    emoji: '🔧',
    rubrik: 'Hitta felet',
    beskrivning: [
      'Fota ditt skrivbord, fikarummet eller köksbordet hemma – men placera först in något som absolut inte hör hemma där. En skiftnyckel, en lime, en kattleksak.',
      'Posta bilden. Svara på de andras inlägg med vad som inte hör hemma – först med rätt svar vinner.',
    ],
  },
  {
    datum: '2026-12-22',
    emoji: '🧩',
    rubrik: '2026 i fyra emojis',
    beskrivning: [
      'Sammanfatta ditt arbetsår 2026 med exakt fyra emojis. Ingen förklaring!',
      'Posta och gissa vad de andras emojis betyder genom att svara på deras inlägg.',
    ],
  },
  {
    datum: '2026-12-23',
    emoji: '📜',
    rubrik: 'Det gemensamma rimmet',
    beskrivning: [
      'Vi skriver årets juldikt tillsammans, rad för rad, som svar på arrangörens startinlägg. Varannan rad ska rimma på raden före.',
      'Din rad måste nämna något som står på ditt skrivbord just nu – bifoga en bild på det som bevis.',
    ],
    inlamning: 'startinlägg',
  },
];
