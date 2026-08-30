// All site copy lives here (design-blueprint.md Sec. 11.5.3) — components
// import from this object, never hardcode strings. Populated incrementally,
// one chapter at a time, as each chapter's milestone is built.
//
// Placeholders in [brackets] mark real content to be swapped in — the
// components consuming these values don't change either way.

import galleryHero from '../assets/images/hero.jpg'
import gallerySoftFocus from '../assets/images/gallery-02.jpeg'
import gallerySoftFocusDetail from '../assets/images/FHVO3625.JPG'
import galleryBlueHour from '../assets/images/WhatsApp Image 2026-08-24 at 01.14.44.jpeg'
import galleryMotion from '../assets/images/WhatsApp Image 2026-08-24 at 01.30.43.jpeg'
import galleryMotionDetail from '../assets/images/gallery2a.jpg'
import galleryMotionOutdoor from '../assets/images/IMG_2240.JPG'
import galleryStill from '../assets/images/WhatsApp Image 2026-08-24 at 00.44.16.jpeg'
import galleryDetailOne from '../assets/images/WhatsApp Image 2026-08-24 at 00.44.15.jpeg'
import galleryDetailTwo from '../assets/images/gallery-03.jpeg'
import galleryDetailThree from '../assets/images/IMG_1820.jpg'
import galleryDetailFour from '../assets/images/gallery02b.JPG'
import galleryDetailFive from '../assets/images/7b862189-5696-48a8-88a8-629da7460d45.JPG'
import galleryDetailSix from '../assets/images/gallery03.JPG'
import galleryFinal from '../assets/images/IMG_1929.JPG'
import storyOne from '../assets/images/story1.jpg'
import storyThree from '../assets/images/christmas.jpg'
import storyFour from '../assets/images/story4.jpg'
import ambientBed from '../assets/audio/arerey manasa  epic  piano cover (mp3cut.net).mp3'

