import axios from 'axios';
export default class Recipe {
constructor(id){
    this.id = id;
}
async getRecipe(){
    try{
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img - res.data.recipe.image_url;
        this.url - res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;
        
       // console.log(res);
    }
    catch(error){
        console.log(error);
        alert('Something went wrong :(');
    }
}
calcTime(){
    //Assuming that we need 15 min fpr each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng/3);
    this.time = periods *15;
}
calcServings(){
    this.servings  = 4;

}
parseIngredients(){
    const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoon','cups','pounds'];
    const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
    const units = [...unitsShort,'kg','g'];
    const newIngredients = this.ingredients.map(el=>{
        //1.)uniform units
        let ingredient = el.toLowerCase();
        unitsLong.forEach((unit,i) => {
            ingredient = ingredient.replace(unit,unitsShort[i]);
        });
        //2.)Remove paranthesis
           ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');


        //3.)parse ingredients into count,unit and ingredient
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 =>units.includes(el2));
       
       let objIng;
        if(unitIndex > -1){
            //there is a unit
            // eg 4 cups, arrCount is [4];
            const arrCount = arrIng.slice(0,unitIndex);//eg 4 1/2 cups ,arr count is [4, 1/2]
           let count;
            if(arrCount.length === 1)
            count = eval(arrIng[0].replace('-','+'));
            else {
                count = eval(arrIng.slice(0,unitIndex).join('+'));

            }
            objIng = {
                count,
                unit : arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex+1).join(' ')
            };
        }
        else if(parseInt(arrIng[0],10)){
                //there is no unit but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                 }
        }
        else if(unitIndex === -1)
        {
                //there is no unit
                objIng ={
                    count: 1,
                    unit : '',
                    ingredient
                }
        }



        return objIng;



    });
    this.ingredients = newIngredients;
}
}