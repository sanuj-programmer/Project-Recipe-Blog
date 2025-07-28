require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
    try {
      const limitNumber = 5;
      const categories = await Category.find({}).limit(limitNumber);
      const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
      const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
      const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
      const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
  
      const food = { latest, thai, american, chinese };
  
      res.render('index', { title: 'Cooking Blog - Home', categories, food } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occurred" });
    }
  }


/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
    try {
      const limitNumber = 20;
      const categories = await Category.find({}).limit(limitNumber);
      res.render('categories', { title: 'Cooking Blog - Categories', categories } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occurred" });
    }
  } 
  


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 20;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  } 
   



/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
    try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  }




/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'Cooking Blog - Search', recipe } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  }
  



/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  } 

/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  } 
  
  
/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }



/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }
  
  /**
   * POST /submit-recipe
   * Submit Recipe
  */
  exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.status(500).send(err);
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
      
      await newRecipe.save();
  
      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/submit-recipe');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-recipe');
    }
  }





















// async function insertDymmyCategoryData(){

//     try{
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image":"thai-food.jpg"
//             },
//             {
//                 "name":"American",
//                 "image":"american-food.jpg"
//             },
//             {
//                 "name":"Chinese",
//                 "image":"chinese-food.jpg"
//             },
//             {
//                 "name":"Mexican",
//                 "image":"mexican-food.jpg"
//             },
//             {
//                 "name":"Indian",
//                 "image":"indian-food.jpg"
//             },
//             {
//                 "name":"Spanish",
//                 "image":"spanish-food.jpg"
//             },
//         ]);
//     }catch(error){
//         console.log('err',+error);
//     }
// }

// insertDymmyCategoryData();



// async function insertDymmyRecipeData(){
//     try{
//         await Recipe.insertMany([
//             {
//                 "name": "Southern fried chicken",
//                 "description": `1)To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.
//                 2)Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours.
//                 3)After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.
//                 4)When you are ready to cook, preheat the oven to 190°C/375°F/gas 5.
//                 5)Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.
//                 6)Meanwhile, make the pickle,  toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage. Place in the fridge, remembering to stir every now and then while you cook your chicken.
//                 7)In a large bowl, mix the flour with the baking powder, cayenne, paprika and the onion and garlic powders.
//                 8)Just under half fill a large sturdy pan with oil, the oil should be 8cm deep, but never fill your pan more than half full , and place on a medium to high heat. Use a thermometer to tell when it is ready (180°C), or add a piece of potato and wait until it turns golden , that is a sign it is ready to go.
//                 9)Take the chicken out of the fridge, then, one or two pieces at a time, remove from the buttermilk and dunk into the bowl of flour until well coated. Give them a shake, then place on a large board and repeat with the remaining chicken pieces.
//                 10)Turn the oven down to 170°C/325°F/gas 3 and move the sweet potatoes to the bottom shelf.
//                 11)Once the oil is hot enough, start with 2 thighs, quickly dunk them back into the flour, then carefully lower into the hot oil using a slotted spoon. Fry for 5 minutes, turning halfway, then remove to a wire rack over a baking tray.
//                 12)Bring the temperature of the oil back up, repeat the process with the remaining 2 thighs, then pop the tray into the oven.
//                 13)Fry the 4 drumsticks in one batch, then add them to the rack of thighs in the oven for 30 minutes, or until all the chicken is cooked through.
//                 14)Serve with your baked sweet potatoes, cabbage pickle and some salad leaves.`,
//                 "email": "sanujkumarsingh12@gmail.com",
//                 "ingredients": [
//                     "4 free-range chicken thighs , skin on, bone in",
//                     "4 free-range chicken drumsticks",
//                     "200 ml buttermilk",
//                     "4 sweet potatoes",
//                     "200 g plain flour",
//                     "1 level teaspoon baking powder",
//                     "1 level teaspoon cayenne pepper",
//                     "1 level teaspoon hot smoked paprika",
//                     "1 level teaspoon onion powder",
//                     "1 level teaspoon garlic powder",
//                     "2 litres groundnut oil"
//                 ],
//                 "category": "American", 
//                 "image": "southern-fried-chicken.jpg"
//             },


