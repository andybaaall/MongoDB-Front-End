let serverURL;
let serverPort;

$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    getProductsData();
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});

getProductsData = () => {
    $.ajax({
        url: `${serverURL}:${serverPort}/allProducts`,
        type: 'GET',
        dataType: 'json',
        success:function(data){
            for (var i = 0; i < data.length; i++) {
                $('#productList').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${data[i].name}
                        <div>
                            <button class="btn btn-info">Edit</button>
                            <button class="btn btn-danger">Remove</button>
                        </div>
                    </li>
                `);
            }
        },
        error: function(err){
            console.log(err);
            console.log('something went wrong');
        }
    })
}

$('#addProductButton').click(function(){
    event.preventDefault();
    let productName = $('#productName').val();
    let productPrice = $('#productPrice').val();
    if(productName.length === 0){
        console.log('please enter a products name');
    } else if(productPrice.length === 0){
        console.log('please enter a products price');
    } else {
        console.log(`${productName} costs $${productPrice}`);
        $.ajax({
            url: `${serverURL}:${serverPort}/product`,
            type: 'POST',
            data: {
                name: productName,
                price: productPrice
            },
            success:function(result){
                $('#productName').val(null);
                $('#productPrice').val(null);
                $('#productList').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${result.name}
                        <div>
                            <button class="btn btn-info editBtn">Edit</button>
                            <button class="btn btn-danger">Remove</button>
                        </div>
                    </li>
                `);
            },
            error: function(error){
                console.log(error);
                console.log('something went wrong with sending the data');
            }
        })
    }
})
