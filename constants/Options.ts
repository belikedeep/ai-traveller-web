export const SelectedTravelsList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo traveler in exploration mode",
    icon: "🛩️",
    people: "1 Person",
  },
  {
    id: 2,
    title: "Me & My Partner",
    desc: "A couple looking for a romantic getaway",
    icon: "👫",
    people: "2 people",
  },
  {
    id: 3,
    title: "Family",
    desc: "A family with kids looking for fun",
    icon: "👨‍👩‍👧‍👦",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Group",
    desc: "A group of friends looking for adventure",
    icon: "👯‍♀️",
    people: "4 to 10 People",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Budget friendly options",
    icon: "🤑",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Mid-range options",
    icon: "💸",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "High-end options",
    icon: "💰",
  },
];

export const AI_PROMPT =
  "Generate Travel Plan for Location: {location}, starting from {startDate} for {totalDays} Days for {traveler} with a {budget} budget. Generate a day-by-day itinerary in JSON format that includes: 1. Hotels options list with hotelName, hotelAddress, price, rating, description. 2. Detailed itinerary for each day with theme, summary (a brief 2-3 line overview of the day's activities), best_time_to_visit, and multiple places to visit including placeName, placeDetails (keep it concise, 1-2 lines focusing on key highlights), rating, approximate_time needed at each location. Format the day numbers as 'Day 1', 'Day 2' etc. in the JSON structure.";