//             {
//                 "name":"Key lime pie",
//                 "description":`1)Preheat the oven to 175ºC/gas 3. Lightly grease a 22cm metal or glass pie  dish with a little of the butter.
//                 2)For the pie crust, blend the biscuits, sugar and remaining butter in a food processor until the mixture resembles breadcrumbs.
//                 3)Transfer to the pie dish and spread over the bottom and up the sides, firmly pressing down.
//                 4)Bake for 10 minutes, or until lightly browned. Remove from oven and place the dish on a wire rack to cool.
//                 5)For the filling, whisk the egg yolks in a bowl. Gradually whisk in the condensed milk until smooth.
//                 6)For the filling, whisk the egg yolks in a bowl. Gradually whisk in the condensed milk until smooth.
//                 7)Return to the oven for 15 minutes, then place on a wire rack to cool.
//                 8)Once cooled, refrigerate for 6 hours or overnight.
//                 9)To serve, whip the cream until it just holds stiff peaks. Add dollops of cream to the top of the pie, and grate over some lime zest, for extra zing if you like.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["4 large free-range egg yolks",
//                     "400 ml condensed milk",
//                     "5 limes",
//                     "200 ml double cream",
//                     "135 g unsalted butter",
//                     "12 digestive biscuits",
//                     "45 g caster sugar"],
//                     "category":"American",
//                     "image":"key-lime-pie.jpg"
//             },

//             {
//                 "name":"Cracking Cobb salad",
//                 "description":`1)Preheat the oven to 180ºC/350ºF/gas 4.
//                 2)Place the chicken thighs into a small roasting tray. Sprinkle over the paprika, and a good pinch of sea salt and black pepper, then drizzle over a little olive oil and toss to coat.
//                 3)Roast for 35 to 40 minutes, or until golden and cooked through, laying over the pancetta for the final 10 minutes. Leave to cool slightly.
//                 4)Lower the eggs into a pan of vigorously simmering water and boil for 5½ minutes for soft-boiled, or to your liking, then refresh under cold water until cool enough to handle, and peel.
//                 5)Crumble the Stilton into a large jug. Finely chop and add the chives, along with a drizzle of extra virgin olive oil. Squeeze in the lemon juice and add the remaining dressing ingredients. Whisk well, season to taste with salt and pepper, then pop in the fridge until needed.
//                 6)Remove and discard any tatty outer leaves from the lettuce, then trim and roughly chop the rest.
//                 7)Halve, destone and scoop the avocado flesh onto a board. Roughly chop the tomatoes and peeled eggs, then, using a large knife, bring it all into the centre of the board and start chopping and mixing it together.
//                 8)Shred the chicken meat, discarding the bones and skin, then add to the salad. Crumble over the crispy pancetta and continue chopping and mixing together.
//                 9)Transfer the salad to a nice platter, drizzle over the blue cheese dressing and snip over the cress, then serve.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["2 free-range chicken thighs , skin on, bone in",
//                     "1 large pinch of sweet smoked paprika",
//                     "olive oil",
//                     "4 slices of higher-welfare ",
//                     "2 large free-range eggs",
//                     "1 Romaine, cos or soft round lettuce",
//                     "1 ripe avocado",
//                     "2 ripe tomatoes , or 125g ripe cherry tomatoes",
//                     "1 punnet of salad cress"],
//                 "category":"American",
//                 "image":"cracking-cobb-salad.jpg"
//             },

