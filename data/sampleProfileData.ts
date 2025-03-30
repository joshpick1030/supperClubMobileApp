export const sampleUser = {
  name: 'Jennifer Smith',
  avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
  totalVisits: 25,
  reviewsWritten: 10,
  badgesEarned: 5,
  joinDate: 'July 2023',
  location: 'City, State',
};

export const sampleBadges = [
  {
    id: '1',
    name: 'Supper Club Newbie',
    image: 'https://img.icons8.com/color/96/000000/prize.png',
    current: 1,
    required: 1,
    earned: true,
  },
  {
    id: '2',
    name: 'Experienced Foodie',
    image: 'https://img.icons8.com/color/96/000000/medal2.png',
    current: 1,
    required: 5,
    earned: false,
  },
  {
    id: '3',
    name: 'Midwest Master',
    image: 'https://img.icons8.com/color/96/000000/trophy.png',
    current: 1,
    required: 10,
    earned: false,
  },
];

export const sampleLists = [
  {
    id: '1',
    name: 'Summer Road Trip',
    clubs: ['Club 1', 'Club 2', 'Club 3'],
  },
  {
    id: '2',
    name: 'Must Visit',
    clubs: ['Club 4', 'Club 5'],
  },
];

export const sampleReviews = [
  {
    id: '1',
    club: 'The Supper Club',
    text: 'Authentic supper club experience with amazing prime rib!',
    date: '2023-09-15',
  },
];