export const content = {
  hero: {
    // Tiny editorial label, precedes the headline (Sec. 3.3 example format)
    // editorialLabel: 'CHAPTER ONE — THE BEGINNING',

    // Oversized cover title, hand-set line breaks per Sec. 3.3 — each
    // array entry renders as its own line, never auto-wrapped.
    titleLines: ['HAPPY', 'BIRTHDAY,', 'Bavinsha'],

    // Italic serif subtitle deck
    subtitle: 'A story written in moments, for the one who makes them worth keeping.',

    // Tiny editorial meta line, sits near the title block
    // issueLine: '08 - 29 — HER BIRTHDAY',

    portrait: {
      // No real photo yet — PortraitFrame renders a graceful placeholder
      // until this is set. Drop a file in src/assets/images/ and point
      // this at it (e.g. '/src/assets/images/hero-portrait.jpg').
      src: galleryHero,
      alt: '[Her Name], portrait',
      // Optional (Milestone 16): an array of { type, srcSet } objects —
      // e.g. [{ type: 'image/avif', srcSet: '/src/assets/images/hero-portrait.avif' },
      // { type: 'image/webp', srcSet: '/src/assets/images/hero-portrait.webp' }] —
      // renders as a <picture> with `src` as the final fallback. Omitted
      // here since no real photo/format variants exist yet; PortraitFrame
      // already handles both this field's presence and its absence.
    },

    scrollCueLabel: 'SCROLL',
  },

  cinematicTransition: {
    // One short emotional line, per Sec. 8 (TransitionalTypeLine) — appears
    // and clears mid-sequence during the pinned scroll.
    line: 'Every story has a beginning.',
  },

  story: {
    // InstagramConversation — a recreated DM exchange, the opening beat
    // of this chapter, before the photo-based memories below. Kept in
    // content.js like everything else: no message text hardcoded in any
    // component.
    instagramConversation: {
      username: 'sokuladiswapnasundari',
      messages: [
        { align: 'left', text: 'Hi Luke! This is bavinsha' },
        { align: 'right', text: 'Hii bavinsha' },
      ],
    },

    // Repeatable StorySpread[] units (Sec. 8). Add or remove entries here
    // freely — StorySpread.jsx alternates image side and grid ratio
    // automatically from array index, no component changes needed.
    //
    // Every `image` object below (and minimalCaptionBlock's, further
    // down) accepts the same optional `sources` array StoryImage.jsx
    // supports (Milestone 16) — see the note on content.hero.portrait
    // above for its shape. Omitted throughout since no real photos or
    // format variants exist yet.
    stories: [
      {
        id: 'story-01',
        editorialLabel: 'MEMORY ONE ',
        title: 'The First Hello',
        paragraph:
          'Every beautiful story begins with a moment that seems ordinary.Ours began with a simple hello at a café through a mutual friend.Neither of us knew that one conversation would become the beginning of something so special.',
        caption: 'Where it all began · 2024',
        image: { src: storyOne, alt: '[Photo — memory one]' },
      },
      {
        id: 'story-02',
        editorialLabel: 'MEMORY TWO',
        title: 'The First Message',
        paragraph: 'Sometimes, it starts with two simple words.',
        caption: 'The message that started everything.',
        image: { src: null, alt: '[Photo — memory two]' },
      },
      {
        id: 'story-03',
        editorialLabel: 'MEMORY THREE',
        title: 'Christmas Eve',
        paragraphs: [
          'The night before Christmas, I saw you again.',
          'Your eyes were wide when you saw me, and I could feel the excitement in that moment.',
          'Somehow, I was just as excited to see you.',
        ],
        caption: 'THE NIGHT BEFORE CHRISTMAS · 2025',
        image: { src: storyThree, alt: '[Photo — memory three]' },
      },
      {
        id: 'story-04',
        editorialLabel: 'MEMORY FOUR',
        title: 'Our First Date',
        paragraphs: [
          '11 February.',
          'Our first date.',
          "It wasn’t just a first date. It was the first time being with you felt like exactly where I was meant to be.",
        ],
        caption: '11 FEBRUARY · OUR FIRST DATE',
        image: { src: storyFour, alt: '[Photo — memory four]' },
      },
    ],

    // FullWidthQuote (Sec. 8) — oversized italic pull-quote
    quote: {
      text: '[A short, emotional line — the kind you\u2019d pull out and set in oversized type because it says the whole thing in one breath.]',
    },

    // MinimalCaptionBlock (Sec. 8) — a large image with a small caption
    minimalCaptionBlock: {
      image: { src: null, alt: '[Photo — closing image for this chapter]' },
      caption: '[Minimal caption — a place, a date, or a single word.]',
    },
  },

  editorialGallery: {
    spreads: [
      { id: 'gallery-01', variant: 'portraitCaption', label: 'AFTER DARK.', images: [{ id: 'a', src: galleryHero, alt: 'Portrait of Bavinsha after dark', tone: 'ink' }] },
      { id: 'gallery-02', variant: 'editorialCollage', label: 'SOFT FOCUS.', images: [{ id: 'a', src: gallerySoftFocus, alt: 'Portrait of Bavinsha in soft focus', tone: 'sand' }, { id: 'b', src: gallerySoftFocusDetail, alt: 'Detail from the editorial portrait', tone: 'rose' }] },
      { id: 'gallery-03', variant: 'fullWidthStill', label: 'BLUE HOUR.', images: [{ id: 'a', src: galleryBlueHour, alt: 'Bavinsha in a wide blue hour photograph', tone: 'stone' }] },
      { id: 'gallery-04', variant: 'triptych', label: 'IN MOTION.', images: [{ id: 'a', src: galleryMotion, alt: 'Bavinsha in motion', tone: 'cream' }, { id: 'b', src: galleryMotionDetail, alt: 'A quiet editorial detail', tone: 'sand' }, { id: 'c', src: galleryMotionOutdoor, alt: 'Bavinsha outdoors', tone: 'stone' }] },
      { id: 'gallery-05', variant: 'quietWhitespace', label: 'STILL.', images: [{ id: 'a', src: galleryStill, alt: 'Quiet portrait of Bavinsha', tone: 'sand' }] },
      { id: 'gallery-06', variant: 'contactSheet', label: 'THE DETAILS.', images: [{ id: 'a', src: galleryDetailOne, alt: 'Editorial frame one', tone: 'ink' }, { id: 'b', src: galleryDetailTwo, alt: 'Editorial frame two', tone: 'cream' }, { id: 'c', src: galleryDetailThree, alt: 'Editorial frame three', tone: 'sand' }, { id: 'd', src: galleryDetailFour, alt: 'Editorial frame four', tone: 'rose' }, { id: 'e', src: galleryDetailFive, alt: 'Editorial frame five', tone: 'stone' }, { id: 'f', src: galleryDetailSix, alt: 'Editorial frame six', tone: 'cream' }] },
      { id: 'gallery-07', variant: 'finalFrame', label: 'THE FINAL FRAME.', images: [{ id: 'a', src: galleryFinal, alt: 'Final portrait of Bavinsha', tone: 'stone' }] },
    ],
  },

  letter: {
    // Chapter 5 — Letter (Sec. 8: PaperSurface → InkParagraph[] →
    // SignatureLine). Add or remove paragraphs freely; Letter/index.jsx
    // maps this array directly, no component changes needed.
    salutation: 'Dear Bavinsha,',
    paragraphs: [
      "I don't think I've ever known how to put into words what you mean to me.",
      'You are one of the most genuine and beautiful people I\'ve ever known. And when I say beautiful, I don\'t mean just the way you look. I mean the way your heart is, the way you care, the way you understand people, and the way you love.',
      'And your eyes...',
      "I honestly don't think I've ever seen eyes as beautiful as yours. I could look into them for hours and still feel like I'm seeing something new every time.",
      'But what makes you truly special to me is the way you understand me.',
      "Sometimes you understand what I'm feeling without me having to say anything. You see parts of me that I don't always know how to explain, and somehow you still choose to stay, understand me, and love me.",
      "Before you, I don't think I really knew what it felt like to be loved like this.",
      'You showed me a kind of love I had never felt before.',
      'A love that feels genuine.\nA love that feels safe.\nA love that makes me feel understood.',
      "And I don't ever want to take that for granted.",
      'You are more important to me than I can explain. There are so many people in this world, but when I think about who I want beside me, I only see you.',
      "I don't want someone else.",
      'I want you.',
      'I want your smile.\nYour eyes.\nYour laugh.\nYour little ways.\nYour love.\nYour presence.',
      'I want the ordinary days with you just as much as the beautiful ones.',
      "I want to be there when you're happy, when you're upset, when you're tired, when you're excited, and when you simply need someone beside you.",
      'I want to be the person who loves you the way you deserve to be loved.',
      'And if I could choose one person to keep choosing for the rest of my life,\n\nI\'d choose you.\n\nEvery time.',
      "Because you aren't just someone I love.",
      'You are the person I want.',
      "And I hope that, even on the days when I don't say it perfectly, you always know how deeply I love you.",
      'Thank you for loving me more than I ever knew I could be loved.',
      'Thank you for understanding me.',
      'Thank you for being you.',
      'Happy Birthday, my Bavinsha.',
      "I don't know what the future has planned for us.",
      'But I know who I want beside me while I find out.',
      'You.',
      'With all my love,',
    ],
    signature: 'Luke',
  },

  ending: {
    // CreditsScroll content (Sec. 11.6's locked template) — add, remove,
    // or reorder entries freely; CreditsScroll.jsx maps this array
    // directly, no component changes needed.
    credits: [
      { role: 'Creative Direction', value: 'The Boyfriend' },
      { role: 'Leading Role', value: '[Her Name]' },
      { role: 'Photography', value: 'Our Memories' },
      { role: 'Story', value: 'Our Journey' },
      { role: 'Music', value: 'Our Moments' },
      { role: 'Written & Directed By', value: '[Your Name]' },
    ],

    // FinalReveal (Sec. 8) — exact text per that section's own spec.
    finalRevealLine: 'Happy Birthday',
  },

  audio: {
    // Sec. 6: "one continuous ambient bed with textural shifts per
    // chapter (not discrete tracks)." No real file exists yet — the
    // same honest-placeholder pattern as Hero's portrait and Story's
    // photos. Drop a file in src/assets/audio/ and set this src to wire
    // it in; AudioController.jsx handles a null src gracefully either way.
    ambientBed: { src: ambientBed, label: 'Ambient soundbed (piano + room tone)' },

    // Chapter-specific accent layers (Sec. 6), keyed by the chapter
    // number used in each section's existing `data-chapter` attribute.
    // Cross-fade in/out over 1.5s as that chapter becomes active.
    accents: {
      5: { src: null, label: 'Vinyl crackle (Letter)' },
      6: { src: null, label: 'Ambient swell (Ending)' },
    },
  },

  nav: {
    // MinimalNav's chapter jump-list (Sec. 8). Numbers match each
    // section's existing `data-chapter` attribute exactly.
    chapters: [
      { number: '1', label: 'Hero' },
      // { number: '2', label: 'Transition' },
      { number: '2', label: 'Story' },
      { number: '3', label: 'Memory World' },
      { number: '4', label: 'Letter' },
      { number: '5', label: 'Ending' },
    ],
  },
}

export default content