//             {
//                 "name":"Chicken fajitas",
//                 "description":`1)Put 1 tablespoon of oil into a bowl with the vinegar, chilli sauce, oregano, paprika and a pinch of sea salt and black pepper. Crush in the unpeeled garlic through a garlic crusher and mix together.
//                 2)Peel and halve the onion, slice into 1cm-thick wedges, then slice the chicken lengthways 1cm thick and toss both in the marinade. Leave in the fridge for at least 1 hour, or preferably overnight.
//                 3)Prick the whole aubergine all over with a fork. Blacken the whole peppers and aubergine over a direct flame on the hob, or in a griddle pan on a high heat, until charred and blistered all over.
//                 4)Pop the peppers into a bowl and cover with clingfilm for 10 minutes, then scrape off most of the black skin, discarding the stalks and seeds.
//                 5)Pinch the skin off the aubergine and trim off the ends. Nicely slice it all 2cm thick, dress on a platter with the juice of 1 lime and a few picked coriander leaves, then taste and season to perfection.
//                 6)Cook the chicken and onions in all that lovely marinade in a large non-stick frying pan on a medium-high heat for 6 to 8 minutes, or until cooked through, turning halfway.
//                 7)Peel, destone and finely slice the avocado, and squeeze over the juice of half a lime.
//                 8)Warm the tortillas in a dry frying pan for 30 seconds, then keep warm in a clean tea towel. Take it all to the table, with the feta and the remaining coriander leaves, and let everyone build their own.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["olive oil",
//                     "1 tablespoon red wine vinegar",
//                     "1 teaspoon chipotle Tabasco sauce",
//                     "1 teaspoon dried oregano",
//                     "2 teaspoons sweet smoked paprika",
//                     "2 cloves of garlic",
//                     "1 large red onion",
//                     "2 x 200 g skinless free-range chicken breasts",
//                     "3 mixed-colour peppers",
//                     "1 large aubergine",
//                     "2 limes",
//                     "1 bunch of fresh coriander",
//                     "1 ripe avocado",
//                     "4 large seeded wholemeal tortillas",
//                     "50 g feta cheese",],
//                 "category":"American",
//                 "image":"chicken-fajitas.jpg"
//             },
//             {
//                 "name":"Fried Rice",
//                 "description":`1)Cook the rice according to the packet instructions, then drain and leave to cool. If you spread it across a plate, it will cool more quickly.
//                 2)Now prep the veg ,chop everything into strips or chunks that are about the same size so it will be a pleasure to eat. Chop asparagus spears into 2cm lengths, halve or quarter baby corn, matchstick the carrot, and shred up cabbage , you get the idea.
//                 3)Peel and finely slice the garlic. Peel and finely chop or grate the ginger.
//                 4)Put a large non-stick frying pan or wok on a medium-high heat.
//                 5)Beat the egg. Put 1 teaspoon of olive oil into the hot pan, then pour in the egg, swirling it around the pan to cover the base, essentially like a thin egg pancake. Let it cook through, then ease out of the pan with a spatula, roll it up and finely slice.
//                 6)Put ½ a tablespoon of olive oil into the hot pan. Finely slice the sausage and bacon, then add to the pan. Stir-fry until golden, then go in with the prawns, garlic and ginger.
//                 7)Stir in the curry paste until everything is coated, then start adding your veg, getting stuff that needs a bit longer in there first like carrots and leek. Keep stirring or tossing and adding the veg until it is all in there.
//                 8)Mix in the cool rice and stir-fry until it is hot through and the veg are just cooked.
//                 9)Add the soy, then toss in the egg ribbons.
//                 10)Divide between your plates, sprinkle over the seeds, season to perfection with more soy if you like, and finish with a drizzle of chilli jam. Eat right away , heaven!`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["150 g brown or basmati rice",
//                     "320 g crunchy veg , such as asparagus, baby corn, broccoli, leek, Chinese, red or white cabbage, pak choi, carrot",
//                     "1 clove of garlic",
//                     "2 cm piece of ginger",
//                     "1 large free-range egg",
//                     "olive oil",
//                     "1 chipolata",
//                     "1 rasher of smoked streaky bacon",
//                     "4 fresh or frozen raw peeled prawns",
//                     "1 teaspoon tikka paste",
//                     "1 tablespoon low-salt soy sauce",
//                     "1 teaspoon mixed seeds",
//                     "1 teaspoon chilli jam"],
//                 "category":"Thai",
//                 "image":"fried-rice.jpg"
//             },

//             {
//                 "name":"Veggie pad Thai",
//                 "description":`1)Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.
//                 2)Lightly toast the peanuts in a large non-stick frying pan on a medium heat until golden, then bash in a pestle and mortar until fine, and tip into a bowl.
//                 3)Peel the garlic and bash to a paste with the tofu, add 1 teaspoon of sesame oil, 1 tablespoon of soy, the tamarind paste and chilli sauce, then squeeze and muddle in half the lime juice.
//                 4)Peel and finely slice the shallot, then place in the frying pan over a high heat. Trim, prep and slice the crunchy veg, as necessary, then dry-fry for 4 minutes, or until lightly charred (to bring out a nutty, slightly smoky flavour).
//                 5)Add the noodles, sauce, beansprouts, and a good splash of water, toss together over the heat for 1 minute, then divide between serving bowls.
//                 6)Wipe out the pan, crack in the eggs and cook to your liking in a little olive oil, sprinkling with a pinch of chilli flakes. Trim the lettuce, click apart the leaves and place a few in each bowl.
//                 7)Pop the eggs on top, pick over the herbs, and sprinkle with the nuts. Serve with lime wedges for squeezing over, and extra soy, to taste`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["150 g rice noodles",
//                     "sesame oil",
//                     "20 g unsalted peanuts",
//                     "2 cloves of garlic",
//                     "80 g silken tofu",
//                     "low-salt soy sauce",
//                     "2 teaspoons tamarind paste",
//                     "2 teaspoons sweet chilli sauce",
//                     "2 limes",
//                     "1 shallot",
//                     "320 g crunchy veg , such as asparagus, purple sprouting broccoli, pak choi, baby corn",
//                     "80 g beansprouts",
//                     "2 large free-range eggs",
//                     "olive oil",
//                     "dried chilli flakes",
//                     "½ a cos lettuce",
//                     "½ a mixed bunch of fresh basil, mint and coriander"],
//                 "category":"Thai",
//                 "image":"veggie-pad-thai.jpg"
//             },

