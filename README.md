# Meal Planner

An AI-based meal planner based on this: https://newdaysai.notion.site/LangChain-LangSmith-and-LangGraph-Integration-Project-1d0931bb9a6c8045a69bc5e7973c2bb1

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
3. Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   LANGSMITH_API_KEY=your_langsmith_api_key
   LANGSMITH_PROJECT=your_project_name
   LANGSMITH_ENDPOINT=https://api.smith.langchain.com
   LANGSMITH_TRACING=true
   ```
4. Run the application
   ```bash
   npx tsc
   node dist/index.js
   ```

## Agent System

The application uses a multi-agent system where each agent has a specific role in the meal planning process:

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

### Recipe Suggester (`recipeSuggester.ts`)
- Suggests recipes based on user preferences and available ingredients
- Considers dietary restrictions and nutritional requirements
- Can provide detailed cooking instructions
- Helps in meal variety and planning