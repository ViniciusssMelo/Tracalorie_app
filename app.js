// Storage Controller

// Item Controller
const ItemCtrl = (function (){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;  
  }

  // Data Structure / State
  const data = {
    items: [
    //   {id: 0, name: 'Steack Dinner', calories: 1200},
    //   {id: 1, name: 'Cookie', calories: 400},
    //   {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }



  // Public methods  
  return {
    getItems: function(){
      return data.items;
    },
    getCurrentItem: function(){
        return data.currentItem;
    },
    setCurrentItem: function(item){
      data.currentItem =  item;
    },
    getItemById: function(id){
      let found = null;
      
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;  
      }});

      return found;
    },
    addItem: function(name, calories){
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create a new item
      const newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
 
    },
    getTotalCalories: function(){
      let totalCalories = 0;

      // Loop through items and add cals
      data.items.forEach(function(item){
        totalCalories += item.calories;  
      })

      // Set Total cal in data structure
      data.totalCalories = totalCalories;

      return data.totalCalories;
    },
    logData: function(){
      return data;
    }  
  }

})();



// UI Controller
const UICtrl = (function (){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    backBtn: '.back-btn',
    editBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }  

  // Public methods    
  return {
    populateItemList: function(items){
      let html = '';

      debugger;
      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name} </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

    // Insert List Items
    document.querySelector(UISelectors.itemList).innerHTML = html;
    
  },
  addListItem: function(item){
    // Show the list
    document.querySelector(UISelectors.itemList).style.display = 'block';
    // Create li element
    const li = document.createElement('li');
    // Add class
    li.className = 'collection-item';
    // Add ID
    li.id = `item-${item.id}`;
    // Add HTML
    li.innerHTML = `<strong>${item.name} </strong> <em>${item.calories} Calories</em>
    <a href="#" class="secondary-content">
      <i class="edit-item fa fa-pencil"></i>
    </a>`;
    // Insert item
    document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    
  },
  getItemInput: function(){
    return {
      name: document.querySelector(UISelectors.itemNameInput).value,
      calories: document.querySelector(UISelectors.itemCaloriesInput).value
    }  
  },
  addItemToForm: function(){
    document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
    document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

    UICtrl.showEditState();
  },
  clearInput: function(){
    document.querySelector(UISelectors.itemNameInput).value = '';
    document.querySelector(UISelectors.itemCaloriesInput).value = '';
  },
  getSelectors: function(){
    return UISelectors;  
  },
  hideList: function(){
    document.querySelector(UISelectors.itemList).style.display = 'none';
  },
  showTotalCalories: function(totalCalories){
    document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
  },
  clearState: function(){
    UICtrl.clearInput();
    document.querySelector(UISelectors.backBtn).style.display = 'none';
    document.querySelector(UISelectors.deleteBtn).style.display = 'none';
    document.querySelector(UISelectors.editBtn).style.display = 'none';
    document.querySelector(UISelectors.addBtn).style.display = 'inline';
  },
  showEditState: function(){
    document.querySelector(UISelectors.backBtn).style.display = 'inline';
    document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
    document.querySelector(UISelectors.editBtn).style.display = 'inline';
    document.querySelector(UISelectors.addBtn).style.display = 'none';    
  }

}

})();



// App Controller
const App = (function (ItemCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI Selectors  
    const UISelectors = UICtrl.getSelectors();

   // Add item event
   document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

   // Edit icon click event
   document.querySelector(UISelectors.itemList).addEventListener('click',itemEditSubmit);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add Item  
      const newItem = ItemCtrl.addItem(input.name,input.calories);
      
      // Add item to the UI List
      UICtrl.addListItem(newItem);

      // Add total calories;
      const totalCalories =  ItemCtrl.getTotalCalories();

      // Show total calories;
      UICtrl.showTotalCalories(totalCalories);

      // Clear Input
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

    // Update item submit
    const itemEditSubmit = function(e){
      if(e.target.classList.contains('edit-item')){
        // Get list item id (item-0, item-1)
        const listId = e.target.parentNode.parentNode.id;

        // Break into an array
        const listIdArr = listId.split('-');

        // Get the actual id
        const id = parseInt(listIdArr[1]);

        // Get item
        const itemToEdit = ItemCtrl.getItemById(id);

        // set Current Item
        ItemCtrl.setCurrentItem(itemToEdit);

        // Add Current Item
        UICtrl.addItemToForm();

      }
    }

  // Public methods  
  return {
    init: function(){
      // Clear edit state / set initial set
      UICtrl.clearState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      
      if(items.length === 0){
        UICtrl.hideList();   
      } else {
       // Populate list with items
       UICtrl.populateItemList(items);
      }

      // Add total calories;
      const totalCalories =  ItemCtrl.getTotalCalories();

      // Show total calories;
      UICtrl.showTotalCalories(totalCalories);

      // Load event Listeners
      loadEventListeners();
    }

  }

})(ItemCtrl,UICtrl);

//Initialize App
App.init();