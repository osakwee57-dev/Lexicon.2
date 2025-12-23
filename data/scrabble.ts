
import { ScrabbleWord } from '../types';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ScrabbleLevel {
  difficulty: Difficulty;
  subLevel: number;
  words: ScrabbleWord[];
}

const EMOJI_MAP: Record<string, string> = {
  apple: '🍎', ball: '⚽', dog: '🐶', fish: '🐟', hat: '🎩', milk: '🥛', pen: '🖋️', sun: '☀️', tree: '🌳', cup: '☕',
  // Removed duplicate 'tree' from this line
  cat: '🐱', book: '📖', chair: '🪑', table: '🪑', bird: '🐦', shoe: '👟', door: '🚪', car: '🚗', hand: '✋', key: '🔑',
  lamp: '💡', wall: '🧱', rain: '🌧️', bed: '🛏️', star: '⭐', bag: '🎒', egg: '🥚', leaf: '🍃', coat: '🧥', ring: '💍',
  necessary: '✅', beautiful: '✨', government: '🏛️', restaurant: '🍴', independent: '🗽', environment: '🌍', mathematics: '🔢', temperature: '🌡️', knowledge: '🧠', discipline: '🥋',
  pneumonia: '🏥', archaeologist: '🏺', chrysanthemum: '🌼', consciousness: '🧠', pronunciation: '🗣️', photosynthesis: '🌿', metamorphosis: '🦋', equilibrium: '⚖️', astrophysics: '🔭', philosophical: '💭'
};

const getEmoji = (word: string) => EMOJI_MAP[word.toLowerCase().trim()] || '❓';

export const RESERVE_DATA: Record<Difficulty, { text: string; phonetic: string }[]> = {
  Easy: [
    { text: 'APPLE', phonetic: '/ˈæp.əl/' },
    { text: 'BALL', phonetic: '/bɔːl/' },
    { text: 'DOG', phonetic: '/dɒɡ/' },
    { text: 'FISH', phonetic: '/fɪʃ/' },
    { text: 'HAT', phonetic: '/hæt/' },
    { text: 'MILK', phonetic: '/mɪlk/' },
    { text: 'PEN', phonetic: '/pɛn/' },
    { text: 'SUN', phonetic: '/sʌn/' },
    { text: 'TREE', phonetic: '/triː/' },
    { text: 'CUP', phonetic: '/kʌp/' }
  ],
  Medium: [
    { text: 'NECESSARY', phonetic: '/ˈnes.ə.ser.i/' },
    { text: 'BEAUTIFUL', phonetic: '/ˈbjuː.tɪ.fəl/' },
    { text: 'GOVERNMENT', phonetic: '/ˈɡʌv.ən.mənt/' },
    { text: 'RESTAURANT', phonetic: '/ˈres.tər.ɒnt/' },
    { text: 'INDEPENDENT', phonetic: '/ˌɪn.dɪˈpen.dənt/' },
    { text: 'ENVIRONMENT', phonetic: '/ɪnˈvaɪ.rən.mənt/' },
    { text: 'MATHEMATICS', phonetic: '/ˌmæθˈmæt.ɪks/' },
    { text: 'TEMPERATURE', phonetic: '/ˈtem.prə.tʃər/' },
    { text: 'KNOWLEDGE', phonetic: '/ˈnɒl.ɪdʒ/' },
    { text: 'DISCIPLINE', phonetic: '/ˈdɪs.ə.plɪn/' }
  ],
  Hard: [
    { text: 'PNEUMONIA', phonetic: '/njuːˈməʊ.ni.ə/' },
    { text: 'ARCHAEOLOGIST', phonetic: '/ˌɑː.kiˈɒl.ə.dʒɪst/' },
    { text: 'CHRYSANTHEMUM', phonetic: '/krɪˈsæn.θə.məm/' },
    { text: 'CONSCIOUSNESS', phonetic: '/ˈkɒn.ʃəs.nəs/' },
    { text: 'PRONUNCIATION', phonetic: '/prəˌnʌn.siˈeɪ.ʃən/' },
    { text: 'PHOTOSYNTHESIS', phonetic: '/ˌfəʊ.təʊˈsɪn.θɪ.sɪs/' },
    { text: 'METAMORPHOSIS', phonetic: '/ˌmet.əˈmɔː.fə.sɪs/' },
    { text: 'EQUILIBRIUM', phonetic: '/ˌiː.kwɪˈlɪb.ri.əm/' },
    { text: 'ASTROPHYSICS', phonetic: '/ˌæs.trəʊˈfɪz.ɪks/' },
    { text: 'PHILOSOPHICAL', phonetic: '/ˌfɪl.əˈsɒf.ɪ.kəl/' }
  ]
};

