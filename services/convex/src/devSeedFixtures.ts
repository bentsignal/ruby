export interface SeedProfile {
  bio: string;
  link: string;
  name: string;
}

export interface SeedLocation {
  formattedAddress: string;
  googlePlaceId: string;
  latitude: number;
  longitude: number;
  name: string;
  provider: "google";
}

export interface SeedMediaAsset {
  contentType?: string;
  fileName?: string;
  key?: string;
  mediaType?: "image" | "video";
  size?: number;
  url: string;
}

export const DEMO_MEDIA_ASSETS = [
  {
    key: "posts/demo/IMG_1295.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_1295.jpeg",
    fileName: "IMG_1295.jpeg",
    size: 4029126,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4904.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4904.jpeg",
    fileName: "IMG_4904.jpeg",
    size: 2359879,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4914.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4914.jpeg",
    fileName: "IMG_4914.jpeg",
    size: 1773901,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4915.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4915.jpeg",
    fileName: "IMG_4915.jpeg",
    size: 2470456,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4950.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4950.jpeg",
    fileName: "IMG_4950.jpeg",
    size: 2191634,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4960.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4960.jpeg",
    fileName: "IMG_4960.jpeg",
    size: 397488,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4973.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4973.jpeg",
    fileName: "IMG_4973.jpeg",
    size: 316800,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4974.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4974.jpeg",
    fileName: "IMG_4974.jpeg",
    size: 330016,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4989.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4989.jpeg",
    fileName: "IMG_4989.jpeg",
    size: 3183777,
    contentType: "image/jpeg",
    mediaType: "image",
  },
  {
    key: "posts/demo/IMG_4990.jpeg",
    url: "https://bsx-ruby.b-cdn.net/posts/demo/IMG_4990.jpeg",
    fileName: "IMG_4990.jpeg",
    size: 1588673,
    contentType: "image/jpeg",
    mediaType: "image",
  },
] satisfies SeedMediaAsset[];

export const PROFILE_FIXTURES = [
  {
    name: "Maya Chen",
    bio: "Finding quiet corners in loud cities.",
    link: "https://ruby.travel/maya",
  },
  {
    name: "Noah Brooks",
    bio: "Weekend hikes, coffee maps, and too many airport photos.",
    link: "https://ruby.travel/noah",
  },
  {
    name: "Avery Stone",
    bio: "Planning the next train ride before this one ends.",
    link: "https://ruby.travel/avery",
  },
  {
    name: "Sofia Rivera",
    bio: "Street food first, itinerary second.",
    link: "https://ruby.travel/sofia",
  },
  {
    name: "Elliot Park",
    bio: "Museums, markets, mountains.",
    link: "https://ruby.travel/elliot",
  },
  {
    name: "Priya Nair",
    bio: "Collecting sunrise views and reliable packing lists.",
    link: "https://ruby.travel/priya",
  },
  {
    name: "Jon Bell",
    bio: "Small towns, long walks, local bakeries.",
    link: "https://ruby.travel/jon",
  },
  {
    name: "Lena Ortiz",
    bio: "Ocean days and last-minute detours.",
    link: "https://ruby.travel/lena",
  },
] satisfies SeedProfile[];

export const CAPTIONS = [
  "Arrived early enough to watch the city wake up. Worth the red-eye.",
  "Found the kind of cafe that makes you change the whole plan for the day.",
  "The best view was halfway up, right before the trail got busy.",
  "Took the side street and ended up with the best meal of the trip.",
  "Train window, rainy glass, perfect playlist.",
  "A quiet morning before the market opened.",
  "This neighborhood deserves a slow walk and no checklist.",
  "Golden hour did most of the work here.",
  "One more stamp in the notebook.",
  "Saved this spot for the next time someone asks where to go first.",
];

export const LOCATIONS = [
  {
    provider: "google",
    googlePlaceId: "ruby-seed-lisbon-alfama",
    name: "Alfama",
    formattedAddress: "Alfama, Lisbon, Portugal",
    latitude: 38.711,
    longitude: -9.13,
  },
  {
    provider: "google",
    googlePlaceId: "ruby-seed-kyoto-gion",
    name: "Gion",
    formattedAddress: "Gion, Kyoto, Japan",
    latitude: 35.0037,
    longitude: 135.7788,
  },
  {
    provider: "google",
    googlePlaceId: "ruby-seed-mexico-city-roma",
    name: "Roma Norte",
    formattedAddress: "Roma Norte, Mexico City, Mexico",
    latitude: 19.4195,
    longitude: -99.1645,
  },
  {
    provider: "google",
    googlePlaceId: "ruby-seed-banff-lake-louise",
    name: "Lake Louise",
    formattedAddress: "Lake Louise, AB, Canada",
    latitude: 51.4254,
    longitude: -116.1773,
  },
] satisfies SeedLocation[];
