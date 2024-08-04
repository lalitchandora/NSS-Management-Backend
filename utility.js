const getEventStatus = (dateTime) => {
  const now = new Date();
  const eventDate = new Date(dateTime);
  if (eventDate > now) return "upcoming";
  if (eventDate < now) return "past";
  return "ongoing";
};

module.exports = { getEventStatus };
