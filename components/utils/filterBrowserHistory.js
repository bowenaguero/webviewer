import indexedDb from "@/components/utils/indexedDb";

export const filterByEventTypes = (filtered, filteredEventTypes) => {
  if (filteredEventTypes.value.length > 0) {
    filtered = filtered.filter((item) =>
      filteredEventTypes.value.includes(item.eventType)
    );
  }

  return filtered;
};

export const filterBySearch = (filtered, search) => {
  if (search) {
    try {
      const regex = new RegExp(search, "i");
      filtered = filtered.filter(
        (item) =>
          regex.test(item.url) ||
          regex.test(item.title) ||
          regex.test(item.eventType) ||
          regex.test(item.additionalFields)
      );
    } catch (e) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.url.toLowerCase().includes(searchLower) ||
          (item.title && item.title.toLowerCase().includes(searchLower)) ||
          item.eventType.toLowerCase().includes(searchLower)
      );
    }
  }

  return filtered;
};

export const sortByDate = (filtered, sortBy) => {
  if (!filtered) return [];
  
  if (sortBy === "desc") {
    filtered = filtered.sort(
      (a, b) => new Date(b.visitTime) - new Date(a.visitTime)
    );
  } else {
    filtered = filtered.sort(
      (a, b) => new Date(a.visitTime) - new Date(b.visitTime)
    );
  }

  return filtered;
};

export const filterByDate = (filtered, startDate, endDate) => {
  if (startDate && endDate) {
    filtered = filtered.filter(
      (item) => item.visitTime >= startDate && item.visitTime <= endDate
    );
  }

  return filtered;
};

// export const filterByEventTypes = (collection, eventTypes) => {
//   if (eventTypes.length > 0) {
//     return collection.where("eventType").anyOf(eventTypes);
//   }

//   return collection;
// };

// export const filterBySearch = (collection, search) => {
//   if (search) {
//     return collection.where("url").startsWith(search);
//   }

//   return collection;
// };