//             {
//                 "name":"Thai-style mussels",
//                 "description":`1)Wash the mussels thoroughly, discarding any that are not tightly closed.
//                 2)Trim and finely slice the spring onions, peel and finely slice the garlic. Pick and set aside the coriander leaves, then finely chop the stalks. Cut the lemongrass into 4 pieces, then finely slice the chilli.
//                 3)In a wide saucepan, heat a little groundnut oil and soften the spring onion, garlic, coriander stalks, lemongrass and most of the red chilli for around 5 minutes.
//                 4)Add the coconut milk and fish sauce and bring to the boil, then add the mussels and cover the pan.
//                 5)Steam the mussels for 5 minutes, or until they've all opened and are cooked. Discard any unopened mussels.
//                 6)Finish with a squeeze of lime juice, then sprinkle with coriander leaves and the remaining chilli to serve.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["1 kg mussels","4 spring onions","2 cloves of garlic","½ a bunch of fresh coriander","1 stick of lemongrass","1 fresh red chilli","groundnut oil","1 x 400 ml tin of reduced fat coconut milk","1 tablespoon fish sauce","1 lime"],
//                 "category":"Thai",
//                 "image":"thai-style-mussels.jpg"
//             },

//             {
//                 "name":"Prawn & tofu pad Thai",
//                 "description":`1)Cook the rice noodles according to the packet instructions.
//                 2)Meanwhile, make the tamarind sauce. Coarsely grate the palm sugar into a bowl, add the tamarind paste, 1 tablespoon of fish sauce, a dash of vinegar and 2 tablespoons of boiling water and mix well so the sugar dissolves. Taste, and adjust the flavours if needed , you are looking for sweet, sour and slightly salty.
//                 3)Halve, deseed and finely slice the chillies, then place in a bowl with the juice from 1 lime to make a quick pickle.
//                 4)Drain the noodles and toss in a little oil.
//                 5)Peel and roughly chop the shallots, then trim and finely slice the chives. Pick and roughly chop most of the basil and mint leaves.
//                 6)Slice the tofu into rough 1cm chunks. Run the tip of a knife down the back of each prawn and pull out the vein, meaning they’ll butterfly as they cook. Rinse the dried shrimps under cold running water, then pat dry with kitchen paper.
//                 7)Place a large wok on a medium heat with a splash of oil, then add the dried shrimps, peanuts and chilli flakes. Toss for 2 to 3 minutes, or until golden.
//                 8)Take the pan off the heat, transfer half the mixture to a pestle and mortar and lightly crush, keeping to one side. Return the pan to a medium-high heat with another splash of oil, adding the shallots to the mix. Fry for 2 minutes, or until turning golden.
//                 9)Toss in the prawns, chives, chopped herbs and shredded radish, then cook for a further 2 to 3 minutes, or until the prawns are almost cooked through.
//                 10)Beat and add the egg, cook for 1 to 2 minutes, then fold through and toss in the tofu, noodles, beansprouts and tamarind sauce until well combined.
//                 11)Divide the pad Thai between bowls, sprinkle over the crushed nut mixture from the mortar and pick over the remaining mint and basil leaves. Serve with the quick pickled chillies and lime wedges for squeezing over. Delicious!`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["150 g flat rice noodles","1 fresh bird's-eye chilli","1 fresh yellow chilli","2 limes","groundnut oil","2 red shallots","½ a bunch each of Chinese chives, Thai basil, Thai mint , (45g total)","140 g silken tofu",
//                 " 4 large raw peeled Tiger prawns","25 g dried shrimps","50 g shelled unsalted peanuts","1 pinch of dried chilli flakes","1 tablespoon jarred shredded sweet radish","1 large free-range egg","60 g beansprouts , (ready to eat)"],
//                 "category":"Thai",
//                 "image":"prawn-tofu-pad-thai.jpg"
//             },

