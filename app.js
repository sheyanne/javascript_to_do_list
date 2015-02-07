var itemTemplate = $('#templates .item')
var list         = $('#list')

var addItemToPage = function(itemData) {
  var item = itemTemplate.clone()
  item.attr('data-id',itemData.id)
  item.find('.description').text(itemData.description)
  if(itemData.completed) {
    item.addClass('completed')
  }
  list.append(item)
}

var loadRequest = $.ajax({
  type: 'GET',
  url: "https://listalous.herokuapp.com/lists/sheyanne/"
})

loadRequest.done(function(dataFromServer) {
  var itemsData = dataFromServer.items
  itemsData.sort(function(a,b){
		var newAdate = new Date(a.updated_at).getTime()
		var newBdate = new Date(b.updated_at).getTime()
		return newBdate - newAdate
	})
  itemsData.forEach(function(itemData) {
    addItemToPage(itemData)
  })
})

$('#add-form').on('submit', function(event) {
  event.preventDefault()
  itemDescription = event.target.itemDescription.value
  var creationRequest = $.ajax({
     type: 'POST',
     url: "https://listalous.herokuapp.com/lists/sheyanne/items",
     data: { description: itemDescription, completed: false }
   })

  creationRequest.done(function(itemDataFromServer) {
		$('#create').val('')
    addItemToPage(itemDataFromServer)
  })
})

$('#list').on('click', '.complete-button', function(event) {
  var item = $(event.target).parent()
  isItemCompleted = item.hasClass('completed')
  var itemId = item.attr('data-id')
	var updateRequest = $.ajax({
	  type: 'PUT',
	  url: "https://listalous.herokuapp.com/lists/sheyanne/items/" + itemId,
	  data: { completed: !isItemCompleted }
	})
	updateRequest.done(function(itemData) {
	  if (itemData.completed) {
	    item.addClass('completed')
	  } else {
	    item.removeClass('completed')
	  }
	})
})

$('#list').on('click', '.delete-button', function(event) {
  var item = $(event.target).parent()
  var itemId = item.attr('data-id')
	var deleteRequest = $.ajax({
	  type: 'DELETE',
	  url: "https://listalous.herokuapp.com/lists/sheyanne/items/" + itemId,
	})
	deleteRequest.done(function(itemData) {
		//alert('Item ' + itemId + 'deleted')
		item.remove()
	})
})

$('#list').on('keypress', '.description', function(event) {
	if (event.which === 13) {
		event.preventDefault()
  	var item = $(event.target).parent()
  	var itemId = item.attr('data-id')
		var description = item.find('.description').html()
		var updateRequest = $.ajax({
		  type: 'PUT',
		  url: "https://listalous.herokuapp.com/lists/sheyanne/items/" + itemId,
		  data: { description: description }
		})
		updateRequest.done(function(itemData) {
			item.find('.description').blur()
		})
	} 
}) 

