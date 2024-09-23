document.addEventListener("DOMContentLoaded", function () {
  const userInput = document.getElementById("user-input");
  const searchBtn = document.getElementById("search-btn");

  const easyProgress = document.querySelector(".easy-progress");
  const mediumProgress = document.querySelector(".medium-progress");
  const hardProgress = document.querySelector(".hard-progress");

  //---------------------------------------------------

  const statsContainer = document.querySelector(".stats-container");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const statsCard = document.querySelector(".stats-cards");

  //-----------------------------------------------------------
  function validUserName(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetail(username) {
    try {
      searchBtn.textContent = "Searching...";
      searchBtn.disabled = true;

      //  const response = await fetch(url);
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://leetcode.com/graphql/";

      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query:
          "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
        variables: { "username": `${username}` },
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
      };
      const response = await fetch(proxyUrl+targetUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Unable to fecth the userdetail");
      }
      let parsedData = await response.json();
      console.log("Data =>", parsedData);
      displayUserData(parsedData);
    } catch (error) {
       statsContainer.innerHTML = `<p>${error.message}</p>`
    }
    finally {
        searchBtn.textContent = "Search";
        searchBtn.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    const totalQuestion = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQuestion = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQuestion = parsedData.data.allQuestionsCount[2].count;
    const totalHardQuestion = parsedData.data.allQuestionsCount[3].count;

    const solvedTotalQuestion =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQuestion =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQuestion =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotaHardlQuestion =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(
      solvedTotalEasyQuestion,
      totalEasyQuestion,
      easyLabel,
      easyProgress
    );
    updateProgress(
      solvedTotalMediumQuestion,
      totalMediumQuestion,
      mediumLabel,
      mediumProgress
    );
    updateProgress(
      solvedTotaHardlQuestion,
      totalHardQuestion,
      hardLabel,
      hardProgress
    );

    const cardsData = [
      {
        label: "Overall Submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[0]
            .submissions,
      },
      {
        label: "Overall Easy Submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[1]
            .submissions,
      },
      {
        label: "Overall Medium Submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[2]
            .submissions,
      },
      {
        label: "Overall Hard Submissions",
        value:
          parsedData.data.matchedUser.submitStats.totalSubmissionNum[3]
            .submissions,
      },
    ];

    console.log("card ka data: ", cardsData);

    statsCard.innerHTML = cardsData.map(
      (data) =>
        `<div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>`
    ).join("");
  }

  searchBtn.addEventListener("click", function () {
    const username = userInput.value;
    console.log("logggin username: ", username);
    if (validUserName(username)) {
      fetchUserDetail(username);
    }
  });
});
