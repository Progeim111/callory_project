// Storage Controller
// create later

// Item Controller
const ItemCtrl = (function (){
    // Item Constructor
    const Item = function (id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

    // Data Structure
    const data = {
        items: [
            //{id: 0, name: 'Steak Dinner', calories: 1200},
            //{id: 1, name: 'Cookie', calories: 400},
            //{id: 2, name: 'Eggs', calories: 300}
        ],
        total: 0
    }
    return {
        getItems: function (){
            return data.items
        },
        addItem: function(name, calories) {
            let ID;
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }
            calories = parseInt(calories);
            // create item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem)

            // return
            console.log(newItem)
            return newItem
        },
        getTotalCalories: function(){
            let total = 0
            data.items.forEach(function(item){
                total = total + item.calories
                console.log(total)
            })
            data.total = total
            console.log(data.total)
            return data.total
        },
        logData: function (){
            return data
        }
    }
})();


// UI Controller
const UICtrl = (function (){
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn',
        totalCalories: ".total-calories"
    }
    return {
        populateItemList: function (items){
            // create html content
            let html = '';

            // parse data and create list items html
            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                         <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                         <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                         </a>
                         </li>`;
            });
            // insert-list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function (){
            return UISelectors;
        },
        getItemInput: function (){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            const li= document.createElement("li")
            li.className = "collection-item"
            li.id = `item-${item.id}`
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em> <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        }
        }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl){
    const loadEventListeners = function () {
        // UI Selector setup
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).
        addEventListener('click', itemAddSubmit);
    }
    // Item add
    const itemAddSubmit = function(event) {
        const input = UICtrl.getItemInput()
        // prevent null being added to list
        if(input.name !== '' && input.calories !== '') {
            const newitem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newitem)
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            // clear fields
            UICtrl.clearInput();
        }
       event.preventDefault()
   }
    return {
        init: function () {
            console.log('Initialization...')
            const items = ItemCtrl.getItems()

            UICtrl.populateItemList(items)

            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

App.init()
