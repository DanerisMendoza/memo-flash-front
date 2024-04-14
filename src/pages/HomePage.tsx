import React, { useState, useEffect } from "react";
import LoginDialog from '../components/LoginDialog';
import RegisterDialog from '../components/RegisterDialog';

export default function HomePage() {

  interface FormData {
    name: string;
    username: string;
    password: string;
  }

  const topics = [
    "Education",
    "Learning Tools",
    "Cognitive Enhancement",
    "Personal Development",
    "Educational Apps",
    "Study Resources",
    "Online Study Aids",
    "Digital Learning",
    "Memory Improvement",
    "Academic Support",
  ];

  return (
    <div>
      <React.Fragment>
        <div className="flex flex-col  h-full w-full  p-8 mt-8">
          <div className="flex flex-col  md:flex-row-reverse h-full w-full">
            <img
              className="w-3/4 md:w-1/4  m-auto"
              src="images/bg.jpg"
              alt="app"
            />
            <div className="flex flex-col gap-2 md:bg-white md:drop-shadow-xl p-2">
              <p className="self-start md:self-center  text-4xl pt-8">
                {" "}
                Memo Flash
              </p>
              <p className="self-start   text-xl">
                Introducing FlashMind: Your personalized digital memory palace!
                Revolutionize your learning with our web-based flashcard
                application. Seamlessly create, organize, and review flashcards
                anytime, anywhere. Boost your retention, master subjects faster,
                and ace exams effortlessly. Start your journey to knowledge
                mastery today with FlashMind!
              </p>
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            {/* Use Array.map to generate multiple instances of the inner div */}
            {topics.map((topic, index) => (
              <div
                key={index} // Ensure each instance has a unique key
                style={{ width: "10rem", height: "5rem" }}
                className="enlarge grow flex items-center justify-center bg-white text-center shadow-xl rounded-lg p-2"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
        <LoginDialog />
        <RegisterDialog />
      </React.Fragment>
    </div>
  );
}
