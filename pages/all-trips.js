import { Fragment, useEffect, useState } from "react";
import TripList from "../components/TripList";

export default function AllLessons() {
  const [lessons, setLessons] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLessons = async () => {
    try {
      const response = await fetch("/api/firebase-config");
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLessons();
  }, []);

  const handleUpdate = (updatedLessons) => {
    setLessons(prev => ({
      ...prev,
      generatedLessons: updatedLessons
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <Fragment>
        <TripList
            lessons={lessons}
            pageTitle="Explore other trips"
            onUpdate={handleUpdate}
            refreshLessons={getLessons}
        />
      </Fragment>
  );
}