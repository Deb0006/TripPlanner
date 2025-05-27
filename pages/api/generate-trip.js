import { getData, addData, db } from "./firebase-config";
import { getDoc, doc } from "firebase/firestore";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "sk-proj-T9z2RBOysuJdoECdQW9IjBJeOIkdXu3XyZGMEWH_XWALxqxPiUIzxGtAMST3BlbkFJIgLKjXCT4PmKRZOEBVWCb2A";
const openai = new OpenAI({ apiKey: apiKey });

let allowRequest = true;
let docRef;

class GeneratedTrip {
  #specificPlace;
  #destination;
  #tripType;
  #randomness;
  #response;

  constructor(specificPlace, destination, tripType, randomness) {
    this.#specificPlace = specificPlace;
    this.#destination = destination;
    this.#tripType = tripType;
    this.#randomness = randomness;
    this.#response = "";
  }

  get specificPlace() { return this.#specificPlace; }
  get destination() { return this.#destination; }
  get tripType() { return this.#tripType; }
  get randomness() { return this.#randomness; }
  get response() { return this.#response; }

  setResponse(value) {
    this.#response = value;
  }

  validateLength() {
    return String(this.#specificPlace || '').length <= 50 &&
           String(this.#destination || '').length <= 40 &&
           String(this.#tripType || '').length <= 40;
  }

  generatePrompt() {
    return `Create a detailed trip itinerary for ${this.#specificPlace} in ${this.#destination}. Make it a ${this.#tripType} style trip with specific activities, attractions, and recommendations for this place.`;
  }
}

export async function checkRequestMax(requestUid) {
  const today = new Date().toLocaleDateString();
  let anonRequests = 0;
  let userRequests = 0;

  if (requestUid === "Anonymous") {
    docRef = doc(db, "lessons", "Vxhsl1Y6lZdMndTexmPU");
    let docSnap = await getDoc(docRef);
    let document = docSnap.data();
    for (let i = 0; i < document.generatedLessons.length; i++) {
      const time = document.generatedLessons[i].timestamp;
      const date = new Date(time.seconds * 1000).toLocaleDateString("en-US");
      if (date == today) {
        anonRequests++;
      }
    }
    if (anonRequests > 29) {
      allowRequest = false;
    }
  } else {
    const allDocuments = await getData();
    for (let i = 0; i < allDocuments.length; i++) {
      if (allDocuments[i].uid === requestUid) {
        docRef = doc(db, "lessons", allDocuments[i].docId);
        for (let e = 0; e < allDocuments[i].generatedLessons.length; e++) {
          const time = allDocuments[i].generatedLessons[e].timestamp;
          const date = new Date(time.seconds * 1000).toLocaleDateString("en-US");
          if (date == today) {
            userRequests++;
          }
        }
      }
    }
    if (userRequests > 9) {
      allowRequest = false;
    }
  }
}

async function contenFilter(resp) {
  const filterResponse = await openai.moderations.create({ input: resp });
  return filterResponse.results[0].flagged;
}

export default async function openAiCreate(req, res) {
  try {
    await checkRequestMax(req.body.uid);

    const generatedTrip = new GeneratedTrip(
      req.body.generatedTrip.specificPlace,
      req.body.generatedTrip.destination,
      req.body.generatedTrip.tripType,
      req.body.generatedTrip.randomness / 5
    );

    allowRequest = generatedTrip.validateLength();

    if (allowRequest === true) {
      const completion = await openai.chat.completions.create({
        model: req.body.generatedTrip.model,
        messages: [{ role: "user", content: generatedTrip.generatePrompt() }],
        stream: true,
        temperature: generatedTrip.randomness,
        top_p: 1,
        max_tokens: 800,
      });

      let response = "";
      for await (const chunk of completion) {
        if (chunk.choices[0].delta.content) {
          response = response + chunk.choices[0].delta.content;
        }
      }

      generatedTrip.setResponse(response);
      const filterL = await contenFilter(generatedTrip.response);

      if (filterL == false) {
        const userData = {
          uid: req.body.uid,
          displayName: req.body.displayName,
          email: req.body.email,
          photoURL: req.body.photoURL,
        };
        
        const tripData = {
          lessonTitle: generatedTrip.tripType,
          subject: generatedTrip.destination,
          grade: generatedTrip.specificPlace,
          generatedLesson: generatedTrip.response,
        };
        
        addData(tripData, userData, docRef);
        res.status(200).json({ result: generatedTrip.response });
      } else {
        res.status(200).json({ result: "Please try again by modifying the input." });
      }
    } else {
      res.status(200).json({
        result: "Sorry, the maximum number of requests for today has been reached. Please sign in or try again tomorrow.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}