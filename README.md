# Meal Planner

An AI meal planner (command-line based) based on: https://newdaysai.notion.site/LangChain-LangSmith-and-LangGraph-Integration-Project-1d0931bb9a6c8045a69bc5e7973c2bb1 

## Prerequisites

- Node.js (use latest version)
- npm (use latest version)
- OpenAI API key
- LangSmith API key (optional, for tracing)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory, using sample from `env.example`
4. Run the application
   ```bash
   npm run start
   ```

## Agent System

The application uses a multi-agent system where each agent has a specific role in the meal planning process:

### Recipe Suggester (`recipeSuggester.ts`)
- This will be the main agent
- Suggests recipes based on user preferences and available ingredients
- Considers dietary restrictions and nutritional requirements
- Can provide detailed cooking instructions
- Helps in meal variety and planning

### Dietary Advisor (`dietaryAdvisor.ts`)
- Provides nutritional guidance and accommodates dietary restrictions
- Considers user's health requirements and food preferences
- Can request help from other agents for comprehensive advice
- Focuses on making healthy and suitable food recommendations

### Food Inventory (`foodInventory.ts`)
- Tracks available ingredients defined in `food_inventory.csv` (read only, does not have access to modify this csv)
- Provides information about current food stock
- Helps in meal planning by considering existing ingredients
- Can suggest recipes based on available ingredients

### Grocery List Builder (`groceryListBuilder.ts`)
- Creates shopping lists based on meal plans
- Considers existing inventory when suggesting items to buy
- Organizes ingredients by category or store section
- Helps in efficient grocery shopping

## Sample Chats
```
felixgunawan@Felixs-MacBook-Pro newdays % npm run start

> start
> npx tsc; node --no-deprecation dist/index.js


You (or "exit" to quit): I want to eat something italian, can you recommend me something simple?
recipeSuggester: A simple and classic Italian dish you might enjoy is Spaghetti Aglio e Olio. It's an easy recipe that requires just a few ingredients: spaghetti, garlic, olive oil, red pepper flakes, and parsley. The simplicity of this dish allows the flavors to really shine and it's quick to prepare, making it perfect for a delicious meal without much hassle.

Would you like more specifics on the recipe or help with ingredients?

You (or "exit" to quit): Yes please, create the recipe with detailed measurements
recipeSuggester: Here's a detailed recipe for Spaghetti Aglio e Olio:

**Ingredients:**
- 400g (14 oz) of spaghetti
- 6 large cloves of garlic, thinly sliced
- 120ml (1/2 cup) of extra virgin olive oil
- 1 teaspoon of red pepper flakes (adjust to taste)
- Salt, to taste
- Freshly ground black pepper, to taste
- A handful of fresh parsley, chopped
- Grated Parmesan cheese (optional)

**Instructions:**
1. **Cook the Pasta:** Bring a large pot of salted water to a boil. Add the spaghetti and cook according to package directions until al dente. Reserve about 1 cup of the pasta water, then drain the pasta.

2. **Prepare the Garlic:** While the pasta is cooking, heat the olive oil in a large pan over medium heat. Add the sliced garlic and red pepper flakes to the oil, stirring frequently. Cook until the garlic is golden brown and fragrant, being careful not to let it burn.

3. **Combine:** Add the cooked spaghetti to the pan along with about 1/2 cup of the reserved pasta water. Toss the spaghetti until well coated in the oil and garlic sauce. If the pasta seems dry, add more pasta water a small splash at a time.

4. **Season:** Season with salt and freshly ground black pepper to taste. Stir in chopped parsley.

5. **Serve:** Serve hot with grated Parmesan cheese if desired.

This dish is light yet flavorful, and perfect for a quick meal. Enjoy your cooking!

You (or "exit" to quit): Do I have all the available ingredients in my inventory or do i need to go shopping first?
foodInventory: Based on your current inventory, you have all the necessary ingredients for Spaghetti Aglio e Olio:
- Spaghetti: 500g available
- Garlic: 100g available
- Olive Oil: 500ml available (for the recipe, you need only 120ml)
- Salt and Black Pepper: Both available

You don't have fresh parsley or red pepper flakes, but those can be optional or substituted if needed, and Parmesan cheese is listed as optional as well. 

You're all set to prepare this dish with what's currently in your pantry! 

If you want to ensure having parsley and red pepper flakes, a quick trip to the store will be needed. Otherwise, you can enjoy the meal without them.

You (or "exit" to quit): exit
```