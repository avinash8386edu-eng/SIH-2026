const now = new Date();
let eta = new Date(now.getTime() - 5 * 60000); 
let etaString = eta.toLocaleTimeString();

const parsed = new Date(etaString);
console.log("Parsed Date: ", parsed.toString());
console.log("Is Valid: ", !isNaN(parsed.getTime()));