const RAW_DATA: Record<string, Record<string, any[]>> = {
  easy: {
    sublevel1: [{word: "cat", phonetic: "kæt"}, {word: "dog", phonetic: "dɔg"}, {word: "sun", phonetic: "sʌn"}, {word: "book", phonetic: "bʊk"}, {word: "tree", phonetic: "triː"}, {word: "pen", phonetic: "pɛn"}, {word: "hat", phonetic: "hæt"}, {word: "ball", phonetic: "bɔːl"}, {word: "fish", phonetic: "fɪʃ"}, {word: "chair", phonetic: "tʃɛər"}],
    sublevel2: [{word: "apple", phonetic: "ˈæp.əl"}, {word: "table", phonetic: "ˈteɪ.bəl"}, {word: "milk", phonetic: "mɪlk"}, {word: "bird", phonetic: "bɜːd"}, {word: "shoe", phonetic: "ʃuː"}, {word: "cup", phonetic: "kʌp"}, {word: "door", phonetic: "dɔːr"}, {word: "car", phonetic: "kɑːr"}, {word: "hand", phonetic: "hænd"}, {word: "key", phonetic: "kiː"}],
    sublevel3: [{word: "lamp", phonetic: "læmp"}, {word: "wall", phonetic: "wɔːl"}, {word: "rain", phonetic: "reɪn"}, {word: "bed", phonetic: "bɛd"}, {word: "star", phonetic: "stɑːr"}, {word: "bag", phonetic: "bæɡ"}, {word: "egg", phonetic: "ɛɡ"}, {word: "leaf", phonetic: "liːf"}, {word: "coat", phonetic: "kəʊt"}, {word: "ring", phonetic: "rɪŋ"}],
    sublevel4: [{word: "milk", phonetic: "mɪlk"}, {word: "book", phonetic: "bʊk"}, {word: "hat", phonetic: "hæt"}, {word: "ball", phonetic: "bɔːl"}, {word: "tree", phonetic: "triː"}, {word: "dog", phonetic: "dɔg"}, {word: "cat", phonetic: "kæt"}, {word: "chair", phonetic: "tʃɛər"}, {word: "cup", phonetic: "kʌp"}, {word: "shoe", phonetic: "shoe"}],
    sublevel5: [{word: "apple", phonetic: "ˈæp.əl"}, {word: "bird", phonetic: "bɜːd"}, {word: "hand", phonetic: "hænd"}, {word: "key", phonetic: "kiː"}, {word: "lamp", phonetic: "læmp"}, {word: "wall", phonetic: "wɔːl"}, {word: "rain", phonetic: "reɪn"}, {word: "bed", phonetic: "bɛd"}, {word: "star", phonetic: "stɑːr"}, {word: "bag", phonetic: "bæɡ"}],
    sublevel6: [{word: "egg", phonetic: "ɛɡ"}, {word: "leaf", phonetic: "liːf"}, {word: "coat", phonetic: "kəʊt"}, {word: "ring", phonetic: "rɪŋ"}, {word: "cat", phonetic: "kæt"}, {word: "dog", phonetic: "dɔg"}, {word: "sun", phonetic: "sʌn"}, {word: "book", phonetic: "bʊk"}, {word: "tree", phonetic: "triː"}, {word: "pen", phonetic: "pɛn"}],
    sublevel7: [{word: "hat", phonetic: "hæt"}, {word: "ball", phonetic: "bɔːl"}, {word: "fish", phonetic: "fɪʃ"}, {word: "chair", phonetic: "tʃɛər"}, {word: "apple", phonetic: "ˈæp.əl"}, {word: "table", phonetic: "ˈteɪ.bəl"}, {word: "milk", phonetic: "mɪlk"}, {word: "bird", phonetic: "bɜːd"}, {word: "shoe", phonetic: "ʃuː"}, {word: "cup", phonetic: "kʌp"}],
    sublevel8: [{word: "door", phonetic: "dɔːr"}, {word: "car", phonetic: "kɑːr"}, {word: "hand", phonetic: "hænd"}, {word: "key", phonetic: "kiː"}, {word: "lamp", phonetic: "læmp"}, {word: "wall", phonetic: "wɔːl"}, {word: "rain", phonetic: "reɪn"}, {word: "bed", phonetic: "bɛd"}, {word: "star", phonetic: "stɑːr"}, {word: "bag", phonetic: "bæɡ"}],
    sublevel9: [{word: "egg", phonetic: "ɛɡ"}, {word: "leaf", phonetic: "liːf"}, {word: "coat", phonetic: "kəʊt"}, {word: "ring", phonetic: "rɪŋ"}, {word: "cat", phonetic: "kæt"}, {word: "dog", phonetic: "dɔg"}, {word: "sun", phonetic: "sʌn"}, {word: "book", phonetic: "bʊk"}, {word: "tree", phonetic: "triː"}, {word: "pen", phonetic: "pɛn"}],
    sublevel10: [{word: "hat", phonetic: "hæt"}, {word: "ball", phonetic: "bɔːl"}, {word: "fish", phonetic: "fɪʃ"}, {word: "chair", phonetic: "tʃɛər"}, {word: "apple", phonetic: "ˈæp.əl"}, {word: "table", phonetic: "ˈteɪ.bəl"}, {word: "milk", phonetic: "mɪlk"}, {word: "bird", phonetic: "bɜːd"}, {word: "shoe", phonetic: "ʃuː"}, {word: "cup", phonetic: "kʌp"}]
  },
  medium: {
    sublevel1: [{word: "library", phonetic: "ˈlaɪ.brər.i"}, {word: "magnetism", phonetic: "ˈmæɡ.nə.tɪz.əm"}, {word: "bicycle", phonetic: "ˈbaɪ.sɪ.kəl"}, {word: "planet", phonetic: "ˈplæn.ɪt"}, {word: "journey", phonetic: "ˈdʒɜː.ni"}, {word: "garden", phonetic: "ˈɡɑː.dən"}, {word: "teacher", phonetic: "ˈtiː.tʃər"}, {word: "window", phonetic: "ˈwɪn.dəʊ"}, {word: "pillow", phonetic: "ˈpɪl.oʊ"}, {word: "bottle", phonetic: "ˈbɒt.əl"}],
    sublevel2: [{word: "computer", phonetic: "kəmˈpjuː.tər"}, {word: "textbook", phonetic: "ˈtɛkst.bʊk"}, {word: "compass", phonetic: "ˈkʌm.pəs"}, {word: "pencil", phonetic: "ˈpɛn.səl"}, {word: "science", phonetic: "ˈsaɪ.əns"}, {word: "monitor", phonetic: "ˈmɒn.ɪ.tər"}, {word: "mountain", phonetic: "ˈmɒʊn.tɪn"}, {word: "kitchen", phonetic: "ˈkɪtʃ.ɪn"}, {word: "elephant", phonetic: "ˈel.ɪ.fənt"}, {word: "blanket", phonetic: "ˈblæŋ.kɪt"}],
    sublevel3: [{word: "history", phonetic: "ˈhɪs.tər.i"}, {word: "geography", phonetic: "dʒiˈɒɡ.rə.fi"}, {word: "balloon", phonetic: "bəˈluːn"}, {word: "station", phonetic: "ˈsteɪ.ʃən"}, {word: "printer", phonetic: "ˈprɪn.tər"}, {word: "candle", phonetic: "ˈkæn.dəl"}, {word: "theater", phonetic: "ˈθɪə.tər"}, {word: "festival", phonetic: "ˈfes.tɪ.vəl"}, {word: "package", phonetic: "ˈpæk.ɪdʒ"}, {word: "bridge", phonetic: "brɪdʒ"}],
    sublevel4: [{word: "rocket", phonetic: "ˈrɒk.ɪt"}, {word: "window", phonetic: "ˈwɪn.dəʊ"}, {word: "guitar", phonetic: "ɡɪˈtɑːr"}, {word: "bottle", phonetic: "ˈbɒt.əl"}, {word: "garden", phonetic: "ˈɡɑː.dən"}, {word: "teacher", phonetic: "ˈtiː.tʃər"}, {word: "planet", phonetic: "ˈplæn.ɪt"}, {word: "library", phonetic: "ˈlaɪ.brər.i"}, {word: "pillow", phonetic: "ˈpɪl.oʊ"}, {word: "magnetism", phonetic: "ˈmæɡ.nə.tɪz.əm"}],
    sublevel5: [{word: "compass", phonetic: "ˈkʌm.pəs"}, {word: "science", phonetic: "ˈsaɪ.əns"}, {word: "computer", phonetic: "kəmˈpjuː.tər"}, {word: "textbook", phonetic: "ˈtɛkst.bʊk"}, {word: "mountain", phonetic: "ˈmɒʊn.tɪn"}, {word: "elephant", phonetic: "ˈel.ɪ.fənt"}, {word: "kitchen", phonetic: "ˈkɪtʃ.ɪn"}, {word: "pencil", phonetic: "ˈpɛn.səl"}, {word: "blanket", phonetic: "ˈblæŋ.kɪt"}, {word: "balloon", phonetic: "bəˈluːn"}],
    sublevel6: [{word: "station", phonetic: "ˈsteɪ.ʃən"}, {word: "printer", phonetic: "ˈprɪn.tər"}, {word: "candle", phonetic: "ˈkæn.dəl"}, {word: "theater", phonetic: "ˈθɪə.tər"}, {word: "festival", phonetic: "ˈfes.tɪ.vəl"}, {word: "package", phonetic: "ˈpæk.ɪdʒ"}, {word: "bridge", phonetic: "brɪdʒ"}, {word: "rocket", phonetic: "ˈrɒk.ɪt"}, {word: "guitar", phonetic: "ɡɪˈtɑːr"}, {word: "window", phonetic: "ˈwɪn.dəʊ"}],
    sublevel7: [{word: "bottle", phonetic: "ˈbɒt.əl"}, {word: "garden", phonetic: "ˈɡɑː.dən"}, {word: "teacher", phonetic: "ˈtiː.tʃər"}, {word: "planet", phonetic: "ˈplæn.ɪt"}, {word: "library", phonetic: "ˈlaɪ.brər.i"}, {word: "pillow", phonetic: "ˈpɪl.oʊ"}, {word: "magnetism", phonetic: "ˈmæɡ.nə.tɪz.əm"}, {word: "compass", phonetic: "ˈkʌm.pəs"}, {word: "science", phonetic: "ˈsaɪ.əns"}, {word: "computer", phonetic: "kəmˈpjuː.tər"}],
    sublevel8: [{word: "textbook", phonetic: "ˈtɛkst.bʊk"}, {word: "mountain", phonetic: "ˈmɒʊn.tɪn"}, {word: "elephant", phonetic: "ˈel.ɪ.fənt"}, {word: "kitchen", phonetic: "ˈkɪtʃ.ɪn"}, {word: "pencil", phonetic: "ˈpɛn.səl"}, {word: "blanket", phonetic: "ˈblæŋ.kɪt"}, {word: "balloon", phonetic: "bəˈluːn"}, {word: "station", phonetic: "ˈsteɪ.ʃən"}, {word: "printer", phonetic: "ˈprɪn.tər"}, {word: "candle", phonetic: "ˈkæn.dəl"}],
    sublevel9: [{word: "theater", phonetic: "ˈθɪə.tər"}, {word: "festival", phonetic: "ˈfes.tɪ.vəl"}, {word: "package", phonetic: "ˈpæk.ɪdʒ"}, {word: "bridge", phonetic: "brɪdʒ"}, {word: "rocket", phonetic: "ˈrɒk.ɪt"}, {word: "guitar", phonetic: "ɡɪˈtɑːr"}, {word: "window", phonetic: "ˈwɪn.dəʊ"}, {word: "bottle", phonetic: "ˈbɒt.əl"}, {word: "garden", phonetic: "ˈɡɑː.dən"}, {word: "teacher", phonetic: "ˈtiː.tʃər"}],
    sublevel10: [{word: "planet", phonetic: "ˈplæn.ɪt"}, {word: "library", phonetic: "ˈlaɪ.brər.i"}, {word: "pillow", phonetic: "ˈpɪl.oʊ"}, {word: "magnetism", phonetic: "ˈmæɡ.nə.tɪz.əm"}, {word: "compass", phonetic: "ˈkʌm.pəs"}, {word: "science", phonetic: "ˈsaɪ.əns"}, {word: "computer", phonetic: "kəmˈpjuː.tər"}, {word: "textbook", phonetic: "ˈtɛkst.bʊk"}, {word: "mountain", phonetic: "ˈmɒʊn.tɪn"}, {word: "elephant", phonetic: "ˈel.ɪ.fənt"}]
  },
  hard: {
    sublevel1: [{"word": "pneumonia", "phonetic": "njuːˈməʊ.ni.ə"}, {"word": "colossus", "phonetic": "kəˈlɒs.əs"}, {"word": "volcano", "phonetic": "vɒlˈkeɪ.nəʊ"}, {"word": "labyrinth", "phonetic": "ˈlæb.ɪ.rɪnθ"}, {"word": "silhouette", "phonetic": "ˌsɪl.uˈet"}, {"word": "quarantine", "phonetic": "ˈkwɒr.ən.tiːn"}, {"word": "chameleon", "phonetic": "kəˈmiː.li.ən"}, {"word": "manuscript", "phonetic": "ˈmæn.jʊ.skrɪpt"}, {"word": "catastrophe", "phonetic": "kəˈtæs.trə.fi"}, {"word": "phenomenon", "phonetic": "fɪˈnɒm.ɪ.nɒn"}],
    sublevel2: [{"word": "ultramicroscopy", "phonetic": "ˌʌl.trə.maɪˈkrɒs.kə.pi"}, {"word": "electromagnetism", "phonetic": "ɪˌlɛk.trəʊˈmæɡ.nɪ.tɪ.zəm"}, {"word": "photosynthesis", "phonetic": "ˌfəʊ.təʊˈsɪn.θɪ.sɪs"}, {"word": "microorganism", "phonetic": "ˌmaɪ.krəʊˈɔː.ɡən.ɪ.zəm"}, {"word": "architecture", "phonetic": "ˈɑː.kɪ.tɛk.tʃər"}, {"word": "infrastructure", "phonetic": "ˈɪn.frəˌstrʌk.tʃər"}, {"word": "telecommunication", "phonetic": "ˌtɛl.ɪ.kəˌmjuː.nɪˈkeɪ.ʃən"}, {"word": "transportation", "phonetic": "ˌtræn.spɔːˈteɪ.ʃən"}, {"word": "responsibility", "phonetic": "rɪˌspɒn.sɪˈbɪl.ɪ.ti"}, {"word": "civilization", "phonetic": "ˌsɪv.ɪ.laɪˈzeɪ.ʃən"}],
    sublevel3: [{"word": "juxtaposition", "phonetic": "ˌdʒʌk.stə.pəˈzɪʃ.ən"}, {"word": "bureaucracy", "phonetic": "bjʊəˈrɒk.rə.si"}, {"word": "consciousness", "phonetic": "ˈkɒn.ʃəs.nəs"}, {"word": "metamorphosis", "phonetic": "ˌmɛt.əˈmɔː.fəʊ.sɪs"}, {"word": "incomprehensible", "phonetic": "ˌɪn.kɒm.prɪˈhɛn.sɪ.bəl"}, {"word": "philosophical", "phonetic": "ˌfɪl.əˈsɒf.ɪ.kəl"}, {"word": "uncharacteristic", "phonetic": "ˌʌn.kær.ɪk.təˈrɪs.tɪk"}, {"word": "misinterpretation", "phonetic": "ˌmɪs.ɪnˌtɜː.prɪˈteɪ.ʃən"}, {"word": "counterproductive", "phonetic": "ˌkaʊn.tə.prəˈdʌk.tɪv"}, {"word": "unpredictability", "phonetic": "ˌʌn.prɪˌdɪk.təˈbɪl.ɪ.ti"}],
    sublevel4: [{"word": "chrysanthemum", "phonetic": "krɪˈsæn.θə.məm"}, {"word": "sesquipedalian", "phonetic": "ˌsɛs.kwɪ.pɪˈdeɪ.lɪ.ən"}, {"word": "otorhinolaryngology", "phonetic": "ˌəʊ.təʊˌrɪn.əʊˌlær.ɪŋˈɡɒl.ə.dʒi"}, {"word": "electroencephalogram", "phonetic": "ɪˌlɛk.trəʊ.ɛnˈsɛf.ə.lə.ɡræm"}, {"word": "neuroplasticity", "phonetic": "ˌnjʊə.rəʊ.plæˈstɪs.ɪ.ti"}, {"word": "epistemological", "phonetic": "ɪˌpɪs.tɪˌmɒl.əˈlɒdʒ.ɪ.kəl"}, {"word": "antidisestablishmentarianism", "phonetic": "ˌæn.tɪˌdɪs.ɪˌstæb.lɪʃ.mənˈtɛə.ri.ə.nɪ.zəm"}, {"word": "intersubjectivity", "phonetic": "ˌɪn.təˌsʌb.dʒɛkˈtɪv.ɪ.ti"}, {"word": "psycholinguistics", "phonetic": "ˌsaɪ.kəʊ.lɪŋˈɡwɪs.tɪks"}, {"word": "orthographically", "phonetic": "ˌɔː.θəʊˈɡræf.ɪ.kəl.i"}],
    sublevel5: [{"word": "thermodynamics", "phonetic": "ˌθɜː.məʊ.daɪˈnæm.ɪks"}, {"word": "quantification", "phonetic": "ˌkwɒn.tɪ.fɪˈkeɪ.ʃən"}, {"word": "extrapolation", "phonetic": "ɪkˌstræp.əˈleɪ.ʃən"}, {"word": "synchronization", "phonetic": "ˌsɪŋ.krə.naɪˈzeɪ.ʃən"}, {"word": "disproportionate", "phonetic": "ˌdɪs.prəˈpɔː.ʃən.ət"}, {"word": "interdisciplinary", "phonetic": "ˌɪn.tə.dɪs.ɪˈplɪn.ər.i"}, {"word": "categorization", "phonetic": "ˌkæt.ɪ.ɡər.aɪˈzeɪ.ʃən"}, {"word": "approximation", "phonetic": "əˌprɒk.sɪˈmeɪ.ʃən"}, {"word": "trigonometry", "phonetic": "ˌtrɪɡ.əˈnɒm.ɪ.tri"}, {"word": "parallelogram", "phonetic": "ˌpær.əˈlɛl.ə.ɡræm"}],
    sublevel6: [{"word": "bioluminescence", "phonetic": "ˌbaɪ.əʊˌluː.mɪˈnɛs.əns"}, {"word": "electrophoresis", "phonetic": "ɪˌlɛk.trəʊ.fəˈriː.sɪs"}, {"word": "neurotransmitter", "phonetic": "ˌnjʊə.rəʊ.trænzˈmɪt.ər"}, {"word": "spectrophotometer", "phonetic": "ˌspɛk.trəʊ.fəʊˈtɒm.ɪ.tər"}, {"word": "thermoregulation", "phonetic": "ˌθɜː.məʊˌrɛɡ.jʊˈleɪ.ʃən"}, {"word": "bioavailability", "phonetic": "ˌbaɪ.əʊ.əˌveɪ.ləˈbɪl.ɪ.ti"}, {"word": "microarchitecture", "phonetic": "ˌmaɪ.krəʊˈɑː.kɪ.tɛk.tʃər"}, {"word": "photosensitivity", "phonetic": "ˌfəʊ.təʊ.sɛn.sɪˈtɪv.ɪ.ti"}, {"word": "electrochemical", "phonetic": "ɪˌlɛk.trəʊˈkɛm.ɪ.kəl"}, {"word": "photosensitive", "phonetic": "ˌfəʊ.təʊˈsɛn.sɪ.tɪv"}],
    sublevel7: [{"word": "constitutionalism", "phonetic": "ˌkɒn.stɪ.tjuːˈʃɒn.əl.ɪ.zəm"}, {"word": "socioeconomic", "phonetic": "ˌsəʊ.si.əʊˌɛk.əˈnɒm.ɪk"}, {"word": "authoritarianism", "phonetic": "ɔːˌθɒr.ɪˈtɛə.ri.ən.ɪ.zəm"}, {"word": "decentralization", "phonetic": "ˌdiː.sɛn.trə.laɪˈzeɪ.ʃən"}, {"word": "internationalism", "phonetic": "ˌɪn.təˈnæʃ.ən.əl.ɪ.zəm"}, {"word": "multiculturalism", "phonetic": "ˌmʌl.tiˈkʌl.tʃər.əl.ɪ.zəm"}, {"word": "industrialization", "phonetic": "ɪnˌdʌs.trɪ.ə.laɪˈzeɪ.ʃən"}, {"word": "legitimization", "phonetic": "lɪˌdʒɪt.ɪ.maɪˈzeɪ.ʃən"}, {"word": "democratization", "phonetic": "dɪˌmɒk.rə.taɪˈzeɪ.ʃən"}, {"word": "bureaucratization", "phonetic": "bjʊəˌrɒk.rə.taɪˈzeɪ.ʃən"}],
    sublevel8: [{"word": "hypothalamus", "phonetic": "ˌhaɪ.pəʊˈθæl.ə.məs"}, {"word": "gastroenterology", "phonetic": "ˌɡæs.trəʊˌɛn.təˈrɒl.ə.dʒi"}, {"word": "cardiovascular", "phonetic": "ˌkɑː.dɪ.əʊˈvæs.kjʊ.lər"}, {"word": "immunodeficiency", "phonetic": "ɪˌmjuː.nəʊ.dɪˈfɪʃ.ən.si"}, {"word": "pathophysiology", "phonetic": "ˌpæθ.əʊ.fɪz.iˈɒl.ə.dʒi"}, {"word": "endocrinologist", "phonetic": "ˌɛn.dəʊ.krɪˈnɒl.ə.dʒɪst"}, {"word": "neurodegenerative", "phonetic": "ˌnjʊə.rəʊ.dɪˈdʒɛn.ər.ə.tɪv"}, {"word": "hematopoiesis", "phonetic": "hɪˌmæt.əʊ.pɔɪˈiː.sɪs"}, {"word": "pharmacokinetics", "phonetic": "ˌfɑː.mə.kəʊ.kɪˈnɛt.ɪks"}, {"word": "electrocardiogram", "phonetic": "ɪˌlɛk.trəʊˈkɑː.dɪ.əʊ.ɡræm"}],
    sublevel9: [{"word": "lexicographically", "phonetic": "ˌlɛk.sɪ.kəˈɡræf.ɪ.kəl.i"}, {"word": "semantics", "phonetic": "sɪˈmæn.tɪks"}, {"word": "morphophonemics", "phonetic": "ˌmɔː.fəʊ.fəˈniː.mɪks"}, {"word": "sociolinguistics", "phonetic": "ˌsəʊ.si.əʊ.lɪŋˈɡwɪs.tɪks"}, {"word": "pragmatics", "phonetic": "præɡˈmæt.ɪks"}, {"word": "phonotactics", "phonetic": "ˌfəʊ.nəʊˈtæk.tɪks"}, {"word": "etymological", "phonetic": "ˌɛt.ɪ.məˈlɒdʒ.ɪ.kəl"}, {"word": "allomorph", "phonetic": "ˈæl.əʊ.mɔːf"}, {"word": "suprasegmental", "phonetic": "ˌsuː.prə.sɛɡˈmɛn.təl"}, {"word": "diachronic", "phonetic": "ˌdaɪ.əˈkrɒn.ɪk"}],
    sublevel10: [{"word": "counterrevolutionary", "phonetic": "ˌkaʊn.tə.rɛv.əˈluː.ʃən.ər.i"}, {"word": "institutionalization", "phonetic": "ˌɪn.stɪ.tjuː.ʃən.əl.aɪˈzeɪ.ʃən"}, {"word": "deinstitutionalization", "phonetic": "ˌdiː.ɪn.stɪ.tjuː.ʃən.əl.aɪˈzeɪ.ʃən"}, {"word": "irreversibility", "phonetic": "ˌɪr.rɪ.vɜː.səˈbɪl.ɪ.ti"}, {"word": "intergovernmental", "phonetic": "ˌɪn.təˌɡʌv.ənˈmɛn.təl"}, {"word": "hyperparameterization", "phonetic": "ˌhaɪ.pə.pəˌræm.ɪ.tə.raɪˈzeɪ.ʃən"}, {"word": "multidimensionality", "phonetic": "ˌmʌl.ti.daɪ.mɛn.ʃəˈnæl.ɪ.ti"}, {"word": "incompatibility", "phonetic": "ˌɪn.kəm.pæt.əˈbɪl.ɪ.ti"}, {"word": "counterintelligence", "phonetic": "ˌkaʊn.tər.ɪnˈtɛl.ɪ.dʒəns"}, {"word": "nonrepresentational", "phonetic": "ˌnɒn.rɛ.prɪ.zɛnˈteɪ.ʃən.əl"}]
  }
};

// Define and export SCRABBLE_DATA
export const SCRABBLE_DATA: ScrabbleLevel[] = [];

(['Easy', 'Medium', 'Hard'] as Difficulty[]).forEach(diff => {
  const dataMap = RAW_DATA[diff.toLowerCase()];
  for (let i = 1; i <= 10; i++) {
    const rawWords = dataMap[`sublevel${i}`] || [];
    const words = rawWords.map((w, index) => ({
      id: `${diff.toLowerCase()}-${i}-${index}`,
      text: w.word.toUpperCase().trim(),
      phonetic: `/${w.phonetic}/`,
      emoji: getEmoji(w.word)
    }));
    SCRABBLE_DATA.push({ difficulty: diff, subLevel: i, words });
  }
});
