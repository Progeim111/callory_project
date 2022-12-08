const StorageCtrl = (function(){
    return{
        storeItem:function(item){
            let items
            if(localStorage.getItem("items") === null){
                items = []
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem("items"))
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            }
        },
        getItemsFromLS:function() {
            let items
            if (localStorage.getItem("items") === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem("items"))
            }
            return items
        },
            updateItemInStorage: function (updatedItem) {
                let items
                if (localStorage.getItem('items') === null) {
                    items = []
                } else {
                    items = JSON.parse(localStorage.getItem('items'))
                }
                items.forEach(function (itemFromStorage, index) {
                    if (itemFromStorage.id === updatedItem.id) {
                        items.splice(index, 1, updatedItem)
                    }
                })
                localStorage.setItem('items', JSON.stringify(items))
            }
    }
})();
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
        ],
        total: 0,
        currenItem: 0
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
            const newItem = new Item(ID, name, calories);
            data.items.push(newItem)
            // return
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
        },

        getItem: function (id) {
        let found = null
        data.items.forEach(function (item) {
            if(item.id === id){
                found = item
            }
        })
        return found
    },
    setCurrentItem: function (item){
        data.currentItem = item
    },
    getCurrentItem: function (){
        return data.currentItem
    },
    updateItem: function (name, calories) {
        let updated = null
        data.items.forEach(function (item) {
            if (item.id === data.currentItem.id) {
                item.name = name
                item.calories = parseInt(calories)
                updated = item
            }
        })
        return updated
    }

}
})();
// UI Controller
const UICtrl = (function (){
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#item-name',
        listOfItems: '#item-list li',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn',
        editbtn: '.edit-btn',
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
                         </li>`
            })
            // insert-list items




            document.querySelector(UISelectors.itemList).innerHTML = html
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
            const li = document.createElement('li')
            li.id = `item-${item.id}`
            li.className = 'collection-item'
            let html = `<strong>${item.name}</strong>
                            <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`
            li.innerHTML = html
            document.querySelector('ul').insertAdjacentElement('beforeend', li)
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = ""
            document.querySelector(UISelectors.itemCaloriesInput).value = ""
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        showEditState: function () {
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.editbtn).style.display = 'inline'
        },
        clearEditState: function () {
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
            document.querySelector(UISelectors.editbtn).style.display = 'none'
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState()
        },
        updateItem: function (item) {
            let listOfItems = document.querySelectorAll(UISelectors.listOfItems)
            listOfItems.forEach(function (listItem) {
                let listItemId = listItem.getAttribute('id')
                if (listItemId === `item-${item.id}`) {
                    document.querySelector(`#item-${item.id}`).innerHTML = `<strong>${item.name}</strong>
                            <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`
                }
            })




        }

    }
})();



// App Controller
const App = (function (ItemCtrl,StorageCtrl, UICtrl){
    const loadEventListeners = function () {
        // UI Selector setup
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn).
        addEventListener('click', itemAddSubmit);
        document.addEventListener("DOMContentLoaded", getItemsFromLS)
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditSubmit)
        document.querySelector(UISelectors.editbtn).addEventListener('click', itemUpdateSubmit)
    }




    // Item add
    const itemAddSubmit = function (event){
        console.log('data is submited')
        const userInput = UICtrl.getItemInput()
        console.log(userInput)
        if(userInput.name !== '' && userInput.calories !== ''){
            const newItem = ItemCtrl.addItem(userInput.name, userInput.calories)
            UICtrl.addListItem(newItem)
            StorageCtrl.storeItem(newItem)
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            UICtrl.clearInput()
            event.preventDefault()

        }
    }

    const getItemsFromLS = function(){
        const items = StorageCtrl.getItemsFromLS()
        items.forEach(function(item){
            ItemCtrl.addItem(item.name, item.calories)
        })
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.populateItemList(items)
    }


    const itemEditSubmit = function (event) {
        if(event.target.classList.contains('edit-item')){
            const listID = event.target.parentNode.parentNode.id
            const listIDArray = listID.split('-')
            const id = parseInt(listIDArray[1])
            const itemToEdit = ItemCtrl.getItem(id)
            ItemCtrl.setCurrentItem(itemToEdit)
            UICtrl.addItemToForm()
        }
    }

    const itemUpdateSubmit = function () {
        const input = UICtrl.getItemInput()
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        UICtrl.updateItem(updatedItem)
        StorageCtrl.updateItemInStorage(updatedItem)
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.clearInput()
        UICtrl.clearEditState()
        event.preventDefault()
    }



    return {
        init: function () {
            loadEventListeners();
        }
    }
})(ItemCtrl,StorageCtrl, UICtrl);

App.init()