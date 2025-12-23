
export interface SpellingWord {
  word: string;
  phonetic: string;
  hint: string;
}

export type BeeDifficulty = 'Beginner' | 'Intermediate' | 'Expert';

export const SPELLING_BEE_DATA: Record<BeeDifficulty, SpellingWord[]> = {
  Beginner: [
    { word: 'apple', phonetic: '/ˈæp.əl/', hint: 'A round fruit that can be red, green, or yellow.' },
    { word: 'garden', phonetic: '/ˈɡɑː.dən/', hint: 'A piece of ground where flowers or vegetables are grown.' },
    { word: 'sunny', phonetic: '/ˈsʌn.i/', hint: 'When the sun is shining brightly.' },
    { word: 'school', phonetic: '/skuːl/', hint: 'A place where children go to be educated.' },
    { word: 'friend', phonetic: '/frend/', hint: 'A person who you know well and like.' },
    { word: 'winter', phonetic: '/ˈwɪn.tər/', hint: 'The coldest season of the year.' },
    { word: 'bottle', phonetic: '/ˈbɒt.əl/', hint: 'A container used for storing liquids.' },
    { word: 'pencil', phonetic: '/ˈpen.səl/', hint: 'A tool used for writing or drawing.' },
    { word: 'mother', phonetic: '/ˈmʌð.ər/', hint: 'A female parent.' },
    { word: 'purple', phonetic: '/ˈpɜː.pəl/', hint: 'A color between red and blue.' }
  ],
  Intermediate: [
    { word: 'bicycle', phonetic: '/ˈbaɪ.sɪ.kəl/', hint: 'A vehicle with two wheels that you pedal.' },
    { word: 'calendar', phonetic: '/ˈkæl.ən.dər/', hint: 'A chart showing the days, weeks, and months of a year.' },
    { word: 'dinosaur', phonetic: '/ˈdaɪ.nə.sɔːr/', hint: 'An extinct reptile from millions of years ago.' },
    { word: 'elephant', phonetic: '/ˈel.ɪ.fənt/', hint: 'A very large animal with a long trunk.' },
    { word: 'furniture', phonetic: '/ˈfɜː.nɪ.tʃər/', hint: 'Items like chairs and tables in a room.' },
    { word: 'neighbor', phonetic: '/ˈneɪ.bər/', hint: 'A person living near or next door to you.' },
    { word: 'question', phonetic: '/ˈkwes.tʃən/', hint: 'A sentence worded to elicit information.' },
    { word: 'restaurant', phonetic: '/ˈres.trɒnt/', hint: 'A place where people pay to sit and eat meals.' },
    { word: 'treasure', phonetic: '/ˈtreʒ.ər/', hint: 'A quantity of precious metals, gems, or other valuable objects.' },
    { word: 'vacation', phonetic: '/veɪˈkeɪ.ʃən/', hint: 'An extended period of recreation, especially one spent away from home.' }
  ],
  Expert: [
    { word: 'conscience', phonetic: '/ˈkɒn.ʃəns/', hint: 'An inner feeling or voice viewed as acting as a guide to rightness.' },
    { word: 'guarantee', phonetic: '/ˌɡær.ənˈtiː/', hint: 'A formal promise or assurance.' },
    { word: 'hierarchy', phonetic: '/ˈhaɪə.rɑː.ki/', hint: 'A system in which members of a society are ranked according to status.' },
    { word: 'maneuver', phonetic: '/məˈnuː.vər/', hint: 'A movement or series of moves requiring skill and care.' },
    { word: 'occurrence', phonetic: '/əˈkʌr.əns/', hint: 'An incident or event.' },
    { word: 'pharaoh', phonetic: '/ˈfeə.rəʊ/', hint: 'A ruler in ancient Egypt.' },
    { word: 'rhythm', phonetic: '/ˈrɪð.əm/', hint: 'A strong, regular, repeated pattern of movement or sound.' },
    { word: 'silhouette', phonetic: '/ˌsɪl.uˈet/', hint: 'The dark shape and outline of someone or something visible against a lighter background.' },
    { word: 'vacuum', phonetic: '/ˈvæk.juːm/', hint: 'A space entirely devoid of matter.' },
    { word: 'xenophobia', phonetic: '/ˌzen.əˈfəʊ.bi.ə/', hint: 'Dislike of or prejudice against people from other countries.' }
  ]
};
