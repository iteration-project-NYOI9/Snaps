import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Snap from "../components/Snap.jsx";
import { setSnapsList } from "../redux/snapsSlice.js";

const SnapsContainer = () => {
  // MH - useSelector is how we connect react to redux. It allows us to access whatever piece of state we desire. In this case, our snapsList
  const snapsList = useSelector((state) => state.snaps.snapsList);
  // MH - useDispatch is how we connect react to redux specifically to invoke/dispatch redux actions
  const dispatch = useDispatch();

  console.log(" SNAPS LIST FROM STATE ", snapsList);

  //create a variable to hold all snap components
  const snapsComponentList = [
    <tr>
      <th>Title</th>
      <th id="snap-text">Snap</th>
    </tr>,
  ];

  for (let i = 0; i < snapsList.length; i++) {
    snapsComponentList.push(
      <Snap
        key={snapsList[i].snap_id}
        snap_text={snapsList[i].snap}
        title={snapsList[i].title}
        url={snapsList[i].url}
      />
    );
  }

  const handleAdd = (e) => {
    // Query OpenAI API
    // Store ChatGPT summary in database for user
    let translated = (async () => {
      const rawResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ` + process.env.REACT_APP_OPENAI_KEY,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content:
                  "Summarize this article into less than 300 words, respond in concise bullet points: Jacinda Ardern caused shockwaves around the globe with the January 2023 announcement of her resignation as New Zealand's prime minister. She cited not having 'enough in the tank'—as the motivation behind her decision. In 2017, she was the youngest woman ever to be elected prime minister at 37 years old. A year later, she became the second elected leader in modern history to give birth to a child during her term in office. Less than a month after Ardern announced her resignation, Nicola Sturgeon announced her own decision to step down as Scotland’s first minister. She cited concerns similar to those Ardern had expressed. “I am human. Politicians are human. We give all that we can for as long as we can. And then it’s time. And for me, it’s time.'\
                      Following their resignations, many outlets raised questions about the larger implications of stepping down from these leadership positions. NPR pointed out that gender equality meant longer lives for everyone but that the decreasing numbers of women in top political positions suggest that equality is nowhere close to becoming a reality. The CEO Magazine focused on the pressures leaders face in general. From any perspective, the pressure we’re increasingly experiencing at work puts us all at risk of burnout, which is especially prominent when it comes to working parents. One 2022 survey from Ohio State University found 66% of working parents reported burnout. Burnout has also often been linked to depression and anxiety.\
                      To fight against career burnout without having to tender a resignation, I suggest employees in all fields and at all levels adopt a multi-pronged strategy. 1. Focus on your physical and mental health. Burnout is a serious condition that can degrade physical and mental health. The flip side is also true: Defending against burnout requires a solid foundation of wellness in every sense of the word.\
                      Getting adequate sleep is an important first step, as sleep deprivation can lead to higher degrees of stress, decreased energy and impaired attention. Good nutrition from healthy foods, if possible, is also important. Exercise, meditation, journaling and other wellness practices can all be a part of your approach.\
                      The best tactics are the ones you can stick with consistently, so choose whatever aligns best with your preferences and circumstances.\
                      2. Find ways to recharge your batteries outside of work.\
                      One of the fastest routes to burnout runs straight through the 60-plus hour workweek. This starts with your choice of employment and workplace environment. Wherever possible, seek out positions with employers who respect work-life balance. Avoid accidentally falling into a lifestyle that fails to leave you space and time for pursuits you enjoy outside of work.\
                      Making time for hobbies, social outings, etc., helps create a mental buffer around the work-related activities that can create pressure and scheduling demands that lead to burnout. Similarly, leave enough downtime for adequate rest in addition to your more active endeavors.\
                      3. Reach out to a trusted friend or colleague.\
                      Talking about the stress you’re experiencing can be an effective way to relieve the building pressure before it explodes; however, admitting that you’re feeling extreme stress can feel like a risky proposition. Think of two or three trusted friends and colleagues who are good listeners with whom you feel comfortable having a frank discussion about your situation.\
                      4. Figure out a way to reduce the burden.\
                      Sometimes, the only way to relieve rising work stress is to take items off your to-do list. Can you delegate any additional tasks to another team member? Of course, this may not be feasible at certain times. When your team is heavily involved with a big project, or you’re staring down an imminent deadline, you may have to find other solutions. But if it’s possible to lighten your workload, it’s an immediate way to free up bandwidth and fight burnout.\
                      5. Seek professional help when appropriate.\
                      Professional help can be extremely effective in many cases. Speaking with a counselor, psychologist or other mental health professional can help you alleviate the problem and learn strategies for reducing burnout before it becomes critical. Therapy may not always be the solution, but it’s an option worth considering.\
                      Work-life balance may be a bit of a mythical unicorn these days, especially because burnout is sometimes the result of external, systemic factors that we can’t self-care our way out of. While we may not have complete control over all of the risk factors for burnout, aim to mitigate them wherever possible. Check in with yourself frequently and prioritize your mental and physical well-being. It’s much easier to take steps to prevent burnout than to recover from it after the fact.\
                      ",
              },
            ],
            temperature: 0.7,
          }),
        }
      );


      const content = await rawResponse.json();
      const summary = content.choices[0].message.content.toString();
      const userUrlInput = document.getElementById("urlInput").value;
      const userTitleInput = document.getElementById("titleInput").value;


      console.log("snapsList before post call ", snapsList);
      fetch("/my-snaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1, //hardcoded this to one because in circumstances where the user doesnt yet have any snaps, they cant upload new ones. will have to find a way to fix
          title: userTitleInput,
          url: userUrlInput,
          snap_text: summary,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          document.getElementById("urlInput").value = "";
          document.getElementById("titleInput").value = "";
          console.log("dispatching setSnapsList ", res);

          // MH - 'res' is the .rows param of the SELECT query on the Snaps table and is dispatched AS THE PAYLOAD here to the setSnapsList reducer
          dispatch(setSnapsList(res));
        })
        .catch(() => {
          console.log("Error in addSnap");
        });
    })();
  };

  return (
    <div id="snaps-container">
      <img id="snaps-page-logo" src="./images/snaps-page-logo.png" />
      {/* <h1>My Snaps</h1> */}
      <table className="snaps-table container">{snapsComponentList}</table>
      <input
        type="title"
        className="snaps-input"
        id="titleInput"
        placeholder="Enter a title..."
      />
      <input
        type="url"
        className="snaps-input"
        id="urlInput"
        placeholder="Enter a URL..."
      />
      <button id="add-button" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
};

export default SnapsContainer;
