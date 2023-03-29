# Dog Breed Boolean Search Single Page Application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Step 1

Look in public directory for architecture of platform.

### How to use the application (Step 2)

1.) You can start the application via running npm start in the project directory.
2.) The application is hosted on a single page "(/)", and the search input should
show up.
3.) Enter keywords and fields to what you are looking for a certain dog breeds,
results should show up after you submit your keywords and fields
4.) Once the results show, you can click on each card to learn other details about
the resulting dog breeds.

### Tests I wrote to ensure the filtering was working properly.

Test 1: Keyword 1: Canada  Field: All Fields
Results: Labrador Retriever, Newfoundland

Test 2: Keyword 1: China Field: Country of Origin
Results: Chinese Crested, Pekingese, Pug, Pug, Shar Pei, Shih Tzu

Test 3: Keyword 1: China Field: Fur Color
Results: None

Test 4: Keyword 1: China Field: Height (in)
Results: None

Test 5: Keyword 1: 6 Field: Height (in)
Results: Chihuahua, Dachshung, Pekingese, Pomeranian

Test 6: All Fields: China AND All Fields: England
Results: None

Test 7: All Fields: China OR All Fields: England
Results: 30 Dog Breeds (24 England + 6 China)

Test 8: Country of Origin: China OR All Fields: France
Results: 16 Dog Breeds (10 France + 6 China)

Test 9: Country of Origin: China AND All Fields: France
Results: None

Test 10: Country of Origin: China AND Fur Color: Red
Results: Pekingese

Test 11: Country of Origin: China OR Fur Color: Red
Results: 53 Dog Breeds

Test 12: Country of Origin: China OR Country of Origin: France
Results: 16 Dog Breeds (10 France + 6 China)

Test 13: Height(in): 6 AND Height(in): 8
Results: Chihuahua, Daschund, Pekingese

Test 14: Height(in): 6 OR Height(in): 8
Results: 9 Dog Breeds




