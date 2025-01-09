const letters = "0123456789ABCDEF";
export const getRandomColor = () => {
  const color = ["#"];
  let i = 0;
  const finish = 6;
  while (i < finish) {
    color.push(letters[Math.floor(Math.random() * 16)]);
    i++;
  }
  return color.join("");
};

const availableColors = [
  "bg-red-400",
  "bg-cyan-400",
  "bg-orange-400",
  "bg-lime-400",
  "bg-fuchsia-950",
  "bg-green-900",
  "bg-sky-600",
  "bg-indigo-600",
];

// Initialize the pool of colors outside the function
let randomColorClasses: string[] = [...availableColors];

export const getRandomTailwindColorClass = () => {
  // If the pool is empty, refill it with availableColors
  if (randomColorClasses.length === 0) {
    randomColorClasses = [...availableColors];
  }

  // Get a random index from the pool
  const randomIndex = Math.floor(Math.random() * randomColorClasses.length);

  // Select and remove the color from the pool
  const selectedColor = randomColorClasses.splice(randomIndex, 1)[0];

  // Return the selected color class
  return selectedColor;
};
