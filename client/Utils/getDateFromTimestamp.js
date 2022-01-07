const getDateFromTimeStamp = (timestamp) => {
  let date = timestamp;
  date = date.split("T");
  date = date[0].split("-");
  return `${date[1]}-${date[2]}-${date[0]}`;
};

module.exports = getDateFromTimeStamp;
