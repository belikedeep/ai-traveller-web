import { db } from "./FirebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

interface LocalInformation {
  destination: string;
  countryCode: string;
  localLanguage: string;
  emergencyContacts: Array<{
    name: string;
    number: string;
    icon: "police" | "ambulance" | "embassy" | "touristPolice";
  }>;
  culturalTips: {
    customs: string[];
    etiquette: string[];
    diningTips: string[];
    dressCodes: string[];
  };
  languageHelper: {
    phrases: Array<{
      local: string;
      english: string;
      pronunciation: string;
      category: string;
    }>;
  };
  localGuidelines: {
    transportation: string[];
    safety: string[];
    weather: string[];
    business: string[];
  };
}

export const defaultLocalInfo: LocalInformation = {
  destination: "",
  countryCode: "",
  localLanguage: "",
  emergencyContacts: [
    {
      name: "Police",
      number: "112",
      icon: "police",
    },
    {
      name: "Ambulance",
      number: "112",
      icon: "ambulance",
    },
    {
      name: "Tourist Police",
      number: "112",
      icon: "touristPolice",
    },
  ],
  culturalTips: {
    customs: [],
    etiquette: [],
    diningTips: [],
    dressCodes: [],
  },
  languageHelper: {
    phrases: [],
  },
  localGuidelines: {
    transportation: [],
    safety: [],
    weather: [],
    business: [],
  },
};

export async function updateLocalInfo(
  tripId: string,
  localInfo: Partial<LocalInformation>
) {
  try {
    const tripRef = doc(db, "AITrips", tripId);
    await updateDoc(tripRef, {
      "tripData.localInfo": {
        ...defaultLocalInfo,
        ...localInfo,
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating local info:", error);
    return false;
  }
}

export async function getLocalInfo(tripId: string) {
  try {
    const tripRef = doc(db, "AITrips", tripId);
    const tripDoc = await getDoc(tripRef);

    if (tripDoc.exists()) {
      const data = tripDoc.data();
      return data?.tripData?.localInfo || null;
    }

    return null;
  } catch (error) {
    console.error("Error getting local info:", error);
    return null;
  }
}

// Function to get default local info for a destination
export function getDestinationDefaults(destination: string): Partial<LocalInformation> {
  // This is a placeholder function that would ideally fetch from an API or database
  // For now, returning Germany-specific data as an example
  if (destination.toLowerCase().includes("germany")) {
    return {
      destination: "Germany",
      countryCode: "+49",
      localLanguage: "German",
      emergencyContacts: [
        {
          name: "Police",
          number: "110",
          icon: "police",
        },
        {
          name: "Ambulance",
          number: "112",
          icon: "ambulance",
        },
        {
          name: "Tourist Police",
          number: "110",
          icon: "touristPolice",
        },
      ],
      culturalTips: {
        customs: [
          "Punctuality is highly valued",
          "Direct communication is appreciated",
          "Recycling is taken seriously",
        ],
        etiquette: [
          "Greet with a handshake",
          "Address people formally with 'Sie'",
          "Remove shoes when entering homes",
        ],
        diningTips: [
          "Use utensils for everything",
          "Wait for 'Guten Appetit' before eating",
          "Keep hands visible on the table",
        ],
        dressCodes: [
          "Smart casual is standard",
          "Formal attire for restaurants",
          "Conservative dress for churches",
        ],
      },
      languageHelper: {
        phrases: [
          {
            local: "Guten Tag",
            english: "Good day",
            pronunciation: "goo-ten tahg",
            category: "greetings",
          },
          {
            local: "Danke",
            english: "Thank you",
            pronunciation: "dahn-kuh",
            category: "general",
          },
          {
            local: "Bitte",
            english: "Please/You're welcome",
            pronunciation: "bi-te",
            category: "general",
          },
        ],
      },
      localGuidelines: {
        transportation: [
          "Public transportation is punctual",
          "Buy tickets before boarding",
          "Validate tickets at stations",
        ],
        safety: [
          "Safe country overall",
          "Keep belongings close in crowds",
          "Emergency numbers work nationwide",
        ],
        weather: [
          "Four distinct seasons",
          "Rain is common year-round",
          "Carry an umbrella",
        ],
        business: [
          "Shops closed on Sundays",
          "Lunch break from 12-2 PM",
          "Credit cards not always accepted",
        ],
      },
    };
  }

  if (destination.toLowerCase().includes("egypt")) {
    return {
      destination: "Egypt",
      countryCode: "+20",
      localLanguage: "Arabic",
      emergencyContacts: [
        {
          name: "Police",
          number: "122",
          icon: "police",
        },
        {
          name: "Ambulance",
          number: "123",
          icon: "ambulance",
        },
        {
          name: "Tourist Police",
          number: "126",
          icon: "touristPolice",
        },
      ],
      culturalTips: {
        customs: [
          "Remove shoes before entering mosques",
          "Right hand is used for eating and handshakes",
          "Ramadan observance is important",
          "Ask permission before taking photos of people"
        ],
        etiquette: [
          "Dress modestly, especially at religious sites",
          "Public displays of affection are discouraged",
          "Accept offered drinks (tea/coffee) as a gesture of hospitality",
          "Use titles (Mr./Mrs.) when addressing people"
        ],
        diningTips: [
          "Eat with right hand only",
          "Leave a small portion of food to show satisfaction",
          "Try local specialties like koshari and ful medames",
          "Tipping (baksheesh) is expected"
        ],
        dressCodes: [
          "Conservative clothing in public places",
          "Cover shoulders and knees",
          "Bring a scarf for mosque visits",
          "Swimwear only at beach resorts"
        ],
      },
      languageHelper: {
        phrases: [
          {
            local: "As-salaam-alaikum",
            english: "Peace be with you (Hello)",
            pronunciation: "as-sa-laam-ah-lay-koom",
            category: "greetings"
          },
          {
            local: "Shukran",
            english: "Thank you",
            pronunciation: "shook-ran",
            category: "general"
          },
          {
            local: "Min fadlak/Min fadlik",
            english: "Please",
            pronunciation: "min fad-lak/min fad-lik",
            category: "general"
          },
          {
            local: "La shukran",
            english: "No thank you",
            pronunciation: "laa shook-ran",
            category: "general"
          }
        ],
      },
      localGuidelines: {
        transportation: [
          "Use official taxis or ride-hailing apps",
          "Negotiate fares before riding in regular taxis",
          "Metro is efficient in Cairo",
          "Consider hiring a private driver for day trips"
        ],
        safety: [
          "Keep valuables in hotel safe",
          "Be aware of pickpockets in crowded areas",
          "Use reputable tour guides",
          "Avoid political demonstrations"
        ],
        weather: [
          "Very hot during summer (June-August)",
          "Mild winters (December-February)",
          "Pack sunscreen and hat",
          "Carry water bottles"
        ],
        business: [
          "Friday and Saturday are weekend days",
          "Many shops close during prayer times",
          "Bargaining is expected in markets",
          "Cash is preferred in many places"
        ],
      },
    };
  }

  // Return empty default structure for unknown destinations
  return defaultLocalInfo;
}