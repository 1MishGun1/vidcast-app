import { IHistoryItem } from "../models/history";

export const groupHistoryByDate = (history: IHistoryItem[]) => {
  const groups: { [date: string]: IHistoryItem[] } = {};

  history.forEach((item) => {
    const date = new Date(item.viewedAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let label: string;

    if (date.toDateString() === today.toDateString()) {
      label = "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "Вчера";
    } else {
      label = date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(item);
  });

  return groups;
};
