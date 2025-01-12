/**
 * A naive sentiment analysis function that counts occurrences
 * of positive and negative words, then maps the score to a 1–5 rating.
 *
 * @param text - The text to analyze.
 * @returns A number from 1 to 5, where 1 is very negative and 5 is very positive.
 */
export function analyzeSentiment(text: string): number {
  // 1) Define small sets of positive and negative words
  const positiveWords = ["good", "awesome", "excellent", "nice", "amazing", "great", "love"];
  const negativeWords = ["bad", "terrible", "awful", "horrible", "sucks", "poor", "hate"];

  // 2) Convert text to lowercase for simple matching
  const lowerText = text.toLowerCase();

  // 3) Count occurrences of positive and negative words
  let score = 0;

  positiveWords.forEach(word => {
    // Number of times 'word' appears in 'lowerText'
    const count = lowerText.split(word).length - 1;
    score += count; // increment score for positive matches
  });

  negativeWords.forEach(word => {
    const count = lowerText.split(word).length - 1;
    score -= count; // decrement score for negative matches
  });

  // 4) Map 'score' to a rating of 1–5
  //    This mapping is arbitrary. Adjust thresholds as you see fit.
  let rating = 3; // Neutral baseline
  if (score <= -2) {
    rating = 1; // Very negative
  } else if (score === -1) {
    rating = 2; // Somewhat negative
  } else if (score === 0) {
    rating = 3; // Neutral
  } else if (score <= 2) {
    rating = 4; // Somewhat positive
  } else {
    rating = 5; // Very positive
  }

  return rating;
}

// Example usage:
const sampleText1 = "This new feature is awesome, I love it!";
const sampleText2 = "This service is terrible, it sucks!";
const rating1 = analyzeSentiment(sampleText1);
const rating2 = analyzeSentiment(sampleText2);

console.log(sampleText1, "-->", rating1); // Might print --> 5
console.log(sampleText2, "-->", rating2); // Might print --> 1