//             {
//                 "name":"Mexican-style steak",
//                 "description":`1)Preheat to the oven to 180°C/350°F/gas 4.
//                 2)Take your steak out of the fridge and let it come up to room temperature.
//                 3)For the salsa, pick and reserve a few coriander leaves, then roughly chop the rest (stalks and all). Pick and roughly chop the mint leaves. Peel the garlic, trim the chilli (deseed if you like) and spring onions, then roughly chop, along with the tomato. Mix with the herbs and continue chopping everything together until very fine.
//                 4)Squeeze the lime juice into a serving bowl with a good lug of of extra virgin olive oil and season with sea salt and black pepper. Add the chopped ingredients and toss to coat in the dressing. Set aside until needed.
//                 5)For the peanut sauce, put the nuts and the sesame and cumin seeds in a large dry frying pan over a medium heat. Peel and roughly slice the garlic and add to the pan, along with the thyme and oregano. Tear in the chipotle chilli and toast for a few minutes until lightly golden.
//                 6)Tip into a blender, just cover with water, then add the tequila, the juice of 1 lime, the fresh chilli, and a pinch each of sea salt and black pepper. Whiz until super-smooth, adding a splash more water if needed. Have a taste and adjust with more salt, chilli or lime juice. Set aside until needed.
//                 7)Scrub the potatoes and cut into 1cm-thick slices with a crinkle-cut knife. Pull the fat off the steak (discard the sinew) and finely slice. Place the fat in a cold non-stick frying pan over a medium heat and cook until golden. Add the potatoes and chillies and cook for 7 to 8 minutes on each side, or until golden and crispy. Tip the potatoes onto a plate lined with kitchen paper and keep warm in the preheated oven.
//                 8)Season the steak with salt and pepper, and place into the same pan as you cooked the potatoes, turning every minute until cooked to your liking ,(about 7 minutes for medium rare). Remove from the pan, drizzle with a little oil and leave to rest for a few minutes, then slice 1cm thick.
//                 9)Spread a little peanut sauce over a large serving platter or divide between plates, and place the steak on top.
//                 10)Finish with a few dollops of salsa, a scattering of the reserved coriander, drizzle over any resting juices, then serve up with the crispy potatoes and tuck in.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["1 x 3cm thick sirloin steak , (300g)",
//                     "1 Maris Piper potato , (300g)",
//                     "3 fresh green chillies",
//                     "olive oil",
//                     "½ a bunch of fresh coriander , (15g)",
//                     "½ a bunch of fresh mint , (15g)",
//                     "½ a clove of garlic",
//                     "1 fresh red chilli",
//                     "2 spring onions",
//                     "1 ripe tomato , on the vine",
//                     "1 lime",
//                     "extra virgin olive oil"],
//                 "category":"Mexican",
//                 "image":"mexican-style-steak.jpg"
//             },
            
//             {
//                 "name":"Mexican chicken chilli",
//                 "description":`1)Peel and slice the onions, peel and finely chop the garlic, and pick the coriander leaves and finely chop the stalks. Slice the chicken into 1cm strips.
//                 2)Heat the oil in a pan over a medium heat and, when hot, sauté the onions, garlic, coriander stalks, spices, and whole and flaked chilli for 5 minutes, until the onion is soft but not coloured.
//                 3)Add the chicken strips and cook for a couple of minutes, then add the tinned tomatoes. Bring to the boil, then reduce the heat and simmer, partly covered, for 35 to 40 minutes, or until the chicken breaks apart when pressed with the back of a spoon. Add a splash of water if it looks too dry at any stage.
//                 4)Next, make the salsa. Blister the pepper and chilli skins by placing them under a hot grill or holding them with tongs over a gas flame. Once blackened all over, place in a bowl, cover with clingfilm and set aside to cool.
//                 5)Roughly chop the tomatoes, put them in a colander with a pinch of sea salt and place it in the sink for 15 minutes to allow the salt to draw out some of the tomatoes water, then give the colander a good shake.
//                 6)Peel the skins from the pepper and chilli and discard along with the seeds, then place them on a board with the spring onions and chop.
//                 7)Add the tomatoes and pick over the coriander leaves and continue chopping until you have a fine salsa. Transfer to a bowl, and season with black pepper and a good squeeze of lime juice.
//                 8)Shred the chicken using two forks, then drain and stir the black beans into the chilli. Continue cooking for a couple of minutes until the beans are heated through, then remove from the heat and stir in the coriander leaves.
//                 9)Chop the lettuce, then serve the chilli in the tortillas with the lettuce, a good spoonful of salsa and a drizzle of yoghurt, with lime wedges on the side.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["2 onions","4 cloves of garlic","½ a bunch of fresh coriander","2 free-range chicken breasts","1 tablespoon olive oil","1 teaspoon ground cumin","½ teaspoon ground coriander","1 whole dried chipotle chilli","1 pinch of dried chilli flakes","2 x 400 g tins of chopped tomatoes","1 x 410 g tin of black beans","4-6 flour tortillas","2 gem lettuces"," 0% fat Greek style yoghurt","1 lime"],
//                 "category":"Mexican",
//                 "image":"mexican-chicken-chilli.jpg"
//             },

