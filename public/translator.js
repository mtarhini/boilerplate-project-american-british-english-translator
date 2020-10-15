import { americanOnly } from "./american-only.js";
import { britishOnly } from "./british-only.js";
import { americanToBritishSpelling } from "./american-to-british-spelling.js";
import { americanToBritishTitles } from "./american-to-british-titles.js";
// const { americanOnly } = require("./american-only");
// const { britishOnly } = require("./british-only");
// const { americanToBritishSpelling } = require("./american-to-british-spelling");
// const { americanToBritishTitles } = require("./american-to-british-titles");
/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/

const replaceAll = (
  input,
  inputHTML,
  replace,
  replaceWith,
  toleratePoints = false
) => {
  const regEx = new RegExp(toleratePoints ? replace : `\\b${replace}\\b`, "ig");
  const output = input.replace(regEx, replaceWith);
  const outputHTML = inputHTML.replace(
    regEx,
    `<span class="highlight">${replaceWith}</span>`
  );
  return [output, outputHTML];
};
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const Translator = (input, source) => {
  // common :

  let output = input;
  let outputHTML = input;
  // replace(/is/ig, 'as')
  if (source === "us") {
    // Search for occurences from american-to-britsh-spelling
    Object.keys(americanToBritishSpelling)
      .sort((a, b) => b.length - a.length)
      .forEach((vocab) => {
        [output, outputHTML] = replaceAll(
          output,
          outputHTML,
          vocab,
          americanToBritishSpelling[vocab]
        );
      });
    // Search for occurences from americanToBritishTitles
    Object.keys(americanToBritishTitles)
      .sort((a, b) => b.length - a.length)
      .forEach((vocab) => {
        [output, outputHTML] = replaceAll(
          output,
          outputHTML,
          vocab,
          capitalize(americanToBritishTitles[vocab]),
          true
        );
      });
    // Search for occurences from americanONly
    Object.keys(americanOnly)
      .sort((a, b) => b.length - a.length)
      .forEach((vocab) => {
        [output, outputHTML] = replaceAll(
          output,
          outputHTML,
          vocab,
          americanOnly[vocab]
        );
      });
    output = output.replace(/(\d+?):(\d{2}?)/g, "$1.$2");
    outputHTML = outputHTML.replace(
      /(\d+?):(\d{2}?)/g,
      "<span class='highlight'>$1.$2</span>"
    );
  } else if (source === "uk") {
    // Search for occurences from american-to-britsh-spelling
    Object.keys(americanToBritishSpelling)
      .sort((a, b) => b.length - a.length)
      .forEach((usVocab) => {
        let ukVocab = americanToBritishSpelling[usVocab];
        [output, outputHTML] = replaceAll(output, outputHTML, ukVocab, usVocab);
      });
    // Search for occurences from americanToBritishTitles
    Object.keys(americanToBritishTitles)
      .sort((a, b) => b.length - a.length)
      .forEach((usVocab) => {
        let ukVocab = americanToBritishTitles[usVocab];
        [output, outputHTML] = replaceAll(
          output,
          outputHTML,
          ukVocab + " ",
          capitalize(usVocab) + " "
        );
      });
    // Search for occurences from americanONly
    Object.keys(britishOnly)
      .sort((a, b) => b.length - a.length)
      .forEach((vocab) => {
        [output, outputHTML] = replaceAll(
          output,
          outputHTML,
          vocab,
          britishOnly[vocab]
        );
      });
    output = output.replace(/(\d+?).(\d{2}?)/g, "$1:$2");
    outputHTML = outputHTML.replace(
      /(\d+?).(\d{2}?)/g,
      "<span class='highlight'>$1:$2</span>"
    );
  }

  return [output, outputHTML];
};
document.getElementById("translate-btn").onclick = (e) => {
  // get the textarea content:
  const input = document.getElementById("text-input").value;
  let source = document.getElementById("locale-select").value;
  source = source === "american-to-british" ? "us" : "uk";
  let [output, outputHTML] = Translator(input, source);
  if (input === "") {
    document.getElementById("error-msg").textContent =
      "Error: No text to translate.";
  } else if (input === output) {
    document.getElementById("translated-sentence").textContent =
      "Everything looks good to me!";
    document.getElementById("error-msg").textContent = "";
  } else {
    document.getElementById("translated-sentence").innerHTML = outputHTML;
    console.log(outputHTML);
    document.getElementById("error-msg").textContent = "";
  }
};

document.getElementById("clear-btn").onclick = (e) => {
  document.getElementById("text-input").value = "";
  document.getElementById("error-msg").textContent = "";
  document.getElementById("translated-sentence").textContent = "";
};
// Translator("mr coloumrr", "uk");
try {
  module.exports = Translator;
} catch (e) {}
