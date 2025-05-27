import { getData, addData, db } from "./firebase-config";
import { getDoc, doc } from "firebase/firestore";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

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

  get specificPlace() {
    return this.#specificPlace;
  }
  get destination() {
    return this.#destination;
  }
  get tripType() {
    return this.#tripType;
  }
  get randomness() {
    return this.#randomness;
  }
  get response() {
    return this.#response;
  }

  setResponse(value) {
    this.#response = value;
  }

  validateLength() {
    return (
      String(this.#specificPlace || "").length <= 50 &&
      String(this.#destination || "").length <= 40 &&
      String(this.#tripType || "").length <= 40
    );
  }

  generatePrompt() {
    return `Create a detailed trip itinerary for ${this.#specificPlace} in ${
      this.#destination
    }. Make it a ${
      this.#tripType
    } style trip with specific activities, attractions, and recommendations for this place.`;
  }
}

async function contenFilter(resp) {
  const filterResponse = await openai.moderations.create({ input: resp });
  return filterResponse.results[0].flagged;
}

export default async function openAiCreate(req, res) {
  try {
    // Determine the Firestore document to append this trip to
    if (req.body.uid === "Anonymous") {
      docRef = doc(db, "lessons", "Vxhsl1Y6lZdMndTexmPU");
    } else {
      const allDocuments = await getData();
      const match = allDocuments.find((d) => d.uid === req.body.uid);
      if (match) {
        docRef = doc(db, "lessons", match.docId);
      }
    }

    const generatedTrip = new GeneratedTrip(
      req.body.generatedTrip.specificPlace,
      req.body.generatedTrip.destination,
      req.body.generatedTrip.tripType,
      req.body.generatedTrip.randomness / 5
    );

    if (!generatedTrip.validateLength()) {
      return res
        .status(400)
        .json({ error: "Input fields exceed length constraints." });
    }

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
        response += chunk.choices[0].delta.content;
      }
    }

    generatedTrip.setResponse(response);

    const blocked = await contenFilter(generatedTrip.response);

    if (blocked) {
      return res
        .status(200)
        .json({ result: "Please try again by modifying the input." });
    }

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

    await addData(tripData, userData, docRef);

    res.status(200).json({ result: generatedTrip.response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