//             {
//                 "name":"Mexican filled omelette",
//                 "description":`1)Squeeze the avocado flesh into a blender, discarding the stone and skin.
//                 2)Squeeze in all the juice from 2 limes, rip in the coriander stalks, add the yoghurt and a splash of oil and whiz until smooth, then season to perfection.
//                 3)Peel the onion and carrot. Ideally in a food processor, or using a box grater and good knife skills, grate the onion and carrot, then finely slice the cabbage. Very finely slice the chilli by hand, then tip everything into a large bowl.
//                 4)Add most of the coriander leaves, then pour over the avocado dressing and toss together well. Taste and season to perfection again, if needed.
//                 4)Whisk all the eggs together in a bowl, with a splash of water to loosen and a pinch of sea salt and black pepper.
//                 5)Put a large non-stick frying pan on a medium-low heat. Once fairly hot, put in a tiny drizzle of oil followed by a quarter of the egg mixture.
//                 6)Swirl it all around the pan, grate over a quarter of the cheese and let it melt, then cook the omelette gently without colouring it, so it is soft, silky and smooth, for just under 2 minutes, only cooking on one side.
//                 7)Slide it on to a plate, spoon over a quarter of the avocado slaw, then gently fold up the sides and roll over. Serve with a wedge of lime and a few extra coriander leaves.
//                 8)Repeat with the remaining ingredients, serving them up as you go.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["1 ripe avocado","3 limes","½ a bunch of fresh coriander , (15g)","3 tablespoons fat-free natural yoghurt","olive oil","1 small onion","1 carrot","½ white or ","green cabbage","1 fresh red chilli","8 large free-range eggs","60 g Cheddar cheese"],
//                 "category":"Mexican",
//                 "image":"mexican-filled-omelette.jpg"
    
//             },

//             {
//                 "name":"Shrimp & black bean quesadillas",
//                 "description":`1)In a small bowl, toss the prawns with the smoked paprika and a little sea salt and black pepper. Heat a small frying pan with 1 teaspoon of the oil. Sear the prawns for 1 minute each side. Remove, let cool and halve lengthways. Set aside.
//                 2)Grate the cheese and spread half of it over two tortillas. Drain the beans and roughly chop the jalapeños, then sprinkle over, along with the prawns. Finely chop most of the coriander (reserving some leaves to finish), then divide between the tortillas, cover with the remaining cheese and top with the other tortillas.
//                 3)Put two frying pans over a low-medium heat and add 1 teaspoon of oil to each pan. Brown the tortillas on one side for 3 to 4 minutes, until the cheese is melted and golden, taking care not to let them burn. Turn them over and cook for 3 minutes. If the pan is looking a little dry, add another tiny drizzle of vegetable oil.
//                 4)Once the cheese has melted, remove the quesadillas from the pan and cut each one into six triangles. Serve straight away, topped with a dollop of soured cream and salsa, the pickled jalapeños and the remaining coriander leaves.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["200 g large raw prawn","1 tablespoon smoked paprika","vegetable oil","250 g mature cheddar cheese","4 large flour tortillas","1 x 400 g tin of black beans","4 tablespoons pickled jalapeños , plus extra to serve","a few sprigs of fresh coriander","   soured cream and salsa , to serve"],
//                 "category":"Mexican",
//                 "image":"shrimp-black-bean-quesadillas.jpg"
//             },

