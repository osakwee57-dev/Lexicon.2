
import { SoundGroup } from '../types';

export const SOUNDS_DATA: SoundGroup[] = [
  // --- VOWELS (Monophthongs) ---
  {
    symbol: 'iː',
    category: 'vowel',
    exampleWords: [
      { text: 'sheep', phonetic: '/ʃiːp/', description: 'Long "ee" sound.', production: 'Lips spread wide, tongue high and forward.' },
      { text: 'tree', phonetic: '/triː/', description: 'Long high front vowel.', production: 'Front of tongue raised to the roof.' },
      { text: 'green', phonetic: '/ɡriːn/', description: 'Long high front vowel.', production: 'Lips spread as if smiling.' },
      { text: 'meet', phonetic: '/miːt/', description: 'Long high front vowel.', production: 'Tongue is tense.' },
      { text: 'beach', phonetic: '/biːtʃ/', description: 'Long high front vowel.', production: 'Air flows over the high tongue.' },
      { text: 'speak', phonetic: '/spiːk/', description: 'Long high front vowel.', production: 'Keep lips tense.' },
      { text: 'clean', phonetic: '/kliːn/', description: 'Long high front vowel.', production: 'Tongue tip behind lower teeth.' },
      { text: 'sleep', phonetic: '/sliːp/', description: 'Long high front vowel.', production: 'Long duration vowel.' },
      { text: 'key', phonetic: '/kiː/', description: 'Long high front vowel.', production: 'Mouth almost closed.' },
      { text: 'tea', phonetic: '/tiː/', description: 'Long high front vowel.', production: 'Classic long vowel sound.' }
    ]
  },
  {
    symbol: 'ɪ',
    category: 'vowel',
    exampleWords: [
      { text: 'ship', phonetic: '/ʃɪp/', description: 'Short "i" sound.', production: 'Lips relaxed, tongue slightly lower than /iː/.' },
      { text: 'bit', phonetic: '/bɪt/', description: 'Short front vowel.', production: 'Quick, relaxed sound.' },
      { text: 'city', phonetic: '/ˈsɪti/', description: 'Short front vowel.', production: 'Mouth slightly more open.' },
      { text: 'thin', phonetic: '/θɪn/', description: 'Short front vowel.', production: 'Tongue is relaxed.' },
      { text: 'wing', phonetic: '/wɪŋ/', description: 'Short front vowel.', production: 'Brief sound duration.' },
      { text: 'milk', phonetic: '/mɪlk/', description: 'Short front vowel.', production: 'Short and sharp.' },
      { text: 'fish', phonetic: '/fɪʃ/', description: 'Short front vowel.', production: 'Tongue neutral front.' },
      { text: 'bridge', phonetic: '/brɪdʒ/', description: 'Short front vowel.', production: 'Lower jaw slightly.' },
      { text: 'king', phonetic: '/kɪŋ/', description: 'Short front vowel.', production: 'Quick release.' },
      { text: 'hit', phonetic: '/hɪt/', description: 'Short front vowel.', production: 'Lax vocal muscles.' }
    ]
  },
  {
    symbol: 'ʊ',
    category: 'vowel',
    exampleWords: [
      { text: 'good', phonetic: '/ɡʊd/', description: 'Short "oo" sound.', production: 'Lips slightly rounded and relaxed.' },
      { text: 'book', phonetic: '/bʊk/', description: 'Short back vowel.', production: 'Back of tongue raised slightly.' },
      { text: 'foot', phonetic: '/fʊt/', description: 'Short back vowel.', production: 'Short and relaxed.' },
      { text: 'put', phonetic: '/pʊt/', description: 'Short back vowel.', production: 'Lips not as rounded as /u:/.' },
      { text: 'sugar', phonetic: '/ˈʃʊɡər/', description: 'Short back vowel.', production: 'Relaxed mouth position.' },
      { text: 'push', phonetic: '/pʊʃ/', description: 'Short back vowel.', production: 'Quick sound burst.' },
      { text: 'cook', phonetic: '/kʊk/', description: 'Short back vowel.', production: 'Tongue towards the soft palate.' },
      { text: 'wood', phonetic: '/wʊd/', description: 'Short back vowel.', production: 'Neutral rounded lips.' },
      { text: 'full', phonetic: '/fʊl/', description: 'Short back vowel.', production: 'Keep it short.' },
      { text: 'look', phonetic: '/lʊk/', description: 'Short back vowel.', production: 'Quick relaxed duration.' }
    ]
  },
  {
    symbol: 'uː',
    category: 'vowel',
    exampleWords: [
      { text: 'moon', phonetic: '/muːn/', description: 'Long "oo" sound.', production: 'Lips tightly rounded, tongue high back.' },
      { text: 'blue', phonetic: '/bluː/', description: 'Long back vowel.', production: 'Pucker the lips.' },
      { text: 'shoe', phonetic: '/ʃuː/', description: 'Long back vowel.', production: 'Tense lip rounding.' },
      { text: 'food', phonetic: '/fuːd/', description: 'Long back vowel.', production: 'Long duration sound.' },
      { text: 'glue', phonetic: '/ɡluː/', description: 'Long back vowel.', production: 'Push tongue back.' },
      { text: 'rule', phonetic: '/ruːl/', description: 'Long back vowel.', production: 'Tight round circle with lips.' },
      { text: 'move', phonetic: '/muːv/', description: 'Long back vowel.', production: 'Vocal cords vibrate long.' },
      { text: 'school', phonetic: '/skuːl/', description: 'Long back vowel.', production: 'Steady high back tongue.' },
      { text: 'two', phonetic: '/tuː/', description: 'Long back vowel.', production: 'Classic tense vowel.' },
      { text: 'fruit', phonetic: '/fruːt/', description: 'Long back vowel.', production: 'Keep lips rounded throughout.' }
    ]
  },
  {
    symbol: 'e',
    category: 'vowel',
    exampleWords: [
      { text: 'bed', phonetic: '/bed/', description: 'Short "e" sound.', production: 'Mouth moderately open, tongue mid-front.' },
      { text: 'head', phonetic: '/hed/', description: 'Short mid vowel.', production: 'Lips relaxed and neutral.' },
      { text: 'desk', phonetic: '/desk/', description: 'Short mid vowel.', production: 'Tongue at medium height.' },
      { text: 'red', phonetic: '/red/', description: 'Short mid vowel.', production: 'Quick, flat sound.' },
      { text: 'egg', phonetic: '/eɡ/', description: 'Short mid vowel.', production: 'Mouth halfway open.' },
      { text: 'pen', phonetic: '/pen/', description: 'Short mid vowel.', production: 'Short and clear.' },
      { text: 'help', phonetic: '/help/', description: 'Short mid vowel.', production: 'Relaxed jaw.' },
      { text: 'test', phonetic: '/test/', description: 'Short mid vowel.', production: 'Sharp mid-front sound.' },
      { text: 'next', phonetic: '/nekst/', description: 'Short mid vowel.', production: 'Steady tongue position.' },
      { text: 'bread', phonetic: '/bred/', description: 'Short mid vowel.', production: 'Quick vocal release.' }
    ]
  },
  {
    symbol: 'ə',
    category: 'vowel',
    exampleWords: [
      { text: 'teacher', phonetic: '/ˈtiːtʃər/', description: 'The "schwa" sound.', production: 'The most relaxed sound, center of mouth.' },
      { text: 'about', phonetic: '/əˈbaʊt/', description: 'Unstressed vowel.', production: 'Completely neutral mouth.' },
      { text: 'banana', phonetic: '/bəˈnænə/', description: 'Weak vowel sound.', production: 'Minimal effort required.' },
      { text: 'mother', phonetic: '/ˈmʌðər/', description: 'Ending schwa.', production: 'Relax jaw and lips.' },
      { text: 'soda', phonetic: '/ˈsoʊdə/', description: 'Final unstressed vowel.', production: 'Brief, lazy sound.' },
      { text: 'cinema', phonetic: '/ˈsɪnəmə/', description: 'Internal schwa.', production: 'Tongue in the very middle.' },
      { text: 'zebra', phonetic: '/ˈziːbrə/', description: 'Final schwa.', production: 'No tension at all.' },
      { text: 'doctor', phonetic: '/ˈdɒktər/', description: 'Unstressed ending.', production: 'Neutral vocalization.' },
      { text: 'around', phonetic: '/əˈraʊnd/', description: 'Initial schwa.', production: 'Shortest possible vowel.' },
      { text: 'camera', phonetic: '/ˈkæmrə/', description: 'Reduced vowel.', production: 'Quick central sound.' }
    ]
  },
  {
    symbol: 'ɜː',
    category: 'vowel',
    exampleWords: [
      { text: 'bird', phonetic: '/bɜːrd/', description: 'Long mid-central vowel.', production: 'Lips neutral, center of tongue raised.' },
      { text: 'work', phonetic: '/wɜːrk/', description: 'Long central vowel.', production: 'Long duration, neutral lips.' },
      { text: 'girl', phonetic: '/ɡɜːrl/', description: 'Long central vowel.', production: 'Steady middle tongue.' },
      { text: 'nurse', phonetic: '/nɜːrs/', description: 'Long central vowel.', production: 'No lip rounding.' },
      { text: 'learn', phonetic: '/lɜːrn/', description: 'Long central vowel.', production: 'Tense mid-mouth sound.' },
      { text: 'shirt', phonetic: '/ʃɜːrt/', description: 'Long central vowel.', production: 'Smooth long duration.' },
      { text: 'word', phonetic: '/wɜːrd/', description: 'Long central vowel.', production: 'Stable tongue position.' },
      { text: 'earth', phonetic: '/ɜːrθ/', description: 'Long central vowel.', production: 'Open slightly, keep central.' },
      { text: 'surf', phonetic: '/sɜːrf/', description: 'Long central vowel.', production: 'Continuous voiced sound.' },
      { text: 'burn', phonetic: '/bɜːrn/', description: 'Long central vowel.', production: 'Maintain mid-height.' }
    ]
  },
  {
    symbol: 'ɔː',
    category: 'vowel',
    exampleWords: [
      { text: 'door', phonetic: '/dɔːr/', description: 'Long "or" sound.', production: 'Lips rounded, back of tongue raised.' },
      { text: 'saw', phonetic: '/sɔː/', description: 'Long mid-back vowel.', production: 'Open mouth, round lips.' },
      { text: 'ball', phonetic: '/bɔːl/', description: 'Long mid-back vowel.', production: 'Tense rounding.' },
      { text: 'walk', phonetic: '/wɔːk/', description: 'Long mid-back vowel.', production: 'Long duration back vowel.' },
      { text: 'fork', phonetic: '/fɔːrk/', description: 'Long mid-back vowel.', production: 'Back of tongue high.' },
      { text: 'tall', phonetic: '/tɔːl/', description: 'Long mid-back vowel.', production: 'Steady rounded shape.' },
      { text: 'water', phonetic: '/ˈwɔːtər/', description: 'Long mid-back vowel.', production: 'Clear back sound.' },
      { text: 'born', phonetic: '/bɔːrn/', description: 'Long mid-back vowel.', production: 'Deep back vowel.' },
      { text: 'law', phonetic: '/lɔː/', description: 'Long mid-back vowel.', production: 'Low-mid back position.' },
      { text: 'morning', phonetic: '/ˈmɔːrnɪŋ/', description: 'Long mid-back vowel.', production: 'O-like rounding.' }
    ]
  },
  {
    symbol: 'æ',
    category: 'vowel',
    exampleWords: [
      { text: 'cat', phonetic: '/kæt/', description: 'Short "a" sound.', production: 'Mouth open wide, tongue low front.' },
      { text: 'apple', phonetic: '/ˈæpəl/', description: 'Short open front vowel.', production: 'Lower jaw significantly.' },
      { text: 'back', phonetic: '/bæk/', description: 'Short open front vowel.', production: 'Flat tongue, low.' },
      { text: 'happy', phonetic: '/ˈhæpi/', description: 'Short open front vowel.', production: 'Wide mouth opening.' },
      { text: 'man', phonetic: '/mæn/', description: 'Short open front vowel.', production: 'Tense open sound.' },
      { text: 'sad', phonetic: '/sæd/', description: 'Short open front vowel.', production: 'Keep jaw down.' },
      { text: 'flag', phonetic: '/flæɡ/', description: 'Short open front vowel.', production: 'Stretch corners of mouth.' },
      { text: 'map', phonetic: '/mæp/', description: 'Short open front vowel.', production: 'Quick wide release.' },
      { text: 'bank', phonetic: '/bæŋk/', description: 'Short open front vowel.', production: 'Low front tongue.' },
      { text: 'hand', phonetic: '/hænd/', description: 'Short open front vowel.', production: 'Strong open vowel.' }
    ]
  },
  {
    symbol: 'ʌ',
    category: 'vowel',
    exampleWords: [
      { text: 'cup', phonetic: '/kʌp/', description: 'Short "uh" sound.', production: 'Mouth open, tongue relaxed central.' },
      { text: 'love', phonetic: '/lʌv/', description: 'Short mid-low vowel.', production: 'Neutral open mouth.' },
      { text: 'sun', phonetic: '/sʌn/', description: 'Short mid-low vowel.', production: 'Quick, central burst.' },
      { text: 'bus', phonetic: '/bʌs/', description: 'Short mid-low vowel.', production: 'Relaxed tongue, low-mid.' },
      { text: 'mother', phonetic: '/ˈmʌðər/', description: 'Short mid-low vowel.', production: 'Short and natural.' },
      { text: 'under', phonetic: '/ˈʌndər/', description: 'Short mid-low vowel.', production: 'No lip rounding.' },
      { text: 'luck', phonetic: '/lʌk/', description: 'Short mid-low vowel.', production: 'Tongue stays low.' },
      { text: 'money', phonetic: '/ˈmʌni/', description: 'Short mid-low vowel.', production: 'Common mid vowel.' },
      { text: 'cut', phonetic: '/kʌt/', description: 'Short mid-low vowel.', production: 'Short and punchy.' },
      { text: 'jump', phonetic: '/dʒʌmp/', description: 'Short mid-low vowel.', production: 'Quick central vowel.' }
    ]
  },
  {
    symbol: 'ɑː',
    category: 'vowel',
    exampleWords: [
      { text: 'car', phonetic: '/kɑːr/', description: 'Long "ah" sound.', production: 'Mouth open wide, tongue low back.' },
      { text: 'father', phonetic: '/ˈfɑːðər/', description: 'Long back vowel.', production: 'Deep, open throat sound.' },
      { text: 'dark', phonetic: '/dɑːrk/', description: 'Long back vowel.', production: 'Long duration, open jaw.' },
      { text: 'party', phonetic: '/ˈpɑːrti/', description: 'Long back vowel.', production: 'Steady open back.' },
      { text: 'star', phonetic: '/stɑːr/', description: 'Long back vowel.', production: 'Tongue at very bottom.' },
      { text: 'heart', phonetic: '/hɑːrt/', description: 'Long back vowel.', production: 'Deep resonant vowel.' },
      { text: 'glass', phonetic: '/ɡlɑːs/', description: 'Long back vowel.', production: 'Mouth fully relaxed open.' },
      { text: 'bath', phonetic: '/bɑːθ/', description: 'Long back vowel.', production: 'Broad back sound.' },
      { text: 'arm', phonetic: '/ɑːrm/', description: 'Long back vowel.', production: 'No lip rounding.' },
      { text: 'hard', phonetic: '/hɑːrd/', description: 'Long back vowel.', production: 'Strong long back vowel.' }
    ]
  },
  {
    symbol: 'ɒ',
    category: 'vowel',
    exampleWords: [
      { text: 'hot', phonetic: '/hɒt/', description: 'Short "o" sound.', production: 'Mouth open, lips slightly rounded back.' },
      { text: 'dog', phonetic: '/dɒɡ/', description: 'Short back vowel.', production: 'Quick open back sound.' },
      { text: 'box', phonetic: '/bɒks/', description: 'Short back vowel.', production: 'Slight lip rounding.' },
      { text: 'stop', phonetic: '/stɒp/', description: 'Short back vowel.', production: 'Tongue low and back.' },
      { text: 'clock', phonetic: '/klɒk/', description: 'Short back vowel.', production: 'Quick duration.' },
      { text: 'long', phonetic: '/lɒŋ/', description: 'Short back vowel.', production: 'Mouth quite open.' },
      { text: 'want', phonetic: '/wɒnt/', description: 'Short back vowel.', production: 'Relaxed rounding.' },
      { text: 'gone', phonetic: '/ɡɒn/', description: 'Short back vowel.', production: 'Sharp back vowel.' },
      { text: 'rock', phonetic: '/rɒk/', description: 'Short back vowel.', production: 'Deep but short.' },
      { text: 'shop', phonetic: '/ʃɒp/', description: 'Short back vowel.', production: 'Open jaw slightly.' }
    ]
  },

  // --- DIPHTHONGS (Moving Sounds) ---
  {
    symbol: 'eɪ',
    category: 'diphthong',
    exampleWords: [
      { text: 'face', phonetic: '/feɪs/', description: 'Moves from "e" to "i".', production: 'Start with /e/ and slide to /ɪ/.' },
      { text: 'day', phonetic: '/deɪ/', description: 'Double vowel sound.', production: 'Lips spread as it slides.' },
      { text: 'rain', phonetic: '/reɪn/', description: 'Gliding vowel.', production: 'Tongue moves up and forward.' },
      { text: 'make', phonetic: '/meɪk/', description: 'Gliding vowel.', production: 'Close jaw slightly as you finish.' },
      { text: 'eight', phonetic: '/eɪt/', description: 'Gliding vowel.', production: 'Smooth transition between sounds.' },
      { text: 'game', phonetic: '/ɡeɪm/', description: 'Gliding vowel.', production: 'Start mid-open.' },
      { text: 'train', phonetic: '/treɪn/', description: 'Gliding vowel.', production: 'Long glide duration.' },
      { text: 'stay', phonetic: '/steɪ/', description: 'Gliding vowel.', production: 'Finish with higher tongue.' },
      { text: 'plane', phonetic: '/pleɪn/', description: 'Gliding vowel.', production: 'Clear two-part sound.' },
      { text: 'wait', phonetic: '/weɪt/', description: 'Gliding vowel.', production: 'End with /ɪ/ sound.' }
    ]
  },
  {
    symbol: 'aɪ',
    category: 'diphthong',
    exampleWords: [
      { text: 'sky', phonetic: '/skaɪ/', description: 'Moves from "ah" to "i".', production: 'Start with open /ɑː/ and slide to /ɪ/.' },
      { text: 'light', phonetic: '/laɪt/', description: 'Gliding vowel.', production: 'Wide open start, closing jaw.' },
      { text: 'fly', phonetic: '/flaɪ/', description: 'Gliding vowel.', production: 'Tongue moves high front.' },
      { text: 'my', phonetic: '/maɪ/', description: 'Gliding vowel.', production: 'Very open initial sound.' },
      { text: 'white', phonetic: '/waɪt/', description: 'Gliding vowel.', production: 'Slide the tongue up.' },
      { text: 'bike', phonetic: '/baɪk/', description: 'Gliding vowel.', production: 'Quick closing transition.' },
      { text: 'night', phonetic: '/naɪt/', description: 'Gliding vowel.', production: 'High contrast between parts.' },
      { text: 'kind', phonetic: '/kaɪnd/', description: 'Gliding vowel.', production: 'Resonant first part.' },
      { text: 'eye', phonetic: '/aɪ/', description: 'Gliding vowel.', production: 'Classic wide-to-high glide.' },
      { text: 'time', phonetic: '/taɪm/', description: 'Gliding vowel.', production: 'Maintain clarity in the glide.' }
    ]
  },
  {
    symbol: 'ɔɪ',
    category: 'diphthong',
    exampleWords: [
      { text: 'boy', phonetic: '/bɔɪ/', description: 'Moves from "or" to "i".', production: 'Start with rounded /ɔː/ and slide to /ɪ/.' },
      { text: 'coin', phonetic: '/kɔɪn/', description: 'Gliding vowel.', production: 'Lips round then spread.' },
      { text: 'toy', phonetic: '/tɔɪ/', description: 'Gliding vowel.', production: 'Tongue moves forward.' },
      { text: 'voice', phonetic: '/vɔɪs/', description: 'Gliding vowel.', production: 'Strong initial rounding.' },
      { text: 'join', phonetic: '/dʒɔɪn/', description: 'Gliding vowel.', production: 'Finish with higher tongue.' },
      { text: 'noise', phonetic: '/nɔɪz/', description: 'Gliding vowel.', production: 'Smooth lip transition.' },
      { text: 'point', phonetic: '/pɔɪnt/', description: 'Gliding vowel.', production: 'Round to spread glide.' },
      { text: 'oil', phonetic: '/ɔɪl/', description: 'Gliding vowel.', production: 'Deep start, bright finish.' },
      { text: 'choice', phonetic: '/tʃɔɪs/', description: 'Gliding vowel.', production: 'Tongue slides forward.' },
      { text: 'enjoy', phonetic: '/ɪnˈdʒɔɪ/', description: 'Gliding vowel.', production: 'Two distinct vowel targets.' }
    ]
  },
  {
    symbol: 'əʊ',
    category: 'diphthong',
    exampleWords: [
      { text: 'go', phonetic: '/ɡəʊ/', description: 'Moves from schwa to "oo".', production: 'Start neutral and slide to rounded /ʊ/.' },
      { text: 'home', phonetic: '/həʊm/', description: 'Gliding vowel.', production: 'Lips round at the end.' },
      { text: 'boat', phonetic: '/bəʊt/', description: 'Gliding vowel.', production: 'Tongue moves back and up.' },
      { text: 'cold', phonetic: '/kəʊld/', description: 'Gliding vowel.', production: 'Start with mid-central mouth.' },
      { text: 'nose', phonetic: '/nəʊz/', description: 'Gliding vowel.', production: 'Finish with small lip circle.' },
      { text: 'slow', phonetic: '/sləʊ/', description: 'Gliding vowel.', production: 'Smooth rounding glide.' },
      { text: 'phone', phonetic: '/fəʊn/', description: 'Gliding vowel.', production: 'Center to back transition.' },
      { text: 'road', phonetic: '/rəʊd/', description: 'Gliding vowel.', production: 'Tense finish with lips.' },
      { text: 'show', phonetic: '/ʃəʊ/', description: 'Gliding vowel.', production: 'Keep the glide continuous.' },
      { text: 'soap', phonetic: '/səʊp/', description: 'Gliding vowel.', production: 'End with rounded tension.' }
    ]
  },
  {
    symbol: 'aʊ',
    category: 'diphthong',
    exampleWords: [
      { text: 'now', phonetic: '/naʊ/', description: 'Moves from "ah" to "oo".', production: 'Start very open and slide to rounded /ʊ/.' },
      { text: 'house', phonetic: '/haʊs/', description: 'Gliding vowel.', production: 'Large jaw movement up.' },
      { text: 'cloud', phonetic: '/klaʊd/', description: 'Gliding vowel.', production: 'Open mouth, then round lips.' },
      { text: 'mouth', phonetic: '/maʊθ/', description: 'Gliding vowel.', production: 'Tongue slides back.' },
      { text: 'down', phonetic: '/daʊn/', description: 'Gliding vowel.', production: 'Strong open-to-close glide.' },
      { text: 'cow', phonetic: '/kaʊ/', description: 'Gliding vowel.', production: 'Finish with rounded lips.' },
      { text: 'town', phonetic: '/taʊn/', description: 'Gliding vowel.', production: 'Maintain open start.' },
      { text: 'loud', phonetic: '/laʊd/', description: 'Gliding vowel.', production: 'Clear transition between parts.' },
      { text: 'brown', phonetic: '/braʊn/', description: 'Gliding vowel.', production: 'Wide jaw opening to finish.' },
      { text: 'found', phonetic: '/faʊnd/', description: 'Gliding vowel.', production: 'Rounded ending.' }
    ]
  },
  {
    symbol: 'ɪə',
    category: 'diphthong',
    exampleWords: [
      { text: 'near', phonetic: '/nɪər/', description: 'Moves from "i" to schwa.', production: 'Start with /ɪ/ and slide to /ə/.' },
      { text: 'here', phonetic: '/hɪər/', description: 'Gliding vowel.', production: 'Tongue drops to neutral.' },
      { text: 'ear', phonetic: '/ɪər/', description: 'Gliding vowel.', production: 'Lips move from spread to neutral.' },
      { text: 'clear', phonetic: '/klɪər/', description: 'Gliding vowel.', production: 'Start high, finish central.' },
      { text: 'beer', phonetic: '/bɪər/', description: 'Gliding vowel.', production: 'Quick relaxation glide.' },
      { text: 'dear', phonetic: '/dɪər/', description: 'Gliding vowel.', production: 'High front to central.' },
      { text: 'fear', phonetic: '/fɪər/', description: 'Gliding vowel.', production: 'Smooth drop in tongue.' },
      { text: 'gear', phonetic: '/ɡɪər/', description: 'Gliding vowel.', production: 'Maintain the /ɪ/ start.' },
      { text: 'year', phonetic: '/jɪər/', description: 'Gliding vowel.', production: 'Tongue slides down.' },
      { text: 'steer', phonetic: '/stɪər/', description: 'Gliding vowel.', production: 'Consistent centring glide.' }
    ]
  },
  {
    symbol: 'eə',
    category: 'diphthong',
    exampleWords: [
      { text: 'hair', phonetic: '/heər/', description: 'Moves from "e" to schwa.', production: 'Start with /e/ and slide to /ə/.' },
      { text: 'there', phonetic: '/ðeər/', description: 'Gliding vowel.', production: 'Mouth stays moderately open.' },
      { text: 'care', phonetic: '/keər/', description: 'Gliding vowel.', production: 'Tongue drops from mid to center.' },
      { text: 'air', phonetic: '/eər/', description: 'Gliding vowel.', production: 'Slide back to neutral.' },
      { text: 'wear', phonetic: '/weər/', description: 'Gliding vowel.', production: 'Relax jaw slightly.' },
      { text: 'chair', phonetic: '/tʃeər/', description: 'Gliding vowel.', production: 'Start mid-front.' },
      { text: 'fair', phonetic: '/feər/', description: 'Gliding vowel.', production: 'Consistent mid-to-central glide.' },
      { text: 'square', phonetic: '/skweər/', description: 'Gliding vowel.', production: 'Mouth relaxes at end.' },
      { text: 'bear', phonetic: '/beər/', description: 'Gliding vowel.', production: 'Open mid-front start.' },
      { text: 'pear', phonetic: '/peər/', description: 'Gliding vowel.', production: 'Centring diphthong.' }
    ]
  },
  {
    symbol: 'ʊə',
    category: 'diphthong',
    exampleWords: [
      { text: 'pure', phonetic: '/pjʊər/', description: 'Moves from "oo" to schwa.', production: 'Start with rounded /ʊ/ and slide to /ə/.' },
      { text: 'tour', phonetic: '/tʊər/', description: 'Gliding vowel.', production: 'Lips unround as tongue drops.' },
      { text: 'cure', phonetic: '/kjʊər/', description: 'Gliding vowel.', production: 'Start back, slide to center.' },
      { text: 'sure', phonetic: '/ʃʊər/', description: 'Gliding vowel.', production: 'Relaxed rounding to neutral.' },
      { text: 'poor', phonetic: '/pʊər/', description: 'Gliding vowel.', production: 'Back high to middle glide.' },
      { text: 'during', phonetic: '/ˈdjʊərɪŋ/', description: 'Gliding vowel.', production: 'Smooth transition to schwa.' },
      { text: 'fewer', phonetic: '/ˈfjuːər/', description: 'Gliding vowel.', production: 'Clear rounding at start.' },
      { text: 'mature', phonetic: '/məˈtʃʊər/', description: 'Gliding vowel.', production: 'End with neutral jaw.' },
      { text: 'tourist', phonetic: '/ˈtʊərɪst/', description: 'Gliding vowel.', production: 'Continuous glide sound.' },
      { text: 'jury', phonetic: '/ˈdʒʊəri/', description: 'Gliding vowel.', production: 'Brief rounding transition.' }
    ]
  },

  // --- CONSONANTS (Voiced & Voiceless) ---
  {
    symbol: 'p',
    category: 'consonant',
    exampleWords: [
      { text: 'pen', phonetic: '/pen/', description: 'Voiceless plosive.', production: 'Lips together, release with air puff.' },
      { text: 'apple', phonetic: '/ˈæpəl/', description: 'Voiceless plosive.', production: 'Firm lip closure.' },
      { text: 'stop', phonetic: '/stɒp/', description: 'Voiceless plosive.', production: 'Final release of air.' },
      { text: 'pink', phonetic: '/pɪŋk/', description: 'Voiceless plosive.', production: 'Strong initial burst.' },
      { text: 'paper', phonetic: '/ˈpeɪpər/', description: 'Voiceless plosive.', production: 'Double lip burst.' },
      { text: 'map', phonetic: '/mæp/', description: 'Voiceless plosive.', production: 'Quick final closure.' },
      { text: 'pilot', phonetic: '/ˈpaɪlət/', description: 'Voiceless plosive.', production: 'Air release before vowel.' },
      { text: 'soup', phonetic: '/suːp/', description: 'Voiceless plosive.', production: 'Light final closure.' },
      { text: 'play', phonetic: '/pleɪ/', description: 'Voiceless plosive.', production: 'Explosion of air.' },
      { text: 'jump', phonetic: '/dʒʌmp/', description: 'Voiceless plosive.', production: 'End with lip press.' }
    ]
  },
  {
    symbol: 'b',
    category: 'consonant',
    exampleWords: [
      { text: 'ball', phonetic: '/bɔːl/', description: 'Voiced plosive.', production: 'Lips together, vibrate vocal cords.' },
      { text: 'baby', phonetic: '/ˈbeɪbi/', description: 'Voiced plosive.', production: 'Voiced burst from lips.' },
      { text: 'crab', phonetic: '/kræb/', description: 'Voiced plosive.', production: 'Soft final voicing.' },
      { text: 'blue', phonetic: '/bluː/', description: 'Voiced plosive.', production: 'Voiced initial sound.' },
      { text: 'about', phonetic: '/əˈbaʊt/', description: 'Voiced plosive.', production: 'Middle voiced closure.' },
      { text: 'book', phonetic: '/bʊk/', description: 'Voiced plosive.', production: 'Lower jaw drops for b.' },
      { text: 'rabbit', phonetic: '/ˈræbɪt/', description: 'Voiced plosive.', production: 'Quick internal voicing.' },
      { text: 'black', phonetic: '/blæk/', description: 'Voiced plosive.', production: 'Strong voiced release.' },
      { text: 'table', phonetic: '/ˈteɪbl/', description: 'Voiced plosive.', production: 'Smooth voiced plosive.' },
      { text: 'rob', phonetic: '/rɒb/', description: 'Voiced plosive.', production: 'Final vibrating release.' }
    ]
  },
  {
    symbol: 't',
    category: 'consonant',
    exampleWords: [
      { text: 'tea', phonetic: '/tiː/', description: 'Voiceless plosive.', production: 'Tongue tip against roof, release air.' },
      { text: 'tree', phonetic: '/triː/', description: 'Voiceless plosive.', production: 'Sharp air release.' },
      { text: 'cat', phonetic: '/kæt/', description: 'Voiceless plosive.', production: 'Final tongue tap.' },
      { text: 'stop', phonetic: '/stɒp/', description: 'Voiceless plosive.', production: 'Brief tongue blockage.' },
      { text: 'table', phonetic: '/ˈteɪbl/', description: 'Voiceless plosive.', production: 'Strong initial release.' },
      { text: 'better', phonetic: '/ˈbetər/', description: 'Voiceless plosive.', production: 'Quick middle tap.' },
      { text: 'hat', phonetic: '/hæt/', description: 'Voiceless plosive.', production: 'Tongue stops the air.' },
      { text: 'train', phonetic: '/treɪn/', description: 'Voiceless plosive.', production: 'Crisp initial sound.' },
      { text: 'hot', phonetic: '/hɒt/', description: 'Voiceless plosive.', production: 'Final sharp release.' },
      { text: 'ten', phonetic: '/ten/', description: 'Voiceless plosive.', production: 'Explosion from tongue tip.' }
    ]
  },
  {
    symbol: 'd',
    category: 'consonant',
    exampleWords: [
      { text: 'dog', phonetic: '/dɒɡ/', description: 'Voiced plosive.', production: 'Tongue against roof, vibrate cords.' },
      { text: 'dad', phonetic: '/dæd/', description: 'Voiced plosive.', production: 'Voiced tongue release.' },
      { text: 'bird', phonetic: '/bɜːrd/', description: 'Voiced plosive.', production: 'Final voiced tap.' },
      { text: 'day', phonetic: '/deɪ/', description: 'Voiced plosive.', production: 'Initial voiced burst.' },
      { text: 'ladder', phonetic: '/ˈlædər/', description: 'Voiced plosive.', production: 'Middle voiced tap.' },
      { text: 'cold', phonetic: '/kəʊld/', description: 'Voiced plosive.', production: 'Ending voiced tap.' },
      { text: 'dance', phonetic: '/dæns/', description: 'Voiced plosive.', production: 'Tense initial voicing.' },
      { text: 'red', phonetic: '/red/', description: 'Voiced plosive.', production: 'Soft voiced finish.' },
      { text: 'doctor', phonetic: '/ˈdɒktər/', description: 'Voiced plosive.', production: 'Clear voiced release.' },
      { text: 'bad', phonetic: '/bæd/', description: 'Voiced plosive.', production: 'Deep voiced ending.' }
    ]
  },
  {
    symbol: 'k',
    category: 'consonant',
    exampleWords: [
      { text: 'cat', phonetic: '/kæt/', description: 'Voiceless plosive.', production: 'Back of tongue against soft palate.' },
      { text: 'kite', phonetic: '/kaɪt/', description: 'Voiceless plosive.', production: 'Sharp back release.' },
      { text: 'book', phonetic: '/bʊk/', description: 'Voiceless plosive.', production: 'Final back burst.' },
      { text: 'car', phonetic: '/kɑːr/', description: 'Voiceless plosive.', production: 'Explosion of air from back.' },
      { text: 'key', phonetic: '/kiː/', description: 'Voiceless plosive.', production: 'Strong initial click.' },
      { text: 'black', phonetic: '/blæk/', description: 'Voiceless plosive.', production: 'Ending air burst.' },
      { text: 'milk', phonetic: '/mɪlk/', description: 'Voiceless plosive.', production: 'Soft final click.' },
      { text: 'clock', phonetic: '/klɒk/', description: 'Voiceless plosive.', production: 'Steady back release.' },
      { text: 'kind', phonetic: '/kaɪnd/', description: 'Voiceless plosive.', production: 'Clear initial back tap.' },
      { text: 'walk', phonetic: '/wɔːk/', description: 'Voiceless plosive.', production: 'Final back of tongue tap.' }
    ]
  },
  {
    symbol: 'g',
    category: 'consonant',
    exampleWords: [
      { text: 'go', phonetic: '/ɡəʊ/', description: 'Voiced plosive.', production: 'Back of tongue against roof, vibrate.' },
      { text: 'bag', phonetic: '/bæɡ/', description: 'Voiced plosive.', production: 'Voiced back release.' },
      { text: 'green', phonetic: '/ɡriːn/', description: 'Voiced plosive.', production: 'Initial voiced burst.' },
      { text: 'dog', phonetic: '/dɒɡ/', description: 'Voiced plosive.', production: 'Final voiced burst.' },
      { text: 'game', phonetic: '/ɡeɪm/', description: 'Voiced plosive.', production: 'Strong initial voicing.' },
      { text: 'bigger', phonetic: '/ˈbɪɡər/', description: 'Voiced plosive.', production: 'Middle voiced tap.' },
      { text: 'egg', phonetic: '/eɡ/', description: 'Voiced plosive.', production: 'Ending voiced tap.' },
      { text: 'gold', phonetic: '/ɡəʊld/', description: 'Voiced plosive.', production: 'Clear voiced release.' },
      { text: 'leg', phonetic: '/leɡ/', description: 'Voiced plosive.', production: 'Soft voiced ending.' },
      { text: 'girl', phonetic: '/ɡɜːrl/', description: 'Voiced plosive.', production: 'Heavy voiced start.' }
    ]
  },
  {
    symbol: 'f',
    category: 'consonant',
    exampleWords: [
      { text: 'fish', phonetic: '/fɪʃ/', description: 'Voiceless fricative.', production: 'Upper teeth on lower lip, blow air.' },
      { text: 'phone', phonetic: '/fəʊn/', description: 'Voiceless fricative.', production: 'Continuous air flow.' },
      { text: 'leaf', phonetic: '/liːf/', description: 'Voiceless fricative.', production: 'Final air hiss.' },
      { text: 'four', phonetic: '/fɔːr/', description: 'Voiceless fricative.', production: 'Steady initial friction.' },
      { text: 'coffee', phonetic: '/ˈkɒfi/', description: 'Voiceless fricative.', production: 'Middle friction sound.' },
      { text: 'laugh', phonetic: '/lɑːf/', description: 'Voiceless fricative.', production: 'End with air hiss.' },
      { text: 'fast', phonetic: '/fɑːst/', description: 'Voiceless fricative.', production: 'Sharp initial air.' },
      { text: 'off', phonetic: '/ɒf/', description: 'Voiceless fricative.', production: 'Strong final friction.' },
      { text: 'flower', phonetic: '/ˈflaʊər/', description: 'Voiceless fricative.', production: 'Soft initial air flow.' },
      { text: 'knife', phonetic: '/naɪf/', description: 'Voiceless fricative.', production: 'Ending with lip-teeth hiss.' }
    ]
  },
  {
    symbol: 'v',
    category: 'consonant',
    exampleWords: [
      { text: 'van', phonetic: '/væn/', description: 'Voiced fricative.', production: 'Upper teeth on lip, vibrate cords.' },
      { text: 'love', phonetic: '/lʌv/', description: 'Voiced fricative.', production: 'Voiced final hiss.' },
      { text: 'voice', phonetic: '/vɔɪs/', description: 'Voiced fricative.', production: 'Vibrating initial sound.' },
      { text: 'seven', phonetic: '/ˈsevən/', description: 'Voiced fricative.', production: 'Middle voiced friction.' },
      { text: 'gave', phonetic: '/ɡeɪv/', description: 'Voiced fricative.', production: 'Ending voiced hiss.' },
      { text: 'very', phonetic: '/ˈveri/', description: 'Voiced fricative.', production: 'Strong initial voicing.' },
      { text: 'river', phonetic: '/ˈrɪvər/', description: 'Voiced fricative.', production: 'Steady middle voicing.' },
      { text: 'leave', phonetic: '/liːv/', description: 'Voiced fricative.', production: 'Final voiced vibration.' },
      { text: 'visit', phonetic: '/ˈvɪzɪt/', description: 'Voiced fricative.', production: 'Clear voiced start.' },
      { text: 'move', phonetic: '/muːv/', description: 'Voiced fricative.', production: 'Deep voiced vibration.' }
    ]
  },
  {
    symbol: 'θ',
    category: 'consonant',
    exampleWords: [
      { text: 'thin', phonetic: '/θɪn/', description: 'Voiceless fricative.', production: 'Tongue between teeth, blow air.' },
      { text: 'bath', phonetic: '/bɑːθ/', description: 'Voiceless fricative.', production: 'Final soft air hiss.' },
      { text: 'three', phonetic: '/θriː/', description: 'Voiceless fricative.', production: 'Tongue tip air flow.' },
      { text: 'mouth', phonetic: '/maʊθ/', description: 'Voiceless fricative.', production: 'Interdental air flow.' },
      { text: 'think', phonetic: '/θɪŋk/', description: 'Voiceless fricative.', production: 'Sharp initial hiss.' },
      { text: 'earth', phonetic: '/ɜːrθ/', description: 'Voiceless fricative.', production: 'Soft ending air.' },
      { text: 'both', phonetic: '/bəʊθ/', description: 'Voiceless fricative.', production: 'Clean final hiss.' },
      { text: 'thumb', phonetic: '/θʌm/', description: 'Voiceless fricative.', production: 'Steady tongue start.' },
      { text: 'north', phonetic: '/nɔːrθ/', description: 'Voiceless fricative.', production: 'End with tongue out.' },
      { text: 'breath', phonetic: '/breθ/', description: 'Voiceless fricative.', production: 'Quiet air release.' }
    ]
  },
  {
    symbol: 'ð',
    category: 'consonant',
    exampleWords: [
      { text: 'this', phonetic: '/ðɪs/', description: 'Voiced fricative.', production: 'Tongue between teeth, vibrate cords.' },
      { text: 'mother', phonetic: '/ˈmʌðər/', description: 'Voiced fricative.', production: 'Voiced middle friction.' },
      { text: 'that', phonetic: '/ðæt/', description: 'Voiced fricative.', production: 'Vibrating initial tongue.' },
      { text: 'they', phonetic: '/ðeɪ/', description: 'Voiced fricative.', production: 'Strong voiced start.' },
      { text: 'brother', phonetic: '/ˈbrʌðər/', description: 'Voiced fricative.', production: 'Middle voiced vibration.' },
      { text: 'breathe', phonetic: '/briːð/', description: 'Voiced fricative.', production: 'Final voiced vibration.' },
      { text: 'with', phonetic: '/wɪð/', description: 'Voiced fricative.', production: 'Soft voiced ending.' },
      { text: 'these', phonetic: '/ðiːz/', description: 'Voiced fricative.', production: 'Steady voiced flow.' },
      { text: 'weather', phonetic: '/ˈweðər/', description: 'Voiced fricative.', production: 'Clear middle voiced th.' },
      { text: 'smooth', phonetic: '/smuːð/', description: 'Voiced fricative.', production: 'Final voiced transition.' }
    ]
  },
  {
    symbol: 's',
    category: 'consonant',
    exampleWords: [
      { text: 'sun', phonetic: '/sʌn/', description: 'Voiceless fricative.', production: 'Tongue near roof, hiss air through teeth.' },
      { text: 'sit', phonetic: '/sɪt/', description: 'Voiceless fricative.', production: 'Sharp initial hiss.' },
      { text: 'bus', phonetic: '/bʌs/', description: 'Voiceless fricative.', production: 'Final air hiss.' },
      { text: 'city', phonetic: '/ˈsɪti/', description: 'Voiceless fricative.', production: 'High frequency hiss.' },
      { text: 'stop', phonetic: '/stɒp/', description: 'Voiceless fricative.', production: 'Brief initial hiss.' },
      { text: 'glass', phonetic: '/ɡlɑːs/', description: 'Voiceless fricative.', production: 'Long final hiss.' },
      { text: 'fast', phonetic: '/fɑːst/', description: 'Voiceless fricative.', production: 'Middle air flow.' },
      { text: 'sister', phonetic: '/ˈsɪstər/', description: 'Voiceless fricative.', production: 'Two hiss sounds.' },
      { text: 'face', phonetic: '/feɪs/', description: 'Voiceless fricative.', production: 'End with dental hiss.' },
      { text: 'six', phonetic: '/sɪks/', description: 'Voiceless fricative.', production: 'Sharp start and end hiss.' }
    ]
  },
  {
    symbol: 'z',
    category: 'consonant',
    exampleWords: [
      { text: 'zoo', phonetic: '/zuː/', description: 'Voiced fricative.', production: 'Hiss while vibrating vocal cords.' },
      { text: 'busy', phonetic: '/ˈbɪzi/', description: 'Voiced fricative.', production: 'Middle voiced buzz.' },
      { text: 'nose', phonetic: '/nəʊz/', description: 'Voiced fricative.', production: 'Final voiced buzz.' },
      { text: 'lazy', phonetic: '/ˈleɪzi/', description: 'Voiced fricative.', production: 'Steady middle vibration.' },
      { text: 'cheese', phonetic: '/tʃiːz/', description: 'Voiced fricative.', production: 'Final buzz sound.' },
      { text: 'zebra', phonetic: '/ˈziːbrə/', description: 'Voiced fricative.', production: 'Strong initial buzz.' },
      { text: 'rose', phonetic: '/rəʊz/', description: 'Voiced fricative.', production: 'End with vibrating hiss.' },
      { text: 'zero', phonetic: '/ˈzɪərəʊ/', description: 'Voiced fricative.', production: 'Clear initial vibration.' },
      { text: 'music', phonetic: '/ˈmjuːzɪk/', description: 'Voiced fricative.', production: 'Buzzing middle sound.' },
      { text: 'boys', phonetic: '/bɔɪz/', description: 'Voiced fricative.', production: 'Ending voiced buzz.' }
    ]
  },
  {
    symbol: 'ʃ',
    category: 'consonant',
    exampleWords: [
      { text: 'she', phonetic: '/ʃiː/', description: 'Voiceless fricative.', production: 'Rounded lips, hiss from center of tongue.' },
      { text: 'shoe', phonetic: '/ʃuː/', description: 'Voiceless fricative.', production: 'Broad initial hiss.' },
      { text: 'fish', phonetic: '/fɪʃ/', description: 'Voiceless fricative.', production: 'Final quiet hiss.' },
      { text: 'ship', phonetic: '/ʃɪp/', description: 'Voiceless fricative.', production: 'Sharp initial "sh".' },
      { text: 'wash', phonetic: '/wɒʃ/', description: 'Voiceless fricative.', production: 'End with broad hiss.' },
      { text: 'shop', phonetic: '/ʃɒp/', description: 'Voiceless fricative.', production: 'Initial rounded hiss.' },
      { text: 'wish', phonetic: '/wɪʃ/', description: 'Voiceless fricative.', production: 'Soft final sh sound.' },
      { text: 'sugar', phonetic: '/ˈʃʊɡər/', description: 'Voiceless fricative.', production: 'Unexpected initial sh.' },
      { text: 'station', phonetic: '/ˈsteɪʃən/', description: 'Voiceless fricative.', production: 'Middle broad hiss.' },
      { text: 'ocean', phonetic: '/ˈəʊʃən/', description: 'Voiceless fricative.', production: 'Steady internal sh.' }
    ]
  },
  {
    symbol: 'ʒ',
    category: 'consonant',
    exampleWords: [
      { text: 'vision', phonetic: '/ˈvɪʒən/', description: 'Voiced fricative.', production: 'Broad hiss with voiced vibration.' },
      { text: 'measure', phonetic: '/ˈmeʒər/', description: 'Voiced fricative.', production: 'Voiced middle sh-sound.' },
      { text: 'pleasure', phonetic: '/ˈpleʒər/', description: 'Voiced fricative.', production: 'Internal voiced hiss.' },
      { text: 'television', phonetic: '/ˈtelɪvɪʒən/', description: 'Voiced fricative.', production: 'Soft voiced sh buzz.' },
      { text: 'garage', phonetic: '/ˈɡærɑːʒ/', description: 'Voiced fricative.', production: 'Final voiced sh.' },
      { text: 'treasure', phonetic: '/ˈtreʒər/', description: 'Voiced fricative.', production: 'Deep middle vibration.' },
      { text: 'usual', phonetic: '/ˈjuːʒuəl/', description: 'Voiced fricative.', production: 'Voiced transition sound.' },
      { text: 'casual', phonetic: '/ˈkæʒuəl/', description: 'Voiced fricative.', production: 'Steady voiced flow.' },
      { text: 'decision', phonetic: '/dɪˈsɪʒən/', description: 'Voiced fricative.', production: 'Vibrating internal sh.' },
      { text: 'beige', phonetic: '/beɪʒ/', description: 'Voiced fricative.', production: 'Ending with voiced sh.' }
    ]
  },
  {
    symbol: 'h',
    category: 'consonant',
    exampleWords: [
      { text: 'hot', phonetic: '/hɒt/', description: 'Voiceless fricative.', production: 'Open throat, push air out.' },
      { text: 'hat', phonetic: '/hæt/', description: 'Voiceless fricative.', production: 'Initial breath sound.' },
      { text: 'help', phonetic: '/help/', description: 'Voiceless fricative.', production: 'Quick air burst.' },
      { text: 'home', phonetic: '/həʊm/', description: 'Voiceless fricative.', production: 'Steady initial breath.' },
      { text: 'happy', phonetic: '/ˈhæpi/', description: 'Voiceless fricative.', production: 'Breath before vowel.' },
      { text: 'hand', phonetic: '/hænd/', description: 'Voiceless fricative.', production: 'Clear initial air flow.' },
      { text: 'hill', phonetic: '/hɪl/', description: 'Voiceless fricative.', production: 'Short air push.' },
      { text: 'head', phonetic: '/hed/', description: 'Voiceless fricative.', production: 'Open vocal tract air.' },
      { text: 'horse', phonetic: '/hɔːrs/', description: 'Voiceless fricative.', production: 'Strong initial breath.' },
      { text: 'who', phonetic: '/huː/', description: 'Voiceless fricative.', production: 'Round lips, push air.' }
    ]
  },
  {
    symbol: 'm',
    category: 'consonant',
    exampleWords: [
      { text: 'man', phonetic: '/mæn/', description: 'Nasal consonant.', production: 'Lips closed, air through nose.' },
      { text: 'moon', phonetic: '/muːn/', description: 'Nasal consonant.', production: 'Initial humming sound.' },
      { text: 'game', phonetic: '/ɡeɪm/', description: 'Nasal consonant.', production: 'Final humming closure.' },
      { text: 'mother', phonetic: '/ˈmʌðər/', description: 'Nasal consonant.', production: 'Steady initial hum.' },
      { text: 'name', phonetic: '/neɪm/', description: 'Nasal consonant.', production: 'End with closed lips.' },
      { text: 'milk', phonetic: '/mɪlk/', description: 'Nasal consonant.', production: 'Humming start.' },
      { text: 'climb', phonetic: '/klaɪm/', description: 'Nasal consonant.', production: 'Final lip closure hum.' },
      { text: 'summer', phonetic: '/ˈsʌmər/', description: 'Nasal consonant.', production: 'Middle humming sound.' },
      { text: 'room', phonetic: '/ruːm/', description: 'Nasal consonant.', production: 'Steady final hum.' },
      { text: 'home', phonetic: '/həʊm/', description: 'Nasal consonant.', production: 'Vibrating final m.' }
    ]
  },
  {
    symbol: 'n',
    category: 'consonant',
    exampleWords: [
      { text: 'no', phonetic: '/nəʊ/', description: 'Nasal consonant.', production: 'Tongue against roof, air through nose.' },
      { text: 'sun', phonetic: '/sʌn/', description: 'Nasal consonant.', production: 'Final nasal hum.' },
      { text: 'ten', phonetic: '/ten/', description: 'Nasal consonant.', production: 'End with tongue on roof.' },
      { text: 'nose', phonetic: '/nəʊz/', description: 'Nasal consonant.', production: 'Initial nasal hum.' },
      { text: 'green', phonetic: '/ɡriːn/', description: 'Nasal consonant.', production: 'Final humming tongue tap.' },
      { text: 'nice', phonetic: '/naɪs/', description: 'Nasal consonant.', production: 'Clear initial hum.' },
      { text: 'funny', phonetic: '/ˈfʌni/', description: 'Nasal consonant.', production: 'Internal nasal sound.' },
      { text: 'rain', phonetic: '/reɪn/', description: 'Nasal consonant.', production: 'Hum through the nose.' },
      { text: 'night', phonetic: '/naɪt/', description: 'Nasal consonant.', production: 'Steady initial humming.' },
      { text: 'win', phonetic: '/wɪn/', description: 'Nasal consonant.', production: 'End with nasal vibration.' }
    ]
  },
  {
    symbol: 'ŋ',
    category: 'consonant',
    exampleWords: [
      { text: 'sing', phonetic: '/sɪŋ/', description: 'Nasal consonant.', production: 'Back of tongue on soft palate, air through nose.' },
      { text: 'long', phonetic: '/lɒŋ/', description: 'Nasal consonant.', production: 'Final back hum.' },
      { text: 'king', phonetic: '/kɪŋ/', description: 'Nasal consonant.', production: 'Ending nasal vibration.' },
      { text: 'song', phonetic: '/sɒŋ/', description: 'Nasal consonant.', production: 'Deep back hum.' },
      { text: 'wing', phonetic: '/wɪŋ/', description: 'Nasal consonant.', production: 'Tongue stays back.' },
      { text: 'bring', phonetic: '/brɪŋ/', description: 'Nasal consonant.', production: 'Clear final humming.' },
      { text: 'spring', phonetic: '/sprɪŋ/', description: 'Nasal consonant.', production: 'Resonant back nasal.' },
      { text: 'bank', phonetic: '/bæŋk/', description: 'Nasal consonant.', production: 'Internal back hum.' },
      { text: 'pink', phonetic: '/pɪŋk/', description: 'Nasal consonant.', production: 'Middle nasal vibration.' },
      { text: 'strong', phonetic: '/strɒŋ/', description: 'Nasal consonant.', production: 'Final steady nasal.' }
    ]
  },
  {
    symbol: 'l',
    category: 'consonant',
    exampleWords: [
      { text: 'leg', phonetic: '/leɡ/', description: 'Lateral consonant.', production: 'Tongue tip on roof, air flows sides.' },
      { text: 'ball', phonetic: '/bɔːl/', description: 'Lateral consonant.', production: 'Final tongue tip tap.' },
      { text: 'love', phonetic: '/lʌv/', description: 'Lateral consonant.', production: 'Initial side flow.' },
      { text: 'blue', phonetic: '/bluː/', description: 'Lateral consonant.', production: 'Middle air flow sound.' },
      { text: 'look', phonetic: '/lʊk/', description: 'Lateral consonant.', production: 'Initial lateral sound.' },
      { text: 'will', phonetic: '/wɪl/', description: 'Lateral consonant.', production: 'Final side vibration.' },
      { text: 'light', phonetic: '/laɪt/', description: 'Lateral consonant.', production: 'Clear initial tap.' },
      { text: 'apple', phonetic: '/ˈæpəl/', description: 'Lateral consonant.', production: 'Soft final tap.' },
      { text: 'leaf', phonetic: '/liːf/', description: 'Lateral consonant.', production: 'Steady initial lateral.' },
      { text: 'yellow', phonetic: '/ˈjeləʊ/', description: 'Lateral consonant.', production: 'Internal lateral flow.' }
    ]
  },
  {
    symbol: 'r',
    category: 'consonant',
    exampleWords: [
      { text: 'red', phonetic: '/red/', description: 'Approximant.', production: 'Tongue curls back, does not touch roof.' },
      { text: 'run', phonetic: '/rʌn/', description: 'Approximant.', production: 'Initial curled tongue.' },
      { text: 'tree', phonetic: '/triː/', description: 'Approximant.', production: 'Middle tongue curl.' },
      { text: 'green', phonetic: '/ɡriːn/', description: 'Approximant.', production: 'Soft internal flow.' },
      { text: 'car', phonetic: '/kɑːr/', description: 'Approximant.', production: 'Final tongue lift (rhotic).' },
      { text: 'road', phonetic: '/rəʊd/', description: 'Approximant.', production: 'Initial resonant flow.' },
      { text: 'bird', phonetic: '/bɜːrd/', description: 'Approximant.', production: 'Middle curling sound.' },
      { text: 'read', phonetic: '/riːd/', description: 'Approximant.', production: 'Clear initial curl.' },
      { text: 'right', phonetic: '/raɪt/', description: 'Approximant.', production: 'Steady tongue position.' },
      { text: 'very', phonetic: '/ˈveri/', description: 'Approximant.', production: 'Internal smooth flow.' }
    ]
  },
  {
    symbol: 'j',
    category: 'consonant',
    exampleWords: [
      { text: 'yes', phonetic: '/jes/', description: 'Approximant.', production: 'Tongue high front, moves to next vowel.' },
      { text: 'you', phonetic: '/juː/', description: 'Approximant.', production: 'Initial gliding sound.' },
      { text: 'yellow', phonetic: '/ˈjeləʊ/', description: 'Approximant.', production: 'Quick front glide.' },
      { text: 'year', phonetic: '/jɪər/', description: 'Approximant.', production: 'Initial high tongue.' },
      { text: 'music', phonetic: '/ˈmjuːzɪk/', description: 'Approximant.', production: 'Internal glide sound.' },
      { text: 'view', phonetic: '/vjuː/', description: 'Approximant.', production: 'Middle high glide.' },
      { text: 'use', phonetic: '/juːz/', description: 'Approximant.', production: 'Steady initial glide.' },
      { text: 'yesterday', phonetic: '/ˈjestədeɪ/', description: 'Approximant.', production: 'Quick initial motion.' },
      { text: 'beyond', phonetic: '/biˈjɒnd/', description: 'Approximant.', production: 'Internal glide transition.' },
      { text: 'young', phonetic: '/jʌŋ/', description: 'Approximant.', production: 'High front tongue start.' }
    ]
  },
  {
    symbol: 'w',
    category: 'consonant',
    exampleWords: [
      { text: 'wet', phonetic: '/wet/', description: 'Approximant.', production: 'Lips rounded, glide to next vowel.' },
      { text: 'win', phonetic: '/wɪn/', description: 'Approximant.', production: 'Initial rounded glide.' },
      { text: 'white', phonetic: '/waɪt/', description: 'Approximant.', production: 'Quick lip unrounding.' },
      { text: 'water', phonetic: '/ˈwɔːtər/', description: 'Approximant.', production: 'Steady initial glide.' },
      { text: 'wait', phonetic: '/weɪt/', description: 'Approximant.', production: 'Rounded start glide.' },
      { text: 'walk', phonetic: '/wɔːk/', description: 'Approximant.', production: 'Initial smooth glide.' },
      { text: 'week', phonetic: '/wiːk/', description: 'Approximant.', production: 'Pucker and release.' },
      { text: 'window', phonetic: '/ˈwɪndəʊ/', description: 'Approximant.', production: 'Initial rounded motion.' },
      { text: 'went', phonetic: '/went/', description: 'Approximant.', production: 'Quick glide start.' },
      { text: 'what', phonetic: '/wɒt/', description: 'Approximant.', production: 'Soft initial glide.' }
    ]
  },
  {
    symbol: 'tʃ',
    category: 'consonant',
    exampleWords: [
      { text: 'chair', phonetic: '/tʃeər/', description: 'Affricate.', production: 'Start as /t/, release as /ʃ/.' },
      { text: 'watch', phonetic: '/wɒtʃ/', description: 'Affricate.', production: 'Final crisp burst.' },
      { text: 'beach', phonetic: '/biːtʃ/', description: 'Affricate.', production: 'Tongue tap and hiss.' },
      { text: 'cheese', phonetic: '/tʃiːz/', description: 'Affricate.', production: 'Initial sharp burst.' },
      { text: 'lunch', phonetic: '/lʌntʃ/', description: 'Affricate.', production: 'Final explosive sh.' },
      { text: 'much', phonetic: '/mʌtʃ/', description: 'Affricate.', production: 'Crisp ending sound.' },
      { text: 'nature', phonetic: '/ˈneɪtʃər/', description: 'Affricate.', production: 'Middle sharp burst.' },
      { text: 'catch', phonetic: '/kætʃ/', description: 'Affricate.', production: 'Final tap-hiss.' },
      { text: 'choose', phonetic: '/tʃuːz/', description: 'Affricate.', production: 'Steady initial affricate.' },
      { text: 'picture', phonetic: '/ˈpɪktʃər/', description: 'Affricate.', production: 'Internal crisp release.' }
    ]
  },
  {
    symbol: 'dʒ',
    category: 'consonant',
    exampleWords: [
      { text: 'jam', phonetic: '/dʒæm/', description: 'Affricate.', production: 'Start as /d/, release as /ʒ/ (voiced).' },
      { text: 'page', phonetic: '/peɪdʒ/', description: 'Affricate.', production: 'Voiced final burst.' },
      { text: 'bridge', phonetic: '/brɪdʒ/', description: 'Affricate.', production: 'Ending voiced release.' },
      { text: 'juice', phonetic: '/dʒuːs/', description: 'Affricate.', production: 'Initial voiced burst.' },
      { text: 'orange', phonetic: '/ˈɒrɪndʒ/', description: 'Affricate.', production: 'Final voiced tap-sh.' },
      { text: 'age', phonetic: '/eɪdʒ/', description: 'Affricate.', production: 'Soft voiced affricate.' },
      { text: 'judge', phonetic: '/dʒʌdʒ/', description: 'Affricate.', production: 'Double voiced affricate.' },
      { text: 'giant', phonetic: '/ˈdʒaɪənt/', description: 'Affricate.', production: 'Initial strong voicing.' },
      { text: 'village', phonetic: '/ˈvɪlɪdʒ/', description: 'Affricate.', production: 'Ending with voiced hiss.' },
      { text: 'jump', phonetic: '/dʒʌmp/', description: 'Affricate.', production: 'Sharp initial voiced burst.' }
    ]
  }
];
