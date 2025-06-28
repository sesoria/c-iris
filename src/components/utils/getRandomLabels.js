// Posibles palabras para usar en el nombre de las etiquetas
const possibleWords = ["Neighborhood", "City", "Road", "Street", "Urban", "Person", "Car", "Building", "Park", "Mall"];

export default function getRandomLabels() {
  // Shuffle the array to ensure randomness and pick the first 4 unique items
  const selectedWords = possibleWords.sort(() => 0.5 - Math.random()).slice(0, 4);

  // Generate Labels array
  return {
    Labels: selectedWords.map(word => ({
      Name: word,
      Confidence: parseFloat((Math.random() * 100).toFixed(2))  // Random confidence with two decimal points
    }))
  };
}