//             {
//                 "name":"Chinese steak & tofu steak",
//                 "description":`1)Get your prep done first, for smooth cooking. Chop the steak into 1cm chunks, trimming away and discarding any fat.
//                 2)Peel and finely chop the garlic and ginger and slice the chilli. Trim the spring onions, finely slice the top green halves and put aside, then chop the whites into 2cm chunks. Peel the carrots and mooli or radishes, and chop to a similar size.
//                 3)Place a large pan on a medium-high heat and toast the Szechuan peppercorns while it heats up. Tip into a pestle and mortar, leaving the pan on the heat.
//                 4)Place the chopped steak in the pan with 1 tablespoon of groundnut oil. Stir until starting to brown, then add the garlic, ginger, chilli, the white spring onions, carrots and mooli or radishes.
//                 5)Cook for 5 minutes, stirring regularly, then stir in the chilli bean paste for 30 seconds until dark. Pour in the stock and simmer for 10 minutes.
//                 6)Meanwhile, drain the beans, put them into a pan with the rice and a pinch of sea salt, and cover by 1cm with cold water. Place on a high heat, bring to the boil, then simmer until the water level meets the rice. Cover and leave on the lowest heat for 12 minutes, or until cooked through, stirring occasionally.
//                 7)Taste the stew and season to perfection. Mix the cornflour with 2 tablespoons of cold water until combined, then stir into the stew.
//                 8)Trim and stir in the broccoli. Chop the tofu into 2cm chunks and drop them in, then pop a lid on and keep on a low heat for 5 to 8 minutes while the stew thickens up and the broccoli just cooks through.
//                 9)Serve the stew scattered with the sliced green spring onions, with the sticky rice and beans on the side. Finely crush and scatter over some Szechuan pepper. Nice with drips of chilli oil, to taste.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["250g rump or sirloin steak",
//                     "2 cloves of garlic",
//                     "4cm piece of ginger",
//                     "2 fresh red chilli",
//                     "1 bunch of spring onions",
//                     "2 large carrots",
//                     "250g mooli or radishes",
//                     "1 heaped teaspoon Szechuan peppercorns",
//                     "groundnut oil",
//                     "2 tablespoons Chinese chilli bean paste , (find it in Asian supermarkets)",
//                     "1 litre veg stock",
//                     "1 x 400g tin of aduki beans",
//                     "250g pudding or risotto rice",
//                     "1 tablespoon cornflour",
//                     "200g tenderstem broccoli",
//                     "350g firm silken tofu"],
//                 "category":"Chinese",
//                 "image":"chinese-steak-tofu-steak.jpg"
//             },

//             {
//                 "name":"Vegan Chinese-style noodles",
//                 "description":`1)Cook the noodles according to packet instructions, drain well, rinse under cold running water, then set aside.
//                 2)Finely slice or tear the mushrooms, leaving any smaller ones whole. Peel the garlic and deseed the chilli, then finely slice. Peel the ginger and trim the courgettes, then slice both into matchsticks.
//                 3)Pick the coriander leaves and set aside, then finely slice the stalks. Trim and finely slice the spring onions, reserving the green part for later.
//                 4)Heat a good lug of oil in a large wok over a high heat, then add the mushrooms and fry for 3 to 4 minutes, or until slightly softened.
//                 5)Add the chopped garlic, chilli, ginger, courgette, coriander stalks and the white part of the spring onions. Fry for a further 3 minutes, or until softened and lightly golden.
//                 6)Meanwhile, combine the cornflour and 2 tablespoons of water, then mix in the soy, agave syrup, sesame oil and rice wine or sherry. Stir the mixture into the pan and cook for a further 3 minutes, or until thickened.
//                 7)Roughly chop and add the spinach along with the noodles. Toss well to warm through, then tear in most of the coriander leaves.
//                 8)Serve with lime wedges, sambal or chilli sauce and the reserved coriander and spring onions scattered on top.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["200 g thin rice noodles","300 g mixed mushrooms , such as oyster, shitake and enoki, cleaned","2 cloves of garlic","1 fresh red chilli","5 cm piece of ginger","200 g courgettes","½ bunch of fresh coriander","6 spring onions","groundnut oil , or vegetable oil","1 teaspoon cornflour","2 tablespoons low-salt soy sauce","1 tablespoon agave syrup"," 1 teaspoon sesame oil","½ tablespoon rice wine , or dry sherry","100 g baby spinach","2 limes , to serve",],
//                 "category":"Chinese",
//                 "image":"vegan-chinese-style-noodles.jpg"

//             },

