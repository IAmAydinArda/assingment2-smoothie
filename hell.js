// This is the event listener for the form.

document.getElementById("smoothieForm").addEventListener("submit", function (e) {
  e.preventDefault(); // This prevents the form from submitting.

  const size = document.getElementById("size").value; // This gets the value of the size select.
  const base = document.getElementById("base").value; // This gets the value of the base select.
  const ingredients = Array.from(document.querySelectorAll('input[name="ingredients"]:checked')).map(i => i.value);

  // This is the alert that pops up if no ingredients are selected.
  if (ingredients.length === 0) {
    alert("Please select at least one ingredient!");
    return; // This prevents the form from submitting.
  }
  
  // This creates a new Smoothie object.
  const smoothie = new Smoothie(size, ingredients, base);

  // This determines the images to show.
  const smoothieImage = document.getElementById("smoothieImage");

  // If there is only one ingredient, it shows the image of the ingredient.
  if (ingredients.length === 1) {
    smoothieImage.src = `images/${ingredients[0]}.webp`; // Used webp because it is the best for our case and with consistency makes the code less redundant.
  } else { // If there are multiple ingredients, it shows the mixed image.
    smoothieImage.src = "images/mixed.webp";
  }

  smoothieImage.style.display = "none"; // Hide the image before animation.

  // *THIS PART IS MADE BY CHATGPT*
  // Show animation
  const prep = document.getElementById("prepAnimation");
  const result = document.getElementById("result");
  prep.style.display = "block";
  result.innerText = ""; // Clear result during animation

  let steps = ["🥭", "🍌", "🫐", "🌀", "🥤"];
  let index = 0;

  prep.innerText = "Preparing your smoothie ";

  let animation = setInterval(() => {
    prep.innerText += steps[index];
    index++;
    if (index === steps.length) {
      clearInterval(animation);
      setTimeout(() => {
        prep.style.display = "none";
        result.innerText = smoothie.describe();
        // Shows the images as soon as the animation is done.
        smoothieImage.style.display = "block"; // *This line of code is made by me*
      }, 500); // Brief pause before showing result
    }
  }, 300); // Emoji every 300ms
});

// *CITATION ENDS HERE*

// This is the function to update the preview.
function updatePreview() {
  const size = document.getElementById("size").value;
  const base = document.getElementById("base").value;
  const ingredients = Array.from(document.querySelectorAll('input[name="ingredients"]:checked')).map(i => i.value);

  const smoothie = new Smoothie(size, ingredients, base);
  document.getElementById("preview").innerText = `Estimated price: $${smoothie.getTotalPrice()} | Calories: ${smoothie.getTotalCalories()} kcal`;
}

// Attach change event listeners to form elements
document.getElementById("size").addEventListener("change", updatePreview);
document.getElementById("base").addEventListener("change", updatePreview);
document.querySelectorAll('input[name="ingredients"]').forEach(checkbox => {
  checkbox.addEventListener("change", updatePreview);
});

// This is the Smoothie class.

class Smoothie {
  constructor(size, ingredients, base) { // This is the constructor for the Smoothie class.
    this.size = size; // This sets the size of the smoothie.
    this.ingredients = ingredients; // This sets the ingredients of the smoothie.
    this.base = base; // This sets the base of the smoothie.
  }

  // Static pricing data.

  static sizePrices = {
    small: 3.00,
    medium: 4.50,
    large: 6.00,
    "super duper large": 10.00
  };

  static ingredientPrices = {
    banana: 0.50,
    strawberry: 0.75,
    mango: 0.80,
    blueberry: 0.70,
    pineapple: 0.90,
    kiwi: 0.60,
    peach: 0.70,
    raspberry: 0.80
  };

  static basePrices = {
    milk: 0.50,
    "almond milk": 0.75,
    water: 0,
    yogurt: 1.00,
    coffee: 1.00,
    tea: 0.50,
    "coconut milk": 1.00,
    "cashew milk": 1.00,
    "rice milk": 1.00,
    "oat milk": 1.00
  };
  
  // Static calorie data.

  getSizeMultiplier() { // This is the method to get the size multiplier.
     switch (this.size) {
      case "medium": return 1.5;
      case "large": return 2;
      case "super duper large": return 3;
      default: return 1; // small
    }
  }
    
  static ingredientCalories = {
    banana: 90,
    strawberry: 30,
    mango: 60,
    blueberry: 40,
    pineapple: 50,
    kiwi: 42,
    peach: 40,
    raspberry: 30
  };
  
  static baseCalories = {
    milk: 80,
    "almond milk": 30,
    water: 0,
    yogurt: 100,
    coffee: 5,
    tea: 2,
   "coconut milk": 75,
    "cashew milk": 70,
    "rice milk": 60,
    "oat milk": 90
  };

  // This is the method to get the total price of the smoothie.
  getTotalPrice() {
    const sizeCost = Smoothie.sizePrices[this.size] || 0; // Price of the size. 0 by default.
    const baseCost = Smoothie.basePrices[this.base] || 0; // Price of the base. 0 by default.
    const ingredientsCost = this.ingredients.reduce((total, item) => { // Calculates the total price of the ingredients.
      return total + (Smoothie.ingredientPrices[item] || 0); // Price of the ingredients. 0 by default.
    }, 0); // 0 is the initial value of the total.

    return (sizeCost + baseCost + ingredientsCost).toFixed(2); // Returns the total price of the smoothie.
  }

  getTotalCalories() { // This is the method to get the total calories of the smoothie.
    const baseCals = Smoothie.baseCalories[this.base] || 0; // Calories of the base. 0 by default.
    const ingredientsCals = this.ingredients.reduce((total, item) => { // Calculates the total calories of the ingredients.
      return total + (Smoothie.ingredientCalories[item] || 0); // Calories of the ingredients. 0 by default.
    }, 0); // 0 is the initial value of the total.

    const totalCals = baseCals + ingredientsCals; // Total calories of the smoothie.
    return Math.round(totalCals * this.getSizeMultiplier()); // Returns the total calories of the smoothie.
  }
  
  describe() {
    return `You ordered a ${this.size} smoothie with ${this.ingredients.join(", ")}, using ${this.base} as the base. 
    Total price: $${this.getTotalPrice()} 
    Estimated calories: ${this.getTotalCalories()} kcal`;
  }
}