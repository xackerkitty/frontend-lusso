import React, { useEffect, useState } from "react";

const TestBackgroundVID: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    fetch("https://accessible-charity-d22e30cd98.strapiapp.com/api/luxurycars-cars?populate=*")
      .then((res) => res.json())
      .then((data) => {
        const vidUrl = data?.data?.[0]?.backgroundVID?.url;
        if (vidUrl) setVideoUrl(vidUrl);
      });
  }, []);

  return (
    <div>
      <h2>Background Video URL:</h2>
      {videoUrl ? (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer">{videoUrl}</a>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default TestBackgroundVID;