//             {
//                 "name":"Sticky Chinese ribs",
//                 "description":`1)Preheat the oven to 160°C/325°F/gas 3.
//                 2)Get yourself three layers of tin foil, 1-metre long. Place the ribs in the centre, drizzle them with oil and rub all over with the five-spice and a good pinch of sea salt and black pepper.
//                 3)Seal into a tight parcel and pop onto a tray in the middle of the oven for 3 hours, or until just tender and cooked through.
//                 4)Meanwhile, for the glaze, peel and slice the onions and put them into a frying pan on a medium heat with a lug of oil and the star anise. Cook for 15 minutes, or until soft and starting to caramelise, stirring occasionally.
//                 5)Stir in the five-spice for 2 minutes, stir in the rest of the glaze ingredients and leave to bubble away for another 2 minutes, then turn off the heat and leave to cool a little.
//                 6)Fish out the star anise, transfer the mixture to a blender and blitz until smooth, loosening with a splash of water, if needed, then pass through a fine sieve so it’s super-super-smooth. Have a taste and season if required.
//                 7)Trim the spring onions and deseed the chillies, then finely slice both lengthways and put them into a bowl of ice-cold water so they curl up. For a laugh you can randomly score the radishes and pop them into the water for a bit of a naff 80s feel; otherwise, leave them whole or cut them into quarters.
//                 8)When the time is up, transfer the ribs to the tray, discarding the foil, and turn the oven up to 200°C/400°F/gas 6.
//                 9)Brush a good layer of glaze over the ribs and return them to the oven for 8 to 10 minutes, then I like to keep brushing on glaze and popping them back into the oven every minute after that for a few more minutes, to build up a really good layer of dark, sticky glaze.
//                 10)Serve the ribs with a bowl of any leftover glaze for dunking, and with the radishes, chillies and spring onions on the side.
//                 11)JAMIE'S TIP: This is definitely an opportunity to have a finger bowl on the side and a tea towel at the ready.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["1 rack of higher-welfare pork belly ribs , trimmed of excess fat (1.5–2kg)","olive oil","3 tablespoons Chinese five-spice","2 spring onions","2 fresh chillies","1 bunch of radishes"],
//                 "category":"Chinese",
//                 "image":"sticky-chinese-ribs.jpg"

//             },

//             {
//                 "name":"Chinese-style stir-fried pork",
//                 "description":`1)Cook the rice in a pan of boiling salted water over a medium heat for 25 minutes, or until tender, then drain well. Tip back into the pan, season with sea salt and black pepper, cover with a lid and keep to one side.
//                 2)Meanwhile, slice the pork fillet into quarters lengthways, then cut each quarter into 3cm chunks. Place in a mixing bowl with the five-spice, a pinch of salt and pepper and 2 teaspoons of oil, then mix well.
//                 3)Trim and slice 3 of the spring onions diagonally into 3cm pieces. Halve, deseed and chop the pepper into 2cm chunks. Peel and finely slice the garlic, and peel and finely chop the ginger.
//                 4)In a small bowl, mix the soy sauce, cornflour and 175ml of water, then put aside.
//                 5)Heat ½ a tablespoon of oil in a frying pan over a medium heat, add the pork and cashews, then stir-fry for 5 to 6 minutes, or until the pork is browned and almost cooked through, stirring continuously. Spoon onto a plate and return the pan to the heat.
//                 6)Turn the heat up to high, drizzle in a little oil, then add the sliced spring onion and pepper. Stir-fry for 2 minutes, then add the garlic and ginger for 1 further minute, or until golden.
//                 7)Add the soy sauce and cornflour mixture, then cook for 2 to 3 minutes, or until thickened, stirring often.
//                 8)Add the pork and nuts back to the pan, cook for another 2 minutes, stirring often.
//                 9)If needed, add a splash of water and scrape up all the sticky bits from the bottom of the pan, then remove from the heat. Season to taste.
//                 10)Divide the rice between your bowls and spoon the Chinese-style pork over the top. Finely slice and scatter over the remaining spring onion and serve with lime wedges for squeezing over.`,
//                 "email":"sanujkumarsingh12@gmail.com",
//                 "ingredients":["160g brown basmati rice","200g higher-welfare pork fillet","1½ teaspoons Chinese five-spice","vegetable oil","4 spring onions","1 yellow pepper","2 cloves of garlic","4 cm piece of ginger","2 tablespoons soy sauce","1 teaspoon cornflour","50g cashew nuts"," 1 lime"],
//                 "category":"Chinese",
//                 "image":"chinese-style-stir-fried-pork.jpg"

//             }

//         ]);
//     }catch(error){
//         console.log('err',error.message);
//     }
// }

// insertDymmyRecipeData();