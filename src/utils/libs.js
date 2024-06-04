const determineLeague = (coins) => {
  if (coins >= 16000000) {
    return 6;
  } else if (coins >= 8000000) {
    return 5;
  } else if (coins >= 4000000) {
    return 4;
  } else if (coins >= 2000000) {
    return 3;
  } else if (coins >= 1000000) {
    return 2;
  } else {
    return 1;
  }
};

const determineLeagueName = (league) => {
  if (league == 1) {
    return "League 1";
  } else if (league == 2) {
    return "League 2";
  } else if (league == 3) {
    return "League 3";
  } else if (league === 4) {
    return "League 4";
  } else if (league == 5) {
    return "League 5";
  } else {
    return "League 6";
  }
};

const determineEggStage = (noOfTaps) => {
  if (noOfTaps >= 16000000) {
    return 6;
  } else if (noOfTaps >= 8000000) {
    return 5;
  } else if (noOfTaps >= 4000000) {
    return 4;
  } else if (noOfTaps >= 2000000) {
    return 3;
  } else if (noOfTaps >= 1000000) {
    return 2;
  } else {
    return 1;
  }
};

const determineRechargeMultiple = (level) => {
  if (level === 7) {
    return 4;
  } else if (level === 6) {
    return 3.5;
  } else if (level === 5) {
    return 3;
  } else if (level === 4) {
    return 2.5;
  } else if (level === 3) {
    return 2;
  } else if (level === 2) {
    return 1.5;
  } else {
    return 1;
  }
};

function getLeagueName(leagueNumber) {
  const leagueNames = {
    1: { name: "Fossil", image: "fossil.png" },
    2: { name: "Claw", image: "claw.png" },
    3: { name: "Bone", image: "bone.png" },
    4: { name: "Scale", image: "scale.png" },
    5: { name: "Dino", image: "dino.png" },
    6: { name: "Jurassic", image: "jurassic.png" },
  };

  return leagueNames[leagueNumber] || "Unknown League";
}

function getLeagueCoinsLimit(leagueNumber) {
  const leagueNames = {
    1: { limit: 1000000 },
    2: { limit: 2000000 },
    3: { limit: 4000000 },
    4: { limit: 8000000 },
    5: { limit: 16000000 },
    6: { limit: 0 },
  };

  return leagueNames[leagueNumber] || 0;
}

function formatRank(number) {
  if (number % 100 >= 11 && number % 100 <= 13) {
    return number + "th";
  }
  switch (number % 10) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
    default:
      return number + "th";
  }
}

const determineEggLevel = (noOfTaps) => {
  if (noOfTaps >= 16000000) {
    return 6;
  } else if (noOfTaps >= 8000000) {
    return 5;
  } else if (noOfTaps >= 4000000) {
    return 4;
  } else if (noOfTaps >= 2000000) {
    return 3;
  } else if (noOfTaps >= 1000000) {
    return 2;
  } else {
    return 1;
  }
};

export {
  determineLeague,
  determineEggStage,
  determineRechargeMultiple,
  determineLeagueName,
  getLeagueName,
  getLeagueCoinsLimit,
  formatRank,
  determineEggLevel,
};
